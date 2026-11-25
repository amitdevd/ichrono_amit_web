import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { CenterFrame, ResTitle } from '@/components/dealer/DealerFrames';
import { Field, Btn, AppModal, Icon } from '@ichrono/ui';

/** backend_ref/views/dealer/auth/resetPassword.blade.php (+ #resetModal) */
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function DealerResetPassword() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => router.replace('/dealer/login' as any), 3000);
    return () => clearTimeout(t);
  }, [done]);

  const submit = () => {
    const e: typeof errors = {};
    if (!PASSWORD_RULE.test(password))
      e.password = 'Min 8 characters with upper & lower case letters, a number and a special character.';
    if (!confirm || confirm !== password) e.confirm = 'Password and confirm password must match.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setDone(true);
  };

  return (
    <CenterFrame>
      <ResTitle title="Reset Password">
        You are all set, Now create a new password and use it during logging in to get access your account.
      </ResTitle>
      <Field
        label="Create Password"
        placeholder="Enter New Password"
        value={password}
        onChangeText={(t) => {
          setPassword(t.replace(/\s/g, ''));
          setErrors((x) => ({ ...x, password: undefined }));
        }}
        secure
        error={errors.password}
        variant="dealer"
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
        variant="dealer"
      />
      <View style={styles.btns}>
        <Btn
          title="Back"
          variant="dark"
          onPress={() => router.replace({ pathname: '/dealer/reset-otp' as any, params: { email: email ?? '' } })}
          style={{ flex: 1 }}
        />
        <Btn title="Done" variant="success" onPress={submit} style={{ flex: 1 }} />
      </View>

      <AppModal visible={done} onClose={() => router.replace('/dealer/login' as any)} width={440}>
        <View style={styles.modal}>
          <View style={styles.check}>
            <Icon name="check" size={38} color={Palette.white} />
          </View>
          <Text style={styles.h3}>Password Reset</Text>
          <Text style={styles.p}>Use the new password during logging in to get access your account</Text>
        </View>
      </AppModal>
    </CenterFrame>
  );
}

const styles = StyleSheet.create({
  btns: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing['3xl'] },
  modal: { alignItems: 'center', paddingVertical: Spacing.xl },
  check: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h3: { marginTop: Spacing.xl, color: Palette.primary, fontSize: 24, fontWeight: FontWeights.bold },
  p: { marginTop: Spacing.sm, color: Palette.textSecondary, fontSize: FontSizes.md, textAlign: 'center', lineHeight: 22 },
});
