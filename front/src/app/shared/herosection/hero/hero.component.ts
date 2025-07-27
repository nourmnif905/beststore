import { Component, OnInit , OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  imports:[CommonModule]
})

export class HeroComponent implements OnInit, OnDestroy {

  currentSlide: number = 1;
  totalSlides: number = 3;
  isAnimating: boolean = false;
  autoPlayInterval: any = null;
  autoPlayDelay: number = 3000; 

  slides = [
    {
      id: 1,
      title: 'Les Meilleures Offres Tech',
      subtitle: 'Découvrez notre sélection d\'électroniques et technologies de pointe',
      buttonText: 'Voir les promotions',
      buttonIcon: 'fas fa-tags',
      type: 'tech'
    },
    {
      id: 2,
      title: 'Gaming & Streaming Setup',
      subtitle: 'Équipez-vous avec les derniers accessoires gaming et streaming professionnels',
      buttonText: 'Découvrir la collection',
      buttonIcon: 'fas fa-gamepad',
      type: 'gaming'
    },
    {
      id: 3,
      title: 'Smart Home Revolution',
      subtitle: 'Transformez votre maison en espace intelligent avec nos solutions connectées',
      buttonText: 'Explorer les solutions',
      buttonIcon: 'fas fa-home',
      type: 'smart-home'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    console.log('Hero Carousel initialisé');
    this.bindEvents();
    this.startAutoPlay();
    
    
    setTimeout(() => {
      this.addTouchSupport();
      console.log('Support tactile ajouté');
    }, 100);
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  bindEvents(): void {
    console.log('Événements liés');
    
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        console.log('Flèche gauche pressée');
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        console.log('Flèche droite pressée');
        this.nextSlide();
      }
    });

    
    setTimeout(() => {
      const carousel = document.querySelector('.hero-carousel');
      if (carousel) {
        carousel.addEventListener('mouseenter', () => {
          console.log('Mouse enter - pause auto-play');
          this.stopAutoPlay();
        });
        carousel.addEventListener('mouseleave', () => {
          console.log('Mouse leave - reprendre auto-play');
          this.startAutoPlay();
        });
      }
    }, 100);
  }

  nextSlide(): void {
    console.log('Next slide appelé, slide actuel:', this.currentSlide);
    if (this.isAnimating) {
      console.log('Animation en cours, annulation');
      return;
    }
    
    const nextSlide = this.currentSlide === this.totalSlides ? 1 : this.currentSlide + 1;
    console.log('Prochain slide:', nextSlide);
    this.goToSlide(nextSlide);
  }

  prevSlide(): void {
    console.log('Prev slide appelé, slide actuel:', this.currentSlide);
    if (this.isAnimating) {
      console.log('Animation en cours, annulation');
      return;
    }
    
    const prevSlide = this.currentSlide === 1 ? this.totalSlides : this.currentSlide - 1;
    console.log('Slide précédent:', prevSlide);
    this.goToSlide(prevSlide);
  }

  goToSlide(slideNumber: number): void {
    console.log('GoToSlide appelé pour slide:', slideNumber);
    
    if (this.isAnimating || slideNumber === this.currentSlide) {
      console.log('Pas de changement nécessaire');
      return;
    }
    
    this.isAnimating = true;
    console.log('Animation démarrée');
    
    const currentSlideElement = document.querySelector(`.carousel-slide[data-slide="${this.currentSlide}"]`) as HTMLElement;
    const nextSlideElement = document.querySelector(`.carousel-slide[data-slide="${slideNumber}"]`) as HTMLElement;
    
    console.log('Éléments trouvés:', {
      current: currentSlideElement ? 'trouvé' : 'non trouvé',
      next: nextSlideElement ? 'trouvé' : 'non trouvé'
    });
    
    if (!currentSlideElement || !nextSlideElement) {
      console.error('Éléments slides non trouvés');
      this.isAnimating = false;
      return;
    }
    
    
    this.updateIndicators(slideNumber);
    
    
    const isNext = slideNumber > this.currentSlide || (this.currentSlide === this.totalSlides && slideNumber === 1);
    console.log('Direction:', isNext ? 'suivant' : 'précédent');
    
    
    this.animateSlideTransition(currentSlideElement, nextSlideElement, isNext, () => {
      this.currentSlide = slideNumber;
      this.isAnimating = false;
      console.log('Animation terminée, nouveau slide:', this.currentSlide);
    });
  }

  animateSlideTransition(currentSlide: HTMLElement, nextSlide: HTMLElement, isNext: boolean, callback: () => void): void {
    
    nextSlide.style.transform = isNext ? 'translateX(100%)' : 'translateX(-100%)';
    nextSlide.style.opacity = '0';
    nextSlide.style.zIndex = '2';
    
  
    nextSlide.offsetHeight;
    
    requestAnimationFrame(() => {
      console.log('Animation frame');
      
    
      currentSlide.style.transform = isNext ? 'translateX(-100%)' : 'translateX(100%)';
      currentSlide.style.opacity = '0';
      
      
      nextSlide.style.transform = 'translateX(0)';
      nextSlide.style.opacity = '1';
      
      
      setTimeout(() => {
        console.log('Nettoyage animation');
        currentSlide.classList.remove('active');
        currentSlide.style.transform = 'translateX(100%)';
        currentSlide.style.opacity = '0';
        currentSlide.style.zIndex = '1';
        
        // Définir le slide suivant comme actif
        nextSlide.classList.add('active');
        nextSlide.style.zIndex = '2';
        
        callback()
      }, 800); 
    });
  }

  updateIndicators(activeSlide: number): void {
    console.log('Mise à jour indicateurs pour slide:', activeSlide);
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index + 1 === activeSlide);
    });
  }

  startAutoPlay(): void {
    this.stopAutoPlay(); 
    console.log('Auto-play démarré');
    this.autoPlayInterval = setInterval(() => {
      console.log('Auto-play tick');
      this.nextSlide();
    }, this.autoPlayDelay);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      console.log('Auto-play arrêté');
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  addTouchSupport(): void {
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    
    const carousel = document.querySelector('.hero-carousel') as HTMLElement;
    if (!carousel) {
      console.log('Carousel non trouvé pour le support tactile');
      return;
    }
    
    console.log('Support tactile ajouté au carousel');
    
    carousel.addEventListener('touchstart', (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Gérer seulement les swipes horizontaux
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        console.log('Swipe détecté:', deltaX > 0 ? 'droite' : 'gauche');
        if (deltaX > 0) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }
    }, { passive: true });
  }


  onPrevClick(): void {
    console.log('Bouton précédent cliqué');
    this.prevSlide();
  }

  onNextClick(): void {
    console.log('Bouton suivant cliqué');
    this.nextSlide();
  }

  onIndicatorClick(slideNumber: number): void {
    console.log('Indicateur cliqué pour slide:', slideNumber);
    this.goToSlide(slideNumber);
  }

  onCtaClick(slideType: string): void {
    console.log(`CTA cliqué pour type: ${slideType}`);
    
    switch (slideType) {
      case 'tech':
        console.log('Navigation vers promotions');
        
        break;
      case 'gaming':
        console.log('Navigation vers gaming');
        
        break;
      case 'smart-home':
        console.log('Navigation vers smart home');
        
        break;
    }
  }

  // Getter pour vérifier si un indicateur est actif
  isIndicatorActive(slideNumber: number): boolean {
    return this.currentSlide === slideNumber;
  }

  // Getter pour les classes CSS du slide
  getSlideClass(slideNumber: number): string {
    const isActive = slideNumber === this.currentSlide;
    console.log(`Slide ${slideNumber} classe:`, isActive ? 'active' : 'inactive');
    return isActive ? 'carousel-slide active' : 'carousel-slide';
  }
}