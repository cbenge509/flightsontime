/**
 * Unit tests for FlightMap component - Phase 5.2
 */

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {FlightMap, createFlightMap, AIRPORTS} from './FlightMap';

// Mock canvas context
const createMockContext = () => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  scale: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
});

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

describe('FlightMap', () => {
  let canvas: HTMLCanvasElement;
  let mockContext: ReturnType<typeof createMockContext>;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    mockContext = createMockContext();

    // Mock getBoundingClientRect
    canvas.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
    });

    // Mock getContext
    canvas.getContext = vi.fn().mockReturnValue(mockContext);

    // Mock devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
      value: 1,
      writable: true,
    });

    // Mock matchMedia
    window.matchMedia = mockMatchMedia(false);

    // Mock RAF
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      return setTimeout(() => cb(performance.now()), 16) as unknown as number;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
      clearTimeout(id as unknown as number);
    });

    document.body.appendChild(canvas);
  });

  afterEach(() => {
    document.body.removeChild(canvas);
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create a FlightMap instance', () => {
      const map = new FlightMap(canvas);
      expect(map).toBeInstanceOf(FlightMap);
    });

    it('should throw if canvas context unavailable', () => {
      canvas.getContext = vi.fn().mockReturnValue(null);
      expect(() => new FlightMap(canvas)).toThrow(
        'Canvas 2D context not available',
      );
    });

    it('should setup canvas dimensions based on devicePixelRatio', () => {
      Object.defineProperty(window, 'devicePixelRatio', {value: 2});
      new FlightMap(canvas);
      expect(canvas.width).toBe(1600);
      expect(canvas.height).toBe(1200);
    });
  });

  describe('start', () => {
    it('should start animation loop', () => {
      const map = new FlightMap(canvas);
      map.start();
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should not start if already running', () => {
      const map = new FlightMap(canvas);
      map.start();
      const firstCallCount = (
        window.requestAnimationFrame as ReturnType<typeof vi.fn>
      ).mock.calls.length;
      map.start();
      expect(
        (window.requestAnimationFrame as ReturnType<typeof vi.fn>).mock.calls
          .length,
      ).toBe(firstCallCount);
    });

    it('should draw static frame with reduced motion', () => {
      window.matchMedia = mockMatchMedia(true);
      const map = new FlightMap(canvas);
      map.start();
      expect(mockContext.clearRect).toHaveBeenCalled();
      expect(mockContext.beginPath).toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop animation loop', () => {
      const map = new FlightMap(canvas);
      map.start();
      map.stop();
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('handleResize', () => {
    it('should update canvas dimensions on resize', () => {
      const map = new FlightMap(canvas);

      // Change dimensions
      canvas.getBoundingClientRect = vi.fn().mockReturnValue({
        width: 1024,
        height: 768,
        top: 0,
        left: 0,
        right: 1024,
        bottom: 768,
      });

      map.handleResize();
      expect(canvas.width).toBe(1024);
      expect(canvas.height).toBe(768);
    });
  });

  describe('drawStaticFrame', () => {
    it('should draw airports and flight paths', () => {
      const map = new FlightMap(canvas);
      map.drawStaticFrame();

      expect(mockContext.clearRect).toHaveBeenCalled();
      // Should have drawn multiple paths and dots
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalled();
      expect(mockContext.fill).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should stop animation and clean up', () => {
      const map = new FlightMap(canvas);
      map.start();
      map.destroy();
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});

describe('createFlightMap', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
    });
    canvas.getContext = vi.fn().mockReturnValue(createMockContext());
    window.matchMedia = mockMatchMedia(false);

    document.body.appendChild(canvas);
  });

  afterEach(() => {
    document.body.removeChild(canvas);
    vi.restoreAllMocks();
  });

  it('should create and return a FlightMap instance', () => {
    const map = createFlightMap(canvas);
    expect(map).toBeInstanceOf(FlightMap);
  });

  it('should add resize event listener', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    createFlightMap(canvas);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
  });
});

describe('AIRPORTS', () => {
  it('should contain major US airports', () => {
    expect(AIRPORTS.length).toBeGreaterThan(0);

    const codes = AIRPORTS.map(a => a.code);
    expect(codes).toContain('JFK');
    expect(codes).toContain('LAX');
    expect(codes).toContain('ORD');
    expect(codes).toContain('ATL');
  });

  it('should have valid coordinates for all airports', () => {
    AIRPORTS.forEach(airport => {
      expect(airport.lat).toBeGreaterThan(20);
      expect(airport.lat).toBeLessThan(50);
      expect(airport.lng).toBeLessThan(-60);
      expect(airport.lng).toBeGreaterThan(-130);
    });
  });
});
