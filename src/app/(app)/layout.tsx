import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import Providers from "./providers";
import MobileNav from "./components/MobileNav";
import { montserrat, inter } from "./fonts";
import "./globals.css";

// Root layout for the public application routes.
//
// Responsibilities:
// - Define default SEO metadata for the app segment.
// - Wrap the entire React tree with global providers.
// - Render a sticky header with logo, desktop nav and mobile burger.
// - Render a rich footer with navigation columns and copyright.

export const metadata: Metadata = {
    title: "EPMEF",
    description:
        "EPMEF : informations, événements, enseignements, horaires et contact.",
    icons: {
        icon: "/icon.jpg",
    },
};

type MenuItem = {
    label?: string;
    type?: "page" | "post" | "external";
    url?: string;
    page?: string | { slug?: string };
    post?: string | { slug?: string };
};

function resolveHref(item: MenuItem): string | null {
    if (item.type === "external") return item.url || null;
    if (item.type === "post") {
        const slug =
            typeof item.post === "string" ? undefined : item.post?.slug;
        return slug ? `/actualites/${slug}` : null;
    }
    const slug = typeof item.page === "string" ? undefined : item.page?.slug;
    if (!slug) return null;
    return slug === "home" ? "/" : `/${slug}`;
}

function resolveNavItems(
    menu: MenuItem[],
): { label: string; href: string; isExternal: boolean }[] {
    return menu
        .map((item) => {
            const href = resolveHref(item);
            if (!href) return null;
            return {
                label: item.label || href,
                href,
                isExternal:
                    item.type === "external" && /^https?:\/\//i.test(href),
            };
        })
        .filter(Boolean) as {
        label: string;
        href: string;
        isExternal: boolean;
    }[];
}

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
        siteName?: string;
        headerMenu?: MenuItem[];
        footerMenu?: MenuItem[];
    } | null;

    const headerItems = resolveNavItems(siteSettings?.headerMenu || []);
    const footerItems = resolveNavItems(siteSettings?.footerMenu || []);
    const siteName = siteSettings?.siteName || "EPMEF";

    return (
        <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
            <body className="flex flex-col min-h-screen">
                <Providers>
                    {/* ── Header ── */}
                    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                {/* Logo + site name */}
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 shrink-0"
                                >
                                    <Image
                                        src="/icon.jpg"
                                        alt={siteName}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <span className="text-xl font-bold tracking-tight text-primary">
                                        {siteName}
                                    </span>
                                </Link>

                                {/* Desktop nav */}
                                <nav className="hidden md:flex items-center gap-1">
                                    {headerItems.map((item, idx) =>
                                        item.isExternal ? (
                                            <a
                                                key={idx}
                                                href={item.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                                            >
                                                {item.label}
                                            </a>
                                        ) : (
                                            <Link
                                                key={idx}
                                                href={item.href}
                                                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        ),
                                    )}
                                </nav>

                                {/* Mobile burger */}
                                <MobileNav items={headerItems} />
                            </div>
                        </div>
                    </header>

                    {/* ── Main content ── */}
                    <main className="flex-1 pt-16">{children}</main>

                    {/* ── Footer ── */}
                    <footer className="bg-primary text-white">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {/* Col 1 — Branding */}
                                <div>
                                    <Link
                                        href="/"
                                        className="flex items-center gap-3 mb-4"
                                    >
                                        <Image
                                            src="/icon.jpg"
                                            alt={siteName}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                        <span className="text-xl font-bold tracking-tight">
                                            {siteName}
                                        </span>
                                    </Link>
                                    <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                                        Église Protestante Malgache Édifiée par
                                        la Foi — Pontoise
                                    </p>
                                </div>

                                {/* Col 2 — Navigation */}
                                <div>
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
                                        Navigation
                                    </h4>
                                    <nav className="flex flex-col gap-2">
                                        {footerItems.map((item, idx) =>
                                            item.isExternal ? (
                                                <a
                                                    key={idx}
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                                >
                                                    {item.label}
                                                </a>
                                            ) : (
                                                <Link
                                                    key={idx}
                                                    href={item.href}
                                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                                >
                                                    {item.label}
                                                </Link>
                                            ),
                                        )}
                                    </nav>
                                </div>

                                {/* Col 3 — Contact */}
                                <div>
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
                                        Contact
                                    </h4>
                                    <div className="flex flex-col gap-2 text-sm text-white/70">
                                        <p>📍 Pontoise, France</p>
                                        <p>✉️ contact@epmef.fr</p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider + copyright */}
                            <div className="mt-10 pt-6 border-t border-white/20 text-center">
                                <p className="text-xs text-white/50">
                                    © {new Date().getFullYear()} {siteName}.
                                    Tous droits réservés.
                                </p>
                            </div>
                        </div>
                    </footer>
                </Providers>
            </body>
        </html>
    );
}
