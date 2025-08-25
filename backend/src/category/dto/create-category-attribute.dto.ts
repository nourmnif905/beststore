import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AttributeType } from '@prisma/client';

export class CreateCategoryAttributeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AttributeType, {
    message: `type must be one of: ${Object.values(AttributeType).join(', ')}`,
  })
  type: AttributeType;
}
