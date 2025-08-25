import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryAttributeDto } from './dto/create-category-attribute.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('createCategory')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('get_all')
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('getOneCategory/:name')
  findOne(@Param('name') name: string) {
    return this.categoryService.findOne(name);
  }

  @Post('updateCategory/:name')
  update(
    @Param('name') name: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(name, updateCategoryDto);
  }

  @Delete('deleteCategory/:name')
  remove(@Param('name') name: string) {
    return this.categoryService.remove(name);
  }
    @Get(':categoryName/attributes')
  async getAttributes(@Param('categoryName') categoryName: string) {
    return this.categoryService.getAttributes(categoryName);
  }

  @Post(':categoryName/attributes')
  async createAttribute(
    @Param('categoryName') categoryName: string,
    @Body() dto: CreateCategoryAttributeDto,
  ) {
    return this.categoryService.createAttribute(categoryName, dto);
  }

}
