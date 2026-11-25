import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontWeights } from '@/constants/theme';
import { StepDots, WatchPanel } from '@/components/listing/ListingUI';
import { Icon } from '@ichrono/ui';

/**
 * Dealer Web listing page pieces – dealer/listing/*.blade.php:
 * `.pagetitle` (‹ back + h4) and the `.create-wapper` with the step dots and `.watch-panel`.
 */
export function DealerPageTitle({ title, backHref, right }: { title: string; backHref?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.titleRow}>
      <View style={styles.titleLeft}>
        {backHref ? (
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.push(backHref as any))}
            hitSlop={8}
            accessibilityRole="link"
            accessibilityLabel="Back"
          >
            <Icon name="chevron-left" size={18} color={Palette.primary} />
          </Pressable>
        ) : null}
        <Text style={styles.h4}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

export function DealerListingStep({
  title,
  backHref,
  step,
  children,
  panelTitle,
  panelSubtitle,
  bodyStyle,
}: {
  title: string;
  backHref: string;
  step: number;
  children: React.ReactNode;
  panelTitle?: string;
  panelSubtitle?: string;
  bodyStyle?: any;
}) {
  return (
    <View>
      <DealerPageTitle title={title} backHref={backHref} />
      <View style={styles.wrapper}>
        <StepDots active={step} />
        <WatchPanel title={panelTitle} subtitle={panelSubtitle} bodyStyle={bodyStyle}>
          {children}
        </WatchPanel>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl },
  titleLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  h4: { color: Palette.primary, fontSize: 24, fontWeight: FontWeights.semibold },
  wrapper: { width: '100%', maxWidth: 860, alignSelf: 'center', marginTop: Spacing.md },
});
