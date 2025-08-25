import { PartialType } from '@nestjs/mapped-types';
import { CreateProductSpecificationDto } from './create-product-specification.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductSpecificationDto {
    @IsString()
    @IsOptional()
    value: string;
  
}
