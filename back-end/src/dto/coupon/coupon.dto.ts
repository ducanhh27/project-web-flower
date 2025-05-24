import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsBoolean, IsEnum, Min, IsOptional } from 'class-validator';


export enum CouponType {
    PERCENTAGE = 'percentage',
    AMOUNT = 'amount',
  }

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsEnum(CouponType) // ✅ Đúng cách sử dụng Enum
  type: CouponType;

  @IsNumber()
  discount_value: number;

  @IsNumber()
  max_usage: number;

  @IsOptional()
  @IsNumber()
  usage_per_user: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minimum_orders: number; 

  @IsOptional()
  @Transform(({ value }) => new Date(value)) // ✅ Chuyển đổi từ string -> Date
  @IsDate()
  start_date?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value)) // ✅ Chuyển đổi từ string -> Date
  @IsDate()
  end_date?: string;

  @IsBoolean()
  is_active: boolean;
}

export class ApplyCouponDto {
  @IsString()
  code: string;
}
