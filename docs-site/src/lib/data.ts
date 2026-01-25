/**
 * Static data and metrics for the docs site
 */

import type {DatasetInfo, ModelMetrics, TeamMember} from '../types';

export const problemStats = {
  annualCost: '$28B',
  delayedFlights: '20%',
  averageDelay: '45 min',
};

export const datasets: Record<string, DatasetInfo> = {
  flights: {records: '31,746,841', years: '2015-2019', fields: 109},
  weather: {stations: 630, observations: '~630M'},
  stations: {count: 5873, mapped: 630},
};

export const features = {
  total: 35,
  selected: 6,
  topFeatures: [
    'DEP_DEL15_PREV',
    'CRS_DEP_TIME_bucket',
    'OD_GROUP',
    'wnd_speed',
    'vis_distance',
    'dest_tmp',
  ],
};

export const modelResults: Record<string, ModelMetrics> = {
  logisticRegression: {name: 'Logistic Regression', f1: 0.41, auc: 0.7},
  randomForest: {name: 'Random Forest', f1: 0.44, auc: 0.72},
  neuralNetwork: {name: 'Neural Network', f1: 0.49, auc: 0.73},
};

export const team: TeamMember[] = [
  {name: 'Cristopher Benge', linkedin: 'https://cbenge509.github.io/'},
  {name: 'Ning Li', linkedin: 'https://www.linkedin.com/in/louisli/'},
  {name: 'Andrew Fogarty', linkedin: 'https://www.linkedin.com/in/afogarty85/'},
  {name: 'Siduo Jiang', linkedin: 'https://www.linkedin.com/in/siduojiang/'},
];

export const airports = [
  {code: 'JFK', lat: 40.6413, lng: -73.7781},
  {code: 'LAX', lat: 33.9416, lng: -118.4085},
  {code: 'ORD', lat: 41.9742, lng: -87.9073},
  {code: 'DFW', lat: 32.8998, lng: -97.0403},
  {code: 'DEN', lat: 39.8561, lng: -104.6737},
  {code: 'ATL', lat: 33.6407, lng: -84.4277},
  {code: 'SFO', lat: 37.6213, lng: -122.379},
  {code: 'SEA', lat: 47.4502, lng: -122.3088},
  {code: 'MIA', lat: 25.7959, lng: -80.287},
  {code: 'BOS', lat: 42.3656, lng: -71.0096},
];
