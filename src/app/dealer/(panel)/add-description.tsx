import React from 'react';
import { router } from 'expo-router';
import { DealerListingStep } from '@/components/dealer/DealerListing';
import { DescriptionForm } from '@/components/listing/ListingForms';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';

/**
 * Dealer "Description" step – backend_ref/views/dealer/listing/add_description.blade.php
 * Description + domestic / continental shipping cost; "Save as a draft" or "Submit" (→ thank-you page).
 */
export default function DealerAddDescription() {
  const { id, listing, ready, store } = useListingParam();
  return (
    <DealerListingStep title="Description" backHref={`/dealer/add-condition?id=${id ?? ''}`} step={4} bodyStyle={{ padding: 0 }}>
      {ready && listing ? (
        <DescriptionForm
          listing={listing}
          variant="dealer"
          onSaveDraft={(patch) => {
            store.update(listing.id, { ...patch, status: 'draft' });
            router.replace('/dealer/listings?tab=Drafts' as any);
          }}
          onSubmit={(patch) => {
            store.update(listing.id, { ...patch, status: 'pending', rejectReason: '' });
            router.replace('/dealer/thanku' as any);
          }}
        />
      ) : ready ? (
        <ListingNotFound backHref="/dealer/listings" backLabel="Back to listings" />
      ) : null}
    </DealerListingStep>
  );
}
