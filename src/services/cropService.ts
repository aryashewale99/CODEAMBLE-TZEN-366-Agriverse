import { RecommendedCrop } from '../types/agri';
import { CropInputParams } from './cropRecommendationEngine';
import apiClient from './apiClient';

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

    const res = await apiClient.post<{ success: boolean; recommendations: RecommendedCrop[] }>(
      '/crop/recommend',
      params
    );

    if (res && res.success && res.recommendations) {
      return res.recommendations;
    }
    throw new Error('Failed to compute crop recommendations from backend service.');
  },
};

export default cropService;
