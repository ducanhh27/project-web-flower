import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {  Users, UsersSchema } from "src/schema/users/users.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { MailService } from "../mail/mail.service";
import { ResetTokenPassword, ResetTokenPasswordSchema } from "src/schema/refreshPasswordToken/refresh-token-password-schema";
import { Orders, OrdersSchema } from "src/schema/order/orders.schema";


@Module({
    imports:[MongooseModule.forFeature([
        {   
            name:Users.name, 
            schema:UsersSchema
        },
        {
            name:ResetTokenPassword.name, 
            schema:ResetTokenPasswordSchema
        },
        {
            name:Orders.name, 
            schema:OrdersSchema
        }

    ]),
    JwtModule.register({
        secret: process.env.JWT_SECRET, // ✅ Đảm bảo đúng
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
      })],
    
    controllers:[AuthController],
    providers:[AuthService,MailService],
    exports: [AuthService],
})
export class AuthModule{}