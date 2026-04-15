import type { Block } from "payload";

// HeroBlock — Full-width hero banner.
//
// Reusable across all pages. On the homepage it includes CTAs;
// on other pages the CTAs array can simply be left empty.

export const HeroBlock: Block = {
    slug: "hero",
    labels: { singular: "Hero", plural: "Heros" },
    fields: [
        {
            name: "backgroundImage",
            label: "Image de fond",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            name: "title",
            label: "Titre",
            type: "text",
            required: true,
        },
        {
            name: "subtitle",
            label: "Sous-titre",
            type: "text",
            required: false,
        },
        {
            name: "ctas",
            label: "Boutons d'action",
            type: "array",
            required: false,
            maxRows: 3,
            fields: [
                {
                    name: "label",
                    label: "Libellé",
                    type: "text",
                    required: true,
                },
                {
                    name: "link",
                    label: "Lien (URL ou chemin)",
                    type: "text",
                    required: true,
                },
                {
                    name: "style",
                    label: "Style",
                    type: "select",
                    defaultValue: "primary",
                    options: [
                        { label: "Primaire (doré)", value: "primary" },
                        { label: "Outline (transparent)", value: "outline" },
                    ],
                },
            ],
        },
    ],
};
