import React from 'react';
import { router } from 'expo-router';
import { DealerListingStep } from '@/components/dealer/DealerListing';
import { ConditionsForm } from '@/components/listing/ListingForms';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';

/** Dealer "Conditions" step – backend_ref/views/dealer/listing/add_condition.blade.php */
export default function DealerStep() {
  const { id, listing, ready, store } = useListingParam();
  return (
    <DealerListingStep title="Conditions" backHref={`/dealer/add-ownership?id=${id ?? ''}`} step={3}>
      {ready && listing ? (
        <ConditionsForm
          listing={listing}
          variant="dealer"
          onNext={(patch) => {
            store.update(listing.id, patch);
            router.push(`/dealer/add-description?id=${listing.id}` as any);
          }}
        />
      ) : ready ? (
        <ListingNotFound backHref="/dealer/listings" backLabel="Back to listings" />
      ) : null}
    </DealerListingStep>
  );
}
