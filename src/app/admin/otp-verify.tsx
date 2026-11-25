import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { AdminCardFrame, AdminH } from '@/components/admin/AdminAuthFrame';
import { OtpInput, Btn } from '@ichrono/ui';

/** backend_ref/views/admin/setting/otp_verify.blade.php */
export default function AdminOtpVerifyScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const submit = () => {
    if (!/^\d{4}$/.test(otp)) return setError('The otp field is required.');
    router.push({ pathname: '/admin/create-password' as any, params: { email: email ?? '' } });
  };

  return (
    <AdminCardFrame>
      <AdminH sub="4 Digit OTP has been sent to your registered Mail Id">OTP Verification</AdminH>
      {error ? <Text style={styles.danger}>{error}</Text> : null}
      <Text style={styles.label}>Enter OTP</Text>
      <OtpInput
        length={4}
        value={otp}
        onChange={(c) => {
          setOtp(c);
          setError('');
        }}
      />
      <View style={styles.resend}>
        <Pressable
          disabled={seconds > 0}
          onPress={() => setSeconds(30)}
          style={[styles.resendBtn, seconds > 0 && { opacity: 0.55 }]}
        >
          <Text style={styles.resendText}>Resend OTP</Text>
        </Pressable>
        {seconds > 0 ? <Text style={styles.timer}>in {seconds} Secs</Text> : null}
      </View>
      <Btn title="Submit" variant="customBtn" onPress={submit} style={{ height: 48 }} />
      <Text style={styles.demo}>Demo: any 4 digits</Text>
    </AdminCardFrame>
  );
}

const styles = StyleSheet.create({
  danger: { color: Palette.error, textAlign: 'center', marginBottom: Spacing.md },
  label: { textAlign: 'center', color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.medium, marginBottom: Spacing.md },
  resend: { alignItems: 'center', marginTop: Spacing['2xl'], marginBottom: Spacing['2xl'], gap: 6 },
  resendBtn: { backgroundColor: Palette.surfaceSubtle, borderRadius: Radius.sm, paddingHorizontal: 16, paddingVertical: 8 },
  resendText: { color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  timer: { color: Palette.textSecondary, fontSize: FontSizes.sm },
  demo: { textAlign: 'center', color: Palette.textMuted, fontSize: FontSizes.xs, marginTop: Spacing.md },
});
