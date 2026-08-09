import apiClient from './apiClient';

declare var window: any;
declare var navigator: any;
declare var SpeechSynthesisUtterance: any;

export interface VoiceQueryResponse {
  success: boolean;
  transcript: string;
  speechResponse: string;
  intent: string;
  actionTaken: string;
  source: string;
  error?: string;
}

export interface VoiceStatusResponse {
  success: boolean;
  openAiActive: boolean;
  engineName: string;
}

export class VoiceService {
  /**
   * Fetches real-time AI Voice Engine status from backend
   */
  async getVoiceStatus(): Promise<VoiceStatusResponse> {
    try {
      const res = await apiClient.get<VoiceStatusResponse>('/voice/status');
      return res;
    } catch (e: any) {
      console.warn('Failed to fetch backend voice status:', e);
      return {
        success: false,
        openAiActive: false,
        engineName: 'AgriVerse Backend Agronomic Engine',
      };
    }
  }

  /**
   * Checks microphone permission status
   */
  async requestMicrophonePermission(): Promise<boolean> {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        return true;
      }
      return true;
    } catch (e) {
      console.warn('Microphone permission check warning:', e);
      return true;
    }
  }

  /**
   * Sends actual recognized transcript text to AgriVerse Backend Voice AI service
   */
  async queryVoiceBackend(transcript: string): Promise<VoiceQueryResponse> {
    if (!transcript || !transcript.trim()) {
      return {
        success: false,
        transcript: '',
        speechResponse: 'No speech was detected. Please tap the microphone and speak your query.',
        intent: 'EMPTY_SPEECH',
        actionTaken: 'No Action Taken',
        source: 'Client Validation',
        error: 'No speech detected.',
      };
    }

    try {
      const res = await apiClient.post<VoiceQueryResponse>('/voice/query', {
        transcript: transcript.trim(),
      });
      return res;
    } catch (e: any) {
      console.error('Backend voice query error:', e);
      return {
        success: false,
        transcript: transcript.trim(),
        speechResponse: 'Unable to reach AgriVerse Voice AI backend. Please check your network connection.',
        intent: 'NETWORK_ERROR',
        actionTaken: 'Service Offline',
        source: 'Error Handler',
        error: e?.message || 'Network failure',
      };
    }
  }

  /**
   * Synthesizes text response to speech aloud using SpeechSynthesis API / Audio
   */
  async speakText(text: string): Promise<boolean> {
    if (!text || !text.trim()) return false;

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
        return true;
      }
    } catch (e) {
      console.warn('Speech synthesis playback warning:', e);
    }

    console.log(`[Text-to-Speech Output]: ${text}`);
    return true;
  }
}

export const voiceService = new VoiceService();
export default voiceService;
