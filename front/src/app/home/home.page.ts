import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ProductPageComponent } from '../shared/product/product-page/product-page/product-page.component';
import { HeaderComponent } from "../shared/header/header/header.component";
import { HeroComponent } from "../shared/herosection/hero/hero.component";
import { FooterComponent } from "../shared/footer/footer/footer.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [ IonContent, ProductPageComponent, HeaderComponent, HeroComponent, FooterComponent],
})
export class HomePage {
  constructor() {}
}
