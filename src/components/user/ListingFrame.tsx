import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useRequireUser } from '@/hooks/use-guest-guard';
import { StepDots } from '@/components/listing/ListingUI';
import WebHeader from './WebHeader';
import WebFooter from './WebFooter';
import { useBreakpoint, Icon } from '@ichrono/ui';

/**
 * User Web "Create listing" page frame – user/Listinguser/layout + liststep*.blade.php:
 * the user header, a "‹ List Your Watch" back link, the Information → Description
 * step dots and the white `.loginContent` card.
 *
 *  step   – index into Information · Photos · Ownership · Conditions · Description;
 *           leave it out for pages without the step dots (Create listing, Listings, step one).
 */
export default function ListingFrame({
  title = 'List Your Watch',
  backHref,
  step,
  width = 1000,
  plain,
  children,
}: {
  title?: string;
  backHref?: string;
  step?: number;
  width?: number;
  /** render children without the white card */
  plain?: boolean;
  children: React.ReactNode;
}) {
  const allowed = useRequireUser();
  const { lgUp } = useBreakpoint();

  return (
    <View style={styles.screen}>
      <ScrollView stickyHeaderIndices={[0]} keyboardShouldPersistTaps="handled">
        <WebHeader />
        {allowed ? (
          <View style={[styles.container, { maxWidth: width }]}>
            <View style={[styles.head, step != null && lgUp && styles.headAbs]}>
              {backHref ? (
                <Pressable
                  onPress={() => (router.canGoBack() ? router.back() : router.push(backHref as any))}
                  style={styles.back}
                  accessibilityRole="link"
                  accessibilityLabel="Back"
                >
                  <Icon name="chevron-left" size={18} color={Palette.primary} />
                  <Text style={styles.h3}>{title}</Text>
                </Pressable>
              ) : (
                <Text style={styles.h3}>{title}</Text>
              )}
            </View>
            {step != null ? <StepDots active={step} /> : null}
            {plain ? children : <View style={styles.card}>{children}</View>}
          </View>
        ) : (
          <View style={{ height: 400 }} />
        )}
        <WebFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.backgroundPage },
  container: { width: '100%', alignSelf: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing['3xl'], position: 'relative' },
  head: { marginBottom: Spacing.xl },
  headAbs: { position: 'absolute', left: Spacing.lg, top: Spacing['3xl'], zIndex: 1 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'flex-start' },
  h3: { color: Palette.primary, fontSize: FontSizes['2xl'], fontWeight: FontWeights.semibold },
  card: { backgroundColor: Palette.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.borderSoft, overflow: 'hidden' },
});
