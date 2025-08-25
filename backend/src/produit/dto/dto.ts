import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsEnum, MinLength, IsOptional, Min, IsIn } from 'class-validator';

export enum ProductStatus {
  IN_STOCK = 'IN_STOCK',
  ON_ORDER = 'ON_ORDER',
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  stock: number;


  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsEnum(ProductStatus)
  status: ProductStatus;

  @IsNumber()
  @IsPositive()
  categoryName :string ;
}


export class SearchByNameDto {
  @IsOptional()
  @IsString()
  prefix?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

    @IsOptional()
  @IsString()
  @IsIn(['name_asc', 'name_desc', 'price_asc', 'price_desc', 'in_stock'])
  orderBy?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'in_stock';

  @IsOptional()
  @IsString()
  categoryName?: string;
}
