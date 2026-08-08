import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, Typography, Spacing } from '../theme/colors';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  onPress,
  ...rest
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.button, styles[`size_${size}`]];

    if (variant === 'primary') base.push(styles.variantPrimary);
    else if (variant === 'secondary') base.push(styles.variantSecondary);
    else if (variant === 'outline') base.push(styles.variantOutline);
    else if (variant === 'accent') base.push(styles.variantAccent);
    else if (variant === 'danger') base.push(styles.variantDanger);

    if (disabled || loading) base.push(styles.disabled);
    if (style) base.push(style);

    return base;
  };

  const getTextStyle = (): TextStyle[] => {
    const base: TextStyle[] = [styles.text, styles[`text_${size}`]];

    if (variant === 'outline') base.push(styles.textOutline);
    else base.push(styles.textWhite);

    if (disabled) base.push(styles.textDisabled);
    if (textStyle) base.push(textStyle);

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={getContainerStyle()}
      {...rest}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary : Colors.textLight}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  size_small: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  size_medium: {
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.lg,
  },
  size_large: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  variantPrimary: {
    backgroundColor: Colors.primary,
  },
  variantSecondary: {
    backgroundColor: Colors.secondary,
  },
  variantOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  variantAccent: {
    backgroundColor: Colors.accent,
  },
  variantDanger: {
    backgroundColor: Colors.danger,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: Typography.weightBold,
    textAlign: 'center',
  },
  text_small: {
    fontSize: Typography.captionSize + 1,
  },
  text_medium: {
    fontSize: Typography.bodySize,
  },
  text_large: {
    fontSize: Typography.subtitleSize,
  },
  textWhite: {
    color: Colors.textLight,
  },
  textOutline: {
    color: Colors.primary,
  },
  textDisabled: {
    color: Colors.textMuted,
  },
});

export default Button;
