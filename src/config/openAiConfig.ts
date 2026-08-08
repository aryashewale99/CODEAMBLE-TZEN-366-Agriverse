/**
 * OpenAI Configuration Placeholder for AgriVerse Voice AI Assistant
 * 
 * IMPORTANT:
 * DO NOT hardcode or commit secret API keys into source code for production.
 * Leave apiKey empty below. Add your key manually when ready for testing/deployment.
 */
export const OPENAI_CONFIG = {
  apiKey: '', // <-- Paste your OpenAI API Key here (e.g. 'sk-proj-...')
  model: 'gpt-4o-mini',
  whisperModel: 'whisper-1',
  ttsModel: 'tts-1',
  voice: 'alloy',
  baseUrl: 'https://api.openai.com/v1',
};

export const isOpenAiConfigured = (): boolean => {
  return typeof OPENAI_CONFIG.apiKey === 'string' && OPENAI_CONFIG.apiKey.trim().length > 0;
};
