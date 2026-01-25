/**
 * Scroll Animations Integration - Phase 5.3
 *
 * Combines all scroll-triggered animations and initializes them
 * when the DOM is ready.
 */

import {initScrollAnimations, prefersReducedMotion} from './animations';
import {initCounters} from '../components/interactive/Counter';

/**
 * Adds animation classes to elements based on their data attributes
 */
function applyAnimationClasses(): void {
  // Apply fade-up to elements with data-animate="fade-up"
  document.querySelectorAll('[data-animate]').forEach(element => {
    const animationType = element.getAttribute('data-animate');
    const stagger = element.getAttribute('data-stagger');

    if (animationType) {
      element.classList.add(`animate-${animationType}`);
    }

    if (stagger) {
      element.classList.add(`stagger-${stagger}`);
    }
  });
}

/**
 * Initializes scroll reveal for images
 */
function initImageReveals(): () => void {
  const images = document.querySelectorAll('.image-reveal');
  const cleanups: Array<() => void> = [];

  images.forEach(image => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.2},
    );

    observer.observe(image);
    cleanups.push(() => observer.disconnect());
  });

  return () => cleanups.forEach(cleanup => cleanup());
}

/**
 * Initializes bar chart animations
 */
function initBarAnimations(): () => void {
  const bars = document.querySelectorAll<HTMLElement>('[data-animate-bar]');
  const cleanups: Array<() => void> = [];

  bars.forEach(bar => {
    const targetWidth = bar.dataset.animateBar || '0%';
    bar.style.width = '0%';

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Delay for staggered effect
            const delay = parseInt(bar.dataset.animateDelay || '0', 10);
            setTimeout(() => {
              bar.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
              bar.style.width = targetWidth;
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.3},
    );

    observer.observe(bar);
    cleanups.push(() => observer.disconnect());
  });

  return () => cleanups.forEach(cleanup => cleanup());
}

/**
 * Initializes staggered list animations
 */
function initStaggeredLists(): () => void {
  const lists = document.querySelectorAll('[data-stagger-list]');
  const cleanups: Array<() => void> = [];

  lists.forEach(list => {
    const children = list.children;

    Array.from(children).forEach((child, index) => {
      child.classList.add('animate-fade-up');
      child.classList.add(`stagger-${Math.min(index + 1, 5)}`);
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            Array.from(children).forEach(child => {
              child.classList.add('visible');
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.1},
    );

    observer.observe(list);
    cleanups.push(() => observer.disconnect());
  });

  return () => cleanups.forEach(cleanup => cleanup());
}

/**
 * Initializes section header animations
 */
function initSectionHeaders(): () => void {
  const headers = document.querySelectorAll('.section-header');
  const cleanups: Array<() => void> = [];

  headers.forEach(header => {
    if (!header.classList.contains('animate-fade-up')) {
      header.classList.add('animate-fade-up');
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.2},
    );

    observer.observe(header);
    cleanups.push(() => observer.disconnect());
  });

  return () => cleanups.forEach(cleanup => cleanup());
}

/**
 * Main initialization function for all scroll animations
 *
 * @returns Cleanup function to remove all observers
 */
export function initAllScrollAnimations(): () => void {
  // Skip animations for reduced motion preference
  if (prefersReducedMotion()) {
    // Make all animated elements visible immediately
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('visible');
    });
    return () => {};
  }

  const cleanupFunctions: Array<() => void> = [];

  // Apply animation classes first
  applyAnimationClasses();

  // Initialize all animation types
  cleanupFunctions.push(initScrollAnimations());
  cleanupFunctions.push(initCounters());
  cleanupFunctions.push(initImageReveals());
  cleanupFunctions.push(initBarAnimations());
  cleanupFunctions.push(initStaggeredLists());
  cleanupFunctions.push(initSectionHeaders());

  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}

/**
 * Initializes animations when DOM is ready
 */
export function initOnReady(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () =>
      initAllScrollAnimations(),
    );
  } else {
    initAllScrollAnimations();
  }
}
