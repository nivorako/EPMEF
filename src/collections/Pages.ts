import type { CollectionConfig } from "payload";
import { HeroBlock } from "../blocks/HeroBlock";
import { EditorialBlock } from "../blocks/EditorialBlock";
import { AboutBlock } from "../blocks/AboutBlock";
import { MediaGalleryBlock } from "../blocks/MediaGalleryBlock";
import { CommunityStructureBlock } from "../blocks/CommunityStructureBlock";

// Collection: Pages
//
// Used for site pages rendered by Next.js ("home" and `/<slug>`).
// Notes:
// - `slug` is unique and used for routing.
// - `layout` is a blocks field that allows editors to compose pages
//   from reusable sections (Hero, Editorial, About, MediaGallery, CommunityStructure).
// - Legacy fields `contentHTML` and `content` are kept for backward compatibility
//   with imported WordPress content.

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
            admin: { position: "sidebar" },
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
            type: "upload",
            relationTo: "media",
            required: false,
        },
        {
            type: "tabs",
            tabs: [
                {
                    label: "Mise en page",
                    fields: [
                        {
                            name: "layout",
                            label: "Sections de la page",
                            type: "blocks",
                            required: false,
                            blocks: [
                                HeroBlock,
                                EditorialBlock,
                                AboutBlock,
                                MediaGalleryBlock,
                                CommunityStructureBlock,
                            ],
                        },
                    ],
                },
                {
                    label: "Contenu legacy",
                    fields: [
                        {
                            name: "contentHTML",
                            type: "textarea",
                            maxLength: 200000,
                            required: false,
                            admin: {
                                description:
                                    "Contenu HTML importé de WordPress. Utilisez plutôt l'onglet Mise en page pour les nouvelles pages.",
                            },
                        },
                        {
                            name: "content",
                            type: "richText",
                            required: false,
                        },
                    ],
                },
                {
                    label: "SEO",
                    fields: [
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
                                    type: "upload",
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
                    ],
                },
            ],
        },
    ],
};
