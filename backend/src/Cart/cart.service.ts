import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // ✅ Créer un panier vide
async createCart() {
  const cart = await this.prisma.cart.create({
    data: {},
    select: {
      id: true, // on récupère uniquement l'ID
    },
  });
   return { id: cart.id }; // retourne directement l'ID
}

  // ✅ Ajouter un produit dans le panier
  async addItemToCart(cartId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId, productId },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  // ✅ Récupérer un panier avec ses produits
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

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }
async removeByCartAndProduct(cartId: string, productId: string) {
  const item = await this.prisma.cartItem.findFirst({
    where: {
      cartId,
      productId,
    },
  });

  if (!item) {
    throw new Error('Item not found in the cart');
  }

  return this.prisma.cartItem.delete({
    where: {
      id: item.id,
    },
  });
}

  // ✅ Supprimer un produit du panier
 /* async removeItem(cartItemId: string) {
    try {
      return await this.prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Cart item not found');
      }
      throw error;
    }
  }*/

  // ✅ Vider le panier
  async clearCart(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });

    return { message: 'Cart cleared' };
  }
}
