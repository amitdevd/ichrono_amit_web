import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { AuthText, AuthTitle, UserAuthFrame } from '@/components/user/UserAuthFrame';
import { Field, Btn } from '@ichrono/ui';

/**
 * user/setting/otp-verify.blade.php        (mode=register → onboarding questions)
 * user/setting/registerotpverify.blade.php (mode=forgot   → create password)
 */
export default function UserOtpVerifyScreen() {
  const params = useLocalSearchParams<{ email?: string; mode?: string; fromRegister?: string }>();
  const isRegister = params.mode === 'register' || params.fromRegister === '1';
  const email = params.email || 'your email address';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const verify = () => {
    if (!otp) return setError('Please enter otp here');
    if (!/^\d{4}$/.test(otp)) return setError('Please enter the 4-digit OTP.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isRegister) router.replace('/(onboarding)/step-one' as any);
      else router.replace({ pathname: '/(auth)/create-password' as any, params: { email: params.email ?? '' } });
    }, 500);
  };

  return (
    <UserAuthFrame>
      <AuthTitle backHref={isRegister ? '/(auth)/register' : '/(auth)/login'}>OTP Verification</AuthTitle>
      <AuthText>
        A 4-digit OTP has been sent to <Text style={styles.email}>{email}</Text>
      </AuthText>
      <Field
        label="Email OTP"
        placeholder="Enter OTP here"
        value={otp}
        onChangeText={(t) => {
          setOtp(t.replace(/\D/g, ''));
          setError('');
        }}
        maxLength={4}
        keyboardType="number-pad"
        error={error}
      />
      <Pressable disabled={seconds > 0} onPress={() => setSeconds(30)} style={styles.receive}>
        <Text style={styles.receiveText}>
          Tap to receive again <Text style={styles.gold}>OTP</Text>
          {seconds > 0 ? <Text style={styles.timer}>{`  00:${seconds < 10 ? '0' : ''}${seconds}`}</Text> : null}
        </Text>
      </Pressable>
      <Btn title="Verify" variant="customBtn3" loading={loading} onPress={verify} />
      <Text style={styles.demo}>Demo: any 4 digits</Text>
    </UserAuthFrame>
  );
}

const styles = StyleSheet.create({
  email: { color: Palette.secondary },
  receive: { alignItems: 'center', marginTop: Spacing['3xl'], marginBottom: Spacing.xl },
  receiveText: { color: Palette.textSecondary, fontSize: FontSizes.sm },
  gold: { color: Palette.secondary, fontWeight: FontWeights.semibold },
  timer: { color: Palette.primary, fontWeight: FontWeights.semibold },
  demo: { textAlign: 'center', color: Palette.textMuted, fontSize: FontSizes.xs, marginTop: Spacing.md },
});
