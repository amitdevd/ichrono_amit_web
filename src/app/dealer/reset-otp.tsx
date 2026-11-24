import { router, useLocalSearchParams } from 'expo-router';
import DealerOtpScreen from '@/components/dealer/DealerOtpScreen';

/** Dealer forgot password – OTP (verifyOTP.blade.php) */
export default function DealerResetOtp() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  return (
    <DealerOtpScreen
      sentTo={email ?? ''}
      backHref="/dealer/forgot-password"
      onVerified={() => router.push({ pathname: '/dealer/reset-password' as any, params: { email: email ?? '' } })}
    />
  );
}
