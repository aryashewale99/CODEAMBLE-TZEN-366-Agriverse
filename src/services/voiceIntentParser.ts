export type VoiceIntentType =
  | 'TURN_ON_PUMP'
  | 'TURN_OFF_PUMP'
  | 'GET_SOIL_MOISTURE'
  | 'GET_TEMPERATURE'
  | 'GET_HUMIDITY'
  | 'GET_IRRIGATION_STATUS'
  | 'CROP_RECOMMENDATION'
  | 'GET_WEATHER'
  | 'GET_MARKET_PRICES'
  | 'GENERAL_AGRI'
  | 'OPENAI_CHAT'
  | 'UNKNOWN';

export interface ParsedVoiceCommand {
  intent: VoiceIntentType;
  transcript: string;
  confidence: number;
  requiresConfirmation: boolean;
  explanation: string;
  source: string;
}

export class VoiceIntentParser {
  /**
   * Parses natural language speech text locally as fallback if needed.
   * Main AI processing is performed securely on the backend server.
   */
  async parseIntent(transcript: string): Promise<ParsedVoiceCommand> {
    const text = transcript.trim().toLowerCase();
    return this.parseLocalIntent(text, transcript);
  }

  private parseLocalIntent(text: string, rawTranscript: string): ParsedVoiceCommand {
    if (
      text.includes('turn on irrigation') ||
      text.includes('start irrigation') ||
      text.includes('start the water pump') ||
      text.includes('turn on the water pump') ||
      text.includes('turn on pump') ||
      text.includes('start pump')
    ) {
      return {
        intent: 'TURN_ON_PUMP',
        transcript: rawTranscript,
        confidence: 0.9,
        requiresConfirmation: true,
        explanation: 'Command recognized to turn on water pump.',
        source: 'local_rule_engine',
      };
    }

    if (
      text.includes('turn off irrigation') ||
      text.includes('stop irrigation') ||
      text.includes('stop the water pump') ||
      text.includes('turn off the water pump') ||
      text.includes('turn off pump') ||
      text.includes('stop pump')
    ) {
      return {
        intent: 'TURN_OFF_PUMP',
        transcript: rawTranscript,
        confidence: 0.9,
        requiresConfirmation: false,
        explanation: 'Command recognized to turn off water pump.',
        source: 'local_rule_engine',
      };
    }

    if (
      text.includes('soil moisture') ||
      text.includes('is my soil dry') ||
      text.includes('moisture level') ||
      text.includes('how dry is the soil')
    ) {
      return {
        intent: 'GET_SOIL_MOISTURE',
        transcript: rawTranscript,
        confidence: 0.92,
        requiresConfirmation: false,
        explanation: 'Query recognized for soil moisture telemetry.',
        source: 'local_rule_engine',
      };
    }

    if (
      text.includes('temperature') ||
      text.includes('how hot is it') ||
      text.includes('field temp')
    ) {
      return {
        intent: 'GET_TEMPERATURE',
        transcript: rawTranscript,
        confidence: 0.92,
        requiresConfirmation: false,
        explanation: 'Query recognized for field temperature.',
        source: 'local_rule_engine',
      };
    }

    if (text.includes('humidity') || text.includes('relative humidity')) {
      return {
        intent: 'GET_HUMIDITY',
        transcript: rawTranscript,
        confidence: 0.92,
        requiresConfirmation: false,
        explanation: 'Query recognized for field humidity.',
        source: 'local_rule_engine',
      };
    }

    if (
      text.includes('irrigation status') ||
      text.includes('pump status') ||
      text.includes('are pumps running')
    ) {
      return {
        intent: 'GET_IRRIGATION_STATUS',
        transcript: rawTranscript,
        confidence: 0.9,
        requiresConfirmation: false,
        explanation: 'Query recognized for irrigation system status.',
        source: 'local_rule_engine',
      };
    }

    return {
      intent: 'GENERAL_AGRI',
      transcript: rawTranscript,
      confidence: 0.85,
      requiresConfirmation: false,
      explanation: 'General agricultural voice query.',
      source: 'local_rule_engine',
    };
  }
}

export const voiceIntentParser = new VoiceIntentParser();
export default voiceIntentParser;
