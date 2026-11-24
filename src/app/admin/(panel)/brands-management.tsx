import CatalogManager from '@/components/admin/CatalogManager';
import { BRANDS } from '@/data/dummy';

/** backend_ref/views/admin/brand/index.blade.php */
export default function BrandsManagement() {
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
    />
  );
}
