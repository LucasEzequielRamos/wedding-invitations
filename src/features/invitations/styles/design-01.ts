export const design01 = {
  colors: {
    background: "#FDF6DC",
    primary: "#566B30",
    dark: "#283517",
    white: "#FFFFFF",
    burgundy: "#A74850",
    magenta: "#C00885",
    olive: "#A5A25E",
  },

  fonts: {
    body: "var(--font-altivo)",
    script: "var(--font-la-belle-aurore)",
  },

  layout: {
    maxWidth: "1440px",
    mobileMaxWidth: "390px",

    mobilePadding: "24px",
    desktopPadding: "48px",
  },

  breakpoints: {
    mobile: 767,
  },

  assets: {
    desktop: {
      basePath: "/designs/design-01/desktop",
    },

    mobile: {
      basePath: "/designs/design-01/mobile",
    },
  },
} as const;