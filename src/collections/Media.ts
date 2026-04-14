import type { CollectionConfig } from "payload";

// Collection: Media
//
// Centralized uploads (images/files) stored by Payload.
// Notes:
// - Public read access is enabled.
// - `alt` is required for accessible images when used on the front-end.

export const Media: CollectionConfig = {
    slug: "media",
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
            name: "wpSourceURL",
            type: "text",
            unique: true,
            index: true,
            required: false,
        },
        {
            name: "alt",
            type: "text",
            required: true,
        },
    ],
    upload: true,
};
