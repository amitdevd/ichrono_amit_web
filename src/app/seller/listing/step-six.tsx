import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { BRAND_NAME } from '@/constants/brand';
import ListingFrame from '@/components/user/ListingFrame';
import { WatchPanel } from '@/components/listing/ListingUI';
import { DescriptionForm } from '@/components/listing/ListingForms';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';
import { AppModal, Btn, Icon } from '@ichrono/ui';

/**
 * User Web "Watch Cost and Description" – user/Listinguser/liststepsix.blade.php
 * "Save as a draft" keeps it in Drafts; "Submit" sends it for admin review and shows
 * the #watchDetailSubmit modal.
 */
export default function StepSix() {
  const { listing, ready, store } = useListingParam();
  const [done, setDone] = useState(false);

  return (
    <ListingFrame backHref={`/seller/listing/step-five?id=${listing?.id ?? ''}`} step={4}>
      {ready && listing ? (
        <WatchPanel title="Watch Cost and Description" subtitle="Describe the watch and set the cost" bodyStyle={{ padding: 0 }}>
          <DescriptionForm
            listing={listing}
            variant="user"
            onSaveDraft={(patch) => {
              store.update(listing.id, { ...patch, status: 'draft' });
              router.replace('/profile?tab=Drafts' as any);
            }}
            onSubmit={(patch) => {
              store.update(listing.id, { ...patch, status: 'pending', rejectReason: '' });
              setDone(true);
            }}
          />
        </WatchPanel>
      ) : ready ? (
        <ListingNotFound backHref="/profile" backLabel="Back to my listings" />
      ) : null}

      <AppModal visible={done} onClose={() => router.replace('/profile' as any)} width={520}>
        <View style={styles.modal}>
          <View style={styles.check}>
            <Icon name="check" size={30} color={Palette.white} />
          </View>
          <Text style={styles.h6}>Watch Details Submitted!</Text>
          <Text style={styles.p}>
            Thank you for adding a watch into your listing. Please wait for 3-4 hrs. {BRAND_NAME} team will review once all done, watch
            will be active and publish to sell
          </Text>
          <Text style={styles.p}>Thank you for your patience!</Text>
          <Btn title="Okay" variant="customBtn3" onPress={() => router.replace('/profile' as any)} style={{ width: 'auto', paddingHorizontal: 48 }} />
        </View>
      </AppModal>
    </ListingFrame>
  );
}

const styles = StyleSheet.create({
  modal: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.lg },
  check: { width: 64, height: 64, borderRadius: 32, backgroundColor: Palette.success, alignItems: 'center', justifyContent: 'center' },
  h6: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  p: { color: Palette.textSecondary, fontSize: FontSizes.md, lineHeight: 24, textAlign: 'center' },
});
