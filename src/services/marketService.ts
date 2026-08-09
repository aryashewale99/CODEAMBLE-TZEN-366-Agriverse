import { AgmarknetApiResponse, AgmarknetRecord } from '../types/agri';
import apiClient from './apiClient';

export interface MarketFetchFilters {
  state?: string;
  district?: string;
  commodity?: string;
  market?: string;
  limit?: number;
  offset?: number;
}

export class AgmarknetMarketService {
  /**
   * Fetches real daily mandi market price data via AgriVerse backend API proxying data.gov.in
   */
  async fetchMandiPrices(filters: MarketFetchFilters = {}): Promise<AgmarknetApiResponse> {
    const { state, district, commodity, market, limit = 100, offset = 0 } = filters;
    const params = new URLSearchParams();
    if (state && state !== 'All') params.append('state', state);
    if (district && district !== 'All') params.append('district', district);
    if (commodity && commodity !== 'All') params.append('commodity', commodity);
    if (market && market !== 'All') params.append('market', market);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const res = await apiClient.get<AgmarknetApiResponse>(`/market/prices?${params.toString()}`);
    if (res && (res.records || (res as any).success)) {
      return res;
    }
    throw new Error('Agmarknet Mandi Market API response invalid or unavailable.');
  }

  async fetchHistoricalPrices(commodity: string, limit = 60): Promise<AgmarknetRecord[]> {
    if (!commodity || commodity === 'All') {
      return [];
    }
    try {
      const res = await this.fetchMandiPrices({ commodity, limit });
      return res.records || [];
    } catch {
      return [];
    }
  }
}

export const marketService = new AgmarknetMarketService();
export default marketService;
