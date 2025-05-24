import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from 'src/dto/payment/payment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  //Tạo một đơn hàng
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }

  //Lấy ra tất cả đơn hàng
  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  //-Lấy về trạng thái đơn hàng nếu đơn hàng tồn tại
  @Get('status')
  async getOrderStatus(@Query('app_trans_id') appTransId: string) {
    return this.orderService.getOrderStatus(appTransId);
  }

  //
  @Get('/monthly-revenue')
  async getMonthlyRevenue() {
    const revenueData = await this.orderService.getMonthlyRevenue();
    return revenueData.map(({ _id, revenue, orders }) => ({
      month: `Tháng ${_id > 12 ? 12 : _id}`, 
      revenue,
      orders,
    }));
  }

  //Top khách hàng tiềm năng
  @Get('top-customers')
  async getTopCustomers() {
    return this.orderService.getTopCustomers();
  }

  //Top thể loại bán chạy
  @Get('best-selling-categories')
  async getBestSellingCategories() {
    return this.orderService.getBestSellingCategories();
  }

  // Cập nhật trạng thái đơn hàng
  @Patch(':id/delivery-status')
  async updateDeliveryStatus(
    @Param('id') orderId: string,
    @Body('deliveryStatus') deliveryStatus: string,
  ) {
    return this.orderService.updateDeliveryStatus(orderId, deliveryStatus);
  }

  //Lay don hang theo userId
  @Get('orderuser')
  @UseGuards(AuthGuard)
    async getOrderUser(@Req() req){
      const userId = req.user.userId;
      return this.orderService.getOrderUser(userId)
    }
}
