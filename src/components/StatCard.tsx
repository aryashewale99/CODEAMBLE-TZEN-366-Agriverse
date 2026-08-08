import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../theme/colors';

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: string;
  isPositive?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'surface' | 'card';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  isPositive = true,
  style,
  variant = 'card',
}) => {
  return (
    <View
      style={[
        styles.container,
        variant === 'primary' && styles.variantPrimary,
        variant === 'surface' && styles.variantSurface,
        style,
      ]}>
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.title,
            variant === 'primary' ? styles.textLight : styles.textSecondary,
          ]}>
          {title}
        </Text>
        {icon && <Text style={styles.icon}>{icon}</Text>}
      </View>

      <View style={styles.valueRow}>
        <Text
          style={[
            styles.value,
            variant === 'primary' ? styles.textLight : styles.textPrimary,
          ]}>
          {value}
        </Text>
        {unit && (
          <Text
            style={[
              styles.unit,
              variant === 'primary' ? styles.textLightSub : styles.textMuted,
            ]}>
            {' '}
            {unit}
          </Text>
        )}
      </View>

      {trend && (
        <View style={styles.trendRow}>
          <Text
            style={[
              styles.trendText,
              isPositive ? styles.trendPositive : styles.trendNegative,
            ]}>
            {isPositive ? '▲ ' : '▼ '}
            {trend}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  variantPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  variantSurface: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderLight,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightMedium,
  },
  textSecondary: {
    color: Colors.textSecondary,
  },
  textLight: {
    color: Colors.textLight,
  },
  textLightSub: {
    color: '#D1D5DB',
  },
  textPrimary: {
    color: Colors.textPrimary,
  },
  textMuted: {
    color: Colors.textMuted,
  },
  icon: {
    fontSize: 20,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
  },
  unit: {
    fontSize: Typography.captionSize,
    fontWeight: Typography.weightMedium,
  },
  trendRow: {
    marginTop: Spacing.xs,
  },
  trendText: {
    fontSize: Typography.captionSize,
    fontWeight: Typography.weightBold,
  },
  trendPositive: {
    color: Colors.success,
  },
  trendNegative: {
    color: Colors.danger,
  },
});

export default StatCard;
