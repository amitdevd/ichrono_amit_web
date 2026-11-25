import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { PageTitle } from '@/components/admin/AdminUI';
import { COUNTRIES } from '@/data';
import { useBreakpoint, Radio, DateField, SelectField } from '@ichrono/ui';

/** backend_ref/views/admin/dashboard/index.blade.php */
const PERIODS = ['Today', 'This Week', 'This Months'];

const STATS = [
  { title: 'Total Sales', value: '$215,000' },
  { title: 'Total Revenue', value: '$215,000' },
  { title: 'Total Products', value: '$215,000' },
];

const PANELS = [
  {
    title: 'Total Private Seller Registerd',
    total: '3634',
    items: [
      { label: 'Active', value: '136' },
      { label: 'Inactive', value: '136' },
      { label: 'Verified', value: '36' },
    ],
  },
  {
    title: 'Total Dealer Registerd',
    total: '36456',
    items: [
      { label: 'Active', value: '136' },
      { label: 'Inactive', value: '136' },
      { label: 'Verified', value: '36' },
    ],
  },
  {
    title: 'Total Orders',
    total: '3634',
    items: [
      { label: 'Ongoing', value: '136' },
      { label: 'Completed', value: '136' },
    ],
  },
  {
    title: 'Total users Registerd',
    total: '36456',
    items: [
      { label: 'Active', value: '136' },
      { label: 'Inactive', value: '136' },
    ],
  },
];

export default function AdminDashboard() {
  const { mdUp, isXL, lgUp } = useBreakpoint();
  const [period, setPeriod] = useState('This Months');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [country, setCountry] = useState('');

  const statBasis = isXL ? '31.5%' : mdUp ? '48%' : '100%';
  const filterBasis = lgUp ? '23.5%' : mdUp ? '31.5%' : '100%';

  return (
    <View>
      <View style={[styles.headRow, !mdUp && { flexDirection: 'column', alignItems: 'flex-start' }]}>
        <PageTitle>Welcome to Dashboard</PageTitle>
        <View style={styles.periods}>
          {PERIODS.map((p) => (
            <Radio key={p} checked={period === p} onPress={() => setPeriod(p)} label={p} />
          ))}
        </View>
      </View>

      <View style={[styles.wrap, { marginTop: Spacing['3xl'] }]}>
        <DateField label="From:" value={from} onChange={setFrom} style={{ flexBasis: filterBasis }} />
        <DateField label="To:" value={to} onChange={setTo} style={{ flexBasis: filterBasis }} />
        <SelectField
          label="Country Name"
          value={country}
          onChange={setCountry}
          options={COUNTRIES}
          placeholder="Select Country"
          searchable
          style={{ flexBasis: filterBasis }}
        />
      </View>

      <View style={[styles.wrap, { marginTop: Spacing.md }]}>
        {STATS.map((s) => (
          <View key={s.title} style={[styles.card, { flexBasis: statBasis, flexGrow: 1 }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>{s.title}</Text>
            </View>
            <View style={styles.cardBodyCenter}>
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.wrap, { marginTop: Spacing.xl }]}>
        {PANELS.map((p) => (
          <View key={p.title} style={[styles.card, { flexBasis: lgUp ? '48.5%' : '100%', flexGrow: 1 }]}>
            <View style={[styles.cardHeader, styles.panelHeader]}>
              <Text style={styles.cardHeaderText}>{p.title}</Text>
              <View style={styles.totalPill}>
                <Text style={styles.totalPillText}>{p.total}</Text>
              </View>
            </View>
            <View style={[styles.panelBody, p.items.length === 2 && { justifyContent: 'space-around' }]}>
              {p.items.map((it, idx) => (
                <View
                  key={it.label}
                  style={[
                    styles.saleItem,
                    p.items.length === 3 && idx < 2 && styles.bLine,
                    p.items.length === 3 && { flex: 1 },
                  ]}
                >
                  <Text style={styles.saleLabel}>{it.label}</Text>
                  <Text style={styles.saleValue}>{it.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  periods: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xl },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xl },
  card: {
    backgroundColor: Palette.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    overflow: 'hidden',
    shadowColor: Palette.neutralDark,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeader: {
    backgroundColor: Palette.primary,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardHeaderText: { color: Palette.white, fontSize: FontSizes.lg, fontWeight: FontWeights.medium },
  cardBodyCenter: { paddingVertical: 28, alignItems: 'center' },
  statValue: { color: Palette.neutralTextSoft, fontSize: FontSizes.xl, fontWeight: FontWeights.bold },
  totalPill: {
    backgroundColor: Palette.secondary,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  totalPillText: { color: Palette.white, fontWeight: FontWeights.bold, fontSize: FontSizes.md },
  panelBody: { flexDirection: 'row', paddingVertical: Spacing.xl, paddingHorizontal: Spacing.md },
  saleItem: { alignItems: 'center', paddingHorizontal: Spacing.lg },
  bLine: { borderRightWidth: 1, borderRightColor: Palette.divider },
  saleLabel: { color: Palette.textSecondary, fontSize: FontSizes.md, marginBottom: 6 },
  saleValue: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.bold },
});
