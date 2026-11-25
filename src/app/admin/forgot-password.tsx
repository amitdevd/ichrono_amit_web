import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { AdminCardFrame, AdminH } from '@/components/admin/AdminAuthFrame';
import { Field, Btn } from '@ichrono/ui';

/** backend_ref/views/admin/setting/forget.blade.php */
export default function AdminForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!email.trim()) return setError('The email field is required.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('The email must be a valid email address.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({ pathname: '/admin/otp-verify' as any, params: { email } });
    }, 500);
  };

  return (
    <AdminCardFrame>
      <AdminH sub="Please Enter your registered email address, We'll send a 4 digit OTP to verify that you're real">
        Reset Password
      </AdminH>
      <Field
        label="Enter Email Id"
        placeholder="Enter Email"
        value={email}
        onChangeText={(t) => {
          setEmail(t.replace(/\s/g, ''));
          setError('');
        }}
        keyboardType="email-address"
        error={error}
      />
      <Btn title="Submit" variant="customBtn" loading={loading} onPress={submit} style={{ height: 48, marginTop: Spacing['2xl'] }} />
      <Pressable onPress={() => router.replace('/admin/login' as any)} style={styles.back}>
        <Text style={styles.backText}>Back to Login</Text>
      </Pressable>
    </AdminCardFrame>
  );
}

const styles = StyleSheet.create({
  back: { alignItems: 'center', marginTop: Spacing.xl },
  backText: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
});
