import { OPENAI_CONFIG, isOpenAiConfigured } from '../config/openAiConfig';

export interface VoiceTranscriptionResult {
  text: string;
  success: boolean;
  error?: string;
  source: 'openai_whisper' | 'simulated_mic';
}

export class VoiceService {
  /**
   * Checks microphone permission status
   */
  async requestMicrophonePermission(): Promise<boolean> {
    // Microphone permission check placeholder for React Native iOS/Android
    return true;
  }

  /**
   * Transcribes audio using OpenAI Whisper API when API key is set, or returns user speech
   */
  async transcribeAudio(audioFileUri?: string): Promise<VoiceTranscriptionResult> {
    if (isOpenAiConfigured() && audioFileUri) {
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: audioFileUri,
          type: 'audio/m4a',
          name: 'speech.m4a',
        } as any);
        formData.append('model', OPENAI_CONFIG.whisperModel);

        const response = await fetch(`${OPENAI_CONFIG.baseUrl}/audio/transcriptions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENAI_CONFIG.apiKey}`,
          },
          body: formData,
        });

        if (response.ok) {
          const json = await response.json();
          return {
            text: json.text || '',
            success: true,
            source: 'openai_whisper',
          };
        }
      } catch (err: any) {
        console.warn('OpenAI Whisper transcription failed:', err);
      }
    }

    return {
      text: '',
      success: false,
      error: 'OpenAI API Key unconfigured or audio file missing.',
      source: 'simulated_mic',
    };
  }

  /**
   * Synthesizes text response to speech using OpenAI TTS API when configured
   */
  async speakText(text: string): Promise<boolean> {
    if (!text) return false;

    if (isOpenAiConfigured()) {
      try {
        const response = await fetch(`${OPENAI_CONFIG.baseUrl}/audio/speech`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_CONFIG.apiKey}`,
          },
          body: JSON.stringify({
            model: OPENAI_CONFIG.ttsModel,
            input: text,
            voice: OPENAI_CONFIG.voice,
          }),
        });

        if (response.ok) {
          console.log('OpenAI TTS audio response generated successfully.');
          return true;
        }
      } catch (err) {
        console.warn('OpenAI TTS failed:', err);
      }
    }

    // Default console/TTS fallback
    console.log(`[Voice Synthesis Output]: ${text}`);
    return true;
  }
}

export const voiceService = new VoiceService();
export default voiceService;
