import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from 'src/app/service/request.service';
import { ProductCardComponent } from '../../product-card/product-card/product-card.component';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
  imports: [CommonModule , ReactiveFormsModule, ProductCardComponent],
  standalone: true,
})
export class ProductPageComponent  implements OnInit {

    products: any;

  filterForm = new FormGroup({
    prefix: new FormControl(''),
    minPrice: new FormControl(0),
    maxPrice: new FormControl(15000),
    orderBy: new FormControl('price_asc'),
  });

  get filters() {
    return this.filterForm.value;
  }

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.getProducts();

    this.filterForm.valueChanges.subscribe(() => {
      this.getProducts();
    });
  }

  getProducts() {
    this.requestService.get('products/get_all', this.filters).subscribe({
      next: (res) => {
        console.log(res);

        this.products = res
      },

      error: (err) => console.error('Erreur API :', err),
    });
  }
 minLimit = 0;
maxLimit = 15000;

 onMinPriceChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    const max = this.filterForm.value.maxPrice ?? this.maxLimit;
    this.filterForm.patchValue({
      minPrice: Math.min(value, max)
    });
  }

  onMaxPriceChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    const min = this.filterForm.value.minPrice ?? this.minLimit;
    this.filterForm.patchValue({
      maxPrice: Math.max(value, min)
    });
  }

  getSliderRangeStyle() {
    const min = this.filterForm.value.minPrice ?? 0;
    const max = this.filterForm.value.maxPrice ?? this.maxLimit;
    const left = (min / this.maxLimit) * 100;
    const width = ((max - min) / this.maxLimit) * 100;
    return { left: `${left}%`, width: `${width}%` };
  }

  getMinBubblePosition(): string {
    const min = this.filterForm.value.minPrice ?? 0;
    return `${(min / this.maxLimit) * 100}%`;
  }

  getMaxBubblePosition(): string {
    const max = this.filterForm.value.maxPrice ?? this.maxLimit;
    return `${(max / this.maxLimit) * 100}%`;
  }
}


