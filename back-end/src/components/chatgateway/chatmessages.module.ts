import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Messages, MessageSchema } from 'src/schema/messages/messages.schema';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';


@Module({
  imports: [MongooseModule.forFeature([
    { name: Messages.name, 
      schema: MessageSchema 
    },
    ])],
  controllers:[MessageController],
  providers: [ChatGateway,MessageService],
  exports: [MessageService], // Nếu module khác cần dùng
})
export class ChatMessageModule {}