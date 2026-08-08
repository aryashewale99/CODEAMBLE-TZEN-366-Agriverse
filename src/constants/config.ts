export const APP_CONFIG = {
  appName: 'AgriVerse',
  tagline: 'Smart Farming, Empowered Agriculture',
  version: '1.0.0',
  apiBaseUrl: 'https://api.agriverse.io/v1',
  supportEmail: 'support@agriverse.io',
  defaultLocation: {
    latitude: 28.6139,
    longitude: 77.209,
    region: 'North Field Sector 4',
  },
};

export const CROP_CATEGORIES = [
  'All',
  'Cereals',
  'Pulses',
  'Cash Crops',
  'Vegetables',
  'Fruits',
] as const;

export const ALERT_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;
