/**
 * Chart Overlay - Phase 5.5
 *
 * Interactive tooltips for chart images.
 * Shows exact values when hovering over chart areas.
 */

/**
 * Data point for chart tooltips
 */
export interface ChartDataPoint {
  label: string;
  value: string | number;
  x: number; // Percentage from left
  y: number; // Percentage from top
  width?: number; // Percentage width of hotspot
  height?: number; // Percentage height of hotspot
}

/**
 * Chart overlay configuration
 */
interface ChartOverlayConfig {
  container: HTMLElement;
  dataPoints: ChartDataPoint[];
  tooltipClass?: string;
}

/**
 * Chart Overlay class for interactive chart tooltips
 */
export class ChartOverlay {
  private container: HTMLElement;
  private dataPoints: ChartDataPoint[];
  private tooltip: HTMLElement;
  private tooltipLabel: HTMLElement;
  private tooltipValue: HTMLElement;
  private hotspots: HTMLElement[] = [];

  constructor(config: ChartOverlayConfig) {
    this.container = config.container;
    this.dataPoints = config.dataPoints;

    // Create tooltip element with child elements
    const {tooltip, label, value} = this.createTooltip(config.tooltipClass);
    this.tooltip = tooltip;
    this.tooltipLabel = label;
    this.tooltipValue = value;
    this.container.appendChild(this.tooltip);

    // Create hotspots
    this.createHotspots();

    // Setup container styles
    this.setupContainer();
  }

  /**
   * Creates the tooltip element with label and value children
   */
  private createTooltip(className?: string): {
    tooltip: HTMLElement;
    label: HTMLElement;
    value: HTMLElement;
  } {
    const tooltip = document.createElement('div');
    tooltip.className = `chart-tooltip ${className || ''}`.trim();
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');
    tooltip.style.cssText = `
      position: absolute;
      z-index: 50;
      padding: 0.5rem 0.75rem;
      background: rgba(15, 15, 26, 0.95);
      border: 1px solid rgba(79, 195, 247, 0.3);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      color: #fff;
      pointer-events: none;
      opacity: 0;
      transform: translateY(-5px);
      transition: opacity 0.15s ease, transform 0.15s ease;
      white-space: nowrap;
      backdrop-filter: blur(8px);
    `;

    const label = document.createElement('div');
    label.className = 'tooltip-label';
    label.style.cssText = `
      color: var(--color-slate-400);
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    `;

    const value = document.createElement('div');
    value.className = 'tooltip-value';
    value.style.cssText = `
      color: var(--color-sky-400);
      font-weight: 600;
    `;

    tooltip.appendChild(label);
    tooltip.appendChild(value);

    return {tooltip, label, value};
  }

  /**
   * Creates interactive hotspots for each data point
   */
  private createHotspots(): void {
    this.dataPoints.forEach((point, index) => {
      const hotspot = document.createElement('div');
      hotspot.className = 'chart-hotspot';
      hotspot.setAttribute('data-index', String(index));
      hotspot.setAttribute('role', 'button');
      hotspot.setAttribute('tabindex', '0');
      hotspot.setAttribute('aria-label', `${point.label}: ${point.value}`);

      const width = point.width || 10;
      const height = point.height || 10;

      hotspot.style.cssText = `
        position: absolute;
        left: ${point.x - width / 2}%;
        top: ${point.y - height / 2}%;
        width: ${width}%;
        height: ${height}%;
        cursor: pointer;
        z-index: 10;
      `;

      hotspot.addEventListener('mouseenter', () =>
        this.showTooltip(point, hotspot),
      );
      hotspot.addEventListener('mouseleave', () => this.hideTooltip());
      hotspot.addEventListener('focus', () => this.showTooltip(point, hotspot));
      hotspot.addEventListener('blur', () => this.hideTooltip());

      this.container.appendChild(hotspot);
      this.hotspots.push(hotspot);
    });
  }

  /**
   * Sets up container styles for positioning
   */
  private setupContainer(): void {
    const computedStyle = window.getComputedStyle(this.container);
    if (computedStyle.position === 'static') {
      this.container.style.position = 'relative';
    }
  }

  /**
   * Shows the tooltip for a data point
   */
  private showTooltip(point: ChartDataPoint, hotspot: HTMLElement): void {
    // Update tooltip content using textContent (safe)
    this.tooltipLabel.textContent = point.label;
    this.tooltipValue.textContent = String(point.value);

    // Position tooltip above the hotspot
    const containerRect = this.container.getBoundingClientRect();
    const hotspotRect = hotspot.getBoundingClientRect();

    const left = hotspotRect.left - containerRect.left + hotspotRect.width / 2;
    const top = hotspotRect.top - containerRect.top - 10;

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.transform = 'translate(-50%, -100%)';

    // Show tooltip
    this.tooltip.style.opacity = '1';
    this.tooltip.setAttribute('aria-hidden', 'false');
  }

  /**
   * Hides the tooltip
   */
  private hideTooltip(): void {
    this.tooltip.style.opacity = '0';
    this.tooltip.setAttribute('aria-hidden', 'true');
  }

  /**
   * Updates the data points
   */
  updateDataPoints(dataPoints: ChartDataPoint[]): void {
    // Remove existing hotspots
    this.hotspots.forEach(hotspot => hotspot.remove());
    this.hotspots = [];

    // Create new hotspots
    this.dataPoints = dataPoints;
    this.createHotspots();
  }

  /**
   * Cleans up resources
   */
  destroy(): void {
    this.hotspots.forEach(hotspot => {
      hotspot.remove();
    });
    this.tooltip.remove();
    this.hotspots = [];
  }
}

/**
 * Airline delay data for the EDA chart
 */
export const airlineDelayData: ChartDataPoint[] = [
  {label: 'Frontier', value: '24%', x: 15, y: 20, width: 15, height: 8},
  {label: 'JetBlue', value: '22%', x: 30, y: 25, width: 15, height: 8},
  {label: 'Spirit', value: '21%', x: 45, y: 28, width: 15, height: 8},
  {label: 'Southwest', value: '19%', x: 60, y: 35, width: 15, height: 8},
  {label: 'American', value: '18%', x: 75, y: 40, width: 15, height: 8},
  {label: 'Delta', value: '15%', x: 90, y: 50, width: 15, height: 8},
];

/**
 * Initializes chart overlays for all chart containers
 *
 * @returns Cleanup function
 */
export function initChartOverlays(): () => void {
  const overlays: ChartOverlay[] = [];

  // Find all chart containers with data attributes
  document
    .querySelectorAll<HTMLElement>('[data-chart-overlay]')
    .forEach(container => {
      const dataKey = container.dataset.chartOverlay;

      // Map data key to data points
      let dataPoints: ChartDataPoint[] = [];
      if (dataKey === 'airline-delays') {
        dataPoints = airlineDelayData;
      }

      if (dataPoints.length > 0) {
        overlays.push(new ChartOverlay({container, dataPoints}));
      }
    });

  return () => {
    overlays.forEach(overlay => overlay.destroy());
  };
}
