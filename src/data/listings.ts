/**
 * Listings demo data (Milestone 3) – shared by User Web "Create listing",
 * Dealer "Listings" and Admin "Product Management".
 *
 * Mirrors backend_ref `products` + `product_conditions` + `product_images`:
 *   admin_approved 0 → 'pending' (admin "Verification" tab)
 *                  1 → 'approved' (user "Approved", dealer "Live")
 *                  2 → 'rejected'
 *   status 3 (saved as draft) → 'draft'
 * Static demo data – replace with API calls when the backend is connected.
 */

import { BRANDS, CATEGORIES, WATCH_SETTINGS } from './admin';

// ─── Images ─────────────────────────────────────────────────────────────────
/** Demo images are stored as `asset:<name>`; uploaded ones as normal URIs. */
const ASSET_IMAGES: Record<string, any> = {
  'asset:recomm-1': require('@/assets/images/recomm-1.png'),
  'asset:recomm-2': require('@/assets/images/recomm-2.png'),
  'asset:recomm-3': require('@/assets/images/recomm-3.png'),
  'asset:recomm-4': require('@/assets/images/recomm-4.png'),
  'asset:watch-product': require('@/assets/images/watch-product.png'),
  'asset:product-img': require('@/assets/images/product-img.png'),
  'asset:watch-1': require('@/assets/images/selling/watch-1.png'),
};

/** Image `source` for a stored image reference (or null when there is none). */
export function imageSource(ref: string | null | undefined): any {
  if (!ref) return null;
  return ASSET_IMAGES[ref] ?? { uri: ref };
}

// ─── Conditions (step five) ─────────────────────────────────────────────────
export type ConditionLevel = 'none' | 'barely_visible' | 'noticeable' | 'obvious';

export const CONDITION_LEVELS: { key: ConditionLevel; label: string; desc: string }[] = [
  { key: 'none', label: 'None', desc: 'Like new; no scratches or other signs of wear; unpolished.' },
  { key: 'barely_visible', label: 'Barely Visible', desc: 'Minor hairline marks that are only visible under direct light.' },
  { key: 'noticeable', label: 'Noticeable', desc: 'Visible scratches or dings; general wear consistent with regular use.' },
  { key: 'obvious', label: 'Obvious', desc: 'Heavy signs of wear; deep scratches, dents or discoloration.' },
];

export const conditionLabel = (c?: ConditionLevel | null) => CONDITION_LEVELS.find((l) => l.key === c)?.label ?? '';

export type WatchPart = 'case' | 'dial' | 'bezel' | 'crystal' | 'caseBack' | 'band';

/** The six "Set the Overall Condition" rows; `icon` stands in for case.svg, dial.svg … */
export const WATCH_PARTS: { key: WatchPart; label: string; icon: string }[] = [
  { key: 'case', label: 'Case', icon: 'clock' },
  { key: 'dial', label: 'Dial', icon: 'circle-dot' },
  { key: 'bezel', label: 'Bezel', icon: 'ring' },
  { key: 'crystal', label: 'Crystal', icon: 'gem' },
  { key: 'caseBack', label: 'Case Back', icon: 'circle-half-stroke' },
  { key: 'band', label: 'Band and Clasp', icon: 'link' },
];

// ─── Listing ────────────────────────────────────────────────────────────────
export type ListingOwner = 'user' | 'dealer' | 'admin';
export type ListingStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type Gender = 'Male' | 'Female' | 'Other';

export type Listing = {
  id: string;
  owner: ListingOwner;
  ownerId: string; //          customer / dealer id shown to the admin
  ownerName: string;
  country: string;
  // step one
  brand: string;
  model: string;
  reference: string;
  // step two – watch information
  year: string;
  gender: Gender | '';
  serial: string;
  dialColor: string;
  diameterMin: string;
  diameterMax: string;
  category: string;
  movement: string;
  caseMaterial: string;
  braceletMaterial: string;
  braceletColor: string;
  scope: string;
  price: string;
  // step three / four – pictures
  images: string[];
  proof: [string | null, string | null];
  // step five – conditions
  hasWear: boolean;
  conditions: Partial<Record<WatchPart, ConditionLevel>>;
  // step six – description (+ dealer shipping costs)
  description: string;
  domestic: { min: string; max: string; cost: string };
  continental: { min: string; max: string };
  // state
  status: ListingStatus;
  active: boolean; //           dealer "Live" switch / admin "Action" switch
  rejectReason: string;
  productCode: string;
  createdAt: number;
  updatedAt: number;
  views: string;
  favourites: string;
  messages: number;
};

export const EMPTY_LISTING: Omit<Listing, 'id' | 'owner' | 'ownerId' | 'ownerName' | 'country' | 'createdAt' | 'updatedAt'> = {
  brand: '',
  model: '',
  reference: '',
  year: '',
  gender: '',
  serial: '',
  dialColor: '',
  diameterMin: '',
  diameterMax: '',
  category: '',
  movement: '',
  caseMaterial: '',
  braceletMaterial: '',
  braceletColor: '',
  scope: '',
  price: '',
  images: [],
  proof: [null, null],
  hasWear: false,
  conditions: {},
  description: '',
  domestic: { min: '', max: '', cost: '' },
  continental: { min: '', max: '' },
  status: 'draft',
  active: true,
  rejectReason: '',
  productCode: '',
  views: '0',
  favourites: '0',
  messages: 0,
};

// ─── Option lists used by the forms ─────────────────────────────────────────
const names = (list: { name: string }[]) => list.map((i) => i.name);
export const LISTING_OPTIONS = {
  brands: names(BRANDS),
  categories: names(CATEGORIES),
  dialColors: names(WATCH_SETTINGS.dial),
  movements: names(WATCH_SETTINGS.movement),
  caseMaterials: names(WATCH_SETTINGS.caseMaterial),
  braceletMaterials: names(WATCH_SETTINGS.braceletMaterial),
  braceletColors: names(WATCH_SETTINGS.braceletColor),
  scopes: names(WATCH_SETTINGS.scope),
  genders: ['Male', 'Female', 'Other'] as Gender[],
  years: Array.from({ length: new Date().getFullYear() - 1950 + 1 }, (_, i) => String(new Date().getFullYear() - i)),
  diameters: [
    { label: '1 - 2.5', min: 1, max: 2.5 },
    { label: '2.6 - 3.5', min: 2.6, max: 3.5 },
    { label: '36 - 40 mm', min: 36, max: 40 },
    { label: '41 - 44 mm', min: 41, max: 44 },
  ],
};

// ─── Watch catalogue ("Search Watch, Fetch from DB & 3rd party API") ────────
export type CatalogWatch = {
  id: string;
  brand: string;
  model: string;
  reference: string;
  caseMaterial: string;
  dialColor: string;
  diameterMin: string;
  diameterMax: string;
  year: string;
  image: string;
};

// extra gallery pictures for seeded listings (the smartwatch photo watch-product.png isn't used for listings)
const CAT_IMAGES = ['asset:recomm-1', 'asset:recomm-2', 'asset:recomm-3', 'asset:recomm-4', 'asset:watch-1'];

// the last column picks the demo photo that best matches the watch
export const CATALOG: CatalogWatch[] = [
  ['Rolex', 'Submariner Date', '126610LN', 'Stainless Steel', 'Black', '40', '41', '2022', 'asset:recomm-1'],
  ['Rolex', 'Sky-Dweller', '336934', 'Stainless Steel', 'Blue', '42', '42', '2023', 'asset:recomm-2'],
  ['Rolex', 'Daytona', '116500LN', 'Stainless Steel', 'White', '40', '40', '2019', 'asset:watch-1'],
  ['Patek Philippe', 'Nautilus', '5711/1A', 'Stainless Steel', 'Blue', '40', '40', '2020', 'asset:recomm-1'],
  ['Patek Philippe', 'Calatrava', '5227G', 'White Gold', 'Silver', '39', '39', '2018', 'asset:recomm-2'],
  ['Omega', 'Speedmaster Moonwatch', '310.30.42.50.01.001', 'Stainless Steel', 'Black', '42', '42', '2021', 'asset:recomm-3'],
  ['Omega', 'Seamaster 300M', '210.30.42.20.03.001', 'Stainless Steel', 'Blue', '42', '42', '2022', 'asset:recomm-4'],
  ['Audemars Piguet', 'Royal Oak', '15500ST', 'Stainless Steel', 'Grey', '41', '41', '2021', 'asset:recomm-1'],
  ['Cartier', 'Santos', 'WSSA0018', 'Stainless Steel', 'Silver', '39', '40', '2020', 'asset:product-img'],
  ['TAG Heuer', 'Carrera', 'CBN2A1B', 'Stainless Steel', 'Black', '44', '44', '2022', 'asset:recomm-3'],
  ['Breitling', 'Navitimer B01', 'AB0138211', 'Stainless Steel', 'Black', '43', '43', '2021', 'asset:watch-1'],
  ['Tudor', 'Black Bay 58', 'M79030N', 'Stainless Steel', 'Black', '39', '39', '2023', 'asset:recomm-4'],
].map(([brand, model, reference, caseMaterial, dialColor, diameterMin, diameterMax, year, image], i) => ({
  id: `cat-${i + 1}`,
  brand,
  model,
  reference,
  caseMaterial,
  dialColor,
  diameterMin,
  diameterMax,
  year,
  image,
}));

// ─── Seed listings ──────────────────────────────────────────────────────────
/** The signed-in demo user's own customer id (User Web profile). */
export const DEMO_USER_ID = 'IC100045';
/** The signed-in demo dealer (Dealer Web). */
export const DEMO_DEALER_ID = 'ICD1001';

const DAY = 86_400_000;
const BASE = Date.UTC(2026, 9, 1);

type Seed = {
  owner: ListingOwner;
  ownerId: string;
  ownerName: string;
  country: string;
  status: ListingStatus;
  cat: number;
  gender: Gender;
  price: string;
  reason?: string;
  active?: boolean;
};

function fromSeed(s: Seed, i: number): Listing {
  const c = CATALOG[s.cat];
  return {
    ...EMPTY_LISTING,
    id: `seed-${i + 1}`,
    owner: s.owner,
    ownerId: s.ownerId,
    ownerName: s.ownerName,
    country: s.country,
    brand: c.brand,
    model: c.model,
    reference: c.reference,
    year: c.year,
    gender: s.gender,
    serial: `GS${String(28 + i).padStart(4, '0')}/0${(i % 8) + 1}`,
    dialColor: c.dialColor,
    diameterMin: c.diameterMin,
    diameterMax: c.diameterMax,
    category: LISTING_OPTIONS.categories[i % LISTING_OPTIONS.categories.length],
    movement: LISTING_OPTIONS.movements[i % 3],
    caseMaterial: c.caseMaterial,
    braceletMaterial: LISTING_OPTIONS.braceletMaterials[i % 4],
    braceletColor: LISTING_OPTIONS.braceletColors[i % 4],
    scope: LISTING_OPTIONS.scopes[i % 4],
    price: s.price,
    images: [c.image, CAT_IMAGES[(i + 2) % CAT_IMAGES.length]],
    proof: ['asset:watch-1', 'asset:watch-1'],
    hasWear: i % 2 === 0,
    conditions: { case: 'none', dial: 'none', bezel: 'barely_visible', crystal: 'none', caseBack: 'barely_visible', band: 'noticeable' },
    description: `${c.brand} ${c.model} in excellent condition, full set with original box and papers.`,
    domestic: { min: '100', max: '1000', cost: '20' },
    continental: { min: '100', max: '5000' },
    status: s.status,
    active: s.active ?? true,
    rejectReason: s.reason ?? '',
    productCode: String(5789012 + i * 37),
    createdAt: BASE + i * 3 * DAY,
    updatedAt: BASE + i * 3 * DAY + (i % 4) * DAY,
    views: `${(i % 6) * 10 + 5}K`,
    favourites: `${(i % 5) * 30 + 20}K`,
    messages: (i % 7) * 5 + 3,
  };
}

const PHOTO_REASON = 'The pictures are not clear. Please upload sharp photos of the dial, case and case back.';
const PROOF_REASON = 'The proof of ownership pictures do not show the requested time.';

const SEEDS: Seed[] = [
  // signed-in demo user (private seller)
  { owner: 'user', ownerId: DEMO_USER_ID, ownerName: 'Joe', country: 'India', status: 'approved', cat: 1, gender: 'Male', price: '120000' },
  { owner: 'user', ownerId: DEMO_USER_ID, ownerName: 'Joe', country: 'India', status: 'pending', cat: 5, gender: 'Male', price: '8500' },
  { owner: 'user', ownerId: DEMO_USER_ID, ownerName: 'Joe', country: 'India', status: 'rejected', cat: 9, gender: 'Male', price: '5200', reason: PHOTO_REASON },
  { owner: 'user', ownerId: DEMO_USER_ID, ownerName: 'Joe', country: 'India', status: 'draft', cat: 8, gender: 'Female', price: '7600' },
  // other private sellers
  { owner: 'user', ownerId: 'IC100012', ownerName: 'John Doe', country: 'Australia', status: 'approved', cat: 0, gender: 'Male', price: '14500' },
  { owner: 'user', ownerId: 'IC100018', ownerName: 'Sophia Müller', country: 'Germany', status: 'approved', cat: 4, gender: 'Female', price: '32000' },
  { owner: 'user', ownerId: 'IC100023', ownerName: 'Mia Tanaka', country: 'Japan', status: 'pending', cat: 7, gender: 'Male', price: '41000' },
  { owner: 'user', ownerId: 'IC100031', ownerName: 'Arjun Mehta', country: 'India', status: 'pending', cat: 11, gender: 'Male', price: '4300' },
  { owner: 'user', ownerId: 'IC100037', ownerName: 'Liam Smith', country: 'United Kingdom', status: 'rejected', cat: 2, gender: 'Male', price: '29000', reason: PROOF_REASON },
  // signed-in demo dealer
  { owner: 'dealer', ownerId: DEMO_DEALER_ID, ownerName: 'K. Anderson', country: 'United States', status: 'draft', cat: 3, gender: 'Male', price: '95000' },
  { owner: 'dealer', ownerId: DEMO_DEALER_ID, ownerName: 'K. Anderson', country: 'United States', status: 'draft', cat: 10, gender: 'Male', price: '7900' },
  { owner: 'dealer', ownerId: DEMO_DEALER_ID, ownerName: 'K. Anderson', country: 'United States', status: 'approved', cat: 0, gender: 'Male', price: '15200' },
  { owner: 'dealer', ownerId: DEMO_DEALER_ID, ownerName: 'K. Anderson', country: 'United States', status: 'approved', cat: 2, gender: 'Male', price: '31000' },
  { owner: 'dealer', ownerId: DEMO_DEALER_ID, ownerName: 'K. Anderson', country: 'United States', status: 'approved', cat: 6, gender: 'Male', price: '5600', active: false },
  { owner: 'dealer', ownerId: DEMO_DEALER_ID, ownerName: 'K. Anderson', country: 'United States', status: 'approved', cat: 4, gender: 'Female', price: '27500' },
  { owner: 'dealer', ownerId: DEMO_DEALER_ID, ownerName: 'K. Anderson', country: 'United States', status: 'pending', cat: 7, gender: 'Male', price: '39900' },
  { owner: 'dealer', ownerId: DEMO_DEALER_ID, ownerName: 'K. Anderson', country: 'United States', status: 'pending', cat: 1, gender: 'Male', price: '118000' },
  { owner: 'dealer', ownerId: DEMO_DEALER_ID, ownerName: 'K. Anderson', country: 'United States', status: 'rejected', cat: 9, gender: 'Male', price: '6100', reason: PHOTO_REASON },
  // other dealers
  { owner: 'dealer', ownerId: 'ICD1004', ownerName: 'Sophia Müller', country: 'United Arab Emirates', status: 'approved', cat: 3, gender: 'Male', price: '98000' },
  { owner: 'dealer', ownerId: 'ICD1007', ownerName: 'Mia Tanaka', country: 'Switzerland', status: 'pending', cat: 8, gender: 'Female', price: '7400' },
  { owner: 'dealer', ownerId: 'ICD1010', ownerName: 'Arjun Mehta', country: 'Singapore', status: 'rejected', cat: 5, gender: 'Male', price: '8800', reason: PROOF_REASON },
  // added by the admin
  { owner: 'admin', ownerId: 'ADMIN', ownerName: 'Admin', country: 'United Kingdom', status: 'approved', cat: 3, gender: 'Male', price: '102000' },
  { owner: 'admin', ownerId: 'ADMIN', ownerName: 'Admin', country: 'United Kingdom', status: 'approved', cat: 10, gender: 'Male', price: '8200' },
  { owner: 'admin', ownerId: 'ADMIN', ownerName: 'Admin', country: 'United Kingdom', status: 'approved', cat: 11, gender: 'Female', price: '4400', active: false },
];

export const SEED_LISTINGS: Listing[] = SEEDS.map(fromSeed);

// ─── Formatting helpers ─────────────────────────────────────────────────────
export function formatPrice(v: string | number, decimals = 0): string {
  const n = Number(String(v).replace(/[^0-9.]/g, ''));
  if (!isFinite(n)) return '$0';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}-${p(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
}

export const listingTitle = (l: Pick<Listing, 'brand' | 'model'>) => [l.brand, l.model].filter(Boolean).join(' ') || 'Untitled watch';

// ─── Home page cards (Milestone 4) ──────────────────────────────────────────
const COUNTRY_CODES: Record<string, string> = {
  India: 'IN',
  Australia: 'AU',
  Germany: 'DE',
  Japan: 'JP',
  'United Kingdom': 'GB',
  'United States': 'US',
  'United Arab Emirates': 'AE',
  Switzerland: 'CH',
  Singapore: 'SG',
  France: 'FR',
  Italy: 'IT',
  Canada: 'CA',
};

export const countryCode = (country: string) => COUNTRY_CODES[country] ?? country.slice(0, 2).toUpperCase();

/** Overall grade from the worst of the six part conditions (the card's second tag, e.g. "Good"). */
export function overallGrade(l: Pick<Listing, 'conditions'>): string {
  const order: ConditionLevel[] = ['none', 'barely_visible', 'noticeable', 'obvious'];
  const worst = Math.max(...Object.values(l.conditions).map((c) => order.indexOf(c as ConditionLevel)), 0);
  return ['Mint', 'Very Good', 'Good', 'Fair'][worst];
}

/** Listings shown to buyers: approved by the admin and switched on. Newest first. */
export const forSale = (list: Listing[]) =>
  list.filter((l) => l.status === 'approved' && l.active).sort((a, b) => b.updatedAt - a.updatedAt);
