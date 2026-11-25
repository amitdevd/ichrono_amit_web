import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LOGO, LOGO_BG } from '@/constants/brand';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useBreakpoint } from '@ichrono/ui';

/**
 * Page frames for the dealer auth screens (backend_ref/views/dealer/auth/*):
 *  - SignupFrame  : `.signup-header` logo + `.create-panel` with the 5-dot `.step-indicator`
 *  - CenterFrame  : `.login-wapper > .login-grid-reset` single centered card (OTP / reset)
 *  - SplitFrame   : `.login-grid` teal logo panel + form (login / forgot password)
 */

function SignupHeader() {
  return (
    <View style={s.signupHeader}>
      <Pressable onPress={() => router.push('/dealer/login' as any)}>
        <Image source={LOGO} style={s.headerLogo} resizeMode="contain" />
      </Pressable>
    </View>
  );
}

export function StepIndicator({ step, total = 5 }: { step: number; total?: number }) {
  return (
    <View style={s.stepRow} accessibilityLabel={`Step ${step} of ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <React.Fragment key={n}>
            {i > 0 ? <View style={[s.stepLine, n <= step && s.stepLineOn]} /> : null}
            <View style={[s.stepCircle, (done || active) && s.stepCircleOn, active && s.stepCircleActive]}>
              <Text style={[s.stepNum, (done || active) && { color: Palette.white }]}>{n}</Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

export function SignupFrame({ step, children }: { step?: number; children: React.ReactNode }) {
  return (
    <View style={s.screen}>
      <SignupHeader />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.createPanel}>
            {step ? <StepIndicator step={step} /> : null}
            <View style={s.card}>{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/** `.boxstep` – card heading + "Already have an account? Login" */
export function BoxStep({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={s.boxstep}>
      <Text style={s.boxTitle}>{title}</Text>
      {subtitle ? (
        <Text style={s.alaccount}>{subtitle}</Text>
      ) : (
        <Pressable onPress={() => router.push('/dealer/login' as any)}>
          <Text style={s.alaccount}>
            Already have an account? <Text style={s.emailTitle}>Login</Text>
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export function CenterFrame({ children, withHeader = true }: { children: React.ReactNode; withHeader?: boolean }) {
  return (
    <View style={s.screen}>
      {withHeader ? <SignupHeader /> : null}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[s.scroll, { justifyContent: 'center', flexGrow: 1 }]} keyboardShouldPersistTaps="handled">
          <View style={[s.card, { maxWidth: 560, width: '100%', alignSelf: 'center' }]}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export function SplitFrame({ children }: { children: React.ReactNode }) {
  const { lgUp } = useBreakpoint();
  return (
    <View style={s.screen}>
      <ScrollView contentContainerStyle={[s.scroll, { justifyContent: 'center', flexGrow: 1 }]} keyboardShouldPersistTaps="handled">
        <View style={[s.split, lgUp && { flexDirection: 'row' }]}>
          <View style={[s.splitImg, lgUp && { width: '45%', minHeight: 480 }]}>
            <Image source={LOGO} style={s.splitLogo} resizeMode="contain" />
          </View>
          <View style={[s.splitContent, lgUp && { width: '55%', padding: Spacing['4xl'] }]}>{children}</View>
        </View>
      </ScrollView>
    </View>
  );
}

/** `.res-title` centered heading + paragraph (OTP / reset screens) */
export function ResTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <View style={s.resTitle}>
      <Text style={s.resH2}>{title}</Text>
      {children ? <Text style={s.resP}>{children}</Text> : null}
    </View>
  );
}

export const dealerText = StyleSheet.create({
  emailTitle: { color: Palette.secondary, fontWeight: FontWeights.semibold },
  sectionTitle: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
});

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.backgroundPage },
  signupHeader: {
    backgroundColor: LOGO_BG,
    paddingVertical: 14,
    alignItems: 'center',
  },
  headerLogo: { width: 120, height: 50 },
  scroll: { padding: Spacing.lg, paddingBottom: 60 },
  createPanel: { width: '100%', maxWidth: 720, alignSelf: 'center' },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.md,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Palette.loginBack,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleOn: { backgroundColor: Palette.secondary, borderColor: Palette.secondary },
  stepCircleActive: {
    shadowColor: Palette.secondary,
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  stepNum: { fontSize: FontSizes.xs, fontWeight: FontWeights.bold, color: Palette.loginBack },
  stepLine: { flex: 1, maxWidth: 90, height: 2, backgroundColor: Palette.borderMedium },
  stepLineOn: { backgroundColor: Palette.secondary },
  card: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.borderSoft,
    padding: Spacing['2xl'],
    shadowColor: Palette.primary,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  boxstep: { alignItems: 'center', marginBottom: Spacing['2xl'] },
  boxTitle: { color: Palette.primary, fontSize: 26, fontWeight: FontWeights.bold },
  alaccount: { marginTop: 6, color: Palette.textSecondary, fontSize: FontSizes.sm },
  emailTitle: { color: Palette.secondary, fontWeight: FontWeights.semibold },
  split: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    backgroundColor: Palette.white,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: Palette.loginBack,
    overflow: 'hidden',
  },
  splitImg: {
    backgroundColor: LOGO_BG,
    padding: Spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
  },
  splitLogo: { width: 260, height: 107 },
  splitContent: { padding: Spacing['3xl'], justifyContent: 'center' },
  resTitle: { alignItems: 'center', marginBottom: Spacing['2xl'] },
  resH2: { color: Palette.primary, fontSize: 28, fontWeight: FontWeights.bold, textAlign: 'center' },
  resP: { marginTop: 8, color: Palette.textSecondary, fontSize: FontSizes.md, textAlign: 'center', lineHeight: 22 },
});
