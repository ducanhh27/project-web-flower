import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import QueryString, * as qs from 'qs';
import moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from 'src/schema/order/orders.schema';
import mongoose, { Model } from 'mongoose';
import { Cart } from 'src/schema/cart/cart.schema';
import { ConfigService } from '@nestjs/config';
import { Order } from '../orders/order.interface';
import { Product } from 'src/schema/products/products.schema';
import { Users } from 'src/schema/users/users.schema';
import { Types } from 'mongoose';

@Injectable()
export class VNPayService {
  private readonly config: {
    vnp_TmnCode: string;
    vnp_HashSecret: string;
    vnp_Url: string;
    vnp_ReturnUrl: string;
  };
  constructor(
    @InjectModel(Orders.name) private readonly orderModel: Model<Orders>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Users.name) private userModel:Model<Users>
  ) {
    this.config = {
      vnp_TmnCode: process.env.VNP_TMNCODE ?? '',
      vnp_HashSecret: process.env.VNP_HASHSECRET ?? '',
      vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      vnp_ReturnUrl: 'http://localhost:3000/vnpay/return',
    };
  }

  async createPayment(orderId: any,amount: number,orderDescription: string,): Promise<string> {
    const date = moment();
    const createDate = date.format('YYYYMMDDHHmmss');
    console.log(this.config.vnp_TmnCode)
    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.config.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: 'other',
      vnp_Amount: Math.round(Number(amount) * 100),
      vnp_ReturnUrl: this.config.vnp_ReturnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    const sortedParams = this.sortObject(vnp_Params);

    // Tạo chữ ký SHA512
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', this.config.vnp_HashSecret);

    const signed = hmac.update(signData).digest('hex');

    sortedParams['vnp_SecureHash'] = signed;

    return `${this.config.vnp_Url}?${qs.stringify(sortedParams, { encode: false })}`;
  }

  private sortObject(obj: any) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      if (obj[key]) {
        sorted[key] = obj[key];
      }
    });
    return sorted;
  }

  async verifyPayment(vnp_Params: any) {
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp object theo key
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = vnp_Params[key];
        return obj;
      }, {} as any);

    // Tạo chuỗi query và mã hóa bằng SHA512
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      try {
        // 🆕 Tạo đơn hàng mới thay vì cập nhật
        const orderId = vnp_Params['vnp_TxnRef']; // Lấy Order ID từ VNPAY
        console.log(`🔹 Tạo đơn hàng mới với Order ID: ${orderId}`);

        // Tìm user ID từ transaction (hoặc truyền từ FE)
        const userId = vnp_Params['vnp_OrderInfo'];

        // Lấy giỏ hàng của user
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
          console.log('🚨 Không tìm thấy giỏ hàng của người dùng',userId);
          return { success: false, message: 'Không tìm thấy giỏ hàng' };
        }

        const detailedItems = await Promise.all(
          cart.items.map(async (item) => {
            const product = await this.productModel.findById(item.productId);
            if (!product) {
              console.log(`🚨 Không tìm thấy sản phẩm ${item.productId}`);
              return null;
            }
            return {
              _id: (product._id as Types.ObjectId).toString(),
              name: product.name,
              price: product.price,
              thumbnail: product.thumbnail,
              categories: product.categories,
              slug:product.slug,
              quantity: item.quantity,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
            };
          })
        );

        // Loại bỏ sản phẩm không tìm thấy
        const filteredItems = detailedItems.filter((item) => item !== null);
        // Tạo đơn hàng mới từ giỏ hàng
        const user = await this.userModel.findById(userId);
        if (!user) {
          console.log('🚨 Không tìm thấy thông tin người dùng',userId);
          return {
            success: false,
            message: 'Không tìm thấy thông tin người dùng',
          };
        }
        const newOrder = await this.orderModel.create({
          _id: orderId, // Dùng ID từ VNPAY
          customerId: userId,
          name: user.name, // Lấy từ bảng User
          phone: user.phone,
          email: user.email,
          address: user.address,
          items: filteredItems,
          priceOders: vnp_Params['vnp_Amount'] / 100, // VNPAY gửi amount * 100
          status: 'Đã thanh toán',
          paymentMethod:"Vnpay",
          deliveryStatus:'Chưa giao hàng'
        });

        console.log('✅ Đơn hàng mới đã được tạo:', newOrder);

        // Cập nhật số lượng bán được và số lượng trong kho
        for (const item of newOrder.items) {
          const product = await this.productModel.findById(item._id);
          if (product) {
            product.sold = (product.sold ?? 0) + item.quantity;
            product.stockQuantity -= item.quantity;
            await product.save();
          }
        }

        // Xóa giỏ hàng sau khi tạo đơn hàng
        await this.cartModel.deleteOne({ userId });

        return { success: true, message: 'Đơn hàng đã được tạo', newOrder };
      } catch (error) {
        console.error('❌ Lỗi khi tạo đơn hàng:', error);
        return { success: false, message: 'Lỗi khi tạo đơn hàng' };
      }
    } else {
      console.log('❌ Sai chữ ký, giao dịch không hợp lệ.');
      return { success: false, message: 'Sai chữ ký, giao dịch không hợp lệ' };
    }
}


}
