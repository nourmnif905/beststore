
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MobileComponent } from 'src/app/shared/mobile/mobile/mobile/mobile.component';
import { HeaderComponent } from "src/app/shared/header/header/header.component";
import { FooterComponent } from "src/app/shared/footer/footer/footer.component";

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.page.html',
  styleUrls: ['./mobile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MobileComponent, HeaderComponent, FooterComponent]
})
export class MobilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}