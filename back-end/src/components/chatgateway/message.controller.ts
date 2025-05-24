// message.controller.ts
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '../auth/guards/auth.guard';


@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}


  @UseGuards(AuthGuard)
  @Get('users')
  async getUsers(@Req() req) {
    const adminId = 'admin'; // lấy từ token JWT
    return this.messageService.getUsersChattedWithAdmin(adminId);
  }

  @UseGuards(AuthGuard)
  @Get(':userId')
  async getMessagesWithUser(@Param('userId') userId: string, @Req() req) {
    const adminId = 'admin';
    return this.messageService.getMessagesBetween(adminId, userId);
  }

  
}
