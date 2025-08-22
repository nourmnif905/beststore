import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
const Fuse = require('fuse.js');

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }


async findOne(name: string) {
  const categories = await this.prisma.category.findMany();

  const fuse = new Fuse(categories, {
    keys: ['name'],
    threshold: 0.3,
    ignoreLocation: true,
    includeScore: true,
  });

  const result = fuse.search(name);

  if (!result.length) {
    throw new NotFoundException(`No category found similar to "${name}"`);
  }

  return result[0].item;
}





async update(name: string, dto: UpdateCategoryDto) {
  try {
    await this.findOne(name); // throws if not found
    return await this.prisma.category.update({
      where: { name },
      data: dto,
    });
  } catch (error) {
    // log error, throw internal server error or rethrow
    throw error;
  }
}

async remove(name: string) {
  try {
    await this.findOne(name); // throws if not found
    return await this.prisma.category.delete({
      where: { name },
    });
  } catch (error) {
    throw error;
  }
}}