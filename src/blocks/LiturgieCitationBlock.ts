import type { Block } from "payload";

export const LiturgieCitationBlock: Block = {
    slug: "liturgieCitation",
    labels: { singular: "Citation (Liturgie)", plural: "Citations (Liturgie)" },
    fields: [
        {
            name: "quote",
            label: "Citation",
            type: "textarea",
            required: true,
        },
        {
            name: "author",
            label: "Auteur / Référence",
            type: "text",
            required: false,
        },
    ],
};
