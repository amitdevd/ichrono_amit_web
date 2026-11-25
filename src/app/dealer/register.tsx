import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { BoxStep, SignupFrame, ResTitle } from '@/components/dealer/DealerFrames';
import { useDealerSignup } from '@/context/dealer-signup';
import { COUNTRIES } from '@/data';
import { Field, ErrorText, FieldLabel, SelectField, OptionChips, CheckBox, Btn, AppModal } from '@ichrono/ui';

/**
 * Dealer Create Account – Step 1
 * backend_ref/views/dealer/auth/signUp.blade.php (+ #otpModal for mobile verification)
 */
const CODES = ['+91', '+44', '+1', '+971', '+49', '+33', '+41', '+39', '+81', '+65', '+61'];
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function DealerSignUpStepOne() {
  const { data, update } = useDealerSignup();
  const [confirm, setConfirm] = useState(data.password);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const set = (k: keyof typeof data) => (v: string) => {
    update({ [k]: v } as any);
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const verifyMobile = () => {
    if (!/^\d{7,12}$/.test(data.contactNumber)) {
      setErrors((e) => ({ ...e, contactNumber: 'Please enter a valid mobile number (7-12 digits).' }));
      return;
    }
    setOtp('');
    setOtpError('');
    setOtpOpen(true);
  };

  const submitOtp = () => {
    if (!/^\d{4}$/.test(otp)) return setOtpError('Please enter the 4-digit OTP.');
    update({ mobileVerified: true });
    setOtpOpen(false);
    setErrors((e) => ({ ...e, contactNumber: '' }));
  };

  const next = () => {
    const e: Record<string, string> = {};
    if (!data.companyName.trim()) e.companyName = 'Company name is required.';
    if (!data.typeOfBusiness) e.typeOfBusiness = 'Please select type of business.';
    if (!data.country) e.country = 'Please select a country.';
    if (!data.title) e.title = 'Please select a title.';
    if (!data.firstName.trim()) e.firstName = 'First name is required.';
    if (!data.lastName.trim()) e.lastName = 'Last name is required.';
    if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = 'Please enter a valid email address.';
    if (!data.contactNumber) e.contactNumber = 'Mobile number is required.';
    else if (!data.mobileVerified) e.contactNumber = 'Please verify your mobile number.';
    if (!data.accountUsername.trim()) e.accountUsername = 'Account username is required.';
    if (!PASSWORD_RULE.test(data.password))
      e.password = 'Min 8 characters with upper & lower case letters, a number and a special character.';
    if (confirm !== data.password || !confirm) e.confirm = 'Password and confirm password must match.';
    if (!agree) e.agree = 'Please accept the Terms of Use and Policies.';
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    router.push({ pathname: '/dealer/verify-otp' as any, params: { email: data.email } });
  };

  const noSpace = (fn: (v: string) => void) => (t: string) => fn(t.replace(/\s/g, ''));
  const letters = (fn: (v: string) => void) => (t: string) => fn(t.replace(/[^A-Za-z]/g, ''));

  return (
    <SignupFrame step={1}>
      <BoxStep title="Create Account" />

      <Field label="Company Name" required placeholder="Enter company name" value={data.companyName} onChangeText={set('companyName')} error={errors.companyName} autoCapitalize="words" variant="dealer" />

      <View style={styles.group}>
        <FieldLabel required>Type of Business</FieldLabel>
        <OptionChips options={['Self Propriptor', 'Corporation']} value={data.typeOfBusiness} onChange={set('typeOfBusiness')} />
        <ErrorText>{errors.typeOfBusiness}</ErrorText>
      </View>

      <SelectField label="Country" required value={data.country} onChange={set('country')} options={COUNTRIES} placeholder="Select a country" searchable error={errors.country} height={50} />

      <View style={styles.group}>
        <FieldLabel required>Title</FieldLabel>
        <OptionChips options={['Mr.', 'Mrs.']} value={data.title} onChange={set('title')} />
        <ErrorText>{errors.title}</ErrorText>
      </View>

      <Field label="First Name" required placeholder="Enter first name" value={data.firstName} onChangeText={letters(set('firstName'))} error={errors.firstName} autoCapitalize="words" variant="dealer" />
      <Field label="Last Name" required placeholder="Enter last name" value={data.lastName} onChangeText={letters(set('lastName'))} error={errors.lastName} autoCapitalize="words" variant="dealer" />
      <Field label="Email Address" required placeholder="Enter email" value={data.email} onChangeText={noSpace(set('email'))} error={errors.email} keyboardType="email-address" variant="dealer" />

      <View style={styles.group}>
        <FieldLabel required>Mobile Number</FieldLabel>
        <View style={styles.phoneRow}>
          <SelectField compact value={data.countryCode} onChange={set('countryCode')} options={CODES} height={50} style={{ width: 96 }} />
          <Field
            style={{ flex: 1, marginBottom: 0 }}
            placeholder="Enter mobile number"
            value={data.contactNumber}
            keyboardType="phone-pad"
            maxLength={12}
            editable={!data.mobileVerified}
            variant="dealer"
            onChangeText={(t) => {
              update({ contactNumber: t.replace(/\D/g, ''), mobileVerified: false });
              if (errors.contactNumber) setErrors((e) => ({ ...e, contactNumber: '' }));
            }}
            right={
              data.mobileVerified ? (
                <Text style={[styles.verifyTag, { color: Palette.success }]}>Verified</Text>
              ) : (
                <Pressable onPress={verifyMobile} hitSlop={8}>
                  <Text style={styles.verifyTag}>Verify</Text>
                </Pressable>
              )
            }
          />
        </View>
        <ErrorText>{errors.contactNumber}</ErrorText>
      </View>

      <View style={styles.divider} />

      <Field label="Account Username" required placeholder="Enter account username" value={data.accountUsername} onChangeText={noSpace(set('accountUsername'))} error={errors.accountUsername} variant="dealer" />
      <Field label="Create Password" required placeholder="Enter New Password" value={data.password} onChangeText={noSpace(set('password'))} error={errors.password} secure variant="dealer" />
      <Field
        label="Confirm Password"
        required
        placeholder="Re-enter new password"
        value={confirm}
        onChangeText={(t) => {
          setConfirm(t.replace(/\s/g, ''));
          if (errors.confirm) setErrors((e) => ({ ...e, confirm: '' }));
        }}
        error={errors.confirm}
        secure
        variant="dealer"
      />

      <CheckBox
        checked={agree}
        onChange={(v) => {
          setAgree(v);
          if (errors.agree) setErrors((e) => ({ ...e, agree: '' }));
        }}
        style={{ marginTop: Spacing.sm }}
        label={
          <Text style={styles.terms}>
            I agree with Andy Dev Design’s <Text style={styles.gold}>Terms of Use</Text> and <Text style={styles.gold}>Policies</Text>
          </Text>
        }
      />
      <ErrorText>{errors.agree}</ErrorText>

      <Btn title="Next" variant="success" onPress={next} style={{ marginTop: Spacing['2xl'] }} />

      {/* #otpModal */}
      <AppModal visible={otpOpen} onClose={() => setOtpOpen(false)} width={440}>
        <ResTitle title="OTP Verification">
          A 4-digit OTP has been sent to <Text style={styles.gold}>{`${data.countryCode} ${data.contactNumber}`}</Text>
        </ResTitle>
        <Field
          placeholder="Enter OTP"
          value={otp}
          onChangeText={(t) => {
            setOtp(t.replace(/\D/g, ''));
            setOtpError('');
          }}
          maxLength={4}
          keyboardType="number-pad"
          error={otpError}
          variant="dealer"
        />
        <Text style={styles.hint}>Demo: enter any 4 digits</Text>
        <Btn title="Submit" variant="success" onPress={submitOtp} />
      </AppModal>
    </SignupFrame>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: Spacing.lg },
  phoneRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  verifyTag: { color: Palette.secondary, fontWeight: FontWeights.semibold, fontSize: FontSizes.sm, paddingLeft: 8 },
  divider: { height: 1, backgroundColor: Palette.divider, marginVertical: Spacing.md },
  terms: { color: Palette.textBody, fontSize: FontSizes.sm },
  gold: { color: Palette.secondary, fontWeight: FontWeights.semibold },
  hint: { color: Palette.textMuted, fontSize: FontSizes.xs, marginTop: -8, marginBottom: Spacing.lg },
});
