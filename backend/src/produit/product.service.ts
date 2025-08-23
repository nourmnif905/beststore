import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, SearchByNameDto } from './dto';
import { ProductStatus } from '@prisma/client';

// ✅ Import Fuse.js using require (for CommonJS compatibility)
const Fuse = require('fuse.js');

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  private async getNextIndex(): Promise<number> {
    const lastProduct = await this.prisma.product.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    return lastProduct?.index ? lastProduct.index + 1 : 1;
  }

async createProduct(dto: CreateProductDto) {
  const nextIndex = await this.getNextIndex();

  return this.prisma.product.create({
    data: {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      image: dto.image,
      index: nextIndex,
      status: (dto.status?.toUpperCase() as ProductStatus) || ProductStatus.SUR_COMMANDE,
      categoryName: dto.categoryName,  // <-- pass the foreign key directly
      // NO nested connect here
    },
  });
}

  async getAllProducts() {
    return this.prisma.product.findMany({
      orderBy: { index: 'asc' },
    });
  }

  async pingDb() {
    try {
      await this.prisma.$connect();
      return { connected: true };
    } catch (error) {
      return { connected: false, error };
    }
  }

async getProductsByFilters(dto: SearchByNameDto) {
  const minPrice = dto.minPrice !== undefined ? Number(dto.minPrice) : 0;
  const maxPrice = dto.maxPrice !== undefined ? Number(dto.maxPrice) : await this.getMaxPrice();
  const prefix = dto.prefix?.trim() ?? '';
  const orderBy = dto.orderBy;
  const categoryName = dto.categoryName;

  // Build Prisma query filters
  const filters: any = {
    price: {
      gte: minPrice,
      lte: maxPrice,
    },
  };

  if (categoryName) {
    filters.category = {
      name: categoryName,
    };
  }

  const products = await this.prisma.product.findMany({
    where: filters,
  });

  // If there's no prefix, return sorted products directly
  if (!prefix) {
    return this.sortProducts(products, orderBy);
  }

  // Use Fuse.js for fuzzy search
  const fuse = new Fuse(products, {
    keys: ['name', 'description'],
    threshold: 0.3,
  });

  const fuseResults = fuse.search(prefix);
  const filteredProducts = fuseResults.map(result => result.item);

  return this.sortProducts(filteredProducts, orderBy);
}


  private sortProducts(products: any[], orderBy?: string) {
    switch (orderBy) {
      case 'name_asc':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return products.sort((a, b) => b.name.localeCompare(a.name));
      case 'price_asc':
        return products.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return products.sort((a, b) => b.price - a.price);
      case 'in_stock':
        return products.sort((a, b) => {
          if (a.status === ProductStatus.AVAILABLE && b.status !== ProductStatus.AVAILABLE) return -1;
          if (b.status === ProductStatus.AVAILABLE && a.status !== ProductStatus.AVAILABLE) return 1;
          return 0;
        });
      default:
        return products;
    }
  }

  async getMaxPrice(): Promise<number> {
    const result = await this.prisma.product.aggregate({
      _max: { price: true },
    });
    return result._max.price ?? 0;
  }

}
