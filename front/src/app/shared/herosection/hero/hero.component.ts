import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent  {
  currentIndex = 0;

  slides = [
    {
      title: 'Les Meilleures Offres Tech',
      text: 'Découvrez notre sélection d\'électroniques et technologies de pointe',
      image: 'https://png.pngtree.com/thumb_back/fh260/background/20230704/pngtree-office-essentials-technology-and-gadgets-illustration-featuring-laptop-printer-camera-tablet-image_3748458.jpg'
    },
    {
      title: 'Nouveaux Produits 2025',
      text: 'Explorez les toutes dernières innovations disponibles chez TechStore',
      image: 'https://img.freepik.com/free-photo/high-tech-devices-blue-background-3d-rendering_72104-3873.jpg'
    },
    {
      title: 'Offres Exclusives Été',
      text: 'Profitez des réductions d\'été sur les meilleurs produits électroniques',
      image: 'https://img.freepik.com/free-vector/gradient-technology-background_23-2148884157.jpg'
    }
  ];

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }
}
