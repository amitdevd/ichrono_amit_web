import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { AdminH, AdminLoginFrame } from '@/components/admin/AdminAuthFrame';
import { Field, ErrorText, CheckBox, Btn } from '@ichrono/ui';

/**
 * Register Administrator – not part of backend_ref (admins are created by the
 * platform), kept from the existing project and styled like the admin login.
 * Nothing links here; open /admin/signup directly.
 */
export default function AdminSignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const clear = (k: string) => setErrors((prev) => ({ ...prev, [k]: '' }));

  const handleSignup = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Admin email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Please enter a valid email address';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!password.trim()) errs.password = 'Password is required';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) errs.agreeTerms = 'Please accept Terms and Conditions';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({ pathname: '/admin/otp-verify' as any, params: { email } });
    }, 800);
  };

  return (
    <AdminLoginFrame>
      <AdminH>Register Administrator</AdminH>
      <Field label="Full Name" placeholder="Enter administrator full name" value={name} autoCapitalize="words"
        onChangeText={(t) => { setName(t); clear('name'); }} error={errors.name} />
      <Field label="Admin Email ID" placeholder="Enter authorized email" value={email} keyboardType="email-address"
        onChangeText={(t) => { setEmail(t.replace(/\s/g, '')); clear('email'); }} error={errors.email} />
      <Field label="Phone Number" placeholder="Enter phone number" value={phone} keyboardType="phone-pad"
        onChangeText={(t) => { setPhone(t.replace(/[^0-9+]/g, '')); clear('phone'); }} error={errors.phone} />
      <Field label="Password" placeholder="Create secure password" value={password} secure
        onChangeText={(t) => { setPassword(t.replace(/\s/g, '')); clear('password'); }} error={errors.password} />
      <Field label="Confirm Password" placeholder="Re-enter password" value={confirmPassword} secure
        onChangeText={(t) => { setConfirmPassword(t.replace(/\s/g, '')); clear('confirmPassword'); }} error={errors.confirmPassword} />
      <CheckBox
        checked={agreeTerms}
        onChange={(v) => { setAgreeTerms(v); clear('agreeTerms'); }}
        label={<Text style={styles.terms}>I Agree with Terms And Conditions</Text>}
      />
      <ErrorText>{errors.agreeTerms}</ErrorText>
      <Btn title="Register" variant="customBtn" loading={loading} onPress={handleSignup} style={styles.btn} />
      <View style={styles.row}>
        <Text style={styles.muted}>Already registered? </Text>
        <Pressable onPress={() => router.replace('/admin/login' as any)} hitSlop={6}>
          <Text style={styles.link}>Login</Text>
        </Pressable>
      </View>
    </AdminLoginFrame>
  );
}

const styles = StyleSheet.create({
  terms: { color: Palette.primary, fontSize: FontSizes.sm, textDecorationLine: 'underline' },
  btn: { height: 48, marginTop: Spacing['2xl'] },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  muted: { color: Palette.textSecondary, fontSize: FontSizes.sm },
  link: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
});
