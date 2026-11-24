import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import Btn from '@/components/common/Btn';
import AppModal from '@/components/common/AppModal';
import { Radio } from '@/components/common/Controls';
import { ErrorLine, OnboardingFrame, useOnboarding } from '@/components/web/OnboardingFrame';

/** backend_ref/views/user/setting/stepfive.blade.php (+ .submitSucces modal) */
const GENDERS = [
  { key: 'male', label: 'Male', image: require('@/assets/images/male.webp') },
  { key: 'female', label: 'Female', image: require('@/assets/images/female.webp') },
  { key: 'other', label: 'Other', image: require('@/assets/images/other.webp') },
];

export default function StepFive() {
  const { answers, update } = useOnboarding();
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  return (
    <OnboardingFrame
      step={5}
      question="What gender do you identify as?"
      description="Please select your gender so we will be able to recommend the right watches for you."
    >
      <View style={styles.selectGender}>
        {GENDERS.map((g, i) => (
          <Pressable
            key={g.key}
            onPress={() => {
              update({ gender: g.key });
              setError('');
            }}
            style={[styles.row, i < GENDERS.length - 1 && styles.rowBorder]}
          >
            <View style={styles.left}>
              <Image source={g.image} style={{ width: 36, height: 37 }} />
              <Text style={styles.label}>{g.label}</Text>
            </View>
            <Radio checked={answers.gender === g.key} onPress={() => update({ gender: g.key })} />
          </Pressable>
        ))}
      </View>
      <ErrorLine>{error}</ErrorLine>
      <View style={styles.btns}>
        <Btn title="Back" variant="customBtn4" style={{ flex: 1, width: 'auto' }} onPress={() => router.replace('/(onboarding)/step-four' as any)} />
        <Btn
          title="Submit"
          variant="customBtn3"
          style={{ flex: 1, width: 'auto' }}
          onPress={() => (answers.gender ? setDone(true) : setError('Please select your gender.'))}
        />
      </View>

      <AppModal visible={done} onClose={() => setDone(false)} width={440}>
        <View style={styles.success}>
          <Image source={require('@/assets/images/success.webp')} style={{ width: 66, height: 67 }} />
          <Text style={styles.h6}>Great! You’re all set</Text>
          <Text style={styles.p}>Now enjoy the immersive experience and the world’s premium watch market.</Text>
          <Btn
            title="Okay, Got it"
            variant="customBtn3"
            style={{ marginTop: Spacing.xl }}
            onPress={() => {
              setDone(false);
              router.replace('/home' as any);
            }}
          />
        </View>
      </AppModal>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  selectGender: { borderWidth: 1, borderColor: Palette.loginBack, borderRadius: Radius.lg, paddingHorizontal: Spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Palette.divider },
  left: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  label: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.medium },
  btns: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing['2xl'] },
  success: { alignItems: 'center', paddingVertical: Spacing.lg },
  h6: { marginTop: Spacing.lg, color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  p: { marginTop: 6, color: Palette.textSecondary, fontSize: FontSizes.sm, textAlign: 'center', lineHeight: 21 },
});
