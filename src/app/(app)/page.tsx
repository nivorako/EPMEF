import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Metadata } from "next";

// Home page ("/") rendered from content stored in Payload CMS.
//
// Notes:
// - `dynamic = "force-dynamic"` ensures we always fetch fresh content from Payload.
// - `generateMetadata` derives the page title from the corresponding Payload document.
// - This implementation currently supports `contentHTML` for quick rendering via
//   `dangerouslySetInnerHTML` (make sure the HTML is trusted/sanitized upstream).

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    // --- Init (Payload) ---
    const payload = await getPayload({
        config: configPromise,
    });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    // --- Query (Pages: home) ---
    const result = await payload.find({
        collection: "pages" as unknown as CollectionSlug,
        limit: 1,
        depth: 0,
        where: {
            slug: {
                equals: "home",
            },
        },
    });

    const page = result.docs?.[0] as
        | {
              title?: string;
          }
        | undefined;

    // --- Metadata output ---
    return {
        title: page?.title || "Accueil",
    };
}

export default async function Home() {
    // --- Init (Payload) ---
    const payload = await getPayload({
        config: configPromise,
    });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    // --- Query (Pages: home) ---
    const result = await payload.find({
        collection: "pages" as unknown as CollectionSlug,
        limit: 1,
        where: {
            slug: {
                equals: "home",
            },
        },
    });

    const page = result.docs?.[0] as
        | {
              title?: string;
              contentHTML?: string;
          }
        | undefined;

    // --- Render ---
    return (
        <main style={{ padding: 24 }}>
            <h1>{page?.title || "Accueil"}</h1>
            {page?.contentHTML ? (
                <div dangerouslySetInnerHTML={{ __html: page.contentHTML }} />
            ) : (
                <p>
                    Crée une page dans Payload (collection Pages) avec le slug{" "}
                    <code>home</code>.
                </p>
            )}
        </main>
    );
}
