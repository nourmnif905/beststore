import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { AddprodComponent } from '../admin/model/addprod/addprod.component';
import { RequestService } from 'src/app/service/request.service';
import { ProductCardComponent } from "../../product/product-card/product-card/product-card.component";
import { EditProdComponent } from '../admin/model/editprod/editprod.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-produits-component',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    ReactiveFormsModule,
    AddprodComponent,
    ProductCardComponent,
    EditProdComponent
  ],
})
export class ProduitsComponent implements OnInit {

  categories: any[] = [];
  productsByCategory: { [key: string]: any[] } = {};

  // gestion modals
  modalOuvert = false;          // modal d'ajout
  modalEditOuvert = false;      // modal d'édition
  produitSelectionne: any = null; // produit en cours d'édition

  constructor(private requestService: RequestService ,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();
  }

  // 🔹 Charger toutes les catégories
  loadCategories() {
    this.requestService.get('category/get_all').subscribe((res: any) => {
      this.categories = res;
    });
  }

  // 🔹 Charger tous les produits et les ranger par catégorie
  loadAllProducts() {
    this.requestService.get('products/get_all').subscribe((res: any) => {
      this.productsByCategory = {}; 
      res.forEach((prod: any) => {
        const cat = prod.categoryName;
        if (!this.productsByCategory[cat]) {
          this.productsByCategory[cat] = [];
        }
        this.productsByCategory[cat].push(prod);
      });
    });
  }

  // 🔹 Ouvrir modal édition
  modifierProduit(prod: any) {
    this.produitSelectionne = { ...prod }; 
    this.modalEditOuvert = true;
  }

  // 🔹 Fermer modal édition
  fermerModalEdit() {
    this.modalEditOuvert = false;
    this.produitSelectionne = null;
  }

  // 🔹 Mettre à jour produit après édition
  onProduitModifie(updatedProd: any) {
    const catName = updatedProd.categoryName;
    if (this.productsByCategory[catName]) {
      this.productsByCategory[catName] =
        this.productsByCategory[catName].map((p: any) =>
          p.id === updatedProd.id ? updatedProd : p
        );
    }
    this.fermerModalEdit();
  }

  // 🔹 Supprimer produit
  supprimerProduit(prod: any) {
    if (confirm(`Voulez-vous vraiment supprimer ${prod.name} ?`)) {
      this.requestService.delete(`products/delete/${prod.id}`).subscribe(() => {
        this.productsByCategory[prod.categoryName] =
          this.productsByCategory[prod.categoryName].filter((p: any) => p.id !== prod.id);
      });
    }
  }

  // 🔹 Gestion modal d'ajout
  ouvrirModal() {
    this.modalOuvert = true;
  }

  fermerModal = () => {
    this.modalOuvert = false;
  }

  toggleModal() {
    this.modalOuvert = !this.modalOuvert;
  }

  // 🔹 Ajouter produit à la liste
  // 🔹 Ajouter produit à la liste
ajouterProduit(produit: any) {
  const cat = produit.categoryName;
  if (!this.productsByCategory[cat]) {
    this.productsByCategory[cat] = [];
  }
  this.productsByCategory[cat].push(produit);

  // Fermer le modal
  this.modalOuvert = false;

  // Afficher le toast si tu veux
  this.toastr.success('Produit ajouté avec succès !');
}

}
