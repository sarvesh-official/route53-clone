/**
 * Centralized color palette for the Route 53 clone.
 *
 * Single source of truth for every color used across the app.
 * Import from here instead of hardcoding hex values inline.
 *
 * Naming convention:
 *   - `dark.*`  — colors used in dark mode (awsui-dark-mode)
 *   - `light.*` — colors used in light mode
 *   - `shared.*`— colors that are the same in both modes
 *   - `aws.*`   — AWS brand colors (orange, etc.)
 */

export const colors = {
  /** Dark-mode palette */
  dark: {
    background: "#161D26",
    surface: "#181c24",
    surfaceAlt: "#0f141a",
    inputBackground: "#161D26",
    contentBackground: "#131920",
    sidebarBackground: "#161D26",
    breadcrumbBackground: "#161D26",
    cardBackground: "#161D26",
    border: "#656871",
    borderAlt: "#40454d",
    borderStrong: "#41474f",
    textPrimary: "#ebebf0",
    textSecondary: "#dedee3",
    textMuted: "#9ba1a8",
    textDim: "#5f6b7a",
    accent: "#43B4FF",
    accentHover: "#1c7ae3",
    accountCard: "#7f8796",
    accountCardHover: "#8e96a3",
    accountColour: "#7D8998",
    toggleActive: "#0073bb",
    toggleActiveHover: "#0a4d8c",
  },

  /** Light-mode palette */
  light: {
    background: "#FCFCFD",
    surface: "#ffffff",
    surfaceAlt: "#f7f7f7",
    inputBackground: "#ffffff",
    contentBackground: "#FCFCFD",
    sidebarBackground: "#ffffff",
    breadcrumbBackground: "#ffffff",
    cardBackground: "#ffffff",
    border: "#e9ebed",
    borderAlt: "#d5dbdb",
    textPrimary: "#0f141a",
    textSecondary: "#161d26",
    textMuted: "#687078",
    textDim: "#5f6b7a",
    accent: "#1677E2",
    accentHover: "#0a3a8f",
    inputBorder: "#8c8c94",
  },

  /** Shared colors (same in both modes) */
  shared: {
    white: "#ffffff",
    error: "#d13212",
    errorBg: "#fff4f4",
    success: "#1c7ae3",
    infoBg: "#f0f4ff",
    infoBgAlt: "#e9f3ff",
    infoBgLight: "#f0fbff",
    placeholder: "#c6c6cd",
    placeholderAlt: "#a4a4ad",
    overlay: "#424650",
    overlayAlt: "#62676f",
    separator: "#72747d",
  },

  /** AWS brand colors */
  aws: {
    orange: "#ff9900",
    blue: "#006ce0",
  },
} as const;

/**
 * CSS custom property names mapped to their dark/light values.
 * Injected via globals.css so Cloudscape components can also use them.
 */
export const cssVars = {
  "--r53-dark-bg": colors.dark.background,
  "--r53-dark-surface": colors.dark.surface,
  "--r53-dark-surface-alt": colors.dark.surfaceAlt,
  "--r53-dark-input-bg": colors.dark.inputBackground,
  "--r53-dark-content-bg": colors.dark.contentBackground,
  "--r53-dark-sidebar-bg": colors.dark.sidebarBackground,
  "--r53-dark-breadcrumb-bg": colors.dark.breadcrumbBackground,
  "--r53-dark-card-bg": colors.dark.cardBackground,
  "--r53-dark-border": colors.dark.border,
  "--r53-dark-border-alt": colors.dark.borderAlt,
  "--r53-dark-border-strong": colors.dark.borderStrong,
  "--r53-dark-text-primary": colors.dark.textPrimary,
  "--r53-dark-text-secondary": colors.dark.textSecondary,
  "--r53-dark-text-muted": colors.dark.textMuted,
  "--r53-dark-text-dim": colors.dark.textDim,
  "--r53-dark-accent": colors.dark.accent,
  "--r53-dark-accent-hover": colors.dark.accentHover,
  "--r53-dark-account-card": colors.dark.accountCard,
  "--r53-dark-account-card-hover": colors.dark.accountCardHover,
  "--r53-dark-toggle-active": colors.dark.toggleActive,
  "--r53-dark-toggle-active-hover": colors.dark.toggleActiveHover,
  "--r53-light-bg": colors.light.background,
  "--r53-light-surface": colors.light.surface,
  "--r53-light-surface-alt": colors.light.surfaceAlt,
  "--r53-light-content-bg": colors.light.contentBackground,
  "--r53-light-sidebar-bg": colors.light.sidebarBackground,
  "--r53-light-breadcrumb-bg": colors.light.breadcrumbBackground,
  "--r53-light-card-bg": colors.light.cardBackground,
  "--r53-light-border": colors.light.border,
  "--r53-light-border-alt": colors.light.borderAlt,
  "--r53-light-text-primary": colors.light.textPrimary,
  "--r53-light-text-muted": colors.light.textMuted,
  "--r53-light-accent": colors.light.accent,
  "--r53-light-accent-hover": colors.light.accentHover,
  "--r53-light-input-border": colors.light.inputBorder,
  "--r53-shared-white": colors.shared.white,
  "--r53-shared-error": colors.shared.error,
  "--r53-shared-error-bg": colors.shared.errorBg,
  "--r53-shared-info-bg": colors.shared.infoBg,
  "--r53-shared-info-bg-alt": colors.shared.infoBgAlt,
  "--r53-shared-info-bg-light": colors.shared.infoBgLight,
  "--r53-shared-overlay": colors.shared.overlay,
  "--r53-shared-separator": colors.shared.separator,
  "--r53-aws-orange": colors.aws.orange,
} as const;
