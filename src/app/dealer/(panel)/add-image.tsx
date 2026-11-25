import React from 'react';
import { router } from 'expo-router';
import { DealerListingStep } from '@/components/dealer/DealerListing';
import { PhotosForm } from '@/components/listing/ListingForms';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';

/** Dealer "Photos" step – backend_ref/views/dealer/listing/add_image.blade.php */
export default function DealerStep() {
  const { id, listing, ready, store } = useListingParam();
  return (
    <DealerListingStep title="Photos" backHref={`/dealer/add-information?id=${id ?? ''}`} step={1}>
      {ready && listing ? (
        <PhotosForm
          listing={listing}
          variant="dealer"
          onNext={(patch) => {
            store.update(listing.id, patch);
            router.push(`/dealer/add-ownership?id=${listing.id}` as any);
          }}
        />
      ) : ready ? (
        <ListingNotFound backHref="/dealer/listings" backLabel="Back to listings" />
      ) : null}
    </DealerListingStep>
  );
}
