import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoryAttributeService } from './category-attribute.service';
import { CreateCategoryAttributeDto } from './dto/create-category-attribute.dto';
import { UpdateCategoryAttributeDto } from './dto/update-category-attribute.dto';

@Controller('category-attributes')
export class CategoryAttributeController {
  constructor(
    private readonly categoryAttributeService: CategoryAttributeService,
  ) {}

  /**
   * Create a category attribute
   * @param categoryId ID of the category the attribute belongs to
   */
  @Post(':categoryId')
  create(
    @Param('categoryId') categoryId: string,
    @Body() dto: CreateCategoryAttributeDto,
  ) {
    return this.categoryAttributeService.create(categoryId, dto);
  }

  /** Get all category attributes */
  @Get()
  findAll() {
    return this.categoryAttributeService.findAll();
  }

  /** Get one attribute by ID */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryAttributeService.findOne(id);
  }

  /** Update an attribute by ID */
  @Post(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryAttributeDto,
  ) {
    return this.categoryAttributeService.update(id, dto);
  }

  /** Delete an attribute by ID */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryAttributeService.remove(id);
  }
  @Get('category/:categoryId')
findByCategory(@Param('categoryId') categoryId: string) {
  return this.categoryAttributeService.findByCategory(categoryId);
}
}
