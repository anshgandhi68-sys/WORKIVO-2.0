export const WORKIVO_COLORS = {
  // Brand colors
  deepTeal: "#2F6860",     // Primary brand, headers, hero
  darkTeal: "#234F49",     // Deep shadow, dark surfaces
  warmCream: "#FBF1EE",    // Primary screen canvas
  coral: "#E9847D",        // Primary CTA, selected pills
  mutedCoral: "#8F453F",   // Step numbers, accents, borders
  softGreen: "#6BB26E",    // Success, verified badges, ratings
  lightGreen: "#8FD392",   // Soft green highlights
  mainText: "#1F2F2C",     // High-contrast primary text
  mutedText: "#6C7E7A",    // Secondary / helper text
  white: "#FFFFFF",
  cardBg: "#FFFFFF",
  borderLine: "#E3D2CC",   // Muted cream divider
  card3dShadow: "#1D4A43", // Deep 3D card base
  btn3dShadow: "#9C4C47",  // Coral button 3D bevel

  // Status colors
  pending: "#F59E0B",
  matched: "#3B82F6",
  onTheWay: "#8B5CF6",
  inProgress: "#EC4899",
  completed: "#10B981",
  cancelled: "#EF4444",
};

export const WORKIVO_TYPOGRAPHY = {
  headingFamily: "Marcellus, Georgia, serif",
  bodyFamily: "Comfortaa, -apple-system, sans-serif",
  headingWeight: "400" as const,
  bodyRegular: "400" as const,
  bodyMedium: "500" as const,
  bodyBold: "700" as const,
};

export const WORKIVO_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  hero: 32,
};

export const WORKIVO_RADII = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 9999,
};

export const WORKIVO_SHADOWS = {
  tactileBtn: {
    shadowColor: "#9C4C47",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  card3d: {
    shadowColor: "#1D4A43",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  subtle: {
    shadowColor: "#1F2F2C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
};

// Compatibility exports for Expo default template helpers
export const Colors = {
  light: {
    text: WORKIVO_COLORS.mainText,
    background: WORKIVO_COLORS.warmCream,
    tint: WORKIVO_COLORS.coral,
    icon: WORKIVO_COLORS.deepTeal,
    tabIconDefault: WORKIVO_COLORS.mutedText,
    tabIconSelected: WORKIVO_COLORS.coral,
    backgroundElement: WORKIVO_COLORS.cardBg,
  },
  dark: {
    text: "#F3E9E5",
    background: "#14201E",
    tint: WORKIVO_COLORS.coral,
    icon: WORKIVO_COLORS.coral,
    tabIconDefault: "#6C7E7A",
    tabIconSelected: WORKIVO_COLORS.coral,
    backgroundElement: "#1D2D2A",
  },
};

export const Spacing = {
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
};

export const Fonts = {
  body: WORKIVO_TYPOGRAPHY.bodyFamily,
  heading: WORKIVO_TYPOGRAPHY.headingFamily,
};

export type ThemeColor = "text" | "background" | "tint" | "icon" | "tabIconDefault" | "tabIconSelected" | "backgroundElement";

export const MaxContentWidth = 600;
export const BottomTabInset = 64;
