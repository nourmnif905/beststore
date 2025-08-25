import { Controller } from '@nestjs/common';
import { CategoryAttributeService } from './category-attribute.service';

@Controller('category-attribute')
export class CategoryAttributeController {
  constructor(private readonly categoryAttributeService: CategoryAttributeService) {}
}
