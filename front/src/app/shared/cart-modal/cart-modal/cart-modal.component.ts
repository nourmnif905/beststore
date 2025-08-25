import { CommonModule } from '@angular/common';
import { Component, OnInit ,Output, EventEmitter } from '@angular/core';
import { CartService } from 'src/app/service/services/cart.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NumberValidator } from '../../validators/number.validator';
import { emailValidator } from '../../validators/email.validators';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,  // si tu utilises Angular 14+ et standalone components
})
export class CartModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  cartItems: any[] = [];
  showConfirmForm = false;
  totalPrice = 0;
  orderForm = new FormGroup({
    email: new FormControl('', [Validators.required, emailValidator()]),
    phone: new FormControl('', [Validators.required, Validators.minLength(8), NumberValidator.onlyNumbers]),
  });

  constructor(private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
     this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    });
  }
   get emailControl(): FormControl {
    return this.orderForm.get('email') as FormControl;
  }
  get phoneControl(): FormControl {
    return this.orderForm.get('phone') as FormControl;
  }
  increaseQuantity(item: any) {
  this.cartService.increaseQuantity(item.id);
}

decreaseQuantity(item: any) {
  this.cartService.decreaseQuantity(item.id);
}

 

  onCloseClick() {
    this.close.emit();
  }
  removeFromCart(itemId: string) {
    this.cartService.removeItem(itemId);
  }

  toggleConfirmForm() {
    this.showConfirmForm = !this.showConfirmForm;
  }

  confirmOrder() {
  if (this.orderForm.invalid) {
    alert('Veuillez remplir tous les champs correctement');
    return;
  }

  const email = this.orderForm.get('email')?.value;
  const phone = this.orderForm.get('phone')?.value;

  this.cartService.clearCart();
  this.onCloseClick();
  this.orderForm.reset();
  this.showConfirmForm = false;
  this.toastr.success('Commande envoyée avec succès', 'Succès');

  
}

}
