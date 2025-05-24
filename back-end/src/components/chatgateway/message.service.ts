// src/messages/message.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Messages } from 'src/schema/messages/messages.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Messages.name) private messageModel: Model<Messages>,
  ) {}

  async saveMessage(data: {
    senderId: string;
    senderName: string;
    receiverId: string;
    text: string;
    senderRole: string;
  }): Promise<Messages> {
    const created = new this.messageModel(data);
    return created.save();
  }

  async getMessagesBetween(user1: string, user2: string) {
    console.log(user1,"đây")
    return this.messageModel.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ createdAt: 1 });
  }
  

  async getUsersChattedWithAdmin(adminId: string) {
    const users = await this.messageModel.aggregate([
      {
        $match: {
          $or: [{ senderId: adminId }, { receiverId: adminId }],
        },
      },
      {
        $project: {
          userId: {
            $cond: [
              { $eq: ['$senderId', adminId] },
              '$receiverId',
              '$senderId',
            ],
          },
          userName: {
            $cond: [
              { $eq: ['$senderId', adminId] },
              '$senderName',
              '$senderName',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$userId',
          userName: { $first: '$userName' },
        },
      },
    ]);
  
    return users.map((u) => ({ id: u._id, userName: u.userName }));
  }
}
