import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  HomeTab: undefined;
  WeatherTab: undefined;
  AnalyticsTab: undefined;
  MarketTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Home: undefined;
  Weather: undefined;
  CropRecommendation: undefined;
  DiseaseDetection: undefined;
  SmartIrrigation: undefined;
  FarmAnalytics: undefined;
  MarketPrices: undefined;
  Profile: undefined;
  SoilHealth: undefined;
  VoiceAssistant: undefined;
};

