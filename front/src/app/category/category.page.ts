import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CategoryComponent } from "../shared/category/category.component";
import { HeaderComponent } from "../shared/header/header/header.component";
import { FooterComponent } from "../shared/footer/footer/footer.component";

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CategoryComponent, HeaderComponent, FooterComponent]
})
export class CategoryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
