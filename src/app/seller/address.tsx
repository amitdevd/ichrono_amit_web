import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import SellerSetupFrame from '@/components/user/SellerSetupFrame';
import { useSeller, type SellerAddress } from '@/context/seller';
import { useBreakpoint, Field, ErrorText, FieldLabel, SelectField, Btn, Icon } from '@ichrono/ui';

/** backend_ref/views/user/profile/add-address.blade.php (+ edit-address, #gpspanel) */
const CODES = ['+91', '+44', '+1', '+971', '+49', '+33', '+41', '+39', '+81', '+65', '+61'];
const PLACES = [
  { line: '20 Cooper Square', area: 'Connaught Place', city: 'New Delhi', zip: '110020', country: 'India' },
  { line: '221B Baker Street', area: 'Marylebone', city: 'London', zip: 'NW1 6XE', country: 'United Kingdom' },
  { line: 'Rue du Rhône 48', area: 'Old Town', city: 'Geneva', zip: '1204', country: 'Switzerland' },
];

export default function SellerAddressScreen() {
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const seller = useSeller();
  const { mdUp } = useBreakpoint();
  const [a, setA] = useState<SellerAddress>(seller.address);
  const [errors, setErrors] = useState<Partial<Record<keyof SellerAddress, string>>>({});
  const [gps, setGps] = useState(false);
  const [picked, setPicked] = useState(0);

  const set = (k: keyof SellerAddress) => (v: string) => {
    setA((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = () => {
    const e: typeof errors = {};
    if (!/^\d{7,15}$/.test(a.mobile)) e.mobile = 'Please enter a valid mobile number.';
    if (!a.street1) e.street1 = 'Please set your location.';
    if (!a.street2.trim()) e.street2 = 'Street line 2 is required.';
    if (!a.city.trim()) e.city = 'City is required.';
    if (!a.zip.trim()) e.zip = 'Zip code is required.';
    if (!a.country) e.country = 'Country is required.';
    if (!a.taxInfo) e.taxInfo = 'Please select tax information.';
    if (!a.taxPayerId.trim()) e.taxPayerId = 'Taxpayer ID is required.';
    setErrors(e);
    if (Object.keys(e).length) return;
    seller.setAddress(a);
    router.push((edit ? '/seller/review' : '/seller/bank') as any);
  };

  const half = { flex: 1, minWidth: mdUp ? 0 : '100%' } as const;

  return (
    <SellerSetupFrame step="address" backHref={edit ? '/seller/review' : '/seller/documents'}>
      <View style={{ marginBottom: Spacing.lg }}>
        <FieldLabel required>Mobile Number</FieldLabel>
        <View style={styles.row}>
          <SelectField compact value={a.countryCode} onChange={set('countryCode')} options={CODES} style={{ width: 96 }} />
          <Field
            style={{ flex: 1, marginBottom: 0 }}
            placeholder="Enter mobile number"
            value={a.mobile}
            onChangeText={(t) => set('mobile')(t.replace(/\D/g, ''))}
            keyboardType="phone-pad"
            maxLength={15}
          />
        </View>
        <ErrorText>{errors.mobile}</ErrorText>
      </View>
      <Pressable onPress={() => setGps(true)}>
        <View pointerEvents="none">
          <Field
            label="Street Line 1"
            required
            placeholder="House/Building/Apartment Number"
            value={a.street1}
            editable={false}
            error={errors.street1}
            right={<Icon name="crosshairs" size={18} color={Palette.secondary} />}
          />
        </View>
      </Pressable>
      <Field label="Street Line 2" required placeholder="Locality/Street or area name" value={a.street2} onChangeText={set('street2')} error={errors.street2} autoCapitalize="words" />
      <View style={[styles.row, { flexWrap: 'wrap' }]}>
        <Field label="City" required placeholder="Enter city name" value={a.city} onChangeText={set('city')} error={errors.city} autoCapitalize="words" style={half} />
        <Field label="Zip Code" required placeholder="Enter zip code" value={a.zip} onChangeText={(t) => set('zip')(t.replace(/[^A-Za-z0-9 ]/g, ''))} error={errors.zip} style={half} />
      </View>
      <Field label="Country" required placeholder="Select location to fill country" value={a.country} editable={false} error={errors.country} />
      <Field label="FAX Number" placeholder="Enter fax number" value={a.fax} onChangeText={(t) => set('fax')(t.replace(/[^0-9+\- ]/g, ''))} />
      <Field label="Website" placeholder="Paste website url" value={a.website} onChangeText={(t) => set('website')(t.trim())} />
      <SelectField label="Tax information" required value={a.taxInfo} onChange={set('taxInfo')} options={['One', 'Two', 'Three']} placeholder="Select tax information" error={errors.taxInfo} />
      <Field label="Taxpayer ID" required placeholder="Enter taxpayer id number" value={a.taxPayerId} onChangeText={(t) => set('taxPayerId')(t.replace(/\s/g, ''))} error={errors.taxPayerId} />
      <Btn title={edit ? 'Save' : 'Continue'} variant="customBtn3" onPress={submit} style={{ marginTop: Spacing.md }} />

      {/* #gpspanel */}
      <Modal visible={gps} transparent animationType="fade" onRequestClose={() => setGps(false)}>
        <View style={styles.backdrop}>
          <Pressable style={{ flex: 1 }} onPress={() => setGps(false)} />
          <View style={styles.offcanvas}>
            <View style={styles.ocHeader}>
              <Text style={styles.ocTitle}>Set Location</Text>
              <Pressable onPress={() => setGps(false)} hitSlop={10}>
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
                <Text style={styles.mapNote}>Google Map preview (connected with the backend later)</Text>
                <Pressable style={styles.useCurrent} onPress={() => setPicked(0)}>
                  <Icon name="crosshairs" size={13} color={Palette.primary} />
                  <Text style={styles.useCurrentText}>Use Current Location</Text>
                </Pressable>
              </View>
              {PLACES.map((p, i) => (
                <Pressable key={p.line} onPress={() => setPicked(i)} style={[styles.find, picked === i && { backgroundColor: Palette.surfaceIce }]}>
                  <Icon name="location-dot" size={16} color={picked === i ? Palette.secondary : Palette.loginBack} />
                  <Text style={styles.addr}>{`${p.line}, ${p.city}, ${p.zip}`}</Text>
                </Pressable>
              ))}
              <Btn
                title="Done"
                variant="success"
                style={{ marginTop: Spacing.lg }}
                onPress={() => {
                  const p = PLACES[picked];
                  setA((x) => ({ ...x, street1: p.line, street2: x.street2 || p.area, city: x.city || p.city, zip: x.zip || p.zip, country: p.country }));
                  setErrors((e) => ({ ...e, street1: undefined, country: undefined }));
                  setGps(false);
                }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SellerSetupFrame>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md },
  backdrop: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.45)' },
  offcanvas: { width: '100%', maxWidth: 460, backgroundColor: Palette.white },
  ocHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Palette.divider },
  ocTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.semibold, color: Palette.primary },
  map: { height: 340, borderRadius: Radius.lg, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
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
  find: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: Palette.divider },
  addr: { flex: 1, color: Palette.textBody, fontSize: FontSizes.sm },
});
