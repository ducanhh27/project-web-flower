import { Controller, Post, Body, Res } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';
import { Product } from 'src/schema/products/products.schema';

@Controller('zalopay')
export class ZaloPayController {
  constructor(private readonly zaloPayService: ZaloPayService) {}

  @Post('create-payment')
  async createPayment(@Body() body: { amount: number;app_trans_id: any; appUser: string; }) {
    return this.zaloPayService.createPayment(body.amount,body.app_trans_id, body.appUser);
  }

  @Post('callback')
  async handleCallback(@Body() body: { data: string; mac: string }) {
    let result = {};

    try {
      result = this.zaloPayService.verifyCallback(body.data, body.mac);
    } catch (ex) {
      result = { return_code: 0, return_message: ex.message }; // Xử lý lỗi
    }
    return result;
  }

}
