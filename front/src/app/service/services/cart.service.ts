import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartId: string | null = null;
  private itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private requestService: RequestService) {}

  // ✅ Initialiser le panier (création si pas encore créé)
  async initCart(): Promise<void> {
    if (!this.cartId) {
      const res: any = await firstValueFrom(
        this.requestService.post('cart/create', {})
      );

      console.log('Réponse cart/create:', res); // Debug
      this.cartId = res.id; // OK car res = {id: "..."}

    }
  }

  // ✅ Ajouter un produit au panier
  async addToCart(productId: string, quantity: number = 1): Promise<void> {
    await this.initCart();
    await firstValueFrom(
      this.requestService.post(`cart/${this.cartId}/items`, {
        productId,
        quantity,
      })
    );
    await this.refreshCartItems();
  }

  // ✅ Récupérer le contenu du panier
  async refreshCartItems(): Promise<void> {
    if (!this.cartId) return;
    const cart: any = await firstValueFrom(
      this.requestService.get(`cart/${this.cartId}/items`)
    );
    this.itemsSubject.next(cart.items || []);
  }

  // ✅ Supprimer un produit du panier
  async removeItem(productId: string): Promise<void> {
    if (!this.cartId) return;

    await firstValueFrom(
      this.requestService.request('DELETE', 'cart/items', {
        body: { cartId: this.cartId, productId },
      })
    );

    await this.refreshCartItems();
  }

  // ✅ Vider complètement le panier (garder l’ID mais supprimer les items)
  async clearCart(): Promise<void> {
    if (!this.cartId) return;
    await firstValueFrom(
      this.requestService.delete(`cart/${this.cartId}/items`)
    );
    this.itemsSubject.next([]);
  }

  // ✅ Récupérer l'ID du panier
  getCartId(): string | null {
    return this.cartId;
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

  // ⚠️ Version locale (ne touche pas au backend)
  increaseQuantity(itemId: string) {
    const items = this.itemsSubject.value.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    this.itemsSubject.next(items);
  }

  decreaseQuantity(itemId: string) {
    let items = this.itemsSubject.value.map((item) => {
      if (item.id === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    items = items.filter((item) => item.quantity > 0);
    this.itemsSubject.next(items);
  }
}
