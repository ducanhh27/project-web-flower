import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {CreateProductDto,UpdateProductDto} from 'src/dto/product/products.dto';
import { ProductService } from './products.service';
import { Product } from 'src/schema/products/products.schema';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/media/upload/upload.service';
import { Roles } from '../auth/guards/roles.decorator';
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  //Lấy danh sách tất cả sản phẩm
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  // Tạo mới sản phẩm
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 }, // Chỉ nhận 1 ảnh thumbnail
      { name: 'images', maxCount: 10 }, // Nhận tối đa 5 ảnh chi tiết
    ]),
  )
  async uploadFile(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      images?: Express.Multer.File[];
    }, // Nhận cả thumbnail và images
    @Body() createProductDto: CreateProductDto,
  ) {
    let thumbnailUrl = '';
    const imageUrls: string[] = [];

    // Xử lý ảnh thumbnail nếu có
    if (files.thumbnail && files.thumbnail.length > 0) {
      thumbnailUrl = await this.uploadService.upload(
        files.thumbnail[0].originalname,
        files.thumbnail[0].buffer,
      );
      thumbnailUrl = thumbnailUrl.replace(/\s/g, '%20');
    }

    // Xử lý danh sách ảnh chi tiết nếu có
    if (files.images && files.images.length > 0) {
      for (const img of files.images) {
        let imgUrl = await this.uploadService.upload(
          img.originalname,
          img.buffer,
        );
        imgUrl = imgUrl.replace(/\s/g, '%20');
        imageUrls.push(imgUrl);
      }
    }
    createProductDto.thumbnail = thumbnailUrl;
    createProductDto.images = imageUrls;

    return this.productService.createProduct(createProductDto);
  }
  //Xóa sản phẩm
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  // Sửa sản phẩm
  @Patch(':id')
  @Roles(1)
  @UseInterceptors(
  FileFieldsInterceptor([
    { name: 'thumbnail', maxCount: 1 }, // Cập nhật thumbnail (nếu có)
    { name: 'images', maxCount: 10 },    // Ảnh mới muốn thêm vào
  ]),
)
async updateProduct(
  @Param('id') id: string,
  @Body() updateProductDto: UpdateProductDto,
  @UploadedFiles()
  files: {
    thumbnail?: Express.Multer.File[]; // Thumbnail mới (nếu có)
    images?: Express.Multer.File[];    // Ảnh mới muốn thay thế
  },
) {

  // Lấy sản phẩm hiện tại từ DB
  const product = await this.productService.getProductById(id);
  if (!product) {
    throw new NotFoundException('Sản phẩm không tồn tại!');
  }

  // Xử lý xóa ảnh cũ (nếu cần)
  if (updateProductDto.deleteImages) {
    const deleteImages = Array.isArray(updateProductDto.deleteImages)
      ? updateProductDto.deleteImages
      : JSON.parse(updateProductDto.deleteImages);

    // Giữ lại những ảnh không bị xóa
    product.images = product.images.filter((img) => !deleteImages.includes(img));
  }

  // Xử lý thay thế toàn bộ ảnh cũ bằng ảnh mới
  if (files.images && files.images.length > 0) {
    const newImageUrls = await Promise.all(
      files.images.map(async (img) => {
        const imgUrl = await this.uploadService.upload(
          img.originalname,
          img.buffer,
        );
        return imgUrl.replace(/\s/g, '%20'); // Đảm bảo không có khoảng trắng trong URL
      }),
    );
    product.images = newImageUrls; // Thay thế toàn bộ ảnh cũ bằng ảnh mới
  } else if (files.images && files.images.length === 0) {
    // Nếu không có ảnh mới được gửi lên, xóa tất cả ảnh cũ
    product.images = [];
  }
  if (updateProductDto.imagesString && Array.isArray(updateProductDto.imagesString)) {
    product.images = [...product.images, ...updateProductDto.imagesString]; // Thêm ảnh cũ vào mảng images
  }
  // Xử lý thay đổi thumbnail (nếu có)
  if (files.thumbnail && files.thumbnail.length > 0) {
    const thumbnailUrl = await this.uploadService.upload(
      files.thumbnail[0].originalname,
      files.thumbnail[0].buffer,
    );
    product.thumbnail = thumbnailUrl.replace(/\s/g, '%20'); // Cập nhật thumbnail mới
  }

  // Cập nhật các trường khác nhưng KHÔNG ghi đè `images` và `thumbnail`
  delete updateProductDto.images;
  delete updateProductDto.thumbnail;
  Object.assign(product, updateProductDto);

  // Cập nhật thông tin sản phẩm trong DB
  return this.productService.updateProduct(id, product,);
}

  // Lấy sản phẩm theo loại
  @Get('/category/:slug')
  async getProductsByCategorySlug(
    @Param('slug') slug: string,
  ): Promise<Product[]> {
    return this.productService.findProductsByCategorySlug(slug);
  }
  // Lấy sản phẩm theo loại id
  @Get('/categories/:id')
  async getProductsByCategory(@Param('id') categoryId: string) {
    return this.productService.findByCategory(categoryId);
  }
  //Lấy tổng sản phẩm
 @Get("/total")
  async getTotalProduct() {
    return this.productService.getTotalProduct();
  }

  //Lấy sản phẩm theo id
  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return await this.productService.getProductById(id);
  }

  // Tìm kiếm sản phẩm
  @Get('search/key')
  async search(@Query('name') name: string): Promise<Product[]> {
    return this.productService.findByName(name);
  }

  //Lấy ra 10 sản phẩm bán chạy nhất
  @Get("top/selling")
  async getTopSellingProducts(): Promise<Product[]> {
    return this.productService.getTopSellingProducts();
  }

   //Lấy sản phẩm theo slug
   @Get('detail/:slug')
   async getProductBySlug(@Param('slug') slug: string): Promise<Product> {
     return await this.productService.findBySlug(slug);
   }
}
