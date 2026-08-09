const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/v1/irrigation/zones
router.get('/zones', (req, res) => {
  try {
    const zones = db.getIrrigationZones();
    return res.json({ success: true, zones });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/irrigation/toggle
router.post('/toggle', (req, res) => {
  try {
    const { zoneId } = req.body;
    if (!zoneId) {
      return res.status(400).json({ success: false, error: 'zoneId parameter is required' });
    }
    const updatedZone = db.toggleIrrigationPump(zoneId);
    return res.json({ success: true, zone: updatedZone });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/irrigation/threshold
router.post('/threshold', (req, res) => {
  try {
    const { zoneId, targetMoisture } = req.body;
    if (!zoneId || targetMoisture === undefined) {
      return res.status(400).json({ success: false, error: 'zoneId and targetMoisture parameters are required' });
    }
    const updatedZone = db.updateMoistureThreshold(zoneId, parseFloat(targetMoisture));
    return res.json({ success: true, zone: updatedZone });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/soil/readings
router.get('/soil/readings', (req, res) => {
  try {
    const readings = db.getSoilReadings();
    return res.json({ success: true, readings });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/soil/readings
router.post('/soil/readings', (req, res) => {
  try {
    const newReading = db.saveSoilReading(req.body);
    return res.json({ success: true, reading: newReading });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
