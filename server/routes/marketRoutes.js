const express = require('express');
const router = express.Router();
const https = require('https');

const BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// Safe diagnostic check (NEVER print actual API key)
console.log("Data.gov API configured:", !!process.env.DATA_GOV_API_KEY);

/**
 * Helper to fetch government API using Node https module with IPv4 forcing.
 * Prevents Undici IPv6 connect timeout (UND_ERR_CONNECT_TIMEOUT).
 */
function fetchGovApi(url, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        family: 4, // Force IPv4 resolution to prevent data.gov.in IPv6 connect timeouts
        headers: {
          Accept: 'application/json',
          'User-Agent': 'AgriVerse-Agricultural-Telemetry/1.0',
        },
      },
      (res) => {
        let bodyText = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          bodyText += chunk;
        });
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: res.statusMessage || '',
            text: async () => bodyText,
            json: async () => JSON.parse(bodyText),
          });
        });
      }
    );

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error(`Government Mandi API request timed out after ${timeoutMs}ms`));
    });
  });
}

// GET /api/v1/market/prices
router.get('/prices', async (req, res) => {
  const { state, district, commodity, market, limit = 100, offset = 0 } = req.query;

  const apiKey = (process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd00000173ba5f753b8f4a9d7254e44f133d2230').trim();

  let queryUrl = `${BASE_URL}?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}`;

  if (state && state !== 'All') {
    queryUrl += `&filters[state]=${encodeURIComponent(state)}`;
  }
  if (district && district !== 'All') {
    queryUrl += `&filters[district]=${encodeURIComponent(district)}`;
  }
  if (commodity && commodity !== 'All') {
    queryUrl += `&filters[commodity]=${encodeURIComponent(commodity)}`;
  }
  if (market && market !== 'All') {
    queryUrl += `&filters[market]=${encodeURIComponent(market)}`;
  }

  // Safe debugging log WITHOUT API key
  const safeLogUrl = queryUrl.replace(/api-key=[^&]+/, 'api-key=***MASKED***');
  console.log(`🏛️ [Agmarknet API Request] Fetching: ${safeLogUrl}`);

  try {
    const apiRes = await fetchGovApi(queryUrl, 12000);

    console.log(`🏛️ [Agmarknet API Response Status] ${apiRes.status} ${apiRes.statusText}`);

    // Handle specific HTTP Status Codes
    if (!apiRes.ok) {
      const errText = await apiRes.text().catch(() => '');
      console.warn(`⚠️ [Agmarknet HTTP Error ${apiRes.status}]:`, errText.slice(0, 300));

      if (apiRes.status === 400) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request parameters sent to Government Mandi API.',
        });
      } else if (apiRes.status === 401 || apiRes.status === 403) {
        return res.status(403).json({
          success: false,
          error: 'Government Mandi API key authentication failed or key unauthorized.',
        });
      } else if (apiRes.status === 404) {
        return res.status(404).json({
          success: false,
          error: 'Government Mandi data resource endpoint not found.',
        });
      } else if (apiRes.status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Government Mandi API rate limit exceeded. Please try again shortly.',
        });
      } else {
        return res.status(502).json({
          success: false,
          error: `Government Mandi Data Portal (data.gov.in) temporarily unavailable (HTTP ${apiRes.status}).`,
        });
      }
    }

    const payload = await apiRes.json();

    if (payload.error) {
      console.warn('⚠️ [Agmarknet Payload Error]:', payload.error);
      return res.status(502).json({
        success: false,
        error: typeof payload.error === 'string' ? payload.error : 'Agmarknet API returned error payload.',
      });
    }

    const records = payload.records || [];

    return res.json({
      success: true,
      source: 'Government of India - Agmarknet / data.gov.in',
      total: payload.total || records.length,
      count: payload.count || records.length,
      records: records,
    });
  } catch (error) {
    console.error('❌ [Backend Mandi Market API Exception]:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Government Mandi Data Portal is temporarily unreachable: ' + error.message,
    });
  }
});

module.exports = router;

