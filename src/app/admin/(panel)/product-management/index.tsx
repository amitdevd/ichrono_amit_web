import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { Card, PageTitle, TableAction } from '@/components/admin/AdminUI';
import { useListings } from '@/context/listings';
import { COUNTRIES, LISTING_OPTIONS, formatPrice, imageSource, listingTitle, type Listing, type ListingOwner, type ListingStatus } from '@/data';
import { useBreakpoint, AppModal, Btn, ClientOnly, DataTable, Field, Icon, SelectField, ToggleSwitch, type Column } from '@ichrono/ui';

/**
 * Admin "Product Management" – backend_ref/views/admin/product/index.blade.php
 *  User / Admin / Dealer tabs; User and Dealer have Approved · Verification · Rejected,
 *  Admin (watches added by the admin) has Approved only.
 *  Filters: country, gender, sort by name, sort by price; "Add New Watch" and "Import".
 *  Verification → approve (check) / reject with a reason (×); Rejected → view the reason.
 */
type Sub = 'approved' | 'pending' | 'rejected';
const SOURCES: { key: ListingOwner; label: string }[] = [
  { key: 'user', label: 'User' },
  { key: 'admin', label: 'Admin' },
  { key: 'dealer', label: 'Dealer' },
];
const SUBS: { key: Sub; label: string }[] = [
  { key: 'approved', label: 'Approved' },
  { key: 'pending', label: 'Verification' },
  { key: 'rejected', label: 'Rejected' },
];
type Filters = { country: string; gender: string; sortName: string; sortPrice: string };
const EMPTY: Filters = { country: '', gender: '', sortName: '', sortPrice: '' };

export default function ProductManagement() {
  return (
    <ClientOnly>
      <Page />
    </ClientOnly>
  );
}

function Page() {
  const { mdUp, lgUp } = useBreakpoint();
  const params = useLocalSearchParams<{ source?: string }>();
  const store = useListings();
  const [source, setSource] = useState<ListingOwner>(SOURCES.some((s) => s.key === params.source) ? (params.source as ListingOwner) : 'user');
  const [sub, setSub] = useState<Sub>('approved');
  const [filters, setFilters] = useState<Record<string, Filters>>({});
  const [rejecting, setRejecting] = useState<Listing | null>(null);
  const [viewReason, setViewReason] = useState<Listing | null>(null);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [toast, setToast] = useState('');

  const activeSub: Sub = source === 'admin' ? 'approved' : sub;
  const key = `${source}-${activeSub}`;
  const f = filters[key] ?? EMPTY;
  const setF = (patch: Partial<Filters>) => setFilters({ ...filters, [key]: { ...f, ...patch } });

  const rows = useMemo(() => {
    let list = store.listings.filter(
      (l) =>
        l.owner === source &&
        l.status === (activeSub as ListingStatus) &&
        (!f.country || l.country === f.country) &&
        (!f.gender || l.gender === f.gender),
    );
    if (f.sortName) list = [...list].sort((a, b) => listingTitle(a).localeCompare(listingTitle(b)) * (f.sortName === 'za' ? -1 : 1));
    if (f.sortPrice) list = [...list].sort((a, b) => ((Number(a.price) || 0) - (Number(b.price) || 0)) * (f.sortPrice === 'high' ? -1 : 1));
    return list;
  }, [store.listings, source, activeSub, f]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const columns: Column<Listing>[] = [
    { key: 'sr', title: 'Sr.No', width: 70, render: (_l, i) => <Text style={styles.bold}>{i + 1}</Text> },
    { key: 'ownerId', title: 'User ID', width: 110 },
    { key: 'ownerName', title: source === 'dealer' && activeSub !== 'approved' ? 'Dealer name' : 'Seller name', width: 150 },
    { key: 'country', title: 'Country', width: 150 },
    { key: 'name', title: 'Watch Name', width: 200, searchValue: listingTitle, render: (l) => <Text style={styles.td}>{listingTitle(l)}</Text> },
    {
      key: 'image',
      title: 'Image',
      width: 110,
      render: (l) =>
        l.images[0] ? (
          <Image source={imageSource(l.images[0])} style={styles.img} resizeMode="cover" />
        ) : (
          <View style={[styles.img, styles.imgEmpty]}>
            <Icon name="image" size={20} color={Palette.borderStrong} />
          </View>
        ),
    },
    { key: 'productCode', title: 'Product Code', width: 120 },
    { key: 'gender', title: 'Gender', width: 90, render: (l) => <Text style={styles.td}>{l.gender === 'Male' ? 'Men' : l.gender === 'Female' ? 'Women' : l.gender}</Text> },
    { key: 'price', title: 'Watch price', width: 120, render: (l) => <Text style={styles.td}>{formatPrice(l.price)}</Text> },
    { key: 'dom', title: 'Domestic Cost', width: 110, render: (l) => <Text style={styles.td}>{l.domestic.cost ? `$${l.domestic.cost}` : '-'}</Text> },
    { key: 'cont', title: 'Continental Cost', width: 120, render: (l) => <Text style={styles.td}>{l.owner === 'dealer' ? 'Free' : '-'}</Text> },
    {
      key: 'view',
      title: 'View details',
      width: 100,
      align: 'center',
      render: (l) => <TableAction icon="eye" label="View details" onPress={() => router.push(`/admin/product-management/details?id=${l.id}` as any)} />,
    },
    {
      key: 'action',
      title: activeSub === 'rejected' ? 'View Reason' : 'Action',
      width: 110,
      align: 'center',
      render: (l) =>
        activeSub === 'approved' ? (
          <ToggleSwitch
            value={l.active}
            onChange={(v) => {
              store.update(l.id, { active: v });
              flash(v ? 'Product activated' : 'Product deactivated');
            }}
          />
        ) : activeSub === 'pending' ? (
          <View style={styles.inline}>
            <TableAction
              icon="checkmark-circle"
              color={Palette.success}
              label="Approve product"
              onPress={() => {
                store.update(l.id, { status: 'approved', active: true, rejectReason: '' });
                flash('Product approved successfully');
              }}
            />
            <TableAction
              icon="close-circle"
              color={Palette.error}
              label="Reject product"
              onPress={() => {
                setReason('');
                setReasonError('');
                setRejecting(l);
              }}
            />
          </View>
        ) : (
          <TableAction icon="eye" label="View reason" onPress={() => setViewReason(l)} />
        ),
    },
  ];

  const fBasis = lgUp ? '23%' : mdUp ? '47%' : '100%';

  return (
    <View>
      <PageTitle>Product Management</PageTitle>

      <View style={styles.tabs}>
        {SOURCES.map((s) => (
          <Btn key={s.key} title={s.label} active={source === s.key} onPress={() => setSource(s.key)} style={{ margin: 6 }} />
        ))}
      </View>
      <View style={[styles.tabs, { marginTop: 0 }]}>
        {(source === 'admin' ? SUBS.slice(0, 1) : SUBS).map((s) => (
          <Btn key={s.key} title={s.label} active={activeSub === s.key} onPress={() => setSub(s.key)} style={{ margin: 6 }} />
        ))}
      </View>

      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <Card>
        <View style={styles.filters}>
          <SelectField
            value={f.country}
            onChange={(v) => setF({ country: v })}
            options={[{ label: 'Select country', value: '' }, ...COUNTRIES]}
            placeholder="Select country"
            searchable
            style={{ flexBasis: fBasis }}
          />
          <SelectField
            value={f.gender}
            onChange={(v) => setF({ gender: v })}
            options={[{ label: 'Filter by gender', value: '' }, ...LISTING_OPTIONS.genders.map((g) => ({ label: g === 'Other' ? 'Others' : g, value: g }))]}
            placeholder="Filter by gender"
            style={{ flexBasis: fBasis }}
          />
          <SelectField
            value={f.sortName}
            onChange={(v) => setF({ sortName: v, sortPrice: '' })}
            options={[
              { label: 'Sort by name', value: '' },
              { label: 'Name (A-Z)', value: 'az' },
              { label: 'Name (Z-A)', value: 'za' },
            ]}
            placeholder="Sort by name"
            style={{ flexBasis: fBasis }}
          />
          <SelectField
            value={f.sortPrice}
            onChange={(v) => setF({ sortPrice: v, sortName: '' })}
            options={[
              { label: 'Sort by price', value: '' },
              { label: 'Price (low-high)', value: 'low' },
              { label: 'Price (high-low)', value: 'high' },
            ]}
            placeholder="Sort by price"
            style={{ flexBasis: fBasis }}
          />
        </View>
        <View style={styles.btnRow}>
          <Btn title="Add New Watch" variant="customBtn" onPress={() => router.push('/admin/product-management/add' as any)} style={{ paddingHorizontal: 24 }} />
          <Btn
            title="Import"
            variant="customBtn"
            right={<Icon name="download" size={13} color={Palette.white} />}
            onPress={() => flash('Import will read your file once the backend is connected')}
            style={{ paddingHorizontal: 24 }}
          />
        </View>
        <DataTable key={key} columns={columns} data={rows} keyExtractor={(l) => l.id} />
      </Card>

      {/* Reject (#xcircle) */}
      <AppModal visible={!!rejecting} onClose={() => setRejecting(null)} title="Reason for Rejection" showClose>
        <Field
          label="Reason"
          value={reason}
          onChangeText={(t) => {
            setReason(t);
            setReasonError('');
          }}
          placeholder="write Here"
          multiline
          rows={3}
          error={reasonError}
          autoCapitalize="sentences"
        />
        <View style={{ alignItems: 'center' }}>
          <Btn
            title="Submit"
            variant="customBtn"
            style={{ paddingHorizontal: 36 }}
            onPress={() => {
              if (!reason.trim()) return setReasonError('The reason field is required.');
              if (rejecting) store.setStatus(rejecting.id, 'rejected', reason.trim());
              setRejecting(null);
              flash('Product rejected');
            }}
          />
        </View>
      </AppModal>

      {/* View reason (#reason) */}
      <AppModal visible={!!viewReason} onClose={() => setViewReason(null)} title="Reason for Rejection" showClose>
        <Field label="Reason" value={viewReason?.rejectReason ?? ''} editable={false} multiline rows={3} />
      </AppModal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginVertical: Spacing.lg },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xl, marginTop: Spacing.md },
  btnRow: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl },
  td: { color: Palette.textBody, fontSize: FontSizes.sm },
  bold: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.bold },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  img: { width: 80, height: 80, borderRadius: Radius.sm },
  imgEmpty: { backgroundColor: Palette.surfaceSubtle, alignItems: 'center', justifyContent: 'center' },
  toast: {
    alignSelf: 'flex-end',
    backgroundColor: Palette.success,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: Spacing.md,
  },
  toastText: { color: Palette.white, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
});
