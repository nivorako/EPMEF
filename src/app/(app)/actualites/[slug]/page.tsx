import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Single post page: `/actualites/<slug>`.
//
// Behavior:
// - Fetches the post from Payload CMS (collection `posts`) by slug.
// - `generateMetadata` populates `<title>`, description, robots & OG image from the SEO group.
// - Returns 404 via `notFound()` when the slug does not match any document.
// - Renders `contentHTML` via `dangerouslySetInnerHTML` (HTML is trusted from Payload).

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await props.params;

    const payload = await getPayload({ config: configPromise });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    const result = await payload.find({
        collection: "posts" as unknown as CollectionSlug,
        limit: 1,
        depth: 1,
        where: {
            slug: {
                equals: slug,
            },
        },
    });

    const post = result.docs?.[0] as
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

    if (!post) {
        return {
            title: "Actualité introuvable",
        };
    }

    const title = post.seo?.title || post.title || slug;
    const description = post.seo?.description;

    return {
        title,
        description: description || undefined,
        robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
        openGraph: post.seo?.ogImage?.url
            ? {
                  images: [{ url: post.seo.ogImage.url }],
              }
            : undefined,
    };
}

export default async function PostBySlug(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;

    const payload = await getPayload({ config: configPromise });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    const result = await payload.find({
        collection: "posts" as unknown as CollectionSlug,
        limit: 1,
        depth: 1,
        where: {
            slug: {
                equals: slug,
            },
        },
    });

    const post = result.docs?.[0] as
        | {
              title?: string;
              contentHTML?: string;
              publishedAt?: string;
              featuredImage?: {
                  url?: string;
                  alt?: string;
              };
          }
        | undefined;

    if (!post) {
        notFound();
    }

    return (
        <main className="container">
            <h1 style={{ marginTop: 0 }}>{post.title || slug}</h1>
            {post.publishedAt ? (
                <p className="muted" style={{ marginTop: 8 }}>
                    <small>
                        {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
                    </small>
                </p>
            ) : null}
            {post.featuredImage?.url ? (
                <img
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || ""}
                    style={{ width: "100%", height: "auto" }}
                />
            ) : null}
            {post.contentHTML ? (
                <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: post.contentHTML }}
                />
            ) : null}
        </main>
    );
}
