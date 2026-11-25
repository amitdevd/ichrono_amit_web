import React from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LOGO, LOGO_BG } from '@/constants/brand';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useBreakpoint } from '@ichrono/ui';

/**
 * Admin auth pages – backend_ref/views/admin/setting/*.blade.php
 *  LoginFrame : `.loginBackground.authbg > .login-container .row`
 *               col-lg-6 `.logoDiv` (logo) + col-lg-6 `.loginBackgroundeffect` card
 *  CardFrame  : `.loginBackground.innerloginBackground.forgotPass` single centred card
 */
export function AdminLoginFrame({ children }: { children: React.ReactNode }) {
  const { lgUp } = useBreakpoint();
  return (
    <View style={styles.bg}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={[styles.container, lgUp && { flexDirection: 'row', alignItems: 'center' }]}>
            <View style={[styles.logoDiv, lgUp && { width: '50%' }]}>
              <Image
                source={LOGO}
                style={[styles.logo, !lgUp && { width: 220, height: 91 }]}
                resizeMode="contain"
              />
            </View>
            <View style={[styles.loginCol, lgUp && { width: '50%' }]}>
              <View style={styles.effect}>{children}</View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export function AdminCardFrame({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bg}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Image source={LOGO} style={styles.smallLogo} resizeMode="contain" />
          <View style={[styles.effect, { maxWidth: 560, alignSelf: 'center' }]}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export function AdminH({ children, sub }: { children: string; sub?: string }) {
  return (
    <View style={{ marginBottom: Spacing['2xl'] }}>
      <Text style={styles.h2}>{children}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: LOGO_BG },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  container: { width: '100%', maxWidth: 1140, alignSelf: 'center', gap: Spacing['3xl'] },
  logoDiv: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xl },
  logo: { width: 360, height: 148 },
  smallLogo: { width: 200, height: 82, alignSelf: 'center', marginBottom: Spacing['2xl'] },
  loginCol: { alignItems: 'center' },
  effect: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: Palette.white,
    borderRadius: Radius['2xl'],
    paddingHorizontal: Spacing['3xl'],
    paddingVertical: Spacing['4xl'],
    shadowColor: Palette.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
  },
  h2: { color: Palette.primary, fontSize: 30, fontWeight: FontWeights.semibold, textAlign: 'center' },
  sub: {
    color: Palette.textSecondary,
    fontSize: FontSizes.md,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
