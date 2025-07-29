import { Component, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { CommonModule } from '@angular/common';
import { CartService } from 'src/app/service/services/cart.service';
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  imports:[CommonModule]
})
export class ProductCardComponent {
  constructor(private cartService: CartService) {}
   @Input() product!: Product;
     showModal = false;

  openModal(event: MouseEvent) {
    event.preventDefault(); // pour éviter le scroll en haut
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
   addToCart(productId: string) {
    this.cartService.addToCart(productId);
  }
}
