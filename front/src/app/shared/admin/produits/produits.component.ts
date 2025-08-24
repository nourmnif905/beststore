import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { AddprodComponent } from '../admin/model/addprod/addprod.component';
@Component({
  selector: 'app-produits-component',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.scss'],
 imports: [CommonModule, RouterModule,MatTabsModule,ReactiveFormsModule,AddprodComponent],

})
export class ProduitsComponent   {
  
  modalOuvert = false;

  produits: any[] = [];



  modifierProduit(p: any) {
    console.log('Modifier produit', p);
  }

  ouvrirModal() {
    this.modalOuvert = true;
  }

  fermerModal = () => {
    this.modalOuvert = false;
  }

 
  toggleModal() {
  this.modalOuvert = !this.modalOuvert;
}

ajouterProduit(produit: any) {
  console.log('Produit ajouté:', produit);
  // Ajouter le produit à ta liste
  this.toggleModal();
}
}
  


