import { IrrigationZone, MarketCommodity, FarmerProfile } from '../types/agri';
import { authService } from './authService';

export const farmService = {
  async getIrrigationZones(): Promise<IrrigationZone[]> {
    return [
      {
        id: 'zone-1',
        name: 'North Sector A (Wheat)',
        crop: 'Wheat PBW 550',
        soilMoisture: 42,
        status: 'Active',
        lastWatered: '2 hours ago',
        nextScheduled: 'Today, 6:00 PM',
        targetMoisture: 65,
        isPumpOn: true,
      },
      {
        id: 'zone-2',
        name: 'East Sector B (Maize)',
        crop: 'Hybrid Maize',
        soilMoisture: 68,
        status: 'Auto',
        lastWatered: 'Yesterday, 8:00 AM',
        nextScheduled: 'Tomorrow, 7:00 AM',
        targetMoisture: 60,
        isPumpOn: false,
      },
      {
        id: 'zone-3',
        name: 'Polyhouse 1 (Tomato)',
        crop: 'Cherry Tomato',
        soilMoisture: 55,
        status: 'Auto',
        lastWatered: '4 hours ago',
        nextScheduled: 'Today, 4:30 PM',
        targetMoisture: 70,
        isPumpOn: false,
      },
    ];
  },

  async getMarketPrices(): Promise<MarketCommodity[]> {
    return [
      {
        id: 'c-1',
        name: 'Wheat (Sharbati)',
        category: 'Cereals',
        mandi: 'Khanna Grain Market',
        pricePerQuintal: 2450,
        previousPrice: 2380,
        changePercent: 2.94,
        unit: 'Quintal',
        updatedAt: '10 mins ago',
      },
      {
        id: 'c-2',
        name: 'Basmati Rice (1121)',
        category: 'Cereals',
        mandi: 'Karnal Mandi',
        pricePerQuintal: 4200,
        previousPrice: 4250,
        changePercent: -1.18,
        unit: 'Quintal',
        updatedAt: '25 mins ago',
      },
      {
        id: 'c-3',
        name: 'Cotton (Long Staple)',
        category: 'Cash Crops',
        mandi: 'Abohar Mandi',
        pricePerQuintal: 7100,
        previousPrice: 6950,
        changePercent: 2.16,
        unit: 'Quintal',
        updatedAt: '1 hour ago',
      },
      {
        id: 'c-4',
        name: 'Mustard Seeds',
        category: 'Oilseeds',
        mandi: 'Jaipur Mandi',
        pricePerQuintal: 5650,
        previousPrice: 5600,
        changePercent: 0.89,
        unit: 'Quintal',
        updatedAt: '45 mins ago',
      },
    ];
  },

  async getFarmerProfile(): Promise<FarmerProfile | null> {
    return authService.getProfile();
  },
};
