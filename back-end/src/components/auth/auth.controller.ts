import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, SignUpDto, UpdateUserDto } from 'src/dto/users/users.dto';
import { AuthGuard } from './guards/auth.guard';
import { MailService } from '../mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly AuthService: AuthService,
  ) {}

  @Post('signup')
  async signUp(@Body() sigUp: SignUpDto) {
    return this.AuthService.signup(sigUp);
  }

  @Get('info')
  @UseGuards(AuthGuard)
  async infoUser(@Req() req) {
    const userId = req.user.userId;
    return this.AuthService.getUserById(userId);
  }

  @Put('update')
  @UseGuards(AuthGuard)
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId; // lấy userId từ payload JWT
    return this.AuthService.updateUser(userId, updateUserDto);
  }
  @Post('login')
  async login(@Body() logIn: LogInDto) {
    return this.AuthService.login(logIn);
  }
  @Post('google')
  async googleLogin(@Body('token') token: string) {
    return this.AuthService.loginWithGoogle(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    console.log(body.email,"here")
    return this.AuthService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.AuthService.resetPassword(body.token, body.newPassword);
  }

  @Get('totaluser')
  async gettotaluser() {
    return this.AuthService.gettotaluser();
  }

  @Get('users-with-total-paid')
  async getUsersWithTotalPaid() {
    return this.AuthService.getUserListWithTotalPaid();
  }
  
}
