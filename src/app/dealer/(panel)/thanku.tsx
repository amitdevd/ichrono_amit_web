import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { WatchPanel } from '@/components/listing/ListingUI';
import { Btn, Icon } from '@ichrono/ui';

/** Dealer "Thank you" after submitting a listing – backend_ref/views/dealer/listing/thanku.blade.php (watch-time.svg → icon) */
export default function DealerThankYou() {
  return (
    <View style={{ width: '100%', maxWidth: 720, alignSelf: 'center', marginTop: Spacing['2xl'] }}>
      <WatchPanel bodyStyle={{ padding: Spacing['3xl'] }}>
        <View style={styles.center}>
          <View style={styles.icon}>
            <Icon name="hourglass-half" size={64} color={Palette.secondary} />
          </View>
          <Text style={styles.p}>
            Thank you for adding a watch into your listing.{'\n'}Please wait for 3-4 hrs.
          </Text>
          <Text style={styles.title}>Thank you for your patience!</Text>
          <Btn title="Done" variant="success" onPress={() => router.replace('/dealer/listings?tab=Pending' as any)} style={{ marginTop: Spacing.xl }} />
        </View>
      </WatchPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'stretch', gap: Spacing.md },
  icon: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Palette.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  p: { color: Palette.textSecondary, fontSize: FontSizes.lg, lineHeight: 28, textAlign: 'center' },
  title: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold, textAlign: 'center' },
});
