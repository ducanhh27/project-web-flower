import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { BaseModel } from 'src/core/model/base.model';

class OrderItem {
    @Prop({type: Types.ObjectId, required: true, ref: 'Product'})
    _id: Types.ObjectId;
  
    @Prop({ required: true })
    productName: string;
  
    @Prop({ required: true })
    productImage: string;
  
    @Prop({ required: true })
    quantity: number;
  
    @Prop({ required: true })
    price: number;
  
    @Prop({ required: true })
    totalPrice: number;
  }
@Schema({
  timestamps: true,
  collection: 'orders'
})
export class Orders extends BaseModel {
    @Prop({type:Number, required: false})
    declare id:number;

    @Prop({type: Types.ObjectId, required: true, ref: 'Users'})
    customerId:string;

    @Prop({type: Types.ObjectId, required: false, ref: 'Coupon'})
    couponId:string;
    
    @Prop({type:String, required: false})
    name:string;

    @Prop({type:String, required: false})
    phone:string;

    @Prop({type:String, required: false})
    email:string;

    @Prop({type:String, required: false})
    address:string;

    @Prop({ type: () => [OrderItem], required: true })
    items: OrderItem[];

    @Prop({type:Number, required: false})
    priceOders:number;

    @Prop({type:String, required: false})
    status:string;

    @Prop({type:String, required: false, enum: ['Chưa giao hàng','Đang giao hàng', 'Đã giao hàng',"Hủy đơn hàng"]})
    deliveryStatus:string;

    @Prop({type:String, required: false})
    paymentMethod:string


}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
