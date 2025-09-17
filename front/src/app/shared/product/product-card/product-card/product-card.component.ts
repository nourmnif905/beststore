import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { CommonModule } from '@angular/common';
import { CartService } from 'src/app/service/services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  imports: [CommonModule]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() adminMode: boolean = false;
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
  showModal = false;

  constructor(private cartService: CartService) {}

  openModal(event: MouseEvent) {
    event.preventDefault();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // ✅ Ajout dans le panier localStorage
  addToCart() {
    if (!this.product) return;

    this.cartService.addToCart(this.product, 1); // produit complet
    console.log('Produit ajouté au panier (localStorage) :', this.product);
    alert('Produit ajouté au panier');
  }

  onEdit() {
    this.edit.emit(this.product);
  }

  onDelete() {
    this.delete.emit(this.product);
  }
}
