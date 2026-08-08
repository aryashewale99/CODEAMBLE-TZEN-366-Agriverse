import { RecommendedCrop } from '../types/agri';

export interface CropInputParams {
  state?: string;
  district?: string;
  soilType: string;
  season?: string;
  waterAvailability?: string; // 'High' | 'Medium' | 'Low'
  farmSize?: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
  temperature: string;
  humidity?: string;
  rainfall: string;
}

interface CropProfile {
  id: string;
  name: string;
  season: string;
  growthDuration: string;
  waterReq: string;
  idealPh: string;
  expectedYield: string;
  description: string;
  supportedSoils: string[];
  minTemp: number;
  maxTemp: number;
  minRainfall: number;
  maxRainfall: number;
  waterNeedLevel: 'High' | 'Medium' | 'Low';
  minPh: number;
  maxPh: number;
  minN: number;
  maxN: number;
  minP: number;
  maxP: number;
  minK: number;
  maxK: number;
  preferredSeasons: string[];
}

const CROP_PROFILES: CropProfile[] = [
  {
    id: 'crop_wheat',
    name: 'Wheat (PBW 725 / Sharbati)',
    season: 'Rabi (Nov - Apr)',
    growthDuration: '120 - 135 days',
    waterReq: 'Moderate (350-600mm)',
    idealPh: '6.0 - 7.5',
    expectedYield: '22 - 25 Quintals/Acre',
    description: 'High-yielding staple cereal with strong resistance to leaf rust. Thrives in cool Rabi climates with well-drained loam or alluvial soil.',
    supportedSoils: ['Loam', 'Alluvial', 'Silt', 'Clay'],
    minTemp: 12,
    maxTemp: 30,
    minRainfall: 300,
    maxRainfall: 750,
    waterNeedLevel: 'Medium',
    minPh: 6.0,
    maxPh: 7.5,
    minN: 70,
    maxN: 150,
    minP: 35,
    maxP: 75,
    minK: 30,
    maxK: 65,
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
    description: 'Premium aromatic long-grain paddy rice requiring standing water or high irrigation with clay-loam or alluvial soil during monsoon.',
    supportedSoils: ['Clay', 'Loam', 'Black', 'Alluvial', 'Silt'],
    minTemp: 20,
    maxTemp: 38,
    minRainfall: 750,
    maxRainfall: 1800,
    waterNeedLevel: 'High',
    minPh: 5.5,
    maxPh: 7.0,
    minN: 90,
    maxN: 170,
    minP: 35,
    maxP: 85,
    minK: 35,
    maxK: 85,
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
    description: 'Quality protein maize with high starch yield, adaptable to diverse soils with moderate moisture and nitrogen sufficiency.',
    supportedSoils: ['Loam', 'Sandy', 'Alluvial', 'Red', 'Clay'],
    minTemp: 18,
    maxTemp: 36,
    minRainfall: 400,
    maxRainfall: 950,
    waterNeedLevel: 'Medium',
    minPh: 5.8,
    maxPh: 7.2,
    minN: 80,
    maxN: 160,
    minP: 35,
    maxP: 75,
    minK: 35,
    maxK: 75,
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
    description: 'Drought-tolerant oilseed crop suited for lighter sandy-loam or alluvial soils in cool Rabi conditions with low water consumption.',
    supportedSoils: ['Sandy', 'Loam', 'Alluvial', 'Red'],
    minTemp: 10,
    maxTemp: 28,
    minRainfall: 200,
    maxRainfall: 500,
    waterNeedLevel: 'Low',
    minPh: 6.0,
    maxPh: 7.8,
    minN: 50,
    maxN: 110,
    minP: 25,
    maxP: 65,
    minK: 20,
    maxK: 55,
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
    description: 'High-value fiber cash crop thriving in deep Black Regur or Alluvial soils with warm sunshine and moderate moisture.',
    supportedSoils: ['Black', 'Alluvial', 'Clay', 'Loam'],
    minTemp: 20,
    maxTemp: 38,
    minRainfall: 450,
    maxRainfall: 1100,
    waterNeedLevel: 'Medium',
    minPh: 6.0,
    maxPh: 8.0,
    minN: 80,
    maxN: 160,
    minP: 40,
    maxP: 80,
    minK: 40,
    maxK: 80,
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
    description: 'Nitrogen-fixing pulse crop requiring minimal residual moisture and performing excellently in neutral to slightly alkaline soils.',
    supportedSoils: ['Loam', 'Black', 'Sandy', 'Alluvial'],
    minTemp: 12,
    maxTemp: 32,
    minRainfall: 180,
    maxRainfall: 480,
    waterNeedLevel: 'Low',
    minPh: 6.0,
    maxPh: 8.0,
    minN: 15,
    maxN: 60,
    minP: 35,
    maxP: 75,
    minK: 25,
    maxK: 65,
    preferredSeasons: ['Rabi', 'Winter'],
  },
  {
    id: 'crop_groundnut',
    name: 'Groundnut (K6 / TG 37A)',
    season: 'Kharif / Zaid',
    growthDuration: '105 - 120 days',
    waterReq: 'Moderate (400-650mm)',
    idealPh: '5.8 - 7.5',
    expectedYield: '15 - 20 Quintals/Acre',
    description: 'Important oilseed requiring well-aerated sandy loam or red soils for optimal pod development and pegging.',
    supportedSoils: ['Sandy', 'Red', 'Loam'],
    minTemp: 20,
    maxTemp: 36,
    minRainfall: 350,
    maxRainfall: 750,
    waterNeedLevel: 'Medium',
    minPh: 5.8,
    maxPh: 7.5,
    minN: 15,
    maxN: 50,
    minP: 35,
    maxP: 65,
    minK: 35,
    maxK: 75,
    preferredSeasons: ['Kharif', 'Zaid', 'Summer', 'Monsoon'],
  },
  {
    id: 'crop_tomato',
    name: 'Tomato (Pusa Ruby)',
    season: 'All Seasons',
    growthDuration: '90 - 115 days',
    waterReq: 'Moderate (400-750mm)',
    idealPh: '6.0 - 7.0',
    expectedYield: '120 - 160 Quintals/Acre',
    description: 'High-value horticultural vegetable crop responsive to balanced NPK fertilisation, steady moisture, and fertile loamy soil.',
    supportedSoils: ['Loam', 'Alluvial', 'Red', 'Black'],
    minTemp: 16,
    maxTemp: 34,
    minRainfall: 350,
    maxRainfall: 850,
    waterNeedLevel: 'Medium',
    minPh: 6.0,
    maxPh: 7.0,
    minN: 90,
    maxN: 170,
    minP: 50,
    maxP: 110,
    minK: 50,
    maxK: 130,
    preferredSeasons: ['Kharif', 'Rabi', 'Zaid', 'All'],
  },
  {
    id: 'crop_sugarcane',
    name: 'Sugarcane (Co 0238)',
    season: 'Annual / Kharif',
    growthDuration: '300 - 360 days',
    waterReq: 'Very High (1200-2000mm)',
    idealPh: '6.5 - 7.5',
    expectedYield: '350 - 450 Quintals/Acre',
    description: 'Heavy feeder commercial cash crop demanding high nitrogen, continuous water supply, and heavy fertile alluvial or clay soil.',
    supportedSoils: ['Alluvial', 'Clay', 'Black', 'Loam'],
    minTemp: 18,
    maxTemp: 40,
    minRainfall: 950,
    maxRainfall: 2200,
    waterNeedLevel: 'High',
    minPh: 6.5,
    maxPh: 7.5,
    minN: 130,
    maxN: 260,
    minP: 50,
    maxP: 100,
    minK: 70,
    maxK: 160,
    preferredSeasons: ['Kharif', 'Annual', 'Monsoon'],
  },
  {
    id: 'crop_moong',
    name: 'Moong Dal / Green Gram',
    season: 'Zaid / Kharif',
    growthDuration: '60 - 75 days',
    waterReq: 'Low (250-500mm)',
    idealPh: '6.2 - 7.5',
    expectedYield: '6 - 9 Quintals/Acre',
    description: 'Short-duration catch pulse crop ideal for summer crop rotation with minimal irrigation and low nitrogen fertilizer requirement.',
    supportedSoils: ['Loam', 'Sandy', 'Alluvial', 'Red'],
    minTemp: 22,
    maxTemp: 40,
    minRainfall: 200,
    maxRainfall: 550,
    waterNeedLevel: 'Low',
    minPh: 6.2,
    maxPh: 7.5,
    minN: 10,
    maxN: 40,
    minP: 30,
    maxP: 65,
    minK: 15,
    maxK: 45,
    preferredSeasons: ['Zaid', 'Summer', 'Kharif'],
  },
];

export function calculateCropRecommendations(inputs: CropInputParams): RecommendedCrop[] {
  const tempVal = parseFloat(inputs.temperature) || 26;
  const rainVal = parseFloat(inputs.rainfall) || 500;
  const phVal = parseFloat(inputs.ph) || 6.5;
  const nVal = parseFloat(inputs.nitrogen) || 90;
  const pVal = parseFloat(inputs.phosphorus) || 45;
  const kVal = parseFloat(inputs.potassium) || 45;

  const userSoil = inputs.soilType || 'Loam';
  const userSeason = inputs.season || 'Kharif';
  const userWater = inputs.waterAvailability || 'Medium';

  const scoredCrops = CROP_PROFILES.map((crop) => {
    let score = 100;
    const reasons: string[] = [];
    let soilScore = 25;
    let climateScore = 25;
    let npkScore = 25;
    let waterScore = 25;

    // 1. Soil Type Check (Max 25 pts)
    const isSoilMatch = crop.supportedSoils.some((s) =>
      userSoil.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(userSoil.toLowerCase())
    );

    if (isSoilMatch) {
      reasons.push(`Soil Type: ${userSoil} matches crop root development suitability.`);
    } else {
      soilScore -= 12;
      score -= 12;
      reasons.push(`Soil Notice: ${userSoil} is non-ideal for ${crop.name} (Prefers: ${crop.supportedSoils.join(', ')}).`);
    }

    // 2. Climate & Season Check (Max 25 pts)
    if (tempVal >= crop.minTemp && tempVal <= crop.maxTemp) {
      reasons.push(`Temperature: ${tempVal}°C is in the optimal growth range (${crop.minTemp}°C - ${crop.maxTemp}°C).`);
    } else {
      const penalty = Math.min(18, Math.abs(tempVal - (tempVal < crop.minTemp ? crop.minTemp : crop.maxTemp)) * 2);
      climateScore -= penalty;
      score -= penalty;
      if (tempVal > crop.maxTemp) {
        reasons.push(`Heat Stress Warning: Field temp ${tempVal}°C exceeds crop max tolerance (${crop.maxTemp}°C).`);
      } else {
        reasons.push(`Cold Stress Warning: Field temp ${tempVal}°C is below crop min threshold (${crop.minTemp}°C).`);
      }
    }

    // Season match
    if (userSeason && userSeason !== 'All') {
      const isSeasonMatch = crop.preferredSeasons.some((s) =>
        s.toLowerCase().includes(userSeason.toLowerCase()) || userSeason.toLowerCase().includes(s.toLowerCase())
      );
      if (isSeasonMatch) {
        reasons.push(`Season Alignment: ${userSeason} season matches ideal sowing cycle.`);
      } else {
        climateScore -= 8;
        score -= 8;
        reasons.push(`Season Caution: Sowing in ${userSeason} is outside primary ${crop.season} cycle.`);
      }
    }

    // 3. Water & Rainfall Check (Max 25 pts)
    if (rainVal >= crop.minRainfall && rainVal <= crop.maxRainfall) {
      reasons.push(`Rainfall: Field rainfall (${rainVal}mm) satisfies water budget (${crop.minRainfall}-${crop.maxRainfall}mm).`);
    } else if (rainVal < crop.minRainfall) {
      const isIrrigated = userWater === 'High' || userWater === 'Medium';
      if (isIrrigated && crop.waterNeedLevel !== 'High') {
        waterScore -= 6;
        score -= 6;
        reasons.push(`Water Supply: Low rainfall (${rainVal}mm) compensated by irrigation capability.`);
      } else {
        const penalty = Math.min(20, Math.round(((crop.minRainfall - rainVal) / crop.minRainfall) * 20));
        waterScore -= penalty;
        score -= penalty;
        reasons.push(`Water Deficit Warning: Field rainfall (${rainVal}mm) is low for ${crop.name} (Requires ${crop.minRainfall}mm+).`);
      }
    } else {
      waterScore -= 8;
      score -= 8;
      reasons.push(`Excess Water Caution: High rainfall (${rainVal}mm) may risk waterlogging for this crop.`);
    }

    // 4. Soil pH & NPK Check (Max 25 pts)
    if (phVal >= crop.minPh && phVal <= crop.maxPh) {
      reasons.push(`Soil pH: Current pH ${phVal} is optimal for nutrient uptake (${crop.idealPh}).`);
    } else {
      const penalty = Math.min(10, Math.round(Math.abs(phVal - (phVal < crop.minPh ? crop.minPh : crop.maxPh)) * 6));
      npkScore -= penalty;
      score -= penalty;
      reasons.push(`pH Imbalance: Soil pH ${phVal} is outside optimal band (${crop.idealPh}).`);
    }

    // NPK sufficiency
    let npkPenalty = 0;
    if (nVal < crop.minN) npkPenalty += 4;
    if (pVal < crop.minP) npkPenalty += 4;
    if (kVal < crop.minK) npkPenalty += 4;

    if (npkPenalty === 0) {
      reasons.push(`NPK Telemetry: Nitrogen (${nVal}), Phosphorus (${pVal}), Potassium (${kVal}) satisfy crop needs.`);
    } else {
      npkScore -= npkPenalty;
      score -= npkPenalty;
      reasons.push(`Nutrient Adjustment: Current NPK (${nVal}:${pVal}:${kVal}) requires targeted top-dressing for maximum yield.`);
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
  });

  // Sort descending by match score
  return scoredCrops.sort((a, b) => b.matchScore - a.matchScore);
}
