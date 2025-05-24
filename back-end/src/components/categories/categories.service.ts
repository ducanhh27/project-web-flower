import { InjectModel } from '@nestjs/mongoose';
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Category } from 'src/schema/categories/categories.schema';
import { Model } from 'mongoose';
import { CreateCategoryCreateDto } from 'src/dto/categories/categories.dto';
import { Product } from 'src/schema/products/products.schema';
import { Orders } from "src/schema/order/orders.schema";
import slugify from 'slugify';



@Injectable()
export class CategoriesService{
    constructor(@InjectModel(Category.name) private readonly categoryModel : Model<Category>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Orders.name) private readonly orderModel: Model<Orders>,){}

    async create(CreateCategoryRequest: CreateCategoryCreateDto): Promise<Category> {
      // Kiểm tra danh mục đã tồn tại chưa
      const existingCategory = await this.categoryModel.findOne({
        name: CreateCategoryRequest.name,
      });
    
      if (existingCategory) {
        throw new ConflictException('Category name already exists');
      }
    
      // Tạo slug từ name
      const slug = slugify(CreateCategoryRequest.name, { lower: true, strict: true });
    
      // Tạo danh mục mới
      const category = new this.categoryModel({
        ...CreateCategoryRequest,
        slug, // Thêm slug vào
      });
    
      return category.save();
    }

    async getCategories (){
      const categories = await this.categoryModel.find().exec();
      return categories.sort((a, b) =>
        a.name === "Lan Hồ Điệp" ? -1 : b.name === "Lan Hồ Điệp" ? 1 : 0
      );
    }

    async getCategoryStatistics() {
      try {
        // Lấy danh sách tất cả thể loại trước, chỉ lấy `_id` và `name`
        const categories = await this.categoryModel.find({}, { name: 1 }).lean();
    
        // Lấy số lượng sản phẩm hiện có theo thể loại
        const stockData = await this.productModel.aggregate([
          {
            $group: {
              _id: "$categories",
              stockQuantity: { $sum: 1 },
            },
          },
        ]);
    
        // Lấy số lượng sản phẩm đã bán theo thể loại từ bảng orders
        const soldData = await this.orderModel.aggregate([
          { $match: { status: "Đã thanh toán" } },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.categories",
              totalSold: { $sum: "$items.quantity" },
            },
          },
        ]);
    
        // Gộp dữ liệu với danh sách thể loại
        const result = categories.map((category) => {
          const categoryId = category._id?.toString(); // Đảm bảo `_id` là string
    
          if (!categoryId) {
            console.error("❌ Lỗi: category._id bị null hoặc undefined!", category);
            return {
              categoryId: null,
              categoryName: category.name || "Không xác định",
              stockQuantity: 0,
              totalSold: 0,
            };
          }
    
          const stockInfo = stockData.find((s) => s._id?.toString() === categoryId);
          const soldInfo = soldData.find((s) => s._id?.toString() === categoryId);
    
          return {
            categoryId,
            categoryName: category.name,
            stockQuantity: stockInfo ? stockInfo.stockQuantity : 0, // Nếu không có sản phẩm nào thì mặc định 0
            totalSold: soldInfo ? soldInfo.totalSold : 0, // Nếu chưa bán sản phẩm nào thì mặc định 0
          };
        });
    
        return result;
      } catch (error) {
        console.error("🚨 Lỗi khi lấy thống kê danh mục:", error);
        throw new Error("Không thể lấy dữ liệu thống kê danh mục");
      }
    }
    

    // Xóa thể loại
    async deleteCategory(categoryId: string) {
      const category = await this.categoryModel.findById(categoryId);
      if (!category) throw new NotFoundException('Thể loại không tồn tại');

      // Tìm thể loại "Uncategorized", nếu chưa có thì tạo mới
      let uncategorized = await this.categoryModel.findOne({ name: 'Chưa xác định' });
      if (!uncategorized) {
        uncategorized = await this.categoryModel.create({ name: 'Chưa xác định' });
      }

      // Di chuyển sản phẩm sang thể loại "Uncategorized"
      await this.productModel.updateMany({ categories: categoryId }, { categories: uncategorized._id });

      // Xóa thể loại sau khi di chuyển sản phẩm
      await this.categoryModel.findByIdAndDelete(categoryId);
      return { message: 'Đã xóa thể loại và di chuyển sản phẩm' };
}

    
}