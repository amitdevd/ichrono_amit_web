import CatalogManager from '@/components/admin/CatalogManager';
import { CATEGORIES } from '@/data';

/** backend_ref/views/admin/watch/index.blade.php */
export default function WatchCategoryManagement() {
  return (
    <CatalogManager
      title="Watch category Management"
      addLabel="Add New category"
      nameColumn="category name"
      noun="category"
      addModalTitle="Add New Category"
      editModalTitle="Edit New Category"
      inputLabel="Enter Category name"
      inputPlaceholder="Please Enter Category Name"
      initial={CATEGORIES}
    />
  );
}
