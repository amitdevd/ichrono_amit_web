import React from 'react';
import { router } from 'expo-router';
import ListingFrame from '@/components/user/ListingFrame';
import { WatchPanel } from '@/components/listing/ListingUI';
import { BasicsForm } from '@/components/listing/ListingForms';
import { useAuth } from '@/context/auth-context';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';
import { DEMO_USER_ID } from '@/data';

/** User Web step one "What watch do you want to sell?" – user/Listinguser/liststepone.blade.php */
export default function StepOne() {
  const { id, listing, ready, store } = useListingParam();
  const { user } = useAuth();

  if (id && ready && !listing) {
    return (
      <ListingFrame backHref="/profile">
        <ListingNotFound backHref="/profile" backLabel="Back to my listings" />
      </ListingFrame>
    );
  }

  return (
    <ListingFrame backHref={id ? '/profile' : '/seller/start-selling'} width={900}>
      {ready ? (
        <WatchPanel title="What watch do you want to sell?" subtitle="Enter the brand and model to create a listing ">
          <BasicsForm
            listing={listing ?? {}}
            variant="user"
            onNext={(patch) => {
              let target = id;
              if (listing && id) store.update(id, patch);
              else target = store.create({ owner: 'user', ownerId: DEMO_USER_ID, ownerName: user?.name ?? 'Joe', country: 'India', ...patch });
              router.push(`/seller/listing/step-two?id=${target}` as any);
            }}
          />
        </WatchPanel>
      ) : null}
    </ListingFrame>
  );
}
