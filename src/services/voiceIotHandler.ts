import { ParsedVoiceCommand } from './voiceIntentParser';
import { irrigationService } from './irrigationService';
import { mockWeatherData } from '../data/mockData';

export interface VoiceExecutionResult {
  speechResponse: string;
  actionTaken: string;
  requiresConfirmation: boolean;
  confirmationType?: 'CONFIRM_PUMP_ON';
  zoneId?: string;
  isEsp32Connected: boolean;
}

export class VoiceIotHandler {
  private isEsp32Connected = true;

  /**
   * Executes a parsed voice intent against ESP32 / Irrigation IoT services
   */
  async executeCommand(command: ParsedVoiceCommand): Promise<VoiceExecutionResult> {
    if (!this.isEsp32Connected) {
      return {
        speechResponse:
          'ESP32 Gateway is currently disconnected. Please check IoT controller power and Wi-Fi signal.',
        actionTaken: 'ESP32 Disconnected Error',
        requiresConfirmation: false,
        isEsp32Connected: false,
      };
    }

    const zones = await irrigationService.getZones();
    const zone1 = zones.find((z) => z.id === 'z1' || z.id === 'zone-1') || zones[0];

    switch (command.intent) {
      case 'TURN_ON_PUMP':
        return {
          speechResponse:
            'Confirmation Required: Are you sure you want to start the Irrigation Water Pump for North Field Sector A?',
          actionTaken: 'Awaiting User Confirmation for Pump Start',
          requiresConfirmation: true,
          confirmationType: 'CONFIRM_PUMP_ON',
          zoneId: zone1 ? zone1.id : 'z1',
          isEsp32Connected: true,
        };

      case 'TURN_OFF_PUMP': {
        const runningZone = zones.find((z) => z.isPumpOn) || zone1;
        if (runningZone && runningZone.isPumpOn) {
          await irrigationService.togglePump(runningZone.id);
        }
        return {
          speechResponse:
            'Water pump turned off successfully. Irrigation Zone 1 is now idle.',
          actionTaken: 'Water Pump Turned Off via ESP32 Relay',
          requiresConfirmation: false,
          isEsp32Connected: true,
        };
      }

      case 'GET_SOIL_MOISTURE': {
        const avgMoisture =
          zones.length > 0
            ? Math.round(zones.reduce((sum, z) => sum + z.soilMoisture, 0) / zones.length)
            : 42;
        const statusText =
          avgMoisture < 35 ? 'Soil moisture is low (Dry).' : 'Soil moisture is optimal (42%).';

        return {
          speechResponse: `${statusText} Field Block A sensor reads ${avgMoisture}% VWC.`,
          actionTaken: 'Queried Soil Moisture Sensor',
          requiresConfirmation: false,
          isEsp32Connected: true,
        };
      }

      case 'GET_TEMPERATURE': {
        return {
          speechResponse: `Current field temperature is ${mockWeatherData.temperature}°C with ${mockWeatherData.condition.toLowerCase()} skies.`,
          actionTaken: 'Queried Weather Sensor',
          requiresConfirmation: false,
          isEsp32Connected: true,
        };
      }

      case 'GET_HUMIDITY': {
        return {
          speechResponse: `Relative humidity across the farm is currently ${mockWeatherData.humidity}%.`,
          actionTaken: 'Queried Humidity Sensor',
          requiresConfirmation: false,
          isEsp32Connected: true,
        };
      }

      case 'GET_IRRIGATION_STATUS': {
        const activeCount = zones.filter((z) => z.isPumpOn).length;
        return {
          speechResponse: `Smart Irrigation is operating in Auto Mode. ${activeCount} pump running out of ${zones.length} field zones.`,
          actionTaken: 'Queried Irrigation Controller Status',
          requiresConfirmation: false,
          isEsp32Connected: true,
        };
      }

      case 'UNKNOWN':
      default:
        return {
          speechResponse:
            'Command not recognized. Try asking: "What is the soil moisture?" or "Turn on irrigation".',
          actionTaken: 'Unclear Command State',
          requiresConfirmation: false,
          isEsp32Connected: true,
        };
    }
  }

  /**
   * Confirms and executes pump turn-on after explicit user confirmation
   */
  async confirmTurnOnPump(zoneId = 'z1'): Promise<VoiceExecutionResult> {
    const zones = await irrigationService.getZones();
    const targetZone = zones.find((z) => z.id === zoneId) || zones[0];

    if (targetZone && !targetZone.isPumpOn) {
      await irrigationService.togglePump(targetZone.id);
    }

    return {
      speechResponse:
        'Water pump started successfully. ESP32 Relay Activated for Zone A.',
      actionTaken: 'Water Pump Started (User Confirmed)',
      requiresConfirmation: false,
      isEsp32Connected: true,
    };
  }

  setEsp32ConnectedStatus(connected: boolean) {
    this.isEsp32Connected = connected;
  }
}

export const voiceIotHandler = new VoiceIotHandler();
export default voiceIotHandler;
