import configPromise from "@payload-config";
import { getPayload } from "payload";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Actualités",
};

export default async function ActualitesIndex() {
    const payload = await getPayload({ config: configPromise });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    const result = await payload.find({
        collection: "posts" as unknown as CollectionSlug,
        limit: 20,
        sort: "-publishedAt",
    });

    const posts = (result.docs || []) as {
        id: string;
        title?: string;
        slug?: string;
        publishedAt?: string;
    }[];

    return (
        <main style={{ padding: 24 }}>
            <h1>Actualités</h1>
            {posts.length === 0 ? (
                <p>Aucune actualité pour le moment.</p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <Link href={`/actualites/${post.slug}`}>
                                {post.title || post.slug}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
