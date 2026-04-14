import configPromise from "@payload-config";
import { getPayload } from "payload";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Actualités",
};

export default async function ActualitesIndex(props: {
    searchParams?: Promise<{ page?: string }>;
}) {
    const searchParams = (await props.searchParams) || {};
    const pageFromQuery = Number.parseInt(searchParams.page || "1", 10);
    const currentPage =
        Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;
    const limit = 9;

    const payload = await getPayload({ config: configPromise });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    const result = await payload.find({
        collection: "posts" as unknown as CollectionSlug,
        limit,
        page: currentPage,
        depth: 1,
        sort: "-publishedAt",
    });

    const posts = (result.docs || []) as {
        id: string;
        title?: string;
        slug?: string;
        publishedAt?: string;
        contentHTML?: string;
        featuredImage?: {
            url?: string;
            alt?: string;
        };
    }[];

    const totalPages = (result.totalPages || 1) as number;
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ");
    const excerptFromHTML = (html: string) => {
        const text = stripHtml(html).replace(/\s+/g, " ").trim();
        if (!text) return "";
        return text.length > 160 ? `${text.slice(0, 160)}…` : text;
    };

    return (
        <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
            <h1 style={{ marginTop: 0 }}>Actualités</h1>
            {posts.length === 0 ? (
                <p>Aucune actualité pour le moment.</p>
            ) : (
                <>
                    <section
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: 16,
                            marginTop: 16,
                        }}
                    >
                        {posts.map((post) => {
                            const href = `/actualites/${post.slug}`;
                            const dateLabel = post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString(
                                      "fr-FR",
                                  )
                                : null;
                            const excerpt = post.contentHTML
                                ? excerptFromHTML(post.contentHTML)
                                : "";

                            return (
                                <article
                                    key={post.id}
                                    style={{
                                        border: "1px solid #eee",
                                        borderRadius: 12,
                                        overflow: "hidden",
                                        background: "#fff",
                                    }}
                                >
                                    {post.featuredImage?.url ? (
                                        <Link
                                            href={href}
                                            style={{ display: "block" }}
                                        >
                                            <img
                                                src={post.featuredImage.url}
                                                alt={
                                                    post.featuredImage.alt || ""
                                                }
                                                style={{
                                                    width: "100%",
                                                    height: 160,
                                                    objectFit: "cover",
                                                    display: "block",
                                                }}
                                            />
                                        </Link>
                                    ) : null}

                                    <div style={{ padding: 16 }}>
                                        <h2
                                            style={{
                                                margin: 0,
                                                fontSize: 18,
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            <Link href={href}>
                                                {post.title || post.slug}
                                            </Link>
                                        </h2>
                                        {dateLabel ? (
                                            <p
                                                style={{
                                                    margin: "8px 0 0",
                                                    opacity: 0.75,
                                                }}
                                            >
                                                <small>{dateLabel}</small>
                                            </p>
                                        ) : null}
                                        {excerpt ? (
                                            <p
                                                style={{
                                                    margin: "12px 0 0",
                                                    opacity: 0.9,
                                                }}
                                            >
                                                {excerpt}
                                            </p>
                                        ) : null}
                                    </div>
                                </article>
                            );
                        })}
                    </section>

                    <nav
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 24,
                        }}
                    >
                        <div>
                            {hasPrev ? (
                                <Link
                                    href={`/actualites?page=${currentPage - 1}`}
                                >
                                    ← Page précédente
                                </Link>
                            ) : null}
                        </div>
                        <div style={{ opacity: 0.75 }}>
                            <small>
                                Page {currentPage} / {totalPages}
                            </small>
                        </div>
                        <div>
                            {hasNext ? (
                                <Link
                                    href={`/actualites?page=${currentPage + 1}`}
                                >
                                    Page suivante →
                                </Link>
                            ) : null}
                        </div>
                    </nav>
                </>
            )}
        </main>
    );
}
