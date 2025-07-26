import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, SearchByNameDto } from './dto';
import { ProductStatus } from '@prisma/client';

// ✅ CORRECTION : utiliser require() au lieu de import
const Fuse = require('fuse.js');

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  private async getNextIndex(): Promise<number> {
    const lastProduct = await this.prisma.product.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    return lastProduct ? lastProduct.index + 1 : 1;
  }

  async createProduct(dto: CreateProductDto) {
  const nextIndex = await this.getNextIndex();
  return this.prisma.product.create({
    data: {
      ...dto,
      index: nextIndex,
      status: dto.status ? dto.status.toLowerCase() as ProductStatus : 'in_stock', // ou autre valeur par défaut
    },
  });
}

  async getAllProducts() {
    return this.prisma.product.findMany({ orderBy: { index: 'asc' } });
  }

  async pingDb() {
    try {
      const result = await this.prisma.$runCommandRaw({ ping: 1 });
      return { connected: true, result };
    } catch (error) {
      return { connected: false, error };
    }
  }

   async getProductsByFilters(dto: SearchByNameDto) {
    const { prefix, minPrice = 0, maxPrice, orderBy } = dto;

    // Récupérer le max price si pas défini
    const priceLimit = maxPrice ?? (await this.getMaxPrice());

    // 1) Récupérer produits filtrés par prix
    const products = await this.prisma.product.findMany({
      where: {
        price: {
          gte: minPrice,
          lte: priceLimit,
        },
      },
    });

    // 2) Si pas de recherche texte, juste trier la liste entière
    if (!prefix || prefix.trim() === '') {
      return this.sortProducts(products, orderBy);
    }

    // 3) Recherche floue avec Fuse.js
    const fuse = new Fuse(products, {
      keys: ['title', 'description'],
      threshold: 0.3,
    });

    const fuseResults = fuse.search(prefix);
    const filteredProducts = fuseResults.map(result => result.item);

    // 4) Trier les résultats filtrés
    return this.sortProducts(filteredProducts, orderBy);
  }

  private sortProducts(products: any[], orderBy?: string) {
  switch (orderBy) {
    case 'name_asc':
      return products.sort((a, b) => a.title.localeCompare(b.title));
    case 'name_desc':
      return products.sort((a, b) => b.title.localeCompare(a.title));
    case 'price_asc':
      return products.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return products.sort((a, b) => b.price - a.price);
    case 'in_stock':
      return products.sort((a, b) => {
        if (a.status === 'in_stock' && b.status !== 'in_stock') return -1;
        if (b.status === 'in_stock' && a.status !== 'in_stock') return 1;
        return 0;
      });
    default:
      return products;
  }
}



  async getMaxPrice(): Promise<number> {
    const result = await this.prisma.product.aggregate({
      _max: {
        price: true,
      },
    });
    return result._max.price ?? 0;
  }
}
