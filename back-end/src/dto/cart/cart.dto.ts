import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsMongoId, IsInt, Min } from 'class-validator';

export class CartItemDto {
  @IsMongoId({ message: 'productId must be a valid MongoDB ID' })
  productId: string;

  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class AddToCartDto {
  @IsArray({ message: 'items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
