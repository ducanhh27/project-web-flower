import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { CreateOrderDto } from "src/dto/payment/payment.dto";
import { Orders } from "src/schema/order/orders.schema";
import { Types } from "mongoose";
import moment from "moment";
import { Cart } from "src/schema/cart/cart.schema";
import { Product } from "src/schema/products/products.schema";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(@InjectModel(Orders.name) private readonly orderModel: Model< Orders>,
              @InjectModel(Cart.name) private cartModel: Model<Cart>,
              @InjectModel(Product.name) private productModel: Model<Product>) {}

  async getAllOrders(): Promise<Orders[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async createOrder(dto: CreateOrderDto) {
    const newOrder = new this.orderModel({
      customerId: dto.customerId,
      couponId:dto.couponId,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      items: dto.items.map((item) => ({
        ...item,
        totalPrice: item.price * item.quantity,
      })),
      priceOders: dto.priceOders,
      status: dto.status,
      deliveryStatus: dto.deliveryStatus,
      paymentMethod: dto.paymentMethod,
    });
  
    // ✅ Cập nhật số lượng tồn kho và số lượng đã bán
    for (const item of dto.items) {
      await this.productModel.findByIdAndUpdate(
        item._id,
        {
          $inc: {
            stockQuantity: -item.quantity,
            sold: item.quantity,
          },
        },
        { new: true }
        
      );
      console.log("gọi hàm này!")
    }
  
    // ✅ Xoá giỏ hàng
    await this.cartModel.deleteOne({ userId: dto.customerId });
  
    return await newOrder.save();
  }


  async getOrderStatus(appTransId: string) {
    const order = await this.orderModel.findOne({ app_trans_id: appTransId });
    if (!order) {
      return { status: "not_found" };
    }

    const createdTime = moment(order.createdAt);
    if (order.status === "pending" && moment().diff(createdTime, "minutes") > 15) {
      order.status = "canceled";
      await order.save();
    }
    return { status: order.status };
  }

  async getMonthlyRevenue() {
    return this.orderModel.aggregate([
      { $match: { status: "Đã thanh toán" } }, // Lọc đơn đã thanh toán
      {
        $project: {
          monthVN: {
            $toInt: {
              $dateToString: { format: "%m", date: "$updatedAt", timezone: "Asia/Ho_Chi_Minh" }
            }
          },
          priceOders: { $toDouble: "$priceOders" }
        }
      },
      {
        $group: {
          _id: "$monthVN", // Nhóm theo tháng
          revenue: { $sum: "$priceOders" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // Sắp xếp theo tháng tăng dần
    ]);
  }


  //Top khách hàng tiềm năng
  async getTopCustomers(limit: number = 5) {
    const result = await this.orderModel.aggregate([
      {
        $match: { status: "Đã thanh toán" } // Chỉ lấy các đơn hàng đã thanh toán
      },
      {
        $group: {
          _id: "$customerId",
          name: { $first: "$name" }, // Lấy tên đầu tiên của khách hàng
          phone: { $first: "$phone" }, // Lấy số điện thoại
          address: { $first: "$address" },
          email: { $first: "$email" }, // Lấy địa chỉ
          totalQuantity: { $sum: { $sum: "$items.quantity" } }, // Tổng số sản phẩm đã mua
          totalPriceOrders: { $sum: "$priceOders" } // Tổng giá trị đơn hàng
        }
      },
      {
        $project: {
          _id: 0,
          customerId: "$_id",
          name: 1,
          phone: 1,
          address: 1,
          email:1,
          totalQuantity: 1,
          totalPriceOrders: 1
        }
      },
      {
        $sort: { totalPriceOrders: -1 } // Sắp xếp theo tổng giá trị đơn hàng giảm dần
      },
      {
        $limit: limit // Giới hạn số lượng khách hàng
      }
    ]);
  
    return result;
  }
  
  //Top thể loại bán chạy
  async getBestSellingCategories(limit: number = 5) {
    const result = await this.orderModel.aggregate([
      {
        $match: { status: "Đã thanh toán" } // Chỉ lấy đơn hàng đã thanh toán
      },
      {
        $unwind: "$items" // Tách từng sản phẩm trong đơn hàng
      },
      {
        $match: { "items.isDeleted": { $ne: true } } // Bỏ qua sản phẩm đã bị xóa
      },
      {
        $group: {
          _id: "$items.categories",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      {
        $addFields: {
          categoryId: { $toObjectId: "$_id" }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      {
        $unwind: "$categoryInfo"
      },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: "$categoryInfo.name",
          totalSold: 1,
          totalRevenue: 1
        }
      },
      {
        $sort: { totalSold: -1 }
      },
      {
        $limit: limit
      }
    ]);
  
    return result;
  }

//Cap nhat don hang
  async updateDeliveryStatus(orderId: string, deliveryStatus: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    // Kiểm tra giá trị hợp lệ
    const validStatuses = ["Chưa giao hàng", "Đang giao hàng", "Đã giao hàng", "Hủy đơn hàng"];
    if (!validStatuses.includes(deliveryStatus)) {
      throw new BadRequestException('Trạng thái giao hàng không hợp lệ');
    }

    // Cập nhật trạng thái giao hàng
    order.deliveryStatus = deliveryStatus;

    // Nếu đã giao hàng, tự động cập nhật trạng thái thanh toán
    if (deliveryStatus === "Đã giao hàng") {
      order.status = "Đã thanh toán";
    }

    if (deliveryStatus === "Hủy đơn hàng") {
      for (const item of order.items) {
        const productId = item._id; // _id này là của product luôn
        const quantity = item.quantity;
    
        const product = await this.productModel.findById(productId);
        if (product) {
          product.stockQuantity += quantity;
          product.sold = Math.max(0, (product.sold || 0) - quantity);
          await product.save();
        }
      }
  
      // Nếu cần cập nhật luôn trạng thái thanh toán
      order.status = "Đã hủy";
    }
    await order.save();
    return order;
  }

    //Lay don hang theo id
   async getOrderUser (userId: string){
      return await this.orderModel.find({customerId:userId }).exec()
   }
}
