import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { Input } from '../components/Input';
import { Colors, Typography, Spacing } from '../theme/colors';

const SOIL_TYPES = [
  'Alluvial Loam',
  'Clay Loam',
  'Sandy Loam',
  'Black Soil (Regur)',
  'Red Soil',
  'Laterite Soil',
  'Silt Loam',
];

interface AnalysisResult {
  score: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  badgeVariant: 'success' | 'warning' | 'primary' | 'danger';
  phStatus: string;
  moistureStatus: string;
  nStatus: { text: string; progress: number; color: string };
  pStatus: { text: string; progress: number; color: string };
  kStatus: { text: string; progress: number; color: string };
  explanation: string;
  recommendations: string[];
  suitableCrops: string[];
}

export const SoilHealthScreen = ({ navigation }: any) => {
  // All soil input fields initially EMPTY
  const [soilType, setSoilType] = useState<string>('');
  const [soilPh, setSoilPh] = useState<string>('');
  const [nitrogen, setNitrogen] = useState<string>('');
  const [phosphorus, setPhosphorus] = useState<string>('');
  const [potassium, setPotassium] = useState<string>('');
  const [moisture, setMoisture] = useState<string>('');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAnalyze = () => {
    setValidationError(null);

    // 1. Validate required fields (must all be filled out)
    if (
      !soilType.trim() ||
      !soilPh.trim() ||
      !nitrogen.trim() ||
      !phosphorus.trim() ||
      !potassium.trim() ||
      !moisture.trim()
    ) {
      const msg = 'Please enter all soil details.';
      setValidationError(msg);
      Alert.alert('Incomplete Form', msg);
      return;
    }

    // 2. Parse numeric values and validate reasonable ranges
    const phVal = parseFloat(soilPh);
    const nVal = parseFloat(nitrogen);
    const pVal = parseFloat(phosphorus);
    const kVal = parseFloat(potassium);
    const moistureVal = parseFloat(moisture);

    if (isNaN(phVal) || phVal < 0 || phVal > 14) {
      const msg = 'Please enter a valid Soil pH level between 0 and 14.';
      setValidationError(msg);
      Alert.alert('Invalid Input', msg);
      return;
    }

    if (isNaN(nVal) || nVal < 0 || nVal > 1000) {
      const msg = 'Please enter a valid Nitrogen value (0 - 1000 kg/ha).';
      setValidationError(msg);
      Alert.alert('Invalid Input', msg);
      return;
    }

    if (isNaN(pVal) || pVal < 0 || pVal > 500) {
      const msg = 'Please enter a valid Phosphorus value (0 - 500 kg/ha).';
      setValidationError(msg);
      Alert.alert('Invalid Input', msg);
      return;
    }

    if (isNaN(kVal) || kVal < 0 || kVal > 1000) {
      const msg = 'Please enter a valid Potassium value (0 - 1000 kg/ha).';
      setValidationError(msg);
      Alert.alert('Invalid Input', msg);
      return;
    }

    if (isNaN(moistureVal) || moistureVal < 0 || moistureVal > 100) {
      const msg = 'Please enter a valid Moisture percentage between 0% and 100%.';
      setValidationError(msg);
      Alert.alert('Invalid Input', msg);
      return;
    }

    // 3. Dynamic Analysis based on user entered inputs
    let score = 100;
    const recommendations: string[] = [];
    const suitableCrops: string[] = [];

    // Soil pH analysis
    let phStatus = '';
    if (phVal < 6.0) {
      phStatus = 'Acidic Soil (pH < 6.0)';
      score -= 15;
      recommendations.push('Apply Agricultural Lime (Calcium Carbonate) @ 2-3 tons/ha to neutralize soil acidity.');
      suitableCrops.push('Potato', 'Tea', 'Sweet Potato');
    } else if (phVal > 7.5) {
      phStatus = 'Alkaline Soil (pH > 7.5)';
      score -= 15;
      recommendations.push('Apply Gypsum (Calcium Sulphate) or Organic Compost to balance soil alkalinity.');
      suitableCrops.push('Mustard', 'Barley', 'Cotton');
    } else {
      phStatus = 'Optimal pH (6.0 - 7.5)';
      recommendations.push('Soil pH is in the optimal range for major agricultural crops.');
      suitableCrops.push('Wheat', 'Rice', 'Maize', 'Soybean');
    }

    // Soil Moisture analysis
    let moistureStatus = '';
    if (moistureVal < 35) {
      moistureStatus = 'Low Moisture (Deficient)';
      score -= 15;
      recommendations.push('Soil moisture is low. Schedule immediate drip or sprinkler irrigation.');
    } else if (moistureVal > 70) {
      moistureStatus = 'High Moisture (Excess)';
      score -= 10;
      recommendations.push('Ensure field drainage channels are clear to prevent waterlogging & root rot.');
    } else {
      moistureStatus = 'Optimal Moisture Level';
      recommendations.push('Soil moisture level is optimal for healthy root transpiration and nutrient absorption.');
    }

    // Nitrogen (N) analysis
    let nProgress = Math.min(100, Math.round((nVal / 200) * 100));
    let nText = '';
    let nColor = Colors.success;
    if (nVal < 100) {
      nText = 'Deficient (<100 kg/ha)';
      nColor = Colors.warning;
      score -= 10;
      recommendations.push('Top-dress Nitrogen with Urea or bio-fertilizers (Azotobacter) to stimulate leaf development.');
    } else if (nVal > 220) {
      nText = 'High (>220 kg/ha)';
      nColor = Colors.info;
      score -= 5;
      recommendations.push('Nitrogen level is abundant. Reduce split Urea doses to prevent lodging.');
    } else {
      nText = 'Optimal (100-220 kg/ha)';
    }

    // Phosphorus (P) analysis
    let pProgress = Math.min(100, Math.round((pVal / 80) * 100));
    let pText = '';
    let pColor = Colors.success;
    if (pVal < 30) {
      pText = 'Low (<30 kg/ha)';
      pColor = Colors.warning;
      score -= 10;
      recommendations.push('Apply Single Super Phosphate (SSP) or DAP @ 40 kg/acre for robust root growth.');
    } else if (pVal > 80) {
      pText = 'High (>80 kg/ha)';
      pColor = Colors.primary;
    } else {
      pText = 'Optimal (30-80 kg/ha)';
    }

    // Potassium (K) analysis
    let kProgress = Math.min(100, Math.round((kVal / 300) * 100));
    let kText = '';
    let kColor = Colors.success;
    if (kVal < 140) {
      kText = 'Low (<140 kg/ha)';
      kColor = Colors.warning;
      score -= 10;
      recommendations.push('Apply Muriate of Potash (MOP) @ 25 kg/acre to strengthen disease resistance.');
    } else if (kVal > 300) {
      kText = 'High (>300 kg/ha)';
      kColor = Colors.primary;
    } else {
      kText = 'Optimal (140-300 kg/ha)';
    }

    // Soil type specific crops
    if (soilType.includes('Clay')) {
      suitableCrops.push('Paddy Rice', 'Wheat');
    } else if (soilType.includes('Sandy')) {
      suitableCrops.push('Groundnut', 'Millets');
    } else if (soilType.includes('Black')) {
      suitableCrops.push('Cotton', 'Gram / Chickpea');
    } else if (soilType.includes('Red')) {
      suitableCrops.push('Pulses', 'Oilseeds');
    } else {
      suitableCrops.push('Sugarcane', 'Vegetables');
    }

    // Overall rating calculation
    score = Math.max(30, Math.min(100, score));
    let rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good';
    let badgeVariant: 'success' | 'warning' | 'primary' | 'danger' = 'success';

    if (score >= 85) {
      rating = 'Excellent';
      badgeVariant = 'success';
    } else if (score >= 70) {
      rating = 'Good';
      badgeVariant = 'primary';
    } else if (score >= 55) {
      rating = 'Fair';
      badgeVariant = 'warning';
    } else {
      rating = 'Poor';
      badgeVariant = 'danger';
    }

    const explanation = `Soil sample (${soilType}) evaluated with pH ${phVal}, Moisture ${moistureVal}%, and NPK values ${nVal}:${pVal}:${kVal} kg/ha. Overall soil health index is ${score}/100.`;

    setAnalysisResult({
      score,
      rating,
      badgeVariant,
      phStatus,
      moistureStatus,
      nStatus: { text: nText, progress: nProgress, color: nColor },
      pStatus: { text: pText, progress: pProgress, color: pColor },
      kStatus: { text: kText, progress: kProgress, color: kColor },
      explanation,
      recommendations,
      suitableCrops: Array.from(new Set(suitableCrops)),
    });
  };

  const handleReset = () => {
    setSoilType('');
    setSoilPh('');
    setNitrogen('');
    setPhosphorus('');
    setPotassium('');
    setMoisture('');
    setAnalysisResult(null);
    setValidationError(null);
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title="Soil Health Analysis"
        subtitle="Manual Telemetry Assessment"
        showBack={navigation.canGoBack()}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        
        {/* Form Input Section */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Enter Soil Parameters</Text>
          <Text style={styles.formSubtitle}>
            Manually enter your field's soil test parameters for personalized analysis.
          </Text>

          {validationError && (
            <View style={styles.errorAlert}>
              <Text style={styles.errorAlertText}>⚠️ {validationError}</Text>
            </View>
          )}

          {/* 1. Soil Type Dropdown */}
          <View style={styles.inputWrapper}>
            <Text style={styles.fieldLabel}>Soil Type</Text>
            <TouchableOpacity
              style={styles.dropdownBtn}
              activeOpacity={0.8}
              onPress={() => setIsDropdownOpen(true)}>
              <Text
                style={[
                  styles.dropdownText,
                  !soilType && styles.dropdownPlaceholder,
                ]}>
                {soilType || 'Select Soil Type'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* 2. Soil pH */}
          <Input
            label="Soil pH"
            placeholder="Enter soil pH"
            value={soilPh}
            onChangeText={setSoilPh}
            keyboardType="numeric"
          />

          {/* 3. Nitrogen (N) */}
          <Input
            label="Nitrogen (N)"
            placeholder="Enter nitrogen value"
            value={nitrogen}
            onChangeText={setNitrogen}
            keyboardType="numeric"
          />

          {/* 4. Phosphorus (P) */}
          <Input
            label="Phosphorus (P)"
            placeholder="Enter phosphorus value"
            value={phosphorus}
            onChangeText={setPhosphorus}
            keyboardType="numeric"
          />

          {/* 5. Potassium (K) */}
          <Input
            label="Potassium (K)"
            placeholder="Enter potassium value"
            value={potassium}
            onChangeText={setPotassium}
            keyboardType="numeric"
          />

          {/* 6. Moisture (%) */}
          <Input
            label="Moisture (%)"
            placeholder="Enter moisture percentage"
            value={moisture}
            onChangeText={setMoisture}
            keyboardType="numeric"
          />

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.analyzeBtn}
              activeOpacity={0.85}
              onPress={handleAnalyze}>
              <Text style={styles.analyzeBtnIcon}>🧪</Text>
              <Text style={styles.analyzeBtnText}>Analyze Soil</Text>
            </TouchableOpacity>

            {(soilType || soilPh || nitrogen || phosphorus || potassium || moisture || analysisResult) ? (
              <TouchableOpacity
                style={styles.resetBtn}
                activeOpacity={0.8}
                onPress={handleReset}>
                <Text style={styles.resetBtnText}>Clear Fields</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Analysis Results Section */}
        {analysisResult && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionHeaderTitle}>Soil Diagnostics & Report</Text>

            {/* Health Score Hero */}
            <View style={styles.scoreHero}>
              <View style={styles.scoreRow}>
                <View>
                  <Text style={styles.scoreLabel}>Soil Quality Score</Text>
                  <Text style={styles.scoreVal}>{analysisResult.score} / 100</Text>
                </View>
                <Badge
                  label={analysisResult.rating.toUpperCase()}
                  variant={analysisResult.badgeVariant}
                />
              </View>

              <Text style={styles.explanationText}>{analysisResult.explanation}</Text>

              <View style={styles.summaryBadgesRow}>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>🧪 {analysisResult.phStatus}</Text>
                </View>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>💧 {analysisResult.moistureStatus}</Text>
                </View>
              </View>
            </View>

            {/* Nutrients Evaluation */}
            <View style={styles.resultCard}>
              <Text style={styles.cardHeaderTitle}>NPK Nutrient Evaluation</Text>

              {/* Nitrogen */}
              <View style={styles.npkItem}>
                <View style={styles.npkHeader}>
                  <Text style={styles.npkTitle}>Nitrogen (N): {nitrogen} kg/ha</Text>
                  <Text style={styles.npkStatus}>{analysisResult.nStatus.text}</Text>
                </View>
                <ProgressBar
                  progress={analysisResult.nStatus.progress}
                  color={analysisResult.nStatus.color}
                  height={8}
                />
              </View>

              {/* Phosphorus */}
              <View style={styles.npkItem}>
                <View style={styles.npkHeader}>
                  <Text style={styles.npkTitle}>Phosphorus (P): {phosphorus} kg/ha</Text>
                  <Text style={styles.npkStatus}>{analysisResult.pStatus.text}</Text>
                </View>
                <ProgressBar
                  progress={analysisResult.pStatus.progress}
                  color={analysisResult.pStatus.color}
                  height={8}
                />
              </View>

              {/* Potassium */}
              <View style={styles.npkItem}>
                <View style={styles.npkHeader}>
                  <Text style={styles.npkTitle}>Potassium (K): {potassium} kg/ha</Text>
                  <Text style={styles.npkStatus}>{analysisResult.kStatus.text}</Text>
                </View>
                <ProgressBar
                  progress={analysisResult.kStatus.progress}
                  color={analysisResult.kStatus.color}
                  height={8}
                />
              </View>
            </View>

            {/* Suitable Crops */}
            {analysisResult.suitableCrops.length > 0 && (
              <View style={styles.resultCard}>
                <Text style={styles.cardHeaderTitle}>Suitable Crops</Text>
                <View style={styles.cropTagsRow}>
                  {analysisResult.suitableCrops.map((crop, idx) => (
                    <View key={idx} style={styles.cropTag}>
                      <Text style={styles.cropTagIcon}>🌾</Text>
                      <Text style={styles.cropTagText}>{crop}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.getRecommendationBtn}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('CropRecommendation', {
                      soilType,
                      ph: soilPh,
                      n: nitrogen,
                      p: phosphorus,
                      k: potassium,
                      moisture,
                    })
                  }>
                  <Text style={styles.getRecommendationBtnText}>
                    🌾 Calculate Crop AI Recommendations →
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Agronomist Recommendations */}
            <View style={styles.recommendationsCard}>
              <Text style={styles.cardHeaderTitle}>Soil Treatment & Recommendations</Text>
              {analysisResult.recommendations.map((rec, idx) => (
                <View key={idx} style={styles.recRow}>
                  <Text style={styles.recIcon}>💡</Text>
                  <Text style={styles.recText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Soil Type Selection Modal Dropdown */}
      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Soil Type</Text>
            <FlatList
              data={SOIL_TYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    soilType === item && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setSoilType(item);
                    setIsDropdownOpen(false);
                  }}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      soilType === item && styles.modalOptionTextSelected,
                    ]}>
                    {item}
                  </Text>
                  {soilType === item && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setIsDropdownOpen(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  formCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  formSubtitle: {
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
  inputWrapper: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
  },
  dropdownPlaceholder: {
    color: Colors.textMuted,
  },
  dropdownArrow: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
  },
  btnRow: {
    marginTop: Spacing.sm,
  },
  analyzeBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  analyzeBtnIcon: {
    fontSize: 20,
    marginRight: Spacing.xs,
  },
  analyzeBtnText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize + 1,
    fontWeight: Typography.weightBold,
  },
  resetBtn: {
    marginTop: Spacing.xs,
    paddingVertical: 10,
    alignItems: 'center',
  },
  resetBtnText: {
    color: Colors.textSecondary,
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightMedium,
  },
  resultsContainer: {
    marginTop: Spacing.sm,
  },
  sectionHeaderTitle: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  scoreHero: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreLabel: {
    fontSize: Typography.captionSize + 1,
    color: '#A7F3D0',
    fontWeight: Typography.weightMedium,
  },
  scoreVal: {
    fontSize: 32,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
    marginTop: 2,
  },
  explanationText: {
    fontSize: Typography.bodySize,
    color: Colors.textLight,
    lineHeight: 20,
    marginVertical: Spacing.sm,
  },
  summaryBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  badgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginRight: Spacing.xs,
    marginBottom: 4,
  },
  badgePillText: {
    color: Colors.textLight,
    fontSize: Typography.captionSize,
    fontWeight: Typography.weightMedium,
  },
  resultCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeaderTitle: {
    fontSize: Typography.bodySize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  npkItem: {
    marginBottom: Spacing.sm,
  },
  npkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  npkTitle: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightSemiBold,
    color: Colors.textPrimary,
  },
  npkStatus: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
  },
  cropTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cropTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primaryLight + '30',
  },
  cropTagIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  cropTagText: {
    fontSize: Typography.captionSize + 1,
    color: Colors.primaryDark,
    fontWeight: Typography.weightMedium,
  },
  getRecommendationBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  getRecommendationBtnText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
  },
  recommendationsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  recRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  recIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
    marginTop: 2,
  },
  recText: {
    flex: 1,
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
    lineHeight: 19,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: Spacing.lg,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalOptionSelected: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: Spacing.xs,
  },
  modalOptionText: {
    fontSize: Typography.bodySize + 1,
    color: Colors.textPrimary,
  },
  modalOptionTextSelected: {
    fontWeight: Typography.weightBold,
    color: Colors.primary,
  },
  checkmark: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  modalCloseBtn: {
    marginTop: Spacing.md,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.borderLight,
    borderRadius: 10,
  },
  modalCloseText: {
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
    fontWeight: Typography.weightBold,
  },
});

export default SoilHealthScreen;
