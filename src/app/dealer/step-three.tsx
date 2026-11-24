import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { BoxStep, SignupFrame } from '@/components/dealer/DealerFrames';
import Field from '@/components/common/Field';
import Btn from '@/components/common/Btn';
import Icon from '@/components/common/Icon';
import { useDealerSignup } from '@/context/dealer-signup';

/**
 * Dealer Create Account – Step 3: address & business identifiers
 * backend_ref/views/dealer/auth/registrationStepThree.blade.php
 * (incl. the `#gpspanel` "Set Location" off-canvas – static map placeholder)
 */
const SAMPLE_ADDRESSES = [
  { line: '20 Cooper Square, New Delhi, ND 110020', country: 'India', zip: '110020' },
  { line: '221B Baker Street, London NW1 6XE', country: 'United Kingdom', zip: 'NW1 6XE' },
  { line: 'Rue du Rhône 48, 1204 Geneva', country: 'Switzerland', zip: '1204' },
];

export default function DealerStepThree() {
  const { data, update } = useDealerSignup();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gpsOpen, setGpsOpen] = useState(false);
  const [picked, setPicked] = useState(0);

  const set = (k: keyof typeof data) => (v: string) => {
    update({ [k]: v } as any);
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const next = () => {
    const e: Record<string, string> = {};
    if (!data.street1) e.street1 = 'Please set your location.';
    if (!data.street2.trim()) e.street2 = 'Street line 2 is required.';
    if (!data.zip.trim()) e.zip = 'Zip code is required.';
    if (!data.countryAddress) e.countryAddress = 'Country is required.';
    if (!data.commercialRegistrationNumber.trim()) e.commercialRegistrationNumber = 'Commercial registration number is required.';
    if (!data.taxpayerId.trim()) e.taxpayerId = 'Taxpayer ID number is required.';
    if (!data.permanentEstablishmentNumber.trim()) e.permanentEstablishmentNumber = 'Permanent establishment number is required.';
    if (!data.vatId.trim()) e.vatId = 'VAT ID number is required.';
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    router.push('/dealer/step-four' as any);
  };

  const done = () => {
    const a = SAMPLE_ADDRESSES[picked];
    update({ street1: a.line, countryAddress: a.country, zip: data.zip || a.zip });
    setErrors((e) => ({ ...e, street1: '', countryAddress: '' }));
    setGpsOpen(false);
  };

  return (
    <SignupFrame step={2}>
      <BoxStep title="Create Account" />

      <Pressable onPress={() => setGpsOpen(true)}>
        <View pointerEvents="none">
          <Field
            label="Street Line 1"
            required
            placeholder="Enter street address"
            value={data.street1}
            editable={false}
            error={errors.street1}
            variant="dealer"
            right={<Icon name="crosshairs" size={18} color={Palette.secondary} />}
          />
        </View>
      </Pressable>
      <Field label="Street Line 2" required placeholder="Enter street address" value={data.street2} onChangeText={set('street2')} error={errors.street2} variant="dealer" />
      <Field label="Zip Code" required placeholder="Enter Zip Code" value={data.zip} onChangeText={(t) => set('zip')(t.replace(/[^A-Za-z0-9 ]/g, ''))} error={errors.zip} variant="dealer" />
      <Field label="Country" required placeholder="" value={data.countryAddress} editable={false} error={errors.countryAddress} variant="dealer" />
      <Field
        label="Mobile Number"
        required
        placeholder="Enter mobile number"
        value={data.contactNumber ? `${data.countryCode} ${data.contactNumber}` : ''}
        editable={false}
        variant="dealer"
      />
      <Field label="Website" placeholder="Enter company website" value={data.website} onChangeText={set('website')} variant="dealer" />

      <View style={styles.divider} />

      <Field label="Commercial Registration Number" required placeholder="Enter Commercial Registration Number" value={data.commercialRegistrationNumber} onChangeText={set('commercialRegistrationNumber')} error={errors.commercialRegistrationNumber} variant="dealer" />
      <Field label="Taxpayer ID Number" required placeholder="Enter taxpayer ID number" value={data.taxpayerId} onChangeText={set('taxpayerId')} error={errors.taxpayerId} secure variant="dealer" />
      <Field label="Permanent Establishment Number" required placeholder="Enter Permanent Establishment Number" value={data.permanentEstablishmentNumber} onChangeText={set('permanentEstablishmentNumber')} error={errors.permanentEstablishmentNumber} secure variant="dealer" />
      <Field label="VAT ID Number" required placeholder="Enter VAT ID Number" value={data.vatId} onChangeText={set('vatId')} error={errors.vatId} secure variant="dealer" />

      <View style={styles.btns}>
        <Btn title="Back" variant="dark" onPress={() => router.replace('/dealer/register' as any)} style={{ flex: 1 }} />
        <Btn title="Next" variant="success" onPress={next} style={{ flex: 1 }} />
      </View>

      {/* #gpspanel offcanvas-end */}
      <Modal visible={gpsOpen} transparent animationType="fade" onRequestClose={() => setGpsOpen(false)}>
        <View style={styles.backdrop}>
          <Pressable style={{ flex: 1 }} onPress={() => setGpsOpen(false)} />
          <View style={styles.offcanvas}>
            <View style={styles.ocHeader}>
              <Text style={styles.ocTitle}>Set Location</Text>
              <Pressable onPress={() => setGpsOpen(false)} hitSlop={10}>
                <Icon name="xmark" size={18} color={Palette.textBody} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: Spacing.lg }}>
              <View style={styles.map}>
                <View style={styles.searchBox}>
                  <Icon name="magnifying-glass" size={13} color={Palette.loginBack} />
                  <Text style={styles.searchText}>Search your address</Text>
                </View>
                <Icon name="location-dot" size={42} color={Palette.secondary} />
                <Text style={styles.mapNote}>Google Map preview (connected in a later milestone)</Text>
                <Pressable style={styles.useCurrent} onPress={() => setPicked(0)}>
                  <Icon name="crosshairs" size={13} color={Palette.primary} />
                  <Text style={styles.useCurrentText}>Use Current Location</Text>
                </Pressable>
              </View>
              {SAMPLE_ADDRESSES.map((a, i) => (
                <Pressable key={a.line} onPress={() => setPicked(i)} style={[styles.findLocation, picked === i && styles.findActive]}>
                  <Icon name="location-dot" size={16} color={picked === i ? Palette.secondary : Palette.loginBack} />
                  <Text style={styles.addr}>{a.line}</Text>
                </Pressable>
              ))}
              <Btn title="Done" variant="success" onPress={done} style={{ marginTop: Spacing.lg }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SignupFrame>
  );
}

const styles = StyleSheet.create({
  divider: { height: 1, backgroundColor: Palette.divider, marginVertical: Spacing.md },
  btns: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.lg },
  backdrop: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.45)' },
  offcanvas: { width: '100%', maxWidth: 460, backgroundColor: Palette.white },
  ocHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
  },
  ocTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.semibold, color: Palette.primary },
  map: {
    height: 340,
    borderRadius: Radius.lg,
    backgroundColor: '#E8EFF1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  searchBox: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 38,
    borderRadius: Radius.xs,
    backgroundColor: Palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  searchText: { color: Palette.loginBack, fontSize: FontSizes.sm },
  mapNote: { marginTop: 8, color: Palette.textSecondary, fontSize: FontSizes.xs },
  useCurrent: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  useCurrentText: { color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  findLocation: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
  },
  findActive: { backgroundColor: Palette.surfaceIce },
  addr: { flex: 1, color: Palette.textBody, fontSize: FontSizes.sm },
});
