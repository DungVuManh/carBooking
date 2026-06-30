/**
 * Design System 2026 — Vân Anh Bus
 * Inspired by: Vexere, Airbnb, Stripe, Linear, Apple
 *
 * Color System, Typography, Spacing, Radius, Shadows
 */

import { Platform } from 'react-native';

const tintColorLight = '#2563EB';
const tintColorDark = '#fff';

// ─── COLOR SYSTEM ─────────────────────────────────────────────────────────────
export const COLORS = {
  // Primary — 2563EB (modern blue like Stripe/Linear)
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF6FF',
  primaryMid: '#DBEAFE',
  primaryGradientStart: '#2563EB',
  primaryGradientEnd: '#1E40AF',

  // Secondary — Electric cyan accent
  secondary: '#0EA5E9',
  secondaryLight: '#E0F2FE',

  // Accent — Orange for CTA highlight
  accent: '#F59E0B',
  accentLight: '#FEF3C7',

  // Status
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  info: '#3B82F6',
  infoLight: '#EFF6FF',

  // Neutrals — clean and modern
  white: '#FFFFFF',
  black: '#0F0F0F',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  surfaceElevated: '#FFFFFF',

  // Text hierarchy
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textDisabled: '#D1D5DB',
  textInverse: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  // Border
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  borderLight: '#F3F4F6',

  // Seat map colors
  seatAvailable: '#EFF6FF',
  seatSelected: '#2563EB',
  seatBooked: '#F3F4F6',
  seatBorder: '#2563EB',
  seatBookedBorder: '#E5E7EB',

  // Tab bar
  tabActive: '#2563EB',
  tabInactive: '#9CA3AF',

  // Card overlay and glass
  overlay: 'rgba(0, 0, 0, 0.45)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',
  glass: 'rgba(255, 255, 255, 0.92)',

  // Gradient stops (for reference)
  headerGradient: ['#2563EB', '#1E40AF'],

  // Tier badge colors
  gold: '#F59E0B',
  silver: '#9CA3AF',
  bronze: '#CD7C3E',
};

// ─── SPACING — 8px Base System ────────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ─── BORDER RADIUS — Generous & Modern ───────────────────────────────────────
export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  full: 9999,
};

// ─── SHADOWS — Soft & Elevated ────────────────────────────────────────────────
export const SHADOWS = {
  xs: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  small: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
  large: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 24,
    elevation: 10,
  },
  colored: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ─── TYPOGRAPHY ───────────────────────────────────────────────────────────────
export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  hero: 36,
};

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

export const LINE_HEIGHT = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// ─── LEGACY SUPPORT ───────────────────────────────────────────────────────────
export const Colors = {
  light: {
    text: '#111827',
    background: '#F8FAFC',
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
