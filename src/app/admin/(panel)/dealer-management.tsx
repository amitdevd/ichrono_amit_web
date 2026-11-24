import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { Card, PageTitle, TableAction } from '@/components/admin/AdminUI';
import Btn from '@/components/common/Btn';
import AppModal from '@/components/common/AppModal';
import Field from '@/components/common/Field';
import DateField from '@/components/common/DateField';
import SelectField from '@/components/common/SelectField';
import { Radio, ToggleSwitch } from '@/components/common/Controls';
import DataTable, { type Column } from '@/components/common/DataTable';
import { COUNTRIES, DEALERS, type Dealer, type DealerStatus } from '@/data/dummy';

/** backend_ref/views/admin/dealer-Management/index.blade.php */
const TABS: { key: DealerStatus; label: string }[] = [
  { key: 'approved', label: 'Approved' },
  { key: 'verification', label: 'Verification' },
  { key: 'rejected', label: 'Rejected' },
];

type ModalKind = null | 'address' | 'documents' | 'bank' | 'reject' | 'reason';

export default function DealerManagement() {
  const { mdUp, lgUp } = useBreakpoint();
  const [dealers, setDealers] = useState<Dealer[]>(DEALERS);
  const [tab, setTab] = useState<DealerStatus>('approved');
  const [filters, setFilters] = useState<Record<DealerStatus, { from: string; to: string; country: string }>>({
    approved: { from: '', to: '', country: '' },
    verification: { from: '', to: '', country: '' },
    rejected: { from: '', to: '', country: '' },
  });
  const [modal, setModal] = useState<ModalKind>(null);
  const [selected, setSelected] = useState<Dealer | null>(null);
  const [rejectType, setRejectType] = useState<'Complete_Reject' | 'Document_Reject'>('Document_Reject');
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const f = filters[tab];
  const setF = (patch: Partial<typeof f>) => setFilters({ ...filters, [tab]: { ...f, ...patch } });

  const rows = useMemo(
    () =>
      dealers.filter(
        (d) =>
          d.status === tab &&
          (!f.from || d.joinedIso >= f.from) &&
          (!f.to || d.joinedIso <= f.to) &&
          (!f.country || d.country === f.country),
      ),
    [dealers, tab, f],
  );

  const openModal = (kind: ModalKind, d: Dealer) => {
    setSelected(d);
    if (kind === 'reject') {
      setRejectType('Document_Reject');
      setReason('');
      setReasonError('');
    }
    setModal(kind);
  };

  const update = (id: number, patch: Partial<Dealer>) =>
    setDealers((list) => list.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  const eye = (kind: ModalKind, label: string) => (d: Dealer) => (
    <TableAction icon="eye" label={label} onPress={() => openModal(kind, d)} />
  );

  const baseCols: Column<Dealer>[] = [
    { key: 'sr', title: 'Sr.No', width: 70, render: (_d, i) => <Text style={styles.bold}>{i + 1}</Text> },
    { key: 'uniqueId', title: 'Dealer ID', width: 110 },
    { key: 'joined', title: 'Joining Date', width: 120 },
    {
      key: 'name',
      title: 'Name',
      width: 150,
      searchValue: (d) => `${d.firstName} ${d.lastName}`,
      render: (d) => <Text style={styles.td}>{`${d.firstName} ${d.lastName}`}</Text>,
    },
    { key: 'username', title: 'Account username', width: 160 },
    { key: 'email', title: 'Email', width: 240 },
    {
      key: 'phone',
      title: 'Phone no.',
      width: 160,
      render: (d) => <Text style={styles.td}>{tab === 'approved' ? `${d.countryCode} ${d.phone}` : d.phone}</Text>,
    },
    { key: 'country', title: 'Country', width: 150 },
    { key: 'company', title: 'Company name', width: 170 },
    { key: 'platformName', title: 'Name on platform', width: 160 },
    { key: 'businessType', title: 'Type of business', width: 150 },
    { key: 'fax', title: 'Fax', width: 120 },
    { key: 'website', title: 'Website', width: 200 },
    { key: 'vatId', title: 'VAT ID', width: 120 },
    { key: 'ongoing', title: 'Total ongoing orders', width: 120, align: 'center' },
    { key: 'completed', title: 'Total completed orders', width: 130, align: 'center' },
    { key: 'cancelled', title: 'Total cancelled orders', width: 130, align: 'center' },
    { key: 'vaddr', title: 'View address', width: 100, align: 'center', render: eye('address', 'View address') },
    { key: 'vdocs', title: 'View documents', width: 110, align: 'center', render: eye('documents', 'View documents') },
    { key: 'vbank', title: 'View bank details', width: 110, align: 'center', render: eye('bank', 'View bank details') },
  ];

  const columns: Column<Dealer>[] =
    tab === 'approved'
      ? [
          ...baseCols,
          {
            key: 'watches',
            title: 'Total Watches listed',
            width: 120,
            align: 'center',
            render: (d) => (
              <View style={styles.inline}>
                <Text style={styles.td}>{d.watchesListed}</Text>
                <TableAction icon="eye" label="View listed watches" onPress={() => {}} />
              </View>
            ),
          },
          {
            key: 'action',
            title: 'Action',
            width: 90,
            align: 'center',
            render: (d) => <ToggleSwitch value={!d.blocked} onChange={(v) => update(d.id, { blocked: !v })} />,
          },
        ]
      : tab === 'verification'
        ? [
            ...baseCols,
            {
              key: 'action',
              title: 'Action',
              width: 110,
              align: 'center',
              render: (d) => (
                <View style={styles.inline}>
                  <TableAction
                    icon="checkmark-circle"
                    color={Palette.success}
                    label="Approve dealer"
                    onPress={() => update(d.id, { status: 'approved' })}
                  />
                  <TableAction
                    icon="close-circle"
                    color={Palette.error}
                    label="Reject dealer"
                    onPress={() => openModal('reject', d)}
                  />
                </View>
              ),
            },
          ]
        : [...baseCols, { key: 'reason', title: 'View Reason', width: 100, align: 'center', render: eye('reason', 'View reason') }];

  const fBasis = lgUp ? '23.5%' : mdUp ? '31.5%' : '100%';

  return (
    <View>
      <PageTitle>Dealers Management</PageTitle>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Btn key={t.key} title={t.label} active={tab === t.key} onPress={() => setTab(t.key)} style={{ margin: 6 }} />
        ))}
      </View>

      <Card>
        <View style={styles.filters}>
          <DateField label="From:" value={f.from} onChange={(v) => setF({ from: v })} style={{ flexBasis: fBasis }} />
          <DateField label="To:" value={f.to} onChange={(v) => setF({ to: v })} style={{ flexBasis: fBasis }} />
          <SelectField
            label="Country"
            value={f.country}
            onChange={(v) => setF({ country: v })}
            options={[{ label: 'Select Country', value: '' }, ...COUNTRIES.map((c) => ({ label: c, value: c }))]}
            placeholder="Select Country"
            searchable
            style={{ flexBasis: fBasis }}
          />
        </View>
        <DataTable key={tab} columns={columns} data={rows} keyExtractor={(d) => String(d.id)} />
      </Card>

      {/* View Address */}
      <AppModal visible={modal === 'address'} onClose={() => setModal(null)} title="View Address" showClose>
        <Field label="Street" value={selected?.address.street ?? ''} editable={false} />
        <Field label="Street Line 2" value={selected?.address.street2 ?? ''} editable={false} />
        <Field label="Zip Code" value={selected?.address.zip ?? ''} editable={false} />
        <Field label="Country" value={selected?.address.country ?? ''} editable={false} />
      </AppModal>

      {/* Bank Details */}
      <AppModal visible={modal === 'bank'} onClose={() => setModal(null)} title="Bank Details" showClose>
        {[
          ['Bank account number:', selected?.bank.account],
          ['Routing No:', selected?.bank.routing],
          ['Bank code:', selected?.bank.code],
          ['Account Holder Name :', selected?.bank.holder],
          ['Account Holder Address:', selected?.bank.holderAddress],
        ].map(([k, v]) => (
          <View key={k} style={styles.kv}>
            <Text style={styles.kvKey}>{k}</Text>
            <Text style={styles.kvVal}>{v}</Text>
          </View>
        ))}
      </AppModal>

      {/* Documents */}
      <AppModal visible={modal === 'documents'} onClose={() => setModal(null)} title="Documents" showClose>
        {['Business Registration', 'ID Proof', 'Address Proof'].map((t) => (
          <View key={t} style={{ marginBottom: Spacing.lg }}>
            <Text style={styles.docTitle}>{t}</Text>
            <View style={styles.docRow}>
              <Image source={require('@/assets/images/document.png')} style={styles.docImg} resizeMode="contain" />
              <Image source={require('@/assets/images/document.png')} style={styles.docImg} resizeMode="contain" />
            </View>
          </View>
        ))}
      </AppModal>

      {/* Reject */}
      <AppModal visible={modal === 'reject'} onClose={() => setModal(null)} showClose>
        <View style={styles.radioRow}>
          <Radio
            checked={rejectType === 'Complete_Reject'}
            onPress={() => setRejectType('Complete_Reject')}
            label="Complete Reject"
            style={{ flex: 1 }}
          />
          <Radio
            checked={rejectType === 'Document_Reject'}
            onPress={() => setRejectType('Document_Reject')}
            label="Document Reject"
            style={{ flex: 1 }}
          />
        </View>
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
              if (!reason.trim()) return setReasonError('The rejected reason field is required.');
              if (selected) update(selected.id, { status: 'rejected', rejectType, rejectReason: reason.trim() });
              setModal(null);
            }}
          />
        </View>
      </AppModal>

      {/* View Reason */}
      <AppModal visible={modal === 'reason'} onClose={() => setModal(null)} title="Reson for Rejection" showClose>
        <Field label="Reason" value={selected?.rejectReason ?? ''} editable={false} multiline rows={3} />
      </AppModal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginVertical: Spacing.lg },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xl, marginBottom: Spacing.sm },
  td: { color: Palette.textBody, fontSize: FontSizes.sm },
  bold: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.bold },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  kv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
  },
  kvKey: { color: Palette.textBody, fontSize: FontSizes.sm },
  kvVal: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.medium, flexShrink: 1, textAlign: 'right' },
  docTitle: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold, marginBottom: 8 },
  docRow: { flexDirection: 'row', gap: 12 },
  docImg: {
    flex: 1,
    height: 110,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.divider,
    backgroundColor: '#FAFCFC',
  },
  radioRow: { flexDirection: 'row', gap: 12, marginTop: Spacing.sm, marginBottom: Spacing.lg },
});
