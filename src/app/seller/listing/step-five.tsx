import React from 'react';
import { router } from 'expo-router';
import ListingFrame from '@/components/user/ListingFrame';
import { WatchPanel } from '@/components/listing/ListingUI';
import { ConditionsForm } from '@/components/listing/ListingForms';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';

/** User Web "Proof of Ownership" – user/Listinguser/liststepfive.blade.php (the reference repeats the "Proof of Ownership" heading on this page) */
export default function Step() {
  const { id, listing, ready, store } = useListingParam();
  return (
    <ListingFrame backHref={`/seller/listing/step-four?id=${id ?? ''}`} step={3}>
      {ready && listing ? (
        <WatchPanel title="Proof of Ownership" subtitle="Set the time of your watch as shown below and upload a picture of each to proof it.">
          <ConditionsForm
            listing={listing}
            variant="user"
            onNext={(patch) => {
              store.update(listing.id, patch);
              router.push(`/seller/listing/step-six?id=${listing.id}` as any);
            }}
          />
        </WatchPanel>
      ) : ready ? (
        <ListingNotFound backHref="/profile" backLabel="Back to my listings" />
      ) : null}
    </ListingFrame>
  );
}
