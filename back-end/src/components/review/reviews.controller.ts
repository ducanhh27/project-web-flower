import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Query,
    Req,
    UseGuards,
    BadRequestException,
  } from '@nestjs/common';

import { ProductReviewService } from './reviews.service';
import { CreateReviewDto } from 'src/dto/reviews/reviews.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
  
  @Controller('reviews')
  export class ProductReviewController {
    constructor(private readonly reviewService: ProductReviewService) {}
  
    // Tạo đánh giá (lần đầu hoặc bổ sung)
    @Post()
    @UseGuards(AuthGuard) 
    async createReview(@Body() dto: CreateReviewDto, @Req() req: any) {
      const userId = req.user.userId;
      console.log(dto,"đây")
      return this.reviewService.createReview(dto, userId);
    }
  
    // Lấy tất cả đánh giá của 1 sản phẩm
    @Get('product/:productId')
    async getProductReviews(
      @Param('productId') productId: string,
      @Query('page') page = 1,
      @Query('limit') limit = 8,
    ) {
      return this.reviewService.getProductReviews(productId, +page, +limit);
    }
  @Get('product/:id/summary')
  getReviewSummary(@Param('id') productId: string) {
    return this.reviewService.getProductReviewSummary(productId);
  }
    
  @Get('hasAdditionalReview/:userId/:orderId')
  async hasAdditionalReview(
    @Param('userId') userId: string,
    @Param('orderId') orderId: string,
  ) {
    const result = await this.reviewService.hasUserAdditionalReview(userId, orderId);
    return { hasAdditionalReview: result }; // Trả về kết quả có review bổ sung hay không
  }
  }
  
  