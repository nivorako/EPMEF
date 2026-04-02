"use client";

import React from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./global-style";
import { theme } from "./theme";

// Client-side providers for the app.
//
// This file is a client component because styled-components' ThemeProvider and
// global styles are applied at runtime.

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            {children}
        </ThemeProvider>
    );
}
