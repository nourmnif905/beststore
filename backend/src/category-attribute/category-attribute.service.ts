import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryAttributeDto } from './dto/create-category-attribute.dto';
import { UpdateCategoryAttributeDto } from './dto/update-category-attribute.dto';

@Injectable()
export class CategoryAttributeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(categoryId: string, dto: CreateCategoryAttributeDto) {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.categoryAttribute.create({
      data: {
        name: dto.name,
        type: dto.type,
        category: { connect: { id: categoryId } },
      },
    });
  }

  async findAll() {
    return this.prisma.categoryAttribute.findMany({
      include: { category: true },
    });
  }

  async findOne(id: string) {
    const attribute = await this.prisma.categoryAttribute.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    return attribute;
  }

  async update(id: string, dto: UpdateCategoryAttributeDto) {
    await this.findOne(id); // throws if not found

    return this.prisma.categoryAttribute.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // throws if not found

    return this.prisma.categoryAttribute.delete({
      where: { id },
    });
  }
  async findByCategory(categoryId: string) {
  const category = await this.prisma.category.findUnique({
    where: { id: categoryId },
    include: { attributes: true },
  });

  if (!category) {
    throw new NotFoundException('Category not found');
  }

  return category.attributes;
}
}
