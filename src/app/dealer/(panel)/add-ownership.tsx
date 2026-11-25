import React from 'react';
import { router } from 'expo-router';
import { DealerListingStep } from '@/components/dealer/DealerListing';
import { OwnershipForm } from '@/components/listing/ListingForms';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';

/** Dealer "Ownership" step – backend_ref/views/dealer/listing/add_ownership.blade.php */
export default function DealerStep() {
  const { id, listing, ready, store } = useListingParam();
  return (
    <DealerListingStep title="Ownership" backHref={`/dealer/add-image?id=${id ?? ''}`} step={2}>
      {ready && listing ? (
        <OwnershipForm
          listing={listing}
          variant="dealer"
          onNext={(patch) => {
            store.update(listing.id, patch);
            router.push(`/dealer/add-condition?id=${listing.id}` as any);
          }}
        />
      ) : ready ? (
        <ListingNotFound backHref="/dealer/listings" backLabel="Back to listings" />
      ) : null}
    </DealerListingStep>
  );
}
