import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { Colors, Typography, Spacing } from '../theme/colors';
import { useIrrigation } from '../hooks/useIrrigation';

export const SmartIrrigationScreen = ({ navigation }: any) => {
  const { zones, togglePump, loading } = useIrrigation();
  const [autoMode, setAutoMode] = useState(true);

  const runningPumpsCount = zones.filter((z) => z.isPumpOn).length;
  const avgMoisture =
    zones.length > 0
      ? Math.round(
          zones.reduce((sum, z) => sum + z.soilMoisture, 0) / zones.length
        )
      : 46;

  return (
    <ScreenContainer loading={loading}>
      <Header
        title="Smart Irrigation"
        subtitle="IoT Telemetry & Valve Overrides"
        showBack={navigation.canGoBack()}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Telemetry Summary Header Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeaderRow}>
            <View>
              <Text style={styles.summaryLabel}>Avg. Field Moisture</Text>
              <Text style={styles.summaryValue}>{avgMoisture}%</Text>
            </View>
            <View style={styles.autoModeBox}>
              <Text style={styles.autoModeText}>Smart Automation</Text>
              <Switch
                value={autoMode}
                onValueChange={setAutoMode}
                trackColor={{ false: Colors.border, true: Colors.successLight }}
                thumbColor={autoMode ? Colors.primary : Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.summaryStatsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>💧</Text>
              <Text style={styles.statNum}>1,240 L</Text>
              <Text style={styles.statLabel}>Water Today</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statNum}>3 Active</Text>
              <Text style={styles.statLabel}>Soil Telemetry</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>🚰</Text>
              <Text style={styles.statNum}>{runningPumpsCount} Running</Text>
              <Text style={styles.statLabel}>Water Pumps</Text>
            </View>
          </View>
        </View>

        {/* Zone List */}
        <Text style={styles.sectionTitle}>Irrigation Zones & Sensor Feeds</Text>

        {zones.map((zone) => (
          <View key={zone.id} style={styles.zoneCard}>
            <View style={styles.zoneHeader}>
              <View>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.cropTag}>Crop: {zone.crop}</Text>
              </View>
              <Badge
                label={zone.isPumpOn ? 'PUMP RUNNING' : zone.status}
                variant={zone.isPumpOn ? 'success' : 'primary'}
              />
            </View>

            {/* Moisture Level ProgressBar */}
            <ProgressBar
              progress={zone.soilMoisture}
              label="Soil Moisture Gauge"
              color={
                zone.soilMoisture < 35
                  ? Colors.warning
                  : zone.soilMoisture > 70
                  ? Colors.info
                  : Colors.success
              }
              height={12}
              style={styles.progressSpacing}
            />

            <Text style={styles.targetText}>
              Target Moisture Threshold: {zone.targetMoisture}%
            </Text>

            {/* Schedule & Info */}
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>⏱️ Last Watered: {zone.lastWatered}</Text>
              <Text style={styles.infoText}>📅 Next: {zone.nextScheduled}</Text>
            </View>

            {/* Pump Manual Control Button */}
            <TouchableOpacity
              style={[
                styles.pumpToggleBtn,
                zone.isPumpOn ? styles.pumpBtnOff : styles.pumpBtnOn,
              ]}
              activeOpacity={0.85}
              onPress={() => togglePump(zone.id)}>
              <Text style={styles.pumpBtnText}>
                {zone.isPumpOn ? '⏹ Turn Off Pump' : '▶ Turn On Water Pump'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    fontSize: Typography.captionSize + 1,
    color: '#D1D5DB',
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
  },
  autoModeBox: {
    alignItems: 'flex-end',
  },
  autoModeText: {
    fontSize: Typography.captionSize,
    color: '#A7F3D0',
    marginBottom: 4,
    fontWeight: Typography.weightMedium,
  },
  summaryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    padding: Spacing.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
  },
  statNum: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
    marginTop: 2,
  },
  statLabel: {
    fontSize: Typography.captionSize,
    color: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  zoneCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  zoneName: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  cropTag: {
    fontSize: Typography.captionSize + 1,
    color: Colors.primaryLight,
    fontWeight: Typography.weightMedium,
  },
  progressSpacing: {
    marginVertical: Spacing.xs,
  },
  targetText: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 2,
  },
  infoRow: {
    marginVertical: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.captionSize + 1,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  pumpToggleBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  pumpBtnOn: {
    backgroundColor: Colors.primary,
  },
  pumpBtnOff: {
    backgroundColor: Colors.danger,
  },
  pumpBtnText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
  },
});

export default SmartIrrigationScreen;