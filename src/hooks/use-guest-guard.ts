import { useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth-context';

/**
 * Guest mode (Milestone 2): guests may only view the home page.
 *  - requireLogin(): wraps an action; guests are sent to the login page instead.
 *  - useRequireUser(): for whole pages (profile, seller setup) – redirects guests.
 */
export function useGuestGuard() {
  const { isLoggedIn } = useAuth();
  const requireLogin = useCallback(
    (action?: () => void) => () => {
      if (!isLoggedIn) {
        router.push('/(auth)/login' as any);
        return;
      }
      action?.();
    },
    [isLoggedIn],
  );
  return { isGuest: !isLoggedIn, requireLogin };
}

export function useRequireUser() {
  const { isLoggedIn, isReady } = useAuth();
  useEffect(() => {
    if (isReady && !isLoggedIn) router.replace('/(auth)/login' as any);
  }, [isReady, isLoggedIn]);
  return isReady && isLoggedIn;
}
