import { IrrigationZone } from '../types/agri';
import { mockIrrigationZones } from '../data/mockData';

export class IrrigationService {
  private zones: IrrigationZone[] = mockIrrigationZones;

  async getZones(): Promise<IrrigationZone[]> {
    return this.zones;
  }

  async togglePump(zoneId: string): Promise<IrrigationZone> {
    this.zones = this.zones.map((zone) =>
      zone.id === zoneId
        ? {
            ...zone,
            isPumpOn: !zone.isPumpOn,
            status: !zone.isPumpOn ? 'Active' : 'Idle',
            soilMoisture: !zone.isPumpOn
              ? Math.min(100, zone.soilMoisture + 15)
              : zone.soilMoisture,
          }
        : zone
    );
    return this.zones.find((z) => z.id === zoneId)!;
  }

  async updateMoistureThreshold(
    zoneId: string,
    target: number
  ): Promise<IrrigationZone> {
    this.zones = this.zones.map((zone) =>
      zone.id === zoneId ? { ...zone, targetMoisture: target } : zone
    );
    return this.zones.find((z) => z.id === zoneId)!;
  }
}

export const irrigationService = new IrrigationService();
export default irrigationService;
