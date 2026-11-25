import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { Card, PageTitle, TableAction } from '@/components/admin/AdminUI';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import { CONTINENT_COUNTRIES, type Banner } from '@/data';
import { useSiteContent } from '@/context/site-content';
import { useBreakpoint, Btn, AppModal, Field, SelectField, MultiSelectField, DateField, ToggleSwitch, AvatarUpload, DataTable, type Column } from '@ichrono/ui';

/**
 * Advertisement (banner) management for the User Web home carousel
 * backend_ref/views/admin/banner/index.blade.php
 */
const ALL_COUNTRIES = Array.from(new Set(Object.values(CONTINENT_COUNTRIES).flat())).sort();

type Form = { image: string | null; title: string; brand: string; countries: string[]; start: string; end: string };
const EMPTY: Form = { image: null, title: '', brand: '', countries: [], start: '', end: '' };

function fmt(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

export default function BannerManagement() {
  const { mdUp } = useBreakpoint();
  const { banners, setBanners, brands } = useSiteContent();
  const brandNames = brands.filter((b) => b.active).map((b) => b.name);
  const [country, setCountry] = useState('');
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'delete' | 'countries'>(null);
  const [current, setCurrent] = useState<Banner | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});

  const rows = useMemo(() => (country ? banners.filter((b) => b.countries.includes(country)) : banners), [banners, country]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const open = (m: 'add' | 'edit' | 'delete' | 'countries', b?: Banner) => {
    setCurrent(b ?? null);
    setForm(b ? { image: b.image, title: b.title, brand: b.brand, countries: b.countries, start: b.start, end: b.end } : EMPTY);
    setErrors({});
    setModal(m);
  };

  const save = () => {
    const e: typeof errors = {};
    if (modal === 'add' && !form.image) e.image = 'The image field is required.';
    if (!form.title.trim()) e.title = 'The title field is required.';
    if (!form.brand) e.brand = 'The brand field is required.';
    if (!form.countries.length) e.countries = 'Please select at least one country.';
    if (!form.start) e.start = 'The start date field is required.';
    if (!form.end) e.end = 'The end date field is required.';
    else if (form.start && form.end < form.start) e.end = 'The end date must be a date after or equal to start date.';
    setErrors(e);
    if (Object.keys(e).length) return;
    if (modal === 'add') {
      const id = Math.max(0, ...banners.map((b) => b.id)) + 1;
      const today = new Date().toISOString().slice(0, 10);
      setBanners([{ id, ...form, title: form.title.trim(), added: today, active: true }, ...banners]);
    } else if (current) {
      setBanners(banners.map((b) => (b.id === current.id ? { ...b, ...form, title: form.title.trim() } : b)));
    }
    setModal(null);
  };

  const columns: Column<Banner>[] = [
    { key: 'sr', title: 'SR No.', width: 80, render: (_r, i) => <Text style={styles.bold}>{i + 1}</Text> },
    {
      key: 'image',
      title: 'Banner image',
      width: 120,
      render: (b) => (
        <Image source={b.image ? { uri: b.image } : require('@/assets/images/banner.png')} style={styles.square} resizeMode="cover" />
      ),
    },
    { key: 'title', title: 'Title', width: 180 },
    {
      key: 'country',
      title: 'Country',
      width: 100,
      align: 'center',
      searchValue: (b) => b.countries.join(' '),
      render: (b) => <TableAction icon="eye" label="View countries" onPress={() => open('countries', b)} />,
    },
    { key: 'brand', title: 'Linked with (Brand)', width: 170 },
    { key: 'start', title: 'Start date', width: 120, render: (b) => <Text style={styles.td}>{fmt(b.start)}</Text> },
    { key: 'end', title: 'End date', width: 120, render: (b) => <Text style={styles.td}>{fmt(b.end)}</Text> },
    { key: 'added', title: 'Added on', width: 120, render: (b) => <Text style={styles.td}>{fmt(b.added)}</Text> },
    {
      key: 'status',
      title: 'Status',
      width: 100,
      render: (b) => (
        <View style={[styles.badge, !b.active && styles.badgeOff]}>
          <Text style={[styles.badgeText, !b.active && { color: Palette.textSecondary }]}>{b.active ? 'Active' : 'Inactive'}</Text>
        </View>
      ),
    },
    {
      key: 'action',
      title: 'Action',
      width: 170,
      align: 'center',
      render: (b) => (
        <View style={styles.actions}>
          <TableAction icon="create-outline" label="Edit" onPress={() => open('edit', b)} />
          <TableAction icon="trash" label="Delete" onPress={() => open('delete', b)} />
          <ToggleSwitch value={b.active} onChange={(v) => setBanners(banners.map((x) => (x.id === b.id ? { ...x, active: v } : x)))} />
        </View>
      ),
    },
  ];

  return (
    <View>
      <PageTitle>Banner Management</PageTitle>
      <Card style={{ marginTop: Spacing['2xl'] }}>
        <View style={[styles.topRow, !mdUp && { flexDirection: 'column', alignItems: 'stretch' }]}>
          <SelectField
            label="Choose country"
            value={country}
            onChange={setCountry}
            options={[{ label: 'Select Country', value: '' }, ...ALL_COUNTRIES.map((c) => ({ label: c, value: c }))]}
            placeholder="Select Country"
            searchable
            style={{ width: mdUp ? 320 : '100%', marginBottom: 0 }}
          />
          <Btn title="Add New Banner" variant="customBtn" onPress={() => open('add')} style={{ width: mdUp ? 260 : '100%' }} />
        </View>
        <View style={{ marginTop: Spacing['3xl'] }}>
          <DataTable columns={columns} data={rows} keyExtractor={(b) => String(b.id)} />
        </View>
      </Card>

      {/* Add / Edit */}
      <AppModal visible={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Add New Banner' : 'Edit'}>
        <Text style={styles.label}>Upload images</Text>
        <AvatarUpload uri={form.image} onChange={(u) => set('image', u)} />
        <Text style={styles.hint}>The image dimensions must be 1920 × 780 pixels</Text>
        {errors.image ? <Text style={styles.errorCenter}>{errors.image}</Text> : null}
        <Field label="Title" placeholder="Eg Diwali Offer" value={form.title} onChangeText={(t) => set('title', t)} error={errors.title} autoCapitalize="words" style={{ marginTop: Spacing.lg }} />
        <SelectField label="Select Brand" value={form.brand} onChange={(v) => set('brand', v)} options={brandNames} placeholder="-- Select Brand --" searchable error={errors.brand} />
        <MultiSelectField label="Select Country" values={form.countries} onChange={(v) => set('countries', v)} options={ALL_COUNTRIES} placeholder="Select Country" error={errors.countries} />
        <View style={styles.dates}>
          <View style={{ flex: 1 }}>
            <DateField label="From:" value={form.start} onChange={(v) => set('start', v)} style={{ marginBottom: 0 }} />
            {errors.start ? <Text style={styles.error}>{errors.start}</Text> : null}
          </View>
          <View style={{ flex: 1 }}>
            <DateField label="To:" value={form.end} onChange={(v) => set('end', v)} style={{ marginBottom: 0 }} />
            {errors.end ? <Text style={styles.error}>{errors.end}</Text> : null}
          </View>
        </View>
        <View style={styles.modalBtns}>
          <Btn title="Cancel" onPress={() => setModal(null)} />
          <Btn title={modal === 'add' ? 'Save' : 'Save changes'} onPress={save} />
        </View>
      </AppModal>

      {/* Countries (#sentModal3) */}
      <AppModal visible={modal === 'countries'} onClose={() => setModal(null)} title="Country" showClose>
        {current?.countries.map((c, i) => (
          <View key={c} style={[styles.countryRow, i === current.countries.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={styles.td}>{i + 1}.</Text>
            <Text style={styles.td}>{c}</Text>
          </View>
        ))}
      </AppModal>

      <ConfirmDeleteModal
        visible={modal === 'delete'}
        onNo={() => setModal(null)}
        onYes={() => {
          if (current) setBanners(banners.filter((b) => b.id !== current.id));
          setModal(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: Spacing.lg },
  bold: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: '700' },
  td: { color: Palette.textBody, fontSize: FontSizes.sm },
  square: { width: 73, height: 30, borderRadius: Radius.xs, backgroundColor: Palette.surfaceMuted },
  badge: { alignSelf: 'flex-start', backgroundColor: Palette.successBg, borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  badgeOff: { backgroundColor: Palette.surfaceMuted },
  badgeText: { color: Palette.success, fontSize: FontSizes.xs, fontWeight: FontWeights.semibold },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  label: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: '500', marginBottom: 6 },
  hint: { textAlign: 'center', color: Palette.textBody, fontSize: FontSizes.xs, fontWeight: '600' },
  errorCenter: { color: Palette.error, fontSize: FontSizes.xs, textAlign: 'center', marginTop: 4 },
  error: { color: Palette.error, fontSize: FontSizes.xs, marginTop: 4 },
  dates: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  modalBtns: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: Spacing.lg },
  countryRow: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Palette.divider },
});
