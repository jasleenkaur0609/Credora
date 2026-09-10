export const theme = {
  colors: {
    plum: "#29182F",
    plumDark: "#1B1020",
    plumLight: "#38213F",

    jade: "#239B86",
    jadeLight: "#DFF4EE",
    jadeDark: "#187766",

    gold: "#D9A441",
    goldLight: "#F8EBC9",
    goldDark: "#B88727",

    terracotta: "#C96F5D",
    terracottaLight: "#F6DDD7",
    terracottaDark: "#AE5949",

    ivory: "#F5F0E7",
    background: "#FBFAF7",

    white: "#FFFFFF",

    charcoal: "#252229",
    charcoalLight: "#353139",
    muted: "#79727B",

    border: "#E5DFD5",
    borderLight: "#EEE9E1",

    success: "#239B86",
    warning: "#D9A441",
    danger: "#C96F5D",
    info: "#6C6A9E",
  },

  layout: {
    sidebarWidth: 260,
    topbarHeight: 72,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
} as const;

export default theme;