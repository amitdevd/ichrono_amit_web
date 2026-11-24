import { View, Text, StyleSheet } from 'react-native';
import { Palette, FontSizes, FontWeights } from '@/constants/theme';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <Text style={styles.subtitle}>Discover luxury watches</Text>
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
