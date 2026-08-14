"use client";

import { colors } from "@/lib/theme/colors";
import { useTheme } from "@/providers/theme-provider";

export type ThemeColors = (typeof colors)["dark"] | (typeof colors)["light"];
export type SharedColors = typeof colors.shared;
export type AwsColors = typeof colors.aws;

export function useThemeColors(): ThemeColors {
  const { theme } = useTheme();
  return theme === "dark" ? colors.dark : colors.light;
}

export function useSharedColors(): SharedColors {
  return colors.shared;
}

export function useAwsColors(): AwsColors {
  return colors.aws;
}
