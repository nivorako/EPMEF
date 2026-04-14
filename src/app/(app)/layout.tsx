import type { Metadata } from "next";
import Link from "next/link";
import configPromise from "@payload-config";
import { getPayload } from "payload";
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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const payload = await getPayload({ config: configPromise });
    const payloadUntyped = payload as unknown as {
        findGlobal: (args: unknown) => Promise<unknown>;
    };

    const siteSettings = (await payloadUntyped
        .findGlobal({
            slug: "site-settings",
            depth: 1,
        })
        .catch(() => null)) as {
        headerMenu?: Array<{
            label?: string;
            type?: "page" | "post" | "external";
            url?: string;
            page?: string | { slug?: string };
            post?: string | { slug?: string };
        }>;
        footerMenu?: Array<{
            label?: string;
            type?: "page" | "post" | "external";
            url?: string;
            page?: string | { slug?: string };
            post?: string | { slug?: string };
        }>;
    } | null;

    const resolveHref = (item: {
        type?: "page" | "post" | "external";
        url?: string;
        page?: string | { slug?: string };
        post?: string | { slug?: string };
    }): string | null => {
        if (item.type === "external") return item.url || null;
        if (item.type === "post") {
            const slug =
                typeof item.post === "string" ? undefined : item.post?.slug;
            return slug ? `/actualites/${slug}` : null;
        }
        const slug =
            typeof item.page === "string" ? undefined : item.page?.slug;
        if (!slug) return null;
        return slug === "home" ? "/" : `/${slug}`;
    };

    return (
        <html lang="fr">
            <body>
                <StyledComponentsRegistry>
                    <Providers>
                        <header className="site-header">
                            <div className="container">
                                <nav className="nav">
                                    {(siteSettings?.headerMenu || []).map(
                                        (item, idx) => {
                                            const href = resolveHref(item);
                                            if (!href) return null;
                                            const label = item.label || href;
                                            const isExternal =
                                                item.type === "external" &&
                                                /^https?:\/\//i.test(href);

                                            return isExternal ? (
                                                <a
                                                    key={idx}
                                                    href={href}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {label}
                                                </a>
                                            ) : (
                                                <Link key={idx} href={href}>
                                                    {label}
                                                </Link>
                                            );
                                        },
                                    )}
                                </nav>
                            </div>
                        </header>

                        {children}

                        <footer className="site-footer">
                            <div className="container">
                                <nav className="nav">
                                    {(siteSettings?.footerMenu || []).map(
                                        (item, idx) => {
                                            const href = resolveHref(item);
                                            if (!href) return null;
                                            const label = item.label || href;
                                            const isExternal =
                                                item.type === "external" &&
                                                /^https?:\/\//i.test(href);

                                            return isExternal ? (
                                                <a
                                                    key={idx}
                                                    href={href}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {label}
                                                </a>
                                            ) : (
                                                <Link key={idx} href={href}>
                                                    {label}
                                                </Link>
                                            );
                                        },
                                    )}
                                </nav>
                            </div>
                        </footer>
                    </Providers>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
