import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from 'src/dto/product/products.dto';
import { Category } from 'src/schema/categories/categories.schema';
import { Product } from 'src/schema/products/products.schema';
import { Types } from 'mongoose';
import { Orders } from 'src/schema/order/orders.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel(Orders.name) private readonly orderModel: Model< Orders>,
  ) {}

  //Lấy tất cả sản phẩm
  async getAllProducts(): Promise<Product[]> {
    return this.productModel.find().exec();
  }


//Tạo sản phẩm
  async createProduct(createProduct: CreateProductDto): Promise<Product> {

    const existingProduct = await this.productModel.findOne({
      name: createProduct.name,
    });

    if (existingProduct) {
      throw new ConflictException('Tên sản phẩm đã tồn tại!');
    }

    const product = new this.productModel(createProduct);
    return product.save();
  }

  // Update sản phẩm
  async updateProduct(id: string, updateProductDto: Partial<UpdateProductDto>): Promise<Product> {
    
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      { $set: updateProductDto }, // $set chỉ thay đổi các trường trong DTO
      { new: true } // Trả về tài nguyên đã cập nhật
    );
  
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
  
    return updatedProduct;
  }

  // Lấy sản phẩm theo tên
  private removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD") // Chuẩn hóa Unicode
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
      .toLowerCase(); // Chuyển về chữ thường
  };

  async findByName(name: string): Promise<Product[]> {
    // Chuẩn hóa từ khóa tìm kiếm (xoá dấu tiếng Việt)
    
    const normalizedQuery = this.removeVietnameseTones(name);
  
    return this.productModel.find({
      normalizedName: { $regex: new RegExp(normalizedQuery, "i") }, // Tìm kiếm không phân biệt hoa thường
    }).exec();
  }
  
// Lấy sản phẩm theo tên id
  async getProductById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại!');
    }
    return product;
  }
  //Lấy sản phẩm theo slug 
  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productModel.findOne({ slug }).exec();
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với slug: ${slug}`);
    }
    return product;
  }
  // Lấy sản phẩm theo phân loại
  async findProductsByCategorySlug(slug: string): Promise<Product[]> {

    const category = await this.categoryModel.findOne({ slug }).exec();
    
    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }
    const categoryIdAsString: string = (category as any)._id.toString();
    const product= await this.productModel.find({ categories: categoryIdAsString }).exec()
    

    return product
  }
  //Lấy sản phẩm theo phân loại id
  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.productModel.find({ categories: categoryId }).exec();
  }
  
  // xóa sản phẩm
  async deleteProduct(id: string): Promise<Product | null> {
    await this.orderModel.updateMany(
      { "items._id": id }, // Tìm đơn hàng có sản phẩm này
      { 
        $set: { "items.$[elem].isDeleted": true } // Đánh dấu sản phẩm là đã xóa
      },
      { arrayFilters: [{ "elem._id": id }] } // Chỉ cập nhật đúng sản phẩm trong mảng
    );
    return this.productModel.findByIdAndDelete(id);
  }

  // Lấy 10 sản phẩm bán chạy nhất
  async getTopSellingProducts(): Promise<Product[]> {
    return this.productModel
      .find()
      .sort({ sold: -1 }) // Sắp xếp giảm dần theo `sold`
      .limit(10) // Lấy 10 sản phẩm bán chạy nhất
      .exec();
  }

  //Đếm tổng sản phẩm
  async getTotalProduct(): Promise<number> {
    return this.productModel.countDocuments();
  }

  
}
