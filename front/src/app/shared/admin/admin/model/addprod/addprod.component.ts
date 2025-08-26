import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'app-addprod',
  templateUrl: './addprod.component.html',
  styleUrls: ['./addprod.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddprodComponent implements OnInit {
  @Input() existingTitles: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() produitAjoute = new EventEmitter<any>();

  categories: any[] = [];
  categoryAttributes: any[] = [];
  imagePreview: string | null = null;

  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    category: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
    stock: new FormControl(null, [Validators.required, Validators.min(0)])
  });

  constructor(private requestService: RequestService, private toastr: ToastrService) {}

  ngOnInit() {
    this.requestService.get('category/get_all').subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error(err),
    });
  }

  previewImage() {
    this.imagePreview = this.form.get('imageUrl')?.value || null;
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.form.get('imageUrl')?.setValue(this.imagePreview);
      };
      reader.readAsDataURL(file);
    }
  }

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // cast pour accéder à .value
    const categoryId = selectElement.value;

    if (!categoryId) {
      this.categoryAttributes = [];
      return;
    }

    this.requestService.get(`category-attributes/category/${categoryId}`).subscribe({
      next: (res: any) => {
        this.categoryAttributes = res;

        // Ajouter les contrôles dynamiques au formulaire si non existants
        this.categoryAttributes.forEach(attr => {
          if (!this.form.contains(attr.name)) {
            this.form.addControl(attr.name, new FormControl('', Validators.required));
          }
        });
      },
      error: (err) => console.error(err)
    });
  }

  ajouter() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const produit = {
      name: this.form.get('title')?.value,
      description: this.form.get('description')?.value,
      price: this.form.get('price')?.value,
      categoryName: this.categories.find(c => c.id === this.form.get('category')?.value)?.name,
      image: this.form.get('imageUrl')?.value,
      stock: this.form.get('stock')?.value,
      attributes: this.categoryAttributes.reduce((acc, attr) => {
        acc[attr.name] = this.form.get(attr.name)?.value;
        return acc;
      }, {} as any)
    };

    this.requestService.post('products/create', produit).subscribe({
      next: (res) => {
        this.produitAjoute.emit(res);
        this.fermer();
        this.form.reset({ title: '', description: '', price: 0, category: '', imageUrl: '', stock: 0 });
        this.imagePreview = null;
        this.categoryAttributes = [];
      },
      error: () => this.toastr.error('Erreur lors de l’ajout du produit.')
    });
  }

  fermer() {
    this.close.emit();
  }
}
