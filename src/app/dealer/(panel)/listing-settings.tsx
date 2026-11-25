import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { CONTINENTS, CONTINENT_COUNTRIES } from '@/data';
import { useBreakpoint, AppModal, Btn, Field, SelectField, RangeSlider, Icon, CheckBox, ToggleSwitch } from '@ichrono/ui';

/**
 * Dealer "Listing Settings" – backend_ref/views/dealer/listing/listingSetting.blade.php
 * (+ editDomesticPrice.blade.php for the edit modal)
 * Tabs: Shipping costs · Destination countries · Taxation method · Order Confirmation · Currency
 */
type Zone = 'domestic' | 'continental' | 'worldwide' | 'uk';
type Cost = { id: number; min: string; max: string; cost: string; free: boolean };

const ZONES: { key: Zone; title: string; addTitle: string }[] = [
  { key: 'domestic', title: 'Domestic', addTitle: 'Add Domestic Shipping Cost' },
  { key: 'continental', title: 'Continental', addTitle: 'Add Continental Shipping Cost' },
  { key: 'worldwide', title: 'Worldwide', addTitle: 'Add Worldwide Shipping Cost' },
  { key: 'uk', title: 'Exception:UK', addTitle: 'Add UK Exception Shipping Cost' },
];

const TABS = ['Shipping costs', 'Destination countries', 'Taxation method', 'Order Confirmation', 'Currency'] as const;
type Tab = (typeof TABS)[number];

const CURRENCIES = [
  ['USD', '$'],
  ['EUR', '€'],
  ['GBP', '£'],
  ['INR', '₹'],
  ['AED', 'د.إ'],
  ['CHF', 'CHF'],
  ['JPY', '¥'],
  ['SGD', 'S$'],
  ['AUD', 'A$'],
  ['CAD', 'C$'],
];

const AUTO = 'Always confirm orders automatically';
const MANUAL = 'Always confirm orders manually';

let nextId = 100;

export default function ListingSettings() {
  const { mdUp, lgUp } = useBreakpoint();
  const [tab, setTab] = useState<Tab>('Shipping costs');
  const [currency, setCurrency] = useState('USD');
  const [savedMsg, setSavedMsg] = useState('');

  // shipping
  const [costs, setCosts] = useState<Record<Zone, Cost[]>>({
    domestic: [
      { id: 1, min: '100', max: '1000', cost: '20', free: false },
      { id: 2, min: '1001', max: '10000', cost: '0', free: true },
    ],
    continental: [{ id: 3, min: '100', max: '5000', cost: '45', free: false }],
    worldwide: [{ id: 4, min: '100', max: '5000', cost: '90', free: false }],
    uk: [],
  });
  const [costModal, setCostModal] = useState<null | { zone: Zone; editing: Cost | null }>(null);
  const [form, setForm] = useState({ min: '', max: '', cost: '', free: false });
  const [formErr, setFormErr] = useState<Record<string, string>>({});
  const [deleting, setDeleting] = useState<null | { zone: Zone; id: number }>(null);

  // destination countries
  const [excluded, setExcluded] = useState<string[]>(['Antarctica']);
  const [openContinent, setOpenContinent] = useState<string | null>('Africa');

  // taxation
  const [tax, setTax] = useState({ include: '1', rate: '', sales: false, percent: '' });
  const [taxErr, setTaxErr] = useState<Record<string, string>>({});

  // order confirmation
  const [order, setOrder] = useState({ suggestions: true, limit: 25, inStock: AUTO, procured: MANUAL });

  const flash = (m: string) => {
    setSavedMsg(m);
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const openCost = (zone: Zone, editing: Cost | null = null) => {
    setForm(editing ? { min: editing.min, max: editing.max, cost: editing.cost, free: editing.free } : { min: '', max: '', cost: '', free: false });
    setFormErr({});
    setCostModal({ zone, editing });
  };

  const saveCost = () => {
    if (!costModal) return;
    const e: Record<string, string> = {};
    if (!form.min) e.min = 'Minimum price is required.';
    if (!form.max) e.max = 'Maximum price is required.';
    else if (form.min && Number(form.max) <= Number(form.min)) e.max = 'Maximum price must be greater than minimum price.';
    if (!form.free && !form.cost) e.cost = 'Shipping cost is required.';
    const others = costs[costModal.zone].filter((c) => c.id !== costModal.editing?.id);
    if (!e.min && !e.max && others.some((c) => Number(form.min) <= Number(c.max) && Number(form.max) >= Number(c.min)))
      e.max = 'This price range overlaps an existing range.';
    setFormErr(e);
    if (Object.keys(e).length) return;
    const row: Cost = { id: costModal.editing?.id ?? ++nextId, min: form.min, max: form.max, cost: form.free ? '0' : form.cost, free: form.free };
    const list = costModal.editing ? costs[costModal.zone].map((c) => (c.id === row.id ? row : c)) : [...costs[costModal.zone], row];
    list.sort((a, b) => Number(a.min) - Number(b.min));
    setCosts({ ...costs, [costModal.zone]: list });
    setCostModal(null);
    flash('Shipping cost saved successfully');
  };

  const num = (t: string) => t.replace(/[^0-9.]/g, '').slice(0, 10);

  const submitTax = () => {
    const e: Record<string, string> = {};
    if (!tax.rate) e.rate = 'Please enter a tax rate';
    else if (Number(tax.rate) > 100) e.rate = 'Tax rate cannot be more than 100';
    if (tax.sales && !tax.percent) e.percent = 'Please enter a sales tax';
    setTaxErr(e);
    if (!Object.keys(e).length) flash('Taxation details saved successfully');
  };

  return (
    <View>
      <View style={styles.titleRow}>
        <Pressable onPress={() => router.push('/dealer/listings' as any)} hitSlop={8}>
          <Icon name="chevron-left" size={18} color={Palette.primary} />
        </Pressable>
        <Text style={styles.h4}>Listing Settings</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {savedMsg ? (
        <View style={styles.toast}>
          <Icon name="circle-check" size={14} color={Palette.white} />
          <Text style={styles.toastText}>{savedMsg}</Text>
        </View>
      ) : null}

      <View style={styles.wrapper}>
        {tab === 'Shipping costs' ? (
          <View style={styles.grid}>
            {ZONES.map((z) => (
              <View key={z.key} style={[styles.lsBox, { flexBasis: lgUp ? '48.5%' : '100%' }]}>
                <View style={styles.slD}>
                  <Text style={styles.slTitle}>{z.title}</Text>
                  <Pressable onPress={() => openCost(z.key)} style={({ hovered }: any) => [styles.addBtn, hovered && { backgroundColor: Palette.surfaceIce }]}>
                    <Icon name="circle-plus" size={14} color={Palette.secondary} />
                    <Text style={styles.addText}>Add</Text>
                  </Pressable>
                </View>
                <View style={styles.tr}>
                  <Text style={[styles.th, { flex: 1.4 }]}>Item price range</Text>
                  <Text style={[styles.th, { flex: 1 }]}>Shipping costs</Text>
                  <Text style={[styles.th, { width: 50, textAlign: 'center' }]}>Edit</Text>
                </View>
                {costs[z.key].length === 0 ? (
                  <Text style={styles.empty}>No shipping cost added yet.</Text>
                ) : (
                  costs[z.key].map((c) => (
                    <View key={c.id} style={styles.tr}>
                      <Text style={[styles.td, { flex: 1.4 }]}>
                        {currency} {c.min} - {currency} {c.max}
                      </Text>
                      <Text style={[styles.td, { flex: 1 }]}>{c.free ? 'Free shipping' : `${currency} ${c.cost}`}</Text>
                      <Pressable onPress={() => openCost(z.key, c)} style={{ width: 50, alignItems: 'center' }} accessibilityLabel="Edit shipping cost">
                        <Icon name="pen-to-square" size={16} color={Palette.secondary} />
                      </Pressable>
                    </View>
                  ))
                )}
              </View>
            ))}
          </View>
        ) : null}

        {tab === 'Destination countries' ? (
          <View>
            <Text style={styles.h3}>List of countries to be excluded</Text>
            <Text style={styles.p}>Buyers from the selected countries will not be able to purchase your listings.</Text>
            {CONTINENTS.map((c) => {
              const open = openContinent === c;
              const list = CONTINENT_COUNTRIES[c] ?? [];
              const n = list.filter((x) => excluded.includes(x)).length;
              return (
                <View key={c} style={styles.accSection}>
                  <Pressable onPress={() => setOpenContinent(open ? null : c)} style={styles.accHeader}>
                    <Text style={styles.accTitle}>
                      {c}
                      {n ? <Text style={styles.accCount}>{`  (${n} excluded)`}</Text> : null}
                    </Text>
                    <Icon name={open ? 'chevron-up' : 'chevron-down'} size={12} color={Palette.primary} />
                  </Pressable>
                  {open ? (
                    <View style={styles.countryGrid}>
                      {list.map((country) => {
                        const on = excluded.includes(country);
                        return (
                          <Pressable
                            key={country}
                            onPress={() => setExcluded(on ? excluded.filter((x) => x !== country) : [...excluded, country])}
                            style={[styles.countryBox, { flexBasis: lgUp ? '23%' : mdUp ? '31%' : '47%' }, on && styles.countryOn]}
                          >
                            <Text style={[styles.countryName, on && { color: Palette.white }]} numberOfLines={1}>
                              {country}
                            </Text>
                            {on ? <Icon name="check" size={12} color={Palette.white} /> : null}
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              );
            })}
            <Btn title="Submit" variant="customBtn" style={styles.submit} onPress={() => flash(`${excluded.length} countries excluded`)} />
          </View>
        ) : null}

        {tab === 'Taxation method' ? (
          <View style={styles.narrow}>
            <Text style={styles.h3}>Specify the taxation method for your listings</Text>
            <Text style={styles.p}>
              Specify whether your prices generally include taxes or not. Please make sure that the prices in your listings correspond to the settings
              below. Please note that we cannot take margin-scheme taxation into account for dealers outside the European Union.
            </Text>
            <Text style={styles.tagline}>
              Please ensure the information is correct. Once submitted, you will have to contact our support team to make any changes. To make
              changes, please contact us here: support@andydevdesign.com
            </Text>
            <SelectField
              label="Do your item prices include taxes?"
              value={tax.include}
              onChange={(v) => setTax({ ...tax, include: v })}
              options={[
                { label: 'Exclusive of taxes', value: '1' },
                { label: 'Inclusive of taxes', value: '2' },
              ]}
            />
            <Field
              label="Please enter a tax rate"
              placeholder="Please enter a tax rate"
              value={tax.rate}
              onChangeText={(t) => {
                setTax({ ...tax, rate: num(t) });
                setTaxErr({ ...taxErr, rate: '' });
              }}
              keyboardType="decimal-pad"
              error={taxErr.rate}
            />
            <Text style={[styles.h3, { marginTop: Spacing.md }]}>Automatically add taxes for domestic sales</Text>
            <Text style={styles.p}>
              Make sure that prospective customers from within your country see your item prices including the tax rates listed below. This removes
              the need for manual adjustments during the sales process. Potential buyers from other countries will still see the prices without local
              taxes.
            </Text>
            <View style={styles.taxPnl}>
              <Text style={styles.label}>Add Sales tax</Text>
              <ToggleSwitch value={tax.sales} onChange={(v) => setTax({ ...tax, sales: v })} />
            </View>
            <Field
              placeholder="Please enter a sales tax"
              value={tax.percent}
              onChangeText={(t) => {
                setTax({ ...tax, percent: num(t) });
                setTaxErr({ ...taxErr, percent: '' });
              }}
              editable={tax.sales}
              keyboardType="decimal-pad"
              error={taxErr.percent}
            />
            <Btn title="Submit" variant="customBtn" style={styles.submit} onPress={submitTax} />
          </View>
        ) : null}

        {tab === 'Order Confirmation' ? (
          <View style={styles.narrow}>
            <Text style={styles.h3}>Order confirmation</Text>
            <Text style={styles.heading3}>Price suggestions</Text>
            <Text style={styles.p}>
              Activate this option if you&apos;d like to be able to receive price suggestions from potential buyers. You can also set how much lower a
              suggested price can be compared to the listing price.
            </Text>
            <View style={styles.taxPnl}>
              <Text style={styles.label}>Receive Price Suggestions</Text>
              <ToggleSwitch value={order.suggestions} onChange={(v) => setOrder({ ...order, suggestions: v })} />
            </View>

            <View style={[styles.setLimit, !order.suggestions && { opacity: 0.5 }]} pointerEvents={order.suggestions ? 'auto' : 'none'}>
              <Text style={[styles.heading3, { color: Palette.loginBack }]}>Set A Limit On Price Suggestion</Text>
              <Text style={styles.p}>
                Select how much lower price suggestions can be compared to your listing price. Price suggestions that are any lower will be
                automatically rejected.
              </Text>
              <RangeSlider value={order.limit} onChange={(v) => setOrder({ ...order, limit: v })} disabled={!order.suggestions} />
              <View style={styles.sliderLabels}>
                {['0%', '25%', '50%', '75%', 'Max 100%'].map((l) => (
                  <Text key={l} style={styles.sliderLabel}>
                    {l}
                  </Text>
                ))}
              </View>
              <View style={styles.pctRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.groupText}>%</Text>
                  <TextInput value={String(order.limit)} editable={false} style={[styles.groupInput, { outlineStyle: 'none' } as any]} />
                </View>
                <Text style={styles.muted}>= List Price</Text>
              </View>
              <Text style={[styles.p, { color: Palette.loginBack }]}>
                If the listing price is $10,000 and a limit of {order.limit}% is applied, suggestions of $
                {(10000 * (1 - order.limit / 100)).toLocaleString()} or more will be allowed.
              </Text>
            </View>

            <View style={styles.check}>
              <Icon name="lightbulb" size={18} color={Palette.secondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.heading3}>Our Recommendation!</Text>
                <Text style={styles.p}>Based on experience, selecting 50% will disqualify most unrealistically low price suggestions.</Text>
              </View>
            </View>

            <Text style={styles.heading3}>Order Confirmation</Text>
            <Text style={styles.p}>Here you can select whether you want to automatically or manually confirm orders.</Text>
            <Text style={styles.heading3}>Always confirm orders automatically</Text>
            <Text style={styles.p}>
              You will receive a confirmation email. Afterward, you need to ship the item and confirm shipment. The purchase process is finished once
              you&apos;ve confirmed shipment with Andy Dev Design.
            </Text>
            <Text style={styles.heading3}>Always confirm orders manually</Text>
            <Text style={styles.p}>You&apos;ll then receive a notification email with options to confirm, edit, or reject the order.</Text>
            <SelectField label="Item is in stock" value={order.inStock} onChange={(v) => setOrder({ ...order, inStock: v })} options={[AUTO, MANUAL]} />
            <SelectField label="Items needs be procured" value={order.procured} onChange={(v) => setOrder({ ...order, procured: v })} options={[AUTO, MANUAL]} />
            <Btn title="Save" variant="customBtn" style={styles.submit} onPress={() => flash('Order confirmation settings saved')} />
          </View>
        ) : null}

        {tab === 'Currency' ? (
          <View style={styles.narrow}>
            <Text style={styles.h3}>Select the currency for your listings</Text>
            <View style={styles.currencyList}>
              {CURRENCIES.map(([code, sym]) => {
                const on = currency === code;
                return (
                  <Pressable key={code} onPress={() => setCurrency(code)} style={({ hovered }: any) => [styles.currencyItem, (on || hovered) && styles.currencyOn]}>
                    <Text style={[styles.currencyText, on && { color: Palette.primary, fontWeight: FontWeights.semibold }]}>
                      {code} ({sym})
                    </Text>
                    {on ? <Icon name="circle-check" size={16} color={Palette.success} /> : null}
                  </Pressable>
                );
              })}
            </View>
            <Btn title="Save Currency" variant="customBtn" style={styles.submit} onPress={() => flash(`Currency set to ${currency}`)} />
          </View>
        ) : null}
      </View>

      {/* Add / Edit shipping cost */}
      <AppModal
        visible={!!costModal}
        onClose={() => setCostModal(null)}
        title={costModal?.editing ? 'Edit Shipping Cost' : ZONES.find((z) => z.key === costModal?.zone)?.addTitle}
        showClose
        width={480}
      >
        <Text style={styles.label}>Item price range</Text>
        <View style={styles.rangeRow}>
          <CurrencyInput currency={currency} value={form.min} onChange={(t) => setForm({ ...form, min: num(t) })} error={formErr.min} />
          <Text style={styles.dash}>–</Text>
          <CurrencyInput currency={currency} value={form.max} onChange={(t) => setForm({ ...form, max: num(t) })} error={formErr.max} />
        </View>
        <Text style={[styles.label, { marginTop: Spacing.md }]}>Shipping cost</Text>
        <CurrencyInput currency={currency} value={form.free ? '0' : form.cost} editable={!form.free} onChange={(t) => setForm({ ...form, cost: num(t) })} error={formErr.cost} />
        <CheckBox checked={form.free} onChange={(v) => setForm({ ...form, free: v })} label="Free shipping" style={{ paddingVertical: Spacing.lg }} />
        {costModal?.editing ? (
          <View style={styles.modalBtns}>
            <Btn
              title="Delete"
              variant="outline"
              textStyle={{ color: Palette.error }}
              style={{ flex: 1, borderColor: Palette.error, height: 48 }}
              onPress={() => {
                setDeleting({ zone: costModal.zone, id: costModal.editing!.id });
                setCostModal(null);
              }}
            />
            <Btn title="Edit Cost" variant="success" style={{ flex: 1 }} onPress={saveCost} />
          </View>
        ) : (
          <Btn title="Save Cost" variant="success" onPress={saveCost} style={{ marginTop: Spacing.sm }} />
        )}
      </AppModal>

      {/* Delete */}
      <AppModal visible={!!deleting} onClose={() => setDeleting(null)} width={420}>
        <View style={styles.deleteBody}>
          <View style={styles.trashBox}>
            <Icon name="trash-can" size={28} color={Palette.error} solid={false} />
          </View>
          <Text style={styles.deleteTitle}>Are you sure you want to delete this shipping cost?</Text>
          <View style={styles.modalBtns}>
            <Btn title="Cancel" variant="success" style={{ flex: 1 }} onPress={() => setDeleting(null)} />
            <Btn
              title="Delete"
              variant="outline"
              textStyle={{ color: Palette.error }}
              style={{ flex: 1, borderColor: Palette.error, height: 48 }}
              onPress={() => {
                if (deleting) setCosts({ ...costs, [deleting.zone]: costs[deleting.zone].filter((c) => c.id !== deleting.id) });
                setDeleting(null);
                flash('Shipping cost deleted');
              }}
            />
          </View>
        </View>
      </AppModal>
    </View>
  );
}

function CurrencyInput({
  currency,
  value,
  onChange,
  error,
  editable = true,
}: {
  currency: string;
  value: string;
  onChange: (t: string) => void;
  error?: string;
  editable?: boolean;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.inputGroup, { width: '100%' }, !!error && { borderColor: Palette.error }, !editable && { backgroundColor: Palette.surfaceMuted }]}>
        <Text style={styles.groupText}>{currency}</Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          editable={editable}
          placeholder="For e.g. 100"
          placeholderTextColor={Palette.loginBack}
          keyboardType="decimal-pad"
          style={[styles.groupInput, { outlineStyle: 'none' } as any]}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: Spacing.xl },
  h4: { color: Palette.primary, fontSize: 24, fontWeight: FontWeights.semibold },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.lg },
  tab: {
    paddingHorizontal: 18,
    height: 40,
    justifyContent: 'center',
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Palette.borderMedium,
    backgroundColor: Palette.white,
  },
  tabActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  tabText: { color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  tabTextActive: { color: Palette.white },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-end',
    backgroundColor: Palette.success,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: Spacing.md,
  },
  toastText: { color: Palette.white, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  wrapper: {
    backgroundColor: Palette.white,
    borderRadius: 10,
    padding: Spacing.xl,
    shadowColor: Palette.primary,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xl },
  lsBox: { flexGrow: 1, borderWidth: 1, borderColor: Palette.divider, borderRadius: Radius.lg, padding: Spacing.lg },
  slD: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  slTitle: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Palette.secondary,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  addText: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  tr: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Palette.divider },
  th: { color: Palette.textSecondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  td: { color: Palette.textBody, fontSize: FontSizes.sm },
  empty: { color: Palette.textMuted, fontSize: FontSizes.sm, paddingVertical: Spacing.lg, textAlign: 'center' },
  h3: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold, marginBottom: Spacing.sm },
  heading3: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold, marginTop: Spacing.md, marginBottom: 4 },
  p: { color: Palette.textSecondary, fontSize: FontSizes.sm, lineHeight: 21, marginBottom: Spacing.md },
  tagline: {
    color: Palette.primary,
    fontSize: FontSizes.sm,
    lineHeight: 21,
    backgroundColor: Palette.surfaceIce,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  narrow: { maxWidth: 820 },
  label: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.medium, marginBottom: 6 },
  taxPnl: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md, maxWidth: 420 },
  submit: { alignSelf: 'flex-start', paddingHorizontal: 40, marginTop: Spacing.lg },
  accSection: { borderWidth: 1, borderColor: Palette.divider, borderRadius: Radius.md, marginBottom: Spacing.sm, overflow: 'hidden' },
  accHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Palette.surfaceSubtle,
  },
  accTitle: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  accCount: { color: Palette.secondary, fontSize: FontSizes.sm },
  countryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: Spacing.lg },
  countryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    borderWidth: 1,
    borderColor: Palette.loginBack,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  countryOn: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  countryName: { flex: 1, color: Palette.textBody, fontSize: FontSizes.sm },
  setLimit: { marginBottom: Spacing.md },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  sliderLabel: { color: Palette.textSecondary, fontSize: FontSizes.xs },
  pctRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: Spacing.md },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    width: 120,
    borderWidth: 1,
    borderColor: Palette.loginBack,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Palette.white,
  },
  groupText: {
    paddingHorizontal: 10,
    height: '100%',
    textAlignVertical: 'center',
    lineHeight: 42,
    backgroundColor: Palette.surfaceMuted,
    color: Palette.textBody,
    fontSize: FontSizes.sm,
  },
  groupInput: { flex: 1, height: '100%', paddingHorizontal: 8, color: Palette.textBody, fontSize: FontSizes.sm },
  muted: { color: Palette.textMuted, fontSize: FontSizes.sm },
  check: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Palette.goldMuted,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  currencyList: { borderWidth: 1, borderColor: Palette.divider, borderRadius: Radius.md, marginVertical: Spacing.md, maxWidth: 420 },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
  },
  currencyOn: { backgroundColor: Palette.surfaceIce },
  currencyText: { color: Palette.textBody, fontSize: FontSizes.sm },
  rangeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  dash: { color: Palette.textSecondary, lineHeight: 44 },
  error: { color: Palette.error, fontSize: FontSizes.xs, marginTop: 4 },
  modalBtns: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md, alignSelf: 'stretch' },
  deleteBody: { alignItems: 'center', paddingVertical: Spacing.lg },
  trashBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteTitle: { marginTop: Spacing.lg, color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold, textAlign: 'center' },
});
