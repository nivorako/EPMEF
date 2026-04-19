import { HeroSection } from "./HeroSection";
import { EditorialSection } from "./EditorialSection";
import { AboutSection } from "./AboutSection";
import { MediaGallerySection } from "./MediaGallerySection";
import { CommunityStructureSection } from "./CommunityStructureSection";

// Block type definitions matching Payload block slugs.

export type MediaDoc = {
    url?: string;
    alt?: string;
    filename?: string;
};

export type HeroBlockData = {
    blockType: "hero";
    backgroundImage: MediaDoc;
    title: string;
    subtitle?: string;
    ctas?: Array<{
        label: string;
        link: string;
        style?: "primary" | "outline";
    }>;
};

export type EventDoc = {
    id: string;
    title: string;
    slug?: string;
    date: string;
    description?: unknown; // Lexical richText JSON
    image?: MediaDoc;
    eventType: "culte" | "other";
    liturgie?: unknown;
    address: string;
    location?: { lat?: number; lng?: number };
};

export type EditorialBlockData = {
    blockType: "editorial";
};

export type EditorialEventData = {
    title: string;
    slug?: string;
    date: string;
    description?: unknown;
    address?: string;
};

export type AboutBlockData = {
    blockType: "about";
    title: string;
    content: unknown; // Lexical richText JSON
    image?: MediaDoc;
};

export type MediaGalleryBlockData = {
    blockType: "mediaGallery";
    title?: string;
    items: Array<{
        media: MediaDoc;
        caption?: string;
    }>;
};

export type CommunityStructureBlockData = {
    blockType: "communityStructure";
    title?: string;
    groups: Array<{
        groupName: string;
        description?: string;
        members?: Array<{
            name: string;
            role?: string;
            photo?: MediaDoc;
        }>;
    }>;
};

export type BlockData =
    | HeroBlockData
    | EditorialBlockData
    | AboutBlockData
    | MediaGalleryBlockData
    | CommunityStructureBlockData;

// Central block renderer — maps each block type to its component.

export function RenderBlocks({
    blocks,
    editorialEvent,
}: {
    blocks: BlockData[];
    editorialEvent?: EditorialEventData;
}) {
    if (!blocks || blocks.length === 0) return null;

    return (
        <>
            {blocks.map((block, idx) => {
                switch (block.blockType) {
                    case "hero":
                        return <HeroSection key={idx} data={block} />;
                    case "editorial":
                        return (
                            <EditorialSection
                                key={idx}
                                data={block}
                                event={editorialEvent}
                            />
                        );
                    case "about":
                        return <AboutSection key={idx} data={block} />;
                    case "mediaGallery":
                        return <MediaGallerySection key={idx} data={block} />;
                    case "communityStructure":
                        return (
                            <CommunityStructureSection key={idx} data={block} />
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
}
