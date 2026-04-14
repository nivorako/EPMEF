import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

// Dynamic page route: `/<slug>`.
//
// Behavior:
// - Uses Payload CMS (collection `pages`) as the source of truth.
// - Special-cases `home` to avoid duplicate content (redirects to `/`).
// - `generateMetadata` queries Payload to populate the HTML `<title>`.
// - If a slug does not exist, we return a 404 via `notFound()`.

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    // --- Params ---
    const { slug } = await props.params;
    const normalizedSlug = slug.toLowerCase();

    // --- Special-case: home ---
    if (normalizedSlug === "home") {
        return {
            title: "Accueil",
        };
    }

    // --- Init (Payload) ---
    const payload = await getPayload({ config: configPromise });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    // --- Query (Pages: by slug) ---
    const result = await payload.find({
        collection: "pages" as unknown as CollectionSlug,
        limit: 1,
        depth: 1,
        where: {
            slug: {
                equals: normalizedSlug,
            },
        },
    });

    const page = result.docs?.[0] as
        | {
              title?: string;
              seo?: {
                  title?: string;
                  description?: string;
                  noIndex?: boolean;
                  ogImage?: {
                      url?: string;
                  };
              };
          }
        | undefined;

    // --- Fallback metadata ---
    if (!page) {
        return {
            title: "Page introuvable",
        };
    }

    const title = page.seo?.title || page.title || normalizedSlug;
    const description = page.seo?.description;

    return {
        title,
        description: description || undefined,
        robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
        openGraph: page.seo?.ogImage?.url
            ? {
                  images: [{ url: page.seo.ogImage.url }],
              }
            : undefined,
    };
}

export default async function PageBySlug(props: {
    params: Promise<{ slug: string }>;
}) {
    // --- Params ---
    const { slug } = await props.params;
    const normalizedSlug = slug.toLowerCase();

    // --- Special-case: home ---
    if (normalizedSlug === "home") {
        redirect("/");
    }

    // Canonicalize casing to avoid 404s when users type uppercase URLs.
    if (slug !== normalizedSlug) {
        redirect(`/${normalizedSlug}`);
    }

    // --- Init (Payload) ---
    const payload = await getPayload({ config: configPromise });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    // --- Query (Pages: by slug) ---
    const result = await payload.find({
        collection: "pages" as unknown as CollectionSlug,
        limit: 1,
        depth: 1,
        where: {
            slug: {
                equals: normalizedSlug,
            },
        },
    });

    const page = result.docs?.[0] as
        | {
              title?: string;
              contentHTML?: string;
              featuredImage?: {
                  url?: string;
                  alt?: string;
              };
          }
        | undefined;

    // --- 404 ---
    if (!page) {
        notFound();
    }

    // --- Render ---
    return (
        <main className="container">
            <h1 style={{ marginTop: 0 }}>{page.title || normalizedSlug}</h1>
            {page.featuredImage?.url ? (
                <img
                    src={page.featuredImage.url}
                    alt={page.featuredImage.alt || ""}
                    style={{ width: "100%", height: "auto" }}
                />
            ) : null}
            {page.contentHTML ? (
                <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: page.contentHTML }}
                />
            ) : null}
        </main>
    );
}
