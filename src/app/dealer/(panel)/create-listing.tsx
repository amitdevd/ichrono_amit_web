import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { DealerPageTitle } from '@/components/dealer/DealerListing';
import { StartSelling } from '@/components/listing/ListingSearch';

/** Dealer "Create Listing" – backend_ref/views/dealer/listing/create.blade.php */
export default function DealerCreateListing() {
  return (
    <View>
      <DealerPageTitle title="Create Listing" backHref="/dealer/listings" />
      <StartSelling onSearch={(q) => router.push(`/dealer/get-listing?search=${encodeURIComponent(q)}` as any)} />
    </View>
  );
}
