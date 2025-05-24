import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


@Schema({timestamps:true})
export class ResetTokenPassword extends Document{
    @Prop({require:true})
    token:string;

    @Prop({require:true, type:String})
    email:string
    
    @Prop({require:true})
    expiryDate:Date;
}

export const ResetTokenPasswordSchema = SchemaFactory.createForClass(ResetTokenPassword)