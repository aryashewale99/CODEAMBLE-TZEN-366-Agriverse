const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/v1/auth/profile
router.get('/profile', (req, res) => {
  try {
    const profile = db.getFarmerProfile();
    return res.json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/auth/login
router.post('/login', (req, res) => {
  try {
    const { name, location, state, district, farmSizeAcres, phone, email } = req.body;
    if (!name || !name.trim() || !location || !location.trim() || !state || !state.trim() || !district || !district.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Mandatory fields missing: name, location, state, and district are required.',
      });
    }

    const savedProfile = db.saveFarmerProfile({
      name: name.trim(),
      location: location.trim(),
      state: state.trim(),
      district: district.trim(),
      farmSizeAcres: farmSizeAcres ? parseFloat(farmSizeAcres) : 12.5,
      phone: phone || '',
      email: email || '',
    });

    return res.json({
      success: true,
      user: savedProfile,
      token: 'agriverse_jwt_session_' + Date.now(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/v1/auth/profile
router.put('/profile', (req, res) => {
  try {
    const updated = db.saveFarmerProfile(req.body);
    return res.json({ success: true, profile: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
