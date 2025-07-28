import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, SearchByNameDto } from './dto';

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

  // Correction ici : GET + @Query()
  @Get('search-filter')
  async searchProductsWithFilter(@Body() dto: SearchByNameDto) {
    return this.productService.getProductsByFilters(dto);
  }
    @Get('max-price')
  async getMaxPrice(): Promise<number> {
    return this.productService.getMaxPrice();
  }
}

