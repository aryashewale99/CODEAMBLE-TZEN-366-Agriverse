import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { Colors, Typography, Spacing } from '../theme/colors';
import { aiDiseaseService } from '../services/aiDiseaseService';
import { DiseaseDetectionResult } from '../types/agri';

export const DiseaseDetectionScreen = ({ navigation }: any) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);

  const pickerOptions = {
    mediaType: 'photo' as const,
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.8 as const,
    includeBase64: false,
  };

  const handleTakeCameraPhoto = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission Required',
            message: 'AgriVerse needs camera access to capture photos of crops for disease diagnosis.',
            buttonPositive: 'Grant Permission',
            buttonNegative: 'Cancel',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Camera Permission Denied', 'Camera permission is required to capture crop photos.');
          return;
        }
      }

      setResult(null);
      const res = await launchCamera(pickerOptions);
      if (res.didCancel) return;
      if (res.errorCode) {
        if (res.errorCode === 'camera_unavailable') {
          Alert.alert('Camera Unavailable', 'Camera hardware is unavailable or running on a simulator without camera support. Please use "Upload Crop Photo" gallery option.');
        } else if (res.errorCode === 'permission') {
          Alert.alert('Permission Denied', 'Camera permission was denied. Please allow camera access in system settings.');
        } else {
          Alert.alert('Camera Notice', res.errorMessage || 'Unable to open camera on this device.');
        }
        return;
      }
      if (res.assets && res.assets.length > 0 && res.assets[0].uri) {
        setSelectedImageUri(res.assets[0].uri);
        setFileSize(res.assets[0].fileSize);
      }
    } catch (err) {
      console.error('Camera launch error:', err);
      Alert.alert('Notice', 'Unable to launch camera. You can select an image from the photo gallery.');
    }
  };

  const handleUploadGalleryPhoto = async () => {
    try {
      setResult(null);
      const res = await launchImageLibrary(pickerOptions);
      if (res.didCancel) return;
      if (res.errorCode) {
        Alert.alert('Gallery Notice', res.errorMessage || 'Unable to access photo library.');
        return;
      }
      if (res.assets && res.assets.length > 0 && res.assets[0].uri) {
        setSelectedImageUri(res.assets[0].uri);
        setFileSize(res.assets[0].fileSize);
      }
    } catch (err) {
      console.error('Gallery launch error:', err);
      Alert.alert('Error', 'Failed to open photo library.');
    }
  };

  const handleAnalyzeCrop = async () => {
    if (!selectedImageUri) {
      Alert.alert('No Image Selected', 'Please capture or upload a crop photo first.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await aiDiseaseService.analyzeCropImage(selectedImageUri, fileSize);
      setResult(res);
    } catch (err) {
      console.error('Visual crop analysis error:', err);
      Alert.alert('Analysis Failed', 'Unable to complete crop diagnosis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImageUri(null);
    setFileSize(undefined);
    setResult(null);
    setLoading(false);
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title="Visual Crop Disease Scan"
        subtitle="Whole Plant, Leaf & Fruit AI Analysis"
        showBack={navigation.canGoBack()}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* Guidance Header Banner */}
        <View style={styles.guidanceCard}>
          <View style={styles.guidanceHeader}>
            <Text style={styles.guidanceIcon}>🌿</Text>
            <Text style={styles.guidanceTitle}>Visual Crop Disease Inspection</Text>
          </View>
          <Text style={styles.guidanceBody}>
            Capture a photo of the whole plant, multiple leaves, stem, fruit, or visible damaged areas for instant AI visual diagnosis.
          </Text>
        </View>

        {/* Photo Selection Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.photoBtn, styles.cameraBtn]}
            activeOpacity={0.85}
            onPress={handleTakeCameraPhoto}>
            <Text style={styles.btnIcon}>📷</Text>
            <Text style={styles.photoBtnText}>Take Crop Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.photoBtn, styles.galleryBtn]}
            activeOpacity={0.85}
            onPress={handleUploadGalleryPhoto}>
            <Text style={styles.btnIcon}>🖼️</Text>
            <Text style={styles.photoBtnText}>Upload Crop Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Image Preview & Analysis CTA */}
        {selectedImageUri ? (
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Selected Crop Photo</Text>
              <TouchableOpacity onPress={handleClear} style={styles.changeBtn}>
                <Text style={styles.changeBtnText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            <Image source={{ uri: selectedImageUri }} style={styles.imagePreview} />

            <View style={styles.retakeRow}>
              <TouchableOpacity onPress={handleTakeCameraPhoto} style={styles.retakeSubBtn}>
                <Text style={styles.retakeSubBtnText}>📷 Retake Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUploadGalleryPhoto} style={styles.retakeSubBtn}>
                <Text style={styles.retakeSubBtnText}>🖼️ Choose Different</Text>
              </TouchableOpacity>
            </View>

            {!loading && !result && (
              <TouchableOpacity
                style={styles.analyzeBtn}
                activeOpacity={0.85}
                onPress={handleAnalyzeCrop}>
                <Text style={styles.analyzeBtnIcon}>🔬</Text>
                <Text style={styles.analyzeBtnText}>Analyze Crop Health</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingTitle}>Analyzing Crop Visual Telemetry...</Text>
            <Text style={styles.loadingSub}>
              Inspecting plant canopy, leaf vascularity, stem condition & fungal spots
            </Text>
          </View>
        )}

        {/* Results Display */}
        {result && (
          <View style={styles.resultContainer}>

            {/* Case A: Unclear Image Warning */}
            {result.unclearImageReason ? (
              <View style={styles.unclearBox}>
                <Text style={styles.unclearIcon}>⚠️</Text>
                <Text style={styles.unclearTitle}>Uncertain Visual Inspection</Text>
                <Text style={styles.unclearText}>{result.unclearImageReason}</Text>
                <TouchableOpacity style={styles.retryPhotoBtn} onPress={handleTakeCameraPhoto}>
                  <Text style={styles.retryPhotoText}>Take Clearer Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Case B: Diagnosis Result Card */
              <View>
                {/* Result Hero Header */}
                <View
                  style={[
                    styles.resultHero,
                    result.isHealthy ? styles.heroHealthy : styles.heroDiseased,
                  ]}>
                  <View style={styles.resultHeroTop}>
                    <View style={styles.heroLeft}>
                      <Text style={styles.detectedCropLabel}>Detected Crop</Text>
                      <Text style={styles.detectedCropName}>{result.affectedCrop}</Text>
                    </View>
                    <Badge
                      label={`${result.confidence}% Match`}
                      variant={result.isHealthy ? 'success' : 'danger'}
                    />
                  </View>

                  <View style={styles.diseaseNameRow}>
                    <Text style={styles.diseaseNameText}>
                      {result.isHealthy ? '✅ ' : '🦠 '}
                      {result.diseaseName}
                    </Text>
                  </View>

                  <View style={styles.heroFooterRow}>
                    <Text style={styles.severityLabel}>
                      Severity Level: <Text style={styles.severityValue}>{result.severity}</Text>
                    </Text>
                  </View>
                </View>

                {/* Immediate Action Needed */}
                {result.immediateAction && result.immediateAction.length > 0 && (
                  <View style={styles.urgentCard}>
                    <Text style={styles.urgentTitle}>🚨 Immediate Action Recommended</Text>
                    {result.immediateAction.map((act, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletIcon}>•</Text>
                        <Text style={styles.urgentText}>{act}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Visible Symptoms */}
                {result.symptoms && result.symptoms.length > 0 && (
                  <View style={styles.cardSection}>
                    <Text style={styles.cardSectionTitle}>👁️ Visible Visual Symptoms</Text>
                    {result.symptoms.map((sym, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletIcon}>•</Text>
                        <Text style={styles.bulletText}>{sym}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Treatment & Controls */}
                {result.treatment && result.treatment.length > 0 && (
                  <View style={styles.cardSection}>
                    <Text style={styles.cardSectionTitle}>💊 Recommended Treatment</Text>
                    {result.treatment.map((trt, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletIcon}>✓</Text>
                        <Text style={styles.bulletText}>{trt}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Preventive Measures */}
                {result.preventiveMeasures && result.preventiveMeasures.length > 0 && (
                  <View style={styles.cardSection}>
                    <Text style={styles.cardSectionTitle}>🛡️ Preventive Farming Measures</Text>
                    {result.preventiveMeasures.map((prv, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletIcon}>📌</Text>
                        <Text style={styles.bulletText}>{prv}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Agricultural Disclaimer */}
                <View style={styles.disclaimerBox}>
                  <Text style={styles.disclaimerText}>
                    ⚠️ Disclaimer: {result.disclaimer}
                  </Text>
                </View>
              </View>
            )}
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
  guidanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  guidanceIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  guidanceTitle: {
    fontSize: Typography.bodySize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.primaryDark,
  },
  guidanceBody: {
    fontSize: Typography.captionSize + 1,
    color: Colors.textPrimary,
    lineHeight: 19,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  photoBtn: {
    width: '48%',
    paddingVertical: Spacing.md,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cameraBtn: {
    backgroundColor: Colors.primary,
  },
  galleryBtn: {
    backgroundColor: Colors.primaryLight,
  },
  btnIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  photoBtnText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
  },
  previewCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  previewTitle: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  changeBtn: {
    padding: 4,
  },
  changeBtnText: {
    fontSize: Typography.captionSize,
    color: Colors.primary,
    fontWeight: Typography.weightSemiBold,
  },
  imagePreview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginVertical: Spacing.xs,
    resizeMode: 'cover',
  },
  analyzeBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
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
  loadingBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    marginVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadingTitle: {
    fontSize: Typography.bodySize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  loadingSub: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  resultContainer: {
    marginTop: Spacing.xs,
  },
  unclearBox: {
    backgroundColor: Colors.warningLight,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.warning + '40',
  },
  unclearIcon: {
    fontSize: 38,
    marginBottom: Spacing.xs,
  },
  unclearTitle: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.warning,
    marginBottom: 4,
  },
  unclearText: {
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  retryPhotoBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryPhotoText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
  },
  resultHero: {
    borderRadius: 18,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  heroHealthy: {
    backgroundColor: Colors.primary,
  },
  heroDiseased: {
    backgroundColor: Colors.primaryDark,
  },
  resultHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLeft: {
    flex: 1,
    marginRight: Spacing.xs,
  },
  detectedCropLabel: {
    fontSize: Typography.captionSize,
    color: '#A7F3D0',
    fontWeight: Typography.weightMedium,
  },
  detectedCropName: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
    marginTop: 2,
  },
  diseaseNameRow: {
    marginVertical: Spacing.sm,
  },
  diseaseNameText: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
  },
  heroFooterRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: Spacing.xs,
  },
  severityLabel: {
    fontSize: Typography.captionSize + 1,
    color: '#D1D5DB',
  },
  severityValue: {
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
  },
  urgentCard: {
    backgroundColor: Colors.dangerLight,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
  },
  urgentTitle: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.danger,
    marginBottom: Spacing.xs,
  },
  urgentText: {
    flex: 1,
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
    lineHeight: 19,
  },
  cardSection: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardSectionTitle: {
    fontSize: Typography.bodySize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
  },
  bulletIcon: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
    lineHeight: 19,
  },
  disclaimerBox: {
    backgroundColor: Colors.borderLight,
    borderRadius: 12,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  disclaimerText: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    lineHeight: 17,
    fontStyle: 'italic',
  },
});

export default DiseaseDetectionScreen;