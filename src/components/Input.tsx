import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Typography, Spacing } from '../theme/colors';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  disabled = false,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  editable = true,
  ...rest
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          error ? styles.containerError : null,
          disabled ? styles.containerDisabled : null,
        ]}>
        {leftIcon && <View style={styles.leftIconBox}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, inputStyle, disabled ? styles.inputDisabled : null]}
          placeholderTextColor={Colors.textMuted}
          editable={!disabled && editable}
          {...rest}
        />
        {rightIcon && <View style={styles.rightIconBox}>{rightIcon}</View>}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.captionSize + 1,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
  },
  containerError: {
    borderColor: Colors.danger,
  },
  containerDisabled: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderLight,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
  },
  inputDisabled: {
    color: Colors.textMuted,
  },
  leftIconBox: {
    marginRight: Spacing.xs,
  },
  rightIconBox: {
    marginLeft: Spacing.xs,
  },
  errorText: {
    fontSize: Typography.captionSize,
    color: Colors.danger,
    marginTop: 4,
  },
  helperText: {
    fontSize: Typography.captionSize,
    color: Colors.textMuted,
    marginTop: 4,
  },
});

export default Input;
