import { Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class BaseModel extends Document {
  @Prop()
  deletedAt?: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
  })
  createdBy: Types.ObjectId;
  @Prop()
  updatedBy: number;
}