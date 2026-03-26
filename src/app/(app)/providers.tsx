"use client";

import React from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./global-style";
import { theme } from "./theme";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            {children}
        </ThemeProvider>
    );
}
