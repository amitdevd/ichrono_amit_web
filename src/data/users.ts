/**
 * Admin "User Management" demo data (Milestone 3) – backend_ref/views/admin/user/index.blade.php
 *   User Listing                     → CUSTOMERS
 *   Private Seller (Approved / Verification / Rejected) → PRIVATE_SELLERS
 * users.user_verify: 2 approved · 3 verification · 4 document reject · 5 complete reject.
 * Static demo data – replace with API calls when the backend is connected.
 */

export type BillingAddress = { name: string; street: string; street2: string; zip: string; state: string; country: string };
export type OtherInfo = { gender: string; dob: string; occupation: string; language: string };
export type WishlistItem = { name: string; price: string; addedOn: string };

export type Customer = {
  id: string;
  joined: string; //   dd-mm-yyyy
  joinedIso: string; // yyyy-mm-dd (for the date filters)
  customerId: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  address: BillingAddress;
  other: OtherInfo;
  wishlist: WishlistItem[];
  ordersPlaced: number;
  ordersCompleted: number;
  ordersCancelled: number;
  active: boolean;
};

export type SellerReviewStatus = 'approved' | 'verification' | 'rejected';

export type PrivateSeller = Customer & {
  status: SellerReviewStatus;
  productsAdded: number;
  revenue: string;
  ordersReceived: number;
  rejectType: 'complete_reject' | 'document_reject' | '';
  rejectReason: string;
  /** true for the signed-in User Web demo account (kept in sync with its seller setup) */
  isDemoUser?: boolean;
};

const FIRST = ['Aarav', 'Sophia', 'Mia', 'Arjun', 'Liam', 'Olivia', 'Noah', 'Emma', 'Lucas', 'Isabella', 'Ethan', 'Ava', 'Kabir', 'Zara'];
const LAST = ['Sharma', 'Müller', 'Tanaka', 'Mehta', 'Smith', 'Brown', 'Garcia', 'Rossi', 'Dubois', 'Khan', 'Wilson', 'Silva', 'Kapoor', 'Ali'];
const PLACES: [string, string, string, string][] = [
  ['India', '+91', 'Maharashtra', '400001'],
  ['Germany', '+49', 'Bavaria', '80331'],
  ['Japan', '+81', 'Tokyo', '100-0001'],
  ['United Kingdom', '+44', 'London', 'SW1A 1AA'],
  ['United States', '+1', 'New York', '10001'],
  ['Australia', '+61', 'New South Wales', '2000'],
  ['United Arab Emirates', '+971', 'Dubai', '00000'],
  ['Switzerland', '+41', 'Geneva', '1201'],
];
const WISHES: WishlistItem[] = [
  { name: 'Rolex FX', price: '$20,000', addedOn: '12-09-2026' },
  { name: 'Omega Seamaster', price: '$6,400', addedOn: '28-09-2026' },
  { name: 'Patek Philippe Nautilus', price: '$98,000', addedOn: '03-10-2026' },
];

function person(i: number, offset: number): Customer {
  const fn = FIRST[(i + offset) % FIRST.length];
  const ln = LAST[(i * 3 + offset) % LAST.length];
  const [country, code, state, zip] = PLACES[(i + offset) % PLACES.length];
  const day = ((i * 7 + offset) % 27) + 1;
  const month = ((i + offset) % 10) + 1;
  const dd = String(day).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  return {
    id: `${offset}-${i}`,
    joined: `${dd}-${mm}-2026`,
    joinedIso: `2026-${mm}-${dd}`,
    customerId: `IC${100000 + offset * 100 + i * 3 + 12}`,
    name: `${fn} ${ln}`,
    phone: `${code} ${String(9810000000 + i * 7919 + offset * 131).slice(0, 10)}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase().replace('ü', 'u')}@example.com`,
    country,
    address: {
      name: `${fn} ${ln}`,
      street: `${12 + i} Park Avenue`,
      street2: `Suite ${100 + i}`,
      zip,
      state,
      country,
    },
    other: {
      gender: i % 3 === 1 ? 'Female' : 'Male',
      dob: `${String((i % 27) + 1).padStart(2, '0')}-0${(i % 9) + 1}-19${80 + (i % 19)}`,
      occupation: ['Engineer', 'Doctor', 'Entrepreneur', 'Designer', 'Banker'][i % 5],
      language: ['English', 'German', 'Japanese', 'Hindi', 'French'][(i + offset) % 5],
    },
    wishlist: WISHES.slice(0, (i % 3) + 1),
    ordersPlaced: 5 + ((i * 13) % 120),
    ordersCompleted: 3 + ((i * 11) % 100),
    ordersCancelled: (i * 3) % 9,
    active: i % 6 !== 4,
  };
}

export const CUSTOMERS: Customer[] = Array.from({ length: 24 }, (_, i) => person(i, 0));

const REASONS = [
  'The uploaded identity proof is not clear. Please upload a clear copy of both sides of your document.',
  'The business registration document has expired.',
  'Address proof does not match the address entered.',
];

export const PRIVATE_SELLERS: PrivateSeller[] = Array.from({ length: 18 }, (_, i) => {
  const status: SellerReviewStatus = i < 8 ? 'approved' : i < 13 ? 'verification' : 'rejected';
  return {
    ...person(i, 5),
    status,
    productsAdded: status === 'approved' ? 3 + ((i * 7) % 40) : 0,
    revenue: status === 'approved' ? `$${(12 + ((i * 17) % 90)) * 1000}` : '$0',
    ordersReceived: status === 'approved' ? 2 + ((i * 5) % 30) : 0,
    rejectType: status === 'rejected' ? (i % 2 ? 'complete_reject' : 'document_reject') : '',
    rejectReason: status === 'rejected' ? REASONS[i % REASONS.length] : '',
  };
});

/** Demo profile used for the signed-in User Web account when it applies as a private seller. */
export const DEMO_SELLER_PROFILE: Omit<PrivateSeller, 'status' | 'rejectType' | 'rejectReason'> = {
  ...person(0, 2),
  id: 'demo-user',
  customerId: 'IC100045',
  name: 'Joe',
  email: 'user@test.com',
  phone: '+91 9810000262',
  country: 'India',
  address: { name: 'Joe', street: '12 Park Avenue', street2: 'Suite 100', zip: '400001', state: 'Maharashtra', country: 'India' },
  productsAdded: 0,
  revenue: '$0',
  ordersReceived: 0,
  isDemoUser: true,
};
