/**
 * Animation utilities using Intersection Observer - Phase 2.5
 *
 * Provides scroll-triggered animations for the scrollytelling experience.
 */

import type {AnimationType, ObserverOptions} from '../types';

/**
 * Default options for the intersection observer
 */
export const DEFAULT_OBSERVER_OPTIONS: Required<ObserverOptions> = {
  threshold: 0.1,
  rootMargin: '0px',
  once: true,
  root: null,
};

/**
 * Creates an Intersection Observer for scroll-triggered animations
 *
 * @param callback - Function to call when element intersects
 * @param options - Observer configuration options
 * @returns The configured IntersectionObserver instance
 */
export function createScrollObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: ObserverOptions = {},
): IntersectionObserver {
  const {threshold, rootMargin, once, root} = {
    ...DEFAULT_OBSERVER_OPTIONS,
    ...options,
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
          if (once) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    {
      threshold,
      rootMargin,
      root,
    },
  );

  return observer;
}

/**
 * Applies the 'visible' class when element enters viewport
 *
 * @param element - The element to observe
 * @param options - Observer configuration options
 * @returns Cleanup function to disconnect the observer
 */
export function observeElement(
  element: Element,
  options: ObserverOptions = {},
): () => void {
  const observer = createScrollObserver(entry => {
    entry.target.classList.add('visible');
  }, options);

  observer.observe(element);

  return () => observer.disconnect();
}

/**
 * Observes multiple elements and applies 'visible' class on intersection
 *
 * @param elements - NodeList or array of elements to observe
 * @param options - Observer configuration options
 * @returns Cleanup function to disconnect all observers
 */
export function observeElements(
  elements: NodeListOf<Element> | Element[],
  options: ObserverOptions = {},
): () => void {
  const observer = createScrollObserver(entry => {
    entry.target.classList.add('visible');
  }, options);

  elements.forEach(element => observer.observe(element));

  return () => observer.disconnect();
}

/**
 * Gets the CSS class name for an animation type
 *
 * @param type - The animation type
 * @returns The corresponding CSS class name
 */
export function getAnimationClass(type: AnimationType): string {
  const classMap: Record<AnimationType, string> = {
    'fade-up': 'animate-fade-up',
    'fade-in': 'animate-fade-in',
    'scale-up': 'animate-scale-up',
    'slide-left': 'animate-slide-left',
    'slide-right': 'animate-slide-right',
  };

  return classMap[type];
}

/**
 * Gets the stagger delay class for an index
 *
 * @param index - The element index (0-based)
 * @returns The stagger delay class or empty string
 */
export function getStaggerClass(index: number): string {
  if (index < 1 || index > 5) return '';
  return `stagger-${index}`;
}

/**
 * Initializes scroll animations for all elements with data-animate attribute
 *
 * Usage in HTML:
 * <div data-animate="fade-up" data-stagger="1">Content</div>
 *
 * @param container - Optional container to search within (defaults to document)
 * @returns Cleanup function to disconnect all observers
 */
export function initScrollAnimations(
  container: Element | Document = document,
): () => void {
  // Find the scroll container for proper intersection observation
  const scrollContainer =
    container instanceof Document
      ? container.querySelector('main.scroll-snap-y.h-screen')
      : null;

  const observer = createScrollObserver(
    entry => {
      entry.target.classList.add('visible');
    },
    {
      // Use the scroll container as root if it exists
      ...(scrollContainer ? {root: scrollContainer as Element} : {}),
    },
  );

  // Observe elements with data-animate attribute
  const dataAnimatedElements = container.querySelectorAll('[data-animate]');
  dataAnimatedElements.forEach(element => {
    const animationType = element.getAttribute('data-animate') as AnimationType;
    const staggerIndex = element.getAttribute('data-stagger');

    // Add the animation class
    if (animationType) {
      element.classList.add(getAnimationClass(animationType));
    }

    // Add stagger delay if specified
    if (staggerIndex) {
      const staggerClass = getStaggerClass(parseInt(staggerIndex, 10));
      if (staggerClass) {
        element.classList.add(staggerClass);
      }
    }

    observer.observe(element);
  });

  // Also observe elements that already have animation classes applied directly
  const animationClasses = [
    'animate-fade-up',
    'animate-fade-in',
    'animate-scale-up',
    'animate-slide-left',
    'animate-slide-right',
  ];

  animationClasses.forEach(animClass => {
    const elements = container.querySelectorAll(`.${animClass}:not(.visible)`);
    elements.forEach(element => {
      // Only observe if not already observed via data-animate
      if (!element.hasAttribute('data-animate')) {
        observer.observe(element);
      }
    });
  });

  return () => observer.disconnect();
}

/**
 * Checks if the user prefers reduced motion
 *
 * @returns true if the user has requested reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Easing function for smooth animations (ease-out-expo)
 *
 * @param t - Progress value from 0 to 1
 * @returns Eased value from 0 to 1
 */
export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Easing function for bounce effect (ease-out-back)
 *
 * @param t - Progress value from 0 to 1
 * @returns Eased value from 0 to 1 (may overshoot slightly)
 */
export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * Linear interpolation between two values
 *
 * @param start - Starting value
 * @param end - Ending value
 * @param t - Progress value from 0 to 1
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
