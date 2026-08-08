import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { Colors } from './src/theme/colors';
import { I18nProvider } from './src/i18n';
import { AuthProvider } from './src/context/AuthContext';

const AgriVerseTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.cardBackground,
    text: Colors.textPrimary,
    border: Colors.borderLight,
  },
};

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <I18nProvider>
          <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
          <NavigationContainer theme={AgriVerseTheme}>
            <AppNavigator />
          </NavigationContainer>
        </I18nProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}


export default App;