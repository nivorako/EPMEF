import { RichText } from "../blocks/RichText";

type LiturgieSectionBlockData = {
    blockType: "liturgieSection";
    title: string;
    content: unknown;
};

type LiturgieChantBlockData = {
    blockType: "liturgieChant";
    title?: string;
    sourceUrl?: string;
    lyrics: string;
};

type LiturgiePriereBlockData = {
    blockType: "liturgiePriere";
    title?: string;
    sourceUrl?: string;
    content: unknown;
};

type LiturgieCitationBlockData = {
    blockType: "liturgieCitation";
    quote: string;
    author?: string;
};

export type LiturgieBlockData =
    | LiturgieSectionBlockData
    | LiturgieChantBlockData
    | LiturgiePriereBlockData
    | LiturgieCitationBlockData;

export function RenderLiturgieBlocks({
    blocks,
}: {
    blocks: LiturgieBlockData[];
}) {
    if (!blocks || blocks.length === 0) return null;

    return (
        <div className="space-y-8">
            {blocks.map((block, idx) => {
                switch (block.blockType) {
                    case "liturgieSection":
                        return (
                            <section key={idx} className="prose max-w-none">
                                <h2>{block.title}</h2>
                                <RichText content={block.content} />
                            </section>
                        );
                    case "liturgieChant":
                        return (
                            <section key={idx} className="prose max-w-none">
                                {block.title ? <h3>{block.title}</h3> : null}
                                {block.sourceUrl ? (
                                    <p>
                                        <a href={block.sourceUrl}>
                                            {block.sourceUrl}
                                        </a>
                                    </p>
                                ) : null}
                                <pre className="whitespace-pre-wrap font-sans">
                                    {block.lyrics}
                                </pre>
                            </section>
                        );
                    case "liturgiePriere":
                        return (
                            <section key={idx} className="prose max-w-none">
                                {block.title ? <h3>{block.title}</h3> : null}
                                {block.sourceUrl ? (
                                    <p>
                                        <a href={block.sourceUrl}>
                                            {block.sourceUrl}
                                        </a>
                                    </p>
                                ) : null}
                                <RichText content={block.content} />
                            </section>
                        );
                    case "liturgieCitation":
                        return (
                            <section key={idx} className="prose max-w-none">
                                <blockquote>
                                    <p>{block.quote}</p>
                                    {block.author ? (
                                        <footer>{block.author}</footer>
                                    ) : null}
                                </blockquote>
                            </section>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}
