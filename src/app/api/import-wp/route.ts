import configPromise from "@payload-config";
import { getPayload } from "payload";

type WPPost = {
    id: number;
    slug: string;
    title?: { rendered?: string };
    content?: { rendered?: string };
    modified_gmt?: string;
    date_gmt?: string;
};

async function fetchWPEndpoint<T>(
    baseUrl: string,
    endpoint: string,
): Promise<T[]> {
    const out: T[] = [];
    let page = 1;

    while (true) {
        const url = new URL(`/wp-json/wp/v2/${endpoint}`, baseUrl);
        url.searchParams.set("per_page", "100");
        url.searchParams.set("page", String(page));

        const res = await fetch(url.toString(), {
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(
                `WP fetch failed: ${endpoint} page=${page} status=${res.status} body=${text}`,
            );
        }

        const data = (await res.json()) as T[];
        out.push(...data);

        const totalPages = Number(res.headers.get("x-wp-totalpages") || "1");
        if (!Number.isFinite(totalPages) || page >= totalPages) break;

        page++;
    }

    return out;
}

export async function POST(req: Request) {
    const importSecret = process.env.IMPORT_SECRET || "";
    if (!importSecret) {
        return Response.json(
            { error: "IMPORT_SECRET is not set" },
            { status: 500 },
        );
    }

    const provided = req.headers.get("x-import-secret") || "";
    if (provided !== importSecret) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as {
        wpBaseUrl?: string;
        importPages?: boolean;
        importPosts?: boolean;
        dryRun?: boolean;
    };

    const wpBaseUrl = body.wpBaseUrl || process.env.WP_BASE_URL || "";
    if (!wpBaseUrl) {
        return Response.json(
            { error: "wpBaseUrl (or WP_BASE_URL) is required" },
            { status: 400 },
        );
    }

    const importPages = body.importPages ?? true;
    const importPosts = body.importPosts ?? true;
    const dryRun = body.dryRun ?? false;

    const payload = await getPayload({ config: configPromise });

    type UntypedPayload = {
        find: (options: unknown) => Promise<unknown>;
        create: (options: unknown) => Promise<unknown>;
        update: (options: unknown) => Promise<unknown>;
    };

    const payloadUntyped = payload as unknown as UntypedPayload;

    type ImportCollectionSlug = "pages" | "posts";

    const findExistingByWpIdOrSlug = async (args: {
        collection: ImportCollectionSlug;
        wpId: number;
        slug: string;
    }) => {
        const { collection, wpId, slug } = args;

        const byWpId = (await payloadUntyped.find({
            collection,
            limit: 1,
            depth: 0,
            where: {
                wpId: {
                    equals: wpId,
                },
            },
        })) as { docs?: Array<{ id: string }> };

        const docByWpId = byWpId.docs?.[0];
        if (docByWpId) return docByWpId;

        const bySlug = (await payloadUntyped.find({
            collection,
            limit: 1,
            depth: 0,
            where: {
                slug: {
                    equals: slug,
                },
            },
        })) as { docs?: Array<{ id: string }> };

        const docBySlug = bySlug.docs?.[0];
        return docBySlug;
    };

    const summary: {
        pages?: { created: number; updated: number };
        posts?: { created: number; updated: number };
    } = {};

    const errors: {
        collection: "pages" | "posts";
        wpId: number;
        slug: string;
        message: string;
    }[] = [];

    if (importPages) {
        const wpPages = await fetchWPEndpoint<WPPost>(wpBaseUrl, "pages");

        let created = 0;
        let updated = 0;

        for (const wp of wpPages) {
            try {
                const title = wp.title?.rendered || wp.slug;
                const slug = wp.slug;
                const contentHTML = wp.content?.rendered || "";

                if (!slug) continue;

                const collection: ImportCollectionSlug = "pages";
                const existingDoc = await findExistingByWpIdOrSlug({
                    collection,
                    wpId: wp.id,
                    slug,
                });

                if (dryRun) {
                    if (existingDoc) updated++;
                    else created++;
                    continue;
                }

                if (existingDoc) {
                    await payloadUntyped.update({
                        collection,
                        id: existingDoc.id,
                        data: {
                            wpId: wp.id,
                            title,
                            slug,
                            contentHTML,
                        },
                    });
                    updated++;
                } else {
                    await payloadUntyped.create({
                        collection,
                        data: {
                            wpId: wp.id,
                            title,
                            slug,
                            contentHTML,
                        },
                    });
                    created++;
                }
            } catch (e) {
                errors.push({
                    collection: "pages",
                    wpId: wp.id,
                    slug: wp.slug,
                    message: e instanceof Error ? e.message : String(e),
                });
            }
        }

        summary.pages = { created, updated };
    }

    if (importPosts) {
        const wpPosts = await fetchWPEndpoint<WPPost>(wpBaseUrl, "posts");

        let created = 0;
        let updated = 0;

        for (const wp of wpPosts) {
            try {
                const title = wp.title?.rendered || wp.slug;
                const slug = wp.slug;
                const contentHTML = wp.content?.rendered || "";

                if (!slug) continue;

                const publishedAt = wp.date_gmt
                    ? new Date(wp.date_gmt).toISOString()
                    : undefined;

                const collection: ImportCollectionSlug = "posts";
                const existingDoc = await findExistingByWpIdOrSlug({
                    collection,
                    wpId: wp.id,
                    slug,
                });

                if (dryRun) {
                    if (existingDoc) updated++;
                    else created++;
                    continue;
                }

                if (existingDoc) {
                    await payloadUntyped.update({
                        collection,
                        id: existingDoc.id,
                        data: {
                            wpId: wp.id,
                            title,
                            slug,
                            contentHTML,
                            publishedAt,
                        },
                    });
                    updated++;
                } else {
                    await payloadUntyped.create({
                        collection,
                        data: {
                            wpId: wp.id,
                            title,
                            slug,
                            contentHTML,
                            publishedAt,
                        },
                    });
                    created++;
                }
            } catch (e) {
                errors.push({
                    collection: "posts",
                    wpId: wp.id,
                    slug: wp.slug,
                    message: e instanceof Error ? e.message : String(e),
                });
            }
        }

        summary.posts = { created, updated };
    }

    return Response.json({
        ok: errors.length === 0,
        dryRun,
        wpBaseUrl,
        summary,
        errors,
    });
}
