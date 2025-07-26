import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsEnum, MinLength, IsOptional, Min, IsIn } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  photo: string; // ex: URL de l’image ou nom du fichier

  @IsEnum(['IN_STOCK', 'ON_ORDER'])
  status: 'IN_STOCK' | 'ON_ORDER';
  
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
}
