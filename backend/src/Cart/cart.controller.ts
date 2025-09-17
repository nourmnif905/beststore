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

  // ✅ Créer un panier (vide)
  @Post('create')
  createCart() {
    return this.cartService.createCart();
  }

  // ✅ Ajouter un produit au panier
  @Post('add/items')
  addItem(

    @Body() body: { cartId: string ;productId: string; quantity: number },
  ) {
    return this.cartService.addItemToCart(body.cartId, body.productId, body.quantity);
  }

  // ✅ Récupérer tous les produits d’un panier
  @Get(':cartId/items')
  getCart(@Param('cartId') cartId: string) {
    return this.cartService.getCart(cartId);
  }

  // ✅ Supprimer un produit spécifique du panier
 @Delete('items')
removeByCartAndProduct(@Body() dto: { cartId: string; productId: string }) {
  return this.cartService.removeByCartAndProduct(dto.cartId, dto.productId);
}


  // ✅ Vider complètement un panier
  @Delete(':cartId/items')
  clearCart(@Param('cartId') cartId: string) {
    return this.cartService.clearCart(cartId);
  }
}
