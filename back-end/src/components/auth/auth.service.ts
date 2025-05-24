import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {v4 as uuidv4} from 'uuid';
import { Users } from "src/schema/users/users.schema";
import * as bcrypt from 'bcrypt'
import { LogInDto, SignUpDto, UpdateUserDto } from "src/dto/users/users.dto";
import { JwtService } from "@nestjs/jwt";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
const { nanoid } = require("nanoid");
import { ResetTokenPassword } from "src/schema/refreshPasswordToken/refresh-token-password-schema";
import { MailService } from "../mail/mail.service";
import { Orders } from "src/schema/order/orders.schema";



@Injectable()
export class AuthService{
    private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    constructor(@InjectModel(Users.name) private userModel:Model<Users>,
    @InjectModel(Orders.name) private readonly orderModel: Model<Orders>,
    @InjectModel(ResetTokenPassword.name) private passwordResetModel: Model<ResetTokenPassword>,
    private readonly mailService: MailService,
    private jwtService: JwtService){}

    async signup (signUser:SignUpDto): Promise<Users> {
        const {email,username,password,name,phone,address} = signUser
        const emailInUse= await this.userModel.findOne({email})
        if(emailInUse){
            throw new BadRequestException("Email already in use")
        }
        const userNameInUse= await this.userModel.findOne({username})
        if(userNameInUse){
            throw new BadRequestException("Username already in use")
        }

        const hasedPassword= await bcrypt.hash(password,10)
        const createdUser = new this.userModel({
            name,
            username,
            email,
            phone,
            address,
            password: hasedPassword
        });
        return createdUser.save();
    }

    async getUserById(userId: string): Promise<Users> {
      const user = await this.userModel.findById(userId).select('-password -role'); // Ẩn mật khẩu
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }
    
    async login (login:LogInDto){
        const {username,password}=login;
        const user = await this.userModel.findOne({username});

        if(!user)
            throw new UnauthorizedException('sai thông tin!')
        
        if (!user.password) {
            throw new UnauthorizedException('Tài khoản này không hỗ trợ đăng nhập bằng mật khẩu');
          }
        const passwordMatch=await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            throw new UnauthorizedException('sai thông tin!')
        }
        return this.generateUserToken(user._id,user.name,user.phone,user.address,user.role)
    }
    async generateUserToken(userId, name, phone,address,role) {
      const accessToken = this.jwtService.sign(
          { userId, role }, 
          { secret: process.env.JWT_SECRET, expiresIn: '100d' }
      );
      return { accessToken, name,phone,address,role };
  }
  


    async loginWithGoogle(token: string) {
        const ticket = await this.client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
    
        const payload = ticket.getPayload();
        if (!payload) {
            throw new BadRequestException('Google authentication failed');
          }
        const { sub, email, name } = payload;
    
        // 🔍 Kiểm tra xem email đã đăng ký bằng phương thức khác chưa
        let user = await this.userModel.findOne({ email }) as Users;;
    
        if (user && !user.googleId) {
          throw new BadRequestException('Email này đã được đăng ký bằng phương thức khác.');
        }
    
        if (!user) {
          // Nếu chưa có user, tạo mới
          user = await this.userModel.create({
            googleId: sub,
            email,
            name,
            role:2 ,
          });
        }
    
        // 🎫 Tạo JWT token
        const jwt = this.jwtService.sign(
          { userId: user._id,name },
          { secret: process.env.JWT_SECRET }
      );
    
        return { token: jwt, name:user.name };
      }

      //Quên mật khẩu
      async forgotPassword(email: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
          throw new BadRequestException('Email không tồn tại');
        }
          const resetToken = nanoid(64);

          await this.passwordResetModel.findOneAndUpdate(
          { email },
          { email, token:resetToken },
          { upsert: true, new: true },
        );
        await this.mailService.sendResetPasswordEmail(email, resetToken);
        return { message: 'Email đặt lại mật khẩu đã được gửi' };
      }


      //Đặt lại mk
      async resetPassword(token: string, newPassword: string) {
        const resetToken = await this.passwordResetModel.findOne({ token });
        if (!resetToken) {
          throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
        }

        const user = await this.userModel.findOne({ email: resetToken.email });
        if (!user) {
          throw new BadRequestException('Người dùng không tồn tại');
        }
    
        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
    
        await this.passwordResetModel.deleteOne({ token });
    
        return { message: 'Mật khẩu đã được cập nhật thành công' };
      }

      // Lấy tất cả user
      async gettotaluser(): Promise<number> {
        return this.userModel.countDocuments();
      }

      //Cập nhật thông tin người dùng
      async updateUser(userId: string, updateUserDto: UpdateUserDto) {
        const user = await this.userModel.findById(userId);
      
        if (!user) {
          throw new NotFoundException('Người dùng không tồn tại');
        }
      
        // Cập nhật các trường
        if (updateUserDto.name) user.name = updateUserDto.name;
        if (updateUserDto.address) user.address = updateUserDto.address;
        if (updateUserDto.phone) user.phone = updateUserDto.phone;
      
        // Nếu cập nhật password thì hash lại mật khẩu
        if (updateUserDto.password) {
          const hasedPassword= await bcrypt.hash(updateUserDto.password,10)
          user.password = hasedPassword;
        }
      
        await user.save();
        return {
          message: 'Cập nhật thông tin thành công',
          user,
        };
      }
      
      async getUserListWithTotalPaid() {
        const users = await this.userModel.find().lean();
      
        const results = await Promise.all(
          users.map(async (user) => {
            const orders = await this.orderModel
              .find({ customerId: user._id.toString() })
              .lean();
      
            const totalPaid = orders
              .filter((order) => order.deliveryStatus === 'Đã giao hàng')
              .reduce((sum, order) => sum + (order.priceOders || 0), 0); // sửa ở đây
      
            return {
              name: user.name,
              email: user.email,
              address:user.address,
              phone: user.phone,
              totalOrders: orders.length,
              totalPaid,
            };
          })
        );
      
        return results;
      }
      
}