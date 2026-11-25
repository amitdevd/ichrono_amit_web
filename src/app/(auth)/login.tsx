import React, { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { Palette, Spacing } from '@/constants/theme';
import { AuthText, AuthTitle, SocialLogin, UserAuthFrame } from '@/components/user/UserAuthFrame';
import { useAuth } from '@/context/auth-context';
import { Field, Btn } from '@ichrono/ui';

/** backend_ref/views/user/setting/login.blade.php */
export default function UserLoginScreen() {
  const { login, isLoading } = useAuth();
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
      await login(email, password, 'user');
      router.replace('/home' as any);
    } catch {
      setErrors({ general: 'Invalid credentials or unverified user' });
    }
  };

  return (
    <UserAuthFrame>
      <AuthTitle>Login to access your account</AuthTitle>
      <AuthText link="Create new account here" onLink={() => router.push('/(auth)/register' as any)}>
        Don’t have an account?
      </AuthText>
      {errors.general ? <Text style={{ color: Palette.error, marginBottom: Spacing.md }}>{errors.general}</Text> : null}
      <Field
        label="Email Address"
        placeholder="Enter registered email address"
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
        placeholder="Enter your password"
        value={password}
        onChangeText={(t) => {
          setPassword(t.replace(/\s/g, ''));
          setErrors((x) => ({ ...x, password: undefined, general: undefined }));
        }}
        secure
        error={errors.password}
      />
      <AuthText link="Reset here" onLink={() => router.push('/(auth)/forgot-password' as any)}>
        Forgot password?
      </AuthText>
      <Btn title="Login" variant="customBtn3" loading={isLoading} onPress={submit} />
      <SocialLogin />
      <Pressable onPress={() => router.replace('/home' as any)} style={{ alignItems: 'center', marginTop: Spacing.xl }} hitSlop={6}>
        <Text style={{ color: Palette.secondary, fontWeight: '600' }}>Continue as Guest</Text>
      </Pressable>
    </UserAuthFrame>
  );
}
