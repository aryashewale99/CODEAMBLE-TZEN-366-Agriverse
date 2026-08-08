import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../theme/colors';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import HomeScreen from '../screens/HomeScreen';
import WeatherScreen from '../screens/WeatherScreen';
import CropRecommendationScreen from '../screens/CropRecommendationScreen';
import DiseaseDetectionScreen from '../screens/DiseaseDetectionScreen';
import SmartIrrigationScreen from '../screens/SmartIrrigationScreen';
import FarmAnalyticsScreen from '../screens/FarmAnalyticsScreen';
import MarketPricesScreen from '../screens/MarketPricesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SoilHealthScreen from '../screens/SoilHealthScreen';
import VoiceAssistantScreen from '../screens/VoiceAssistantScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'MainTabs' : 'Login'}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Individual Feature Stack Routes */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Weather" component={WeatherScreen} />
      <Stack.Screen name="CropRecommendation" component={CropRecommendationScreen} />
      <Stack.Screen name="DiseaseDetection" component={DiseaseDetectionScreen} />
      <Stack.Screen name="SmartIrrigation" component={SmartIrrigationScreen} />
      <Stack.Screen name="FarmAnalytics" component={FarmAnalyticsScreen} />
      <Stack.Screen name="MarketPrices" component={MarketPricesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SoilHealth" component={SoilHealthScreen} />
      <Stack.Screen name="VoiceAssistant" component={VoiceAssistantScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
