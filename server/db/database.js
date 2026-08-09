const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/agriverse_db.json');

const INITIAL_DATA = {
  farmers: [
    {
      id: 'farmer-default',
      name: 'Ramesh Patel',
      location: 'Karnal Sector 4',
      state: 'Haryana',
      district: 'Karnal',
      farmSizeAcres: 12.5,
      soilTypes: ['Alluvial Loam', 'Clay Loam'],
      primaryCrops: ['Wheat', 'Basmati Rice', 'Mustard'],
      memberSince: '2026',
      phone: '+91 98765 43210',
      email: 'ramesh.farmer@agriverse.io',
      updatedAt: new Date().toISOString(),
    },
  ],
  soil_readings: [
    {
      id: 'soil-1',
      sector: 'North Sector A',
      nitrogen: 95,
      phosphorus: 48,
      potassium: 42,
      ph: 6.8,
      moisturePercent: 42,
      soilType: 'Alluvial Loam',
      lastTested: new Date().toISOString(),
    },
    {
      id: 'soil-2',
      sector: 'East Sector B',
      nitrogen: 110,
      phosphorus: 55,
      potassium: 50,
      ph: 7.1,
      moisturePercent: 68,
      soilType: 'Clay Loam',
      lastTested: new Date().toISOString(),
    },
  ],
  recommendations: [],
  disease_inspections: [],
  irrigation_zones: [
    {
      id: 'zone-1',
      name: 'North Sector A (Wheat)',
      crop: 'Wheat PBW 725',
      soilMoisture: 42,
      status: 'Active',
      lastWatered: '2 hours ago',
      nextScheduled: 'Today, 6:00 PM',
      targetMoisture: 65,
      isPumpOn: true,
    },
    {
      id: 'zone-2',
      name: 'East Sector B (Maize)',
      crop: 'Hybrid Maize',
      soilMoisture: 68,
      status: 'Auto',
      lastWatered: 'Yesterday, 8:00 AM',
      nextScheduled: 'Tomorrow, 7:00 AM',
      targetMoisture: 60,
      isPumpOn: false,
    },
    {
      id: 'zone-3',
      name: 'Polyhouse 1 (Tomato)',
      crop: 'Cherry Tomato',
      soilMoisture: 55,
      status: 'Auto',
      lastWatered: '4 hours ago',
      nextScheduled: 'Today, 4:30 PM',
      targetMoisture: 70,
      isPumpOn: false,
    },
  ],
};

class Database {
  constructor() {
    this.dataDir = path.dirname(DB_FILE);
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
      }
    } catch (e) {
      console.error('Database initialization error:', e);
    }
  }

  read() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.init();
      }
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to read database file:', e);
      return INITIAL_DATA;
    }
  }

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  // Farmer operations
  getFarmerProfile() {
    const db = this.read();
    return db.farmers && db.farmers.length > 0 ? db.farmers[0] : null;
  }

  saveFarmerProfile(profile) {
    const db = this.read();
    const existing = db.farmers[0] || {};
    const updated = {
      ...existing,
      ...profile,
      id: existing.id || 'farmer-' + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    db.farmers = [updated];
    this.write(db);
    return updated;
  }

  // Soil Telemetry
  getSoilReadings() {
    const db = this.read();
    return db.soil_readings || [];
  }

  saveSoilReading(reading) {
    const db = this.read();
    const newEntry = {
      id: 'soil-' + Date.now(),
      ...reading,
      lastTested: new Date().toISOString(),
    };
    db.soil_readings.unshift(newEntry);
    this.write(db);
    return newEntry;
  }

  // Irrigation Zones
  getIrrigationZones() {
    const db = this.read();
    return db.irrigation_zones || [];
  }

  toggleIrrigationPump(zoneId) {
    const db = this.read();
    db.irrigation_zones = db.irrigation_zones.map((zone) => {
      if (zone.id === zoneId) {
        const nextPumpState = !zone.isPumpOn;
        return {
          ...zone,
          isPumpOn: nextPumpState,
          status: nextPumpState ? 'Active' : 'Idle',
          lastWatered: nextPumpState ? 'Just now' : zone.lastWatered,
          soilMoisture: nextPumpState
            ? Math.min(100, zone.soilMoisture + 15)
            : zone.soilMoisture,
        };
      }
      return zone;
    });
    this.write(db);
    return db.irrigation_zones.find((z) => z.id === zoneId);
  }

  updateMoistureThreshold(zoneId, target) {
    const db = this.read();
    db.irrigation_zones = db.irrigation_zones.map((zone) => {
      if (zone.id === zoneId) {
        return { ...zone, targetMoisture: target };
      }
      return zone;
    });
    this.write(db);
    return db.irrigation_zones.find((z) => z.id === zoneId);
  }

  // Crop Recommendation log
  saveRecommendation(inputParams, recommendations) {
    const db = this.read();
    const entry = {
      id: 'rec-' + Date.now(),
      timestamp: new Date().toISOString(),
      inputs: inputParams,
      topRecommendation: recommendations[0] ? recommendations[0].name : 'None',
      resultsCount: recommendations.length,
    };
    db.recommendations.unshift(entry);
    this.write(db);
    return entry;
  }

  getRecommendationHistory() {
    const db = this.read();
    return db.recommendations || [];
  }

  // Disease Inspection log
  saveDiseaseInspection(inspectionData) {
    const db = this.read();
    const entry = {
      id: 'diag-' + Date.now(),
      timestamp: new Date().toISOString(),
      ...inspectionData,
    };
    db.disease_inspections.unshift(entry);
    this.write(db);
    return entry;
  }

  getDiseaseInspections() {
    const db = this.read();
    return db.disease_inspections || [];
  }
}

module.exports = new Database();
