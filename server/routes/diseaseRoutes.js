const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db/database');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'crop_' + Date.now() + path.extname(file.originalname || '.jpg'));
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/v1/disease/inspect
router.post('/inspect', upload.single('photo'), (req, res) => {
  try {
    const file = req.file;
    const bodyUri = req.body ? req.body.imageUri : null;
    const notes = req.body ? req.body.notes : '';

    if (!file && !bodyUri) {
      return res.status(400).json({
        success: false,
        error: 'No image file or photo URI provided in request payload.',
      });
    }

    const inspectionRecord = {
      imagePath: file ? file.filename : bodyUri,
      fileSize: file ? file.size : 0,
      notes: notes || 'Crop foliage visual inspection',
      receivedAt: new Date().toISOString(),
      status: 'Ingested & Logged',
    };

    // Log inspection in database
    db.saveDiseaseInspection(inspectionRecord);

    return res.json({
      success: true,
      isMlModelConnected: false,
      status: 'Photo Received & Ingested',
      inspectionId: 'diag-' + Date.now(),
      message: 'Crop image successfully received by backend inspection pipeline.',
      technicalDetails: {
        receivedBytes: file ? file.size : 'URI reference received',
        fileName: file ? file.filename : 'base64/uri photo',
        pipelineStatus: 'Ready for Vision ML Inference Endpoint (TensorFlow/PyTorch/PlantNet)',
      },
      disclaimer: 'No synthetic or fabricated diagnosis was generated. Real ML vision model integration is required to produce live automated classifications.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/disease/history
router.get('/history', (req, res) => {
  try {
    const inspections = db.getDiseaseInspections();
    return res.json({ success: true, inspections });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
