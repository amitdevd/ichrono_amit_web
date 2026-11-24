import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes } from '@/constants/theme';
import Field, { ErrorText, FieldLabel } from '@/components/common/Field';
import SelectField from '@/components/common/SelectField';
import { CheckBox } from '@/components/common/Controls';
import Btn from '@/components/common/Btn';
import { AuthText, AuthTitle, SocialLogin, UserAuthFrame } from '@/components/web/UserAuthFrame';

/** backend_ref/views/user/setting/register.blade.php */
const CODES = ['+91', '+44', '+1', '+971', '+49', '+33', '+41', '+39', '+81', '+65', '+61'];

export default function UserRegisterScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const clear = (k: string) => setErrors((e) => ({ ...e, [k]: '' }));

  const submit = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'The email field is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'The email must be a valid email address.';
    if (!mobile) e.mobile = 'The mobile field is required.';
    else if (!/^\d{7,12}$/.test(mobile)) e.mobile = 'Please enter a valid mobile number.';
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password))
      e.password = 'Password must be at least 8 characters with upper & lower case, a number and a special character.';
    if (!terms) e.terms = 'Please accept the Terms of Use and Policies.';
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({ pathname: '/(auth)/otp-verify' as any, params: { email, mode: 'register' } });
    }, 500);
  };

  return (
    <UserAuthFrame>
      <AuthTitle>Register to create your new account</AuthTitle>
      <AuthText link="Login here" onLink={() => router.push('/(auth)/login' as any)}>
        Already have an account?
      </AuthText>
      <Field
        label="Email Address"
        placeholder="Enter email address"
        value={email}
        onChangeText={(t) => {
          setEmail(t.replace(/\s/g, ''));
          clear('email');
        }}
        keyboardType="email-address"
        error={errors.email}
      />
      <View style={{ marginBottom: Spacing.lg }}>
        <FieldLabel>Mobile Number</FieldLabel>
        <View style={styles.phoneRow}>
          <SelectField compact value={code} onChange={setCode} options={CODES} style={{ width: 96 }} />
          <Field
            style={{ flex: 1, marginBottom: 0 }}
            placeholder="Enter mobile number"
            value={mobile}
            onChangeText={(t) => {
              setMobile(t.replace(/\D/g, ''));
              clear('mobile');
            }}
            keyboardType="phone-pad"
            maxLength={12}
          />
        </View>
        <ErrorText>{errors.mobile}</ErrorText>
      </View>
      <Field
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={(t) => {
          setPassword(t.replace(/\s/g, ''));
          clear('password');
        }}
        secure
        error={errors.password}
      />
      <CheckBox
        checked={terms}
        onChange={(v) => {
          setTerms(v);
          clear('terms');
        }}
        label={
          <Text style={styles.terms}>
            I agree with I-CHRONO’s <Text style={styles.gold}>Terms of Use</Text> and <Text style={styles.gold}>Policies</Text>
          </Text>
        }
      />
      <ErrorText>{errors.terms}</ErrorText>
      <Btn title="Register" variant="customBtn3" loading={loading} onPress={submit} style={{ marginTop: Spacing.xl }} />
      <SocialLogin />
    </UserAuthFrame>
  );
}

const styles = StyleSheet.create({
  phoneRow: { flexDirection: 'row', gap: Spacing.sm },
  terms: { color: Palette.textBody, fontSize: FontSizes.sm },
  gold: { color: Palette.secondary },
});
