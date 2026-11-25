import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EMPTY_LISTING, SEED_LISTINGS, type Listing, type ListingOwner, type ListingStatus } from '@/data';

/**
 * Front-end store for watch listings (Milestone 3).
 *
 * One list shared by every portal, so the demo behaves like the real system:
 *  - a user / dealer creates a listing step by step (it exists as a draft from step one,
 *    like backend_ref's listStepOne → listStepSix);
 *  - "Submit" sends it to admin → Product Management → Verification;
 *  - the admin approves / rejects it and the user's profile + dealer's Listings update.
 * Kept in web localStorage so a refresh keeps the demo state.
 */
// bump the version when the demo seed data changes, so old saved demo data is replaced
const KEY = 'ichrono.listings.v2';

type NewListing = { owner: ListingOwner; ownerId: string; ownerName: string; country: string } & Partial<Listing>;

type Ctx = {
  listings: Listing[];
  ready: boolean;
  get: (id: string | undefined | null) => Listing | undefined;
  create: (data: NewListing) => string;
  update: (id: string, patch: Partial<Listing>) => void;
  setStatus: (id: string, status: ListingStatus, rejectReason?: string) => void;
  remove: (id: string) => void;
  reset: () => void;
};

const ListingsContext = createContext<Ctx | null>(null);

/** blob: URIs (picked files) don't survive a reload, so they aren't persisted. */
const keep = (u: string | null) => (u && !u.startsWith('blob:') ? u : null);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(SEED_LISTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage?.getItem(KEY) : null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from localStorage after hydration
      if (raw) setListings(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      const data = listings.map((l) => ({
        ...l,
        images: l.images.map(keep).filter(Boolean),
        proof: [keep(l.proof[0]), keep(l.proof[1])],
      }));
      window.localStorage?.setItem(KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [listings, ready]);

  const get = useCallback((id: string | undefined | null) => listings.find((l) => l.id === id), [listings]);

  const create = useCallback((data: NewListing) => {
    const now = Date.now();
    const id = `l${now.toString(36)}`;
    setListings((list) => [
      {
        ...EMPTY_LISTING,
        productCode: String(5790000 + (now % 99999)),
        createdAt: now,
        updatedAt: now,
        ...data,
        id,
      },
      ...list,
    ]);
    return id;
  }, []);

  const update = useCallback((id: string, patch: Partial<Listing>) => {
    setListings((list) => list.map((l) => (l.id === id ? { ...l, ...patch, updatedAt: Date.now() } : l)));
  }, []);

  const setStatus = useCallback(
    (id: string, status: ListingStatus, rejectReason = '') => update(id, { status, rejectReason }),
    [update],
  );

  const remove = useCallback((id: string) => setListings((list) => list.filter((l) => l.id !== id)), []);
  const reset = useCallback(() => setListings(SEED_LISTINGS), []);

  const value = useMemo<Ctx>(
    () => ({ listings, ready, get, create, update, setStatus, remove, reset }),
    [listings, ready, get, create, update, setStatus, remove, reset],
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  const c = useContext(ListingsContext);
  if (!c) throw new Error('useListings must be used inside ListingsProvider');
  return c;
}
