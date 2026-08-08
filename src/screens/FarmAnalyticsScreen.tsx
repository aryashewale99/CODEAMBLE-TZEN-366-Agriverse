import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { Colors, Typography, Spacing } from '../theme/colors';

export const FarmAnalyticsScreen = ({ navigation }: any) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Rabi 2024' | 'Kharif 2024'>('Rabi 2024');

  const yieldData =
    selectedPeriod === 'Rabi 2024'
      ? [
          { crop: 'Wheat (PBW 725)', yieldQtl: 240, percentage: 85, color: Colors.primary },
          { crop: 'Basmati Rice', yieldQtl: 160, percentage: 65, color: Colors.accent },
          { crop: 'Mustard Seeds', yieldQtl: 50, percentage: 35, color: Colors.warning },
        ]
      : [
          { crop: 'Maize HQPM', yieldQtl: 280, percentage: 90, color: Colors.primary },
          { crop: 'Cotton (Long Staple)', yieldQtl: 110, percentage: 55, color: Colors.accent },
          { crop: 'Moong Dal', yieldQtl: 35, percentage: 30, color: Colors.warning },
        ];

  const expenses = [
    { title: 'Fertilizer & NPK Telemetry', amount: '₹1,28,000', percentage: 40 },
    { title: 'Certified Hybrid Seeds', amount: '₹80,000', percentage: 25 },
    { title: 'Irrigation Pumps & Diesel', amount: '₹64,000', percentage: 20 },
    { title: 'Labor & Field Harvest', amount: '₹48,000', percentage: 15 },
  ];

  const handleExportPDF = () => {
    Alert.alert('Report Exported', 'Seasonal Farm Financial Summary (PDF) has been saved to device downloads.');
  };

  return (
    <ScreenContainer>
      <Header
        title="Farm Analytics"
        subtitle="Harvest Yield, Financials & Eco Score"
        showBack={navigation.canGoBack()}
        onBackPress={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={handleExportPDF}>
            <Text style={styles.exportBtnText}>📄 PDF</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Season Selector Tabs */}
        <View style={styles.tabBarRow}>
          {(['Rabi 2024', 'Kharif 2024'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.tabItem,
                selectedPeriod === period && styles.tabItemActive,
              ]}
              onPress={() => setSelectedPeriod(period)}>
              <Text
                style={[
                  styles.tabText,
                  selectedPeriod === period && styles.tabTextActive,
                ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Telemetry Quick Row */}
        <View style={styles.statRow}>
          <StatCard
            title="Carbon Offset"
            value="14.2"
            unit="Tons CO₂"
            icon="🌱"
            trend="+12% Eco Score"
            isPositive={true}
            style={styles.statCardHalf}
          />
          <StatCard
            title="Water Saved"
            value="3.4L"
            unit="Gallons"
            icon="💧"
            trend="Smart Drip"
            isPositive={true}
            style={styles.statCardHalf}
          />
        </View>

        {/* Financial KPI Banner */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCardMain}>
            <Text style={styles.kpiLabel}>ESTIMATED NET PROFIT</Text>
            <Text style={styles.kpiProfit}>
              {selectedPeriod === 'Rabi 2024' ? '₹ 7,60,000' : '₹ 6,85,000'}
            </Text>
            <Badge label="+18.4% vs last season" variant="success" />
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiSubCard}>
              <Text style={styles.subLabel}>Total Revenue</Text>
              <Text style={[styles.subValue, { color: Colors.primary }]}>
                {selectedPeriod === 'Rabi 2024' ? '₹10,80,000' : '₹9,80,000'}
              </Text>
            </View>
            <View style={styles.kpiSubCard}>
              <Text style={styles.subLabel}>Total Input Cost</Text>
              <Text style={[styles.subValue, { color: Colors.danger }]}>₹3,20,000</Text>
            </View>
          </View>
        </View>

        {/* Crop Harvest Yield Bar Visualizer */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌾 Harvest Yield Output (Quintals)</Text>
          <Text style={styles.cardSub}>{selectedPeriod} Harvest Breakdown</Text>

          <View style={styles.barChartContainer}>
            {yieldData.map((item, index) => (
              <View key={index} style={styles.barRow}>
                <View style={styles.barLabelBox}>
                  <Text style={styles.barCropName}>{item.crop}</Text>
                  <Text style={styles.barCropVal}>{item.yieldQtl} Qtl</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${item.percentage}%`, backgroundColor: item.color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Cost Distribution Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💸 Input Expense Distribution</Text>
          <Text style={styles.cardSub}>Breakdown of farming expenditure</Text>

          <View style={styles.expenseList}>
            {expenses.map((exp, idx) => (
              <View key={idx} style={styles.expenseRow}>
                <View style={styles.expenseLeft}>
                  <Text style={styles.expenseTitle}>{exp.title}</Text>
                  <Text style={styles.expenseAmount}>{exp.amount}</Text>
                </View>
                <Badge label={`${exp.percentage}%`} variant="info" />
              </View>
            ))}
          </View>
        </View>

        {/* Productivity Insight Box */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>💡 Yield Efficiency Tip</Text>
          <Text style={styles.insightText}>
            Soil tests indicate Potassium levels are high. Reducing N-P-K 12-32-16 application by 15% next season could save ₹18,000 without affecting yield.
          </Text>
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
  exportBtnText: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.primary,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tabBarRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: Colors.cardBackground,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightMedium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    fontWeight: Typography.weightBold,
    color: Colors.primary,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  statCardHalf: {
    width: '48%',
  },
  kpiContainer: {
    marginBottom: Spacing.lg,
  },
  kpiCardMain: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  kpiLabel: {
    fontSize: Typography.captionSize,
    color: '#D1D5DB',
    letterSpacing: 1,
  },
  kpiProfit: {
    fontSize: 36,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
    marginVertical: Spacing.xs,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kpiSubCard: {
    width: '48%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subLabel: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
  },
  subValue: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  cardSub: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  barChartContainer: {
    marginTop: Spacing.xs,
  },
  barRow: {
    marginBottom: Spacing.md,
  },
  barLabelBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barCropName: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  barCropVal: {
    fontSize: Typography.bodySize,
    color: Colors.primary,
    fontWeight: Typography.weightBold,
  },
  barTrack: {
    height: 12,
    backgroundColor: Colors.borderLight,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  expenseList: {
    marginTop: Spacing.xs,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  expenseLeft: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
    fontWeight: Typography.weightMedium,
  },
  expenseAmount: {
    fontSize: Typography.captionSize + 1,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  insightCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  insightTitle: {
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
    color: Colors.accent,
    marginBottom: 4,
  },
  insightText: {
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});

export default FarmAnalyticsScreen;