/**
 * Unit tests for Counter component - Phase 5.1
 */

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {Counter} from './Counter';

// Mock matchMedia for reduced motion
const mockMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe('Counter', () => {
  let element: HTMLElement;
  let rafCallbacks: Array<(time: number) => void> = [];
  let rafId = 0;

  beforeEach(() => {
    element = document.createElement('span');
    document.body.appendChild(element);

    // Mock requestAnimationFrame
    rafCallbacks = [];
    rafId = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      rafCallbacks.push(callback);
      return ++rafId;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    // Mock matchMedia for normal motion
    window.matchMedia = mockMatchMedia(false);
  });

  afterEach(() => {
    document.body.removeChild(element);
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should set initial display to 0', () => {
      new Counter(element, {target: 100});
      expect(element.textContent).toBe('0');
    });

    it('should apply prefix and suffix', () => {
      new Counter(element, {target: 100, prefix: '$', suffix: 'M'});
      expect(element.textContent).toBe('$0M');
    });

    it('should handle decimal places', () => {
      new Counter(element, {target: 100, decimals: 2});
      expect(element.textContent).toBe('0.00');
    });
  });

  describe('start', () => {
    it('should request animation frame when started', () => {
      const counter = new Counter(element, {target: 100});
      counter.start();
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should not restart if already completed', () => {
      window.matchMedia = mockMatchMedia(true); // Use reduced motion for instant completion
      const counter = new Counter(element, {target: 100});
      counter.start();
      expect(counter.isComplete).toBe(true);

      // Clear call count
      (window.requestAnimationFrame as ReturnType<typeof vi.fn>).mockClear();

      // Try to start again
      counter.start();
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should show final value immediately with reduced motion', () => {
      window.matchMedia = mockMatchMedia(true);
      const counter = new Counter(element, {target: 100});
      counter.start();
      expect(element.textContent).toBe('100');
    });
  });

  describe('stop', () => {
    it('should cancel animation frame when stopped', () => {
      const counter = new Counter(element, {target: 100});
      counter.start();
      counter.stop();
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset display to 0', () => {
      const counter = new Counter(element, {target: 100});
      counter.start();
      counter.reset();
      expect(element.textContent).toBe('0');
    });

    it('should allow starting again after reset', () => {
      window.matchMedia = mockMatchMedia(true);
      const counter = new Counter(element, {target: 100});
      counter.start();
      expect(counter.isComplete).toBe(true);

      counter.reset();
      expect(counter.isComplete).toBe(false);

      counter.start();
      expect(counter.isComplete).toBe(true);
    });
  });

  describe('isComplete', () => {
    it('should be false initially', () => {
      const counter = new Counter(element, {target: 100});
      expect(counter.isComplete).toBe(false);
    });

    it('should be true after animation completes', () => {
      window.matchMedia = mockMatchMedia(true);
      const counter = new Counter(element, {target: 100});
      counter.start();
      expect(counter.isComplete).toBe(true);
    });
  });

  describe('animation', () => {
    it('should animate from 0 to target', () => {
      const counter = new Counter(element, {target: 100, duration: 100});
      counter.start();

      // Simulate some animation frames
      expect(rafCallbacks.length).toBeGreaterThan(0);

      // Run first frame
      rafCallbacks[0](0);
      expect(parseFloat(element.textContent || '0')).toBe(0);

      // Run frame at halfway through
      rafCallbacks[rafCallbacks.length - 1](50);
      const midValue = parseFloat(element.textContent || '0');
      expect(midValue).toBeGreaterThan(0);
      expect(midValue).toBeLessThan(100);
    });

    it('should respect decimals in animation', () => {
      window.matchMedia = mockMatchMedia(true);
      const counter = new Counter(element, {
        target: 0.44,
        decimals: 2,
        prefix: 'F1: ',
      });
      counter.start();
      expect(element.textContent).toBe('F1: 0.44');
    });
  });
});

describe('Counter formatting', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('span');
    document.body.appendChild(element);
    window.matchMedia = mockMatchMedia(true);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should format with prefix and suffix', () => {
    new Counter(element, {target: 31, prefix: '', suffix: 'M+'});
    expect(element.textContent).toBe('0M+');
  });

  it('should format decimal numbers', () => {
    const counter = new Counter(element, {target: 0.72, decimals: 2});
    counter.start();
    expect(element.textContent).toBe('0.72');
  });

  it('should handle large numbers', () => {
    const counter = new Counter(element, {target: 31746841, decimals: 0});
    counter.start();
    expect(element.textContent).toBe('31746841');
  });
});
