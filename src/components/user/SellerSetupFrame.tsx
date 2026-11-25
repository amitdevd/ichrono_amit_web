import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useRequireUser } from '@/hooks/use-guest-guard';
import WebHeader from './WebHeader';
import { useBreakpoint, Icon } from '@ichrono/ui';

/**
 * "Set up as Private seller" page frame – user/profile/add-*.blade.php:
 * user header, back link title, Documents / Address / Bank Info step radios,
 * and the `.loginContent` white card.
 */
const STEPS = [
  { key: 'documents', label: 'Documents', href: '/seller/documents' },
  { key: 'address', label: 'Address', href: '/seller/address' },
  { key: 'bank', label: 'Bank Info', href: '/seller/bank' },
] as const;

export type SellerStep = (typeof STEPS)[number]['key'];

export default function SellerSetupFrame({
  step,
  backHref,
  children,
}: {
  step: SellerStep;
  backHref: string;
  children: React.ReactNode;
}) {
  const allowed = useRequireUser();
  const { lgUp } = useBreakpoint();
  const idx = STEPS.findIndex((s) => s.key === step);

  return (
    <View style={styles.screen}>
      <ScrollView stickyHeaderIndices={[0]} keyboardShouldPersistTaps="handled">
        <WebHeader />
        {allowed ? (
          <View style={styles.container}>
            <View style={[styles.set, !lgUp && { flexDirection: 'column', alignItems: 'flex-start' }]}>
              <Pressable onPress={() => router.push(backHref as any)} style={styles.back}>
                <Icon name="chevron-left" size={18} color={Palette.primary} />
                <Text style={styles.h3}>Set up as Private seller</Text>
              </Pressable>
              <View style={styles.document}>
                {STEPS.map((s, i) => {
                  const done = i <= idx;
                  return (
                    <View key={s.key} style={styles.check}>
                      <View style={[styles.radio, done && styles.radioOn]}>{done ? <View style={styles.dot} /> : null}</View>
                      <Text style={[styles.checkLabel, done && { color: Palette.primary, fontWeight: FontWeights.semibold }]}>{s.label}</Text>
                      {i < STEPS.length - 1 ? <View style={[styles.line, i < idx && styles.lineOn]} /> : null}
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={styles.loginContent}>{children}</View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.backgroundPage },
  container: { width: '100%', maxWidth: 1000, alignSelf: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing['3xl'] },
  set: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.lg, marginBottom: Spacing.xl },
  back: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  h3: { color: Palette.primary, fontSize: FontSizes['2xl'], fontWeight: FontWeights.semibold },
  document: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  check: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Palette.loginBack,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
  },
  radioOn: { borderColor: Palette.secondary },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Palette.secondary },
  checkLabel: { color: Palette.textSecondary, fontSize: FontSizes.sm },
  line: { width: 36, height: 1.5, backgroundColor: Palette.borderMedium, marginHorizontal: 8 },
  lineOn: { backgroundColor: Palette.secondary },
  loginContent: {
    backgroundColor: Palette.white,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: Palette.loginBack,
    padding: Spacing['3xl'],
  },
});
