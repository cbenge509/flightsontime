/**
 * Flight Map Animation - Phase 5.2
 *
 * Canvas-based animated flight paths between major US airports.
 * Features curved bezier paths with glowing trail effects.
 */

import type {Airport} from '../../types';
import {prefersReducedMotion} from '../../lib/animations';

/**
 * Major US airports for the flight animation
 */
export const AIRPORTS: Airport[] = [
  {code: 'JFK', lat: 40.6413, lng: -73.7781, name: 'New York JFK'},
  {code: 'LAX', lat: 33.9416, lng: -118.4085, name: 'Los Angeles'},
  {code: 'ORD', lat: 41.9742, lng: -87.9073, name: 'Chicago'},
  {code: 'DFW', lat: 32.8998, lng: -97.0403, name: 'Dallas'},
  {code: 'DEN', lat: 39.8561, lng: -104.6737, name: 'Denver'},
  {code: 'ATL', lat: 33.6407, lng: -84.4277, name: 'Atlanta'},
  {code: 'SFO', lat: 37.6213, lng: -122.379, name: 'San Francisco'},
  {code: 'SEA', lat: 47.4502, lng: -122.3088, name: 'Seattle'},
  {code: 'MIA', lat: 25.7959, lng: -80.287, name: 'Miami'},
  {code: 'BOS', lat: 42.3656, lng: -71.0096, name: 'Boston'},
  {code: 'PHX', lat: 33.4373, lng: -112.0078, name: 'Phoenix'},
  {code: 'MSP', lat: 44.8848, lng: -93.2223, name: 'Minneapolis'},
];

/**
 * Flight route definition
 */
interface FlightRoute {
  from: Airport;
  to: Airport;
  progress: number;
  speed: number;
  color: string;
  delay: number;
}

/**
 * Map boundaries for continental US
 */
const MAP_BOUNDS = {
  north: 49.5,
  south: 24.5,
  east: -66.5,
  west: -125.0,
};

/**
 * Flight colors based on status
 */
const FLIGHT_COLORS = {
  onTime: '#4fc3f7', // sky-400
  delayed: '#ffb74d', // amber-400
  early: '#81c784', // green-400
};

/**
 * Converts geographic coordinates to canvas coordinates
 */
function geoToCanvas(
  lat: number,
  lng: number,
  width: number,
  height: number,
  padding: number = 20,
): {x: number; y: number} {
  const x =
    ((lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) *
      (width - padding * 2) +
    padding;
  const y =
    ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) *
      (height - padding * 2) +
    padding;
  return {x, y};
}

/**
 * Generates flight routes between airports
 */
function generateRoutes(): FlightRoute[] {
  const routes: FlightRoute[] = [];
  const colorKeys = Object.keys(FLIGHT_COLORS) as Array<
    keyof typeof FLIGHT_COLORS
  >;

  // Create various routes between airports
  const routePairs = [
    [0, 1], // JFK -> LAX
    [2, 0], // ORD -> JFK
    [5, 1], // ATL -> LAX
    [6, 2], // SFO -> ORD
    [7, 4], // SEA -> DEN
    [3, 8], // DFW -> MIA
    [9, 5], // BOS -> ATL
    [4, 0], // DEN -> JFK
    [1, 7], // LAX -> SEA
    [10, 3], // PHX -> DFW
    [11, 2], // MSP -> ORD
    [8, 0], // MIA -> JFK
  ];

  routePairs.forEach(([fromIdx, toIdx], index) => {
    const colorKey = colorKeys[index % colorKeys.length];
    routes.push({
      from: AIRPORTS[fromIdx],
      to: AIRPORTS[toIdx],
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.003,
      color: FLIGHT_COLORS[colorKey],
      delay: index * 200,
    });
  });

  return routes;
}

/**
 * Calculates a point on a quadratic bezier curve
 */
function quadraticBezier(
  t: number,
  p0: {x: number; y: number},
  p1: {x: number; y: number},
  p2: {x: number; y: number},
): {x: number; y: number} {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}

/**
 * Flight Map Animation class
 */
export class FlightMap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private routes: FlightRoute[];
  private animationId: number | null = null;
  private isRunning = false;
  private startTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }
    this.ctx = ctx;
    this.routes = generateRoutes();
    this.setupCanvas();
  }

  /**
   * Sets up canvas dimensions and pixel ratio
   */
  private setupCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  /**
   * Handles window resize
   */
  handleResize = (): void => {
    this.setupCanvas();
    if (!this.isRunning) {
      this.drawStaticFrame();
    }
  };

  /**
   * Draws the airport dots
   */
  private drawAirports(): void {
    const rect = this.canvas.getBoundingClientRect();

    AIRPORTS.forEach(airport => {
      const pos = geoToCanvas(
        airport.lat,
        airport.lng,
        rect.width,
        rect.height,
      );

      // Outer glow
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(79, 195, 247, 0.2)';
      this.ctx.fill();

      // Inner dot
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(79, 195, 247, 0.6)';
      this.ctx.fill();
    });
  }

  /**
   * Draws the flight paths (static curves)
   */
  private drawFlightPaths(): void {
    const rect = this.canvas.getBoundingClientRect();

    this.routes.forEach(route => {
      const from = geoToCanvas(
        route.from.lat,
        route.from.lng,
        rect.width,
        rect.height,
      );
      const to = geoToCanvas(
        route.to.lat,
        route.to.lng,
        rect.width,
        rect.height,
      );

      // Control point for curve (above the midpoint)
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const distance = Math.sqrt(
        Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2),
      );
      const curveHeight = Math.min(distance * 0.3, 80);
      const control = {x: midX, y: midY - curveHeight};

      // Draw path
      this.ctx.beginPath();
      this.ctx.moveTo(from.x, from.y);
      this.ctx.quadraticCurveTo(control.x, control.y, to.x, to.y);
      this.ctx.strokeStyle = 'rgba(79, 195, 247, 0.1)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
  }

  /**
   * Draws animated flight dots
   */
  private drawFlights(timestamp: number): void {
    const rect = this.canvas.getBoundingClientRect();
    const elapsed = timestamp - this.startTime;

    this.routes.forEach(route => {
      // Only show flight after its delay
      if (elapsed < route.delay) return;

      const from = geoToCanvas(
        route.from.lat,
        route.from.lng,
        rect.width,
        rect.height,
      );
      const to = geoToCanvas(
        route.to.lat,
        route.to.lng,
        rect.width,
        rect.height,
      );

      // Control point for curve
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const distance = Math.sqrt(
        Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2),
      );
      const curveHeight = Math.min(distance * 0.3, 80);
      const control = {x: midX, y: midY - curveHeight};

      // Calculate flight position
      const pos = quadraticBezier(route.progress, from, control, to);

      // Draw trail
      const trailLength = 15;
      for (let i = 0; i < trailLength; i++) {
        const trailProgress = Math.max(0, route.progress - i * 0.01);
        const trailPos = quadraticBezier(trailProgress, from, control, to);
        const alpha = ((trailLength - i) / trailLength) * 0.5;

        this.ctx.beginPath();
        this.ctx.arc(trailPos.x, trailPos.y, 2 - i * 0.1, 0, Math.PI * 2);
        this.ctx.fillStyle = route.color
          .replace(')', `, ${alpha})`)
          .replace('rgb', 'rgba');
        this.ctx.fill();
      }

      // Draw flight dot
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = route.color;
      this.ctx.fill();

      // Outer glow
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      this.ctx.fillStyle = route.color
        .replace(')', ', 0.3)')
        .replace('rgb', 'rgba');
      this.ctx.fill();

      // Update progress
      route.progress += route.speed;
      if (route.progress > 1) {
        route.progress = 0;
      }
    });
  }

  /**
   * Draws a static frame (for reduced motion or initial state)
   */
  drawStaticFrame(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);
    this.drawFlightPaths();
    this.drawAirports();
  }

  /**
   * Animation loop
   */
  private animate = (timestamp: number): void => {
    if (!this.isRunning) return;

    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    this.drawFlightPaths();
    this.drawFlights(timestamp);
    this.drawAirports();

    this.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * Starts the animation
   */
  start(): void {
    if (this.isRunning) return;

    // If user prefers reduced motion, show static frame
    if (prefersReducedMotion()) {
      this.drawStaticFrame();
      return;
    }

    this.isRunning = true;
    this.startTime = performance.now();
    this.animationId = requestAnimationFrame(this.animate);
  }

  /**
   * Stops the animation
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Cleans up resources
   */
  destroy(): void {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
  }
}

/**
 * Creates and initializes a flight map on the given canvas
 *
 * @param canvas - The canvas element
 * @returns FlightMap instance
 */
export function createFlightMap(canvas: HTMLCanvasElement): FlightMap {
  const map = new FlightMap(canvas);
  window.addEventListener('resize', map.handleResize);
  return map;
}
