import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/shared/models/product';
export interface CartItem {
  product: Product;
  quantity: number;
}
@Injectable({
  providedIn: 'root',
})
export class CartService {
  
  
  private itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();
  private cartKey = 'cart_items';
  constructor() {
    this.loadCartFromStorage();
  }

  // Charger le panier depuis localStorage
  private loadCartFromStorage() {
    const stored = localStorage.getItem('cartItems');
    if (stored) {
      this.itemsSubject.next(JSON.parse(stored));
    }
  }

  // Sauvegarder dans localStorage
  private saveCartToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.itemsSubject.getValue()));
  }

  addToCart(product: any, quantity: number = 1) {
    const items = this.itemsSubject.getValue();
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.itemsSubject.next(items);
    this.saveCartToStorage();
  }

  clearCart() {
    this.itemsSubject.next([]);
    localStorage.removeItem('cartItems');
  }

  getCartItems() {
    return this.itemsSubject.getValue();
  }

 removeItem(productId: string) {
    // on filtre sur product.id (important)
    const updated = this.itemsSubject.getValue().filter(item => item.product?.id !== productId);
    this.itemsSubject.next(updated);
    this.saveCartToStorage();
    console.log(`CartService: removed productId=${productId}`, updated);
  }



  // ✅ Récupérer la quantité totale d’articles
  getTotalQuantity(): number {
    const items = this.itemsSubject.getValue();
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }

  // ✅ Observable de la quantité totale
  get totalItems$() {
    return this.items$.pipe(
      map((items) => items.reduce((acc, item) => acc + item.quantity, 0))
    );
  }

 increaseQuantity(productId: string) {
  const items = this.itemsSubject.value.map(item => {
    if (item.product.id === productId) {
      return { ...item, quantity: item.quantity + 1 };
    }
    return item;
  });
  this.itemsSubject.next(items);
  this.saveCartToStorage();
}

decreaseQuantity(productId: string) {
  let items = this.itemsSubject.value.map(item => {
    if (item.product.id === productId && item.quantity > 1) {
      return { ...item, quantity: item.quantity - 1 };
    }
    return item;
  });

  items = items.filter(item => item.quantity > 0);
  this.itemsSubject.next(items);
  this.saveCartToStorage();
}
 getCartForBackend(cartId: string) {
  return this.itemsSubject.value.map(item => ({
    cartId,
    productId: item.product.id,
    quantity: item.quantity
  }));
}
 isEmpty(): boolean {
  return this.itemsSubject.value.length === 0;
}  
getItems(): CartItem[] {
    const data = localStorage.getItem(this.cartKey);
    return data ? JSON.parse(data) : [];
  }


}
