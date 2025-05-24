import { Module } from '@nestjs/common';
import { ZaloPayController } from './zalopay.controller';
import { ZaloPayService } from './zalopay.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema } from 'src/schema/order/orders.schema';
import { Cart, CartSchema } from 'src/schema/cart/cart.schema';
import { Users, UsersSchema } from 'src/schema/users/users.schema';
import { Product, ProductSchema } from 'src/schema/products/products.schema';

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
        name: Users.name,
        schema: UsersSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [ZaloPayController],
  providers: [ZaloPayService],
})
export class ZaloPayModule {}
