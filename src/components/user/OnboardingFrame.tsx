import React, { createContext, useContext, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { UserAuthHeader } from './UserAuthFrame';

/**
 * Shared pieces for the 5 "Hey There" onboarding questions
 * (backend_ref/views/user/setting/stepone … stepfive.blade.php).
 */
export type OnboardingAnswers = {
  enthusiast: string[];
  watchCount: string;
  interests: string[];
  firstName: string;
  lastName: string;
  gender: string;
};

const Ctx = createContext<{
  answers: OnboardingAnswers;
  update: (p: Partial<OnboardingAnswers>) => void;
} | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    enthusiast: [],
    watchCount: '',
    interests: [],
    firstName: '',
    lastName: '',
    gender: '',
  });
  const value = useMemo(() => ({ answers, update: (p: Partial<OnboardingAnswers>) => setAnswers((a) => ({ ...a, ...p })) }), [answers]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOnboarding() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return c;
}

export function OnboardingFrame({
  step,
  question,
  description,
  children,
}: {
  step: number;
  question: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.screen}>
      <UserAuthHeader />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.loginContent}>
          <Text style={styles.h3}>Hey There</Text>
          <Text style={styles.p}>Just answer the 5 questions to get a seamless experience and best recommendations</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(step / 5) * 100}%` }]} />
          </View>
          <View style={styles.info}>
            <Text style={styles.infoText}>Questions</Text>
            <Text style={styles.infoText}>{step} of 5</Text>
          </View>
          <Text style={styles.question}>{question}</Text>
          <Text style={styles.desc}>{description}</Text>
          {children}
        </View>
      </ScrollView>
    </View>
  );
}

/** `.options-grid > .option-box` – image/text tile with active state */
export function OptionGrid({
  options,
  selected,
  onToggle,
}: {
  options: { key: string; label?: string; image?: any }[];
  selected: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <View style={styles.grid}>
      {options.map((o) => {
        const on = selected.includes(o.key);
        return (
          <Pressable
            key={o.key}
            onPress={() => onToggle(o.key)}
            style={({ hovered }: any) => [styles.box, on && styles.boxOn, !on && hovered && styles.boxHover]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
          >
            {o.image ? (
              <View style={[styles.imgCircle, on && { backgroundColor: Palette.secondary }]}>
                <Image source={o.image} style={{ width: 34, height: 34 }} resizeMode="contain" />
              </View>
            ) : null}
            <Text style={[o.image ? styles.boxLabel : styles.boxNumber, on && { color: Palette.white }]}>{o.label ?? o.key}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ErrorLine({ children }: { children?: string }) {
  return children ? <Text style={styles.error}>{children}</Text> : null;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.backgroundPage },
  scroll: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing['4xl'], alignItems: 'center' },
  loginContent: {
    maxWidth: 660,
    width: '100%',
    backgroundColor: Palette.white,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: Palette.loginBack,
    paddingHorizontal: Spacing['3xl'],
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing['4xl'],
  },
  h3: { fontSize: FontSizes['3xl'], fontWeight: FontWeights.medium, color: Palette.primary },
  p: { fontSize: FontSizes.xs, lineHeight: 22, fontWeight: FontWeights.medium, color: Palette.textSecondary, marginTop: 2 },
  track: { height: 6, borderRadius: 3, backgroundColor: Palette.borderSoft, marginTop: Spacing.xl, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Palette.secondary, borderRadius: 3 },
  info: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  infoText: { fontSize: FontSizes.xs, color: Palette.textSecondary, fontWeight: FontWeights.medium },
  question: { marginTop: Spacing['2xl'], fontSize: FontSizes.xl, fontWeight: FontWeights.semibold, color: Palette.primary },
  desc: { marginTop: 6, marginBottom: Spacing.xl, fontSize: FontSizes.sm, lineHeight: 21, color: Palette.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  box: {
    flexBasis: '31%',
    flexGrow: 1,
    minWidth: 150,
    height: 110,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.loginBack,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.white,
  },
  boxHover: { backgroundColor: Palette.surfaceIce },
  boxOn: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  imgCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxLabel: { color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  boxNumber: { color: Palette.primary, fontSize: FontSizes['2xl'], fontWeight: FontWeights.semibold },
  error: { color: Palette.error, fontSize: FontSizes.xs, marginTop: Spacing.sm },
});
