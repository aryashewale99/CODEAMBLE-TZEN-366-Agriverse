import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { Colors, Typography } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import WeatherScreen from '../screens/WeatherScreen';
import FarmAnalyticsScreen from '../screens/FarmAnalyticsScreen';
import MarketPricesScreen from '../screens/MarketPricesScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { useTranslation } from '../i18n';

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderTabIcon = (routeName: string, focused: boolean) => {
  let icon = '🌱';
  if (routeName === 'HomeTab') icon = '🏠';
  else if (routeName === 'WeatherTab') icon = '🌤️';
  else if (routeName === 'AnalyticsTab') icon = '📊';
  else if (routeName === 'MarketTab') icon = '📈';
  else if (routeName === 'ProfileTab') icon = '👤';

  return (
    <Text style={[styles.iconText, focused && styles.iconActive]}>{icon}</Text>
  );
};

export const TabNavigator: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused }) => renderTabIcon(route.name, focused),
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: t('home') }}
      />
      <Tab.Screen
        name="WeatherTab"
        component={WeatherScreen}
        options={{ tabBarLabel: t('weather') }}
      />
      <Tab.Screen
        name="AnalyticsTab"
        component={FarmAnalyticsScreen}
        options={{ tabBarLabel: t('farmAnalytics') }}
      />
      <Tab.Screen
        name="MarketTab"
        component={MarketPricesScreen}
        options={{ tabBarLabel: t('marketPrices') }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: t('profileSettings') }}
      />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.cardBackground,
    borderTopColor: Colors.borderLight,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: Typography.captionSize,
    fontWeight: Typography.weightMedium,
  },
  iconText: {
    fontSize: 20,
    opacity: 0.7,
  },
  iconActive: {
    opacity: 1,
  },
});

export default TabNavigator;
