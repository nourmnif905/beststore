import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductSpecificationService } from './product-specification.service';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';

@Controller('product-specification')
export class ProductSpecificationController {
  constructor(
    private readonly productSpecificationService: ProductSpecificationService,
  ) {}

  @Post('create')
  create(@Body() dto: CreateProductSpecificationDto) {
    return this.productSpecificationService.create(dto);
  }

  @Get('all_specs')
  findAll() {
    return this.productSpecificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productSpecificationService.findOne(id);
  }

  @Post(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductSpecificationDto,
  ) {
    return this.productSpecificationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSpecificationService.remove(id);
  }
  @Get('by-attribute/:attributeId')
getByAttribute(@Param('attributeId') attributeId: string) {
  return this.productSpecificationService.findByAttribute(attributeId);
}
@Get('by-product/:productId')
findByProduct(@Param('productId') productId: string) {
  return this.productSpecificationService.findByProduct(productId);     
}
}
