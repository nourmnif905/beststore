import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/service/request.service';
import { ProductPageComponent } from "../product/product-page/product-page/product-page.component";
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ProductCardComponent } from '../product/product-card/product-card/product-card.component';

@Component({
  selector: 'app-category-component',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  imports: [ProductPageComponent,TitleCasePipe,ReactiveFormsModule,CommonModule,ProductCardComponent],
})
export class CategoryComponent  implements OnInit {
  products: any[] = [];
  filterForm!: FormGroup;
  maxLimit: number = 10000;
  categorySlug: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) {}

ngOnInit(): void {
  this.initForm(); // d’abord initialiser le formulaire
  this.loadMaxPrice();

  this.route.paramMap.subscribe(params => {
    this.categorySlug = params.get('categorySlug');
    console.log('Slug:', this.categorySlug);

    // Charger les produits **après** avoir récupéré le slug et avoir initialisé le form
    this.loadProducts();

    // Réagir aux changements du filtre
    this.filterForm.valueChanges.subscribe(() => this.loadProducts());
  });
}


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
      categoryName: this.categorySlug
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
