import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Front-end store for "Set up as Private seller" (User Web, Milestone 2).
 * Mirrors backend_ref users.user_verify:
 *   1 → 'none'      not set up yet
 *   3 → 'review'    submitted, waiting for admin approval
 *   2 → 'approved'  can create listings
 *   4 → 'rejected'  may try again
 *   5 → 'blocked'   rejected permanently
 * Kept in web localStorage so a refresh doesn't lose the demo state.
 */
export type SellerStatus = 'none' | 'review' | 'approved' | 'rejected' | 'blocked';

export type SellerDocs = {
  businessFront: string | null;
  businessBack: string | null;
  addressFront: string | null;
  addressBack: string | null;
  identityFront: string | null;
  identityBack: string | null;
};

export type SellerAddress = {
  countryCode: string;
  mobile: string;
  street1: string;
  street2: string;
  city: string;
  zip: string;
  country: string;
  fax: string;
  website: string;
  taxInfo: string;
  taxPayerId: string;
};

export type SellerBank = {
  accountNumber: string;
  iban: string;
  routing: string;
  swift: string;
  holderName: string;
  holderAddress: string;
};

export type SellerState = {
  status: SellerStatus;
  rejectedReason: string;
  docs: SellerDocs;
  address: SellerAddress;
  bank: SellerBank;
};

const EMPTY: SellerState = {
  status: 'none',
  rejectedReason: '',
  docs: { businessFront: null, businessBack: null, addressFront: null, addressBack: null, identityFront: null, identityBack: null },
  address: {
    countryCode: '+91',
    mobile: '',
    street1: '',
    street2: '',
    city: '',
    zip: '',
    country: '',
    fax: '',
    website: '',
    taxInfo: '',
    taxPayerId: '',
  },
  bank: { accountNumber: '', iban: '', routing: '', swift: '', holderName: '', holderAddress: '' },
};

const KEY = 'ichrono.seller';

type Ctx = SellerState & {
  setDocs: (d: SellerDocs) => void;
  setAddress: (a: SellerAddress) => void;
  setBank: (b: SellerBank) => void;
  setStatus: (s: SellerStatus, reason?: string) => void;
  reset: () => void;
};

const SellerContext = createContext<Ctx | null>(null);

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SellerState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage?.getItem(KEY) : null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from localStorage after hydration
      if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      // blob: image URIs don't survive a reload, so only persist the text data
      const { docs, ...rest } = state;
      const keepDocs = Object.fromEntries(
        Object.entries(docs).map(([k, v]) => [k, v && !v.startsWith('blob:') ? v : null]),
      );
      window.localStorage?.setItem(KEY, JSON.stringify({ ...rest, docs: keepDocs }));
    } catch {
      // ignore
    }
  }, [state, ready]);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      setDocs: (docs) => setState((s) => ({ ...s, docs })),
      setAddress: (address) => setState((s) => ({ ...s, address })),
      setBank: (bank) => setState((s) => ({ ...s, bank })),
      setStatus: (status, reason = '') => setState((s) => ({ ...s, status, rejectedReason: reason })),
      reset: () => setState(EMPTY),
    }),
    [state],
  );

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}

export function useSeller() {
  const c = useContext(SellerContext);
  if (!c) throw new Error('useSeller must be used inside SellerProvider');
  return c;
}
