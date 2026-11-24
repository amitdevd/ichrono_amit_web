import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import {
  Palette,
  Spacing,
  Radius,
  FontSizes,
  FontWeights,
} from '@/constants/theme';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import AuthHeader from '@/components/AuthHeader';

export default function AdminSignupScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 860;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Admin email is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!password.trim()) errs.password = 'Password is required';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) errs.agreeTerms = 'Please accept Terms and Conditions';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/admin/otp-verify' as any,
        params: { email },
      });
    }, 800);
  };

  return (
    <View style={styles.screen}>
      <AuthHeader currentRole="admin" backHref="/admin/login" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.loginContainer, isLargeScreen && styles.loginContainerLarge]}>
            {/* Left Col: logoDiv */}
            <View style={[styles.logoDiv, isLargeScreen && styles.logoDivLarge]}>
              <Image
                source={require('@/assets/images/Logo.png')}
                style={styles.logoImg}
                resizeMode="contain"
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>ADMIN CONSOLE</Text>
              </View>
              <Text style={styles.adminSubtitle}>
                Create an authorized administrative profile with multi-factor authentication
              </Text>
            </View>

            {/* Right Col: formCol */}
            <View style={[styles.formCol, isLargeScreen && styles.formColLarge]}>
              <View style={styles.loginBackgroundeffect}>
                <Text style={styles.headingTitle}>Register Administrator</Text>

                <FormInput
                  label="Full Name"
                  placeholder="Enter administrator full name"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  error={errors.name}
                />

                <FormInput
                  label="Admin Email ID"
                  placeholder="Enter authorized email"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t.replace(/\s/g, ''));
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />

                <FormInput
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(t);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  keyboardType="phone-pad"
                  error={errors.phone}
                />

                <FormInput
                  label="Password"
                  placeholder="Create secure password"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t.replace(/\s/g, ''));
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  secureTextEntry
                  error={errors.password}
                />

                <FormInput
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChangeText={(t) => {
                    setConfirmPassword(t.replace(/\s/g, ''));
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  secureTextEntry
                  error={errors.confirmPassword}
                />

                <Pressable
                  onPress={() => setAgreeTerms(!agreeTerms)}
                  style={styles.checkboxRow}
                >
                  <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                    {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.termsText}>
                    I Agree with <Text style={styles.termsHighlight}>Terms And Conditions</Text>
                  </Text>
                </Pressable>
                {errors.agreeTerms ? <Text style={styles.errorText}>{errors.agreeTerms}</Text> : null}

                <Button
                  title="Create Admin Account"
                  variant="primary"
                  loading={loading}
                  onPress={handleSignup}
                  style={styles.customBtn}
                />

                <View style={styles.loginRow}>
                  <Text style={styles.loginText}>Already registered? </Text>
                  <Pressable onPress={() => router.push('/admin/login' as any)}>
                    <Text style={styles.loginLink}>Login here ›</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.backgroundPage,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    width: '100%',
    maxWidth: 960,
    backgroundColor: Palette.white,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: Palette.loginBack,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  loginContainerLarge: {
    flexDirection: 'row',
  },
  logoDiv: {
    backgroundColor: Palette.primary,
    padding: Spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  logoDivLarge: {
    width: '42%',
    minHeight: 560,
  },
  logoImg: {
    width: 210,
    height: 52,
    marginBottom: Spacing.md,
  },
  badge: {
    backgroundColor: Palette.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: Spacing.md,
  },
  badgeText: {
    color: Palette.white,
    fontSize: 10,
    fontWeight: FontWeights.bold,
    letterSpacing: 1.5,
  },
  adminSubtitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: FontSizes.xs,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 240,
  },
  formCol: {
    padding: Spacing['3xl'],
    justifyContent: 'center',
    backgroundColor: Palette.white,
  },
  formColLarge: {
    width: '58%',
    padding: Spacing['4xl'],
  },
  loginBackgroundeffect: {
    width: '100%',
  },
  headingTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: Palette.primary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Palette.loginBack,
    marginRight: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.white,
  },
  checkboxChecked: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  checkmark: {
    color: Palette.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: FontSizes.xs,
    color: Palette.textSecondary,
  },
  termsHighlight: {
    color: Palette.secondary,
    fontWeight: FontWeights.semibold,
  },
  errorText: {
    color: Palette.error,
    fontSize: FontSizes.xs,
    marginBottom: Spacing.xs,
  },
  customBtn: {
    marginTop: Spacing.md,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  loginText: {
    fontSize: FontSizes.xs,
    color: Palette.textSecondary,
  },
  loginLink: {
    fontSize: FontSizes.xs,
    color: Palette.secondary,
    fontWeight: FontWeights.bold,
  },
});
