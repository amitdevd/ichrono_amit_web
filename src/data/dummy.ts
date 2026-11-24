/**
 * Static demo data for the Milestone 1 UI. Replace with API calls when the
 * backend is wired up (see backend_ref/routes for the matching endpoints).
 */

export const COUNTRIES = [
  'India',
  'United Kingdom',
  'United States',
  'United Arab Emirates',
  'Germany',
  'France',
  'Switzerland',
  'Italy',
  'Japan',
  'Singapore',
  'Australia',
  'Canada',
];

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

export type Watch = {
  id: number;
  name: string;
  ref: string;
  condition: string;
  quality: string;
  country: string;
  price: string;
  shipping: string;
  privateSeller: boolean;
  image: any;
};

export const RECOMMENDED: Watch[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: 'Rolex Sky-Dweller',
  ref: 'IC0026/03',
  condition: 'Used',
  quality: 'Good',
  country: 'IN',
  price: '$1,20,000',
  shipping: 'Exclusive Shipping',
  privateSeller: i === 0,
  image: require('@/assets/images/recomm-1.png'),
}));

export const POPULAR_BRANDS = ['Rolex', 'Patek Phillipe', 'Omega', 'Audemars Piguet', 'TAG Heuer'];

export const NEW_ORDERS = [
  { id: 1, name: 'Cartier Santos', orderId: '#abc123456', amount: '52000', image: require('@/assets/images/recomm-2.png') },
  { id: 2, name: 'Cartier Santos', orderId: '#abc123456', amount: '52000', image: require('@/assets/images/recomm-3.png') },
  { id: 3, name: 'Cartier Santos', orderId: '#abc123456', amount: '52000', image: require('@/assets/images/recomm-2.png') },
  { id: 4, name: 'Cartier Santos', orderId: '#abc123456', amount: '52000', image: require('@/assets/images/recomm-3.png') },
];
