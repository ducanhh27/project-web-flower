import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from 'src/schema/coupon/coupon.schema';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { Orders, OrdersSchema } from 'src/schema/order/orders.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Coupon.name, 
      schema: CouponSchema 
    },
    {
        name: Orders.name,
        schema: OrdersSchema
    },
    ])],
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService], // Nếu module khác cần dùng
})
export class CouponModule {}
