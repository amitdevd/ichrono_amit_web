import CatalogManager from '@/components/admin/CatalogManager';
import { BRANDS } from '@/data';
import { useSiteContent } from '@/context/site-content';

/** backend_ref/views/admin/brand/index.blade.php – the brands also feed the home page "Popular Brands". */
export default function BrandsManagement() {
  const { brands, setBrands } = useSiteContent();
  return (
    <CatalogManager
      title="Brands Management"
      addLabel="Add New Brands"
      nameColumn="Brand name"
      noun="Brand"
      addModalTitle="Add New Brands"
      editModalTitle="Edit New Brands"
      inputLabel="Enter brand name"
      inputPlaceholder="Please Enter Brand Name"
      initial={BRANDS}
      items={brands}
      onItemsChange={setBrands}
    />
  );
}
