import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await props.params;

    if (slug === "home") {
        return {
            title: "Accueil",
        };
    }

    const payload = await getPayload({ config: configPromise });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    const result = await payload.find({
        collection: "pages" as unknown as CollectionSlug,
        limit: 1,
        depth: 0,
        where: {
            slug: {
                equals: slug,
            },
        },
    });

    const page = result.docs?.[0] as
        | {
              title?: string;
          }
        | undefined;

    if (!page) {
        return {
            title: "Page introuvable",
        };
    }

    return {
        title: page.title || slug,
    };
}

export default async function PageBySlug(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;

    if (slug === "home") {
        redirect("/");
    }

    const payload = await getPayload({ config: configPromise });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

    const result = await payload.find({
        collection: "pages" as unknown as CollectionSlug,
        limit: 1,
        where: {
            slug: {
                equals: slug,
            },
        },
    });

    const page = result.docs?.[0] as
        | {
              title?: string;
              contentHTML?: string;
          }
        | undefined;

    if (!page) {
        notFound();
    }

    return (
        <main style={{ padding: 24 }}>
            <h1>{page.title || slug}</h1>
            {page.contentHTML ? (
                <div dangerouslySetInnerHTML={{ __html: page.contentHTML }} />
            ) : null}
        </main>
    );
}
