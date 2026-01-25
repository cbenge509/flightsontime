/**
 * Type definitions for the Flight Delay Prediction docs site
 */

// =============================================================================
// Component Props Types
// =============================================================================

export interface SectionProps {
  /** Unique ID for the section (used for navigation) */
  id: string;
  /** Background color scheme */
  background?: 'dark' | 'light' | 'gradient' | 'gradient-reverse' | 'accent';
  /** Additional CSS classes */
  className?: string;
}

export interface ContainerProps {
  /** Container width variant */
  size?: 'narrow' | 'default' | 'wide' | 'full';
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Data Types
// =============================================================================

export interface TeamMember {
  name: string;
  linkedin: string;
}

export interface DatasetInfo {
  records?: string;
  years?: string;
  fields?: number;
  stations?: number;
  observations?: string;
  count?: number;
  mapped?: number;
}

export interface ModelMetrics {
  name: string;
  f1: number;
  auc: number;
  precision?: number;
  recall?: number;
}

export interface Airport {
  code: string;
  lat: number;
  lng: number;
  name?: string;
}

export interface Feature {
  name: string;
  importance: number;
  description?: string;
}

// =============================================================================
// Animation Types - Phase 2.5
// =============================================================================

export interface ObserverOptions {
  /** Intersection threshold (0-1) */
  threshold?: number;
  /** Root margin for early/late triggering */
  rootMargin?: string;
  /** Whether to trigger only once */
  once?: boolean;
}

export type AnimationType =
  | 'fade-up'
  | 'fade-in'
  | 'scale-up'
  | 'slide-left'
  | 'slide-right';

export interface AnimationConfig {
  type: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
}

// =============================================================================
// Counter Types - for Phase 5
// =============================================================================

export interface CounterOptions {
  /** Target number to count to */
  target: number;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Prefix before the number (e.g., "$") */
  prefix?: string;
  /** Suffix after the number (e.g., "M", "%") */
  suffix?: string;
  /** Number of decimal places */
  decimals?: number;
}

// =============================================================================
// Chart/Visualization Types
// =============================================================================

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface AirlineDelayData {
  airline: string;
  delayRate: number;
}
