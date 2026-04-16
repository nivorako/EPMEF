import configPromise from "@payload-config";
import { getPayload } from "payload";

// ── WordPress → Payload CMS import route ──────────────────────────────────────
//
// POST /api/import-wp
//
// Bulk-imports pages, posts and media from a WordPress REST API into Payload.
//
// Authentication: requires `x-import-secret` header matching `IMPORT_SECRET` env var.
//
// Body options:
//   wpBaseUrl        – root URL of the WordPress site (or `WP_BASE_URL` env).
//   importPages      – import WP pages into Payload `pages` collection (default true).
//   importPosts      – import WP posts into Payload `posts` collection (default true).
//   importMedia      – download & upload images into Payload `media` (default true).
//   replaceMediaURLs – rewrite WP image URLs inside contentHTML to local Payload URLs.
//   dryRun           – simulate the import without writing to DB.
//   debugSchema      – return Payload schema field names (diagnostic helper).
//   onlySlug         – restrict import to a single slug.
//   maxItems         – cap the number of items to process.
//
// The import is idempotent: documents are matched by `wpId` or `slug` and
// updated if they already exist.

// ── WordPress REST API types ──

type WPPost = {
    id: number;
    slug: string;
    title?: { rendered?: string };
    content?: { rendered?: string };
    modified_gmt?: string;
    date_gmt?: string;
    featured_media?: number;
};

type WPMedia = {
    id: number;
    source_url?: string;
    alt_text?: string;
    title?: { rendered?: string };
};

type TribeEvent = {
    id: number;
    title: string;
    slug: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    image?: { url?: string; id?: number };
    categories?: Array<{ slug?: string; name?: string }>;
    venue?: Array<{
        venue?: string;
        address?: string;
        city?: string;
        country?: string;
    }>;
    organizer?: Array<{ organizer?: string }>;
};

// ── WP REST helpers ──

/** Paginate through a WP REST collection endpoint and return all items. */
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

/** Fetch a single item from the WP REST API (e.g. `media/123`). */
async function fetchWPItem<T>(baseUrl: string, endpoint: string): Promise<T> {
    const url = new URL(`/wp-json/wp/v2/${endpoint}`, baseUrl);
    const res = await fetch(url.toString(), {
        headers: {
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
            `WP fetch failed: ${endpoint} status=${res.status} body=${text}`,
        );
    }

    return (await res.json()) as T;
}

/** Fetch all events from The Events Calendar (Tribe) REST API, including past events. */
async function fetchAllTribeEvents(baseUrl: string): Promise<TribeEvent[]> {
    const out: TribeEvent[] = [];
    let page = 1;

    while (true) {
        const url = new URL("/wp-json/tribe/events/v1/events", baseUrl);
        url.searchParams.set("per_page", "50");
        url.searchParams.set("page", String(page));
        url.searchParams.set("start_date", "2015-01-01");
        url.searchParams.set("end_date", "2030-12-31");
        url.searchParams.set("status", "publish");

        const res = await fetch(url.toString(), {
            headers: { Accept: "application/json" },
            cache: "no-store",
        });

        if (!res.ok) break;

        const data = (await res.json()) as {
            events?: TribeEvent[];
            total_pages?: number;
        };

        if (data.events) out.push(...data.events);

        const totalPages = data.total_pages || 1;
        if (page >= totalPages) break;
        page++;
    }

    return out;
}

// ── Main handler ──

export async function POST(req: Request) {
    // --- Auth check ---
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

    // --- Parse request body ---
    const body = (await req.json().catch(() => ({}))) as {
        wpBaseUrl?: string;
        importPages?: boolean;
        importPosts?: boolean;
        importEvents?: boolean;
        importMedia?: boolean;
        replaceMediaURLs?: boolean;
        dryRun?: boolean;
        debugSchema?: boolean;
        onlySlug?: string;
        maxItems?: number;
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
    const importEvents = body.importEvents ?? false;
    const importMedia = body.importMedia ?? true;
    const replaceMediaURLs = body.replaceMediaURLs ?? true;
    const dryRun = body.dryRun ?? false;
    const debugSchema = body.debugSchema ?? false;
    const onlySlug = body.onlySlug || "";
    const maxItems = typeof body.maxItems === "number" ? body.maxItems : 0;

    const payload = await getPayload({ config: configPromise });

    if (debugSchema) {
        const cfg = (payload as unknown as { config?: unknown }).config as
            | {
                  collections?: Array<{
                      slug?: string;
                      fields?: Array<{ name?: string }>;
                  }>;
              }
            | undefined;

        const pagesFields =
            cfg?.collections
                ?.find((c) => c.slug === "pages")
                ?.fields?.map((f) => f.name)
                .filter(Boolean) || [];
        const postsFields =
            cfg?.collections
                ?.find((c) => c.slug === "posts")
                ?.fields?.map((f) => f.name)
                .filter(Boolean) || [];

        return Response.json({
            ok: true,
            debugSchema: {
                pagesFields,
                postsFields,
            },
        });
    }

    type UntypedPayload = {
        find: (options: unknown) => Promise<unknown>;
        create: (options: unknown) => Promise<unknown>;
        update: (options: unknown) => Promise<unknown>;
    };

    const payloadUntyped = payload as unknown as UntypedPayload;

    type ImportCollectionSlug = "pages" | "posts" | "events";

    // Cache: canonical WP URL → local Payload URL (avoids duplicate downloads).
    const mediaUrlCache = new Map<string, string>();

    // --- Media URL extraction & canonicalization helpers ---

    /** Extract all image URLs from HTML (src, srcset, CSS url()). */
    const extractImageURLs = (html: string) => {
        const urls = new Set<string>();
        if (!html) return [];

        // src="..." or src='...'
        const srcRe = /\ssrc=("([^"]+)"|'([^']+)')/gi;
        let m: RegExpExecArray | null = null;
        while ((m = srcRe.exec(html))) {
            const url = (m[2] || m[3] || "").trim();
            if (url) urls.add(url);
        }

        // srcset="url 300w, url2 768w"
        const srcsetRe = /\ssrcset=("([^"]+)"|'([^']+)')/gi;
        while ((m = srcsetRe.exec(html))) {
            const raw = (m[2] || m[3] || "").trim();
            if (!raw) continue;
            for (const part of raw.split(",")) {
                const token = part.trim().split(/\s+/)[0];
                if (token) urls.add(token);
            }
        }

        // CSS: url("...") / url('...') / url(...)
        const cssUrlRe = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^\)\s]+))\s*\)/gi;
        while ((m = cssUrlRe.exec(html))) {
            const url = (m[1] || m[2] || m[3] || "").trim();
            if (url) urls.add(url);
        }

        return Array.from(urls);
    };

    /** Normalize a WP media URL: strip query/hash, remove `-300x200` / `-scaled` suffixes. */
    const canonicalizeWPAssetURL = (input: string) => {
        try {
            const u = new URL(input, wpBaseUrl);

            // Strip query/hash for stable keys.
            u.search = "";
            u.hash = "";

            // Only canonicalize uploads on the same WP host.
            const wpHost = new URL(wpBaseUrl).host;
            if (u.host !== wpHost) {
                return { canonical: u.toString(), fetchURL: u.toString() };
            }

            // Canonicalize common WP variants:
            // - image-300x200.jpg -> image.jpg
            // - image-scaled.jpg -> image.jpg
            const segments = u.pathname.split("/");
            const filename = segments.pop() || "";
            const dot = filename.lastIndexOf(".");
            if (dot > 0) {
                const base = filename.slice(0, dot);
                const ext = filename.slice(dot);
                const baseNoScaled = base.replace(/-scaled$/i, "");
                const baseNoSize = baseNoScaled.replace(/-\d+x\d+$/i, "");
                const canonicalFilename = `${baseNoSize}${ext}`;
                segments.push(canonicalFilename);
                u.pathname = segments.join("/");
            }

            const canonical = u.toString();

            // Fetch the originally referenced asset (but without query/hash).
            const fetch = new URL(input, wpBaseUrl);
            fetch.search = "";
            fetch.hash = "";

            return { canonical, fetchURL: fetch.toString() };
        } catch {
            return { canonical: input, fetchURL: input };
        }
    };

    // --- Media download / upsert pipeline ---

    /** Download a remote image and return a Payload-compatible upload object. */
    const downloadAsPayloadUpload = async (sourceURL: string) => {
        const { fetchURL } = canonicalizeWPAssetURL(sourceURL);
        const res = await fetch(fetchURL, { cache: "no-store" });
        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(
                `Media download failed: status=${res.status} url=${sourceURL} body=${text}`,
            );
        }

        const arrayBuf = await res.arrayBuffer();
        const data = Buffer.from(arrayBuf);
        const mimetype =
            res.headers.get("content-type") || "application/octet-stream";
        const pathname = new URL(sourceURL).pathname;
        const name = decodeURIComponent(pathname.split("/").pop() || "file");

        return {
            data,
            mimetype,
            name,
            size: data.length,
        };
    };

    /** Look up an existing Payload media doc by wpId or wpSourceURL. */
    const findExistingMedia = async (args: {
        wpId?: number;
        wpSourceURL?: string;
    }) => {
        const { wpId, wpSourceURL } = args;

        if (typeof wpId === "number" && Number.isFinite(wpId)) {
            const byWpId = (await payloadUntyped.find({
                collection: "media",
                limit: 1,
                depth: 0,
                where: {
                    wpId: {
                        equals: wpId,
                    },
                },
            })) as { docs?: Array<{ id: string; url?: string }> };

            const doc = byWpId.docs?.[0];
            if (doc) return doc;
        }

        if (wpSourceURL) {
            const bySource = (await payloadUntyped.find({
                collection: "media",
                limit: 1,
                depth: 0,
                where: {
                    wpSourceURL: {
                        equals: wpSourceURL,
                    },
                },
            })) as { docs?: Array<{ id: string; url?: string }> };

            const doc = bySource.docs?.[0];
            if (doc) return doc;
        }

        return undefined;
    };

    /** Create or reuse a Payload media doc for a given WP image URL. */
    const upsertMediaFromWP = async (args: {
        wpId?: number;
        sourceURL: string;
        alt?: string;
    }) => {
        const { canonical, fetchURL } = canonicalizeWPAssetURL(args.sourceURL);
        if (!canonical) return undefined;

        const cached = mediaUrlCache.get(canonical);
        if (cached) return { id: "", url: cached };

        const existing = await findExistingMedia({
            wpId: args.wpId,
            wpSourceURL: canonical,
        });
        if (existing?.url) {
            mediaUrlCache.set(canonical, existing.url);
            mediaReused++;
            return existing;
        }

        if (!importMedia) return undefined;
        if (dryRun) return { id: "", url: canonical };

        const upload = await downloadAsPayloadUpload(fetchURL);
        const alt = (args.alt || "").trim() || "Image";

        const created = (await payloadUntyped.create({
            collection: "media",
            data: {
                alt,
                wpId: args.wpId,
                wpSourceURL: canonical,
            },
            file: upload,
        })) as { id: string; url?: string };

        mediaCreated++;

        if (created?.url) {
            mediaUrlCache.set(canonical, created.url);
        }

        return created;
    };

    /** Resolve a WP `featured_media` ID to a Payload media doc. */
    const resolveFeaturedMedia = async (
        featuredMediaId: number | undefined,
    ): Promise<{ id: string; url?: string } | undefined> => {
        if (!featuredMediaId) return undefined;

        const existing = await findExistingMedia({ wpId: featuredMediaId });
        if (existing) {
            mediaReused++;
            return existing;
        }

        const media = await fetchWPItem<WPMedia>(
            wpBaseUrl,
            `media/${featuredMediaId}`,
        );
        const sourceURL = media?.source_url;
        if (!sourceURL) return undefined;

        const alt = media?.alt_text || media?.title?.rendered || "Image";
        return upsertMediaFromWP({ wpId: featuredMediaId, sourceURL, alt });
    };

    /** Rewrite WP-hosted image URLs inside HTML to their Payload equivalents. */
    const replaceMediaURLsInHTML = async (html: string) => {
        if (!replaceMediaURLs || !html) return html;

        const imageUrls = extractImageURLs(html);
        if (imageUrls.length === 0) return html;

        let out = html;
        for (const rawUrl of imageUrls) {
            const { canonical: fullUrl, fetchURL } =
                canonicalizeWPAssetURL(rawUrl);
            // Skip if not a WP-hosted asset
            if (!fullUrl.startsWith(wpBaseUrl)) continue;

            try {
                const mediaDoc = await upsertMediaFromWP({
                    sourceURL: fetchURL,
                    alt: "Image",
                });
                const newUrl = mediaDoc?.url;
                if (!newUrl) continue;

                // Replace both raw and canonical occurrences
                out = out.split(rawUrl).join(newUrl);
                out = out.split(fullUrl).join(newUrl);
            } catch {
                // Best-effort: ignore media replacement failures
            }
        }

        return out;
    };

    // --- Document upsert helpers ---

    /** Find an existing Payload doc by wpId first, then by slug. */
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

    // --- Import counters & error tracking ---

    const summary: {
        pages?: { created: number; updated: number };
        posts?: { created: number; updated: number };
        events?: { created: number; updated: number };
        media?: { created: number; reused: number };
    } = {};

    let mediaCreated = 0;
    let mediaReused = 0;

    const errors: {
        collection: "pages" | "posts" | "events";
        wpId: number;
        slug: string;
        message: string;
    }[] = [];

    const formatError = (e: unknown) => {
        if (e instanceof Error) {
            const anyErr = e as unknown as {
                name?: string;
                message?: string;
                stack?: string;
                data?: unknown;
                errors?: unknown;
            };

            const details = anyErr.data ?? anyErr.errors;
            if (details) {
                try {
                    return `${anyErr.message || "Error"} | details=${JSON.stringify(details)}`;
                } catch {
                    return `${anyErr.message || "Error"} | details=[unserializable]`;
                }
            }

            return anyErr.message || "Error";
        }

        try {
            return JSON.stringify(e);
        } catch {
            return String(e);
        }
    };

    // ── Import: Pages ──
    if (importPages) {
        let wpPages = await fetchWPEndpoint<WPPost>(wpBaseUrl, "pages");
        if (onlySlug) wpPages = wpPages.filter((p) => p.slug === onlySlug);
        if (maxItems > 0) wpPages = wpPages.slice(0, maxItems);

        let created = 0;
        let updated = 0;

        for (const wp of wpPages) {
            try {
                const title = wp.title?.rendered || wp.slug;
                const slug = wp.slug;
                const featured = await resolveFeaturedMedia(wp.featured_media);
                const contentHTMLRaw = wp.content?.rendered || "";
                const contentHTML =
                    await replaceMediaURLsInHTML(contentHTMLRaw);

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
                            featuredImage: featured?.id || undefined,
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
                            featuredImage: featured?.id || undefined,
                        },
                    });
                    created++;
                }

                if (featured?.id) mediaReused++;
            } catch (e) {
                errors.push({
                    collection: "pages",
                    wpId: wp.id,
                    slug: wp.slug,
                    message: formatError(e),
                });
            }
        }

        summary.pages = { created, updated };
    }

    // ── Import: Posts ──
    if (importPosts) {
        let wpPosts = await fetchWPEndpoint<WPPost>(wpBaseUrl, "posts");
        if (onlySlug) wpPosts = wpPosts.filter((p) => p.slug === onlySlug);
        if (maxItems > 0) wpPosts = wpPosts.slice(0, maxItems);

        let created = 0;
        let updated = 0;

        for (const wp of wpPosts) {
            try {
                const title = wp.title?.rendered || wp.slug;
                const slug = wp.slug;
                const featured = await resolveFeaturedMedia(wp.featured_media);
                const contentHTMLRaw = wp.content?.rendered || "";
                const contentHTML =
                    await replaceMediaURLsInHTML(contentHTMLRaw);

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
                            featuredImage: featured?.id || undefined,
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
                            featuredImage: featured?.id || undefined,
                        },
                    });
                    created++;
                }

                if (featured?.id) mediaReused++;
            } catch (e) {
                errors.push({
                    collection: "posts",
                    wpId: wp.id,
                    slug: wp.slug,
                    message: formatError(e),
                });
            }
        }

        summary.posts = { created, updated };
    }

    // ── Import: Events (The Events Calendar / Tribe) ──
    if (importEvents) {
        // Tribe API uses its own REST namespace and pagination.
        const tribeEvents = await fetchAllTribeEvents(wpBaseUrl);
        let filtered = tribeEvents;
        if (onlySlug)
            filtered = filtered.filter((e: TribeEvent) => e.slug === onlySlug);
        if (maxItems > 0) filtered = filtered.slice(0, maxItems);

        let created = 0;
        let updated = 0;

        for (const te of filtered) {
            try {
                const title = te.title || te.slug;
                const slug = te.slug;
                if (!slug) continue;

                const date = te.start_date
                    ? new Date(te.start_date).toISOString()
                    : new Date().toISOString();

                // Map Tribe categories to eventType.
                const catSlugs = (te.categories || []).map(
                    (c: { slug?: string }) => c.slug || "",
                );
                const isCulte = catSlugs.some(
                    (s: string) =>
                        s.includes("culte") ||
                        s.includes("worship") ||
                        s.includes("service"),
                );
                const eventType = isCulte ? "culte" : "other";

                // Build address from venue if available.
                const venueObj = te.venue?.[0];
                const addressParts = [
                    venueObj?.venue,
                    venueObj?.address,
                    venueObj?.city,
                    venueObj?.country,
                ].filter(Boolean);
                const address = addressParts.join(", ") || "À définir";

                // Resolve featured image.
                let imageId: string | undefined;
                if (te.image?.url) {
                    const mediaDoc = await upsertMediaFromWP({
                        wpId: te.image.id,
                        sourceURL: te.image.url,
                        alt: title,
                    });
                    imageId = mediaDoc?.id || undefined;
                }

                // Strip HTML from description for contentHTML storage.
                const contentHTML = te.description || "";

                // Find existing event by wpId or slug.
                const existing = await findExistingByWpIdOrSlug({
                    collection: "events" as ImportCollectionSlug,
                    wpId: te.id,
                    slug,
                });

                const eventData = {
                    wpId: te.id,
                    title,
                    slug,
                    date,
                    eventType,
                    address,
                    contentHTML,
                    image: imageId || undefined,
                };

                if (dryRun) {
                    if (existing) updated++;
                    else created++;
                    continue;
                }

                if (existing) {
                    await payloadUntyped.update({
                        collection: "events",
                        id: existing.id,
                        data: eventData,
                    });
                    updated++;
                } else {
                    await payloadUntyped.create({
                        collection: "events",
                        data: eventData,
                    });
                    created++;
                }
            } catch (e) {
                errors.push({
                    collection: "events",
                    wpId: te.id,
                    slug: te.slug,
                    message: formatError(e),
                });
            }
        }

        summary.events = { created, updated };
    }

    // ── Response ──
    return Response.json({
        ok: errors.length === 0,
        dryRun,
        wpBaseUrl,
        summary: {
            ...summary,
            media: {
                created: mediaCreated,
                reused: mediaReused,
            },
        },
        errors,
    });
}
