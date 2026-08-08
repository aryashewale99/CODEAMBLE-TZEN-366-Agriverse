export interface FarmAnalyticsReport {
  season: string;
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  profitMarginPercent: number;
  carbonOffsetTons: number;
  waterSavedGallons: number;
}

export class AnalyticsService {
  async getSeasonalReport(season = 'Rabi 2024'): Promise<FarmAnalyticsReport> {
    const isRabi = season === 'Rabi 2024';
    return {
      season,
      totalRevenue: isRabi ? 1080000 : 980000,
      totalCost: 320000,
      netProfit: isRabi ? 760000 : 660000,
      profitMarginPercent: isRabi ? 70.3 : 67.3,
      carbonOffsetTons: 14.2,
      waterSavedGallons: 340000,
    };
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
