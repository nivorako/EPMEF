import configPromise from "@payload-config";
import { getPayload } from "payload";

export default async function Home() {
    const payload = await getPayload({
        config: configPromise,
    });

    type FindArgs = Parameters<typeof payload.find>[0];
    type CollectionSlug = FindArgs["collection"];

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
