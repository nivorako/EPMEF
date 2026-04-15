import type { Block } from "payload";

// MediaGalleryBlock — Grid gallery of images/media.
//
// Each item is an uploaded media with an optional caption.

export const MediaGalleryBlock: Block = {
    slug: "mediaGallery",
    labels: { singular: "Galerie Média", plural: "Galeries Média" },
    fields: [
        {
            name: "title",
            label: "Titre de la galerie",
            type: "text",
            required: false,
            defaultValue: "Galerie",
        },
        {
            name: "items",
            label: "Médias",
            type: "array",
            required: true,
            minRows: 1,
            fields: [
                {
                    name: "media",
                    label: "Fichier",
                    type: "upload",
                    relationTo: "media",
                    required: true,
                },
                {
                    name: "caption",
                    label: "Légende",
                    type: "text",
                    required: false,
                },
            ],
        },
    ],
};
