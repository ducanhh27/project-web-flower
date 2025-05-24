import { Controller, Post, Body, Req, Res, Get, Query } from '@nestjs/common';
import { VNPayService } from './vnpay.service';
import { Request, Response } from 'express';


@Controller('vnpay')
export class VNPayController {
  constructor(private readonly VNPayService: VNPayService) {}

  @Post('create-payment')
  async createPaymentUrl(@Body() body: { orderId:any; amount: number; orderDescription: string;  }) {
    const paymentUrl = await this.VNPayService.createPayment(
      body.orderId,
      body.amount,
      body.orderDescription,
    );
    return {paymentUrl}
  }

  @Get('/return')
  async vnpayReturn(@Query() vnp_Params: any, @Res() res: Response) {

    const result = await this.VNPayService.verifyPayment(vnp_Params);
    if (result.success) {
        
        return res.redirect('http://localhost:5173'); // Điều hướng về trang thành công
      } else {
        return res.redirect('http://localhost:5173/fail'); //  Điều hướng về trang lỗi
      }
  }

}
