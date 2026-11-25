/**
 * Admin panel demo data (brands, categories, dealers, watch settings, countries, banners).
 * Static demo data – replace with API calls when the backend is connected
 * (see backend_ref/routes for the matching endpoints).
 */

import { COUNTRIES } from './common';

export type Brand = { id: number; name: string; image: string | null; active: boolean };

export const BRANDS: Brand[] = [
  'Rolex',
  'Patek Philippe',
  'Omega',
  'Audemars Piguet',
  'TAG Heuer',
  'Cartier',
  'Breitling',
  'IWC Schaffhausen',
  'Hublot',
  'Jaeger-LeCoultre',
  'Panerai',
  'Tudor',
  'Vacheron Constantin',
  'Longines',
].map((name, i) => ({ id: i + 1, name, image: null, active: i % 5 !== 3 }));

export type Category = { id: number; name: string; image: string | null; active: boolean };

export const CATEGORIES: Category[] = [
  'Dress Watch',
  'Diver Watch',
  'Pilot Watch',
  'Chronograph',
  'Field Watch',
  'GMT Watch',
  'Racing Watch',
  'Smart Watch',
  'Skeleton Watch',
  'Moon Phase',
  'Tourbillon',
].map((name, i) => ({ id: i + 1, name, image: null, active: i % 4 !== 2 }));

export type DealerStatus = 'approved' | 'verification' | 'rejected';

export type Dealer = {
  id: number;
  uniqueId: string;
  joined: string; // dd-mm-yyyy
  joinedIso: string; // yyyy-mm-dd for filters
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  countryCode: string;
  phone: string;
  country: string;
  company: string;
  platformName: string;
  businessType: string;
  fax: string;
  website: string;
  vatId: string;
  ongoing: number;
  completed: number;
  cancelled: number;
  watchesListed: number;
  blocked: boolean;
  status: DealerStatus;
  rejectType?: 'Complete_Reject' | 'Document_Reject';
  rejectReason?: string;
  address: { street: string; street2: string; zip: string; country: string };
  bank: { account: string; routing: string; code: string; holder: string; holderAddress: string };
};

const firstNames = ['Aarav', 'Oliver', 'Liam', 'Sophia', 'Emma', 'Noah', 'Mia', 'Lucas', 'Isha', 'Arjun', 'Hannah', 'Leo'];
const lastNames = ['Sharma', 'Smith', 'Brown', 'Müller', 'Dubois', 'Rossi', 'Tanaka', 'Wilson', 'Kapoor', 'Mehta', 'Fischer', 'Martin'];
const companies = ['Timeless Co.', 'Royal Watches', 'Chrono House', 'Luxe Time Ltd', 'Heritage Horology', 'Swiss Vault', 'Crown & Dial', 'Prime Ticks'];
const codes: Record<string, string> = {
  India: '+91',
  'United Kingdom': '+44',
  'United States': '+1',
  'United Arab Emirates': '+971',
  Germany: '+49',
  France: '+33',
  Switzerland: '+41',
  Italy: '+39',
  Japan: '+81',
  Singapore: '+65',
  Australia: '+61',
  Canada: '+1',
};

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export const DEALERS: Dealer[] = Array.from({ length: 36 }, (_, i) => {
  const status: DealerStatus = i % 3 === 0 ? 'approved' : i % 3 === 1 ? 'verification' : 'rejected';
  const country = COUNTRIES[i % COUNTRIES.length];
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[(i * 5) % lastNames.length];
  const day = (i % 27) + 1;
  const month = (i % 11) + 1;
  const company = companies[i % companies.length];
  return {
    id: i + 1,
    uniqueId: `ICD${String(1001 + i)}`,
    joined: `${pad(day)}-${pad(month)}-2025`,
    joinedIso: `2025-${pad(month)}-${pad(day)}`,
    firstName: fn,
    lastName: ln,
    username: `${fn.toLowerCase()}${i + 1}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase().replace('ü', 'u')}@example.com`,
    countryCode: codes[country],
    phone: `98${String(10000000 + i * 7919).slice(0, 8)}`,
    country,
    company,
    platformName: 'Fluper Limited',
    businessType: i % 2 === 0 ? 'Corporation' : 'Self Propriptor',
    fax: 'Fax Number',
    website: `www.${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    vatId: `VAT${String(560000 + i * 13)}`,
    ongoing: (i * 3) % 7,
    completed: (i * 5) % 19,
    cancelled: i % 3,
    watchesListed: (i * 7) % 40,
    blocked: i % 7 === 0,
    status,
    rejectType: status === 'rejected' ? (i % 2 ? 'Document_Reject' : 'Complete_Reject') : undefined,
    rejectReason:
      status === 'rejected'
        ? 'The uploaded business registration document is unclear. Please upload a clear copy of both front and rear pages.'
        : undefined,
    address: {
      street: `${12 + i} High Street`,
      street2: `Suite ${100 + i}`,
      zip: `${110000 + i * 17}`,
      country,
    },
    bank: {
      account: `00012345${String(6789 + i)}`,
      routing: `0210000${pad(i)}`,
      code: `BANK${pad(i)}`,
      holder: `${fn} ${ln}`,
      holderAddress: `${12 + i} High Street, ${country}`,
    },
  };
});

export type NamedItem = { id: number; name: string; active: boolean };

const named = (names: string[]): NamedItem[] => names.map((name, i) => ({ id: i + 1, name, active: i % 6 !== 4 }));

/** admin/watch-setting – one list per tab */
export const WATCH_SETTINGS = {
  dial: named(['Black', 'White', 'Blue', 'Green', 'Silver', 'Champagne', 'Grey', 'Brown', 'Mother of Pearl', 'Red']),
  movement: named(['Automatic', 'Manual Winding', 'Quartz', 'Solar', 'Kinetic', 'Spring Drive']),
  caseMaterial: named(['Stainless Steel', 'Yellow Gold', 'White Gold', 'Rose Gold', 'Titanium', 'Ceramic', 'Platinum', 'Carbon']),
  braceletColor: named(['Black', 'Brown', 'Silver', 'Gold', 'Blue', 'Two-Tone', 'Green']),
  braceletMaterial: named(['Steel', 'Leather', 'Rubber', 'Gold', 'Titanium', 'Fabric (NATO)', 'Alligator']),
  scope: named(['Original box', 'Original papers', 'Box and papers', 'Watch only', 'Warranty card', 'Service papers']),
};

export type SavedCountry = { id: number; continent: string; country: string; active: boolean };

export const SAVED_COUNTRIES: SavedCountry[] = [
  ['Asia', 'India'],
  ['Asia', 'Japan'],
  ['Asia', 'Singapore'],
  ['Asia', 'United Arab Emirates'],
  ['Europe', 'France'],
  ['Europe', 'Germany'],
  ['Europe', 'Switzerland'],
  ['Europe', 'United Kingdom'],
  ['Americas', 'United States'],
  ['Americas', 'Canada'],
  ['Oceania', 'Australia'],
  ['Africa', 'South Africa'],
].map(([continent, country], i) => ({ id: i + 1, continent, country, active: i % 5 !== 3 }));

export type Banner = {
  id: number;
  image: string | null;
  title: string;
  countries: string[];
  brand: string;
  start: string; // yyyy-mm-dd
  end: string;
  added: string;
  active: boolean;
};

/** The home page carousel shows active banners whose start–end dates include today. */
export const BANNERS: Banner[] = [
  { title: 'Winter Collection', countries: ['India', 'United Kingdom'], brand: 'Rolex', start: '2026-11-01', end: '2027-01-31' },
  { title: 'Year End Sale', countries: ['United States', 'Canada'], brand: 'Omega', start: '2026-11-15', end: '2027-01-10' },
  { title: 'Luxury Week', countries: ['Switzerland', 'Italy'], brand: 'Patek Philippe', start: '2026-11-20', end: '2026-12-31' },
  { title: 'Eid Specials', countries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar'], brand: 'Cartier', start: '2026-03-15', end: '2026-04-10' },
  { title: 'Diwali Offer', countries: ['India'], brand: 'TAG Heuer', start: '2026-10-15', end: '2026-11-08' },
  { title: 'Spring Launch', countries: ['Japan', 'Singapore'], brand: 'Audemars Piguet', start: '2027-03-01', end: '2027-03-31' },
].map((b, i) => ({ ...b, id: i + 1, image: null, added: `2026-${String((i % 9) + 1).padStart(2, '0')}-1${i}`, active: i !== 3 }));
