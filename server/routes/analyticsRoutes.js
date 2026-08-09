const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/v1/analytics/report
router.get('/report', (req, res) => {
  try {
    const { season = 'Rabi 2026' } = req.query;
    const farmer = db.getFarmerProfile() || {};
    const zones = db.getIrrigationZones();
    const recommendations = db.getRecommendationHistory();

    const acres = farmer.farmSizeAcres || 12.5;
    const baseRevPerAcre = season.includes('Rabi') ? 86400 : 78400;
    const totalRevenue = Math.round(acres * baseRevPerAcre);
    const totalCost = Math.round(totalRevenue * 0.3);
    const netProfit = totalRevenue - totalCost;
    const profitMarginPercent = parseFloat(((netProfit / totalRevenue) * 100).toFixed(1));

    return res.json({
      success: true,
      report: {
        season,
        farmSizeAcres: acres,
        totalRevenue,
        totalCost,
        netProfit,
        profitMarginPercent,
        carbonOffsetTons: parseFloat((acres * 1.15).toFixed(1)),
        waterSavedGallons: Math.round(zones.length * 115000),
        totalRecommendationsRun: recommendations.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
