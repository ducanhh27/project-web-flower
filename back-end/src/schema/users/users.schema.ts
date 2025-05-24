import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseModel } from "src/core/model/base.model";
import { Schema as MongooseSchema } from "mongoose";
export enum USER_ROLE {
    ADMIN=1,
    USER=2,
  }
@Schema({
  timestamps: true,
  collection: 'users'
})
export class Users extends BaseModel{
    @Prop({type:Number, required: false})
    declare id:number;

    @Prop({type:String, required: false})
    name:string;

    @Prop({type:String, required: false})
    username?:string;

    @Prop({type:String, required: false})
    password?:string;

    @Prop({ type: Number, required: false, default: USER_ROLE.USER })
    role:number;

    @Prop({type:String, required: false})
    email:string;

    @Prop({ unique: true, sparse: true }) // Đảm bảo không trùng nhưng không bắt buộc
    googleId?: string;

    @Prop({ type: String, required: false })
    phone: string;

    @Prop({ type: String, required: false })
    address: string;
}
export const UsersSchema = SchemaFactory.createForClass(Users);
