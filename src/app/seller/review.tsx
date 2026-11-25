import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useRequireUser } from '@/hooks/use-guest-guard';
import WebHeader from '@/components/user/WebHeader';
import { useSeller } from '@/context/seller';
import { useBreakpoint, Btn, AppModal, Icon } from '@ichrono/ui';

/** backend_ref/views/user/profile/review-details.blade.php (+ #submitMobal) */
export default function SellerReview() {
  const allowed = useRequireUser();
  const seller = useSeller();
  const { mdUp, lgUp } = useBreakpoint();
  const [done, setDone] = useState(false);
  const { docs, address: a, bank: b } = seller;

  const missing = !docs.businessFront || !a.street1 || !b.accountNumber;

  const docGroups: [string, string | null, string | null][] = [
    ['Business registration', docs.businessFront, docs.businessBack],
    ['Address proof', docs.addressFront, docs.addressBack],
    ['Identity proof', docs.identityFront, docs.identityBack],
  ];

  return (
    <View style={styles.screen}>
      <ScrollView stickyHeaderIndices={[0]}>
        <WebHeader />
        {allowed ? (
          <View style={styles.container}>
            <Text style={styles.title}>Review Details</Text>

            <Heading title="Private Seller Docs." href="/seller/documents?edit=1" />
            <View style={[styles.box, mdUp && { flexDirection: 'row' }]}>
              {docGroups.map(([label, f, r], i) => (
                <View key={label} style={[styles.docCol, mdUp && i < 2 && styles.colBorder]}>
                  <Text style={styles.label}>{label}</Text>
                  <View style={styles.docRow}>
                    <DocThumb uri={f} />
                    <DocThumb uri={r} />
                  </View>
                </View>
              ))}
            </View>

            <View style={[{ gap: Spacing.xl }, lgUp && { flexDirection: 'row' }]}>
              <View style={lgUp ? { flex: 2 } : null}>
                <Heading title="Address Info" href="/seller/address?edit=1" />
                <View style={[styles.box, mdUp && { flexDirection: 'row' }]}>
                  <View style={[styles.infoCol, mdUp && { flex: 7 }, mdUp && styles.colBorder]}>
                    <Info icon={require('@/assets/images/number.webp')} text={a.mobile ? `${a.countryCode} ${a.mobile}` : 'N/A'} />
                    <Info icon={require('@/assets/images/country.webp')} text={a.country || 'N/A'} />
                    <Info icon={require('@/assets/images/address.webp')} text={[a.street1, a.street2, a.city, a.zip].filter(Boolean).join(', ') || 'N/A'} />
                  </View>
                  <View style={[styles.infoCol, mdUp && { flex: 5 }]}>
                    <Info icon={require('@/assets/images/printuout.webp')} text={a.fax || 'N/A'} />
                    <Info icon={require('@/assets/images/global-addres.webp')} text={a.website || 'N/A'} link={!!a.website} />
                    <Info icon={require('@/assets/images/document.webp')} text={[a.taxInfo, a.taxPayerId].filter(Boolean).join(' ') || 'N/A'} />
                  </View>
                </View>
              </View>
              <View style={lgUp ? { flex: 1 } : null}>
                <Heading title="Bank Info" href="/seller/bank?edit=1" />
                <View style={styles.box}>
                  <View style={styles.infoCol}>
                    <Info icon={require('@/assets/images/user-name.webp')} text={b.holderName || 'N/A'} />
                    <Info icon={require('@/assets/images/backaccount.webp')} text={b.accountNumber || 'N/A'} />
                    <Info icon={require('@/assets/images/IFSC-code.webp')} text={b.holderAddress || 'N/A'} />
                  </View>
                </View>
              </View>
            </View>

            {missing ? <Text style={styles.warn}>Some details are missing. Use Edit above to complete every section before submitting.</Text> : null}
            <Btn
              title="Confirm & Submit"
              variant="customBtn3"
              disabled={missing}
              onPress={() => setDone(true)}
              style={{ width: mdUp ? '50%' : '100%', marginTop: Spacing['3xl'] }}
            />
          </View>
        ) : null}
      </ScrollView>

      <AppModal visible={done} onClose={() => setDone(false)} width={440}>
        <View style={styles.success}>
          <View style={styles.check}>
            <Icon name="check" size={34} color={Palette.white} />
          </View>
          <Text style={styles.h6}>Details</Text>
          <Text style={styles.p}>Your profile has been sent to admin for review. Thank you for your patience!</Text>
          <Btn
            title="Okay"
            variant="customBtn3"
            style={{ marginTop: Spacing.xl }}
            onPress={() => {
              seller.setStatus('review');
              setDone(false);
              router.replace('/profile' as any);
            }}
          />
        </View>
      </AppModal>
    </View>
  );
}

function Heading({ title, href }: { title: string; href: string }) {
  return (
    <View style={styles.headingPanel}>
      <Text style={styles.h3}>{title}</Text>
      <Pressable onPress={() => router.push(href as any)} style={styles.edit} hitSlop={6}>
        <Icon name="pen" size={12} color={Palette.secondary} />
        <Text style={styles.editText}>Edit</Text>
      </Pressable>
    </View>
  );
}

function DocThumb({ uri }: { uri: string | null }) {
  return (
    <View style={styles.thumb}>
      {uri ? (
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <Image source={require('@/assets/images/document.png')} style={{ width: 40, height: 40, opacity: 0.6 }} resizeMode="contain" />
      )}
    </View>
  );
}

function Info({ icon, text, link }: { icon: any; text: string; link?: boolean }) {
  return (
    <View style={styles.info}>
      <View style={styles.infoIcon}>
        <Image source={icon} style={{ width: 14, height: 15, tintColor: Palette.primary }} resizeMode="contain" />
      </View>
      <Text style={[styles.infoText, link && { color: Palette.secondary }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.backgroundPage },
  container: { width: '100%', maxWidth: 1320, alignSelf: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing['4xl'] },
  title: { color: Palette.primary, fontSize: FontSizes['3xl'], fontWeight: FontWeights.medium, marginBottom: Spacing.lg },
  headingPanel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xl, marginBottom: Spacing.md },
  h3: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  edit: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  editText: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  box: { backgroundColor: Palette.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.borderSoft, padding: Spacing.lg, gap: Spacing.lg },
  docCol: { flex: 1, paddingHorizontal: Spacing.sm },
  colBorder: { borderRightWidth: 1, borderRightColor: Palette.divider },
  label: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.medium, marginBottom: 8 },
  docRow: { flexDirection: 'row', gap: Spacing.md },
  thumb: {
    flex: 1,
    height: 110,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.divider,
    backgroundColor: Palette.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  infoCol: { gap: 14, paddingHorizontal: Spacing.sm },
  info: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: Palette.surfaceIce, alignItems: 'center', justifyContent: 'center' },
  infoText: { flex: 1, color: Palette.textBody, fontSize: FontSizes.sm },
  warn: { color: Palette.error, fontSize: FontSizes.sm, marginTop: Spacing.xl },
  success: { alignItems: 'center', paddingVertical: Spacing.lg },
  check: { width: 72, height: 72, borderRadius: 36, backgroundColor: Palette.success, alignItems: 'center', justifyContent: 'center' },
  h6: { marginTop: Spacing.lg, color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  p: { marginTop: 6, color: Palette.textSecondary, fontSize: FontSizes.sm, textAlign: 'center', lineHeight: 21 },
});
