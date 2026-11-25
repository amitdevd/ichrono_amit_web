import { Palette } from './theme';

/**
 * Brand logo (Andy Dev Design). Source artwork: assets/images/brand-logo.svg.
 *
 *  LOGO          – "Design" in white, for dark backgrounds (user navbar & footer,
 *                  login panels, admin mobile drawer).
 *  LOGO_ON_LIGHT – original colours ("Design" in black), for white backgrounds
 *                  (admin & dealer top bars, dealer mobile drawer).
 *
 * The logo is about 2.4 : 1 (width : height); size Image slots to match,
 * e.g. { width: 120, height: 50 }.
 */
export const LOGO = require('@/assets/images/brand-logo-light.png');
export const LOGO_ON_LIGHT = require('@/assets/images/brand-logo.png');

/** Brand name shown in page titles and copy. */
export const BRAND_NAME = 'Andy Dev Design';

/** Background used behind the logo (follows theme.config.ts → primary). */
export const LOGO_BG = Palette.primary;
