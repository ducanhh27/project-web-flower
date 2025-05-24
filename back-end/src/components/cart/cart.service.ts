import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItemDto } from 'src/dto/cart/cart.dto';
import { Cart } from 'src/schema/cart/cart.schema';
import { Product } from 'src/schema/products/products.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>,
 @InjectModel(Product.name) private productModel: Model<Product>){}



  //Lấy giỏ hàng
  async getCartByUserId(userId: string) {
    return this.cartModel.findOne({ userId }).populate('items.productId'); // Lấy thông tin sản phẩm
  }


  //add vào giỏ hàng
  async addToCart(userId: string, items: CartItemDto[]) {
    let cart = await this.cartModel.findOne({ userId });
  
    if (!cart) {
      cart = new this.cartModel({ userId, items: [] });
    }
  
    for (const item of items) {
      if (!item.productId) {
        throw new Error(`Invalid productId: ${JSON.stringify(item)}`);
      }
  
      // Lấy thông tin sản phẩm từ DB
      const product = await this.productModel.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
  
      if (item.quantity > product.stockQuantity) {
        throw new BadRequestException(`Số lượng sản phẩm không đủ. Số lượng còn: ${product.stockQuantity}`);
      }
  
      const existingItem = cart.items.find(
        (cartItem) => cartItem.productId?.toString() === item.productId
      );
  
      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;
  
        if (newQuantity > product.stockQuantity) {
          throw new BadRequestException(`Số lượng sản phẩm không đủ. Số lượng còn: ${product.stockQuantity}`);
        }
  
        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({ productId: item.productId, quantity: item.quantity });
      }
    }
  
    await cart.save();
    return cart;
  }
  
  
// xóa sản phẩm ở cart
  async removeFromCart(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ userId });
  
    if (!cart) {
      throw new Error("Giỏ hàng không tồn tại!");
    }
  
    // Tìm sản phẩm trong giỏ hàng
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
  
    if (itemIndex === -1) {
      throw new Error("Sản phẩm không tồn tại trong giỏ hàng!");
    }
  
    if (cart.items[itemIndex].quantity > 1) {
      // Nếu số lượng > 1, giảm số lượng đi 1
      cart.items[itemIndex].quantity -= 1;
    } else {
      // Nếu số lượng = 1, xóa hẳn sản phẩm
      cart.items.splice(itemIndex, 1);
    }
  
    await cart.save();
    return cart;
  }
  
}
