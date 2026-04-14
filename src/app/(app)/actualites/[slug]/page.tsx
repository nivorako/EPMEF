import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
        depth: 0,
        where: {
            slug: {
                equals: slug,
            },
        },
    });

    const post = result.docs?.[0] as
        | {
              title?: string;
          }
        | undefined;

    if (!post) {
        return {
            title: "Actualité introuvable",
        };
    }

    return {
        title: post.title || slug,
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
        <main style={{ padding: 24 }}>
            <h1>{post.title || slug}</h1>
            {post.publishedAt ? (
                <p>
                    <small>
                        {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
                    </small>
                </p>
            ) : null}
            {post.featuredImage?.url ? (
                <img
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || ""}
                    style={{ maxWidth: "100%", height: "auto" }}
                />
            ) : null}
            {post.contentHTML ? (
                <div dangerouslySetInnerHTML={{ __html: post.contentHTML }} />
            ) : null}
        </main>
    );
}
