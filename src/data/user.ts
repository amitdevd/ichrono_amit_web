/**
 * User Web demo data (home page).
 * Static demo data – replace with API calls when the backend is connected
 * (see backend_ref/routes for the matching endpoints).
 */

import { countryCode, formatPrice, imageSource, listingTitle, overallGrade, type Listing } from './listings';

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

/** Card data for a marketplace listing (home page "Recommended For You"). */
export function listingToWatch(l: Listing, index: number): Watch {
  return {
    id: index + 1,
    name: listingTitle(l),
    ref: l.reference,
    condition: l.hasWear ? 'Used' : 'Unworn',
    quality: overallGrade(l),
    country: countryCode(l.country),
    price: formatPrice(l.price),
    shipping: 'Exclusive Shipping',
    privateSeller: l.owner === 'user',
    image: imageSource(l.images[0]) ?? require('@/assets/images/recomm-1.png'),
  };
}

export const POPULAR_BRANDS = ['Rolex', 'Patek Phillipe', 'Omega', 'Audemars Piguet', 'TAG Heuer'];
