import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: Colors.successLight, text: Colors.success };
      case 'warning':
        return { bg: Colors.warningLight, text: Colors.warning };
      case 'danger':
        return { bg: Colors.dangerLight, text: Colors.danger };
      case 'info':
        return { bg: Colors.infoLight, text: Colors.info };
      case 'primary':
      default:
        return { bg: Colors.surface, text: Colors.primary };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
