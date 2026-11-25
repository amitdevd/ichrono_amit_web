import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { BackTitle, Card } from '@/components/admin/AdminUI';
import ProductForm from '@/components/admin/ProductForm';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';

/** Admin "Edit Product Details" – backend_ref/views/admin/product/edit-product.blade.php */
export default function EditProduct() {
  const { id, listing, ready, store } = useListingParam();
  return (
    <View>
      <BackTitle onBack={() => router.push(`/admin/product-management/details?id=${id ?? ''}` as any)}>Edit Product Details</BackTitle>
      <Card>
        {ready && listing ? (
          <ProductForm
            mode="edit"
            listing={listing}
            onNext={(patch) => {
              store.update(listing.id, patch);
              router.push(`/admin/product-management/watch-condition?id=${listing.id}` as any);
            }}
          />
        ) : ready ? (
          <ListingNotFound backHref="/admin/product-management" backLabel="Back to Product Management" />
        ) : null}
      </Card>
    </View>
  );
}
