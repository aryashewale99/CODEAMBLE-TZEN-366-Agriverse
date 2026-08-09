const express = require('express');
const router = express.Router();
const db = require('../db/database');

const CROP_PROFILES = [
  {
    id: 'crop_wheat',
    name: 'Wheat (PBW 725 / Sharbati)',
    season: 'Rabi (Nov - Apr)',
    growthDuration: '120 - 135 days',
    waterReq: 'Moderate (350-600mm)',
    idealPh: '6.0 - 7.5',
    expectedYield: '22 - 25 Quintals/Acre',
    description: 'High-yielding staple cereal with strong rust resistance. Thrives in cool Rabi climates with well-drained loam or alluvial soil.',
    supportedSoils: ['Loam', 'Alluvial', 'Silt', 'Clay'],
    minTemp: 12, maxTemp: 30, minRainfall: 300, maxRainfall: 750, waterNeedLevel: 'Medium',
    minPh: 6.0, maxPh: 7.5, minN: 70, maxN: 150, minP: 35, maxP: 75, minK: 30, maxK: 65,
    preferredSeasons: ['Rabi', 'Winter'],
  },
  {
    id: 'crop_basmati_rice',
    name: 'Basmati Rice (1121 Pusa)',
    season: 'Kharif (Jun - Nov)',
    growthDuration: '135 - 145 days',
    waterReq: 'High (800-1500mm)',
    idealPh: '5.5 - 7.0',
    expectedYield: '18 - 22 Quintals/Acre',
    description: 'Premium long-grain paddy rice requiring high moisture with clay-loam or alluvial soil during monsoon.',
    supportedSoils: ['Clay', 'Loam', 'Black', 'Alluvial', 'Silt'],
    minTemp: 20, maxTemp: 38, minRainfall: 750, maxRainfall: 1800, waterNeedLevel: 'High',
    minPh: 5.5, maxPh: 7.0, minN: 90, maxN: 170, minP: 35, maxP: 85, minK: 35, maxK: 85,
    preferredSeasons: ['Kharif', 'Monsoon'],
  },
  {
    id: 'crop_maize',
    name: 'Hybrid Maize (HQPM-1)',
    season: 'Kharif / Spring',
    growthDuration: '95 - 110 days',
    waterReq: 'Moderate (450-800mm)',
    idealPh: '5.8 - 7.2',
    expectedYield: '28 - 32 Quintals/Acre',
    description: 'Quality protein maize with high starch yield, adaptable to diverse soils with moderate moisture.',
    supportedSoils: ['Loam', 'Sandy', 'Alluvial', 'Red', 'Clay'],
    minTemp: 18, maxTemp: 36, minRainfall: 400, maxRainfall: 950, waterNeedLevel: 'Medium',
    minPh: 5.8, maxPh: 7.2, minN: 80, maxN: 160, minP: 35, maxP: 75, minK: 35, maxK: 75,
    preferredSeasons: ['Kharif', 'Zaid', 'Monsoon', 'Summer'],
  },
  {
    id: 'crop_mustard',
    name: 'Mustard (RH 749)',
    season: 'Rabi (Oct - Mar)',
    growthDuration: '130 - 140 days',
    waterReq: 'Low (250-450mm)',
    idealPh: '6.0 - 7.8',
    expectedYield: '8 - 12 Quintals/Acre',
    description: 'Drought-tolerant oilseed crop suited for lighter sandy-loam or alluvial soils in cool Rabi conditions.',
    supportedSoils: ['Sandy', 'Loam', 'Alluvial', 'Red'],
    minTemp: 10, maxTemp: 28, minRainfall: 200, maxRainfall: 500, waterNeedLevel: 'Low',
    minPh: 6.0, maxPh: 7.8, minN: 50, maxN: 110, minP: 25, maxP: 65, minK: 20, maxK: 55,
    preferredSeasons: ['Rabi', 'Winter'],
  },
  {
    id: 'crop_cotton',
    name: 'Cotton (BT Hybrids)',
    season: 'Kharif (May - Nov)',
    growthDuration: '150 - 180 days',
    waterReq: 'Moderate (500-900mm)',
    idealPh: '6.0 - 8.0',
    expectedYield: '12 - 16 Quintals/Acre',
    description: 'High-value fiber cash crop thriving in deep Black Regur or Alluvial soils with warm sunshine.',
    supportedSoils: ['Black', 'Alluvial', 'Clay', 'Loam'],
    minTemp: 20, maxTemp: 38, minRainfall: 450, maxRainfall: 1100, waterNeedLevel: 'Medium',
    minPh: 6.0, maxPh: 8.0, minN: 80, maxN: 160, minP: 40, maxP: 80, minK: 40, maxK: 80,
    preferredSeasons: ['Kharif', 'Monsoon'],
  },
  {
    id: 'crop_chickpea',
    name: 'Desi Chickpea (BG-3022)',
    season: 'Rabi (Oct - Mar)',
    growthDuration: '110 - 120 days',
    waterReq: 'Low (250-400mm)',
    idealPh: '6.0 - 8.0',
    expectedYield: '14 - 18 Quintals/Acre',
    description: 'Nitrogen-fixing pulse crop requiring minimal residual moisture and neutral to alkaline soils.',
    supportedSoils: ['Loam', 'Black', 'Sandy', 'Alluvial'],
    minTemp: 12, maxTemp: 32, minRainfall: 180, maxRainfall: 480, waterNeedLevel: 'Low',
    minPh: 6.0, maxPh: 8.0, minN: 15, maxN: 60, minP: 35, maxP: 75, minK: 25, maxK: 65,
    preferredSeasons: ['Rabi', 'Winter'],
  },
];

function calculateRecommendations(inputs) {
  const tempVal = parseFloat(inputs.temperature) || 26;
  const rainVal = parseFloat(inputs.rainfall) || 500;
  const phVal = parseFloat(inputs.ph) || 6.5;
  const nVal = parseFloat(inputs.nitrogen) || 90;
  const pVal = parseFloat(inputs.phosphorus) || 45;
  const kVal = parseFloat(inputs.potassium) || 45;
  const userSoil = inputs.soilType || 'Loam';
  const userSeason = inputs.season || 'Kharif';
  const userWater = inputs.waterAvailability || 'Medium';

  return CROP_PROFILES.map((crop) => {
    let score = 100;
    const reasons = [];
    let soilScore = 25;
    let climateScore = 25;
    let npkScore = 25;
    let waterScore = 25;

    // Soil
    const isSoilMatch = crop.supportedSoils.some((s) =>
      userSoil.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(userSoil.toLowerCase())
    );
    if (isSoilMatch) {
      reasons.push(`Soil suitability match for ${userSoil}.`);
    } else {
      soilScore -= 12; score -= 12;
      reasons.push(`Soil caution: ${userSoil} is non-ideal (Prefers ${crop.supportedSoils.join(', ')}).`);
    }

    // Climate
    if (tempVal >= crop.minTemp && tempVal <= crop.maxTemp) {
      reasons.push(`Temp ${tempVal}°C in optimal range (${crop.minTemp}°C - ${crop.maxTemp}°C).`);
    } else {
      const penalty = Math.min(18, Math.abs(tempVal - (tempVal < crop.minTemp ? crop.minTemp : crop.maxTemp)) * 2);
      climateScore -= penalty; score -= penalty;
      reasons.push(`Temperature stress penalty applied (${tempVal}°C).`);
    }

    // Water
    if (rainVal >= crop.minRainfall && rainVal <= crop.maxRainfall) {
      reasons.push(`Rainfall (${rainVal}mm) satisfies crop budget.`);
    } else if (rainVal < crop.minRainfall) {
      const isIrrigated = userWater === 'High' || userWater === 'Medium';
      if (!isIrrigated) {
        const penalty = Math.min(20, Math.round(((crop.minRainfall - rainVal) / crop.minRainfall) * 20));
        waterScore -= penalty; score -= penalty;
        reasons.push(`Water deficit caution (${rainVal}mm vs min ${crop.minRainfall}mm).`);
      }
    }

    // pH & NPK
    if (phVal >= crop.minPh && phVal <= crop.maxPh) {
      reasons.push(`Soil pH ${phVal} is in ideal uptake band (${crop.idealPh}).`);
    } else {
      const penalty = Math.min(10, Math.round(Math.abs(phVal - (phVal < crop.minPh ? crop.minPh : crop.maxPh)) * 6));
      npkScore -= penalty; score -= penalty;
      reasons.push(`pH imbalance notice (${phVal}).`);
    }

    const finalScore = Math.max(35, Math.min(99, Math.round(score)));

    return {
      id: crop.id,
      name: crop.name,
      matchScore: finalScore,
      season: crop.season,
      growthDuration: crop.growthDuration,
      waterReq: crop.waterReq,
      idealPh: crop.idealPh,
      expectedYield: crop.expectedYield,
      description: crop.description,
      matchReasons: reasons,
      scoreBreakdown: {
        soilMatch: Math.max(0, Math.min(25, soilScore)),
        climateMatch: Math.max(0, Math.min(25, climateScore)),
        npkMatch: Math.max(0, Math.min(25, npkScore)),
        waterMatch: Math.max(0, Math.min(25, waterScore)),
      },
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// POST /api/v1/crop/recommend
router.post('/recommend', (req, res) => {
  try {
    const inputs = req.body || {};
    const recommendations = calculateRecommendations(inputs);

    // Save query to persistent database
    db.saveRecommendation(inputs, recommendations);

    return res.json({
      success: true,
      engineType: 'Transparent Agronomic Rule Engine',
      isMlModelConnected: false,
      inputsReceived: inputs,
      recommendations,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/crop/history
router.get('/history', (req, res) => {
  try {
    const history = db.getRecommendationHistory();
    return res.json({ success: true, history });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
