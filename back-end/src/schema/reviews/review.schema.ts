import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseModel } from 'src/core/model/base.model';
import { Users } from '../users/users.schema';
import { Product } from '../products/products.schema';
import { Orders } from '../order/orders.schema';

@Schema({ timestamps: true })
export class Reviews extends BaseModel {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Users.name, required: true })
    user: Users;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Product.name, required: true })
     product: Product;

     @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Orders.name, required: true })
     order: Orders;
    
     @Prop({ enum: ['initial', 'additional'], default: 'initial' })
     type: 'initial' | 'additional';

     @Prop({ type: Number, required: true }) // ✅ BẮT BUỘC phải có
     rating: number;

     @Prop()
     comment?: string;

}

export const ReviewSchema = SchemaFactory.createForClass(Reviews);
