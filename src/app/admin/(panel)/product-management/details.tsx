import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { BackTitle, Card } from '@/components/admin/AdminUI';
import { DetailRows, ListingGallery, listingRows } from '@/components/listing/ListingDetails';
import { StatusPill } from '@/components/listing/ListingUI';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';
import { formatDate } from '@/data';
import { useBreakpoint, Btn } from '@ichrono/ui';

/** Admin "Product Details" – backend_ref/views/admin/product/product-details.blade.php */
export default function ProductDetails() {
  const { listing, ready } = useListingParam();
  const { lgUp } = useBreakpoint();

  return (
    <View>
      <BackTitle onBack={() => (router.canGoBack() ? router.back() : router.push('/admin/product-management' as any))}>Product Details</BackTitle>
      <Card>
        {ready && listing ? (
          <View>
            <View style={[styles.cols, !lgUp && { flexDirection: 'column' }]}>
              <View style={lgUp ? { width: '40%' } : null}>
                <ListingGallery images={listing.images} height={300} />
                <View style={styles.meta}>
                  <StatusPill status={listing.status} label={listing.status === 'pending' ? 'Verification' : undefined} />
                  <Text style={styles.metaText}>
                    {listing.owner === 'admin' ? 'Added by Admin' : `${listing.owner === 'dealer' ? 'Dealer' : 'Seller'}: ${listing.ownerName} (${listing.ownerId})`}
                  </Text>
                  <Text style={styles.metaText}>Created {formatDate(listing.createdAt)}</Text>
                </View>
                {listing.status === 'rejected' && listing.rejectReason ? (
                  <View style={styles.reason}>
                    <Text style={styles.reasonTitle}>Reason for Rejection</Text>
                    <Text style={styles.reasonText}>{listing.rejectReason}</Text>
                  </View>
                ) : null}
              </View>
              <View style={{ flex: 1 }}>
                <DetailRows
                  rows={[
                    ...listingRows(listing),
                    ['Product code', listing.productCode],
                    ['Domestic cost', listing.domestic.cost ? `$${listing.domestic.cost}` : '-'],
                    ['Continental cost', listing.owner === 'dealer' ? 'Free' : '-'],
                  ]}
                />
              </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: Spacing['2xl'] }}>
              <Btn
                title="Edit"
                variant="customBtn"
                onPress={() => router.push(`/admin/product-management/update?id=${listing.id}` as any)}
                style={{ minWidth: 200 }}
              />
            </View>
          </View>
        ) : ready ? (
          <ListingNotFound backHref="/admin/product-management" backLabel="Back to Product Management" />
        ) : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  cols: { flexDirection: 'row', gap: Spacing['2xl'] },
  meta: { gap: 6, marginTop: Spacing.lg },
  metaText: { color: Palette.textSecondary, fontSize: FontSizes.sm },
  reason: { marginTop: Spacing.lg, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Palette.errorBg },
  reasonTitle: { color: Palette.error, fontSize: FontSizes.sm, fontWeight: FontWeights.bold, marginBottom: 4 },
  reasonText: { color: Palette.error, fontSize: FontSizes.sm },
});
