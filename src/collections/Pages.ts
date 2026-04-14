import type { CollectionConfig } from "payload";

// Collection: Pages
//
// Used for site pages rendered by Next.js ("home" and `/<slug>`).
// Notes:
// - `slug` is unique and used for routing.
// - The front-end currently renders `contentHTML` directly for quick output.
//   `content` (richText) can be used for a safer/structured renderer later.

export const Pages: CollectionConfig = {
    slug: "pages",
    admin: {
        useAsTitle: "title",
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: "wpId",
            type: "number",
            unique: true,
            index: true,
            required: false,
        },
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            name: "slug",
            type: "text",
            required: true,
            unique: true,
            index: true,
        },
        {
            name: "featuredImage",
            type: "relationship",
            relationTo: "media",
            required: false,
        },
        {
            name: "contentHTML",
            type: "textarea",
            maxLength: 200000,
            required: false,
        },
        {
            name: "content",
            type: "richText",
            required: false,
        },
    ],
};
