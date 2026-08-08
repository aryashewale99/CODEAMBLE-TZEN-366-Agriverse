import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Colors, Typography, Spacing } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';

export const LoginScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [validationError, setValidationError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    location?: string;
    state?: string;
    district?: string;
  }>({});

  const { login, loading } = useAuth();

  const handleLogin = async () => {
    const errors: typeof fieldErrors = {};
    if (!fullName.trim()) errors.fullName = 'Full Name is mandatory';
    if (!location.trim()) errors.location = 'Location is mandatory';
    if (!state.trim()) errors.state = 'State is mandatory';
    if (!district.trim()) errors.district = 'District is mandatory';

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const msg = 'Please fill in all mandatory fields: Full Name, Location, State, and District.';
      setValidationError(msg);
      Alert.alert('Validation Error', msg);
      return;
    }

    setValidationError('');
    try {
      await login({
        name: fullName.trim(),
        location: location.trim(),
        state: state.trim(),
        district: district.trim(),
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { screen: 'HomeTab' } }],
      });
    } catch (e: any) {
      Alert.alert('Login Error', e.message || 'Failed to complete login. Please try again.');
    }
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title="Farmer Authentication"
        subtitle="Mandatory Login for AgriVerse Telemetry"
        showBack={navigation.canGoBack()}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBox}>
          <Text style={styles.logoIcon}>🌱</Text>
          <Text style={styles.title}>Welcome to AgriVerse</Text>
          <Text style={styles.subtitle}>
            Please enter your profile details below to access field weather, crop advisory, and mandi telemetry.
          </Text>
        </View>

        {validationError ? (
          <View style={styles.validationBox}>
            <Text style={styles.validationText}>⚠️ {validationError}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Input
            label="Full Name *"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
            error={fieldErrors.fullName}
            autoCapitalize="words"
          />

          <Input
            label="Location *"
            placeholder="Enter village / city / farm area"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (fieldErrors.location) setFieldErrors((prev) => ({ ...prev, location: undefined }));
            }}
            error={fieldErrors.location}
            autoCapitalize="words"
          />

          <Input
            label="State *"
            placeholder="Enter state"
            value={state}
            onChangeText={(text) => {
              setState(text);
              if (fieldErrors.state) setFieldErrors((prev) => ({ ...prev, state: undefined }));
            }}
            error={fieldErrors.state}
            autoCapitalize="words"
          />

          <Input
            label="District *"
            placeholder="Enter district"
            value={district}
            onChangeText={(text) => {
              setDistrict(text);
              if (fieldErrors.district) setFieldErrors((prev) => ({ ...prev, district: undefined }));
            }}
            error={fieldErrors.district}
            autoCapitalize="words"
          />

          <Button
            title="Login & Access AgriVerse →"
            variant="primary"
            size="large"
            loading={loading}
            onPress={handleLogin}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  heroBox: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  logoIcon: {
    fontSize: 44,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.titleSize,
    fontWeight: Typography.weightBold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.bodySize,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: Spacing.sm,
  },
  validationBox: {
    backgroundColor: Colors.dangerLight,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
  },
  validationText: {
    fontSize: Typography.captionSize + 1,
    color: Colors.danger,
    fontWeight: Typography.weightBold,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
});

export default LoginScreen;
