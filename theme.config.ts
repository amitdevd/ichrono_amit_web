/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ANDY DEV DESIGN THEME – change your brand colours here, once.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Every screen (User Web, Dealer, Admin, app tabs) reads its colours from
 *  `Palette` in packages/theme/src/index.ts, and that palette is built from
 *  the values below. Change a value, save, and reload the app – headers,
 *  sidebars, buttons, tables, borders, light backgrounds and hover shades all
 *  follow automatically.
 *
 *  Use 6-digit hex colours ('#RRGGBB').
 *
 *  Examples
 *    Current (orange)  :  primary '#303841'  secondary '#FF5722'  accentLight '#76ABAE'  background '#EFE8DD'
 *    Original gold     :  primary '#003A4E'  secondary '#A8824F'  accentLight '#E2C07C'
 *    Royal navy        :  primary '#14213D'  secondary '#C9A227'  accentLight '#F2D675'
 *    Deep green        :  primary '#0B3D2E'  secondary '#B08D57'  accentLight '#E6C88F'
 *    Burgundy          :  primary '#4A1022'  secondary '#C08B5C'  accentLight '#EBC9A0'
 *
 *  (For the examples without a background, use background '#F8F9FC'.)
 *
 *  Tip: keep `primary` dark – white text and the logo sit on top of it.
 */
export const ThemeConfig = {
  /** Main brand colour: navbars, sidebars, headings, main buttons, table headers */
  primary: '#303841',

  /** Accent colour: accent buttons, links, active steps, highlights */
  secondary: '#FF5722',

  /** Light accent: active menu text on dark bars, footer headings */
  accentLight: '#76ABAE',

  /** Soft background: page background, selected / hover rows, light tiles */
  background: '#EFE8DD',

  /** Status colours (rarely need changing) */
  success: '#28A745',
  error: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
} as const;
