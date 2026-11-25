import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { BoxStep, SignupFrame } from '@/components/dealer/DealerFrames';
import { useDealerSignup } from '@/context/dealer-signup';
import { AppModal, Btn, Icon } from '@ichrono/ui';

/**
 * Dealer Create Account – Step 6: Summary + Save → "Profile is Submitted"
 * backend_ref/views/dealer/auth/registrationStepSix.blade.php
 */
export default function DealerStepSix() {
  const { data, reset } = useDealerSignup();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => {
      reset();
      router.replace('/dealer/login' as any);
    }, 3500);
    return () => clearTimeout(t);
  }, [submitted, reset]);

  const v = (x?: string | null) => (x && x.trim() ? x : 'N/A');
  const phone = data.contactNumber ? `${data.countryCode} ${data.contactNumber}` : '';

  return (
    <SignupFrame step={5}>
      <BoxStep title="Summary" subtitle="Of your account deatils" />

      <SectionHead title="Private Seller Document" href="/dealer/step-five" small />
      {[
        ['Business registration', data.docs.businessFront, data.docs.businessRear],
        ['Address proof', data.docs.addressFront, data.docs.addressRear],
        ['Identity proof', data.docs.identityFront, data.docs.identityRear],
      ].map(([title, a, b]) => (
        <View key={title as string} style={styles.uploadList}>
          <Text style={styles.h6}>{title}</Text>
          <View style={styles.imgRow}>
            <DocPreview uri={a as string | null} />
            <DocPreview uri={b as string | null} />
          </View>
        </View>
      ))}

      <SectionHead title="Dealer Information" href="/dealer/register" />
      <InfoTable
        rows={[
          ['Company Name', v(data.companyName)],
          ['Type of Business', v(data.typeOfBusiness)],
          ['Country', v(data.country)],
          ['Title', v(data.title)],
          ['First Name', v(data.firstName)],
          ['Last Name', v(data.lastName)],
          ['Email Address', v(data.email)],
          ['Phone Number', v(phone)],
          ['Account User', v(data.accountUsername)],
        ]}
      />

      <SectionHead title="Address Details" href="/dealer/step-three" />
      <InfoTable
        rows={[
          ['Street Line 1', v(data.street1)],
          ['Street line 2', v(data.street2)],
          ['ZIP Code', v(data.zip)],
          ['Country', v(data.countryAddress)],
          ['Mobile Number', v(phone)],
          ['Website', v(data.website)],
          ['Commercial Rgst. No.', v(data.commercialRegistrationNumber)],
          ['Tax Payer ID', v(data.taxpayerId)],
          ['Permanent Establishment', v(data.permanentEstablishmentNumber)],
          ['VAT ID Number', v(data.vatId)],
        ]}
      />

      <SectionHead title="Bank Details" href="/dealer/step-four" />
      <InfoTable
        rows={[
          ['Bank Account Number', v(data.bankAccountNumber)],
          ['IBAN', v(data.iban)],
          ['Routing Number', v(data.routingNumber)],
          ['Swift Code', v(data.swiftCode)],
          ['Account Holder Name', v(data.accountHolderName)],
          ['Account Holder Address', v(data.accountHolderAddress)],
        ]}
      />

      <View style={styles.btns}>
        <Btn title="Back" variant="dark" onPress={() => router.replace('/dealer/step-five' as any)} style={{ flex: 1 }} />
        <Btn title="Save" variant="success" onPress={() => setSubmitted(true)} style={{ flex: 1 }} />
      </View>

      {/* #resetModal – Profile is Submitted */}
      <AppModal
        visible={submitted}
        onClose={() => {
          reset();
          router.replace('/dealer/login' as any);
        }}
        width={460}
      >
        <View style={styles.resetModal}>
          <View style={styles.check}>
            <Icon name="check" size={38} color={Palette.white} />
          </View>
          <Text style={styles.h3}>Profile is Submitted</Text>
          <Text style={styles.p}>Profile is under review by the admin. Once the approved then you will notify!</Text>
        </View>
      </AppModal>
    </SignupFrame>
  );
}

function SectionHead({ title, href, small }: { title: string; href: string; small?: boolean }) {
  return (
    <View style={styles.sellerLists}>
      <Text style={small ? styles.h6 : styles.h5}>{title}</Text>
      <Pressable onPress={() => router.push(href as any)} hitSlop={8} accessibilityLabel={`Edit ${title}`}>
        <Icon name="pen-to-square" size={18} color={Palette.secondary} />
      </Pressable>
    </View>
  );
}

function DocPreview({ uri }: { uri: string | null }) {
  return (
    <View style={styles.imageBox}>
      {uri ? (
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <Image source={require('@/assets/images/document.png')} style={{ width: 60, height: 60 }} resizeMode="contain" />
      )}
    </View>
  );
}

function InfoTable({ rows }: { rows: [string, string][] }) {
  return (
    <View style={styles.table}>
      {rows.map(([k, val], i) => (
        <View key={k} style={[styles.tr, i === rows.length - 1 && { borderBottomWidth: 0 }]}>
          <Text style={styles.th}>{k}</Text>
          <Text style={styles.td}>{val}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sellerLists: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  h5: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
  h6: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold, marginBottom: Spacing.sm },
  uploadList: { marginBottom: Spacing.lg },
  imgRow: { flexDirection: 'row', gap: Spacing.lg },
  imageBox: {
    flex: 1,
    height: 130,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.divider,
    backgroundColor: Palette.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  table: { borderWidth: 1, borderColor: Palette.divider, borderRadius: Radius.md, overflow: 'hidden' },
  tr: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    gap: 12,
  },
  th: { width: '45%', color: Palette.textSecondary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  td: { flex: 1, color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  btns: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing['3xl'] },
  resetModal: { alignItems: 'center', paddingVertical: Spacing.xl },
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
