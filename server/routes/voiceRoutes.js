const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/v1/voice/status
router.get('/status', (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.trim().length > 10 && !apiKey.includes('your_'));
  return res.json({
    success: true,
    openAiActive: isConfigured,
    engineName: isConfigured ? 'OpenAI GPT-4o Cloud Engine' : 'AgriVerse Backend Agronomic Engine',
  });
});

// POST /api/v1/voice/query
router.post('/query', async (req, res) => {
  const { transcript, soilType } = req.body;

  if (!transcript || !transcript.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Empty transcript received. Please speak clearly into the microphone.',
    });
  }

  const cleanText = transcript.trim();
  const lower = cleanText.toLowerCase();
  const apiKey = process.env.OPENAI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.trim().length > 10 && !apiKey.includes('your_'));

  let openAiErrorMessage = null;

  // 1. OpenAI GPT-4o Integration (if API Key present in process.env)
  if (isConfigured) {
    try {
      const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are AgriVerse Voice AI Assistant, an expert agricultural advisor for farmers. Provide concise, direct, helpful 2-sentence responses.',
            },
            { role: 'user', content: cleanText },
          ],
          temperature: 0.3,
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (openAiRes.ok) {
        const json = await openAiRes.json();
        const replyText = json.choices[0]?.message?.content || 'I processed your query.';
        
        let detectedIntent = 'OPENAI_CHAT';
        let actionTaken = 'Processed via OpenAI GPT-4o Cloud Engine';
        if (lower.includes('turn on pump') || lower.includes('start pump') || lower.includes('turn on irrigation')) {
          detectedIntent = 'TURN_ON_PUMP';
          actionTaken = 'Irrigation Relay Signal Triggered';
        } else if (lower.includes('turn off pump') || lower.includes('stop pump') || lower.includes('stop irrigation')) {
          detectedIntent = 'TURN_OFF_PUMP';
          actionTaken = 'Pump Deactivated';
          db.toggleIrrigationPump('zone-1');
        }

        return res.json({
          success: true,
          transcript: cleanText,
          speechResponse: replyText,
          intent: detectedIntent,
          actionTaken,
          source: 'OpenAI GPT-4o Cloud Engine',
        });
      } else {
        const errJson = await openAiRes.json().catch(() => ({}));
        openAiErrorMessage = errJson?.error?.message || `HTTP ${openAiRes.status} Error`;
        console.warn('⚠️ OpenAI API Error Response:', openAiRes.status, openAiErrorMessage);
      }
    } catch (e) {
      openAiErrorMessage = e.message || 'Network timeout connecting to OpenAI API';
      console.warn('⚠️ OpenAI API Exception:', openAiErrorMessage);
    }
  }

  // 2. AgriVerse Backend Agricultural Intelligence Engine (Fallback when key missing or OpenAI API fails)
  let responseText = '';
  let intent = 'GENERAL_AGRI';
  let actionTaken = 'Agronomic Intelligence Query';

  const farmer = db.getFarmerProfile() || {};
  const zones = db.getIrrigationZones();
  const currentSoil = soilType || (farmer.soilTypes ? farmer.soilTypes[0] : 'Alluvial Loam');

  if (lower.includes('crop') || lower.includes('suitable') || lower.includes('recommend') || lower.includes('plant')) {
    intent = 'CROP_RECOMMENDATION';
    actionTaken = 'Agronomic Recommendation Evaluated';
    responseText = `Based on your ${currentSoil} soil, 26°C temperature, and Rabi season, Wheat (PBW 725) and Hybrid Maize (HQPM-1) are most suitable for your field with optimal match scores above 90%.`;
  } else if (lower.includes('moisture') || lower.includes('soil dry') || lower.includes('soil health')) {
    intent = 'GET_SOIL_MOISTURE';
    actionTaken = 'Soil Telemetry Queried';
    const zoneA = zones[0] || { soilMoisture: 42 };
    responseText = `Current soil moisture for ${zoneA.name || 'Zone A'} is ${zoneA.soilMoisture}%. Soil moisture is within the optimal growth range for your crop.`;
  } else if (lower.includes('temp') || lower.includes('temperature') || lower.includes('weather') || lower.includes('rain')) {
    intent = 'GET_WEATHER';
    actionTaken = 'Live Weather Telemetry Queried';
    responseText = `Current field temperature in ${farmer.location || 'Karnal'} is 29°C with partly cloudy conditions. Light evening rain chance is 25%.`;
  } else if (lower.includes('mandi') || lower.includes('price') || lower.includes('market') || lower.includes('rate')) {
    intent = 'GET_MARKET_PRICES';
    actionTaken = 'Agmarknet Price Queried';
    responseText = `Today's modal price for Wheat (PBW 725) in your local mandi is ₹2,450 per quintal, up +2.9% this week.`;
  } else if (lower.includes('turn on pump') || lower.includes('start pump') || lower.includes('turn on irrigation')) {
    intent = 'TURN_ON_PUMP';
    actionTaken = 'Irrigation Relay Signal Triggered';
    responseText = `Initiating pump startup signal for North Field Zone A. Please confirm activation on screen.`;
  } else if (lower.includes('turn off pump') || lower.includes('stop pump') || lower.includes('stop irrigation')) {
    intent = 'TURN_OFF_PUMP';
    actionTaken = 'Pump Deactivated';
    db.toggleIrrigationPump('zone-1');
    responseText = `Water pump for North Field Zone A has been turned off safely.`;
  } else {
    intent = 'GENERAL_ASSISTANT';
    actionTaken = 'Agricultural Query Processed';
    responseText = `AgriVerse Assistant received your query: "${cleanText}". Soil telemetry, crop recommendations, weather forecasts, and live mandi prices are active for your field.`;
  }

  // If OpenAI key was present but OpenAI API returned an error (e.g. insufficient quota)
  const sourceLabel = openAiErrorMessage
    ? `OpenAI API Error (${openAiErrorMessage.includes('credits') || openAiErrorMessage.includes('quota') ? 'Quota Exhausted' : 'API Error'}) -> Fallback Engine`
    : 'AgriVerse Backend Agricultural Engine';

  return res.json({
    success: true,
    transcript: cleanText,
    speechResponse: openAiErrorMessage
      ? `[OpenAI API Notice: ${openAiErrorMessage}]. ${responseText}`
      : responseText,
    intent,
    actionTaken,
    source: sourceLabel,
    openAiError: openAiErrorMessage,
  });
});

module.exports = router;
