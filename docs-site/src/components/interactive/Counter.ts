/**
 * Animated Number Counter - Phase 5.1
 *
 * Provides smooth number counting animation with easing.
 * Triggers on scroll via intersection observer.
 */

import type {CounterOptions} from '../../types';
import {easeOutExpo, prefersReducedMotion} from '../../lib/animations';

/**
 * Default counter options
 */
const DEFAULT_OPTIONS: Required<Omit<CounterOptions, 'target'>> = {
  duration: 2000,
  prefix: '',
  suffix: '',
  decimals: 0,
};

/**
 * Animated counter class that counts from 0 to a target number
 */
export class Counter {
  private element: HTMLElement;
  private target: number;
  private duration: number;
  private prefix: string;
  private suffix: string;
  private decimals: number;
  private startTime: number | null = null;
  private animationId: number | null = null;
  private hasAnimated = false;

  constructor(element: HTMLElement, options: CounterOptions) {
    this.element = element;
    this.target = options.target;
    this.duration = options.duration ?? DEFAULT_OPTIONS.duration;
    this.prefix = options.prefix ?? DEFAULT_OPTIONS.prefix;
    this.suffix = options.suffix ?? DEFAULT_OPTIONS.suffix;
    this.decimals = options.decimals ?? DEFAULT_OPTIONS.decimals;

    // Set initial value
    this.updateDisplay(0);
  }

  /**
   * Formats a number with the specified decimals, prefix, and suffix
   */
  private formatNumber(value: number): string {
    const formatted = value.toFixed(this.decimals);
    return `${this.prefix}${formatted}${this.suffix}`;
  }

  /**
   * Updates the element's text content
   */
  private updateDisplay(value: number): void {
    this.element.textContent = this.formatNumber(value);
  }

  /**
   * Animation frame callback
   */
  private animate = (timestamp: number): void => {
    if (this.startTime === null) {
      this.startTime = timestamp;
    }

    const elapsed = timestamp - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    const easedProgress = easeOutExpo(progress);
    const currentValue = this.target * easedProgress;

    this.updateDisplay(currentValue);

    if (progress < 1) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.updateDisplay(this.target);
      this.hasAnimated = true;
    }
  };

  /**
   * Starts the counting animation
   */
  start(): void {
    if (this.hasAnimated) return;

    // If user prefers reduced motion, show final value immediately
    if (prefersReducedMotion()) {
      this.updateDisplay(this.target);
      this.hasAnimated = true;
      return;
    }

    this.startTime = null;
    this.animationId = requestAnimationFrame(this.animate);
  }

  /**
   * Stops the animation
   */
  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Resets the counter to initial state
   */
  reset(): void {
    this.stop();
    this.hasAnimated = false;
    this.startTime = null;
    this.updateDisplay(0);
  }

  /**
   * Returns whether the counter has completed animating
   */
  get isComplete(): boolean {
    return this.hasAnimated;
  }
}

/**
 * Creates a counter that starts animating when the element enters the viewport
 *
 * @param element - The element to display the count
 * @param options - Counter configuration
 * @returns Cleanup function
 */
export function createScrollCounter(
  element: HTMLElement,
  options: CounterOptions,
): () => void {
  const counter = new Counter(element, options);

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counter.isComplete) {
          counter.start();
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: '0px',
    },
  );

  observer.observe(element);

  return () => {
    counter.stop();
    observer.disconnect();
  };
}

/**
 * Initializes all counters with data-counter attribute
 *
 * Usage in HTML:
 * <span data-counter="31000000" data-suffix="+" data-decimals="0"></span>
 *
 * @returns Cleanup function
 */
export function initCounters(): () => void {
  const counterElements =
    document.querySelectorAll<HTMLElement>('[data-counter]');
  const cleanupFunctions: Array<() => void> = [];

  counterElements.forEach(element => {
    const target = parseFloat(element.dataset.counter || '0');
    const duration = parseFloat(element.dataset.duration || '2000');
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const decimals = parseInt(element.dataset.decimals || '0', 10);

    const cleanup = createScrollCounter(element, {
      target,
      duration,
      prefix,
      suffix,
      decimals,
    });

    cleanupFunctions.push(cleanup);
  });

  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}
