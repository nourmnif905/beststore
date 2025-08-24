import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AdminComponent } from "src/app/shared/admin/admin/admin.component";
import { ProduitsComponent } from "src/app/shared/admin/produits/produits.component";
import { SidbarComponent } from "src/app/shared/admin/sidbar/sidbar.component";

@Component({
  selector: 'app-produits',
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, AdminComponent, ProduitsComponent, SidbarComponent]
})
export class ProduitsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
