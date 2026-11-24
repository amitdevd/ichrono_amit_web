import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { BoxStep, SignupFrame } from '@/components/dealer/DealerFrames';
import Field from '@/components/common/Field';
import Btn from '@/components/common/Btn';
import { useDealerSignup } from '@/context/dealer-signup';

/**
 * Dealer Create Account – Step 4: bank details
 * backend_ref/views/dealer/auth/registrationStepFour.blade.php
 */
export default function DealerStepFour() {
  const { data, update } = useDealerSignup();
  const [confirmAcc, setConfirmAcc] = useState(data.bankAccountNumber);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof data, filter?: (t: string) => string) => (v: string) => {
    update({ [k]: filter ? filter(v) : v } as any);
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };
  const digits = (t: string) => t.replace(/\D/g, '');
  const alnum = (t: string) => t.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  const next = () => {
    const e: Record<string, string> = {};
    if (!/^\d{6,18}$/.test(data.bankAccountNumber)) e.bankAccountNumber = 'Please enter a valid bank account number.';
    if (confirmAcc !== data.bankAccountNumber || !confirmAcc) e.confirm = 'Bank account numbers do not match.';
    if (!data.accountHolderName.trim()) e.accountHolderName = 'Account holder name is required.';
    if (!data.accountHolderAddress.trim()) e.accountHolderAddress = 'Account holder address is required.';
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    router.push('/dealer/step-five' as any);
  };

  return (
    <SignupFrame step={3}>
      <BoxStep title="Create Account" />
      <Field label="Bank account number" required placeholder="Enter bank account number" value={data.bankAccountNumber} onChangeText={set('bankAccountNumber', digits)} error={errors.bankAccountNumber} keyboardType="number-pad" variant="dealer" />
      <Field
        label="Confirm Bank Account Number"
        required
        placeholder="Re-enter bank account number"
        value={confirmAcc}
        onChangeText={(t) => {
          setConfirmAcc(digits(t));
          if (errors.confirm) setErrors((e) => ({ ...e, confirm: '' }));
        }}
        error={errors.confirm}
        keyboardType="number-pad"
        variant="dealer"
      />
      <Field label="IBAN" placeholder="Enter IBAN" value={data.iban} onChangeText={set('iban', alnum)} variant="dealer" />
      <Field label="Routing number (only for US)" placeholder="Enter routing number" value={data.routingNumber} onChangeText={set('routingNumber', digits)} keyboardType="number-pad" variant="dealer" />
      <Field label="SWIFT Code" placeholder="Enter SWIFT code" value={data.swiftCode} onChangeText={set('swiftCode', alnum)} variant="dealer" />
      <Field label="Account holder Name" required placeholder="Enter account holder name" value={data.accountHolderName} onChangeText={set('accountHolderName')} error={errors.accountHolderName} autoCapitalize="words" variant="dealer" />
      <Field label="Account holder Address" required placeholder="Enter account holder address" value={data.accountHolderAddress} onChangeText={set('accountHolderAddress')} error={errors.accountHolderAddress} autoCapitalize="sentences" variant="dealer" />

      <View style={styles.btns}>
        <Btn title="Back" variant="dark" onPress={() => router.replace('/dealer/step-three' as any)} style={{ flex: 1 }} />
        <Btn title="Next" variant="success" onPress={next} style={{ flex: 1 }} />
      </View>
    </SignupFrame>
  );
}

const styles = StyleSheet.create({
  btns: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.lg },
});
