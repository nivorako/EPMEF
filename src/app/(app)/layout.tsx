import type { Metadata } from "next";
import Providers from "./providers";
import StyledComponentsRegistry from "./styled-components-registry";

// Root layout for the public application routes.
//
// Responsibilities:
// - Define default SEO metadata for the app segment.
// - Wrap the entire React tree with global providers (theme, global styles, etc.).
// - Ensure styled-components styles are correctly collected during SSR.

export const metadata: Metadata = {
    title: "EPMEF",
    description:
        "EPMEF : informations, événements, enseignements, horaires et contact.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body>
                <StyledComponentsRegistry>
                    <Providers>{children}</Providers>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
