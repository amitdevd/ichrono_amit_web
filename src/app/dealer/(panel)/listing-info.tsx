import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { DealerPageTitle } from '@/components/dealer/DealerListing';
import { WatchPanel } from '@/components/listing/ListingUI';
import { BasicsForm } from '@/components/listing/ListingForms';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';
import { useAuth } from '@/context/auth-context';
import { DEMO_DEALER_ID } from '@/data';

/** Dealer "List Your Watch" (brand / model / reference) – backend_ref/views/dealer/listing/list_info.blade.php */
export default function DealerListingInfo() {
  const { id, listing, ready, store } = useListingParam();
  const { user } = useAuth();

  return (
    <View>
      <DealerPageTitle title="List Your Watch" backHref={id ? '/dealer/listings' : '/dealer/get-listing'} />
      <View style={{ width: '100%', maxWidth: 860, alignSelf: 'center' }}>
        {id && ready && !listing ? (
          <ListingNotFound backHref="/dealer/listings" backLabel="Back to listings" />
        ) : ready ? (
          <WatchPanel title="What watch do you want to sell?" subtitle="Enter the brand and model to create a listing ">
            <BasicsForm
              listing={listing ?? {}}
              variant="dealer"
              onNext={(patch) => {
                let target = id;
                if (listing && id) store.update(id, patch);
                else
                  target = store.create({
                    owner: 'dealer',
                    ownerId: DEMO_DEALER_ID,
                    ownerName: user?.name ?? 'K. Anderson',
                    country: 'United States',
                    ...patch,
                  });
                router.push(`/dealer/add-information?id=${target}` as any);
              }}
            />
          </WatchPanel>
        ) : null}
      </View>
    </View>
  );
}
