import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ViewStyle,
  ScrollView,
  ActivityIndicator,
  StatusBarStyle,
} from 'react-native';
import { Colors } from '../theme/colors';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  scrollable?: boolean;
  loading?: boolean;
  barStyle?: StatusBarStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  contentContainerStyle,
  backgroundColor = Colors.background,
  scrollable = true,
  loading = false,
  barStyle = 'dark-content',
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : scrollable ? (
        <ScrollView
          style={[styles.container, style]}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScreenContainer;
