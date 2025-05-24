import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Reviews } from 'src/schema/reviews/review.schema';
import { Orders } from 'src/schema/order/orders.schema';
import { CreateReviewDto } from 'src/dto/reviews/reviews.dto';

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectModel(Reviews.name) private readonly reviewModel: Model<Reviews>,
    @InjectModel(Orders.name) private readonly orderModel: Model<Orders>,
  ) {}

  async createReview(dto: CreateReviewDto, userId: string) {
    const { productId, orderId, rating, comment } = dto;

    // Chuyển đổi userId thành ObjectId
    const objectId = new Types.ObjectId(orderId);

    // 1. Kiểm tra đơn hàng đã hoàn thành, thuộc về user, có sản phẩm
    const order = await this.orderModel.findOne({
      _id: objectId,
      customerId: userId,
      deliveryStatus: 'Đã giao hàng',
      items: {
        $elemMatch: { // Sử dụng $elemMatch để tìm trong mảng
          _id: productId, // 
        },
      },
    });

    if (!order) {
      console.log(userId,"user")
      throw new BadRequestException('Đơn hàng không hợp lệ hoặc chưa hoàn thành.');
    }

    // 2. Kiểm tra đã đánh giá chưa
    const existingReviews = await this.reviewModel.find({
      user: userId,
      product: productId,
      order: orderId,
    });

    if (existingReviews.length >= 2) {
      throw new BadRequestException('Bạn đã đánh giá sản phẩm này đủ 2 lần.');
    }

    const type = existingReviews.length === 0 ? 'initial' : 'additional';

    // 3. Lưu đánh giá
    const newReview = await this.reviewModel.create({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      comment,
      type,
    });
    console.log(rating,"đánh giá đây")
    return newReview;
  }

  async getProductReviews(productId: string, page = 1, limit = 8) {
    const skip = (page - 1) * limit;
    const objectProductId = new Types.ObjectId(productId);
  
    //  Lấy tất cả review của sản phẩm
    const allReviews = await this.reviewModel
      .find({ product: objectProductId })
      .populate('user', 'name');
  
    //  Đánh dấu order nào có additional
    const orderHasAdditional = new Set<string>();
    allReviews.forEach(review => {
      if (review.type === 'additional') {
        orderHasAdditional.add(review.order.toString());
      }
    });
  
    //  Sort lại reviews
    const sortedReviews = allReviews.sort((a, b) => {
      const aHasAdditional = orderHasAdditional.has(a.order.toString());
      const bHasAdditional = orderHasAdditional.has(b.order.toString());
  
      if (aHasAdditional && !bHasAdditional) return -1;
      if (!aHasAdditional && bHasAdditional) return 1;
      return 0;
    });
  
    // Phân trang
    const totalPages = Math.ceil(sortedReviews.length / limit);
    const paginatedReviews = sortedReviews.slice(skip, skip + limit);
  
    return {
      reviews: paginatedReviews,
      totalPages,
    };
  }
  
  
// Tổng quan đánh giá của 1 sản phẩm
async getProductReviewSummary(productId: string) {
  const objectProductId = new Types.ObjectId(productId);

  const reviews = await this.reviewModel.find({ product: objectProductId });

  // Gom theo order
  const groupedByOrder: Record<string, any> = {};

  reviews.forEach((review) => {
    const orderId = review.order.toString();

    if (!groupedByOrder[orderId]) {
      groupedByOrder[orderId] = {
        initial: null,
        additional: null,
      };
    }

    if (review.type === 'initial') {
      groupedByOrder[orderId].initial = review;
    } else if (review.type === 'additional') {
      groupedByOrder[orderId].additional = review;
    }
  });

  // Chọn review hợp lệ cho từng đơn
  const filteredReviews: any[] = [];

  for (const orderId in groupedByOrder) {
    const group = groupedByOrder[orderId];
    if (group.additional) {
      filteredReviews.push(group.additional);
    } else if (group.initial) {
      filteredReviews.push(group.initial);
    }
  }

  const totalReviews = filteredReviews.length;

  const starCounts: Record<number, { count: number; percent: number }> = {
    1: { count: 0, percent: 0 },
    2: { count: 0, percent: 0 },
    3: { count: 0, percent: 0 },
    4: { count: 0, percent: 0 },
    5: { count: 0, percent: 0 },
  };

  let totalRating = 0;

  filteredReviews.forEach((review) => {
    const rating = review.rating;
    totalRating += rating;
    starCounts[rating].count += 1;
  });

  // Tính % cho từng số sao
  if (totalReviews > 0) {
    for (let star = 1; star <= 5; star++) {
      starCounts[star].percent = parseFloat(
        ((starCounts[star].count / totalReviews) * 100).toFixed(1)
      );
    }
  }

  const averageRating = totalReviews
    ? parseFloat((totalRating / totalReviews).toFixed(1))
    : 0;

  return {
    totalReviews,
    averageRating,
    starCounts,
  };
}

 // Hàm kiểm tra review bổ sung
 async hasUserAdditionalReview(userId: string, orderId: string): Promise<boolean> {
  if (!userId || !orderId || !Types.ObjectId.isValid(orderId)) {
    return false;  // Trả về null nếu orderId không hợp lệ
  }

  const review = await this.reviewModel.findOne({
    user: userId, // Kiểm tra userId
    order: orderId,      // Kiểm tra orderId
    type: 'additional',  // Kiểm tra type là 'additional'
  });

  return review !== null; // Nếu tìm thấy review bổ sung, trả về true, ngược lại false
}
}
