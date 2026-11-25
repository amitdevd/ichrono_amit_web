import React from 'react';
import { Redirect } from 'expo-router';
import { getHomeRouteForRole, useAuth } from '@/context/auth-context';

/**
 * "/" opens the User Web home page directly (as in backend_ref).
 * Signed-in dealers/admins go to their dashboards.
 * Dealer and admin logins live at /dealer/login and /admin/login.
 */
export default function Index() {
  const { user } = useAuth();
  return <Redirect href={getHomeRouteForRole(user?.role) as any} />;
}
