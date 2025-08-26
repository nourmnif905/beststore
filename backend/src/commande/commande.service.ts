// src/commande/commande.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommandeDto } from './dto/create-commande.dto';

@Injectable()
export class CommandeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCommandeDto) {
    // Check if cart exists
    const cart = await this.prisma.cart.findUnique({
      where: { id: dto.cartId },
    });

    if (!cart) throw new NotFoundException('Cart not found');

    // Create commande
    const commande = await this.prisma.commande.create({
      data: {
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        mail: dto.mail,
        localisation: dto.localisation,
        cart: { connect: { id: dto.cartId } },
      },
    });

    // Mark cart as ordered
    await this.prisma.cart.update({
      where: { id: dto.cartId },
      data: { isOrdered: true },
    });

    return commande;
  }

  async findAll() {
    return this.prisma.commande.findMany({
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const commande = await this.prisma.commande.findUnique({
      where: { id },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!commande) throw new NotFoundException('Commande not found');
    return commande;
  }
  async getProductsInCommande(commandeId: string) {
  const commande = await this.prisma.commande.findUnique({
    where: { id: commandeId },
    include: {
      cart: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!commande) {
    throw new NotFoundException('Commande not found');
  }

  const result = commande.cart.items.map((item) => ({
    productName: item.product.name,
    productId: item.product.id,
    quantity: item.quantity,
    price: item.product.price,
    totalPrice: item.product.price * item.quantity,
  }));

  return result;
}
}
