import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../theme/colors';

export interface ModalDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  primaryButtonText?: string;
  onPrimaryPress?: () => void;
  secondaryButtonText?: string;
  onSecondaryPress?: () => void;
  onClose: () => void;
}

export const ModalDialog: React.FC<ModalDialogProps> = ({
  visible,
  title,
  description,
  children,
  primaryButtonText = 'Confirm',
  onPrimaryPress,
  secondaryButtonText,
  onSecondaryPress,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}

          {children && <View style={styles.body}>{children}</View>}

          <View style={styles.footer}>
            {secondaryButtonText && (
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary]}
                onPress={onSecondaryPress || onClose}>
                <Text style={styles.btnSecondaryText}>{secondaryButtonText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={onPrimaryPress || onClose}>
              <Text style={styles.btnPrimaryText}>{primaryButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  content: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: Spacing.lg,
    elevation: 5,
  },
  title: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.bodySize,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  body: {
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.xs,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    marginLeft: Spacing.xs,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
  },
  btnSecondary: {
    backgroundColor: Colors.surface,
  },
  btnPrimaryText: {
    color: Colors.textLight,
    fontWeight: Typography.weightBold,
    fontSize: Typography.bodySize,
  },
  btnSecondaryText: {
    color: Colors.textPrimary,
    fontWeight: Typography.weightMedium,
    fontSize: Typography.bodySize,
  },
});

export default ModalDialog;
