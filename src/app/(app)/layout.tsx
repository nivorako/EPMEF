import type { Metadata } from "next";
import Providers from "./providers";
import StyledComponentsRegistry from "./styled-components-registry";

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
