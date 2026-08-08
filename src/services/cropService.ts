import { RecommendedCrop, DiseaseDetectionResult } from '../types/agri';
import { calculateCropRecommendations, CropInputParams } from './cropRecommendationEngine';

export const cropService = {
  async getRecommendations(inputs?: Partial<CropInputParams>): Promise<RecommendedCrop[]> {
    const params: CropInputParams = {
      soilType: inputs?.soilType || 'Loam',
      season: inputs?.season || 'Kharif',
      waterAvailability: inputs?.waterAvailability || 'Medium',
      nitrogen: inputs?.nitrogen || '90',
      phosphorus: inputs?.phosphorus || '45',
      potassium: inputs?.potassium || '45',
      ph: inputs?.ph || '6.5',
      temperature: inputs?.temperature || '26',
      rainfall: inputs?.rainfall || '500',
      state: inputs?.state || '',
      district: inputs?.district || '',
      farmSize: inputs?.farmSize || '12.5',
      humidity: inputs?.humidity || '60',
    };
    return calculateCropRecommendations(params);
  },

  async diagnoseDisease(_imageUri?: string): Promise<DiseaseDetectionResult> {
    return {
      diseaseName: 'Tomato Early Blight (Alternaria solani)',
      affectedCrop: 'Tomato / Solanaceae',
      confidence: 94.2,
      severity: 'Moderate',
      symptoms: [
        'Concentric dark rings on lower leaves',
        'Yellowing margins surrounding leaf lesions',
        'Partial defoliation near leaf bases',
      ],
      treatment: [
        'Apply copper-based fungicide or Mancozeb 75% WP @ 2g/liter',
        'Prune and safely discard lower infected leaves',
        'Avoid overhead sprinkler irrigation to keep foliage dry',
      ],
      preventiveMeasures: [
        'Implement 3-year crop rotation with non-host crops',
        'Maintain proper row spacing for adequate airflow',
        'Apply neem oil preventative spray bi-weekly',
      ],
    };
  },
};
