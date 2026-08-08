import { OPENAI_CONFIG, isOpenAiConfigured } from '../config/openAiConfig';

export type VoiceIntentType =
  | 'TURN_ON_PUMP'
  | 'TURN_OFF_PUMP'
  | 'GET_SOIL_MOISTURE'
  | 'GET_TEMPERATURE'
  | 'GET_HUMIDITY'
  | 'GET_IRRIGATION_STATUS'
  | 'UNKNOWN';

export interface ParsedVoiceCommand {
  intent: VoiceIntentType;
  transcript: string;
  confidence: number;
  requiresConfirmation: boolean;
  explanation: string;
  source: 'openai_gpt4o' | 'local_rule_engine';
}

export class VoiceIntentParser {
  /**
   * Parses natural language speech text into structured intent
   */
  async parseIntent(transcript: string): Promise<ParsedVoiceCommand> {
    const text = transcript.trim().toLowerCase();

    // If OpenAI key is configured, invoke OpenAI Chat Completions endpoint
    if (isOpenAiConfigured()) {
      try {
        const response = await fetch(`${OPENAI_CONFIG.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_CONFIG.apiKey}`,
          },
          body: JSON.stringify({
            model: OPENAI_CONFIG.model,
            messages: [
              {
                role: 'system',
                content:
                  'You are AgriVerse Voice AI Assistant. Classify user speech into one of these intents: TURN_ON_PUMP, TURN_OFF_PUMP, GET_SOIL_MOISTURE, GET_TEMPERATURE, GET_HUMIDITY, GET_IRRIGATION_STATUS, UNKNOWN. Respond ONLY in valid JSON format: {"intent": "...", "explanation": "..."}.',
              },
              { role: 'user', content: transcript },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
        });

        if (response.ok) {
          const json = await response.json();
          const parsed = JSON.parse(json.choices[0].message.content);
          const intent: VoiceIntentType = parsed.intent || 'UNKNOWN';
          return {
            intent,
            transcript,
            confidence: 0.95,
            requiresConfirmation: intent === 'TURN_ON_PUMP',
            explanation: parsed.explanation || `OpenAI parsed intent: ${intent}`,
            source: 'openai_gpt4o',
          };
        }
      } catch (err) {
        console.warn('OpenAI intent parser request failed, using local rule parser:', err);
      }
    }

    // Fallback Local Natural Language Intent Matching (for offline/quick commands or when OpenAI key is not set)
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
      intent: 'UNKNOWN',
      transcript: rawTranscript,
      confidence: 0.0,
      requiresConfirmation: false,
      explanation: 'Command not recognized. Try asking: "What is the soil moisture?" or "Turn on irrigation".',
      source: 'local_rule_engine',
    };
  }
}

export const voiceIntentParser = new VoiceIntentParser();
export default voiceIntentParser;
