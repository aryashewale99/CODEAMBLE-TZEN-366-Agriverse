import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { isAuthenticated } = useAuth();

  const handleExplore = () => {
    if (isAuthenticated) {
      navigation.navigate('MainTabs', { screen: 'HomeTab' });
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <View style={styles.content}>
        <View style={styles.headerBox}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>AgriVerse</Text>
          <Text style={styles.tagline}>Smart Farming, Empowered Agriculture</Text>
        </View>

        <View style={styles.illustrationBox}>
          <View style={styles.badgeRow}>
            <View style={styles.featurePill}>
              <Text style={styles.pillIcon}>🌤️</Text>
              <Text style={styles.pillText}>Weather Telemetry</Text>
            </View>
            <View style={styles.featurePill}>
              <Text style={styles.pillIcon}>🌾</Text>
              <Text style={styles.pillText}>AI Crop Advisor</Text>
            </View>
          </View>

          <View style={styles.centerHeroCard}>
            <Text style={styles.heroTitle}>Empowering 50,000+ Farmers</Text>
            <Text style={styles.heroDesc}>
              Real-time weather insights, leaf disease diagnostics, soil moisture telemetry, and live mandi market prices in your pocket.
            </Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.featurePill}>
              <Text style={styles.pillIcon}>💧</Text>
              <Text style={styles.pillText}>IoT Irrigation</Text>
            </View>
            <View style={styles.featurePill}>
              <Text style={styles.pillIcon}>📈</Text>
              <Text style={styles.pillText}>Live Mandi Ticker</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionBox}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={handleExplore}>
            <Text style={styles.primaryBtnText}>Explore Dashboard</Text>
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.secondaryBtnText}>Farmer Mandatory Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  headerBox: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  logoImage: {
    width: 90,
    height: 90,
    marginBottom: Spacing.xs,
    borderRadius: 45,
  },
  appName: {
    fontSize: 34,
    fontWeight: Typography.weightBold,
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: Typography.subtitleSize,
    color: '#A7F3D0',
    marginTop: Spacing.xs,
  },
  illustrationBox: {
    marginVertical: Spacing.md,
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginHorizontal: Spacing.xs,
  },
  pillIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  pillText: {
    color: Colors.textLight,
    fontSize: Typography.captionSize,
    fontWeight: Typography.weightMedium,
  },
  centerHeroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: Spacing.lg,
    width: '100%',
    alignItems: 'center',
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroTitle: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: '#34D399',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: Typography.bodySize,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionBox: {
    marginBottom: Spacing.xs,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: Spacing.sm,
  },
  primaryBtnText: {
    color: Colors.textLight,
    fontSize: Typography.subtitleSize - 2,
    fontWeight: Typography.weightBold,
    marginRight: Spacing.xs,
  },
  arrowIcon: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: Typography.weightBold,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  secondaryBtnText: {
    color: Colors.textLight,
    fontSize: Typography.bodySize,
    fontWeight: Typography.weightBold,
  },
});

export default WelcomeScreen;