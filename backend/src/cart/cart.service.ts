import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Créer un nouveau panier vide
  async createCart() {
    return this.prisma.cart.create({
      data: {},
    });
  }

  // Ajouter un produit dans le panier
  async addItemToCart(cartId: string, productId: string, quantity: number) {
    // Vérifie si l’item existe déjà
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId, productId },
    });

    if (existingItem) {
      // Si oui, met à jour la quantité
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    // Sinon, ajoute le nouvel item
    return this.prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  // Récupérer un panier avec ses produits
  async getCart(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  // Supprimer un produit du panier
  async removeItem(cartItemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  // Vider le panier
  async clearCart(cartId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
    return { message: 'Cart cleared' };
  }
}
