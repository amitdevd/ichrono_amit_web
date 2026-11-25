import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { Card, PageTitle, TableAction, Thumb } from '@/components/admin/AdminUI';
import { useSeller, type SellerStatus } from '@/context/seller';
import { exportCsv } from '@/utils/export-csv';
import {
  COUNTRIES,
  CUSTOMERS,
  DEMO_SELLER_PROFILE,
  PRIVATE_SELLERS,
  type Customer,
  type PrivateSeller,
  type SellerReviewStatus,
} from '@/data';
import { useBreakpoint, AppModal, Btn, DataTable, DateField, Field, Radio, SelectField, ToggleSwitch, type Column } from '@ichrono/ui';

/**
 * Admin "User Management" – backend_ref/views/admin/user/index.blade.php
 *  User Listing   – customers, with billing address / other info / wishlist modals and Active ↔ Block switch
 *  Private Seller – Approved / Verification / Rejected; approve, reject (complete or documents) with a reason.
 * The signed-in User Web demo account appears here once it has submitted its private-seller set-up;
 * approving or rejecting it updates that account's profile.
 */
type Main = 'users' | 'sellers';
type Modal = null | 'billing' | 'other' | 'wishlist' | 'documents' | 'reject' | 'reason';
type Filters = { from: string; to: string; country: string };
const EMPTY_FILTERS: Filters = { from: '', to: '', country: '' };

const SUB_TABS: { key: SellerReviewStatus; label: string }[] = [
  { key: 'approved', label: 'Approved' },
  { key: 'verification', label: 'Verification' },
  { key: 'rejected', label: 'Rejected' },
];

/** users.user_verify ↔ admin tab */
const fromSellerStatus = (s: SellerStatus): SellerReviewStatus | null =>
  s === 'review' ? 'verification' : s === 'approved' ? 'approved' : s === 'rejected' || s === 'blocked' ? 'rejected' : null;

const inRange = (r: Customer, f: Filters) =>
  (!f.from || r.joinedIso >= f.from) && (!f.to || r.joinedIso <= f.to) && (!f.country || r.country === f.country);

export default function UserManagement() {
  const { mdUp, lgUp } = useBreakpoint();
  const seller = useSeller();
  const [main, setMain] = useState<Main>('users');
  const [sub, setSub] = useState<SellerReviewStatus>('approved');
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [sellers, setSellers] = useState<PrivateSeller[]>(PRIVATE_SELLERS);
  const [demoActive, setDemoActive] = useState(true);
  const [filters, setFilters] = useState<Record<string, Filters>>({});
  const [modal, setModal] = useState<Modal>(null);
  const [selected, setSelected] = useState<Customer | PrivateSeller | null>(null);
  const [rejectType, setRejectType] = useState<'complete_reject' | 'document_reject'>('document_reject');
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [toast, setToast] = useState('');

  const filterKey = main === 'users' ? 'users' : sub;
  const f = filters[filterKey] ?? EMPTY_FILTERS;
  const setF = (patch: Partial<Filters>) => setFilters({ ...filters, [filterKey]: { ...f, ...patch } });

  /** the User Web demo account, mirrored from its seller set-up */
  const demoSeller = useMemo<PrivateSeller | null>(() => {
    const st = fromSellerStatus(seller.status);
    if (!st) return null;
    const a = seller.address;
    return {
      ...DEMO_SELLER_PROFILE,
      phone: a.mobile ? `${a.countryCode} ${a.mobile}` : DEMO_SELLER_PROFILE.phone,
      country: a.country || DEMO_SELLER_PROFILE.country,
      address: a.street1
        ? { name: DEMO_SELLER_PROFILE.name, street: a.street1, street2: a.street2, zip: a.zip, state: a.city, country: a.country }
        : DEMO_SELLER_PROFILE.address,
      status: st,
      active: demoActive,
      rejectType: seller.status === 'blocked' ? 'complete_reject' : seller.status === 'rejected' ? 'document_reject' : '',
      rejectReason: seller.rejectedReason,
    };
  }, [seller.status, seller.address, seller.rejectedReason, demoActive]);

  const userRows = useMemo(() => customers.filter((r) => inRange(r, f)), [customers, f]);
  const sellerRows = useMemo(
    () => [...(demoSeller ? [demoSeller] : []), ...sellers].filter((s) => s.status === sub && inRange(s, f)),
    [sellers, demoSeller, sub, f],
  );

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const open = (kind: Modal, r: Customer | PrivateSeller) => {
    setSelected(r);
    if (kind === 'reject') {
      setRejectType('document_reject');
      setReason('');
      setReasonError('');
    }
    setModal(kind);
  };

  const updateSeller = (r: PrivateSeller, patch: Partial<PrivateSeller>) => {
    if (r.isDemoUser) {
      if (patch.status === 'approved') seller.setStatus('approved');
      if (patch.status === 'rejected') seller.setStatus(patch.rejectType === 'complete_reject' ? 'blocked' : 'rejected', patch.rejectReason);
      if (patch.active !== undefined) setDemoActive(patch.active);
      return;
    }
    setSellers((list) => list.map((s) => (s.id === r.id ? { ...s, ...patch } : s)));
  };

  const eye = (kind: Modal, label: string) =>
    function EyeAction(r: Customer) {
      return <TableAction icon="eye" label={label} onPress={() => open(kind, r)} />;
    };

  const common: Column<Customer>[] = [
    { key: 'sr', title: 'Sr.No', width: 70, render: (_r, i) => <Text style={styles.bold}>{i + 1}</Text> },
    { key: 'joined', title: 'Joining Date', width: 120 },
    { key: 'customerId', title: 'Customer ID', width: 120 },
    { key: 'img', title: 'Image', width: 80, render: (r) => <Thumb uri={null} label={r.name} /> },
    {
      key: 'name',
      title: 'Name',
      width: 160,
      render: (r) => (
        <Text style={styles.td}>
          {r.name}
          {(r as PrivateSeller).isDemoUser ? <Text style={styles.you}>  (User Web demo)</Text> : null}
        </Text>
      ),
    },
    { key: 'phone', title: 'Phone number', width: 160 },
    { key: 'email', title: 'Email', width: 230 },
    { key: 'country', title: 'Country', width: 150 },
    { key: 'vbill', title: 'View billing address', width: 110, align: 'center', render: eye('billing', 'View billing address') },
    { key: 'vother', title: 'Other info', width: 90, align: 'center', render: eye('other', 'Other info') },
    {
      key: 'vwish',
      title: 'View wishlisted products',
      width: 130,
      align: 'center',
      render: (r) => (
        <View style={styles.inline}>
          <Text style={styles.td}>{r.wishlist.length}</Text>
          <TableAction icon="eye" label="View wishlisted products" onPress={() => open('wishlist', r)} />
        </View>
      ),
    },
  ];

  const userCols: Column<Customer>[] = [
    ...common,
    { key: 'ordersPlaced', title: 'Total orders placed', width: 110, align: 'center' },
    { key: 'ordersCompleted', title: 'Total completed orders', width: 120, align: 'center' },
    { key: 'ordersCancelled', title: 'Total cancelled orders', width: 120, align: 'center' },
    { key: 'st', title: 'Status', width: 90, render: (r) => <Text style={styles.td}>{r.active ? 'Active' : 'Block'}</Text> },
    {
      key: 'action',
      title: 'Action',
      width: 90,
      align: 'center',
      render: (r) => (
        <ToggleSwitch
          value={r.active}
          onChange={(v) => {
            setCustomers((list) => list.map((c) => (c.id === r.id ? { ...c, active: v } : c)));
            flash(v ? 'User unblocked successfully' : 'User blocked successfully');
          }}
        />
      ),
    },
  ];

  const sellerCols = (): Column<PrivateSeller>[] => {
    const base: Column<PrivateSeller>[] = [
      ...(common as Column<PrivateSeller>[]),
      { key: 'vdocs', title: 'View Documents', width: 110, align: 'center', render: eye('documents', 'View documents') },
      { key: 'productsAdded', title: 'Total Products added', width: 110, align: 'center' },
      { key: 'revenue', title: 'Total revenues', width: 110, align: 'center' },
      { key: 'ordersReceived', title: 'Total received orders', width: 110, align: 'center' },
      {
        key: 'st',
        title: 'Status',
        width: 100,
        render: (r) => <Text style={styles.td}>{r.status === 'rejected' ? 'Rejected' : r.active ? 'Active' : 'Block'}</Text>,
      },
    ];
    if (sub === 'approved')
      return [
        ...base,
        {
          key: 'action',
          title: 'Action',
          width: 90,
          align: 'center',
          render: (r) => (
            <ToggleSwitch
              value={r.active}
              onChange={(v) => {
                updateSeller(r, { active: v });
                flash(v ? 'Seller unblocked successfully' : 'Seller blocked successfully');
              }}
            />
          ),
        },
      ];
    if (sub === 'verification')
      return [
        ...base,
        {
          key: 'action',
          title: 'Action',
          width: 110,
          align: 'center',
          render: (r) => (
            <View style={styles.inline}>
              <TableAction
                icon="checkmark-circle"
                color={Palette.success}
                label="Approve seller"
                onPress={() => {
                  updateSeller(r, { status: 'approved', active: true });
                  flash('Private seller approved successfully');
                }}
              />
              <TableAction icon="close-circle" color={Palette.error} label="Reject seller" onPress={() => open('reject', r)} />
            </View>
          ),
        },
      ];
    return [...base, { key: 'reason', title: 'View Reason', width: 100, align: 'center', render: eye('reason', 'View reason') }];
  };

  const doExport = () => {
    const rows = main === 'users' ? userRows : sellerRows;
    const ok = exportCsv(
      main === 'users' ? 'users.csv' : `private-sellers-${sub}.csv`,
      ['Sr.No', 'Joining Date', 'Customer ID', 'Name', 'Phone number', 'Email', 'Country', 'Status'],
      rows.map((r, i) => [i + 1, r.joined, r.customerId, r.name, r.phone, r.email, r.country, r.active ? 'Active' : 'Block']),
    );
    flash(ok ? `Exported ${rows.length} rows` : 'Export is available on the web version');
  };

  const fBasis = lgUp ? '23%' : mdUp ? '31%' : '100%';
  const sel = selected;
  const selSeller = sel as PrivateSeller | null;
  const demoDocs = selSeller?.isDemoUser ? seller.docs : null;

  return (
    <View>
      <PageTitle>User Management</PageTitle>

      <View style={styles.tabs}>
        <Btn title="User Listing" active={main === 'users'} onPress={() => setMain('users')} style={{ margin: 6 }} />
        <Btn title="Private Seller" active={main === 'sellers'} onPress={() => setMain('sellers')} style={{ margin: 6 }} />
      </View>
      {main === 'sellers' ? (
        <View style={[styles.tabs, { marginTop: 0 }]}>
          {SUB_TABS.map((t) => (
            <Btn key={t.key} title={t.label} active={sub === t.key} onPress={() => setSub(t.key)} style={{ margin: 6 }} />
          ))}
        </View>
      ) : null}

      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <Card>
        <View style={styles.filters}>
          <DateField label="From:" value={f.from} onChange={(v) => setF({ from: v })} style={{ flexBasis: fBasis }} />
          <DateField label="To:" value={f.to} onChange={(v) => setF({ to: v })} style={{ flexBasis: fBasis }} />
          <SelectField
            label="Select Country"
            value={f.country}
            onChange={(v) => setF({ country: v })}
            options={[{ label: 'Select Country', value: '' }, ...COUNTRIES.map((c) => ({ label: c, value: c }))]}
            placeholder="Select Country"
            searchable
            style={{ flexBasis: fBasis }}
          />
          <View style={[styles.exportWrap, { flexBasis: fBasis }]}>
            <Btn title="Export" variant="customBtn" onPress={doExport} style={{ paddingHorizontal: 32 }} />
          </View>
        </View>
        {main === 'users' ? (
          <DataTable key="users" columns={userCols} data={userRows} keyExtractor={(r) => r.id} />
        ) : (
          <DataTable key={sub} columns={sellerCols()} data={sellerRows} keyExtractor={(r) => r.id} />
        )}
      </Card>

      {/* Billing address */}
      <AppModal visible={modal === 'billing'} onClose={() => setModal(null)} title="Billing address" showClose>
        {(
          [
            ['Name', sel?.address.name],
            ['Street', sel?.address.street],
            ['Street Line 2', sel?.address.street2],
            ['Zip Code', sel?.address.zip],
            ['State', sel?.address.state],
            ['Country', sel?.address.country],
          ] as const
        ).map(([k, v]) => (
          <Field key={k} label={k} value={v ?? ''} placeholder={k} editable={false} />
        ))}
      </AppModal>

      {/* Other info */}
      <AppModal visible={modal === 'other'} onClose={() => setModal(null)} title="Other info" showClose>
        {(
          [
            ['Gender', sel?.other.gender],
            ['Date of Birth', sel?.other.dob],
            ['Occupation', sel?.other.occupation],
            ['Language', sel?.other.language],
          ] as const
        ).map(([k, v]) => (
          <Field key={k} label={k} value={v ?? ''} placeholder={k} editable={false} />
        ))}
      </AppModal>

      {/* Wishlist */}
      <AppModal visible={modal === 'wishlist'} onClose={() => setModal(null)} title="Wishlist" showClose>
        {sel?.wishlist.length ? (
          sel.wishlist.map((w, i) => (
            <View key={i} style={[styles.wish, i > 0 && styles.wishBorder]}>
              <Image source={require('@/assets/images/product-img.png')} style={styles.wishImg} />
              <View style={{ flex: 1 }}>
                {(
                  [
                    ['Name', w.name],
                    ['Price', w.price],
                    ['Added On', w.addedOn],
                  ] as const
                ).map(([k, v]) => (
                  <View key={k} style={styles.wishRow}>
                    <Text style={styles.wishKey}>{k}</Text>
                    <Text style={styles.wishVal}>{v}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.td}>No wishlisted products.</Text>
        )}
      </AppModal>

      {/* Documents */}
      <AppModal visible={modal === 'documents'} onClose={() => setModal(null)} title="Documents" showClose>
        {(
          [
            ['Business Registration', demoDocs?.businessFront, demoDocs?.businessBack],
            ['Address Proof', demoDocs?.addressFront, demoDocs?.addressBack],
            ['Identity Proof', demoDocs?.identityFront, demoDocs?.identityBack],
          ] as const
        ).map(([t, front, back]) => (
          <View key={t} style={{ marginBottom: Spacing.lg }}>
            <Text style={styles.docTitle}>{t}</Text>
            <View style={styles.docRow}>
              {[front, back].map((u, i) => (
                <Image
                  key={i}
                  source={u ? { uri: u } : require('@/assets/images/document.png')}
                  style={styles.docImg}
                  resizeMode={u ? 'cover' : 'contain'}
                />
              ))}
            </View>
          </View>
        ))}
      </AppModal>

      {/* Reject */}
      <AppModal visible={modal === 'reject'} onClose={() => setModal(null)} showClose>
        <View style={styles.radioRow}>
          <Radio checked={rejectType === 'complete_reject'} onPress={() => setRejectType('complete_reject')} label="Complete Reject" style={{ flex: 1 }} />
          <Radio checked={rejectType === 'document_reject'} onPress={() => setRejectType('document_reject')} label="Document Reject" style={{ flex: 1 }} />
        </View>
        <View style={styles.hr} />
        <Field
          label="Reason"
          value={reason}
          onChangeText={(t) => {
            setReason(t);
            setReasonError('');
          }}
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
              if (selSeller) updateSeller(selSeller, { status: 'rejected', rejectType, rejectReason: reason.trim() });
              setModal(null);
              flash('Private seller rejected');
            }}
          />
        </View>
      </AppModal>

      {/* View reason */}
      <AppModal visible={modal === 'reason'} onClose={() => setModal(null)} title="Reason for Rejection" showClose>
        {selSeller?.rejectType ? (
          <Text style={styles.rejectType}>{selSeller.rejectType === 'complete_reject' ? 'Complete Reject' : 'Document Reject'}</Text>
        ) : null}
        <Field label="Reason" value={selSeller?.rejectReason ?? ''} editable={false} multiline rows={3} />
      </AppModal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginVertical: Spacing.lg },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xl, marginBottom: Spacing.sm, alignItems: 'flex-end' },
  exportWrap: { alignItems: 'flex-end', marginBottom: Spacing.lg },
  td: { color: Palette.textBody, fontSize: FontSizes.sm },
  you: { color: Palette.secondary, fontSize: FontSizes.xs, fontWeight: FontWeights.semibold },
  bold: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.bold },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  toast: {
    alignSelf: 'flex-end',
    backgroundColor: Palette.success,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: Spacing.md,
  },
  toastText: { color: Palette.white, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  wish: { flexDirection: 'row', gap: Spacing.lg, paddingVertical: Spacing.md },
  wishBorder: { borderTopWidth: 1, borderTopColor: Palette.divider },
  wishImg: { width: 48, height: 48, borderRadius: Radius.sm },
  wishRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  wishKey: { color: Palette.textSecondary, fontSize: FontSizes.sm },
  wishVal: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.medium },
  docTitle: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold, marginBottom: 8 },
  docRow: { flexDirection: 'row', gap: 12 },
  docImg: {
    flex: 1,
    height: 110,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.divider,
    backgroundColor: Palette.surfaceSubtle,
  },
  radioRow: { flexDirection: 'row', gap: 12, marginTop: Spacing.sm, marginBottom: Spacing.md },
  hr: { height: 1, backgroundColor: Palette.divider, marginBottom: Spacing.lg },
  rejectType: { color: Palette.error, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, marginBottom: Spacing.md },
});
