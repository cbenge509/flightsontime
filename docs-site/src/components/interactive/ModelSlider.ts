/**
 * Model Comparison Slider - Phase 5.4
 *
 * Interactive slider to compare model metrics.
 * Smoothly transitions between model values.
 */

import type {ModelMetrics} from '../../types';
import {easeOutExpo, prefersReducedMotion} from '../../lib/animations';

/**
 * Model data for the slider
 */
export const MODELS: ModelMetrics[] = [
  {
    name: 'Logistic Regression',
    f1: 0.41,
    auc: 0.7,
    precision: 0.38,
    recall: 0.45,
  },
  {
    name: 'Random Forest',
    f1: 0.44,
    auc: 0.72,
    precision: 0.42,
    recall: 0.46,
  },
  {
    name: 'Neural Network',
    f1: 0.49,
    auc: 0.73,
    precision: 0.45,
    recall: 0.54,
  },
];

/**
 * Model slider configuration
 */
interface SliderConfig {
  slider: HTMLInputElement;
  nameDisplay: HTMLElement;
  f1Display: HTMLElement;
  aucDisplay: HTMLElement;
  precisionDisplay?: HTMLElement;
  recallDisplay?: HTMLElement;
  f1Bar?: HTMLElement;
  aucBar?: HTMLElement;
}

/**
 * Animation state for smooth transitions
 */
interface AnimationState {
  currentF1: number;
  currentAuc: number;
  currentPrecision: number;
  currentRecall: number;
  targetF1: number;
  targetAuc: number;
  targetPrecision: number;
  targetRecall: number;
  startTime: number;
  duration: number;
  animating: boolean;
}

/**
 * Model Slider class for interactive model comparison
 */
export class ModelSlider {
  private config: SliderConfig;
  private state: AnimationState;
  private animationId: number | null = null;
  private currentModelIndex = 1; // Start with Random Forest (middle)

  constructor(config: SliderConfig) {
    this.config = config;
    this.state = this.createInitialState();
    this.setupEventListeners();
    this.updateDisplay(MODELS[this.currentModelIndex]);
  }

  /**
   * Creates initial animation state
   */
  private createInitialState(): AnimationState {
    const model = MODELS[1]; // Random Forest default
    return {
      currentF1: model.f1,
      currentAuc: model.auc,
      currentPrecision: model.precision || 0,
      currentRecall: model.recall || 0,
      targetF1: model.f1,
      targetAuc: model.auc,
      targetPrecision: model.precision || 0,
      targetRecall: model.recall || 0,
      startTime: 0,
      duration: 400,
      animating: false,
    };
  }

  /**
   * Sets up slider event listener
   */
  private setupEventListeners(): void {
    this.config.slider.addEventListener('input', this.handleSliderChange);
    this.config.slider.value = '1'; // Default to middle (Random Forest)
  }

  /**
   * Handles slider value change
   */
  private handleSliderChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const index = parseInt(target.value, 10);
    this.selectModel(index);
  };

  /**
   * Selects a model by index and animates to its values
   */
  selectModel(index: number): void {
    if (index < 0 || index >= MODELS.length) return;

    this.currentModelIndex = index;
    const model = MODELS[index];

    // Update name immediately
    this.config.nameDisplay.textContent = model.name;

    // If reduced motion, update immediately
    if (prefersReducedMotion()) {
      this.updateDisplay(model);
      return;
    }

    // Start animation
    this.state.targetF1 = model.f1;
    this.state.targetAuc = model.auc;
    this.state.targetPrecision = model.precision || 0;
    this.state.targetRecall = model.recall || 0;
    this.state.startTime = performance.now();
    this.state.animating = true;

    if (this.animationId === null) {
      this.animationId = requestAnimationFrame(this.animate);
    }
  }

  /**
   * Animation frame callback
   */
  private animate = (timestamp: number): void => {
    if (!this.state.animating) {
      this.animationId = null;
      return;
    }

    const elapsed = timestamp - this.state.startTime;
    const progress = Math.min(elapsed / this.state.duration, 1);
    const easedProgress = easeOutExpo(progress);

    // Interpolate values
    const f1 = this.lerp(
      this.state.currentF1,
      this.state.targetF1,
      easedProgress,
    );
    const auc = this.lerp(
      this.state.currentAuc,
      this.state.targetAuc,
      easedProgress,
    );
    const precision = this.lerp(
      this.state.currentPrecision,
      this.state.targetPrecision,
      easedProgress,
    );
    const recall = this.lerp(
      this.state.currentRecall,
      this.state.targetRecall,
      easedProgress,
    );

    this.updateMetricDisplays(f1, auc, precision, recall);

    if (progress < 1) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      // Animation complete
      this.state.currentF1 = this.state.targetF1;
      this.state.currentAuc = this.state.targetAuc;
      this.state.currentPrecision = this.state.targetPrecision;
      this.state.currentRecall = this.state.targetRecall;
      this.state.animating = false;
      this.animationId = null;
    }
  };

  /**
   * Linear interpolation
   */
  private lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  /**
   * Updates the metric displays with current values
   */
  private updateMetricDisplays(
    f1: number,
    auc: number,
    precision: number,
    recall: number,
  ): void {
    this.config.f1Display.textContent = f1.toFixed(2);
    this.config.aucDisplay.textContent = auc.toFixed(2);

    if (this.config.precisionDisplay) {
      this.config.precisionDisplay.textContent = precision.toFixed(2);
    }
    if (this.config.recallDisplay) {
      this.config.recallDisplay.textContent = recall.toFixed(2);
    }

    // Update bar widths if present
    if (this.config.f1Bar) {
      this.config.f1Bar.style.width = `${f1 * 100}%`;
    }
    if (this.config.aucBar) {
      this.config.aucBar.style.width = `${auc * 100}%`;
    }
  }

  /**
   * Updates display with model values (no animation)
   */
  private updateDisplay(model: ModelMetrics): void {
    this.state.currentF1 = model.f1;
    this.state.currentAuc = model.auc;
    this.state.currentPrecision = model.precision || 0;
    this.state.currentRecall = model.recall || 0;

    this.updateMetricDisplays(
      model.f1,
      model.auc,
      model.precision || 0,
      model.recall || 0,
    );
  }

  /**
   * Gets the currently selected model
   */
  get currentModel(): ModelMetrics {
    return MODELS[this.currentModelIndex];
  }

  /**
   * Cleans up event listeners
   */
  destroy(): void {
    this.config.slider.removeEventListener('input', this.handleSliderChange);
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

/**
 * Initializes the model slider from DOM elements
 *
 * @param containerId - ID of the slider container
 * @returns ModelSlider instance or null if elements not found
 */
export function initModelSlider(containerId: string): ModelSlider | null {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const slider = container.querySelector<HTMLInputElement>(
    '[data-model-slider]',
  );
  const nameDisplay = container.querySelector<HTMLElement>('[data-model-name]');
  const f1Display = container.querySelector<HTMLElement>('[data-model-f1]');
  const aucDisplay = container.querySelector<HTMLElement>('[data-model-auc]');

  if (!slider || !nameDisplay || !f1Display || !aucDisplay) {
    console.warn('Model slider: Missing required elements');
    return null;
  }

  const precisionDisplay = container.querySelector<HTMLElement>(
    '[data-model-precision]',
  );
  const recallDisplay = container.querySelector<HTMLElement>(
    '[data-model-recall]',
  );
  const f1Bar = container.querySelector<HTMLElement>('[data-model-f1-bar]');
  const aucBar = container.querySelector<HTMLElement>('[data-model-auc-bar]');

  return new ModelSlider({
    slider,
    nameDisplay,
    f1Display,
    aucDisplay,
    precisionDisplay: precisionDisplay || undefined,
    recallDisplay: recallDisplay || undefined,
    f1Bar: f1Bar || undefined,
    aucBar: aucBar || undefined,
  });
}
