import React, { useState } from 'react';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import Btn from '@/components/common/Btn';
import { ErrorLine, OnboardingFrame, OptionGrid, useOnboarding } from '@/components/web/OnboardingFrame';

/** backend_ref/views/user/setting/stepone.blade.php */
const OPTIONS = [
  { key: 'Beginner', image: require('@/assets/images/beginner.webp') },
  { key: 'Collector', image: require('@/assets/images/collector.webp') },
  { key: 'Expert', image: require('@/assets/images/expert.webp') },
  { key: 'Blogger', image: require('@/assets/images/blogger.webp') },
  { key: 'Commercial Dealer', image: require('@/assets/images/commercial-deller.webp') },
  { key: 'Private Seller', image: require('@/assets/images/private-sell.webp') },
];

export default function StepOne() {
  const { answers, update } = useOnboarding();
  const [error, setError] = useState('');
  const toggle = (k: string) => {
    setError('');
    update({
      enthusiast: answers.enthusiast.includes(k) ? answers.enthusiast.filter((x) => x !== k) : [...answers.enthusiast, k],
    });
  };
  return (
    <OnboardingFrame
      step={1}
      question="What kind of watch enthusiast are you?"
      description="You may select more than one. We would like to get to know you and your relationship with watches a bit better so we can provide you with more personalized content."
    >
      <OptionGrid options={OPTIONS} selected={answers.enthusiast} onToggle={toggle} />
      <ErrorLine>{error}</ErrorLine>
      <Btn
        title="Next"
        variant="customBtn3"
        style={{ marginTop: Spacing['2xl'] }}
        onPress={() => (answers.enthusiast.length ? router.push('/(onboarding)/step-two' as any) : setError('Please select at least one option.'))}
      />
    </OnboardingFrame>
  );
}
