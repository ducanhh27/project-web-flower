import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseModel } from "src/core/model/base.model";

@Schema({
  timestamps: true,
  collection: 'messages'
})
export class Messages extends BaseModel{
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: 'client' }) // hoặc 'admin'
  senderRole: string;
}
export const MessageSchema = SchemaFactory.createForClass(Messages);
