export const theme = {
    colors: {
        background: "#ffffff",
        foreground: "#171717",
        backgroundAlt: "#fafafa",
        surface: "#ffffff",
    },
    fonts: {
        body: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    },
} as const;

export type AppTheme = typeof theme;
