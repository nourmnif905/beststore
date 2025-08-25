import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { BehaviorSubject } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartId: string | null = null;
  private itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private requestService: RequestService) {}

  async initCart(): Promise<void> {
    if (!this.cartId) {
      const res = await firstValueFrom(
        this.requestService.post('cart', {})
      ) as { id: string };
      this.cartId = res.id;
    }
  }

  async addToCart(productId: string, quantity: number = 1): Promise<void> {
    await this.initCart();
    await firstValueFrom(this.requestService.post(`cart/${this.cartId}/items`, {
      productId,
      quantity,
    }));
    await this.refreshCartItems();  // <-- await ici
  }

  async refreshCartItems(): Promise<void> {
    if (!this.cartId) return;
    const cart = await firstValueFrom(this.requestService.get(`cart/${this.cartId}/items`));
    this.itemsSubject.next(cart.items);
  }

async removeItem(itemId: string): Promise<void> {
  if (!this.cartId) return;

  await firstValueFrom(
    this.requestService.request('DELETE', 'cart/items', {
      body: { cartId: this.cartId, productId: itemId }
    })
  );

  await this.refreshCartItems();
}


  async clearCart(): Promise<void> {
    if (!this.cartId) return;
    await firstValueFrom(this.requestService.delete(`cart/${this.cartId}/items`));
    this.itemsSubject.next([]);
    this.cartId = null;
  }

  getCartId(): string | null {
    return this.cartId;
  }

  getTotalQuantity(): number {
    const items = this.itemsSubject.getValue();
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }
  get totalItems$() {
  return this.items$.pipe(
    map(items => items.reduce((acc, item) => acc + item.quantity, 0))
  );
}
increaseQuantity(itemId: string) {
  const items = this.itemsSubject.value.map(item => {
    if (item.id === itemId) {
      return { ...item, quantity: item.quantity + 1 };
    }
    return item;
  });
  this.itemsSubject.next(items);
}

decreaseQuantity(itemId: string) {
  let items = this.itemsSubject.value.map(item => {
    if (item.id === itemId && item.quantity > 1) {
      return { ...item, quantity: item.quantity - 1 };
    }
    return item;
  });

  // supprime l'article si quantité = 0
  items = items.filter(item => item.quantity > 0);

  this.itemsSubject.next(items);
}

}

