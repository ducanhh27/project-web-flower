import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto, ApplyCouponDto } from 'src/dto/coupon/coupon.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  // 🎯 Tạo mã giảm giá
  @Post()
  async createCoupon(@Body() dto: CreateCouponDto) {
    return this.couponService.createCoupon(dto);
  }

  // 📋 Lấy danh sách tất cả mã giảm giá
  @Get()
  async getAllCoupons() {
    return this.couponService.getAllCoupons();
  }

  // 🔍 Lấy mã giảm giá theo code
  @Get(':code')
  async getCouponByCode(@Param('code') code: string) {
    return this.couponService.getCouponByCode(code);
  }

  // 🎯 Áp dụng mã giảm giá
   // Bảo vệ API, chỉ user đã đăng nhập mới gọi được
  @Post('apply')
  @UseGuards(AuthGuard)
  apply(@Req() req, @Body() dto: ApplyCouponDto) {
    const userId = req.user.userId;// Lấy userId từ token
    return this.couponService.applyCoupon(userId, dto);
  }

  // 🛠️ Cập nhật mã giảm giá
  @Patch(':id')
  async updateCoupon(@Param('id') id: string, @Body() dto: Partial<CreateCouponDto>) {
    return this.couponService.updateCoupon(id, dto);
  }

  // ❌ Xóa mã giảm giá
  @Delete(':id')
  async deleteCoupon(@Param('id') id: string) {
    return this.couponService.deleteCoupon(id);
  }
}
