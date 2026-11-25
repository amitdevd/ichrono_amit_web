import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { AdminH, AdminLoginFrame } from '@/components/admin/AdminAuthFrame';
import { useAuth } from '@/context/auth-context';
import { Field, ErrorText, CheckBox, Btn } from '@ichrono/ui';

/** backend_ref/views/admin/setting/login.blade.php */
export default function AdminLoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; remember?: string; general?: string }>({});

  const submit = async () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'The email field is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'The email must be a valid email address.';
    if (!password) e.password = 'The password field is required.';
    if (!remember) e.remember = 'Please accept the Terms And Conditions.';
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      await login(email, password, 'admin');
      router.replace('/admin/dashboard' as any);
    } catch {
      setErrors({ general: 'Invalid credentials' });
    }
  };

  return (
    <AdminLoginFrame>
      <AdminH>Login</AdminH>
      {errors.general ? <Text style={styles.danger}>{errors.general}</Text> : null}
      <Field
        label="Enter email"
        placeholder="Enter email id"
        value={email}
        onChangeText={(t) => {
          setEmail(t.replace(/\s/g, ''));
          setErrors((x) => ({ ...x, email: undefined, general: undefined }));
        }}
        keyboardType="email-address"
        error={errors.email}
      />
      <Field
        label="Password"
        placeholder="Enter password"
        value={password}
        onChangeText={(t) => {
          setPassword(t.replace(/\s/g, ''));
          setErrors((x) => ({ ...x, password: undefined, general: undefined }));
        }}
        secure
        error={errors.password}
      />
      <CheckBox
        checked={remember}
        onChange={(v) => {
          setRemember(v);
          setErrors((x) => ({ ...x, remember: undefined }));
        }}
        label={<Text style={styles.terms}>I Agree with Terms And Conditions</Text>}
      />
      <ErrorText>{errors.remember}</ErrorText>
      <View style={styles.forgotRow}>
        <Pressable onPress={() => router.push('/admin/forgot-password' as any)} hitSlop={6}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </Pressable>
      </View>
      <Btn title="Login" variant="customBtn" loading={isLoading} onPress={submit} style={{ height: 48 }} />
    </AdminLoginFrame>
  );
}

const styles = StyleSheet.create({
  danger: { color: Palette.error, textAlign: 'center', marginBottom: Spacing.md },
  terms: { color: Palette.primary, fontSize: FontSizes.sm, textDecorationLine: 'underline' },
  forgotRow: { alignItems: 'flex-end', marginTop: Spacing.sm, marginBottom: Spacing['2xl'] },
  forgot: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
});
