import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Orders, OrdersSchema } from "src/schema/order/orders.schema";
import { Reviews, ReviewSchema } from "src/schema/reviews/review.schema";
import { ProductReviewController } from "./reviews.controller";
import { ProductReviewService } from "./reviews.service";
import { Users, UsersSchema } from "src/schema/users/users.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reviews.name,
        schema: ReviewSchema,
      },
      {
        name: Orders.name,
        schema: OrdersSchema,
      },
      {
        name: Users.name,          // Đảm bảo đăng ký Users schema
        schema: UsersSchema,
      },
    ]),
  ],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
})
export class ReviewsModule {}
