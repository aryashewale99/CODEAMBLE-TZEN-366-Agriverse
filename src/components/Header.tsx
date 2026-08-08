import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../theme/colors';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

import { useTranslation } from '../i18n';

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightAction,
}) => {
  const { isRTL } = useTranslation();

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]} accessibilityRole="header">
      <View style={[styles.leftContainer, isRTL && styles.leftContainerRTL]}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.backIcon}>{isRTL ? '→' : '←'}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isRTL && styles.alignRight]} numberOfLines={1} accessibilityRole="text">
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, isRTL && styles.alignRight]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightAction && <View style={styles.rightContainer}>{rightAction}</View>}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.captionSize,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rightContainer: {
    marginLeft: Spacing.sm,
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  leftContainerRTL: {
    flexDirection: 'row-reverse',
  },
  alignRight: {
    textAlign: 'right',
  },
});


export default Header;
