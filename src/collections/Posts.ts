import type { CollectionConfig } from "payload";

// Collection: Posts
//
// Used for news/articles pages, exposed on the front-end under `/actualites/<slug>`
// (see sitemap generation).
// Notes:
// - `publishedAt` can be used to control ordering and last-modified fallback.
// - As with Pages, `contentHTML` is currently the simplest rendering path.

export const Posts: CollectionConfig = {
    slug: "posts",
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
            name: "publishedAt",
            type: "date",
            required: false,
        },
        {
            name: "featuredImage",
            type: "relationship",
            relationTo: "media",
            required: false,
        },
        {
            name: "seo",
            type: "group",
            required: false,
            fields: [
                {
                    name: "title",
                    type: "text",
                    required: false,
                },
                {
                    name: "description",
                    type: "textarea",
                    required: false,
                },
                {
                    name: "ogImage",
                    type: "relationship",
                    relationTo: "media",
                    required: false,
                },
                {
                    name: "noIndex",
                    type: "checkbox",
                    required: false,
                    defaultValue: false,
                },
            ],
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
