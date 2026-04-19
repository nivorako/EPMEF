import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
    RenderLiturgieBlocks,
    type LiturgieBlockData,
} from "../../../components/liturgie/RenderLiturgieBlocks";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await props.params;

    const payload = await getPayload({ config: configPromise });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    const result = await payload.find({
        collection: "events" as unknown as CollectionSlug,
        limit: 1,
        depth: 0,
        where: { slug: { equals: slug.toLowerCase() } },
    });

    const event = result.docs?.[0] as { title?: string } | undefined;

    return {
        title: event?.title ? `Liturgie — ${event.title}` : "Liturgie",
    };
}

export default async function EventLiturgiePage(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;

    const payload = await getPayload({ config: configPromise });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    const result = await payload.find({
        collection: "events" as unknown as CollectionSlug,
        limit: 1,
        depth: 0,
        where: { slug: { equals: slug.toLowerCase() } },
    });

    const event = result.docs?.[0] as
        | {
              title?: string;
              eventType?: "culte" | "other";
              liturgie?: LiturgieBlockData[];
          }
        | undefined;

    if (!event) notFound();

    if (event.eventType !== "culte") {
        notFound();
    }

    const blocks = event.liturgie || [];

    return (
        <main className="container py-10">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                {event.title ? `Liturgie — ${event.title}` : "Liturgie"}
            </h1>

            {blocks.length === 0 ? (
                <p className="mt-6 text-muted">
                    Aucune liturgie n&apos;a encore été ajoutée pour ce culte.
                </p>
            ) : (
                <div className="mt-8">
                    <RenderLiturgieBlocks blocks={blocks} />
                </div>
            )}
        </main>
    );
}
