import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { AdminCardFrame, AdminH } from '@/components/admin/AdminAuthFrame';
import Field from '@/components/common/Field';
import Btn from '@/components/common/Btn';
import AppModal from '@/components/common/AppModal';
import Icon from '@/components/common/Icon';

/** backend_ref/views/admin/setting/create_password.blade.php */
const RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function AdminCreatePasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!RULE.test(password))
      return setError('The password must be at least 8 characters with upper & lower case, a number and a special character.');
    if (password !== confirm) return setError('The password confirmation does not match.');
    setDone(true);
  };

  return (
    <AdminCardFrame>
      <AdminH>Create Password</AdminH>
      {error ? <Text style={styles.danger}>{error}</Text> : null}
      <Field
        label="Create New Password"
        placeholder="Enter New Password"
        value={password}
        onChangeText={(t) => {
          setPassword(t.replace(/\s/g, ''));
          setError('');
        }}
        secure
      />
      <Field
        label="Confirm Password"
        placeholder="Enter Confirm Password"
        value={confirm}
        onChangeText={(t) => {
          setConfirm(t.replace(/\s/g, ''));
          setError('');
        }}
        secure
      />
      <Btn title="Submit" variant="customBtn" onPress={submit} style={{ height: 48, marginTop: Spacing['2xl'] }} />

      <AppModal visible={done} onClose={() => router.replace('/admin/login' as any)} width={420}>
        <View style={styles.success}>
          <View style={styles.check}>
            <Icon name="check" size={34} color={Palette.white} />
          </View>
          <Text style={styles.h3}>Password Changed</Text>
          <Text style={styles.p}>Your password has been updated. Please login with your new password.</Text>
          <Btn title="Back to Login" variant="customBtn" style={{ marginTop: Spacing.xl, alignSelf: 'stretch' }} onPress={() => router.replace('/admin/login' as any)} />
        </View>
      </AppModal>
    </AdminCardFrame>
  );
}

const styles = StyleSheet.create({
  danger: { color: Palette.error, textAlign: 'center', marginBottom: Spacing.md },
  success: { alignItems: 'center', paddingVertical: Spacing.lg },
  check: { width: 72, height: 72, borderRadius: 36, backgroundColor: Palette.success, alignItems: 'center', justifyContent: 'center' },
  h3: { marginTop: Spacing.lg, color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.bold },
  p: { marginTop: 6, color: Palette.textSecondary, fontSize: FontSizes.sm, textAlign: 'center' },
});
