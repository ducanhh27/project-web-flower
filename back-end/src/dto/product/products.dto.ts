import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsNotEmpty, IsMongoId, IsArray, Matches } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsMongoId()
  @IsNotEmpty()
  categories: Types.ObjectId;

  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true }) // Chuyển chuỗi thành số
  @IsNumber()
  stockQuantity: number;

  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true }) // Chuyển chuỗi thành số
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  sold: number;
  
  
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  @IsString()
  images?: string[];

  @IsOptional()
  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  slug: string;

}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true }) // Chuyển chuỗi thành số
  @IsNumber()
  stockQuantity: number;

  @IsOptional()
  @Transform(({ value }) => Number(value), { toClassOnly: true }) // Chuyển chuỗi thành số
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  sold?: number;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  @IsString()
  images?: string[];

  @IsOptional()
  @IsString()
  sku?: string;

  @IsMongoId()
  @IsOptional()
  categories: Types.ObjectId;

  @IsOptional()
  @Transform(
    ({ value }) => (typeof value === 'string' ? JSON.parse(value) : value),
    { toClassOnly: true },
  )
  @IsArray()
  @IsString({ each: true })
  deleteImages?: string[];

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang (-)',
  })
  slug?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value), {
    toClassOnly: true,
  })
  @IsArray()
  @IsString({ each: true })
  imagesString?: string[];
}
