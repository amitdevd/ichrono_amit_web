import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { DealerPageTitle } from '@/components/dealer/DealerListing';
import { WatchSummary, listingSummary } from '@/components/listing/ListingUI';
import { ListingNotFound } from '@/hooks/use-listing-param';
import { useListings } from '@/context/listings';
import { useAuth } from '@/context/auth-context';
import { CATALOG, DEMO_DEALER_ID } from '@/data';
import { Btn, ClientOnly } from '@ichrono/ui';

/**
 * Dealer "Product details" – backend_ref/views/dealer/listing/product_details.blade.php
 * Shows a catalogue watch (from search) or one of the dealer's own listings;
 * "Next" continues to the Information step.
 */
export default function DealerProductDetails() {
  return (
    <ClientOnly>
      <Details />
    </ClientOnly>
  );
}

function Details() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { get, create, ready } = useListings();
  const { user } = useAuth();
  const cat = CATALOG.find((c) => c.id === id);
  const own = get(id);

  const next = () => {
    if (own) return router.push(`/dealer/add-information?id=${own.id}` as any);
    if (!cat) return;
    const newId = create({
      owner: 'dealer',
      ownerId: DEMO_DEALER_ID,
      ownerName: user?.name ?? 'K. Anderson',
      country: 'United States',
      brand: cat.brand,
      model: cat.model,
      reference: cat.reference,
      caseMaterial: cat.caseMaterial,
      dialColor: cat.dialColor,
      diameterMin: cat.diameterMin,
      diameterMax: cat.diameterMax,
      year: cat.year,
      images: [cat.image],
    });
    router.push(`/dealer/add-information?id=${newId}` as any);
  };

  const watch = own ? listingSummary(own) : cat;

  return (
    <View>
      <DealerPageTitle title="Create Listing" backHref="/dealer/get-listing" />
      {watch ? (
        <>
          <WatchSummary watch={watch} />
          <View style={styles.next}>
            <Btn title="Next" variant="success" onPress={next} style={{ width: 'auto', minWidth: 220, paddingHorizontal: 40 }} />
          </View>
        </>
      ) : ready ? (
        <ListingNotFound backHref="/dealer/listings" backLabel="Back to listings" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  next: { alignItems: 'center', marginTop: Spacing['3xl'] },
});
