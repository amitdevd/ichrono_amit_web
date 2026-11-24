import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { CenterFrame, ResTitle } from './DealerFrames';
import Field from '@/components/common/Field';
import Btn from '@/components/common/Btn';

/**
 * `OTP Verification` card shared by
 *  - dealer/auth/registrationStepTwo.blade.php (email OTP while signing up)
 *  - dealer/auth/verifyOTP.blade.php           (forgot password OTP)
 */
export default function DealerOtpScreen({
  sentTo,
  backHref,
  onVerified,
}: {
  sentTo: string;
  backHref: string;
  onVerified: () => void;
}) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const verify = () => {
    if (!/^\d{4}$/.test(otp)) return setError('Please enter the 4-digit OTP.');
    onVerified();
  };

  return (
    <CenterFrame>
      <ResTitle title="OTP Verification">
        A 4-digit OTP has been sent{'\n'}to <Text style={styles.gold}>{sentTo || 'your email'}</Text>
      </ResTitle>
      <Field
        label="Enter OTP"
        placeholder="Enter OTP here"
        value={otp}
        onChangeText={(t) => {
          setOtp(t.replace(/\D/g, ''));
          setError('');
        }}
        maxLength={4}
        keyboardType="number-pad"
        error={error}
        variant="dealer"
      />
      <View style={styles.resendRow}>
        {seconds > 0 ? (
          <Text style={styles.muted}>Resend OTP in 00:{seconds < 10 ? `0${seconds}` : seconds}</Text>
        ) : (
          <Pressable onPress={() => setSeconds(30)}>
            <Text style={styles.gold}>Resend OTP</Text>
          </Pressable>
        )}
        <Text style={styles.muted}>Demo: any 4 digits</Text>
      </View>
      <View style={styles.btns}>
        <Btn title="Back" variant="dark" onPress={() => router.replace(backHref as any)} style={{ flex: 1 }} />
        <Btn title="Verify" variant="success" onPress={verify} style={{ flex: 1 }} />
      </View>
    </CenterFrame>
  );
}

const styles = StyleSheet.create({
  gold: { color: Palette.secondary, fontWeight: FontWeights.semibold },
  muted: { color: Palette.textMuted, fontSize: FontSizes.xs },
  resendRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  btns: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing['3xl'] },
});
