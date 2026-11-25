import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { BRAND_NAME } from '@/constants/brand';
import { CATALOG, LISTING_OPTIONS, imageSource, type CatalogWatch } from '@/data';
import { useBreakpoint, Icon, SelectField } from '@ichrono/ui';
import { SearchBox } from './ListingUI';

/**
 * "Create listing" landing (user/Listinguser/createlisting.blade.php, dealer/listing/create.blade.php):
 * search by brand / model / reference with a suggestion dropdown, "Where do I find my watch's
 * reference number?" and "Success in 4 simple steps!". The icons stand in for dialog-ic.svg,
 * paper.svg, case-ic.svg and cr-1…cr-4.svg, which are not part of backend_ref.
 */
const WHERE = [
  { icon: 'clock', label: 'On the Dial' },
  { icon: 'file-lines', label: "In the Watch's Papers" },
  { icon: 'circle-half-stroke', label: 'On the Case back' },
];

const STEPS = [
  { icon: 'file-circle-plus', label: 'Create a free listing' },
  { icon: 'users', label: 'Find potential buyers' },
  { icon: 'shield-halved', label: 'Secure sales all around' },
  { icon: 'hand-holding-dollar', label: 'Receive payment quickly' },
];

/** Suggestions: catalogue models first, then brands */
function suggestions(q: string) {
  const t = q.trim().toLowerCase();
  const models = CATALOG.map((c) => `${c.brand} ${c.model}`);
  const all = Array.from(new Set([...models, ...LISTING_OPTIONS.brands]));
  return (t ? all.filter((s) => s.toLowerCase().includes(t)) : all).slice(0, 8);
}

export function StartSelling({ onSearch }: { onSearch: (query: string) => void }) {
  const { mdUp, lgUp } = useBreakpoint();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const list = useMemo(() => suggestions(q), [q]);

  return (
    <View>
      <View style={[styles.wrap, { zIndex: 5 }]}>
        <Text style={styles.h3}>Start Selling on {BRAND_NAME}</Text>
        <View style={{ marginTop: Spacing.lg, zIndex: 5 }}>
          <SearchBox
            value={q}
            onChangeText={(t) => {
              setQ(t);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onSubmit={() => onSearch(q)}
            placeholder="Search by brand , model , reference No....."
          />
          {open && list.length ? (
            <View style={styles.dropdown}>
              {list.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => {
                    setQ(s);
                    setOpen(false);
                    onSearch(s);
                  }}
                  style={({ hovered }: any) => [styles.dropItem, hovered && { backgroundColor: Palette.surfaceIce }]}
                >
                  <Text style={styles.dropText}>{s}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.h4}>Where do I Find my watch&apos;s reference number?</Text>
        <View style={[styles.grid, !mdUp && { flexDirection: 'column' }]}>
          {WHERE.map((w) => (
            <View key={w.label} style={[styles.box, mdUp && { flex: 1 }]}>
              <View style={styles.boxIcon}>
                <Icon name={w.icon} size={30} color={Palette.primary} />
              </View>
              <Text style={styles.boxText}>{w.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.h3}>Success in 4 simple steps !</Text>
        <View style={[styles.grid, !lgUp && { flexWrap: 'wrap' }]}>
          {STEPS.map((st, i) => (
            <View key={st.label} style={[styles.box1, lgUp ? { flex: 1 } : { flexBasis: mdUp ? '47%' : '100%' }]}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Icon name={st.icon} size={30} color={Palette.secondary} />
              <Text style={styles.boxText}>{st.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Results grid (user/Listinguser/startselling.blade.php, dealer/listing/get_list.blade.php) ─
export function CatalogResults({
  query,
  onQueryChange,
  onSelect,
  onManual,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  onSelect: (w: CatalogWatch) => void;
  onManual: () => void;
}) {
  const { mdUp, lgUp } = useBreakpoint();
  const [caseMaterial, setCaseMaterial] = useState('');
  const [dialColor, setDialColor] = useState('');
  const [diameter, setDiameter] = useState('');

  const rows = useMemo(() => {
    const t = query.trim().toLowerCase();
    const dia = LISTING_OPTIONS.diameters.find((d) => d.label === diameter);
    return CATALOG.filter(
      (c) =>
        (!t || `${c.brand} ${c.model} ${c.reference}`.toLowerCase().includes(t) || t.includes(c.brand.toLowerCase())) &&
        (!caseMaterial || c.caseMaterial === caseMaterial) &&
        (!dialColor || c.dialColor === dialColor) &&
        (!dia || (Number(c.diameterMax) >= dia.min && Number(c.diameterMin) <= dia.max)),
    );
  }, [query, caseMaterial, dialColor, diameter]);

  const col = lgUp ? '31.8%' : mdUp ? '48%' : '100%';

  return (
    <View>
      <View style={[styles.titleRow, !mdUp && { flexDirection: 'column', alignItems: 'stretch' }]}>
        <Text style={styles.h4Title}>Listings</Text>
        <SearchBox value={query} onChangeText={onQueryChange} placeholder="Search...." style={mdUp ? { width: 320 } : null} />
      </View>

      <View style={[styles.filters, !mdUp && { flexDirection: 'column' }]}>
        <SelectField
          value={caseMaterial}
          onChange={setCaseMaterial}
          options={[{ label: 'Case Material', value: '' }, ...LISTING_OPTIONS.caseMaterials]}
          placeholder="Case Material"
          style={[styles.filter, mdUp && { flex: 1 }]}
          compact
        />
        <SelectField
          value={dialColor}
          onChange={setDialColor}
          options={[{ label: 'Dial Color', value: '' }, ...LISTING_OPTIONS.dialColors]}
          placeholder="Dial Color"
          style={[styles.filter, mdUp && { flex: 1 }]}
          compact
        />
        <SelectField
          value={diameter}
          onChange={setDiameter}
          options={[{ label: 'Diameter', value: '' }, ...LISTING_OPTIONS.diameters.map((d) => d.label)]}
          placeholder="Diameter"
          style={[styles.filter, mdUp && { flex: 1 }]}
          compact
        />
      </View>

      <View style={[styles.manual, !mdUp && { flexDirection: 'column', alignItems: 'flex-start' }]}>
        <Text style={styles.manualH5}>Can’t find the right model?</Text>
        <Pressable onPress={onManual} accessibilityRole="link">
          <Text style={styles.manualLink}>Click here to add watch details manually</Text>
        </Pressable>
      </View>

      <View style={styles.cards}>
        {rows.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => onSelect(c)}
            accessibilityRole="button"
            accessibilityLabel={`${c.brand} ${c.model}`}
            style={({ hovered }: any) => [styles.card, { width: col as any }, hovered && styles.cardHover]}
          >
            <View style={styles.figure}>
              <Image source={imageSource(c.image)} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <View style={styles.cardHead}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardBrand}>{c.brand}</Text>
                <Text style={styles.cardRef}>{c.reference}</Text>
              </View>
              <Text style={styles.cardModel} numberOfLines={2}>
                {c.model}
              </Text>
            </View>
            {[
              ['Case', c.caseMaterial],
              ['Dial', c.dialColor],
              ['Diameter', `${c.diameterMin} - ${c.diameterMax} mm`],
            ].map(([k, v]) => (
              <View key={k} style={styles.caseList}>
                <Text style={styles.caseSub}>{k}</Text>
                <Text style={styles.caseVal}>{v}</Text>
              </View>
            ))}
          </Pressable>
        ))}
        {!rows.length ? <Text style={styles.empty}>No data found.</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: Palette.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.borderSoft, padding: Spacing['2xl'] },
  h3: { color: Palette.primary, fontSize: FontSizes['2xl'], fontWeight: FontWeights.semibold },
  h4: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  h4Title: { color: Palette.primary, fontSize: 24, fontWeight: FontWeights.semibold },
  dropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.borderSoft,
    borderRadius: Radius.md,
    paddingVertical: 6,
    shadowColor: Palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  dropItem: { paddingHorizontal: 16, paddingVertical: 10 },
  dropText: { color: Palette.textBody, fontSize: FontSizes.sm },
  section: { marginTop: Spacing['3xl'] },
  grid: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.xl },
  box: {
    alignItems: 'center',
    gap: 14,
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.lg,
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.borderSoft,
  },
  boxIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: Palette.surfaceIce, alignItems: 'center', justifyContent: 'center' },
  box1: {
    alignItems: 'center',
    gap: 14,
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.lg,
    backgroundColor: Palette.surfaceIce,
    borderRadius: Radius.lg,
    position: 'relative',
  },
  stepNum: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: Palette.white, fontSize: FontSizes.xs, fontWeight: FontWeights.bold },
  boxText: { color: Palette.textBody, fontSize: FontSizes.md, fontWeight: FontWeights.medium, textAlign: 'center' },

  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.lg, marginBottom: Spacing.xl },
  filters: {
    flexDirection: 'row',
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.borderSoft,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  filter: {},
  manual: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing['2xl'],
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceIce,
  },
  manualH5: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  manualLink: { color: Palette.secondary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold, textDecorationLine: 'underline' },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: '2%' as any, rowGap: Spacing.xl, marginTop: Spacing.xl },
  card: { backgroundColor: Palette.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.borderSoft, overflow: 'hidden', paddingBottom: Spacing.md },
  cardHover: { borderColor: Palette.secondary, transform: [{ translateY: -2 }] },
  figure: { height: 190, backgroundColor: Palette.surfaceSubtle, marginBottom: Spacing.md },
  cardHead: { flexDirection: 'row', gap: 10, paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  cardBrand: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
  cardRef: { color: Palette.textSecondary, fontSize: FontSizes.xs, marginTop: 2 },
  cardModel: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, maxWidth: '45%', textAlign: 'right' },
  caseList: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: 6 },
  caseSub: { color: Palette.textSecondary, fontSize: FontSizes.sm },
  caseVal: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  empty: { color: Palette.textMuted, fontSize: FontSizes.sm, width: '100%', textAlign: 'center', paddingVertical: Spacing['3xl'] },
});
