import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductSpecificationDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  attributeId: string;
}
