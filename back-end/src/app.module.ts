import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './components/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './components/products/products.module';
import { UploadModule } from './media/upload/upload.module';
import {  CategoriesModule } from './components/categories/categories.module';
import { CartModule } from './components/cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { ZaloPayModule } from './components/zalopay/zalopay.module';
import { OrdersModule } from './components/orders/orders.module';
import { VNPayModule } from './components/vnpay/vnpay.module';
import { MailService } from './components/mail/mail.service';
import { CouponModule } from './components/coupon/coupon.module';
import { ChatGateway } from './components/chatgateway/chat.gateway';
import { ChatMessageModule } from './components/chatgateway/chatmessages.module';
import { ReviewsModule } from './components/review/reviews.modulte';


@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '100d' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env' // Cho phép dùng biến môi trường toàn cục
    }),
    MongooseModule.forRoot('mongodb+srv://nganhduc382:ducanh2002@dalatfarm.zv7ic.mongodb.net/dalatfarm?retryWrites=true&w=majority&appName=Dalatfarm'),
    AuthModule,
    ProductModule,
    UploadModule,
    CategoriesModule,
    CartModule,
    ZaloPayModule,
    OrdersModule,
    VNPayModule,
    CouponModule,
    ChatMessageModule,
    ReviewsModule
    ],
  controllers: [],
  providers: [MailService],
})
export class AppModule {}
