import { IrrigationZone } from '../types/agri';
import apiClient from './apiClient';

export class IrrigationService {
  async getZones(): Promise<IrrigationZone[]> {
    const res = await apiClient.get<{ success: boolean; zones: IrrigationZone[] }>('/irrigation/zones');
    if (res && res.success && res.zones) {
      return res.zones;
    }
    throw new Error('Irrigation zones data unavailable from backend service.');
  }

  async togglePump(zoneId: string): Promise<IrrigationZone> {
    const res = await apiClient.post<{ success: boolean; zone: IrrigationZone }>('/irrigation/toggle', { zoneId });
    if (res && res.success && res.zone) {
      return res.zone;
    }
    throw new Error('Failed to toggle pump state on backend service.');
  }

  async updateMoistureThreshold(zoneId: string, target: number): Promise<IrrigationZone> {
    const res = await apiClient.post<{ success: boolean; zone: IrrigationZone }>('/irrigation/threshold', {
      zoneId,
      targetMoisture: target,
    });
    if (res && res.success && res.zone) {
      return res.zone;
    }
    throw new Error('Failed to update moisture threshold on backend service.');
  }
}

export const irrigationService = new IrrigationService();
export default irrigationService;
