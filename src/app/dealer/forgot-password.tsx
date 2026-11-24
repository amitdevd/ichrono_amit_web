import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { SplitFrame } from '@/components/dealer/DealerFrames';
import Field from '@/components/common/Field';
import Btn from '@/components/common/Btn';

/** backend_ref/views/dealer/auth/forgotPassword.blade.php */
export default function DealerForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!email.trim()) return setError('The email field is required.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({ pathname: '/dealer/reset-otp' as any, params: { email } });
    }, 500);
  };

  return (
    <SplitFrame>
      <Text style={styles.h2}>Forgot Password ?</Text>
      <Text style={styles.p}>Please enter your registered email address.</Text>
      <Field
        label="Email Address"
        placeholder="Enter Registered Email Address"
        value={email}
        onChangeText={(t) => {
          setEmail(t.replace(/\s/g, ''));
          setError('');
        }}
        keyboardType="email-address"
        error={error}
        variant="dealer"
      />
      <Btn title="Reset Password" variant="success" loading={loading} onPress={submit} style={{ marginTop: Spacing['2xl'] }} />
      <View style={styles.backRow}>
        <Text style={styles.muted}>Remember your password? </Text>
        <Pressable onPress={() => router.replace('/dealer/login' as any)}>
          <Text style={styles.gold}>Login</Text>
        </Pressable>
      </View>
    </SplitFrame>
  );
}

const styles = StyleSheet.create({
  h2: { color: Palette.primary, fontSize: 28, fontWeight: FontWeights.bold },
  p: { color: Palette.textSecondary, fontSize: FontSizes.md, marginTop: 6, marginBottom: Spacing['2xl'] },
  backRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  muted: { color: Palette.textSecondary, fontSize: FontSizes.sm },
  gold: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.bold },
});
