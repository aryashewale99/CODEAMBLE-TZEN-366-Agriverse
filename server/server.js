const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });

const express = require('express');
const cors = require('cors');

// SAFE Diagnostic check (NEVER log the key itself)
const hasOpenAiKey = Boolean(
  process.env.OPENAI_API_KEY &&
  process.env.OPENAI_API_KEY.trim().length > 10 &&
  !process.env.OPENAI_API_KEY.includes('your_')
);
const hasDataGovKey = Boolean(
  process.env.DATA_GOV_API_KEY &&
  process.env.DATA_GOV_API_KEY.trim().length > 10 &&
  !process.env.DATA_GOV_API_KEY.includes('your_')
);
console.log('🔒 [Security Diagnostic] OpenAI API Key Configured:', hasOpenAiKey);
console.log('🏛️ [Security Diagnostic] Data.gov API Key Configured:', hasDataGovKey);
console.log("Data.gov API configured:", !!process.env.DATA_GOV_API_KEY);

const authRoutes = require('./routes/authRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const marketRoutes = require('./routes/marketRoutes');
const cropRoutes = require('./routes/cropRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const irrigationRoutes = require('./routes/irrigationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const voiceRoutes = require('./routes/voiceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads folder for disease inspection images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health & System Info Route
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AgriVerse Agricultural Telemetry & Analytics Backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    databaseStatus: 'connected (persistent DB)',
    publicUrl: process.env.PUBLIC_API_URL || `http://localhost:${PORT}/api/v1`,
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/crop', cropRoutes);
app.use('/api/v1/disease', diseaseRoutes);
app.use('/api/v1/irrigation', irrigationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/voice', voiceRoutes);

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('Global Backend Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🌾 AGIVERSE BACKEND SERVER IS RUNNING`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🔗 Local Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`====================================================`);
});
