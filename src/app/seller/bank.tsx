import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/theme';
import SellerSetupFrame from '@/components/user/SellerSetupFrame';
import { useSeller, type SellerBank } from '@/context/seller';
import { Field, Btn } from '@ichrono/ui';

/** backend_ref/views/user/profile/add-bank-info.blade.php (+ edit-bank-info) */
export default function SellerBankScreen() {
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const seller = useSeller();
  const [b, setB] = useState<SellerBank>(seller.bank);
  const [confirm, setConfirm] = useState(seller.bank.accountNumber);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof SellerBank, f?: (t: string) => string) => (v: string) => {
    setB((x) => ({ ...x, [k]: f ? f(v) : v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };
  const alnum = (t: string) => t.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  const submit = () => {
    const e: Record<string, string> = {};
    if (!/^\d{6,18}$/.test(b.accountNumber)) e.accountNumber = 'Please enter a valid bank account number.';
    if (!confirm || confirm !== b.accountNumber) e.confirm = 'Account numbers do not match.';
    if (!b.holderName.trim()) e.holderName = 'Account holder name is required.';
    if (!b.holderAddress.trim()) e.holderAddress = 'Account holder address is required.';
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    seller.setBank(b);
    router.push('/seller/review' as any);
  };

  return (
    <SellerSetupFrame step="bank" backHref={edit ? '/seller/review' : '/seller/address'}>
      <Field label="Bank Account Number" required placeholder="Enter bank account number" value={b.accountNumber} onChangeText={set('accountNumber', (t) => t.replace(/\D/g, ''))} error={errors.accountNumber} keyboardType="number-pad" />
      <Field
        label="Confirm Account Number"
        required
        placeholder="Re-Enter bank account number"
        value={confirm}
        onChangeText={(t) => {
          setConfirm(t.replace(/\D/g, ''));
          setErrors((e) => ({ ...e, confirm: '' }));
        }}
        error={errors.confirm}
        keyboardType="number-pad"
      />
      <Field label="IBAN" placeholder="Please Enter IBAN" value={b.iban} onChangeText={set('iban', alnum)} />
      <Field label="Routing Number (Only for US)" placeholder="Routing Number" value={b.routing} onChangeText={set('routing', (t) => t.replace(/\D/g, ''))} keyboardType="number-pad" />
      <Field label="Swift Code" placeholder="Enter swift code" value={b.swift} onChangeText={set('swift', alnum)} />
      <Field label="Account Holder name" required placeholder="Enter account holder name" value={b.holderName} onChangeText={set('holderName')} error={errors.holderName} autoCapitalize="words" />
      <Field label="Account Holder Address" required placeholder="Enter account holder Address" value={b.holderAddress} onChangeText={set('holderAddress', (t) => t.replace(/^\s+/, ''))} error={errors.holderAddress} autoCapitalize="sentences" />
      <Btn title={edit ? 'Save' : 'Continue'} variant="customBtn3" onPress={submit} style={{ marginTop: Spacing.md }} />
    </SellerSetupFrame>
  );
}
