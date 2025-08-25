import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RequestService } from 'src/app/service/request.service';
import { ProductCardComponent } from 'src/app/shared/product/product-card/product-card/product-card.component';

@Component({
  selector: 'app-mobile-products',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, ProductCardComponent],
  standalone: true,
})
export class MobileComponent implements OnInit {
  products: any[] = [];
  filterForm!: FormGroup;
  maxLimit: number = 10000;

  ngOnInit(): void {
    this.initForm();
    this.loadMaxPrice();
    this.loadProducts();

    this.filterForm.valueChanges.subscribe(() => this.loadProducts());
  }

  constructor(private requestService: RequestService) {}

  initForm(): void {
    this.filterForm = new FormGroup({
      prefix: new FormControl(''),
      minPrice: new FormControl(0),
      maxPrice: new FormControl(this.maxLimit),
      orderBy: new FormControl('price_asc'),
    });
  }

  loadMaxPrice(): void {
    this.requestService.get('products/max-price').subscribe({
      next: (res: any) => {
        this.maxLimit = res.max || 10000;
        this.filterForm.get('maxPrice')?.setValue(this.maxLimit);
      },
      error: (err) => console.error('Erreur max-price', err),
    });
  }

  loadProducts(): void {
    const filters = {
      prefix: this.filterForm.value.prefix,
      minPrice: this.filterForm.value.minPrice,
      maxPrice: this.filterForm.value.maxPrice,
      orderBy: this.filterForm.value.orderBy as
        'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'in_stock',
    };

    console.log('Param filtres API :', filters);
    this.requestService.get('products/search-filter', filters).subscribe({
      next: (res: any) => (this.products = res),
      error: (err) => console.error('Erreur lors du fetch produits', err),
    });
  }

  onMinPriceChange(event: any): void {
    const value = +event.target.value;
    this.filterForm.get('minPrice')?.setValue(value);
  }

  onMaxPriceChange(event: any): void {
    const value = +event.target.value;
    this.filterForm.get('maxPrice')?.setValue(value);
  }

  getMinBubblePosition(): string {
    const min = this.filterForm.value.minPrice;
    return `${(min / this.maxLimit) * 100}%`;
  }

  getMaxBubblePosition(): string {
    const max = this.filterForm.value.maxPrice;
    return `${(max / this.maxLimit) * 100}%`;
  }

  getSliderRangeStyle(): any {
    const min = this.filterForm.value.minPrice;
    const max = this.filterForm.value.maxPrice;
    const left = (min / this.maxLimit) * 100;
    const right = (max / this.maxLimit) * 100;

    return {
      left: `${left}%`,
      width: `${right - left}%`,
    };
  }
}
