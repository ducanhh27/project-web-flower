import { Controller, Get, Post, Body,  UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AddToCartDto } from 'src/dto/cart/cart.dto';


@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  

  @Get()
  @UseGuards(AuthGuard)  // Bắt buộc đăng nhập
  async getCart(@Req() req) {
      const userId = req.user.userId; // Lấy userId từ token
      return this.cartService.getCartByUserId(userId);
  }


  @Post('add')
  @UseGuards(AuthGuard)
  async addToCart(@Req() req, @Body() body:AddToCartDto){
    const userId = req.user.userId;
    return this.cartService.addToCart(userId,body.items)
  }
  @Post("remove")
  @UseGuards(AuthGuard)
  async removeFromCart(@Req() req, @Body() body: { productId: string }) {
  const userId = req.user.userId;
  return this.cartService.removeFromCart(userId, body.productId);
}

}
