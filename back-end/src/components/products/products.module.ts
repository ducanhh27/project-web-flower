import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schema/products/products.schema';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { UploadService } from 'src/media/upload/upload.service';
import {
  Category,
  CategorySchema,
} from 'src/schema/categories/categories.schema';
import { Orders, OrdersSchema } from 'src/schema/order/orders.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Orders.name,
        schema: OrdersSchema,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, UploadService],
  exports: [ProductService],
})
export class ProductModule {}
