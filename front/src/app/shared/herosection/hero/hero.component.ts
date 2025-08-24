import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  imports: [CommonModule]
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
    this.bindEvents();
    this.startAutoPlay();

    setTimeout(() => {
      this.addTouchSupport();
    }, 100);
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  bindEvents(): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });

    setTimeout(() => {
      const carousel = document.querySelector('.hero-carousel');
      if (carousel) {
        carousel.addEventListener('mouseenter', () => {
          this.stopAutoPlay();
        });
        carousel.addEventListener('mouseleave', () => {
          this.startAutoPlay();
        });
      }
    }, 100);
  }

  nextSlide(): void {
    if (this.isAnimating) return;
    const nextSlide = this.currentSlide === this.totalSlides ? 1 : this.currentSlide + 1;
    this.goToSlide(nextSlide);
  }

  prevSlide(): void {
    if (this.isAnimating) return;
    const prevSlide = this.currentSlide === 1 ? this.totalSlides : this.currentSlide - 1;
    this.goToSlide(prevSlide);
  }

  goToSlide(slideNumber: number): void {
    if (this.isAnimating || slideNumber === this.currentSlide) return;

    this.isAnimating = true;

    const currentSlideElement = document.querySelector(`.carousel-slide[data-slide="${this.currentSlide}"]`) as HTMLElement;
    const nextSlideElement = document.querySelector(`.carousel-slide[data-slide="${slideNumber}"]`) as HTMLElement;

    if (!currentSlideElement || !nextSlideElement) {
      this.isAnimating = false;
      return;
    }

    this.updateIndicators(slideNumber);

    const isNext = slideNumber > this.currentSlide || (this.currentSlide === this.totalSlides && slideNumber === 1);

    this.animateSlideTransition(currentSlideElement, nextSlideElement, isNext, () => {
      this.currentSlide = slideNumber;
      this.isAnimating = false;
    });
  }

  animateSlideTransition(currentSlide: HTMLElement, nextSlide: HTMLElement, isNext: boolean, callback: () => void): void {
    nextSlide.style.transform = isNext ? 'translateX(100%)' : 'translateX(-100%)';
    nextSlide.style.opacity = '0';
    nextSlide.style.zIndex = '2';

    nextSlide.offsetHeight;

    requestAnimationFrame(() => {
      currentSlide.style.transform = isNext ? 'translateX(-100%)' : 'translateX(100%)';
      currentSlide.style.opacity = '0';

      nextSlide.style.transform = 'translateX(0)';
      nextSlide.style.opacity = '1';

      setTimeout(() => {
        currentSlide.classList.remove('active');
        currentSlide.style.transform = 'translateX(100%)';
        currentSlide.style.opacity = '0';
        currentSlide.style.zIndex = '1';

        nextSlide.classList.add('active');
        nextSlide.style.zIndex = '2';

        callback();
      }, 800);
    });
  }

  updateIndicators(activeSlide: number): void {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index + 1 === activeSlide);
    });
  }

  startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
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
    if (!carousel) return;

    carousel.addEventListener('touchstart', (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    carousel.addEventListener('touchend', (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }
    }, { passive: true });
  }

  onPrevClick(): void {
    this.prevSlide();
  }

  onNextClick(): void {
    this.nextSlide();
  }

  onIndicatorClick(slideNumber: number): void {
    this.goToSlide(slideNumber);
  }

  onCtaClick(slideType: string): void {
    switch (slideType) {
      case 'tech':
        break;
      case 'gaming':
        break;
      case 'smart-home':
        break;
    }
  }

  isIndicatorActive(slideNumber: number): boolean {
    return this.currentSlide === slideNumber;
  }

  getSlideClass(slideNumber: number): string {
    const isActive = slideNumber === this.currentSlide;
    return isActive ? 'carousel-slide active' : 'carousel-slide';
  }
}
