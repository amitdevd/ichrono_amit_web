import React, { useState } from 'react';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import Field from '@/components/common/Field';
import Btn from '@/components/common/Btn';
import { AuthText, AuthTitle, UserAuthFrame } from '@/components/web/UserAuthFrame';

/** backend_ref/views/user/setting/reset-password.blade.php */
export default function UserForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!email.trim()) return setError('The email field is required.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('The email must be a valid email address.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({ pathname: '/(auth)/otp-verify' as any, params: { email, mode: 'forgot' } });
    }, 500);
  };

  return (
    <UserAuthFrame>
      <AuthTitle backHref="/(auth)/login">Reset Password</AuthTitle>
      <AuthText>Please enter your registered email address, we’ll send a 4-digit OTP to verify that you’re real</AuthText>
      <Field
        label="Email Address"
        placeholder="Enter registered email address"
        value={email}
        onChangeText={(t) => {
          setEmail(t.replace(/\s/g, ''));
          setError('');
        }}
        keyboardType="email-address"
        error={error}
      />
      <Btn title="Continue" variant="customBtn3" loading={loading} onPress={submit} style={{ marginTop: Spacing.lg }} />
    </UserAuthFrame>
  );
}
