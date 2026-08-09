import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { Colors, Typography, Spacing } from '../theme/colors';
import { mockWeatherData, mockMarketCommodities } from '../data/mockData';


import { useTranslation } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import { useWeather } from '../hooks/useWeather';

export const HomeScreen = ({ navigation }: any) => {
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const locationQuery = user ? `${user.location}, ${user.district}, ${user.state}` : undefined;
  const { weather } = useWeather(locationQuery);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const currentWeather = weather || mockWeatherData;

  const quickActions = [
    {
      id: 'weather',
      title: t('weather'),
      subtitle: `${currentWeather.temperature}°C • ${currentWeather.condition}`,
      icon: '🌤️',
      color: '#E0F2FE',
      target: 'Weather',
    },
    {
      id: 'crop',
      title: t('cropRecommendation'),
      subtitle: t('cropSub'),
      icon: '🌾',
      color: '#E8F5E9',
      target: 'CropRecommendation',
    },
    {
      id: 'disease',
      title: t('diseaseDetection'),
      subtitle: t('diseaseSub'),
      icon: '📷',
      color: '#FEE2E2',
      target: 'DiseaseDetection',
    },
    {
      id: 'irrigation',
      title: t('smartIrrigation'),
      subtitle: t('irrigationSub'),
      icon: '💧',
      color: '#E0F7FA',
      target: 'SmartIrrigation',
    },
    {
      id: 'analytics',
      title: t('farmAnalytics'),
      subtitle: t('analyticsSub'),
      icon: '📊',
      color: '#F3E5F5',
      target: 'FarmAnalytics',
    },
    {
      id: 'market',
      title: t('marketPrices'),
      subtitle: t('marketSub'),
      icon: '📈',
      color: '#FFF3E0',
      target: 'MarketPrices',
    },
    {
      id: 'SoilHealthAnalysis',
      title: t('soilHealth'),
      subtitle: t('soilSub'),
      icon: '🧪',
      color: '#FFF9C4',
      target: 'SoilHealth',
    },
    {
      id: 'voiceAssistant',
      title: t('voiceAssistant'),
      subtitle: t('voiceSub'),
      icon: '🎙️',
      color: '#E1F5FE',
      target: 'VoiceAssistant',
    },
  ];



  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header greeting */}
        <View style={[styles.topHeader, isRTL && styles.rowRTL]}>
          <View style={isRTL && styles.alignRight}>
            <Text style={styles.greetingText}>{t('welcomeBack')}</Text>
            <Text style={styles.farmerName}>{user?.name || 'Farmer'}</Text>
            <Text style={styles.farmLocText}>
              📍 {user ? `${user.location}, ${user.district}, ${user.state}` : ''}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileBadge}
            accessibilityLabel="Farmer profile"
            onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.profileAvatar}>👨‍🌾</Text>
          </TouchableOpacity>
        </View>

        {/* Live Soil & Weather Telemetry Row */}
        <View style={styles.telemetryRow}>
          <StatCard
            title={t('soilMoisture')}
            value="42%"
            unit="Zone A"
            icon="💧"
            trend="+4% optimal"
            isPositive={true}
            style={styles.telemetryCard}
            variant="surface"
          />
          <StatCard
            title={t('solarRadiation')}
            value="6.2"
            unit="kW/m²"
            icon="☀️"
            trend="Peak hours"
            isPositive={true}
            style={styles.telemetryCard}
            variant="surface"
          />
        </View>

        {/* Weather Snapshot Hero Banner */}
        <TouchableOpacity
          style={styles.weatherBanner}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Weather')}>
          <View style={styles.weatherBannerLeft}>
            <Badge label={t('liveWeather')} variant="success" />
            <Text style={styles.weatherTemp}>{currentWeather.temperature}°C</Text>
            <Text style={styles.weatherCondition}>{currentWeather.condition}</Text>
            <Text style={styles.weatherCity}>📍 {currentWeather.city}</Text>
          </View>
          <View style={styles.weatherBannerRight}>
            <Text style={styles.weatherBigIcon}>🌤️</Text>
            <View style={styles.weatherStatPill}>
              <Text style={styles.weatherStatText}>💧 {currentWeather.humidity}%</Text>
            </View>
            <View style={styles.weatherStatPill}>
              <Text style={styles.weatherStatText}>🌧️ {currentWeather.rainChance}% Rain</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Advisory Alert Banner with Interactive Modal */}
        <TouchableOpacity
          style={styles.advisoryCard}
          activeOpacity={0.85}
          onPress={() => setShowAlertModal(true)}>
          <Text style={styles.advisoryIcon}>💡</Text>
          <View style={styles.advisoryTextBox}>
            <View style={styles.advisoryHeaderRow}>
              <Text style={styles.advisoryTitle}>{t('smartAdvisory')}</Text>
              <Text style={styles.tapAlertText}>{t('tapDetails')}</Text>
            </View>
            <Text style={styles.advisoryBody} numberOfLines={2}>
              {currentWeather.advisory}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quick Action Grid Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('smartModules')}</Text>
          <Text style={styles.sectionSub}>{t('selectService')}</Text>
        </View>


        <View style={styles.grid}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: item.color }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(item.target)}>
              <View style={styles.cardIconBox}>
                <Text style={styles.cardIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live Mandi Highlights */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Market Mandi Trends</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MarketPrices')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}>
          {mockMarketCommodities.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.mandiCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('MarketPrices')}>
              <Text style={styles.mandiName}>{item.name}</Text>
              <Text style={styles.mandiLocation}>{item.mandi}</Text>
              <Text style={styles.mandiPrice}>
                ₹{item.pricePerQuintal.toLocaleString('en-IN')} / Qtl
              </Text>
              <View style={styles.mandiChangeRow}>
                <Text
                  style={[
                    styles.mandiChange,
                    { color: item.changePercent >= 0 ? Colors.success : Colors.danger },
                  ]}>
                  {item.changePercent >= 0 ? '▲ +' : '▼ '}
                  {item.changePercent}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Advisory Alert Modal */}
      <Modal
        visible={showAlertModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAlertModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🌱 Agricultural Advisory Details</Text>
            <Text style={styles.modalDesc}>{currentWeather.advisory}</Text>

            <View style={styles.modalAlertBox}>
              <Text style={styles.modalAlertTitle}>⚠️ Recommended Action for Wheat</Text>
              <Text style={styles.modalAlertBody}>
                1. Postpone Nitrogen fertilizer top-dressing until high winds settle.
              </Text>
              <Text style={styles.modalAlertBody}>
                2. Run Irrigation Zone 1 automated pump at 6:00 PM today.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowAlertModal(false)}>
              <Text style={styles.modalCloseText}>Dismiss Advisory</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  greetingText: {
    fontSize: Typography.bodySize,
    color: Colors.textSecondary,
  },
  farmerName: {
    fontSize: Typography.headerSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  farmLocText: {
    fontSize: Typography.captionSize,
    color: Colors.primaryLight,
    fontWeight: Typography.weightMedium,
    marginTop: 2,
  },
  profileBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
  },
  profileAvatar: {
    fontSize: 24,
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  telemetryCard: {
    width: '48%',
  },
  weatherBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  weatherBannerLeft: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 38,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  weatherCondition: {
    fontSize: Typography.subtitleSize,
    color: '#A7F3D0',
    fontWeight: Typography.weightMedium,
  },
  weatherCity: {
    fontSize: Typography.captionSize,
    color: '#D1D5DB',
    marginTop: Spacing.xs,
  },
  weatherBannerRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherBigIcon: {
    fontSize: 48,
  },
  weatherStatPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginTop: 4,
  },
  weatherStatText: {
    color: Colors.textLight,
    fontSize: Typography.captionSize,
    fontWeight: Typography.weightMedium,
  },
  advisoryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.accentLight,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  advisoryIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  advisoryTextBox: {
    flex: 1,
  },
  advisoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  advisoryTitle: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.accent,
  },
  tapAlertText: {
    fontSize: Typography.captionSize,
    color: Colors.accent,
    fontWeight: Typography.weightMedium,
  },
  advisoryBody: {
    fontSize: Typography.captionSize + 1,
    color: Colors.textPrimary,
    lineHeight: 18,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  sectionSub: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
  },
  viewAllText: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightSemiBold,
    color: Colors.primaryLight,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: Typography.bodySize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  horizontalScroll: {
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  mandiCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: Spacing.md,
    marginRight: Spacing.sm,
    width: 150,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mandiName: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  mandiLocation: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  mandiPrice: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.primary,
  },
  mandiChangeRow: {
    marginTop: Spacing.xs,
  },
  mandiChange: {
    fontSize: Typography.captionSize,
    fontWeight: Typography.weightBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  modalDesc: {
    fontSize: Typography.bodySize,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  modalAlertBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  modalAlertTitle: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
  },
  modalAlertBody: {
    fontSize: Typography.captionSize + 1,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  modalCloseBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
});


export default HomeScreen;