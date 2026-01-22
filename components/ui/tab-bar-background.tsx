import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: Colors[colorScheme ?? 'light'].background, opacity: 0.9 }
      ]}
    />
  );
}
