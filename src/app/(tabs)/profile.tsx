import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useRequireUser } from '@/hooks/use-guest-guard';
import { useAuth } from '@/context/auth-context';
import { useSeller, type SellerStatus } from '@/context/seller';
import WebHeader from '@/components/user/WebHeader';
import WebFooter from '@/components/user/WebFooter';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import { StatusPill } from '@/components/listing/ListingUI';
import { ListingDetailsModal } from '@/components/listing/ListingDetails';
import { useListings } from '@/context/listings';
import { DEMO_USER_ID, formatPrice, imageSource, type Listing } from '@/data';
import { useBreakpoint, Btn, Icon } from '@ichrono/ui';

/**
 * User profile → "Sell a Watch" – backend_ref/views/user/profile/index.blade.php
 * Shows the private-seller state (not set up / under review / approved / rejected) and,
 * once approved, the seller's Listing / Drafts / Orders tabs (Milestone 3).
 */
type Tab = 'Listing' | 'Drafts' | 'Orders';
const TABS: Tab[] = ['Listing', 'Drafts', 'Orders'];
const STATUS_LABELS: { key: SellerStatus; label: string }[] = [
  { key: 'none', label: 'Not set up' },
  { key: 'review', label: 'Under review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'blocked', label: 'Rejected (final)' },
];

export default function ProfileScreen() {
  const allowed = useRequireUser();
  const { lgUp } = useBreakpoint();
  const { logout } = useAuth();
  const seller = useSeller();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<Tab>(TABS.includes(params.tab as Tab) ? (params.tab as Tab) : 'Listing');
  const store = useListings();
  const mine = useMemo(() => store.listings.filter((l) => l.owner === 'user' && l.ownerId === DEMO_USER_ID), [store.listings]);
  const listed = mine.filter((l) => l.status !== 'draft');
  const drafts = mine.filter((l) => l.status === 'draft');
  const [toDelete, setToDelete] = useState<Listing | null>(null);
  const [details, setDetails] = useState<Listing | null>(null);

  const reason =
    seller.rejectedReason || 'The uploaded identity proof is not clear. Please upload a clear copy of both sides of your document.';

  return (
    <ScrollView style={styles.screen} stickyHeaderIndices={[0]}>
      <WebHeader />
      {allowed ? (
        <View style={[styles.container, lgUp && { flexDirection: 'row', alignItems: 'flex-start' }]}>
          {/* col-lg-4 */}
          <View style={[lgUp ? { width: '31%' } : null, { gap: Spacing.xl }]}>
            <View style={styles.sideCard}>
              <View style={[styles.navLink, styles.navActive]}>
                <Image source={require('@/assets/images/private-seller/sell.webp')} style={styles.navIcon} />
                <Text style={[styles.navText, { color: Palette.white }]}>Sell</Text>
              </View>
            </View>
            <View style={styles.sideCard}>
              <Pressable onPress={() => logout('/home')} style={({ hovered }: any) => [styles.navLink, hovered && { backgroundColor: Palette.surfaceIce }]}>
                <Image source={require('@/assets/images/private-seller/logout.webp')} style={styles.navIcon} />
                <Text style={styles.navText}>logout</Text>
              </Pressable>
            </View>
          </View>

          {/* col-lg-8 */}
          <View style={[styles.content, lgUp ? { flex: 1 } : { marginTop: Spacing.xl }]}>
            <View style={styles.headRow}>
              <Text style={styles.h3}>Sell a Watch</Text>
              {seller.status === 'approved' ? (
                <Btn
                  title="Create Listing"
                  variant="customBtn3"
                  left={<Icon name="circle-plus" size={14} color={Palette.white} />}
                  style={{ width: 'auto', paddingHorizontal: 24, height: 44 }}
                  onPress={() => router.push('/seller/create-listing' as any)}
                />
              ) : null}
            </View>

            {seller.status === 'none' ? (
              <View style={styles.sellContent}>
                <Image source={require('@/assets/images/private-seller/setup-private-seller.webp')} style={{ width: 98, height: 109 }} />
                <Text style={styles.p}>Set up a private seller account to make your listing live.</Text>
                <Btn title="Set Up Private Seller Account" variant="customBtn3" style={styles.cta} onPress={() => router.push('/seller/documents' as any)} />
              </View>
            ) : null}

            {seller.status === 'review' ? (
              <View style={styles.sellContent}>
                <Image source={require('@/assets/images/private-seller/sell-a-watch.webp')} style={{ width: 98, height: 98 }} resizeMode="contain" />
                <Text style={styles.p}>
                  Currently, the Andy Dev Design team is reviewing your seller profile.{'\n'}Please wait for a while.
                </Text>
                <Text style={styles.p}>Thank you for your patience!</Text>
              </View>
            ) : null}

            {seller.status === 'rejected' || seller.status === 'blocked' ? (
              <View style={styles.sellContent}>
                <View style={styles.rejectIcon}>
                  <Icon name="file-circle-xmark" size={44} color={Palette.error} />
                </View>
                <Text style={styles.danger}>
                  {seller.status === 'rejected'
                    ? 'We regret to inform you that your application has been rejected.'
                    : 'We regret to inform you that your application has been rejected, and you are no longer under consideration.'}
                </Text>
                <Text style={styles.p}>{reason}</Text>
                {seller.status === 'rejected' ? (
                  <Btn title="Try Again" variant="customBtn3" style={styles.cta} onPress={() => router.push('/seller/documents' as any)} />
                ) : null}
              </View>
            ) : null}

            {seller.status === 'approved' ? (
              <View>
                {!mine.length ? (
                  <View style={styles.sellContent}>
                    <Image source={require('@/assets/images/private-seller/create-listing.webp')} style={{ width: 98, height: 98 }} resizeMode="contain" />
                    <Text style={styles.h6}>Great you are all set!</Text>
                    <Text style={styles.p}>Now create your first listing</Text>
                    <Btn title="Create Listing" variant="customBtn3" style={styles.cta} onPress={() => router.push('/seller/create-listing' as any)} />
                  </View>
                ) : null}
                <View style={styles.tabs}>
                  {TABS.map((t) => (
                    <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]} accessibilityRole="tab">
                      <Text style={[styles.tabText, tab === t && { color: Palette.primary }]}>{t}</Text>
                    </Pressable>
                  ))}
                </View>

                {tab === 'Listing'
                  ? listed.map((l) => (
                      <ListingCard
                        key={l.id}
                        listing={l}
                        onOpen={() => setDetails(l)}
                        onDelete={() => setToDelete(l)}
                        onEdit={() => router.push(`/seller/listing/step-one?id=${l.id}` as any)}
                      />
                    ))
                  : null}
                {tab === 'Drafts'
                  ? drafts.map((l) => (
                      <ListingCard
                        key={l.id}
                        listing={l}
                        onOpen={() => setDetails(l)}
                        onDelete={() => setToDelete(l)}
                        onEdit={() => router.push(`/seller/listing/step-one?id=${l.id}` as any)}
                        onAddToList={() => {
                          store.setStatus(l.id, 'pending');
                          setTab('Listing');
                        }}
                      />
                    ))
                  : null}
                {tab === 'Orders' ? <OrderCard /> : null}
                {(tab === 'Listing' && !listed.length) || (tab === 'Drafts' && !drafts.length) ? (
                  <Text style={styles.empty}>{tab === 'Listing' ? 'You have no listings yet.' : 'You have no drafts yet.'}</Text>
                ) : null}
              </View>
            ) : null}

            {/* Front-end demo only: admin approval arrives with the backend / Milestone 3 */}
            <View style={styles.demo}>
              <Text style={styles.demoTitle}>Demo: seller status</Text>
              <View style={styles.demoRow}>
                {STATUS_LABELS.map((s) => (
                  <Pressable
                    key={s.key}
                    onPress={() => seller.setStatus(s.key)}
                    style={[styles.demoChip, seller.status === s.key && styles.demoChipOn]}
                  >
                    <Text style={[styles.demoChipText, seller.status === s.key && { color: Palette.white }]}>{s.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={{ height: 400 }} />
      )}
      <WebFooter />
      <ConfirmDeleteModal
        visible={!!toDelete}
        message="Are you sure you want to delete this listing?"
        onNo={() => setToDelete(null)}
        onYes={() => {
          if (toDelete) store.remove(toDelete.id);
          setToDelete(null);
        }}
      />
      <ListingDetailsModal listing={details} onClose={() => setDetails(null)} />
    </ScrollView>
  );
}

/** `.listWacthDetail` – one listing row with image, model, brand, price, actions and status */
function ListingCard({
  listing,
  onOpen,
  onEdit,
  onDelete,
  onAddToList,
}: {
  listing: Listing;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddToList?: () => void;
}) {
  const { mdUp } = useBreakpoint();
  const statusLabel = { draft: 'In Active', pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }[listing.status];
  return (
    <View style={[styles.listCard, !mdUp && { flexDirection: 'column' }]}>
      <Pressable onPress={onOpen} style={styles.listImg} accessibilityLabel={`View ${listing.brand} ${listing.model}`}>
        {listing.images[0] ? (
          <Image source={imageSource(listing.images[0])} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <Icon name="image" size={32} color={Palette.borderStrong} />
        )}
      </Pressable>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={styles.listTop}>
          <Pressable onPress={onOpen} style={{ flex: 1 }}>
            <Text style={styles.listH4} numberOfLines={1}>
              {listing.model || 'N/A'}
            </Text>
          </Pressable>
          <StatusPill status={listing.status} label={statusLabel} />
        </View>
        <Text style={styles.listH6}>{listing.brand || 'N/A'}</Text>
        <Text style={styles.listH5}>{formatPrice(listing.price)}</Text>
        {listing.status === 'rejected' && listing.rejectReason ? (
          <Text style={styles.listReason} numberOfLines={2}>
            {listing.rejectReason}
          </Text>
        ) : null}
        <View style={styles.listActions}>
          <View style={styles.listLinks}>
            <Pressable onPress={onDelete} style={styles.link} accessibilityRole="button" accessibilityLabel="Delete">
              <Icon name="trash-can" size={13} color={Palette.error} />
              <Text style={[styles.linkText, { color: Palette.error }]}>Delete</Text>
            </Pressable>
            <Pressable onPress={onEdit} style={styles.link} accessibilityRole="button" accessibilityLabel="Edit">
              <Icon name="pen" size={13} color={Palette.primary} />
              <Text style={styles.linkText}>Edit</Text>
            </Pressable>
          </View>
          {onAddToList ? (
            <Btn title="Add to list" variant="customBtn3" small onPress={onAddToList} style={{ width: 'auto', paddingHorizontal: 22 }} />
          ) : null}
        </View>
      </View>
    </View>
  );
}

/** Orders tab – the reference shows one static "Received buyer request to purchase" card (orders arrive in a later milestone). */
function OrderCard() {
  const { mdUp } = useBreakpoint();
  return (
    <View style={[styles.listCard, !mdUp && { flexDirection: 'column' }]}>
      <View style={styles.listImg}>
        <Image source={imageSource('asset:watch-1')} style={{ width: '80%', height: '80%' }} resizeMode="contain" />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={styles.listTop}>
          <Text style={[styles.listH4, { flex: 1 }]}>Request ID :  8281281881</Text>
          <StatusPill status="approved" label="Received buyer request to purchase" />
        </View>
        <Text style={styles.listH6}>Montblanc Sport</Text>
        <Text style={styles.listH5}>$ 52,000</Text>
        <View style={styles.listActions}>
          <View style={styles.listLinks}>
            <Text style={styles.linkText}>Condition:</Text>
            <Text style={styles.orderTag}>Used</Text>
            <View style={styles.orderTag2}>
              <Image source={require('@/assets/images/flag.png')} style={{ width: 20, height: 14 }} resizeMode="contain" />
              <Text style={styles.linkText}>IN</Text>
            </View>
          </View>
          <View style={styles.listLinks}>
            <Btn title="Reject" variant="customBtn4" small style={{ width: 'auto', paddingHorizontal: 22, marginTop: 0 }} />
            <Btn title="Accepted" variant="customBtn3" small style={{ width: 'auto', paddingHorizontal: 22 }} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.backgroundPage },
  container: {
    width: '100%',
    maxWidth: 1320,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing['4xl'],
    gap: Spacing['2xl'],
  },
  sideCard: { backgroundColor: Palette.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.borderSoft, padding: Spacing.sm },
  navLink: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: Spacing.lg, borderRadius: Radius.md },
  navActive: { backgroundColor: Palette.primary },
  navIcon: { width: 22, height: 22 },
  navText: { color: Palette.textSecondary, fontSize: FontSizes.md, fontWeight: FontWeights.medium },
  content: { backgroundColor: Palette.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.borderSoft, padding: Spacing['2xl'] },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.md, marginBottom: Spacing['2xl'] },
  h3: { color: Palette.primary, fontSize: FontSizes['2xl'], fontWeight: FontWeights.semibold },
  sellContent: {
    alignItems: 'center',
    backgroundColor: Palette.surfaceIce,
    borderRadius: Radius.lg,
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  p: { color: Palette.textSecondary, fontSize: FontSizes.md, lineHeight: 24, textAlign: 'center' },
  h6: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
  danger: { color: Palette.error, fontSize: FontSizes.md, fontWeight: FontWeights.bold, textAlign: 'center' },
  rejectIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: Palette.errorBg, alignItems: 'center', justifyContent: 'center' },
  cta: { width: 'auto', paddingHorizontal: 36, marginTop: Spacing.sm },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Palette.divider, marginTop: Spacing.xl },
  tab: { paddingVertical: 12, paddingHorizontal: Spacing.lg, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Palette.secondary },
  tabText: { color: Palette.textSecondary, fontSize: FontSizes.md, fontWeight: FontWeights.medium },
  listCard: {
    flexDirection: 'row',
    gap: Spacing.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.borderSoft,
    backgroundColor: Palette.white,
  },
  listImg: {
    width: 150,
    height: 130,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Palette.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  listH4: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  listH6: { color: Palette.textSecondary, fontSize: FontSizes.md },
  listH5: { color: Palette.secondary, fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
  listReason: { color: Palette.error, fontSize: FontSizes.xs },
  listActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginTop: 6 },
  listLinks: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  linkText: { color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  orderTag: { color: Palette.textSecondary, fontSize: FontSizes.sm, backgroundColor: Palette.surfaceMuted, paddingHorizontal: 10, paddingVertical: 2, borderRadius: Radius.pill },
  orderTag2: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  empty: { color: Palette.textMuted, fontSize: FontSizes.sm, textAlign: 'center', paddingVertical: Spacing['3xl'] },
  demo: { marginTop: Spacing['3xl'], borderTopWidth: 1, borderTopColor: Palette.divider, borderStyle: 'dashed', paddingTop: Spacing.lg },
  demoTitle: { color: Palette.textMuted, fontSize: FontSizes.xs, marginBottom: 8 },
  demoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  demoChip: { borderWidth: 1, borderColor: Palette.borderMedium, borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 5 },
  demoChipOn: { backgroundColor: Palette.secondary, borderColor: Palette.secondary },
  demoChipText: { color: Palette.textSecondary, fontSize: FontSizes.xs },
});
