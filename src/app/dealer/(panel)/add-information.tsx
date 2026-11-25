import React from 'react';
import { router } from 'expo-router';
import { DealerListingStep } from '@/components/dealer/DealerListing';
import { InformationForm } from '@/components/listing/ListingForms';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';

/** Dealer "Information" step – backend_ref/views/dealer/listing/add_information.blade.php */
export default function DealerStep() {
  const { id, listing, ready, store } = useListingParam();
  return (
    <DealerListingStep title="Information" backHref={`/dealer/listing-info?id=${id ?? ''}`} step={0}>
      {ready && listing ? (
        <InformationForm
          listing={listing}
          variant="dealer"
          onNext={(patch) => {
            store.update(listing.id, patch);
            router.push(`/dealer/add-image?id=${listing.id}` as any);
          }}
        />
      ) : ready ? (
        <ListingNotFound backHref="/dealer/listings" backLabel="Back to listings" />
      ) : null}
    </DealerListingStep>
  );
}
