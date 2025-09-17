import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommandesComponent } from "src/app/shared/admin/commandes/commandes.component";
import { SidbarComponent } from "src/app/shared/admin/sidbar/sidbar.component";

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.page.html',
  styleUrls: ['./commandes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CommandesComponent, SidbarComponent]
})
export class CommandesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
