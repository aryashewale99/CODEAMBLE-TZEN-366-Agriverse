import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography } from '../theme/colors';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color = Colors.primary,
  height = 10,
  style,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={[styles.container, style]}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    fontWeight: Typography.weightMedium,
  },
  percentage: {
    fontSize: Typography.captionSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  track: {
    width: '100%',
    backgroundColor: Colors.borderLight,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 6,
  },
});

export default ProgressBar;
