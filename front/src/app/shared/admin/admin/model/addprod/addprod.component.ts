import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { RequestService } from 'src/app/service/request.service';
@Component({
  selector: 'app-addprod',
  templateUrl: './addprod.component.html',
  styleUrls: ['./addprod.component.scss'],
  imports: [CommonModule,ReactiveFormsModule],
})
export class AddprodComponent   {
title = new FormControl('', Validators.required);
  description = new FormControl('');
  price = new FormControl(0, [Validators.required, Validators.min(0)]);
  category = new FormControl('', Validators.required);
  imageUrl = new FormControl('');

  categories: any[] = [];
  
  imagePreview: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() produitAjoute = new EventEmitter<any>();
  constructor(private requestService: RequestService) {}

  ngOnInit() {
    this.requestService.get('category/get_all').subscribe({
      next: (res) => {
        this.categories = res; // si ton API renvoie { data: [...] } adapte -> res.data
      },
      error: (err) => console.error('Erreur récupération catégories:', err)
    });
  }
  previewImage(event: any) {
    this.imagePreview = this.imageUrl.value;
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.imageUrl.setValue(this.imagePreview);
      };
      reader.readAsDataURL(file);
    }
  }

  ajouter() {
    if (this.title.valid && this.price.valid && this.category.valid) {
      const produit = {
        title: this.title.value,
        description: this.description.value,
        price: this.price.value,
        category: this.category.value,
        image: this.imageUrl.value
      };
      this.produitAjoute.emit(produit);
      this.fermer();
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  fermer() {
    this.close.emit();
  }

}
