import { Module } from '@nestjs/common';
import { VNPayController } from './vnpay.controller';
import { VNPayService } from './vnpay.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema } from 'src/schema/order/orders.schema';
import { Cart, CartSchema } from 'src/schema/cart/cart.schema';
import { ConfigModule } from '@nestjs/config';
import { Product, ProductSchema } from 'src/schema/products/products.schema';
import { Users, UsersSchema } from 'src/schema/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Orders.name,
        schema: OrdersSchema,
      },
      {
        name: Cart.name,
        schema: CartSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [VNPayController],
  providers: [VNPayService],
})
export class VNPayModule {}
