import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from 'src/core/model/base.model';

@Schema({ timestamps: true })
export class Coupon extends BaseModel {
  @Prop({ required: true, unique: true })
  code: string; // Mã giảm giá

  @Prop({ required: true, enum: ['percentage', 'amount'] })
  type: string; // Loại giảm giá

  @Prop({ required: true })
  discount_value: number; // Giá trị giảm (VNĐ hoặc %)

  @Prop({ default: 1 })
  max_usage: number; // Số lần sử dụng tối đa toàn hệ thống

  @Prop({ default: 1 })
  usage_per_user: number; // Số lần mỗi user có thể sử dụng

  @Prop({ default: 0 })
  minimum_orders: number;

  @Prop({ required: false })
  start_date: string; // Ngày bắt đầu

  @Prop({ required: false })
  end_date: string; // Ngày kết thúc

  @Prop({ default: true })
  is_active: boolean; // Trạng thái hoạt động
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
