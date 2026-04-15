// Minimal Lexical rich-text renderer.
//
// Converts the serialized Lexical JSON from Payload CMS into basic HTML.
// Handles: paragraphs, headings (h1–h6), lists (ul/ol), links, and
// text formatting (bold, italic, underline, strikethrough, code).
//
// For more advanced rendering (embeds, blocks, etc.), consider
// @payloadcms/richtext-lexical/react in the future.

type LexicalNode = {
    type: string;
    tag?: string;
    text?: string;
    format?: number | string;
    children?: LexicalNode[];
    url?: string;
    listType?: string;
    direction?: string;
    indent?: number;
    version?: number;
};

type LexicalRoot = {
    root?: {
        children?: LexicalNode[];
    };
};

function renderNode(node: LexicalNode, idx: number): React.ReactNode {
    // Text node
    if (node.type === "text") {
        let content: React.ReactNode = node.text || "";
        const fmt = typeof node.format === "number" ? node.format : 0;
        if (fmt & 1) content = <strong key={idx}>{content}</strong>;
        if (fmt & 2) content = <em key={idx}>{content}</em>;
        if (fmt & 4) content = <s key={idx}>{content}</s>;
        if (fmt & 8) content = <u key={idx}>{content}</u>;
        if (fmt & 16) content = <code key={idx}>{content}</code>;
        return content;
    }

    // Linebreak
    if (node.type === "linebreak") return <br key={idx} />;

    const children = node.children?.map((child, i) => renderNode(child, i));

    // Link
    if (node.type === "link" || node.type === "autolink") {
        return (
            <a key={idx} href={node.url || "#"}>
                {children}
            </a>
        );
    }

    // Heading
    if (node.type === "heading") {
        const tag = node.tag || "h2";
        if (tag === "h1") return <h1 key={idx}>{children}</h1>;
        if (tag === "h3") return <h3 key={idx}>{children}</h3>;
        if (tag === "h4") return <h4 key={idx}>{children}</h4>;
        if (tag === "h5") return <h5 key={idx}>{children}</h5>;
        if (tag === "h6") return <h6 key={idx}>{children}</h6>;
        return <h2 key={idx}>{children}</h2>;
    }

    // List
    if (node.type === "list") {
        const Tag = node.listType === "number" ? "ol" : "ul";
        return <Tag key={idx}>{children}</Tag>;
    }

    if (node.type === "listitem") {
        return <li key={idx}>{children}</li>;
    }

    // Paragraph (default block)
    if (node.type === "paragraph") {
        return <p key={idx}>{children}</p>;
    }

    // Fallback — render children in a fragment
    return <span key={idx}>{children}</span>;
}

export function RichText({ content }: { content: unknown }) {
    if (!content) return null;

    const data = content as LexicalRoot;
    const nodes = data.root?.children;

    if (!nodes || nodes.length === 0) return null;

    return <>{nodes.map((node, idx) => renderNode(node, idx))}</>;
}
