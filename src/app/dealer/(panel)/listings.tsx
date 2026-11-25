import React, { useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { DealerPageTitle } from '@/components/dealer/DealerListing';
import { SearchBox } from '@/components/listing/ListingUI';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import { useListings } from '@/context/listings';
import { DEMO_DEALER_ID, LISTING_OPTIONS, POPULAR_BRANDS, formatPrice, imageSource, type Listing, type ListingStatus } from '@/data';
import { useBreakpoint, Btn, CheckBox, DataTable, Icon, Radio, ToggleSwitch, type Column, ClientOnly } from '@ichrono/ui';

/**
 * Dealer "Listings" – backend_ref/views/dealer/listing/listing.blade.php
 * Tabs Drafts / Live / Pending / Rejected, totals, the listing tables, the "Sort" modal
 * (#sortfiltter) and the brand / category "Filter" panel (#filterbrands).
 * Live = approved by the admin; the switch puts a live watch on / off sale.
 */
type Tab = 'Drafts' | 'Live' | 'Pending' | 'Rejected';
const TABS: Tab[] = ['Drafts', 'Live', 'Pending', 'Rejected'];
const TAB_STATUS: Record<Tab, ListingStatus> = { Drafts: 'draft', Live: 'approved', Pending: 'pending', Rejected: 'rejected' };

const SORTS = [
  { key: 'created_desc', label: 'Creation date (newest first)' },
  { key: 'created_asc', label: 'Creation date (oldest first)' },
  { key: 'brand_asc', label: 'Brand/Model (A-Z)' },
  { key: 'brand_desc', label: 'Brand/Model (Z-A)' },
  { key: 'price_asc', label: 'Price (low-high)' },
  { key: 'price_desc', label: 'Price (high-low)' },
  { key: 'updated_asc', label: 'Last modified (oldest first)' },
  { key: 'updated_desc', label: 'Last modified (newest first)' },
] as const;
type SortKey = (typeof SORTS)[number]['key'];

function sortRows(rows: Listing[], key: SortKey) {
  const name = (l: Listing) => `${l.brand} ${l.model}`.toLowerCase();
  const price = (l: Listing) => Number(l.price) || 0;
  const cmp: Record<SortKey, (a: Listing, b: Listing) => number> = {
    created_desc: (a, b) => b.createdAt - a.createdAt,
    created_asc: (a, b) => a.createdAt - b.createdAt,
    brand_asc: (a, b) => name(a).localeCompare(name(b)),
    brand_desc: (a, b) => name(b).localeCompare(name(a)),
    price_asc: (a, b) => price(a) - price(b),
    price_desc: (a, b) => price(b) - price(a),
    updated_asc: (a, b) => a.updatedAt - b.updatedAt,
    updated_desc: (a, b) => b.updatedAt - a.updatedAt,
  };
  return [...rows].sort(cmp[key]);
}

export default function DealerListings() {
  return (
    <ClientOnly>
      <Page />
    </ClientOnly>
  );
}

function Page() {
  const { mdUp, lgUp } = useBreakpoint();
  const params = useLocalSearchParams<{ tab?: string }>();
  const store = useListings();
  const [tab, setTab] = useState<Tab>(TABS.includes(params.tab as Tab) ? (params.tab as Tab) : 'Drafts');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('created_desc');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [toDelete, setToDelete] = useState<Listing | null>(null);
  const [toast, setToast] = useState('');

  const mine = useMemo(() => store.listings.filter((l) => l.owner === 'dealer' && l.ownerId === DEMO_DEALER_ID), [store.listings]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = mine.filter(
      (l) =>
        l.status === TAB_STATUS[tab] &&
        (!q || `${l.brand} ${l.model} ${l.reference} ${l.serial}`.toLowerCase().includes(q)) &&
        (!brands.length || brands.includes(l.brand)) &&
        (!categories.length || categories.includes(l.category)),
    );
    return sortRows(list, sort);
  }, [mine, tab, query, brands, categories, sort]);

  const tabRows = mine.filter((l) => l.status === TAB_STATUS[tab]);
  const totalValue = tabRows.reduce((s, l) => s + (Number(l.price) || 0), 0);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const view = (l: Listing) => (
    <Pressable onPress={() => router.push(`/dealer/product-details?id=${l.id}` as any)} style={styles.viewBtn} accessibilityRole="button">
      <Text style={styles.viewText}>View</Text>
    </Pressable>
  );
  const editBtn = (l: Listing) => (
    <Pressable
      onPress={() => router.push(`/dealer/listing-info?id=${l.id}` as any)}
      style={styles.actionBtn}
      accessibilityLabel={`Edit ${l.brand} ${l.model}`}
    >
      <Icon name="pen-to-square" size={14} color={Palette.primary} />
    </Pressable>
  );

  const base: Column<Listing>[] = [
    { key: 'sr', title: 'Sr.No.', width: 70, render: (_l, i) => <Text style={styles.td}>{i + 1}</Text> },
    { key: 'brand', title: 'Brand Name', width: 150 },
    { key: 'reference', title: 'Reference number', width: 160 },
    {
      key: 'image',
      title: 'Image',
      width: 90,
      render: (l) =>
        l.images[0] ? (
          <Image source={imageSource(l.images[0])} style={styles.img} resizeMode="cover" />
        ) : (
          <View style={[styles.img, styles.imgEmpty]}>
            <Icon name="image" size={18} color={Palette.borderStrong} />
          </View>
        ),
    },
    { key: 'model', title: tab === 'Live' ? 'Product Name' : 'Model Number', width: 170 },
    { key: 'price', title: 'Price', width: 130, render: (l) => <Text style={styles.td}>{formatPrice(l.price, 2)}</Text> },
  ];

  const analytics: Column<Listing>[] = [
    { key: 'views', title: 'View', width: 80 },
    { key: 'favourites', title: 'Favourites', width: 100 },
    { key: 'messages', title: 'Message', width: 90 },
    {
      key: 'st',
      title: 'Status',
      width: 100,
      render: (l) => (
        <Text style={[styles.td, { textTransform: 'capitalize' }]}>
          {l.status === 'approved' ? (l.active ? 'active' : 'inactive') : l.status}
        </Text>
      ),
    },
    { key: 'view', title: 'View', width: 90, render: view },
  ];

  const columns: Column<Listing>[] =
    tab === 'Drafts'
      ? [
          ...base,
          { key: 'view', title: 'View', width: 90, render: view },
          {
            key: 'action',
            title: 'Action',
            width: 110,
            render: (l) => (
              <View style={styles.inline}>
                {editBtn(l)}
                <Pressable onPress={() => setToDelete(l)} style={styles.actionBtn} accessibilityLabel={`Delete ${l.brand} ${l.model}`}>
                  <Icon name="trash-can" size={14} color={Palette.error} />
                </Pressable>
              </View>
            ),
          },
          {
            key: 'add',
            title: 'Add to list',
            width: 120,
            render: (l) => (
              <Pressable
                onPress={() => {
                  store.setStatus(l.id, 'pending');
                  flash('Product sent for approval');
                }}
                style={styles.viewBtn}
                accessibilityRole="button"
              >
                <Text style={styles.viewText}>Add to list</Text>
              </Pressable>
            ),
          },
        ]
      : tab === 'Live'
        ? [
            ...base,
            ...analytics,
            {
              key: 'action',
              title: 'Action',
              width: 120,
              render: (l) => (
                <View style={styles.inline}>
                  {editBtn(l)}
                  <ToggleSwitch
                    value={l.active}
                    onChange={(v) => {
                      store.update(l.id, { active: v });
                      flash(v ? 'Product is active now' : 'Product is inactive now');
                    }}
                  />
                </View>
              ),
            },
          ]
        : [...base, ...analytics];

  const toggle = (list: string[], set: (l: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <View>
      <DealerPageTitle
        title="Listings"
        right={
          <View style={[styles.right, !mdUp && { width: '100%' }]}>
            <SearchBox value={query} onChangeText={setQuery} placeholder="Search...." style={mdUp ? { width: 260 } : { flex: 1 }} />
            <Pressable onPress={() => router.push('/dealer/create-listing' as any)} style={styles.listBox} accessibilityLabel="Create listing">
              <Icon name="plus" size={16} color={Palette.primary} />
            </Pressable>
            <Pressable onPress={() => router.push('/dealer/listing-settings' as any)} style={styles.listBox} accessibilityLabel="Listing settings">
              <Icon name="gear" size={16} color={Palette.primary} />
            </Pressable>
            <Pressable onPress={() => setFilterOpen(true)} style={styles.listBox} accessibilityLabel="Filter">
              <Icon name="filter" size={15} color={Palette.primary} />
              {brands.length + categories.length ? <View style={styles.badge} /> : null}
            </Pressable>
          </View>
        }
      />

      {toast ? (
        <View style={styles.toast}>
          <Icon name="circle-check" size={14} color={Palette.white} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <View style={[styles.header, !mdUp && { flexDirection: 'column', alignItems: 'flex-start' }]}>
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]} accessibilityRole="tab">
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={() => setSortOpen(true)} style={styles.sortBtn} accessibilityRole="button">
          <Icon name="arrow-down-wide-short" size={14} color={Palette.primary} />
          <Text style={styles.sortText}>Sort by</Text>
          <Icon name="chevron-right" size={11} color={Palette.primary} />
        </Pressable>
      </View>

      <View style={[styles.totals, !lgUp && { flexDirection: 'column' }]}>
        {[
          ['Total Listing Value', formatPrice(totalValue, 2), Palette.secondary],
          ['Total Watches Listed', String(tabRows.length), Palette.success],
          ['Total Accessories', '20,000', Palette.secondary],
        ].map(([k, v, c]) => (
          <View key={k} style={[styles.lsValue, lgUp && { flex: 1 }]}>
            <Text style={[styles.lsTitle, { color: c }]}>{k}</Text>
            <Text style={styles.lsNumber}>{v}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tableWrap}>
        <DataTable key={tab} plain columns={columns} data={rows} keyExtractor={(l) => l.id} emptyText="No products found." />
      </View>

      {/* Sort */}
      <Modal visible={sortOpen} transparent animationType="fade" onRequestClose={() => setSortOpen(false)}>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSortOpen(false)} />
          <View style={styles.sortDialog}>
            <View style={styles.dialogHead}>
              <Text style={styles.dialogTitle}>Sort</Text>
              <Pressable onPress={() => setSortOpen(false)} style={styles.closeBtn} accessibilityLabel="Close">
                <Icon name="xmark" size={14} color={Palette.primary} />
              </Pressable>
            </View>
            {SORTS.map((o) => (
              <Radio
                key={o.key}
                checked={sort === o.key}
                onPress={() => {
                  setSort(o.key);
                  setSortOpen(false);
                }}
                label={o.label}
                style={{ paddingVertical: 8 }}
              />
            ))}
          </View>
        </View>
      </Modal>

      {/* Filter (offcanvas-end) */}
      <FilterPanel
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        brands={brands}
        categories={categories}
        counts={(b) => mine.filter((l) => l.brand === b).length}
        onToggleBrand={(b) => toggle(brands, setBrands, b)}
        onToggleCategory={(c) => toggle(categories, setCategories, c)}
        onClear={() => {
          setBrands([]);
          setCategories([]);
          setFilterOpen(false);
        }}
      />

      <ConfirmDeleteModal
        visible={!!toDelete}
        message="Are you sure you want to delete this product?"
        onNo={() => setToDelete(null)}
        onYes={() => {
          if (toDelete) store.remove(toDelete.id);
          setToDelete(null);
          flash('Product deleted successfully');
        }}
      />
    </View>
  );
}

function FilterPanel({
  visible,
  onClose,
  brands,
  categories,
  counts,
  onToggleBrand,
  onToggleCategory,
  onClear,
}: {
  visible: boolean;
  onClose: () => void;
  brands: string[];
  categories: string[];
  counts: (brand: string) => number;
  onToggleBrand: (b: string) => void;
  onToggleCategory: (c: string) => void;
  onClear: () => void;
}) {
  const [tab, setTab] = useState<'Brand' | 'Category'>('Brand');
  const [q, setQ] = useState('');
  const all = LISTING_OPTIONS.brands.filter((b) => b.toLowerCase().includes(q.trim().toLowerCase()));
  const letters = Array.from(new Set(all.map((b) => b[0].toUpperCase()))).sort();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.drawerBackdrop}>
        <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close filter" />
        <View style={styles.drawer}>
          <View style={styles.dialogHead}>
            <Text style={styles.dialogTitle}>Filter</Text>
            <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <Icon name="xmark" size={14} color={Palette.primary} />
            </Pressable>
          </View>
          <View style={[styles.tabs, { marginBottom: Spacing.lg }]}>
            {(['Brand', 'Category'] as const).map((t) => (
              <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
                <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
              </Pressable>
            ))}
          </View>
          <ScrollView style={{ flex: 1 }}>
            {tab === 'Brand' ? (
              <View>
                <Text style={styles.h3}>Popular Brands</Text>
                <View style={styles.brandLinks}>
                  {POPULAR_BRANDS.slice(0, 4).map((b) => {
                    const name = b === 'Patek Phillipe' ? 'Patek Philippe' : b;
                    const on = brands.includes(name);
                    return (
                      <Pressable key={b} onPress={() => onToggleBrand(name)} style={[styles.brandChip, on && styles.brandChipOn]}>
                        <Text style={[styles.brandChipText, on && { color: Palette.white }]}>{b}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <SearchBox value={q} onChangeText={setQ} placeholder="Search Watch...." style={{ marginVertical: Spacing.lg }} />
                <Text style={styles.h3}>Alphabetically all brands</Text>
                {letters.map((letter) => (
                  <View key={letter} style={{ marginTop: Spacing.md }}>
                    <Text style={styles.letter}>{letter}</Text>
                    {all
                      .filter((b) => b[0].toUpperCase() === letter)
                      .map((b) => (
                        <CheckBox key={b} checked={brands.includes(b)} onChange={() => onToggleBrand(b)} label={`${b}(${counts(b)})`} style={{ paddingVertical: 6 }} />
                      ))}
                  </View>
                ))}
              </View>
            ) : (
              <View>
                {LISTING_OPTIONS.categories.map((c) => (
                  <CheckBox key={c} checked={categories.includes(c)} onChange={() => onToggleCategory(c)} label={c} style={{ paddingVertical: 6 }} />
                ))}
              </View>
            )}
          </ScrollView>
          <View style={styles.drawerBtns}>
            <Btn title="Clear" variant="success" onPress={onClear} style={{ flex: 1 }} />
            <Btn title="Apply" variant="success" onPress={onClose} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  listBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.borderMedium,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.secondary },
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.md, marginBottom: Spacing.lg },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.borderSoft,
  },
  sortText: { color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  totals: { flexDirection: 'row', gap: Spacing.lg },
  lsValue: { backgroundColor: Palette.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.borderSoft, padding: Spacing.xl, gap: 8 },
  lsTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  lsNumber: { color: Palette.primary, fontSize: 26, fontWeight: FontWeights.bold },
  tableWrap: { marginTop: Spacing['2xl'], backgroundColor: Palette.white, borderRadius: Radius.lg, padding: Spacing.md },
  td: { color: Palette.textBody, fontSize: FontSizes.sm },
  img: { width: 56, height: 56, borderRadius: Radius.sm },
  imgEmpty: { backgroundColor: Palette.surfaceSubtle, alignItems: 'center', justifyContent: 'center' },
  viewBtn: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.pill, backgroundColor: Palette.secondary },
  viewText: { color: Palette.white, fontSize: FontSizes.xs, fontWeight: FontWeights.semibold },
  actionBtn: { width: 32, height: 32, borderRadius: Radius.sm, backgroundColor: Palette.surfaceIce, alignItems: 'center', justifyContent: 'center' },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  sortDialog: { width: '100%', maxWidth: 420, backgroundColor: Palette.white, borderRadius: Radius.lg, padding: Spacing.xl },
  dialogHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  dialogTitle: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  drawerBackdrop: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.45)' },
  drawer: { width: 380, maxWidth: '90%', backgroundColor: Palette.white, padding: Spacing.xl },
  h3: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold, marginBottom: Spacing.sm },
  brandLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  brandChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill, borderWidth: 1, borderColor: Palette.borderMedium },
  brandChipOn: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  brandChipText: { color: Palette.primary, fontSize: FontSizes.xs, fontWeight: FontWeights.medium },
  letter: {
    alignSelf: 'flex-start',
    color: Palette.white,
    backgroundColor: Palette.secondary,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    fontWeight: FontWeights.bold,
    marginBottom: 4,
  },
  drawerBtns: { flexDirection: 'row', gap: Spacing.md, paddingTop: Spacing.lg },
});
