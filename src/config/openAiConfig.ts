/**
 * OpenAI Configuration for AgriVerse Voice AI Assistant
 * 
 * SECURITY NOTICE:
 * The OpenAI API Key is NEVER stored or processed on the client side.
 * All voice AI requests are proxied securely through the AgriVerse backend
 * using process.env.OPENAI_API_KEY.
 */

export const OPENAI_CONFIG = {
  model: 'gpt-4o-mini',
  whisperModel: 'whisper-1',
  ttsModel: 'tts-1',
  voice: 'alloy',
};
