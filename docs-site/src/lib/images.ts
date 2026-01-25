/**
 * Image import utilities for the docs site
 *
 * Provides type-safe image imports using Astro's image optimization.
 */

// EDA Images
import edaAnnualDelayedFlights from '../assets/images/EDA_annual_delayed_flights.png';
import edaCorrelation from '../assets/images/EDA_correlation.png';
import edaDelayAverageByAirline from '../assets/images/EDA_delay_average_by_airline.png';
import edaDelayPrevFlight from '../assets/images/EDA_delay_prev_flight.png';
import edaDelaysByAirline from '../assets/images/EDA_delays_by_airline.png';
import edaFlightVolumeMap from '../assets/images/EDA_flight_volume_map.png';
import edaOntimeFlights from '../assets/images/EDA_ontime_flights.png';
import edaOriginDelays from '../assets/images/EDA_origin_delays.png';

// Architecture Images
import dataEngineering from '../assets/images/data_engineering.png';
import solutionArchitecture from '../assets/images/solution_architecture.png';
import lrToyExample from '../assets/images/LR_toy_example.png';

// Branding
import ucbLogo from '../assets/images/ucb.png';

/**
 * EDA visualization images
 */
export const edaImages = {
  annualDelayedFlights: edaAnnualDelayedFlights,
  correlation: edaCorrelation,
  delayAverageByAirline: edaDelayAverageByAirline,
  delayPrevFlight: edaDelayPrevFlight,
  delaysByAirline: edaDelaysByAirline,
  flightVolumeMap: edaFlightVolumeMap,
  ontimeFlights: edaOntimeFlights,
  originDelays: edaOriginDelays,
} as const;

/**
 * Architecture and pipeline images
 */
export const architectureImages = {
  dataEngineering,
  solutionArchitecture,
  lrToyExample,
} as const;

/**
 * Branding images
 */
export const brandingImages = {
  ucbLogo,
} as const;

/**
 * All images combined for easy access
 */
export const images = {
  eda: edaImages,
  architecture: architectureImages,
  branding: brandingImages,
} as const;

export type EdaImageKey = keyof typeof edaImages;
export type ArchitectureImageKey = keyof typeof architectureImages;
export type BrandingImageKey = keyof typeof brandingImages;
