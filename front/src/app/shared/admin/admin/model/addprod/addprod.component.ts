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
  imagePreview: string | null = null;

  // 🔹 FormGroup avec validations
  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    category: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
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

  ajouter() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // ⚡ marque tous les champs pour afficher les erreurs
      return;
    }

    const produit = {
      name: this.form.get('title')?.value,
      description: this.form.get('description')?.value,
      price: this.form.get('price')?.value,
      categoryName: this.categories.find(c => c.id === this.form.get('category')?.value)?.name,
      image: this.form.get('imageUrl')?.value,
    };

    this.requestService.post('products/create', produit).subscribe({
      next: (res) => {
        this.produitAjoute.emit(res);
        this.fermer();
        this.form.reset({ title: '', description: '', price: 0, category: '', imageUrl: '' });
        this.imagePreview = null;
      },
      error: () => this.toastr.error('Erreur lors de l’ajout du produit.'),
    });
  }

  fermer() {
    this.close.emit();
  }
  
}
