import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Colors, Typography, Spacing } from '../theme/colors';
import { mockWeatherData } from '../data/mockData';

export const WeatherScreen = ({ navigation }: any) => {
  return (
    <ScreenContainer>
      <Header
        title="Weather & Advisory"
        subtitle={mockWeatherData.city}
        showBack={navigation.canGoBack()}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}>
        
        {/* Main Current Weather Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🌤️</Text>
          <Text style={styles.temperature}>{mockWeatherData.temperature}°C</Text>
          <Text style={styles.condition}>{mockWeatherData.condition}</Text>
          <Text style={styles.subtext}>📍 {mockWeatherData.city}</Text>

          <View style={styles.divider} />

          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricIcon}>💧</Text>
              <Text style={styles.metricValue}>{mockWeatherData.humidity}%</Text>
              <Text style={styles.metricLabel}>Humidity</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricIcon}>💨</Text>
              <Text style={styles.metricValue}>{mockWeatherData.windSpeed} km/h</Text>
              <Text style={styles.metricLabel}>Wind Speed</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricIcon}>🌧️</Text>
              <Text style={styles.metricValue}>{mockWeatherData.rainChance}%</Text>
              <Text style={styles.metricLabel}>Rain Chance</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricIcon}>☀️</Text>
              <Text style={styles.metricValue}>UV {mockWeatherData.uvIndex}</Text>
              <Text style={styles.metricLabel}>UV Index</Text>
            </View>
          </View>
        </View>

        {/* Agricultural Advisory Note */}
        <View style={styles.advisoryCard}>
          <Text style={styles.advisoryTitle}>🌱 Farmer Field Advisory</Text>
          <Text style={styles.advisoryText}>{mockWeatherData.advisory}</Text>
        </View>

        {/* 7-Day Forecast */}
        <Text style={styles.sectionTitle}>7-Day Weather Forecast</Text>
        <View style={styles.forecastContainer}>
          {mockWeatherData.forecast.map((item, index) => (
            <View key={index} style={styles.forecastRow}>
              <Text style={styles.dayText}>{item.day}</Text>
              <View style={styles.forecastCenter}>
                <Text style={styles.forecastIcon}>{item.icon}</Text>
                <Text style={styles.forecastCond}>{item.condition}</Text>
              </View>
              <View style={styles.tempCol}>
                <Text style={styles.tempHigh}>{item.tempHigh}°</Text>
                <Text style={styles.tempLow}>{item.tempLow}°</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heroIcon: {
    fontSize: 54,
  },
  temperature: {
    fontSize: 48,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
  },
  condition: {
    fontSize: Typography.titleSize,
    color: '#A7F3D0',
    fontWeight: Typography.weightMedium,
  },
  subtext: {
    fontSize: Typography.bodySize,
    color: '#D1D5DB',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    marginVertical: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
  },
  metricLabel: {
    fontSize: Typography.captionSize,
    color: '#D1D5DB',
  },
  advisoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  advisoryTitle: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  advisoryText: {
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  forecastContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dayText: {
    width: 60,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  forecastCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  forecastIcon: {
    fontSize: 22,
    marginRight: Spacing.xs,
  },
  forecastCond: {
    fontSize: Typography.captionSize + 1,
    color: Colors.textSecondary,
  },
  tempCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempHigh: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginRight: Spacing.xs,
  },
  tempLow: {
    fontSize: Typography.bodySize,
    color: Colors.textMuted,
  },
});

export default WeatherScreen;