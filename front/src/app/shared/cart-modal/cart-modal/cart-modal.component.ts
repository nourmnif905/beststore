import { Component, OnInit ,Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from 'src/app/service/services/cart.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NumberValidator } from '../../validators/number.validator';
import { emailValidator } from '../../validators/email.validators';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/service/request.service';

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
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    });
  }

  get nameControl(): FormControl { return this.orderForm.get('name') as FormControl; }
  get emailControl(): FormControl { return this.orderForm.get('email') as FormControl; }
  get phoneControl(): FormControl { return this.orderForm.get('phone') as FormControl; }
  get localisationControl(): FormControl { return this.orderForm.get('localisation') as FormControl; }

  increaseQuantity(item: any) { this.cartService.increaseQuantity(item.id); }
  decreaseQuantity(item: any) { this.cartService.decreaseQuantity(item.id); }
  removeFromCart(itemId: string) { this.cartService.removeItem(itemId); }
  onCloseClick() { this.close.emit(); }
  toggleConfirmForm() { this.showConfirmForm = !this.showConfirmForm; }

  confirmOrder() {
  if (this.orderForm.invalid || this.cartItems.length === 0) {
    this.toastr.error('Veuillez remplir tous les champs et avoir au moins un produit dans le panier.');
    return;
  }

  const cartId = this.cartService.getCartId();
  if (!cartId) {
    this.toastr.error('Aucun panier trouvé, veuillez réessayer.');
    return;
  }

  const orderData = {
    name: this.nameControl.value,
    mail: this.emailControl.value,
    phoneNumber: Number(this.phoneControl.value),
    localisation: this.localisationControl.value,
    cartId: cartId,   // ✅ Vrai ID du panier
    status: 'PENDING',
  };

  this.requestService.post('commandes/create', orderData).subscribe({
    next: (res) => {
      this.cartService.clearCart();
      this.orderForm.reset();
      this.showConfirmForm = false;
      this.onCloseClick();
      this.toastr.success('Commande envoyée avec succès', 'Succès');
      console.log('Commande créée :', res);
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Erreur lors de l’envoi de la commande');
    }
  });
}

}
