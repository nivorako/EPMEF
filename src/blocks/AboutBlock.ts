import type { Block } from "payload";

// AboutBlock — "À propos" section.
//
// Rich text content alongside an optional image. Intended for the homepage
// but can be placed on any page.

export const AboutBlock: Block = {
    slug: "about",
    labels: { singular: "À propos", plural: "À propos" },
    fields: [
        {
            name: "title",
            label: "Titre",
            type: "text",
            required: true,
            defaultValue: "Qui sommes-nous ?",
        },
        {
            name: "content",
            label: "Contenu",
            type: "richText",
            required: true,
        },
        {
            name: "image",
            label: "Image",
            type: "upload",
            relationTo: "media",
            required: false,
        },
    ],
};
