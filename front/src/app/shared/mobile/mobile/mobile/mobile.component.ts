import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RequestService } from 'src/app/service/requestservice';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProductCardComponent } from '../../product/product-card/product-card/product-card.component';


@Component({
  selector: 'app-mobile-products',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss'],
  imports: [ReactiveFormsModule, CommonModule , ProductCardComponent]
})

export class MobileComponent implements OnInit {
  products: any[] = [];
  filterForm!: FormGroup;
  maxLimit: number = 10000;

  constructor(private fb: FormBuilder, private requestService: RequestService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMaxPrice();
    this.loadProducts();

    // ⏱ Écouter chaque changement pour auto-rechercher
    this.filterForm.valueChanges.subscribe(() => this.loadProducts());
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      prefix: [''],
      minPrice: [0],
      maxPrice: [this.maxLimit],
      orderBy: ['price_asc'],
    });
  }

  loadMaxPrice(): void {
    this.requestService.get('products/max-price').subscribe({
      next: (res: any) => {
        this.maxLimit = res.max || 10000;
        this.filterForm.patchValue({ maxPrice: this.maxLimit });
      },
      error: (err) => console.error('Erreur max-price', err),
    });
  }

  loadProducts(): void {
    const filters = this.filterForm.value;

    const queryParams = {
  prefix: filters.prefix,
  minPrice: filters.minPrice,
  maxPrice: filters.maxPrice,
  orderBy: filters.orderBy,
};

    console.log('Param filtres API :', queryParams);
    this.requestService.get('products/search-filter', queryParams).subscribe({
      next: (res: any) => (this.products = res),
      error: (err) => console.error('Erreur lors du fetch produits', err),
    });
  }

  // 🔵 Slider gauche
  onMinPriceChange(event: any): void {
    const value = +event.target.value;
    this.filterForm.patchValue({ minPrice: value });
  }

  // 🔵 Slider droit
  onMaxPriceChange(event: any): void {
    const value = +event.target.value;
    this.filterForm.patchValue({ maxPrice: value });
  }

  // 🎯 Calcul position de la bulle gauche
  getMinBubblePosition(): string {
    const min = this.filterForm.value.minPrice;
    return `${(min / this.maxLimit) * 100}%`;
  }

  // 🎯 Calcul position de la bulle droite
  getMaxBubblePosition(): string {
    const max = this.filterForm.value.maxPrice;
    return `${(max / this.maxLimit) * 100}%`;
  }

  // 🟦 Style de la zone bleue entre les 2 sliders
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
