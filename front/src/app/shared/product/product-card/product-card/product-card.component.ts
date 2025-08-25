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
  @Input() adminMode: boolean = false; // true si c'est dans l'admin
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
  ProductStatus = status; 
  showModal = false;

  constructor(private cartService: CartService) {}

  openModal(event: MouseEvent) {
    event.preventDefault(); // empêche le scroll en haut
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  addToCart(productId: string) {
    this.cartService.addToCart(productId);
  }

  onEdit() {
    this.edit.emit(this.product);
  }

  onDelete() {
    this.delete.emit(this.product);
  }
}
