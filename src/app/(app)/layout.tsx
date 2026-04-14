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
                        <header
                            style={{
                                padding: 16,
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            <nav>
                                {(siteSettings?.headerMenu || []).map(
                                    (item, idx) => {
                                        const href = resolveHref(item);
                                        if (!href) return null;
                                        const label = item.label || href;
                                        const isExternal =
                                            item.type === "external" &&
                                            /^https?:\/\//i.test(href);

                                        return (
                                            <span
                                                key={idx}
                                                style={{ marginRight: 12 }}
                                            >
                                                {isExternal ? (
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {label}
                                                    </a>
                                                ) : (
                                                    <Link href={href}>
                                                        {label}
                                                    </Link>
                                                )}
                                            </span>
                                        );
                                    },
                                )}
                            </nav>
                        </header>

                        {children}

                        <footer
                            style={{ padding: 16, borderTop: "1px solid #eee" }}
                        >
                            <nav>
                                {(siteSettings?.footerMenu || []).map(
                                    (item, idx) => {
                                        const href = resolveHref(item);
                                        if (!href) return null;
                                        const label = item.label || href;
                                        const isExternal =
                                            item.type === "external" &&
                                            /^https?:\/\//i.test(href);

                                        return (
                                            <span
                                                key={idx}
                                                style={{ marginRight: 12 }}
                                            >
                                                {isExternal ? (
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {label}
                                                    </a>
                                                ) : (
                                                    <Link href={href}>
                                                        {label}
                                                    </Link>
                                                )}
                                            </span>
                                        );
                                    },
                                )}
                            </nav>
                        </footer>
                    </Providers>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
