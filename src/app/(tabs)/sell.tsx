import { View, Text, StyleSheet } from 'react-native';
import { Palette, FontSizes, FontWeights } from '@/constants/theme';

export default function SellScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sell</Text>
      <Text style={styles.subtitle}>List your timepiece</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Palette.gold,
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
  },
  subtitle: {
    color: Palette.textSecondary,
    fontSize: FontSizes.md,
    marginTop: 8,
  },
});
