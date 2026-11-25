import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { OnboardingFrame, useOnboarding } from '@/components/user/OnboardingFrame';
import { Btn, Field } from '@ichrono/ui';

/** backend_ref/views/user/setting/stepfour.blade.php */
export default function StepFour() {
  const { answers, update } = useOnboarding();
  const [errors, setErrors] = useState<{ first?: string; last?: string }>({});
  const letters = (t: string) => t.replace(/[^A-Za-z ]/g, '');

  const next = () => {
    const e: typeof errors = {};
    if (!answers.firstName.trim()) e.first = 'First name is required.';
    if (!answers.lastName.trim()) e.last = 'Last name is required.';
    setErrors(e);
    if (!Object.keys(e).length) router.push('/(onboarding)/step-five' as any);
  };

  return (
    <OnboardingFrame step={4} question="What should we call you?" description="Please enter your first and last name so we know how to address you.">
      <Field label="First Name" required placeholder="Enter first name" value={answers.firstName} autoCapitalize="words"
        onChangeText={(t) => { update({ firstName: letters(t) }); setErrors((x) => ({ ...x, first: undefined })); }} error={errors.first} />
      <Field label="Last Name" required placeholder="Enter last name" value={answers.lastName} autoCapitalize="words"
        onChangeText={(t) => { update({ lastName: letters(t) }); setErrors((x) => ({ ...x, last: undefined })); }} error={errors.last} />
      <View style={styles.btns}>
        <Btn title="Back" variant="customBtn4" style={{ flex: 1, width: 'auto' }} onPress={() => router.replace('/(onboarding)/step-three' as any)} />
        <Btn title="Next" variant="customBtn3" style={{ flex: 1, width: 'auto' }} onPress={next} />
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({ btns: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.lg } });
