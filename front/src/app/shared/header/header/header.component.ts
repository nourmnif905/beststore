import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { CartModalComponent } from '../../cart-modal/cart-modal/cart-modal.component';
import { CommonModule } from '@angular/common';
import { CartService } from 'src/app/service/services/cart.service';
import { RequestService } from 'src/app/service/request.service'; // <-- ajouter

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterModule, CartModalComponent, CommonModule],
})
export class HeaderComponent implements OnInit {
  totalItems = 0;
  showCart = false;
  categories: any[] = []; // <-- categories dynamiques

  constructor(
    private cartService: CartService,
    private requestService: RequestService // <-- injecter
  ) {}

  ngOnInit() {
    this.cartService.totalItems$.subscribe(count => this.totalItems = count);
    this.loadCategories(); // <-- charger les catégories
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  openCart() {
    document.getElementById('cartModal')?.classList.add('show');
  }

  closeCart() {
    this.showCart = false;
  }

  loadCategories() {
    this.requestService.get('category/get_all').subscribe({
      next: (res: any) => this.categories = res,
      error: (err) => console.error('Erreur récupération catégories', err)
    });
  }
}
