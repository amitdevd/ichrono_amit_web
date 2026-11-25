import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { Card, TableAction } from '@/components/admin/AdminUI';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import { useAdminData } from '@/context/admin-data';
import { CONTINENTS, CONTINENT_COUNTRIES, type SavedCountry } from '@/data';
import { useBreakpoint, Btn, AppModal, SelectField, Icon, ToggleSwitch, DataTable, type Column } from '@ichrono/ui';

/** backend_ref/views/admin/country-management-settings/manage-countries.blade.php */
export function generateStaticParams() {
  return CONTINENTS.map((continent) => ({ continent }));
}

export default function ManageCountries() {
  const { continent: raw } = useLocalSearchParams<{ continent: string }>();
  const continent = decodeURIComponent(String(raw ?? ''));
  const { mdUp } = useBreakpoint();
  const { countries, setCountries } = useAdminData();
  const [addOpen, setAddOpen] = useState(false);
  const [pick, setPick] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [deleting, setDeleting] = useState<SavedCountry | null>(null);

  const saved = countries
    .filter((c) => c.continent === continent)
    .sort((a, b) => a.country.localeCompare(b.country));
  const available = CONTINENT_COUNTRIES[continent] ?? [];

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 2500);
  };

  const add = () => {
    if (!pick) return setError('Please select a country.');
    if (saved.some((c) => c.country === pick)) return setError('This country already exists.');
    const id = Math.max(0, ...countries.map((c) => c.id)) + 1;
    setCountries([...countries, { id, continent, country: pick, active: true }]);
    setAddOpen(false);
    flash('Country added successfully!');
  };

  const columns: Column<SavedCountry>[] = [
    { key: 'sr', title: 'SR No.', width: 100, render: (_r, i) => <Text style={styles.bold}>{i + 1}</Text> },
    { key: 'country', title: 'Country', width: 280 },
    {
      key: 'action',
      title: 'Action',
      width: 160,
      align: 'center',
      render: (r) => (
        <View style={styles.actions}>
          <TableAction icon="trash" label="Delete" onPress={() => setDeleting(r)} />
          <ToggleSwitch
            value={r.active}
            onChange={(v) => setCountries(countries.map((c) => (c.id === r.id ? { ...c, active: v } : c)))}
          />
        </View>
      ),
    },
  ];

  return (
    <View>
      <Pressable onPress={() => router.push('/admin/country-management-settings' as any)} style={styles.back}>
        <Icon name="arrow-left" size={18} color={Palette.primary} />
        <Text style={styles.backText}>Manage Countries</Text>
        <Text style={styles.continent}>· {continent}</Text>
      </Pressable>

      {toast ? (
        <View style={styles.toast}>
          <Icon name="circle-check" size={14} color={Palette.white} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <Card style={{ marginTop: Spacing.xl }}>
        <View style={styles.topRow}>
          <Btn
            title="Add Country"
            variant="customBtn"
            onPress={() => {
              setPick('');
              setError('');
              setAddOpen(true);
            }}
            style={{ width: mdUp ? 260 : '100%' }}
          />
        </View>
        <View style={{ marginTop: Spacing['2xl'] }}>
          <DataTable columns={columns} data={saved} keyExtractor={(r) => String(r.id)} />
        </View>
      </Card>

      <AppModal visible={addOpen} onClose={() => setAddOpen(false)} title="Add Country" showClose>
        <SelectField
          label="Choose country"
          value={pick}
          onChange={(v) => {
            setPick(v);
            setError('');
          }}
          options={available}
          placeholder="-- Select Country --"
          searchable
          error={error}
          style={{ marginTop: Spacing.md }}
        />
        <View style={{ alignItems: 'center', marginTop: Spacing.md }}>
          <Btn title="Add" onPress={add} />
        </View>
      </AppModal>

      <ConfirmDeleteModal
        visible={!!deleting}
        onNo={() => setDeleting(null)}
        onYes={() => {
          if (deleting) setCountries(countries.filter((c) => c.id !== deleting.id));
          setDeleting(null);
          flash('Country deleted successfully!');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: Spacing.sm, alignSelf: 'flex-start' },
  backText: { color: Palette.neutralText, fontSize: FontSizes.md, fontWeight: FontWeights.bold },
  continent: { color: Palette.secondary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-end',
    backgroundColor: Palette.success,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: Spacing.sm,
  },
  toastText: { color: Palette.white, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  topRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  bold: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});
