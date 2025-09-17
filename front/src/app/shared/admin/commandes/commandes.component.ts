import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'app-admin-commandes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']
})
export class CommandesComponent implements OnInit {
  commandes: any[] = [];
  loading = false;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.getAllCommandes();
  }

  getAllCommandes() {
    this.loading = true;
    this.requestService.get('commandes/getAllCommandes').subscribe({
      next: (res: any) => {
        this.commandes = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
