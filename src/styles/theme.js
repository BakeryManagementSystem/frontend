/**
 * Bakery Management System - Theme Configuration
 *
 * Centralized theme management system for consistent design across the application
 * Based on the design system outlined in the project README
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
  // Primary Brand Colors (Purple Theme)
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#6639a6',  // Primary
    600: '#7f4fc3',  // Secondary
    700: '#4f2c80',  // Dark
    800: '#3730a3',
    900: '#312e81'
  },

  // Secondary Colors
  secondary: {
    50: '#f3f0ff',
    100: '#e9e5ff',
    200: '#d4d0ff',
    300: '#b8b0ff',
    400: '#9b75d0',  // Accent
    500: '#7f4fc3',  // Medium Purple
    600: '#6639a6',
    700: '#4f2c80',
    800: '#3d1a6b',
    900: '#2d1256'
  },

  // Neutral Colors
  neutral: {
    0: '#ffffff',    // Light/White
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    1000: '#000000'
  },

  // Status Colors
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857'
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309'
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c'
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  }
};

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem'   // 60px
  },

  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
};

// =============================================================================
// SPACING SYSTEM
// =============================================================================

export const spacing = {
  0: '0rem',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  11: '2.75rem',  // 44px
  12: '3rem',     // 48px
  14: '3.5rem',   // 56px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  28: '7rem',     // 112px
  32: '8rem',     // 128px
  36: '9rem',     // 144px
  40: '10rem',    // 160px
  44: '11rem',    // 176px
  48: '12rem',    // 192px
  52: '13rem',    // 208px
  56: '14rem',    // 224px
  60: '15rem',    // 240px
  64: '16rem',    // 256px
  72: '18rem',    // 288px
  80: '20rem',    // 320px
  96: '24rem'     // 384px
};

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: '0rem',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px'
};

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
};

// =============================================================================
// TRANSITIONS & ANIMATIONS
// =============================================================================

export const transitions = {
  // Duration
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms'
  },

  // Timing Functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  xs: '0px',
  sm: '320px',    // Mobile
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large Desktop
  '2xl': '1536px' // Extra Large Desktop
};

// =============================================================================
// Z-INDEX LAYERS
// =============================================================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800
};

// =============================================================================
// COMPONENT SPECIFIC THEMES
// =============================================================================

export const components = {
  // Button Variants
  button: {
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.neutral[0],
      hoverBackgroundColor: colors.primary[700],
      focusRing: `0 0 0 3px ${colors.primary[200]}`
    },
    secondary: {
      backgroundColor: colors.neutral[0],
      color: colors.primary[500],
      borderColor: colors.neutral[300],
      hoverBackgroundColor: colors.neutral[50],
      focusRing: `0 0 0 3px ${colors.primary[200]}`
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      borderColor: colors.primary[500],
      hoverBackgroundColor: colors.primary[500],
      hoverColor: colors.neutral[0],
      focusRing: `0 0 0 3px ${colors.primary[200]}`
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      hoverBackgroundColor: colors.primary[50],
      focusRing: `0 0 0 3px ${colors.primary[200]}`
    }
  },

  // Card Styles
  card: {
    backgroundColor: colors.neutral[0],
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.xl,
    shadow: shadows.sm,
    hoverShadow: shadows.md
  },

  // Form Elements
  form: {
    input: {
      backgroundColor: colors.neutral[0],
      borderColor: colors.neutral[300],
      focusBorderColor: colors.primary[500],
      focusRing: `0 0 0 3px ${colors.primary[200]}`,
      errorBorderColor: colors.error[500],
      errorFocusRing: `0 0 0 3px ${colors.error[200]}`
    },
    label: {
      color: colors.neutral[700],
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium
    }
  },

  // Navigation
  navigation: {
    backgroundColor: colors.neutral[0],
    borderColor: colors.neutral[200],
    activeColor: colors.primary[500],
    activeBackgroundColor: colors.primary[50],
    hoverBackgroundColor: colors.neutral[100]
  }
};

// =============================================================================
// CSS CUSTOM PROPERTIES GENERATOR
// =============================================================================

export const generateCSSCustomProperties = () => {
  return `
    :root {
      /* Colors */
      --color-primary-50: ${colors.primary[50]};
      --color-primary-100: ${colors.primary[100]};
      --color-primary-200: ${colors.primary[200]};
      --color-primary-300: ${colors.primary[300]};
      --color-primary-400: ${colors.primary[400]};
      --color-primary-500: ${colors.primary[500]};
      --color-primary-600: ${colors.primary[600]};
      --color-primary-700: ${colors.primary[700]};
      --color-primary-800: ${colors.primary[800]};
      --color-primary-900: ${colors.primary[900]};

      --color-secondary-50: ${colors.secondary[50]};
      --color-secondary-100: ${colors.secondary[100]};
      --color-secondary-200: ${colors.secondary[200]};
      --color-secondary-300: ${colors.secondary[300]};
      --color-secondary-400: ${colors.secondary[400]};
      --color-secondary-500: ${colors.secondary[500]};
      --color-secondary-600: ${colors.secondary[600]};
      --color-secondary-700: ${colors.secondary[700]};
      --color-secondary-800: ${colors.secondary[800]};
      --color-secondary-900: ${colors.secondary[900]};

      --color-neutral-0: ${colors.neutral[0]};
      --color-neutral-50: ${colors.neutral[50]};
      --color-neutral-100: ${colors.neutral[100]};
      --color-neutral-200: ${colors.neutral[200]};
      --color-neutral-300: ${colors.neutral[300]};
      --color-neutral-400: ${colors.neutral[400]};
      --color-neutral-500: ${colors.neutral[500]};
      --color-neutral-600: ${colors.neutral[600]};
      --color-neutral-700: ${colors.neutral[700]};
      --color-neutral-800: ${colors.neutral[800]};
      --color-neutral-900: ${colors.neutral[900]};

      --color-success-50: ${colors.success[50]};
      --color-success-100: ${colors.success[100]};
      --color-success-500: ${colors.success[500]};
      --color-success-600: ${colors.success[600]};
      --color-success-700: ${colors.success[700]};

      --color-warning-50: ${colors.warning[50]};
      --color-warning-100: ${colors.warning[100]};
      --color-warning-500: ${colors.warning[500]};
      --color-warning-600: ${colors.warning[600]};
      --color-warning-700: ${colors.warning[700]};

      --color-error-50: ${colors.error[50]};
      --color-error-100: ${colors.error[100]};
      --color-error-500: ${colors.error[500]};
      --color-error-600: ${colors.error[600]};
      --color-error-700: ${colors.error[700]};

      --color-info-50: ${colors.info[50]};
      --color-info-100: ${colors.info[100]};
      --color-info-500: ${colors.info[500]};
      --color-info-600: ${colors.info[600]};
      --color-info-700: ${colors.info[700]};

      /* Typography */
      --font-family-primary: ${typography.fontFamily.primary};
      --font-family-heading: ${typography.fontFamily.heading};
      --font-family-mono: ${typography.fontFamily.mono};

      --font-size-xs: ${typography.fontSize.xs};
      --font-size-sm: ${typography.fontSize.sm};
      --font-size-base: ${typography.fontSize.base};
      --font-size-lg: ${typography.fontSize.lg};
      --font-size-xl: ${typography.fontSize.xl};
      --font-size-2xl: ${typography.fontSize['2xl']};
      --font-size-3xl: ${typography.fontSize['3xl']};
      --font-size-4xl: ${typography.fontSize['4xl']};
      --font-size-5xl: ${typography.fontSize['5xl']};
      --font-size-6xl: ${typography.fontSize['6xl']};

      --font-weight-light: ${typography.fontWeight.light};
      --font-weight-normal: ${typography.fontWeight.normal};
      --font-weight-medium: ${typography.fontWeight.medium};
      --font-weight-semibold: ${typography.fontWeight.semibold};
      --font-weight-bold: ${typography.fontWeight.bold};
      --font-weight-extrabold: ${typography.fontWeight.extrabold};

      /* Spacing */
      --spacing-0: ${spacing[0]};
      --spacing-1: ${spacing[1]};
      --spacing-2: ${spacing[2]};
      --spacing-3: ${spacing[3]};
      --spacing-4: ${spacing[4]};
      --spacing-5: ${spacing[5]};
      --spacing-6: ${spacing[6]};
      --spacing-8: ${spacing[8]};
      --spacing-10: ${spacing[10]};
      --spacing-12: ${spacing[12]};
      --spacing-16: ${spacing[16]};
      --spacing-20: ${spacing[20]};

      /* Border Radius */
      --radius-none: ${borderRadius.none};
      --radius-sm: ${borderRadius.sm};
      --radius-md: ${borderRadius.md};
      --radius-lg: ${borderRadius.lg};
      --radius-xl: ${borderRadius.xl};
      --radius-2xl: ${borderRadius['2xl']};
      --radius-3xl: ${borderRadius['3xl']};
      --radius-full: ${borderRadius.full};

      /* Shadows */
      --shadow-none: ${shadows.none};
      --shadow-sm: ${shadows.sm};
      --shadow-md: ${shadows.md};
      --shadow-lg: ${shadows.lg};
      --shadow-xl: ${shadows.xl};
      --shadow-2xl: ${shadows['2xl']};
      --shadow-inner: ${shadows.inner};

      /* Transitions */
      --transition-fast: ${transitions.duration.fast} ${transitions.easing.easeInOut};
      --transition-normal: ${transitions.duration.normal} ${transitions.easing.easeInOut};
      --transition-slow: ${transitions.duration.slow} ${transitions.easing.easeInOut};

      /* Z-Index */
      --z-dropdown: ${zIndex.dropdown};
      --z-sticky: ${zIndex.sticky};
      --z-overlay: ${zIndex.overlay};
      --z-modal: ${zIndex.modal};
      --z-toast: ${zIndex.toast};
      --z-tooltip: ${zIndex.tooltip};
    }
  `;
};

// =============================================================================
// THEME UTILITIES
// =============================================================================

export const themeUtils = {
  // Get color with opacity
  getColorWithOpacity: (color, opacity) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // Generate responsive font size
  getResponsiveFontSize: (base, scale = 1.2) => ({
    fontSize: typography.fontSize[base],
    [`@media (min-width: ${breakpoints.md})`]: {
      fontSize: `calc(${typography.fontSize[base]} * ${scale})`
    }
  }),

  // Generate button styles
  getButtonStyles: (variant = 'primary', size = 'md') => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.medium,
      transition: `all ${transitions.duration.fast} ${transitions.easing.easeInOut}`,
      cursor: 'pointer',
      border: 'none',
      textDecoration: 'none'
    };

    const sizeStyles = {
      sm: {
        padding: `${spacing[2]} ${spacing[4]}`,
        fontSize: typography.fontSize.sm
      },
      md: {
        padding: `${spacing[3]} ${spacing[6]}`,
        fontSize: typography.fontSize.base
      },
      lg: {
        padding: `${spacing[4]} ${spacing[8]}`,
        fontSize: typography.fontSize.lg
      }
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...components.button[variant]
    };
  },

  // Generate card styles
  getCardStyles: (elevated = false) => ({
    backgroundColor: components.card.backgroundColor,
    borderColor: components.card.borderColor,
    borderRadius: components.card.borderRadius,
    borderWidth: '1px',
    borderStyle: 'solid',
    boxShadow: elevated ? components.card.hoverShadow : components.card.shadow,
    transition: `box-shadow ${transitions.duration.fast} ${transitions.easing.easeInOut}`,
    padding: spacing[6]
  })
};

// =============================================================================
// DEFAULT THEME EXPORT
// =============================================================================

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  components,
  utils: themeUtils,
  generateCSSCustomProperties
};

export default theme;
