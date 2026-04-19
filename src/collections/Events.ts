import type { CollectionConfig } from "payload";

import { LiturgieSectionBlock } from "../blocks/LiturgieSectionBlock";
import { LiturgieChantBlock } from "../blocks/LiturgieChantBlock";
import { LiturgiePriereBlock } from "../blocks/LiturgiePriereBlock";
import { LiturgieCitationBlock } from "../blocks/LiturgieCitationBlock";

// Collection: Events
//
// Stores upcoming and past events for the association.
// - `eventType` distinguishes worship services ("culte") from other events.
// - `address` is the human-readable venue address.
// - `location` holds optional GPS coordinates for a Google Maps embed.

export const Events: CollectionConfig = {
    slug: "events",
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "date", "eventType"],
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
            name: "slug",
            label: "Slug",
            type: "text",
            unique: true,
            index: true,
            required: false,
            admin: { position: "sidebar" },
        },
        {
            name: "title",
            label: "Titre",
            type: "text",
            required: true,
        },
        {
            name: "date",
            label: "Date",
            type: "date",
            required: true,
            admin: {
                date: {
                    displayFormat: "dd/MM/yyyy",
                },
            },
        },
        {
            name: "description",
            label: "Description",
            type: "richText",
            required: false,
        },
        {
            name: "contentHTML",
            label: "Contenu HTML (import WP)",
            type: "textarea",
            maxLength: 200000,
            required: false,
            admin: {
                description:
                    "Contenu HTML importé de WordPress. Utilisez le champ Description (richText) pour les nouveaux événements.",
            },
        },
        {
            name: "image",
            label: "Image",
            type: "upload",
            relationTo: "media",
            required: false,
        },
        {
            name: "eventType",
            label: "Type d'événement",
            type: "select",
            required: true,
            defaultValue: "other",
            options: [
                { label: "Culte", value: "culte" },
                { label: "Autre", value: "other" },
            ],
        },
        {
            name: "liturgie",
            label: "Liturgie (programme du culte)",
            type: "blocks",
            required: false,
            admin: {
                condition: (_, siblingData) =>
                    siblingData?.eventType === "culte",
            },
            blocks: [
                LiturgieSectionBlock,
                LiturgieChantBlock,
                LiturgiePriereBlock,
                LiturgieCitationBlock,
            ],
        },
        {
            name: "address",
            label: "Adresse",
            type: "text",
            required: false,
        },
        {
            name: "location",
            label: "Localisation (Google Maps)",
            type: "group",
            fields: [
                {
                    name: "lat",
                    label: "Latitude",
                    type: "number",
                    required: false,
                },
                {
                    name: "lng",
                    label: "Longitude",
                    type: "number",
                    required: false,
                },
            ],
        },
    ],
};
