/**
 * Unit tests for ModelSlider component - Phase 5.4
 */

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {ModelSlider, initModelSlider, MODELS} from './ModelSlider';

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

describe('ModelSlider', () => {
  let container: HTMLElement;
  let slider: HTMLInputElement;
  let nameDisplay: HTMLElement;
  let f1Display: HTMLElement;
  let aucDisplay: HTMLElement;
  let f1Bar: HTMLElement;
  let aucBar: HTMLElement;

  beforeEach(() => {
    // Create DOM structure
    container = document.createElement('div');
    container.id = 'model-slider-container';

    slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '2';
    slider.value = '1';
    slider.dataset.modelSlider = '';

    nameDisplay = document.createElement('span');
    nameDisplay.dataset.modelName = '';

    f1Display = document.createElement('span');
    f1Display.dataset.modelF1 = '';

    aucDisplay = document.createElement('span');
    aucDisplay.dataset.modelAuc = '';

    f1Bar = document.createElement('div');
    f1Bar.dataset.modelF1Bar = '';

    aucBar = document.createElement('div');
    aucBar.dataset.modelAucBar = '';

    container.appendChild(slider);
    container.appendChild(nameDisplay);
    container.appendChild(f1Display);
    container.appendChild(aucDisplay);
    container.appendChild(f1Bar);
    container.appendChild(aucBar);

    document.body.appendChild(container);

    // Mock matchMedia
    window.matchMedia = mockMatchMedia(true); // Use reduced motion for instant updates

    // Mock RAF
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      cb(performance.now());
      return 1;
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create a ModelSlider instance', () => {
      const modelSlider = new ModelSlider({
        slider,
        nameDisplay,
        f1Display,
        aucDisplay,
      });
      expect(modelSlider).toBeInstanceOf(ModelSlider);
    });

    it('should display initial model values', () => {
      new ModelSlider({
        slider,
        nameDisplay,
        f1Display,
        aucDisplay,
      });

      // Should default to Random Forest (index 1)
      expect(f1Display.textContent).toBe('0.44');
      expect(aucDisplay.textContent).toBe('0.72');
    });
  });

  describe('selectModel', () => {
    it('should update displays when model is selected', () => {
      const modelSlider = new ModelSlider({
        slider,
        nameDisplay,
        f1Display,
        aucDisplay,
        f1Bar,
        aucBar,
      });

      // Select Logistic Regression (index 0)
      modelSlider.selectModel(0);
      expect(nameDisplay.textContent).toBe('Logistic Regression');
      expect(f1Display.textContent).toBe('0.41');
      expect(aucDisplay.textContent).toBe('0.70');

      // Select Neural Network (index 2)
      modelSlider.selectModel(2);
      expect(nameDisplay.textContent).toBe('Neural Network');
      expect(f1Display.textContent).toBe('0.49');
      expect(aucDisplay.textContent).toBe('0.73');
    });

    it('should update bar widths', () => {
      const modelSlider = new ModelSlider({
        slider,
        nameDisplay,
        f1Display,
        aucDisplay,
        f1Bar,
        aucBar,
      });

      modelSlider.selectModel(2); // Neural Network
      expect(f1Bar.style.width).toBe('49%');
      expect(aucBar.style.width).toBe('73%');
    });

    it('should ignore invalid indices', () => {
      const modelSlider = new ModelSlider({
        slider,
        nameDisplay,
        f1Display,
        aucDisplay,
      });

      const initialF1 = f1Display.textContent;
      modelSlider.selectModel(-1);
      expect(f1Display.textContent).toBe(initialF1);

      modelSlider.selectModel(100);
      expect(f1Display.textContent).toBe(initialF1);
    });
  });

  describe('slider input event', () => {
    it('should update model when slider changes', () => {
      new ModelSlider({
        slider,
        nameDisplay,
        f1Display,
        aucDisplay,
      });

      // Simulate slider change to index 0
      slider.value = '0';
      slider.dispatchEvent(new Event('input'));

      expect(nameDisplay.textContent).toBe('Logistic Regression');
    });
  });

  describe('currentModel', () => {
    it('should return the currently selected model', () => {
      const modelSlider = new ModelSlider({
        slider,
        nameDisplay,
        f1Display,
        aucDisplay,
      });

      expect(modelSlider.currentModel.name).toBe('Random Forest');

      modelSlider.selectModel(0);
      expect(modelSlider.currentModel.name).toBe('Logistic Regression');
    });
  });

  describe('destroy', () => {
    it('should remove event listeners', () => {
      const modelSlider = new ModelSlider({
        slider,
        nameDisplay,
        f1Display,
        aucDisplay,
      });

      const removeEventListenerSpy = vi.spyOn(slider, 'removeEventListener');
      modelSlider.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'input',
        expect.any(Function),
      );
    });
  });
});

describe('initModelSlider', () => {
  beforeEach(() => {
    window.matchMedia = mockMatchMedia(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null if container not found', () => {
    const result = initModelSlider('nonexistent');
    expect(result).toBeNull();
  });

  it('should return null if required elements missing', () => {
    const container = document.createElement('div');
    container.id = 'test-slider';
    document.body.appendChild(container);

    const result = initModelSlider('test-slider');
    expect(result).toBeNull();

    document.body.removeChild(container);
  });

  it('should return ModelSlider instance when elements exist', () => {
    const container = document.createElement('div');
    container.id = 'test-slider';

    const slider = document.createElement('input');
    slider.dataset.modelSlider = '';

    const nameDisplay = document.createElement('span');
    nameDisplay.dataset.modelName = '';

    const f1Display = document.createElement('span');
    f1Display.dataset.modelF1 = '';

    const aucDisplay = document.createElement('span');
    aucDisplay.dataset.modelAuc = '';

    container.appendChild(slider);
    container.appendChild(nameDisplay);
    container.appendChild(f1Display);
    container.appendChild(aucDisplay);
    document.body.appendChild(container);

    const result = initModelSlider('test-slider');
    expect(result).toBeInstanceOf(ModelSlider);

    document.body.removeChild(container);
  });
});

describe('MODELS', () => {
  it('should contain three models', () => {
    expect(MODELS.length).toBe(3);
  });

  it('should have Logistic Regression, Random Forest, and Neural Network', () => {
    const names = MODELS.map(m => m.name);
    expect(names).toContain('Logistic Regression');
    expect(names).toContain('Random Forest');
    expect(names).toContain('Neural Network');
  });

  it('should have valid metric values', () => {
    MODELS.forEach(model => {
      expect(model.f1).toBeGreaterThan(0);
      expect(model.f1).toBeLessThanOrEqual(1);
      expect(model.auc).toBeGreaterThan(0);
      expect(model.auc).toBeLessThanOrEqual(1);
    });
  });

  it('should have increasing F1 scores', () => {
    expect(MODELS[0].f1).toBeLessThan(MODELS[1].f1);
    expect(MODELS[1].f1).toBeLessThan(MODELS[2].f1);
  });
});
