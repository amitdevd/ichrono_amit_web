import React, { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ClientOnly } from '@ichrono/ui';
import { CatalogResults } from '@/components/listing/ListingSearch';

/**
 * Dealer search results – backend_ref/views/dealer/listing/get_list.blade.php
 * A card opens the product details page; "add watch details manually" opens listing-info.
 */
export default function DealerGetListing() {
  return (
    <ClientOnly>
      <Page />
    </ClientOnly>
  );
}

function Page() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const [query, setQuery] = useState(search ?? '');
  return (
    <View>
      <CatalogResults
        query={query}
        onQueryChange={setQuery}
        onSelect={(w) => router.push(`/dealer/product-details?id=${w.id}` as any)}
        onManual={() => router.push('/dealer/listing-info' as any)}
      />
    </View>
  );
}
