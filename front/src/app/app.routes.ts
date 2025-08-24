
import { Routes } from '@angular/router';
import { ProduitsComponent } from './shared/admin/produits/produits.component';
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'mobile',
    loadComponent: () => import('./mobile/mobile/mobile.page').then( m => m.MobilePage)
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then( m => m.AdminPage)
  },
  {
    path: 'produits',
    loadComponent: () => import('./admin/produits/produits.page').then( m => m.ProduitsPage)
  },


];

