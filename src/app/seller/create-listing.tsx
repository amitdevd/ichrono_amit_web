import React from 'react';
import { router } from 'expo-router';
import ListingFrame from '@/components/user/ListingFrame';
import { StartSelling } from '@/components/listing/ListingSearch';

/** User Web "Create listing" – backend_ref/views/user/Listinguser/createlisting.blade.php */
export default function CreateListing() {
  return (
    <ListingFrame title="Create listing" backHref="/profile" plain width={1200}>
      <StartSelling onSearch={(q) => router.push(`/seller/start-selling?search=${encodeURIComponent(q)}` as any)} />
    </ListingFrame>
  );
}
