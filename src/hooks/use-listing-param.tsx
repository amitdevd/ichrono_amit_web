import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useListings } from '@/context/listings';
import { Icon } from '@ichrono/ui';

/** Reads `?id=` and returns the listing being created / edited from the listings store. */
export function useListingParam() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const store = useListings();
  return { id, listing: store.get(id), ready: store.ready, store };
}

/** Shown when a step is opened without a valid listing id (e.g. a stale link). */
export function ListingNotFound({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  return (
    <View style={styles.box}>
      <Icon name="circle-exclamation" size={34} color={Palette.secondary} />
      <Text style={styles.title}>This listing could not be found.</Text>
      <Pressable onPress={() => router.replace(backHref as any)} accessibilityRole="link">
        <Text style={styles.link}>{backLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing['4xl'], paddingHorizontal: Spacing.xl },
  title: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
  link: { color: Palette.secondary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold, textDecorationLine: 'underline' },
});
