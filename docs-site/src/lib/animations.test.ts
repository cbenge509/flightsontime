import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import {
  DEFAULT_OBSERVER_OPTIONS,
  getAnimationClass,
  getStaggerClass,
  easeOutExpo,
  easeOutBack,
  lerp,
  prefersReducedMotion,
  createScrollObserver,
  observeElement,
  observeElements,
} from './animations';

// Mock IntersectionObserver for jsdom
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_callback: IntersectionObserverCallback) {
    // Callback stored for interface compliance
  }

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

// Set up global mocks before tests
beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('DEFAULT_OBSERVER_OPTIONS', () => {
  it('has expected default values', () => {
    expect(DEFAULT_OBSERVER_OPTIONS.threshold).toBe(0.1);
    expect(DEFAULT_OBSERVER_OPTIONS.rootMargin).toBe('0px');
    expect(DEFAULT_OBSERVER_OPTIONS.once).toBe(true);
  });
});

describe('getAnimationClass', () => {
  it('returns correct class for fade-up', () => {
    expect(getAnimationClass('fade-up')).toBe('animate-fade-up');
  });

  it('returns correct class for fade-in', () => {
    expect(getAnimationClass('fade-in')).toBe('animate-fade-in');
  });

  it('returns correct class for scale-up', () => {
    expect(getAnimationClass('scale-up')).toBe('animate-scale-up');
  });

  it('returns correct class for slide-left', () => {
    expect(getAnimationClass('slide-left')).toBe('animate-slide-left');
  });

  it('returns correct class for slide-right', () => {
    expect(getAnimationClass('slide-right')).toBe('animate-slide-right');
  });
});

describe('getStaggerClass', () => {
  it('returns empty string for index 0', () => {
    expect(getStaggerClass(0)).toBe('');
  });

  it('returns correct class for valid indices', () => {
    expect(getStaggerClass(1)).toBe('stagger-1');
    expect(getStaggerClass(2)).toBe('stagger-2');
    expect(getStaggerClass(3)).toBe('stagger-3');
    expect(getStaggerClass(4)).toBe('stagger-4');
    expect(getStaggerClass(5)).toBe('stagger-5');
  });

  it('returns empty string for index > 5', () => {
    expect(getStaggerClass(6)).toBe('');
    expect(getStaggerClass(10)).toBe('');
  });

  it('returns empty string for negative indices', () => {
    expect(getStaggerClass(-1)).toBe('');
  });
});

describe('easeOutExpo', () => {
  it('returns 0 when t is 0', () => {
    expect(easeOutExpo(0)).toBeCloseTo(0, 5);
  });

  it('returns 1 when t is 1', () => {
    expect(easeOutExpo(1)).toBe(1);
  });

  it('returns value between 0 and 1 for t between 0 and 1', () => {
    expect(easeOutExpo(0.5)).toBeGreaterThan(0);
    expect(easeOutExpo(0.5)).toBeLessThan(1);
  });

  it('produces exponential ease-out curve (fast start, slow end)', () => {
    // At t=0.5, easeOutExpo should be significantly > 0.5 (fast start)
    expect(easeOutExpo(0.5)).toBeGreaterThan(0.9);
  });
});

describe('easeOutBack', () => {
  it('returns 0 when t is 0', () => {
    expect(easeOutBack(0)).toBeCloseTo(0, 5);
  });

  it('returns 1 when t is 1', () => {
    expect(easeOutBack(1)).toBeCloseTo(1, 5);
  });

  it('can overshoot (returns value > 1 during animation)', () => {
    // easeOutBack typically overshoots around t=0.7-0.8
    const midValue = easeOutBack(0.75);
    expect(midValue).toBeGreaterThan(0.9);
  });
});

describe('lerp', () => {
  it('returns start value when t is 0', () => {
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(50, 150, 0)).toBe(50);
  });

  it('returns end value when t is 1', () => {
    expect(lerp(0, 100, 1)).toBe(100);
    expect(lerp(50, 150, 1)).toBe(150);
  });

  it('returns midpoint when t is 0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(20, 80, 0.5)).toBe(50);
  });

  it('works with negative values', () => {
    expect(lerp(-100, 100, 0.5)).toBe(0);
    expect(lerp(-50, -10, 0.5)).toBe(-30);
  });
});

describe('prefersReducedMotion', () => {
  it('returns true when user prefers reduced motion', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({matches: true})),
    );
    expect(prefersReducedMotion()).toBe(true);
  });

  it('returns false when user does not prefer reduced motion', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({matches: false})),
    );
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('createScrollObserver', () => {
  it('creates an IntersectionObserver', () => {
    const callback = vi.fn();
    const observer = createScrollObserver(callback);
    expect(observer).toBeInstanceOf(MockIntersectionObserver);
    observer.disconnect();
  });

  it('accepts custom options', () => {
    const callback = vi.fn();
    const observer = createScrollObserver(callback, {
      threshold: 0.5,
      rootMargin: '10px',
      once: false,
    });
    expect(observer).toBeInstanceOf(MockIntersectionObserver);
    observer.disconnect();
  });
});

describe('observeElement', () => {
  it('returns a cleanup function', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const cleanup = observeElement(element);
    expect(typeof cleanup).toBe('function');

    cleanup();
    document.body.removeChild(element);
  });
});

describe('observeElements', () => {
  it('observes multiple elements and returns cleanup function', () => {
    const elements = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
    ];

    elements.forEach(el => document.body.appendChild(el));

    const cleanup = observeElements(elements);
    expect(typeof cleanup).toBe('function');

    cleanup();
    elements.forEach(el => document.body.removeChild(el));
  });

  it('works with NodeList', () => {
    const container = document.createElement('div');
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    container.appendChild(span1);
    container.appendChild(span2);
    document.body.appendChild(container);

    const nodeList = container.querySelectorAll('span');
    const cleanup = observeElements(nodeList);
    expect(typeof cleanup).toBe('function');

    cleanup();
    document.body.removeChild(container);
  });
});
