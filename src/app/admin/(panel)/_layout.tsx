import { Slot } from 'expo-router';
import AdminShell from '@/components/admin/AdminShell';

/** All signed-in admin pages share the sidebar + top bar shell. */
export default function AdminPanelLayout() {
  return (
    <AdminShell>
      <Slot />
    </AdminShell>
  );
}
