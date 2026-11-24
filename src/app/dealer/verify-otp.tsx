import { router, useLocalSearchParams } from 'expo-router';
import DealerOtpScreen from '@/components/dealer/DealerOtpScreen';
import { useDealerSignup } from '@/context/dealer-signup';

/** Dealer Create Account – Step 2: email OTP (registrationStepTwo.blade.php) */
export default function DealerVerifyEmailOtp() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { data } = useDealerSignup();
  return (
    <DealerOtpScreen
      sentTo={email || data.email}
      backHref="/dealer/register"
      onVerified={() => router.push('/dealer/step-three' as any)}
    />
  );
}
