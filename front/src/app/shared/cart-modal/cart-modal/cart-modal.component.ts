import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from 'src/app/service/services/cart.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NumberValidator } from '../../validators/number.validator';
import { emailValidator } from '../../validators/email.validators';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/service/request.service';
import { forkJoin, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class CartModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  cartItems: any[] = [];
  showConfirmForm = false;
  totalPrice = 0;

  orderForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, emailValidator()]),
    phone: new FormControl('', [Validators.required, Validators.minLength(8), NumberValidator.onlyNumbers]),
    localisation: new FormControl('', Validators.required),
  });

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    // Charger le panier depuis le service
    this.cartItems = this.cartService.getItems();
    this.updateTotal();

    // Mettre à jour à chaque changement
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.updateTotal();
    });
  }

  updateTotal() {
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }

  get nameControl(): FormControl { return this.orderForm.get('name') as FormControl; }
  get emailControl(): FormControl { return this.orderForm.get('email') as FormControl; }
  get phoneControl(): FormControl { return this.orderForm.get('phone') as FormControl; }
  get localisationControl(): FormControl { return this.orderForm.get('localisation') as FormControl; }

  increaseQuantity(item: any) { this.cartService.increaseQuantity(item.product.id); }
  decreaseQuantity(item: any) { this.cartService.decreaseQuantity(item.product.id); }
  removeFromCart(productId: string) {
  this.cartService.removeItem(productId);
}
  onCloseClick() { this.close.emit(); }
  toggleConfirmForm() { this.showConfirmForm = !this.showConfirmForm; }

  async confirmOrder() {
  if (this.orderForm.invalid || this.cartService.isEmpty()) {
    this.toastr.error('Veuillez remplir tous les champs et avoir au moins un produit dans le panier.');
    return;
  }

  try {
    // 1️⃣ Créer le panier dans le backend
    const cartRes: any = await this.requestService.post('cart/create', {}).toPromise();
    const cartId = cartRes.id;

    if (!cartId) throw new Error('Impossible de créer le panier');

    // 2️⃣ Envoyer tous les items du localStorage vers le backend
    const localItems = this.cartService.getItems();
    for (const item of localItems) {
      const payload = {
        cartId: cartId,
        productId: item.product.id,   // ou item.productId selon ton CartModel
        quantity: item.quantity
      };

      await this.requestService.post('cart/add/items', payload).toPromise();
    }

    // 3️⃣ Créer la commande
    const orderData = {
      name: this.nameControl.value,
      mail: this.emailControl.value,
      phoneNumber: Number(this.phoneControl.value),
      localisation: this.localisationControl.value,
      cartId,
      status: 'PENDING'
    };

    await this.requestService.post('commandes/create', orderData).toPromise();

    // 4️⃣ Nettoyer le panier local
    this.cartService.clearCart();
    this.orderForm.reset();
    this.showConfirmForm = false;
    this.onCloseClick();

    this.toastr.success('Commande envoyée avec succès', 'Succès');
  } catch (err) {
    console.error('Erreur confirmOrder :', err);
    this.toastr.error('Erreur lors de l’envoi de la commande');
  }
}

}
