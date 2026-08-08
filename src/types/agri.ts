export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  uvIndex: number;
  advisory: string;
  forecast: DailyForecast[];
}

export interface DailyForecast {
  day: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  icon: string;
  rainChance: number;
}

export interface CropRecommendationInput {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  temperature: string;
  humidity: string;
  ph: string;
  rainfall: string;
  soilType: string;
}

export interface RecommendedCrop {
  id: string;
  name: string;
  matchScore: number; // e.g. 95%
  season: string;
  growthDuration: string;
  waterReq: string;
  idealPh: string;
  expectedYield: string;
  description: string;
  matchReasons?: string[];
  scoreBreakdown?: {
    soilMatch: number;
    climateMatch: number;
    npkMatch: number;
    waterMatch: number;
  };
}

export interface DiseaseDetectionResult {
  diseaseName: string;
  affectedCrop: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  symptoms: string[];
  treatment: string[];
  preventiveMeasures: string[];
  isHealthy?: boolean;
  immediateAction?: string[];
  unclearImageReason?: string;
  disclaimer?: string;
}

export interface IrrigationZone {
  id: string;
  name: string;
  crop: string;
  soilMoisture: number; // percentage
  status: 'Auto' | 'Active' | 'Idle';
  lastWatered: string;
  nextScheduled: string;
  targetMoisture: number;
  isPumpOn: boolean;
}

export interface FarmMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  unit?: string;
}

export interface MarketCommodity {
  id: string;
  name: string;
  category: string;
  mandi: string;
  pricePerQuintal: number;
  previousPrice: number;
  changePercent: number;
  unit: string;
  updatedAt: string;
}

export interface FarmerProfile {
  name: string;
  location: string;
  state: string;
  district: string;
  farmSizeAcres?: number;
  soilTypes?: string[];
  primaryCrops?: string[];
  memberSince?: string;
  phone?: string;
  email?: string;
}

export interface AgmarknetRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: number | string;
  max_price: number | string;
  modal_price: number | string;
}

export interface AgmarknetApiResponse {
  status: string;
  total: number;
  count: number;
  limit: string | number;
  offset: string | number;
  updated_date?: string;
  records: AgmarknetRecord[];
  error?: string;
}

