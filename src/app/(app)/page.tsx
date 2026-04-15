import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Metadata } from "next";
import { RenderBlocks, type BlockData } from "./components/blocks/RenderBlocks";

// Home page ("/") rendered from content stored in Payload CMS.
//
// The page renders blocks from the `layout` field (Hero, Editorial, About,
// MediaGallery, CommunityStructure). Falls back to legacy `contentHTML` if
// no blocks have been configured yet.
//
// Notes:
// - `dynamic = "force-dynamic"` ensures we always fetch fresh content from Payload.
// - `generateMetadata` derives the page title from the corresponding Payload document.

export const dynamic = "force-dynamic";

type FindArgs = Parameters<Awaited<ReturnType<typeof getPayload>>["find"]>[0];
type CollectionSlug = FindArgs["collection"];

export async function generateMetadata(): Promise<Metadata> {
    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
        collection: "pages" as unknown as CollectionSlug,
        limit: 1,
        depth: 0,
        where: { slug: { equals: "home" } },
    });

    const page = result.docs?.[0] as { title?: string } | undefined;

    return {
        title: page?.title || "Accueil",
    };
}

export default async function Home() {
    const payload = await getPayload({ config: configPromise });

    const pageResult = await payload.find({
        collection: "pages" as unknown as CollectionSlug,
        limit: 1,
        depth: 2,
        where: { slug: { equals: "home" } },
    });

    const page = pageResult.docs?.[0] as
        | {
              title?: string;
              contentHTML?: string;
              layout?: BlockData[];
          }
        | undefined;

    const blocks = page?.layout || [];

    // --- Render blocks if present, otherwise fall back to legacy contentHTML ---
    return (
        <>
            {blocks.length > 0 ? (
                <RenderBlocks blocks={blocks} />
            ) : (
                <section className="py-16 sm:py-20">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6">
                        {page?.contentHTML ? (
                            <div
                                className="prose"
                                dangerouslySetInnerHTML={{
                                    __html: page.contentHTML,
                                }}
                            />
                        ) : (
                            <div className="text-center py-12 text-muted">
                                <p>
                                    Créez une page dans Payload (collection
                                    Pages) avec le slug{" "}
                                    <code className="bg-stone-100 px-2 py-0.5 rounded text-sm">
                                        home
                                    </code>{" "}
                                    puis ajoutez des blocs dans l&apos;onglet
                                    &quot;Mise en page&quot;.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </>
    );
}
