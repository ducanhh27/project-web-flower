import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApplyCouponDto, CreateCouponDto } from 'src/dto/coupon/coupon.dto';
import { Coupon } from 'src/schema/coupon/coupon.schema';
import { Orders } from 'src/schema/order/orders.schema';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>,
              @InjectModel(Orders.name) private orderModel: Model<Orders>,
) {}

  // 🎯 Tạo mã giảm giá mới
  async createCoupon(dto: CreateCouponDto): Promise<Coupon> {
    const { code,type,discount_value } = dto;

    // Kiểm tra trùng mã
    const existingCoupon = await this.couponModel.findOne({ code });
    if (existingCoupon) throw new BadRequestException('Mã giảm giá đã tồn tại');
    
    if (type === 'percentage' && (discount_value < 0 || discount_value > 100)) {
      throw new BadRequestException('Giá trị phần trăm phải nằm trong khoảng từ 0 đến 100');
    }
    return this.couponModel.create(dto);
  }

  // 📋 Lấy danh sách tất cả mã giảm giá
  async getAllCoupons(): Promise<Coupon[]> {
    return this.couponModel.find().sort({ createdAt: -1 });
  }

  // 🔍 Lấy thông tin mã giảm giá theo code
  async getCouponByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponModel.findOne({ code });
    if (!coupon) throw new NotFoundException('Không tìm thấy mã giảm giá');
    return coupon;
  }

  // 🎯 Áp dụng mã giảm giá
  async applyCoupon(userId: string, dto: ApplyCouponDto) {
    const coupon = await this.couponModel.findOne({ code: dto.code, is_active: true });
   
    //Kiểm tra tính hợp lệ
    if (!coupon) {
        throw new BadRequestException('Mã giảm giá không hợp lệ ');
    }
    const now = new Date();

    // Kiểm tra số lượng đơn hàng của user (nếu có điều kiện)
    const orderCount = await this.orderModel.countDocuments({ user: userId });
    if (orderCount < coupon.minimum_orders) {
        throw new BadRequestException(`Bạn cần ít nhất ${coupon.minimum_orders} đơn hàng để áp dụng mã này`);
    }

    // Kiểm tra số lần sử dụng còn lại của mã
    if (coupon.max_usage <= 0) {
        throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng');
    }

    // Giảm số lần sử dụng đi 1
    await this.couponModel.updateOne(
        { _id: coupon._id },
        { $inc: { max_usage: -1 } } // Giảm max_usage đi 1
    );

    return { message: 'Mã giảm giá hợp lệ', discount: coupon.discount_value,type:coupon.type, couponId:coupon._id };
}


  // 🛠️ Cập nhật mã giảm giá
  async updateCoupon(id: string, dto: Partial<CreateCouponDto>): Promise<Coupon> {
    const coupon = await this.couponModel.findByIdAndUpdate(id, dto, { new: true });
    if (!coupon) throw new NotFoundException('Không tìm thấy mã giảm giá');
    return coupon;
  }

  // ❌ Xóa mã giảm giá
  async deleteCoupon(id: string): Promise<{ message: string }> {
    const result = await this.couponModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Không tìm thấy mã giảm giá');
    return { message: 'Đã xóa mã giảm giá thành công' };
  }
}
