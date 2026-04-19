import type { Block } from "payload";

export const LiturgiePriereBlock: Block = {
    slug: "liturgiePriere",
    labels: { singular: "Prière (Liturgie)", plural: "Prières (Liturgie)" },
    fields: [
        {
            name: "title",
            label: "Titre",
            type: "text",
            required: false,
        },
        {
            name: "sourceUrl",
            label: "Source (URL)",
            type: "text",
            required: false,
        },
        {
            name: "content",
            label: "Contenu",
            type: "richText",
            required: true,
        },
    ],
};
