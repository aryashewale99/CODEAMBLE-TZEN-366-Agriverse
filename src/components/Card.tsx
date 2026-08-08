import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Spacing } from '../theme/colors';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerRight,
  onPress,
  style,
  contentStyle,
  variant = 'elevated',
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return styles.variantOutlined;
      case 'flat':
        return styles.variantFlat;
      case 'elevated':
      default:
        return styles.variantElevated;
    }
  };

  return (
    <CardContainer
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      style={[styles.container, getVariantStyle(), style]}>
      {(title || subtitle || headerRight) && (
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {headerRight && <View>{headerRight}</View>}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: Colors.cardBackground,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  variantElevated: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  variantOutlined: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  variantFlat: {
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.titleSize - 2,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  content: {
    padding: Spacing.md,
  },
});

export default Card;
