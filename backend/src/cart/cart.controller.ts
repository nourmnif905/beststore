import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Créer un panier (appelé une seule fois)
  @Post('create')
  createCart() {
    return this.cartService.createCart();
  }

  // Ajouter un produit au panier
  @Post('add/:cartId')
  addItem(
    @Param('cartId') cartId: string,
    @Body() body: { productId: string; quantity: number },
  ) {
    return this.cartService.addItemToCart(
      cartId,
      body.productId,
      body.quantity,
    );
  }

  // Voir les produits dans le panier
  @Get('get_items/:cartId')
  getCart(@Param('cartId') cartId: string) {
    return this.cartService.getCart(cartId);
  }

  // Supprimer un produit du panier
  @Delete('delete_carditem/:itemId')
  removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(itemId);
  }

  // Vider complètement le panier
  @Delete('delete_card/:cartId')
  clearCart(@Param('cartId') cartId: string) {
    return this.cartService.clearCart(cartId);
  }
}
