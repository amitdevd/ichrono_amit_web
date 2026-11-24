// ─── iChrono Exact CSS Variables (from variable.css & style.css) ─────────────
export const Palette = {
  // Brand Colors (from variable.css)
  primary: '#003A4E',        // Deep Teal Blue (navbar, primary buttons, titles)
  secondary: '#A8824F',      // Gold / Bronze accent
  secondary2: '#FFFFFF',     // Pure White
  third: '#0E1C21',          // Dark Teal / Near Black
  loginBack: '#7F9CA6',      // Slate Teal Border (form inputs, card borders, placeholders)
  fourth: '#E2C07C',         // Champagne / Light Gold
  fifth: 'rgba(224, 247, 255, 0.6)', // Ice Blue Overlay

  // Aliases for convenience
  gold: '#A8824F',
  goldLight: '#E2C07C',
  goldDark: '#8C6B3D',
  goldMuted: 'rgba(168, 130, 79, 0.15)',

  teal: '#003A4E',
  tealDark: '#0E1C21',
  tealLight: '#224A56',
  tealMuted: 'rgba(0, 58, 78, 0.1)',

  white: '#FFFFFF',
  black: '#0E1C21',

  // Surfaces & Backgrounds
  background: '#FFFFFF',
  backgroundPage: '#F8F9FC',
  backgroundNavbar: '#003A4E',
  surface: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceTeal: '#003A4E',
  surfaceIce: '#F2F8FA',

  // Borders & Dividers
  border: '#7F9CA6',
  borderLight: '#D0D0D0',
  borderInput: '#7F9CA6',
  divider: '#E5E9EC',

  // Text Colors
  textHeading: '#003A4E',
  textTitle: '#0E1C21',
  textBody: '#35494F',
  textSecondary: '#546D76',
  textMuted: '#7F9CA6',
  textWhite: '#FFFFFF',
  textGold: '#A8824F',

  // Status Colors
  success: '#28A745',
  successLight: '#439F4A',
  error: '#DC3545',
  errorLight: '#FFEBEE',
  warning: '#FFC107',
  info: '#17A2B8',

  transparent: 'transparent',
} as const;

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
