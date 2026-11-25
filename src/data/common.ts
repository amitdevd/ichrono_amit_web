/**
 * Shared demo data used by more than one portal.
 * Static demo data – replace with API calls when the backend is connected
 * (see backend_ref/routes for the matching endpoints).
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

/** Regions used by the reference (restcountries "region") */
export const CONTINENTS = ['Africa', 'Americas', 'Antarctic', 'Asia', 'Europe', 'Oceania'];

export const CONTINENT_COUNTRIES: Record<string, string[]> = {
  Africa: ['Algeria', 'Egypt', 'Ghana', 'Kenya', 'Morocco', 'Nigeria', 'South Africa', 'Tanzania', 'Tunisia', 'Uganda'],
  Americas: ['Argentina', 'Brazil', 'Canada', 'Chile', 'Colombia', 'Mexico', 'Peru', 'United States', 'Uruguay'],
  Antarctic: ['Antarctica', 'Bouvet Island', 'French Southern Territories', 'Heard Island and McDonald Islands'],
  Asia: ['China', 'Hong Kong', 'India', 'Indonesia', 'Japan', 'Malaysia', 'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Thailand', 'United Arab Emirates'],
  Europe: ['Austria', 'Belgium', 'France', 'Germany', 'Ireland', 'Italy', 'Netherlands', 'Portugal', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom'],
  Oceania: ['Australia', 'Fiji', 'New Zealand', 'Papua New Guinea', 'Samoa'],
};
