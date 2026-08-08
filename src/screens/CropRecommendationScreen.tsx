import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { Colors, Typography, Spacing } from '../theme/colors';
import { RecommendedCrop } from '../types/agri';
import { useAuth } from '../hooks/useAuth';
import {
  calculateCropRecommendations,
  CropInputParams,
} from '../services/cropRecommendationEngine';

const SOIL_TYPES = ['Loam', 'Clay', 'Black', 'Sandy', 'Red', 'Alluvial', 'Silt'];
const SEASONS = ['Kharif', 'Rabi', 'Zaid', 'All'];
const WATER_LEVELS = ['High', 'Medium', 'Low'];

export const CropRecommendationScreen = ({ navigation, route }: any) => {
  const { user } = useAuth();
  const routeParams = route?.params || {};

  // Form State initialized from route params or user profile or sensibledefaults
  const [soilType, setSoilType] = useState<string>(routeParams.soilType || 'Loam');
  const [season, setSeason] = useState<string>(routeParams.season || 'Kharif');
  const [waterAvailability, setWaterAvailability] = useState<string>(
    routeParams.waterAvailability || 'Medium'
  );
  const [farmSize, setFarmSize] = useState<string>(
    routeParams.farmSize || (user?.farmSizeAcres ? String(user.farmSizeAcres) : '12.5')
  );
  const [temperature, setTemperature] = useState<string>(
    routeParams.temperature || routeParams.temp || '26'
  );
  const [humidity, setHumidity] = useState<string>(routeParams.humidity || '62');
  const [rainfall, setRainfall] = useState<string>(routeParams.rainfall || '450');
  const [phLevel, setPhLevel] = useState<string>(
    routeParams.ph || routeParams.soilPh || '6.5'
  );
  const [n, setN] = useState<string>(
    routeParams.n || routeParams.nitrogen || '90'
  );
  const [p, setP] = useState<string>(
    routeParams.p || routeParams.phosphorus || '42'
  );
  const [k, setK] = useState<string>(
    routeParams.k || routeParams.potassium || '43'
  );
  const [stateName, setStateName] = useState<string>(
    routeParams.state || user?.state || ''
  );
  const [districtName, setDistrictName] = useState<string>(
    routeParams.district || user?.district || ''
  );

  const [recommendations, setRecommendations] = useState<RecommendedCrop[] | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-run initial recommendation
  useEffect(() => {
    runRecommendation({
      soilType,
      season,
      waterAvailability,
      farmSize,
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      ph: phLevel,
      temperature,
      humidity,
      rainfall,
      state: stateName,
      district: districtName,
    });
  }, []);

  const runRecommendation = (inputs: CropInputParams) => {
    const results = calculateCropRecommendations(inputs);
    setRecommendations(results);
  };

  const handleRecommend = () => {
    setValidationError(null);

    // Validation
    if (!soilType.trim() || !temperature.trim() || !rainfall.trim() || !phLevel.trim() || !n.trim() || !p.trim() || !k.trim()) {
      const msg = 'Please fill in all mandatory soil & weather telemetry parameters.';
      setValidationError(msg);
      Alert.alert('Incomplete Form', msg);
      return;
    }

    const tempNum = parseFloat(temperature);
    const rainNum = parseFloat(rainfall);
    const phNum = parseFloat(phLevel);
    const nNum = parseFloat(n);
    const pNum = parseFloat(p);
    const kNum = parseFloat(k);

    if (isNaN(tempNum) || tempNum < -20 || tempNum > 60) {
      const msg = 'Please enter a valid temperature (-20°C to 60°C).';
      setValidationError(msg);
      Alert.alert('Invalid Input', msg);
      return;
    }

    if (isNaN(rainNum) || rainNum < 0 || rainNum > 3000) {
      const msg = 'Please enter a valid rainfall value (0 to 3000 mm).';
      setValidationError(msg);
      Alert.alert('Invalid Input', msg);
      return;
    }

    if (isNaN(phNum) || phNum < 0 || phNum > 14) {
      const msg = 'Please enter a valid soil pH level (0 to 14).';
      setValidationError(msg);
      Alert.alert('Invalid Input', msg);
      return;
    }

    if (isNaN(nNum) || isNaN(pNum) || isNaN(kNum) || nNum < 0 || pNum < 0 || kNum < 0) {
      const msg = 'Please enter valid N-P-K nutrient values (0 or higher).';
      setValidationError(msg);
      Alert.alert('Invalid Input', msg);
      return;
    }

    // Execute dynamic rule-based recommendation
    const currentParams: CropInputParams = {
      soilType: soilType.trim(),
      season,
      waterAvailability,
      farmSize: farmSize.trim(),
      nitrogen: n.trim(),
      phosphorus: p.trim(),
      potassium: k.trim(),
      ph: phLevel.trim(),
      temperature: temperature.trim(),
      humidity: humidity.trim(),
      rainfall: rainfall.trim(),
      state: stateName.trim(),
      district: districtName.trim(),
    };

    runRecommendation(currentParams);
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title="Crop Recommendation Engine"
        subtitle="Dynamic Soil & Climate Match"
        showBack={navigation.canGoBack()}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Farm & Soil Telemetry</Text>
          {user ? (
            <Text style={styles.userInfoBadge}>
              📍 {user.district}, {user.state}
            </Text>
          ) : null}
        </View>
        <Text style={styles.sectionSubtitle}>
          Adjust parameters below to see dynamic crop match recalculations
        </Text>

        {validationError && (
          <View style={styles.errorAlert}>
            <Text style={styles.errorAlertText}>⚠️ {validationError}</Text>
          </View>
        )}

        <View style={styles.formCard}>
          {/* 1. Soil Type Selector */}
          <Text style={styles.inputLabel}>Soil Type</Text>
          <View style={styles.chipRow}>
            {SOIL_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  soilType.toLowerCase().includes(type.toLowerCase()) && styles.chipActive,
                ]}
                onPress={() => setSoilType(type)}>
                <Text
                  style={[
                    styles.chipText,
                    soilType.toLowerCase().includes(type.toLowerCase()) && styles.chipTextActive,
                  ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 2. Season & Water Need Selectors */}
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Farming Season</Text>
              <View style={styles.chipRowMini}>
                {SEASONS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chipMini, season === s && styles.chipActive]}
                    onPress={() => setSeason(s)}>
                    <Text
                      style={[styles.chipTextMini, season === s && styles.chipTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Water Supply</Text>
              <View style={styles.chipRowMini}>
                {WATER_LEVELS.map((w) => (
                  <TouchableOpacity
                    key={w}
                    style={[
                      styles.chipMini,
                      waterAvailability === w && styles.chipActive,
                    ]}
                    onPress={() => setWaterAvailability(w)}>
                    <Text
                      style={[
                        styles.chipTextMini,
                        waterAvailability === w && styles.chipTextActive,
                      ]}>
                      {w}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* 3. Climate Telemetry */}
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Temperature (°C)</Text>
              <TextInput
                style={styles.input}
                value={temperature}
                onChangeText={setTemperature}
                keyboardType="numeric"
                placeholder="26"
              />
            </View>

            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Rainfall (mm)</Text>
              <TextInput
                style={styles.input}
                value={rainfall}
                onChangeText={setRainfall}
                keyboardType="numeric"
                placeholder="450"
              />
            </View>
          </View>

          {/* 4. Soil pH & Farm Size */}
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Soil pH Level</Text>
              <TextInput
                style={styles.input}
                value={phLevel}
                onChangeText={setPhLevel}
                keyboardType="numeric"
                placeholder="6.5"
              />
            </View>

            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Farm Size (Acres)</Text>
              <TextInput
                style={styles.input}
                value={farmSize}
                onChangeText={setFarmSize}
                keyboardType="numeric"
                placeholder="12.5"
              />
            </View>
          </View>

          {/* 5. N-P-K Nutrients (kg/ha) */}
          <View style={styles.fullWidthInput}>
            <Text style={styles.inputLabel}>N-P-K Ratio (kg/ha)</Text>
            <View style={styles.npkRow}>
              <View style={styles.npkCol}>
                <Text style={styles.npkSubLabel}>N (Nitrogen)</Text>
                <TextInput
                  style={styles.input}
                  value={n}
                  onChangeText={setN}
                  keyboardType="numeric"
                  placeholder="90"
                />
              </View>
              <View style={styles.npkCol}>
                <Text style={styles.npkSubLabel}>P (Phosphorus)</Text>
                <TextInput
                  style={styles.input}
                  value={p}
                  onChangeText={setP}
                  keyboardType="numeric"
                  placeholder="42"
                />
              </View>
              <View style={styles.npkCol}>
                <Text style={styles.npkSubLabel}>K (Potassium)</Text>
                <TextInput
                  style={styles.input}
                  value={k}
                  onChangeText={setK}
                  keyboardType="numeric"
                  placeholder="43"
                />
              </View>
            </View>
          </View>

          {/* Location details */}
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>State</Text>
              <TextInput
                style={styles.input}
                value={stateName}
                onChangeText={setStateName}
                placeholder="Enter state"
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>District</Text>
              <TextInput
                style={styles.input}
                value={districtName}
                onChangeText={setDistrictName}
                placeholder="Enter district"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            activeOpacity={0.85}
            onPress={handleRecommend}>
            <Text style={styles.submitBtnText}>🌾 Recommend Best Crops</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Recommendations List */}
        {recommendations && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>
              Dynamic AI Crop Recommendations ({recommendations.length} Evaluated)
            </Text>
            <Text style={styles.resultsSubText}>
              Ranked dynamically based on current soil pH ({phLevel}), Temp ({temperature}°C), Rain ({rainfall}mm), NPK ({n}:{p}:{k}) and Soil ({soilType})
            </Text>

            {recommendations.map((crop) => (
              <View key={crop.id} style={styles.cropCard}>
                <View style={styles.cropCardHeader}>
                  <View style={styles.cropNameBox}>
                    <Text style={styles.cropName}>{crop.name}</Text>
                    <Text style={styles.cropSeason}>Season: {crop.season}</Text>
                  </View>
                  <Badge
                    label={`${crop.matchScore}% Match`}
                    variant={crop.matchScore >= 80 ? 'success' : crop.matchScore >= 60 ? 'warning' : 'danger'}
                  />
                </View>

                <Text style={styles.cropDesc}>{crop.description}</Text>

                {/* Score Breakdown Pills */}
                {crop.scoreBreakdown ? (
                  <View style={styles.breakdownRow}>
                    <View style={styles.breakdownPill}>
                      <Text style={styles.breakdownPillText}>🌱 Soil: {crop.scoreBreakdown.soilMatch}/25</Text>
                    </View>
                    <View style={styles.breakdownPill}>
                      <Text style={styles.breakdownPillText}>🌤️ Climate: {crop.scoreBreakdown.climateMatch}/25</Text>
                    </View>
                    <View style={styles.breakdownPill}>
                      <Text style={styles.breakdownPillText}>🧪 NPK: {crop.scoreBreakdown.npkMatch}/25</Text>
                    </View>
                    <View style={styles.breakdownPill}>
                      <Text style={styles.breakdownPillText}>💧 Water: {crop.scoreBreakdown.waterMatch}/25</Text>
                    </View>
                  </View>
                ) : null}

                {/* Match Reasons / Parameter Feedback */}
                {crop.matchReasons && crop.matchReasons.length > 0 ? (
                  <View style={styles.reasonsBox}>
                    <Text style={styles.reasonsHeader}>💡 Recommendation Parameters & Feedback:</Text>
                    {crop.matchReasons.map((reason, idx) => (
                      <View key={idx} style={styles.reasonRow}>
                        <Text style={styles.reasonBullet}>•</Text>
                        <Text style={styles.reasonText}>{reason}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                <View style={styles.cropMetricsGrid}>
                  <View style={styles.cropMetricItem}>
                    <Text style={styles.cropMetricLabel}>Growth Period</Text>
                    <Text style={styles.cropMetricValue}>{crop.growthDuration}</Text>
                  </View>
                  <View style={styles.cropMetricItem}>
                    <Text style={styles.cropMetricLabel}>Water Need</Text>
                    <Text style={styles.cropMetricValue}>{crop.waterReq}</Text>
                  </View>
                  <View style={styles.cropMetricItem}>
                    <Text style={styles.cropMetricLabel}>Expected Yield</Text>
                    <Text style={styles.cropMetricValue}>{crop.expectedYield}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  userInfoBadge: {
    fontSize: Typography.captionSize,
    color: Colors.primaryLight,
    fontWeight: Typography.weightBold,
  },
  sectionSubtitle: {
    fontSize: Typography.captionSize + 1,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    marginTop: 2,
  },
  errorAlert: {
    backgroundColor: Colors.dangerLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  errorAlertText: {
    fontSize: Typography.captionSize + 1,
    color: Colors.danger,
    fontWeight: Typography.weightBold,
  },
  formCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputLabel: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.captionSize,
    color: Colors.textPrimary,
    fontWeight: Typography.weightMedium,
  },
  chipTextActive: {
    color: Colors.textLight,
    fontWeight: Typography.weightBold,
  },
  chipRowMini: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipMini: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    marginRight: 4,
    marginBottom: 4,
  },
  chipTextMini: {
    fontSize: Typography.captionSize - 1,
    color: Colors.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  inputHalf: {
    width: '48%',
  },
  fullWidthInput: {
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
  },
  npkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  npkCol: {
    width: '31%',
  },
  npkSubLabel: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  submitBtnText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize + 1,
    fontWeight: Typography.weightBold,
  },
  resultsContainer: {
    marginTop: Spacing.xs,
  },
  resultsSubText: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    marginTop: 2,
  },
  cropCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cropCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  cropNameBox: {
    flex: 1,
    marginRight: Spacing.xs,
  },
  cropName: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  cropSeason: {
    fontSize: Typography.captionSize,
    color: Colors.primaryLight,
    fontWeight: Typography.weightMedium,
  },
  cropDesc: {
    fontSize: Typography.bodySize,
    color: Colors.textSecondary,
    marginVertical: Spacing.xs,
    lineHeight: 18,
  },
  breakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: Spacing.xs,
  },
  breakdownPill: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  breakdownPillText: {
    fontSize: Typography.captionSize,
    color: Colors.primaryDark,
    fontWeight: Typography.weightMedium,
  },
  reasonsBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.sm,
    marginVertical: Spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  reasonsHeader: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  reasonBullet: {
    fontSize: 12,
    color: Colors.primary,
    marginRight: 6,
    marginTop: 1,
  },
  reasonText: {
    flex: 1,
    fontSize: Typography.captionSize + 1,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  cropMetricsGrid: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.xs,
  },
  cropMetricItem: {
    alignItems: 'center',
  },
  cropMetricLabel: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
  },
  cropMetricValue: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
});

export default CropRecommendationScreen;