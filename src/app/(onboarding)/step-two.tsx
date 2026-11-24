import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import Btn from '@/components/common/Btn';
import { ErrorLine, OnboardingFrame, OptionGrid, useOnboarding } from '@/components/web/OnboardingFrame';

/** backend_ref/views/user/setting/steptwo.blade.php */
const COUNTS = ['0', '01-05', '06-10', '11-20', '21-50', '>50'].map((key) => ({ key }));

export default function StepTwo() {
  const { answers, update } = useOnboarding();
  const [error, setError] = useState('');
  return (
    <OnboardingFrame
      step={2}
      question="How many Watches do you own?"
      description="Our users have added more than one million watches to their watch collection."
    >
      <OptionGrid
        options={COUNTS}
        selected={answers.watchCount ? [answers.watchCount] : []}
        onToggle={(k) => {
          setError('');
          update({ watchCount: k });
        }}
      />
      <ErrorLine>{error}</ErrorLine>
      <View style={styles.btns}>
        <Btn title="Back" variant="customBtn4" style={{ flex: 1, width: 'auto' }} onPress={() => router.replace('/(onboarding)/step-one' as any)} />
        <Btn
          title="Next"
          variant="customBtn3"
          style={{ flex: 1, width: 'auto' }}
          onPress={() => (answers.watchCount ? router.push('/(onboarding)/step-three' as any) : setError('Please select one option.'))}
        />
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({ btns: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing['2xl'] } });
