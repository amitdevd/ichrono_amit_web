import { Slot } from 'expo-router';
import AdminShell from '@/components/admin/AdminShell';
import { AdminDataProvider } from '@/context/admin-data';

/** All signed-in admin pages share the sidebar + top bar shell. */
export default function AdminPanelLayout() {
  return (
    <AdminDataProvider>
      <AdminShell>
        <Slot />
      </AdminShell>
    </AdminDataProvider>
  );
}
