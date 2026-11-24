import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LOGO_BG } from '@/constants/brand';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/use-breakpoint';

/** backend_ref/views/user/layout/footer.blade.php */
export default function WebFooter() {
  const { lgUp, mdUp } = useBreakpoint();
  return (
    <View style={styles.footer}>
      <View style={[styles.container, styles.top, lgUp && { flexDirection: 'row' }]}>
        {/* col-lg-4 */}
        <View style={[lgUp ? { width: '33%' } : null]}>
          <Image source={require('@/assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.p}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </Text>
          <View style={[styles.contacts, !mdUp && { flexDirection: 'column' }]}>
            {[0, 1].map((i) => (
              <View key={i} style={styles.adminContent}>
                <View style={styles.callIcon}>
                  <Image source={require('@/assets/images/call.png')} style={{ width: 18, height: 19 }} />
                </View>
                <View>
                  <Text style={styles.h6}>Mobile Number</Text>
                  <Text style={styles.small}>+96-8282727882</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* col-lg-6 middleContent */}
        <View style={[styles.middle, lgUp && { width: '42%', justifyContent: 'center' }]}>
          <LinkList title="Quick Links" items={['Buy a Watch', 'Sell a Watch', 'I-CHRONO Plus', 'FAQs']} />
          <LinkList title="Know More" items={['About Us', 'Support', 'Terms of Use', 'Privacy Policy']} />
        </View>

        {/* col-lg-2 */}
        <View style={lgUp ? { width: '17%' } : null}>
          <Text style={styles.h5}>Get the App</Text>
          <View style={[styles.apps, !lgUp && { flexDirection: 'row' }]}>
            <Pressable>
              <Image source={require('@/assets/images/play-store.png')} style={styles.store} resizeMode="contain" />
            </Pressable>
            <Pressable>
              <Image source={require('@/assets/images/ios-app.png')} style={styles.store} resizeMode="contain" />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={[styles.down, !mdUp && { flexDirection: 'column', alignItems: 'flex-start', gap: Spacing.lg }]}>
          <View>
            <Text style={styles.downTitle}>We are on social</Text>
            <View style={styles.social}>
              <SocialIcon src={require('@/assets/images/Instagram.png')} />
              <SocialIcon src={require('@/assets/images/facebook2.png')} />
              <SocialIcon src={require('@/assets/images/x.png')} />
            </View>
          </View>
          <View>
            <Text style={styles.downTitle}>Payment Method</Text>
            <View style={styles.social}>
              <PayIcon src={require('@/assets/images/ms_card.png')} />
              <PayIcon src={require('@/assets/images/visa.png')} />
              <PayIcon src={require('@/assets/images/am_exp.png')} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function LinkList({ title, items }: { title: string; items: string[] }) {
  return (
    <View>
      <Text style={styles.h5}>{title}</Text>
      {items.map((i) => (
        <Pressable key={i} style={{ paddingVertical: 6 }}>
          {({ hovered }: any) => <Text style={[styles.li, hovered && { color: Palette.fourth }]}>{i}</Text>}
        </Pressable>
      ))}
    </View>
  );
}

function SocialIcon({ src }: { src: any }) {
  return (
    <Pressable style={styles.socialBtn}>
      <Image source={src} style={{ width: 18, height: 18 }} resizeMode="contain" />
    </Pressable>
  );
}

function PayIcon({ src }: { src: any }) {
  return (
    <View style={styles.payBtn}>
      <Image source={src} style={{ width: 38, height: 24 }} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: LOGO_BG, paddingTop: Spacing['4xl'] },
  container: { width: '100%', maxWidth: 1320, alignSelf: 'center', paddingHorizontal: Spacing.lg },
  top: { gap: Spacing['3xl'], paddingBottom: Spacing['4xl'] },
  logo: { width: 200, height: 60, marginBottom: Spacing.md },
  p: { color: 'rgba(255,255,255,0.75)', fontSize: FontSizes.sm, lineHeight: 22 },
  contacts: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.xl },
  adminContent: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  callIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h6: { color: Palette.white, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  small: { color: 'rgba(255,255,255,0.75)', fontSize: FontSizes.sm, marginTop: 2 },
  middle: { flexDirection: 'row', gap: 80 },
  h5: { color: Palette.fourth, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold, marginBottom: Spacing.md },
  li: { color: 'rgba(255,255,255,0.85)', fontSize: FontSizes.md },
  apps: { gap: Spacing.md },
  store: { width: 162, height: 48 },
  down: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingVertical: Spacing.xl,
  },
  downTitle: { color: Palette.white, fontSize: FontSizes.sm, marginBottom: 8 },
  social: { flexDirection: 'row', gap: 10 },
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtn: { backgroundColor: Palette.white, borderRadius: Radius.xs, paddingHorizontal: 6, paddingVertical: 4 },
});
