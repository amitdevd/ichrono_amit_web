import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * Front-end only store for the dealer "Create Account" wizard
 * (backend_ref dealer/auth: signUp → registrationStepTwo … registrationStepSix).
 * Keeps the values between steps so the Summary page can show them.
 */
export type DealerSignupData = {
  companyName: string;
  typeOfBusiness: '' | 'Self Propriptor' | 'Corporation';
  country: string;
  title: '' | 'Mr.' | 'Mrs.';
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  contactNumber: string;
  mobileVerified: boolean;
  accountUsername: string;
  password: string;
  // step 3
  street1: string;
  street2: string;
  zip: string;
  countryAddress: string;
  website: string;
  commercialRegistrationNumber: string;
  taxpayerId: string;
  permanentEstablishmentNumber: string;
  vatId: string;
  // step 4
  bankAccountNumber: string;
  iban: string;
  routingNumber: string;
  swiftCode: string;
  accountHolderName: string;
  accountHolderAddress: string;
  // step 5
  docs: {
    businessFront: string | null;
    businessRear: string | null;
    addressFront: string | null;
    addressRear: string | null;
    identityFront: string | null;
    identityRear: string | null;
  };
};

export const EMPTY_DEALER: DealerSignupData = {
  companyName: '',
  typeOfBusiness: '',
  country: '',
  title: '',
  firstName: '',
  lastName: '',
  email: '',
  countryCode: '+91',
  contactNumber: '',
  mobileVerified: false,
  accountUsername: '',
  password: '',
  street1: '',
  street2: '',
  zip: '',
  countryAddress: '',
  website: '',
  commercialRegistrationNumber: '',
  taxpayerId: '',
  permanentEstablishmentNumber: '',
  vatId: '',
  bankAccountNumber: '',
  iban: '',
  routingNumber: '',
  swiftCode: '',
  accountHolderName: '',
  accountHolderAddress: '',
  docs: {
    businessFront: null,
    businessRear: null,
    addressFront: null,
    addressRear: null,
    identityFront: null,
    identityRear: null,
  },
};

type Ctx = {
  data: DealerSignupData;
  update: (patch: Partial<DealerSignupData>) => void;
  reset: () => void;
};

const DealerSignupContext = createContext<Ctx | null>(null);

export function DealerSignupProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DealerSignupData>(EMPTY_DEALER);
  const value = useMemo<Ctx>(
    () => ({
      data,
      update: (patch) => setData((d) => ({ ...d, ...patch })),
      reset: () => setData(EMPTY_DEALER),
    }),
    [data],
  );
  return <DealerSignupContext.Provider value={value}>{children}</DealerSignupContext.Provider>;
}

export function useDealerSignup() {
  const ctx = useContext(DealerSignupContext);
  if (!ctx) throw new Error('useDealerSignup must be used inside DealerSignupProvider');
  return ctx;
}
