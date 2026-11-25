import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BANNERS, BRANDS, type Banner, type Brand } from '@/data';

/**
 * Content the admin manages for the User Web (Milestone 4 – Home Page):
 *  - banners (admin → Banners)  → home page carousel
 *  - brands  (admin → Brands)   → home page "Popular Brands"
 * Shared by the admin pages and the home page, and kept in web localStorage
 * so changes made in the admin panel show up on the home page.
 */
const KEY = 'ichrono.content';

type Ctx = {
  banners: Banner[];
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
};

const SiteContentContext = createContext<Ctx | null>(null);

/** blob: URIs (picked files) don't survive a reload */
const keep = (u: string | null) => (u && !u.startsWith('blob:') ? u : null);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<Banner[]>(BANNERS);
  const [brands, setBrands] = useState<Brand[]>(BRANDS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage?.getItem(KEY) : null;
      if (raw) {
        const saved = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from localStorage after hydration
        if (Array.isArray(saved.banners)) setBanners(saved.banners);
        if (Array.isArray(saved.brands)) setBrands(saved.brands);
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage?.setItem(
        KEY,
        JSON.stringify({
          banners: banners.map((b) => ({ ...b, image: keep(b.image) })),
          brands: brands.map((b) => ({ ...b, image: keep(b.image) })),
        }),
      );
    } catch {
      // ignore
    }
  }, [banners, brands, ready]);

  const value = useMemo(() => ({ banners, setBanners, brands, setBrands }), [banners, brands]);
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const c = useContext(SiteContentContext);
  if (!c) throw new Error('useSiteContent must be used inside SiteContentProvider');
  return c;
}

/** today as yyyy-mm-dd (local time) */
export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Banners the home page shows today: active and inside their start–end dates. */
export function liveBanners(banners: Banner[], today = todayIso()) {
  return banners.filter((b) => b.active && b.start <= today && today <= b.end);
}
