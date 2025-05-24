import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryCreateDto } from 'src/dto/categories/categories.dto';
import { Category } from 'src/schema/categories/categories.schema';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService){}

    // Tạo thể loại mới
    @Post()
    async create(@Body() createCategory: CreateCategoryCreateDto){
        return await this.categoriesService.create(createCategory)
    }
    
    //Lấy tất cả thể loại
    @Get()
    async getCategories(@Req() req): Promise<Category[]> {
        return this.categoriesService.getCategories();
    }

    //Lấy ra số lượng sản phẩm còn trong kho và tổng số lượng đã bán được theo từng danh mục
    @Get('/statistics')
      async getCategoryStatistics() {
        return await this.categoriesService.getCategoryStatistics();
    }
    //Xóa đi một danh mục sản phẩm
    @Delete(':id')
    async deleteCategory(@Param('id') categoryId: string) {
      const result = await this.categoriesService.deleteCategory(categoryId);
      if (!result) throw new NotFoundException('Thể loại không tồn tại');
      return { message: 'Thể loại đã bị xóa và sản phẩm đã được di chuyển' };
    }
}
