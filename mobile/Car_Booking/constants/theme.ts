/**
 * Theme constants cho toàn bộ ứng dụng Bus Booking.
 * Tất cả màu sắc, font, spacing đều định nghĩa ở đây để dễ thay đổi sau này.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Bảng màu chính (Blue palette)
export const COLORS = {
  // Primary blue - màu chủ đạo của app
  primary: '#1A6FDB',
  primaryDark: '#1358B5',
  primaryLight: '#E8F1FD',
  primaryGradientStart: '#1A6FDB',
  primaryGradientEnd: '#0E4DA4',

  // Secondary
  secondary: '#FF6B35',
  secondaryLight: '#FFF0EB',

  // Status colors
  success: '#27AE60',
  successLight: '#E8F8EF',
  warning: '#F39C12',
  warningLight: '#FEF9EC',
  error: '#E74C3C',
  errorLight: '#FDEDEC',
  info: '#3498DB',
  infoLight: '#EBF5FB',

  // Neutrals
  white: '#FFFFFF',
  black: '#0D0D0D',
  background: '#F4F7FB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8FAFC',

  // Text
  textPrimary: '#1A202C',
  textSecondary: '#718096',
  textTertiary: '#A0AEC0',
  textDisabled: '#CBD5E0',
  textInverse: '#FFFFFF',

  // Border
  border: '#E2E8F0',
  borderDark: '#CBD5E0',

  // Seat colors
  seatAvailable: '#E8F1FD',
  seatSelected: '#1A6FDB',
  seatBooked: '#E2E8F0',
  seatBorder: '#1A6FDB',
  seatBookedBorder: '#CBD5E0',

  // Tab bar
  tabActive: '#1A6FDB',
  tabInactive: '#A0AEC0',

  // Gradient
  headerGradient: ['#1A6FDB', '#0E4DA4'],
};

// Spacing hệ thống
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// Shadow styles - bóng đổ nhẹ cho card
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};

// Font sizes
export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

// Font weights (dùng cho fontWeight trong StyleSheet)
export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// Colors cho legacy support (giữ nguyên để không break existing code)
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
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
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
