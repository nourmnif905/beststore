import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';

@Injectable()
export class ProductSpecificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductSpecificationDto) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) throw new NotFoundException('Product not found');

    // Check if attribute exists
    const attribute = await this.prisma.categoryAttribute.findUnique({
      where: { id: dto.attributeId },
    });

    if (!attribute) throw new NotFoundException('Attribute not found');

    return this.prisma.productSpecification.create({
      data: {
        value: dto.value,
        product: { connect: { id: dto.productId } },
        attribute: { connect: { id: dto.attributeId } },
      },
    });
  }

  async findAll() {
    return this.prisma.productSpecification.findMany({
      include: { product: true, attribute: true },
    });
  }

  async findOne(id: string) {
    const spec = await this.prisma.productSpecification.findUnique({
      where: { id },
      include: { product: true, attribute: true },
    });

    if (!spec) throw new NotFoundException('Specification not found');

    return spec;
  }

  async update(id: string, dto: UpdateProductSpecificationDto) {
    await this.findOne(id);

    return this.prisma.productSpecification.update({
      where: { id },
      data: {
        value: dto.value,

      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.productSpecification.delete({
      where: { id },
    });
  }
  async findByAttribute(attributeId: string) {
  // Optional: Validate attribute exists
  const attribute = await this.prisma.categoryAttribute.findUnique({
    where: { id: attributeId },
  });

  if (!attribute) throw new NotFoundException('Attribute not found');

  // Return only the specifications related to this attribute
  return this.prisma.productSpecification.findMany({
    where: { attributeId },
    select: {
      value: true,
    },
  });
}
  async findByProduct(productId: string) {
  const product = await this.prisma.product.findUnique({
    where: { id: productId },
    include: { specifications: true },
  });

  if (!product) throw new NotFoundException('Product not found');

  return product.specifications;
}

}
