import React from 'react';
import { router } from 'expo-router';
import ListingFrame from '@/components/user/ListingFrame';
import { WatchPanel } from '@/components/listing/ListingUI';
import { PhotosForm } from '@/components/listing/ListingForms';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';

/** User Web "Watch Pictures" – user/Listinguser/liststepthree.blade.php */
export default function Step() {
  const { id, listing, ready, store } = useListingParam();
  return (
    <ListingFrame backHref={`/seller/listing/step-two?id=${id ?? ''}`} step={1}>
      {ready && listing ? (
        <WatchPanel title="Watch Pictures" subtitle="You may upload max 5 pictures">
          <PhotosForm
            listing={listing}
            variant="user"
            onNext={(patch) => {
              store.update(listing.id, patch);
              router.push(`/seller/listing/step-four?id=${listing.id}` as any);
            }}
          />
        </WatchPanel>
      ) : ready ? (
        <ListingNotFound backHref="/profile" backLabel="Back to my listings" />
      ) : null}
    </ListingFrame>
  );
}
