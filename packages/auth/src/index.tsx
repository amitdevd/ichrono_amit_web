import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { router } from 'expo-router';

// ─── Supported Roles ─────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'dealer' | 'user';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  mobile?: string;
  role: UserRole;
  token?: string;
  isVerified: boolean;
};

type AuthState = {
  user: AuthUser | null;
  role: UserRole | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isOnboarded: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string, forceRole?: UserRole) => Promise<AuthUser>;
  register: (email: string, mobile: string, password: string, role?: UserRole) => Promise<AuthUser>;
  logout: (redirectTo?: string) => void;
  setOnboarded: () => void;
  hasRole: (role: UserRole) => boolean;
  getHomeRouteForRole: (role?: UserRole | null) => string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Role Home Route Mapper ──────────────────────────────────────────────────
export const getHomeRouteForRole = (role?: UserRole | null): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'dealer':
      return '/dealer/dashboard';
    case 'user':
    default:
      return '/home';
  }
};

export const getDashboardRouteForRole = (role?: UserRole | null): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'dealer':
      return '/dealer/dashboard';
    case 'user':
    default:
      return '/home';
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    isLoggedIn: false,
    isLoading: false,
    isOnboarded: false,
  });

  const setOnboarded = useCallback(() => {
    setState((prev) => ({ ...prev, isOnboarded: true }));
  }, []);

  const login = useCallback(
    async (email: string, _password: string, forceRole?: UserRole): Promise<AuthUser> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Strict role detection (based on email domain or explicit portal)
      let resolvedRole: UserRole = forceRole || 'user';
      if (!forceRole) {
        if (email.includes('admin')) {
          resolvedRole = 'admin';
        } else if (email.includes('dealer')) {
          resolvedRole = 'dealer';
        }
      }

      const authenticatedUser: AuthUser = {
        id: `usr_${Date.now()}`,
        email,
        name: resolvedRole === 'admin' ? 'Super Administrator' : resolvedRole === 'dealer' ? 'Certified Dealer' : 'Member Enthusiast',
        role: resolvedRole,
        isVerified: true,
      };

      setState({
        user: authenticatedUser,
        role: resolvedRole,
        isLoggedIn: true,
        isLoading: false,
        isOnboarded: true,
      });

      return authenticatedUser;
    },
    [],
  );

  const register = useCallback(
    async (email: string, mobile: string, _password: string, role: UserRole = 'user'): Promise<AuthUser> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      await new Promise((resolve) => setTimeout(resolve, 600));

      const newUser: AuthUser = {
        id: `usr_${Date.now()}`,
        email,
        mobile,
        name: 'New Registered User',
        role,
        isVerified: false,
      };

      setState({
        user: newUser,
        role,
        isLoggedIn: true,
        isLoading: false,
        isOnboarded: false,
      });

      return newUser;
    },
    [],
  );

  const logout = useCallback((redirectTo: string = '/(auth)/login') => {
    setState({
      user: null,
      role: null,
      isLoggedIn: false,
      isLoading: false,
      isOnboarded: false,
    });
    router.replace(redirectTo as any);
  }, []);

  const hasRole = useCallback(
    (targetRole: UserRole) => {
      return state.role === targetRole;
    },
    [state.role],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      register,
      logout,
      setOnboarded,
      hasRole,
      getHomeRouteForRole,
    }),
    [state, login, register, logout, setOnboarded, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook: useAuth ───────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ─── Hook: useRequireRole (Strict Role Guard) ─────────────────────────────────
export function useRequireRole(allowedRoles: UserRole[], redirectPath?: string) {
  const { user, role, isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      router.replace('/(auth)/login' as any);
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      // Unauthorized role -> redirect to their designated portal
      const target = redirectPath || getHomeRouteForRole(role);
      router.replace(target as any);
    }
  }, [isLoggedIn, role, isLoading, allowedRoles, redirectPath]);

  return { user, role, isAuthorized: role ? allowedRoles.includes(role) : false };
}
