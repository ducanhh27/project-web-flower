import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import moment from "moment";
import { Model } from 'mongoose';
import { Cart } from 'src/schema/cart/cart.schema';
import { Orders } from 'src/schema/order/orders.schema';
import { Product } from 'src/schema/products/products.schema';
import { Users } from 'src/schema/users/users.schema';
import { Types } from 'mongoose';

@Injectable()
export class ZaloPayService {
  private readonly config = {
    app_id:  process.env.APP_ID,
    key1: process.env.KEY1,
    key2:  process.env.KEY2,
    endpoint:process.env.ENDPOINT ?? '',
  };
 constructor(@InjectModel(Orders.name) private readonly orderModel: Model< Orders>,
             @InjectModel(Cart.name) private cartModel: Model<Cart>,
             @InjectModel(Product.name) private productModel: Model<Product>,
             @InjectModel(Users.name) private userModel:Model<Users>){}
  async createPayment(amount: number,app_trans_id:any, appUser: string) {
    const transID = Math.floor(Math.random() * 1000000);
    const embedData = {
        redirecturl: "http://localhost:5173"
    };
    const items = [{}]

    const order = {
      app_id: this.config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${app_trans_id}`,
      app_user: appUser,
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embedData),
      amount,
      description: `Payment for order #${transID}`,
      bank_code: '',
      callback_url:"https://2369-2405-4802-1d7e-d200-b4be-b08-dafd-247a.ngrok-free.app/zalopay/callback"
    };

    // Tạo chuỗi để hash
    const dataToHash = `${this.config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order['mac'] = CryptoJS.HmacSHA256(dataToHash, this.config.key1).toString();

    try {
      const response = await axios.post(this.config.endpoint, null, { params: order });
      return {
        ...response.data,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`};
    } catch (error) {
      throw new Error(`ZaloPay API Error: ${error.message}`);
    }
  }

  async verifyCallback(data: string, reqMac: string) {
    const mac = CryptoJS.HmacSHA256(data, this.config.key2).toString();
    console.log('mac =', data);
  
    if (reqMac !== mac) {
      return { return_code: -1, return_message: 'mac not equal' };
    }
  
    // Nếu MAC hợp lệ, xử lý tạo đơn hàng mới
    const dataJson = JSON.parse(data);
    const appTransId = dataJson['app_trans_id']; // Lấy mã giao dịch từ ZaloPay
    const extractedOrderId = appTransId.split('_')[1]; // Tách orderId từ app_trans_id
    const userId = dataJson['app_user']; // Truyền từ frontend hoặc lưu ở đâu đó
    console.log(dataJson,"console.log(dataJson)")
    try {
      // 🛒 Lấy giỏ hàng của user
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        console.log('🚨 Không tìm thấy giỏ hàng của người dùng',userId);
        return { return_code: -1, return_message: 'Không tìm thấy giỏ hàng' };
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

      // 🛠 Loại bỏ sản phẩm không tìm thấy
      const filteredItems = detailedItems.filter((item) => item !== null);

      // 📦 Tạo đơn hàng mới
      const user = await this.userModel.findById(userId);
        if (!user) {
          console.log('🚨 Không tìm thấy thông tin người dùng',userId);
          return {
            success: false,
            message: 'Không tìm thấy thông tin người dùng',
          };
        }
      const newOrder = await this.orderModel.create({
        _id: extractedOrderId, // Dùng ID từ ZaloPay
        customerId: userId,
        name: user.name, // Lấy từ bảng User
        phone: user.phone,
        email: user.email,
        address: user.address,
        items: filteredItems,
        priceOders: dataJson.amount, // Số tiền từ ZaloPay
        status: 'Đã thanh toán',
        paymentMethod:"Zalopay",
        deliveryStatus:'Chưa giao hàng'
      });
  
      console.log(`✅ Đơn hàng ${extractedOrderId} đã được tạo.`);
  
      // Cập nhật số lượng bán được và số lượng trong kho
      for (const item of newOrder.items) {
        const product = await this.productModel.findById(item._id);
        if (product) {
          product.sold = (product.sold ?? 0) + item.quantity;
          product.stockQuantity -= item.quantity;
          await product.save();
        }
      }
      // 🗑 Xóa giỏ hàng sau khi tạo đơn hàng
      await this.cartModel.deleteOne({ userId });
  
      return { return_code: 1, return_message: 'success' };
    } catch (error) {
      console.error('❌ Lỗi khi tạo đơn hàng:', error);
      return { return_code: -1, return_message: 'Database error' };
    }
  }
  
  
  
}
