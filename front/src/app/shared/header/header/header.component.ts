import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { CartModalComponent } from '../../cart-modal/cart-modal/cart-modal.component';
import { CommonModule } from '@angular/common';
import { CartService } from 'src/app/service/services/cart.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
    imports:[RouterModule,CartModalComponent, CommonModule],
})
export class HeaderComponent  implements OnInit {

    totalItems = 0;

  constructor(private cartService: CartService) {}


  ngOnInit() {this.cartService.totalItems$.subscribe(count => this.totalItems = count);}
  showCart = false;

  toggleCart() {
    this.showCart = !this.showCart;
  }
  openCart() {
    console.log('Clic sur le panier');
  document.getElementById('cartModal')?.classList.add('show');
}
closeCart() {
    this.showCart = false;
  }
}
