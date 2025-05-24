
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export enum CategoryStatus {
  ACTIVE = 1,
  INACTiVE = 0
}
export class CreateCategoryCreateDto  {

   @IsOptional()
   @IsNumber()
   id: Types.ObjectId;;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;

  @IsOptional()
  @IsString()
  description: string;
}
