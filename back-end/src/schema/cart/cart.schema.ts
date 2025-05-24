import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { BaseModel } from "src/core/model/base.model";



@Schema({
        timestamps:true,
        collection: 'cart'
})
export class Cart extends BaseModel{
    @Prop({type:Number, required: false})
    declare id:number;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Users' })
    userId:Types.ObjectId

    @Prop({
        type: [
          {
            productId:  { type: Types.ObjectId, ref: 'Product', required: true },
            quantity: Number,
          },
        ],
        default: [],
        _id: false,
        required: false,
      })
      items: { productId: string; quantity: number }[];
}
export const CartSchema = SchemaFactory.createForClass(Cart);