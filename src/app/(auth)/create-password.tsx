import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import Field from '@/components/common/Field';
import Btn from '@/components/common/Btn';
import AppModal from '@/components/common/AppModal';
import { AuthText, AuthTitle, UserAuthFrame } from '@/components/web/UserAuthFrame';

/** backend_ref/views/user/setting/confirm-password.blade.php */
const RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function UserCreatePasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [done, setDone] = useState(false);

  const submit = () => {
    const e: typeof errors = {};
    if (!RULE.test(password))
      e.password = 'Password must be at least 8 characters with upper & lower case, a number and a special character.';
    if (!confirm || confirm !== password) e.confirm = 'Passwords do not match.';
    setErrors(e);
    if (!Object.keys(e).length) setDone(true);
  };

  return (
    <UserAuthFrame>
      <AuthTitle backHref="/(auth)/forgot-password">Reset Password</AuthTitle>
      <AuthText>You are all set. Now create a new password and use it during login to access your account.</AuthText>
      <Field
        label="Create Password"
        placeholder="Enter new password"
        value={password}
        onChangeText={(t) => {
          setPassword(t.replace(/\s/g, ''));
          setErrors((x) => ({ ...x, password: undefined }));
        }}
        secure
        error={errors.password}
      />
      <Field
        label="Confirm Password"
        placeholder="Re-enter new password"
        value={confirm}
        onChangeText={(t) => {
          setConfirm(t.replace(/\s/g, ''));
          setErrors((x) => ({ ...x, confirm: undefined }));
        }}
        secure
        error={errors.confirm}
      />
      <Btn title="Done" variant="customBtn3" onPress={submit} style={{ marginTop: Spacing.lg }} />

      <AppModal visible={done} onClose={() => router.replace('/(auth)/login' as any)} width={440}>
        <View style={styles.success}>
          <Image source={require('@/assets/images/success.webp')} style={{ width: 66, height: 67 }} />
          <Text style={styles.h6}>Password Updated</Text>
          <Text style={styles.p}>Use your new password to login to your account.</Text>
          <Btn title="Login" variant="customBtn3" style={{ marginTop: Spacing.xl }} onPress={() => router.replace('/(auth)/login' as any)} />
        </View>
      </AppModal>
    </UserAuthFrame>
  );
}

const styles = StyleSheet.create({
  success: { alignItems: 'center', paddingVertical: Spacing.lg },
  h6: { marginTop: Spacing.lg, color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  p: { marginTop: 6, color: Palette.textSecondary, fontSize: FontSizes.sm, textAlign: 'center' },
});
