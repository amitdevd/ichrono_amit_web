import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { BackTitle, Card } from '@/components/admin/AdminUI';
import ProductForm from '@/components/admin/ProductForm';
import { useListings } from '@/context/listings';

/** Admin "Add Product Details" – backend_ref/views/admin/product/add-product.blade.php */
export default function AddProduct() {
  const { create } = useListings();
  return (
    <View>
      <BackTitle onBack={() => router.push('/admin/product-management' as any)}>Add Product Details</BackTitle>
      <Card>
        <ProductForm
          mode="add"
          onNext={(patch) => {
            const id = create({ owner: 'admin', ownerId: 'ADMIN', ownerName: 'Admin', country: 'United Kingdom', ...patch, status: 'draft' });
            router.push(`/admin/product-management/watch-condition?id=${id}` as any);
          }}
        />
      </Card>
    </View>
  );
}
