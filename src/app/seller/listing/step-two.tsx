import React from 'react';
import { router } from 'expo-router';
import ListingFrame from '@/components/user/ListingFrame';
import { WatchPanel } from '@/components/listing/ListingUI';
import { InformationForm } from '@/components/listing/ListingForms';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';

/** User Web "Watch Information" – user/Listinguser/liststeptwo.blade.php */
export default function Step() {
  const { id, listing, ready, store } = useListingParam();
  return (
    <ListingFrame backHref={`/seller/listing/step-one?id=${id ?? ''}`} step={0}>
      {ready && listing ? (
        <WatchPanel title="Watch Information" subtitle="Please enter the following info, to list your watch">
          <InformationForm
            listing={listing}
            variant="user"
            onNext={(patch) => {
              store.update(listing.id, patch);
              router.push(`/seller/listing/step-three?id=${listing.id}` as any);
            }}
          />
        </WatchPanel>
      ) : ready ? (
        <ListingNotFound backHref="/profile" backLabel="Back to my listings" />
      ) : null}
    </ListingFrame>
  );
}
