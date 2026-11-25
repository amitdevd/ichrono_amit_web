import React from 'react';
import { router } from 'expo-router';
import ListingFrame from '@/components/user/ListingFrame';
import { WatchPanel } from '@/components/listing/ListingUI';
import { OwnershipForm } from '@/components/listing/ListingForms';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';

/** User Web "Proof of Ownership" – user/Listinguser/liststepfour.blade.php */
export default function Step() {
  const { id, listing, ready, store } = useListingParam();
  return (
    <ListingFrame backHref={`/seller/listing/step-three?id=${id ?? ''}`} step={2}>
      {ready && listing ? (
        <WatchPanel title="Proof of Ownership" subtitle="Set the time of your watch as shown below and upload a picture of each to prove it.">
          <OwnershipForm
            listing={listing}
            variant="user"
            onNext={(patch) => {
              store.update(listing.id, patch);
              router.push(`/seller/listing/step-five?id=${listing.id}` as any);
            }}
          />
        </WatchPanel>
      ) : ready ? (
        <ListingNotFound backHref="/profile" backLabel="Back to my listings" />
      ) : null}
    </ListingFrame>
  );
}
