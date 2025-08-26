import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/service/request.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ProductPageComponent } from '../product/product-page/product-page/product-page.component';
import { ProductCardComponent } from '../product/product-card/product-card/product-card.component';

@Component({
  selector: 'app-category-component',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  standalone: true,
  imports: [ProductPageComponent, ReactiveFormsModule, CommonModule, ProductCardComponent],
})
export class CategoryComponent implements OnInit {
  products: any[] = [];
  attributes: any[] = [];
  filterForm!: FormGroup;
  maxLimit: number = 10000;
  categorySlug: string | null = null;
  categoryId!: string; // sera défini dynamiquement

  selectedAttributes: { [key: string]: string[] } = {};

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMaxPrice();

    this.route.paramMap.subscribe(params => {
      this.categorySlug = params.get('categorySlug');
      if (this.categorySlug) {
        this.loadCategory(); // 🔥 récupérer l'ID dynamique
      }

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

  loadCategory(): void {
    this.requestService.get('category/get_all').subscribe({
      next: (categories: any[]) => {
        const category = categories.find(c => c.name === this.categorySlug);
        if (category) {
          this.categoryId = category.id;
          this.loadAttributesAndSpecs();
          this.loadProducts(); // charger les produits après avoir défini l'ID
        }
      },
      error: err => console.error('Erreur chargement categories', err)
    });
  }

  loadAttributesAndSpecs(): void {
    this.requestService.get(`category-attributes/category/${this.categoryId}`).subscribe({
      next: (res: any[]) => {
        console.log(res);
        
        this.attributes = res.map(attr => ({ ...attr, open: false, values: [] }));

        this.attributes.forEach(attr => {
          this.requestService.get(`product-specification/by-attribute/${attr.id}`).subscribe({
            next: (specs: any[]) => {
              console.log(specs);
              
              attr.values = specs.map(s => ({
                value: s.value ,
                //count: s.count || 0
              }));
            },
            error: err => console.error('Erreur chargement valeurs attr', attr.id, err),
          });
        });
      },
      error: err => console.error('Erreur chargement attributs', err)
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
    if (!this.categoryId) return; // attendre que l'ID soit défini

    const filters = {
      prefix: this.filterForm.value.prefix,
      minPrice: this.filterForm.value.minPrice,
      maxPrice: this.filterForm.value.maxPrice,
      orderBy: this.filterForm.value.orderBy,
      categoryName: this.categorySlug,
      attributes: this.selectedAttributes
    };

    this.requestService.get('products/search-filter', filters).subscribe({
      next: (res: any) => (this.products = res),
      error: (err) => console.error('Erreur lors du fetch produits', err),
    });
  }

  onAttributeChange(attrId: string, value: string, event: any) {
    if (!this.selectedAttributes[attrId]) {
      this.selectedAttributes[attrId] = [];
    }

    if (event.target.checked) {
      this.selectedAttributes[attrId].push(value);
    } else {
      this.selectedAttributes[attrId] = this.selectedAttributes[attrId].filter(v => v !== value);
    }

    this.loadProducts();
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
