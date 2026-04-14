import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
    slug: "site-settings",
    access: {
        read: () => true,
    },
    fields: [
        {
            name: "headerMenu",
            type: "array",
            required: false,
            fields: [
                {
                    name: "label",
                    type: "text",
                    required: true,
                },
                {
                    name: "type",
                    type: "select",
                    required: true,
                    defaultValue: "page",
                    options: [
                        { label: "Page", value: "page" },
                        { label: "Post", value: "post" },
                        { label: "External", value: "external" },
                    ],
                },
                {
                    name: "page",
                    type: "relationship",
                    relationTo: "pages" as never,
                    required: false,
                    admin: {
                        condition: (_, siblingData) =>
                            siblingData?.type === "page",
                    },
                },
                {
                    name: "post",
                    type: "relationship",
                    relationTo: "posts" as never,
                    required: false,
                    admin: {
                        condition: (_, siblingData) =>
                            siblingData?.type === "post",
                    },
                },
                {
                    name: "url",
                    type: "text",
                    required: false,
                    admin: {
                        condition: (_, siblingData) =>
                            siblingData?.type === "external",
                    },
                },
            ],
        },
        {
            name: "footerMenu",
            type: "array",
            required: false,
            fields: [
                {
                    name: "label",
                    type: "text",
                    required: true,
                },
                {
                    name: "type",
                    type: "select",
                    required: true,
                    defaultValue: "page",
                    options: [
                        { label: "Page", value: "page" },
                        { label: "Post", value: "post" },
                        { label: "External", value: "external" },
                    ],
                },
                {
                    name: "page",
                    type: "relationship",
                    relationTo: "pages" as never,
                    required: false,
                    admin: {
                        condition: (_, siblingData) =>
                            siblingData?.type === "page",
                    },
                },
                {
                    name: "post",
                    type: "relationship",
                    relationTo: "posts" as never,
                    required: false,
                    admin: {
                        condition: (_, siblingData) =>
                            siblingData?.type === "post",
                    },
                },
                {
                    name: "url",
                    type: "text",
                    required: false,
                    admin: {
                        condition: (_, siblingData) =>
                            siblingData?.type === "external",
                    },
                },
            ],
        },
        {
            name: "siteName",
            type: "text",
            required: false,
            defaultValue: "EPMEF",
        },
        {
            name: "defaultSEO",
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
                    relationTo: "media" as never,
                    required: false,
                },
            ],
        },
    ],
};
