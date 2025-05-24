import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReviewDto {

  @IsMongoId()
  @IsOptional()
  customerId: string;

  @IsMongoId()
  orderId: string;

  @IsMongoId()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
