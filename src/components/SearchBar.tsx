import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Spacing } from '../theme/colors';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        accessibilityLabel="Search input"
        accessibilityRole="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
          style={styles.clearBtn}
          accessibilityLabel="Clear search">
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: Typography.bodySize,
    color: Colors.textPrimary,
  },
  clearBtn: {
    padding: Spacing.xs,
  },
  clearIcon: {
    fontSize: 16,
    color: Colors.textMuted,
  },
});

export default SearchBar;
