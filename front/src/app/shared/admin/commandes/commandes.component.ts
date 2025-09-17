import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from 'src/app/service/request.service';
import { forkJoin } from 'rxjs';

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

        // 🔹 Pour chaque commande, récupérer les produits via son cartId
        const requests = this.commandes.map((commande) =>
          this.requestService.get(`commandes/getProducts/${commande.cartId}`)
        );

        forkJoin(requests).subscribe({
          next: (productsArray: any[]) => {
            console.log('Réponse produits par commande :', productsArray);
            this.commandes = this.commandes.map((commande, i) => ({
              ...commande,
              products: productsArray[i], // ajout des produits
            }));
            this.loading = false;
          },
          error: (err) => {
            console.error('Erreur récupération produits:', err);
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
