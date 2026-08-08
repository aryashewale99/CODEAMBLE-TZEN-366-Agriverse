import { AGMARKNET_CONFIG } from '../config/apiConfig';
import { AgmarknetApiResponse, AgmarknetRecord } from '../types/agri';

export interface MarketFetchFilters {
  state?: string;
  district?: string;
  commodity?: string;
  market?: string;
  limit?: number;
  offset?: number;
}

const getEffectiveApiKey = (): string => {
  const key = AGMARKNET_CONFIG.apiKey;
  if (!key || key.includes('YOUR_') || key.includes('HERE')) {
    return '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
  }
  return key;
};

export class AgmarknetMarketService {
  /**
   * Fetches real daily mandi market price data from official data.gov.in Agmarknet API
   */
  async fetchMandiPrices(filters: MarketFetchFilters = {}): Promise<AgmarknetApiResponse> {
    const {
      state,
      district,
      commodity,
      market,
      limit = AGMARKNET_CONFIG.defaultLimit,
      offset = 0,
    } = filters;

    const apiKey = getEffectiveApiKey();
    let url = `${AGMARKNET_CONFIG.baseUrl}?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}`;


    if (state && state !== 'All') {
      url += `&filters[state]=${encodeURIComponent(state)}`;
    }
    if (district && district !== 'All') {
      url += `&filters[district]=${encodeURIComponent(district)}`;
    }
    if (commodity && commodity !== 'All') {
      url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
    }
    if (market && market !== 'All') {
      url += `&filters[market]=${encodeURIComponent(market)}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Government API HTTP status ${response.status}`);
      }

      const data: AgmarknetApiResponse = await response.json();

      if (data.error || (data.status && data.status !== 'ok')) {
        throw new Error(data.error || 'Agmarknet API returned non-ok status');
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch real Agmarknet data:', error);
      throw error; // Re-throw to handle gracefully with "Market data unavailable" state
    }
  }

  /**
   * Fetches historical daily records for a commodity to compute real 7-Day Price Trend
   */
  async fetchHistoricalPrices(commodity: string, limit = 60): Promise<AgmarknetRecord[]> {
    if (!commodity || commodity === 'All') {
      return [];
    }

    const apiKey = getEffectiveApiKey();
    const url = `${AGMARKNET_CONFIG.baseUrl}?api-key=${apiKey}&format=json&limit=${limit}&offset=0&filters[commodity]=${encodeURIComponent(commodity)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) return [];
      const data: AgmarknetApiResponse = await response.json();
      return data.records || [];
    } catch {
      return [];
    }
  }
}

export const marketService = new AgmarknetMarketService();
export default marketService;
