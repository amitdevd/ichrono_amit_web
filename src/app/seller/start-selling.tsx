import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import ListingFrame from '@/components/user/ListingFrame';
import { CatalogResults } from '@/components/listing/ListingSearch';
import { WatchSummary } from '@/components/listing/ListingUI';
import { useAuth } from '@/context/auth-context';
import { useListings } from '@/context/listings';
import { DEMO_USER_ID, type CatalogWatch } from '@/data';
import { AppModal, Btn, ClientOnly } from '@ichrono/ui';

/**
 * User Web search results – backend_ref/views/user/Listinguser/startselling.blade.php
 * Filters (case material, dial colour, diameter), the watch cards and the "Sell" modal
 * (#watchDetail) whose "Next" skips step one (creating-list/skip-step-one).
 */
export default function StartSellingPage() {
  return (
    <ListingFrame title="Create listing" backHref="/seller/create-listing" plain width={1200}>
      <ClientOnly>
        <Results />
      </ClientOnly>
    </ListingFrame>
  );
}

function Results() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const [query, setQuery] = useState(search ?? '');
  const [picked, setPicked] = useState<CatalogWatch | null>(null);
  const { user } = useAuth();
  const { create } = useListings();

  const next = () => {
    if (!picked) return;
    const id = create({
      owner: 'user',
      ownerId: DEMO_USER_ID,
      ownerName: user?.name ?? 'Joe',
      country: 'India',
      brand: picked.brand,
      model: picked.model,
      reference: picked.reference,
      caseMaterial: picked.caseMaterial,
      dialColor: picked.dialColor,
      diameterMin: picked.diameterMin,
      diameterMax: picked.diameterMax,
      year: picked.year,
      images: [picked.image],
    });
    setPicked(null);
    router.push(`/seller/listing/step-two?id=${id}` as any);
  };

  return (
    <>
      <CatalogResults
        query={query}
        onQueryChange={setQuery}
        onSelect={setPicked}
        onManual={() => router.push('/seller/listing/step-one' as any)}
      />
      <AppModal visible={!!picked} onClose={() => setPicked(null)} title="Sell" showClose width={860}>
        {picked ? <WatchSummary watch={picked} /> : null}
        <Btn title="Next" variant="customBtn3" onPress={next} style={{ marginTop: 24, width: 'auto', alignSelf: 'flex-start', paddingHorizontal: 60 }} />
      </AppModal>
    </>
  );
}
