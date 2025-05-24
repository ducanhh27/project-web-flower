import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "src/schema/categories/categories.schema";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { Orders, OrdersSchema } from "src/schema/order/orders.schema";
import { Product, ProductSchema } from "src/schema/products/products.schema";

@Module({
    imports:[MongooseModule.forFeature([
        {
            name: Category.name,
            schema: CategorySchema
        },
        {
            name: Orders.name,
            schema: OrdersSchema
        },
        {
            name: Product.name,
            schema: ProductSchema
        }
    ])],
    controllers:[CategoriesController],
    providers:[CategoriesService]
})

export class CategoriesModule{}