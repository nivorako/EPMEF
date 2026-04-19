import type { Block } from "payload";

export const LiturgieSectionBlock: Block = {
    slug: "liturgieSection",
    labels: { singular: "Section (Liturgie)", plural: "Sections (Liturgie)" },
    fields: [
        {
            name: "title",
            label: "Titre",
            type: "text",
            required: true,
        },
        {
            name: "content",
            label: "Contenu",
            type: "richText",
            required: true,
        },
    ],
};
