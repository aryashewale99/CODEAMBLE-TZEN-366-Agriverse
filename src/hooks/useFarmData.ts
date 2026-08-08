import { useState, useEffect } from 'react';
import { IrrigationZone, FarmerProfile, MarketCommodity } from '../types/agri';
import { farmService } from '../services/farmService';

export const useFarmData = () => {
  const [zones, setZones] = useState<IrrigationZone[]>([]);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [market, setMarket] = useState<MarketCommodity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [z, p, m] = await Promise.all([
        farmService.getIrrigationZones(),
        farmService.getFarmerProfile(),
        farmService.getMarketPrices(),
      ]);
      setZones(z);
      setProfile(p);
      setMarket(m);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return { zones, profile, market, loading, refresh: loadAll };
};
