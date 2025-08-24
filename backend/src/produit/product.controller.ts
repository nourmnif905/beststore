import { Controller, Post, Body, Get, Query, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, SearchByNameDto } from './dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Get('get_all')
  async findAll() {
    return this.productService.getAllProducts();
  }

  @Get('ping')
  async ping() {
    return this.productService.pingDb();
  }

  // ✅ Correction ici : GET + @Query()
  @Get('search-filter')
  async searchProductsWithFilter(@Body() dto: SearchByNameDto) {
    return this.productService.getProductsByFilters(dto);
  }

  // ✅ Nouvelle route : obtenir le prix max
  @Get('max-price')
  async getMaxPrice() {
    const max = await this.productService.getMaxPrice();
    return { max };
  }
  @Post('update/:id')
updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
  return this.productService.updateProduct(id, dto);
}

@Delete('delete/:id')
deleteProduct(@Param('id') id: string) {
  return this.productService.deleteProduct(id);
}
}
