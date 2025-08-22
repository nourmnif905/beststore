import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import Fuse from 'fuse.js';

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
  // 1. Get all categories from DB
  const categories = await this.prisma.category.findMany();

  // 2. Setup Fuse.js
  const fuse = new Fuse(categories, {
    keys: ['name'],
    threshold: 0.3, // adjust for sensitivity (lower = stricter)
    ignoreLocation: true,
    includeScore: true,
  });

  // 3. Perform fuzzy search
  const result = fuse.search(name);

  // 4. Return best match or throw
  if (!result.length) {
    throw new NotFoundException(`No category found similar to "${name}"`);
  }

  return result
}

  async update(name: string, dto: UpdateCategoryDto) {
    await this.findOne(name); // throws if not found
    return this.prisma.category.update({
      where: { name },
      data: dto,
    });
  }

  async remove(name: string) {
    await this.findOne(name); // throws if not found
    return this.prisma.category.delete({
      where: { name },
    });
  }
}
