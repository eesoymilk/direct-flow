import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

// Direct Flow custom theme matching Nuxt UI design tokens
export const DirectFlowTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{blue.50}",
      100: "{blue.100}",
      200: "{blue.200}",
      300: "{blue.300}",
      400: "{blue.400}",
      500: "{blue.500}",
      600: "{blue.600}",
      700: "{blue.700}",
      800: "{blue.800}",
      900: "{blue.900}",
      950: "{blue.950}",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{blue.600}",
          inverseColor: "#ffffff",
          hoverColor: "{blue.700}",
          activeColor: "{blue.800}",
        },
        highlight: {
          background: "{blue.100}",
          focusBackground: "{blue.200}",
          color: "{blue.800}",
          focusColor: "{blue.900}",
        },
      },
      dark: {
        primary: {
          color: "{blue.500}",
          inverseColor: "{blue.950}",
          hoverColor: "{blue.400}",
          activeColor: "{blue.300}",
        },
        highlight: {
          background: "color-mix(in srgb, {blue.400}, transparent 84%)",
          focusBackground: "color-mix(in srgb, {blue.400}, transparent 76%)",
          color: "rgba(255,255,255,.87)",
          focusColor: "rgba(255,255,255,.87)",
        },
      },
    },
  },
  primitive: {
    // Brand colors that override blue
    blue: {
      50: "oklch(0.97 0.02 240)",
      100: "oklch(0.92 0.03 240)",
      200: "oklch(0.85 0.05 240)",
      300: "oklch(0.78 0.07 240)",
      400: "oklch(0.71 0.09 240)",
      500: "oklch(0.64 0.11 240)",
      600: "oklch(0.57 0.13 240)",
      700: "oklch(0.5 0.15 240)",
      800: "oklch(0.43 0.17 240)",
      900: "oklch(0.36 0.19 240)",
      950: "oklch(0.25 0.21 240)",
    },
    // Keep consistent with other semantic colors
    green: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#052e16",
    },
    red: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#450a0a",
    },
    amber: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      950: "#451a03",
    },
  },
});
