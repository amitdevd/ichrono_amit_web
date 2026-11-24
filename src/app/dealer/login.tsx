import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { SplitFrame } from '@/components/dealer/DealerFrames';
import Field from '@/components/common/Field';
import Btn from '@/components/common/Btn';
import Icon from '@/components/common/Icon';
import { useAuth } from '@/context/auth-context';
import { useBreakpoint } from '@/hooks/use-breakpoint';

/** backend_ref/views/dealer/auth/login.blade.php */
export default function DealerLoginScreen() {
  const { login, isLoading } = useAuth();
  const { isMobile } = useBreakpoint();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const submit = async () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'The email field is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'The email must be a valid email address.';
    if (!password) e.password = 'The password field is required.';
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      await login(email, password, 'dealer');
      router.replace('/dealer/dashboard' as any);
    } catch {
      setErrors({ general: 'Invalid credentials' });
    }
  };

  return (
    <SplitFrame>
      <Text style={[styles.h1, isMobile && { fontSize: 24 }]}>
        Welcome To <Text style={styles.gold}>I-CHRONO</Text>
      </Text>
      <Text style={styles.h2}>Login</Text>
      {errors.general ? <Text style={styles.danger}>{errors.general}</Text> : null}

      <Field
        placeholder="Enter Registered Email Address"
        value={email}
        onChangeText={(t) => {
          setEmail(t.replace(/\s/g, ''));
          setErrors((x) => ({ ...x, email: undefined, general: undefined }));
        }}
        keyboardType="email-address"
        error={errors.email}
        variant="dealer"
        style={{ marginTop: Spacing.md }}
      />
      <Field
        placeholder="Enter Your Password"
        value={password}
        onChangeText={(t) => {
          setPassword(t.replace(/\s/g, ''));
          setErrors((x) => ({ ...x, password: undefined, general: undefined }));
        }}
        secure
        error={errors.password}
        variant="dealer"
        style={{ marginTop: Spacing.sm }}
      />

      <View style={styles.forgotRow}>
        <Text style={styles.fontColors}>Forgot Password ? </Text>
        <Pressable onPress={() => router.push('/dealer/forgot-password' as any)} style={styles.linkRow} hitSlop={6}>
          <Text style={styles.titleColor}>Reset Here</Text>
          <Icon name="arrow-right" size={12} color={Palette.secondary} />
        </Pressable>
      </View>

      <Btn title="Login" variant="success" loading={isLoading} onPress={submit} />

      <View style={styles.signNew}>
        <Text style={styles.fontColors}>Don’t have an account? </Text>
        <Pressable onPress={() => router.push('/dealer/register' as any)} hitSlop={6}>
          <Text style={styles.titleColor}>Create new</Text>
        </Pressable>
      </View>
    </SplitFrame>
  );
}

const styles = StyleSheet.create({
  h1: { color: Palette.primary, fontSize: 30, fontWeight: FontWeights.bold },
  gold: { color: Palette.secondary },
  h2: { color: Palette.primary, fontSize: FontSizes['2xl'], fontWeight: FontWeights.semibold, marginTop: Spacing.sm },
  danger: { color: Palette.error, textAlign: 'center', marginTop: Spacing.sm },
  forgotRow: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.sm, paddingBottom: Spacing['2xl'] },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fontColors: { color: Palette.textSecondary, fontSize: FontSizes.sm },
  titleColor: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  signNew: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing['2xl'] },
});
