import { ThemeConfig } from '../../../theme.config';

// ─── Colour helpers ──────────────────────────────────────────────────────────
type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** Blend `color` towards `target` by `amount` (0 = color, 1 = target). */
export function mix(color: string, target: string, amount: number): string {
  const a = hexToRgb(color);
  const b = hexToRgb(target);
  return rgbToHex([a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount, a[2] + (b[2] - a[2]) * amount]);
}

/** Lighter version of a colour (amount 0–1 towards white). */
export const tint = (color: string, amount: number) => mix(color, '#FFFFFF', amount);
/** Darker version of a colour (amount 0–1 towards black). */
export const shade = (color: string, amount: number) => mix(color, '#000000', amount);
/** Same colour with transparency, e.g. withAlpha(Palette.primary, 0.1). */
export function withAlpha(color: string, alpha: number): string {
  const [r, g, b] = hexToRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── Palette (built from theme.config.ts) ────────────────────────────────────
// The original backend_ref values (variable.css) are noted on the right; they are
// what you get with the default theme.config.ts.
const P = ThemeConfig.primary;
const S = ThemeConfig.secondary;
const A = ThemeConfig.accentLight;
const B = ThemeConfig.background;

export const Palette = {
  // Brand colours
  primary: P, //                               #003A4E deep teal
  secondary: S, //                             #A8824F gold / bronze
  secondary2: '#FFFFFF',
  third: mix(P, '#0B0B0B', 0.75), //           #0E1C21 near-black of the brand
  loginBack: tint(P, 0.5), //                  #7F9CA6 input / card borders, placeholders
  fourth: A, //                                #E2C07C champagne
  fifth: withAlpha(tint(P, 0.88), 0.6), //     ice-blue overlay

  // Aliases
  gold: S,
  goldLight: A,
  goldDark: shade(S, 0.17), //                 #8C6B3D
  goldMuted: withAlpha(S, 0.15),

  teal: P,
  tealDark: mix(P, '#0B0B0B', 0.75),
  tealLight: tint(P, 0.13), //                 #224A56
  tealMuted: withAlpha(P, 0.1),

  white: '#FFFFFF',
  black: mix(P, '#0B0B0B', 0.75),

  // Surfaces & backgrounds
  background: '#FFFFFF',
  backgroundPage: B, //                        page background (theme.config background)
  backgroundNavbar: P,
  surface: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceTeal: P,
  surfaceIce: B, //                            hover / selected rows
  surfaceSubtle: tint(B, 0.5), //              upload tiles, zebra rows
  surfaceMuted: shade(B, 0.03), //             read-only inputs, image wells

  // Borders & dividers
  border: tint(P, 0.5),
  borderLight: '#D0D0D0',
  borderInput: tint(P, 0.5),
  borderSoft: tint(P, 0.86), //                #DCE6E9 card outlines
  borderMedium: tint(P, 0.8), //               #D3DCE0 chips, step lines
  borderStrong: tint(P, 0.68), //              #B9C6CB switch (off), muted icons
  divider: tint(P, 0.9), //                    #E5E9EC

  // Text
  textHeading: P,
  textTitle: mix(P, '#0B0B0B', 0.75),
  textBody: mix(P, '#5A5A5A', 0.55), //        #35494F
  textSecondary: mix(P, '#808080', 0.6), //    #546D76
  textMuted: tint(P, 0.5),
  textWhite: '#FFFFFF',
  textGold: S,
  textOnPrimaryMuted: tint(P, 0.6), //         placeholder text on dark bars

  // Status
  success: ThemeConfig.success,
  successLight: tint(ThemeConfig.success, 0.1),
  successBg: tint(ThemeConfig.success, 0.88),
  error: ThemeConfig.error,
  errorLight: tint(ThemeConfig.error, 0.9),
  errorBg: tint(ThemeConfig.error, 0.9),
  warning: ThemeConfig.warning,
  info: ThemeConfig.info,

  // Neutral greys (from the Bootstrap admin template – not theme dependent)
  neutralText: '#212529', //                  modal / page text
  neutralTextSoft: '#5A5C69', //              stat numbers
  neutralTextMuted: '#858796', //             top-bar user name
  neutralIcon: '#B7B9CC', //                  dropdown icons
  neutralBorder: '#E3E6F0', //                admin card / dropdown borders
  neutralDark: '#3A3B45', //                  admin shadows, dropdown text
  neutralDot: '#D6D6D6', //                   inactive carousel dots
  shadow: '#000000',

  transparent: 'transparent',
};

export const Colors = {
  light: {
    text: Palette.textBody,
    background: Palette.background,
    backgroundElement: Palette.surface,
    backgroundSelected: Palette.surfaceIce,
    textSecondary: Palette.textSecondary,
  },
  dark: {
    text: Palette.white,
    background: Palette.third,
    backgroundElement: Palette.tealLight,
    backgroundSelected: Palette.teal,
    textSecondary: Palette.loginBack,
  },
};

// ─── Typography (from variable.css) ──────────────────────────────────────────
export const FontSizes = {
  xs: 12,       // small text / hint: 12px
  sm: 14,       // form-label: 14px
  md: 16,       // heading6 / nav: 16px
  lg: 18,       // heading5: 18px
  xl: 20,       // heading4: 20px
  '2xl': 24,    // heading3 (mobile): 24px
  '3xl': 28,    // heading3 (desktop): 28px
  '4xl': 38,    // heading2: 38px
  '5xl': 55,    // heading1: 55px
} as const;

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

// ─── Spacing Scale ───────────────────────────────────────────────────────────
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 40,
  '5xl': 50,
  '6xl': 60,
  '7xl': 80,
  '8xl': 96,
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────
export const Radius = {
  xs: 4,
  sm: 5,        // recommend card radius
  md: 8,        // form-control / customBtn2 radius: 8px
  lg: 12,
  xl: 20,
  '2xl': 25,    // loginContent card radius: 25px
  pill: 30,     // customBtn3, customBtn4, customBtn5 radius: 30px
  full: 9999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  card: {
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  gold: {
    shadowColor: Palette.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const Durations = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

// ─── Bootstrap & iChrono Style Preset Objects ────────────────────────────────
export const BootstrapStyles = {
  customBtn3: {
    backgroundColor: Palette.primary,
    borderRadius: Radius.pill,
    height: 48,
    paddingHorizontal: Spacing['2xl'],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    width: '100%' as const,
  },
  customBtn3Text: {
    color: Palette.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
  },

  customBtn4: {
    backgroundColor: Palette.white,
    borderColor: Palette.secondary,
    borderWidth: 1,
    borderRadius: Radius.pill,
    height: 48,
    paddingHorizontal: Spacing['2xl'],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    width: '100%' as const,
  },
  customBtn4Text: {
    color: Palette.secondary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
  },

  customBtn5: {
    backgroundColor: Palette.secondary,
    borderColor: Palette.secondary,
    borderWidth: 1,
    borderRadius: Radius.pill,
    height: 48,
    paddingHorizontal: Spacing['2xl'],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    width: '100%' as const,
  },
  customBtn5Text: {
    color: Palette.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
  },

  loginContent: {
    maxWidth: 660,
    width: '100%' as const,
    borderWidth: 1,
    borderColor: Palette.loginBack,
    borderRadius: Radius['2xl'],
    paddingHorizontal: Spacing['3xl'],
    paddingVertical: Spacing['4xl'],
    backgroundColor: Palette.white,
  },

  formControl: {
    height: 46,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.loginBack,
    paddingHorizontal: Spacing.md,
    color: Palette.textBody,
    fontSize: FontSizes.sm,
    backgroundColor: Palette.white,
  },

  formLabel: {
    color: Palette.textBody,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    marginBottom: Spacing.xs,
  },
};
