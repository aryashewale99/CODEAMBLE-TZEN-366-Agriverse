import { useState, useEffect, useCallback } from 'react';
import { IrrigationZone } from '../types/agri';
import { irrigationService } from '../services/irrigationService';

export const useIrrigation = () => {
  const [zones, setZones] = useState<IrrigationZone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchZones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await irrigationService.getZones();
      setZones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const togglePump = async (zoneId: string) => {
    const updated = await irrigationService.togglePump(zoneId);
    setZones((prev) => prev.map((z) => (z.id === zoneId ? updated : z)));
  };

  return { zones, loading, togglePump, refresh: fetchZones };
};
