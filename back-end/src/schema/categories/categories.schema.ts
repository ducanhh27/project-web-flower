import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseModel } from 'src/core/model/base.model';

@Schema({
  timestamps: true,
  collection: 'categories'
})
export class Category extends BaseModel {
    @Prop({type:Number, required: false})
    declare id:number;

    @Prop({type:String, required: false})
    name:string;

    @Prop({type:String, required: false})
    status:string;

    @Prop({type:String,unique: true, required: false})
    slug:string;

}

export const CategorySchema = SchemaFactory.createForClass(Category);
