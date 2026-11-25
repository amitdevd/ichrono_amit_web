import React, { createContext, useContext, useMemo, useState } from 'react';
import { SAVED_COUNTRIES, type SavedCountry } from '@/data';

/**
 * Front-end only store shared by admin pages that navigate between each other
 * (Countries setting → Manage Countries), so changes survive the navigation.
 */
type Ctx = {
  countries: SavedCountry[];
  setCountries: React.Dispatch<React.SetStateAction<SavedCountry[]>>;
};

const AdminDataContext = createContext<Ctx | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [countries, setCountries] = useState<SavedCountry[]>(SAVED_COUNTRIES);
  const value = useMemo(() => ({ countries, setCountries }), [countries]);
  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const c = useContext(AdminDataContext);
  if (!c) throw new Error('useAdminData must be used inside AdminDataProvider');
  return c;
}
