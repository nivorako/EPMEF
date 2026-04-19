import type { Block } from "payload";

export const LiturgieChantBlock: Block = {
    slug: "liturgieChant",
    labels: { singular: "Chant (Liturgie)", plural: "Chants (Liturgie)" },
    fields: [
        {
            name: "title",
            label: "Titre du chant",
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
            name: "lyrics",
            label: "Paroles",
            type: "textarea",
            required: true,
        },
    ],
};
