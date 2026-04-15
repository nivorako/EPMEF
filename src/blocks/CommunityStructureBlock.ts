import type { Block } from "payload";

// CommunityStructureBlock — Displays the association's community groups.
//
// Groups can represent: Pasteur, Bureau, Diacres, Sections, etc.
// Each group has a name and a list of members with optional role and photo.

export const CommunityStructureBlock: Block = {
    slug: "communityStructure",
    labels: {
        singular: "Structure Communautaire",
        plural: "Structures Communautaires",
    },
    fields: [
        {
            name: "title",
            label: "Titre de section",
            type: "text",
            required: false,
            defaultValue: "Notre communauté",
        },
        {
            name: "groups",
            label: "Groupes",
            type: "array",
            required: true,
            minRows: 1,
            fields: [
                {
                    name: "groupName",
                    label: "Nom du groupe",
                    type: "text",
                    required: true,
                },
                {
                    name: "description",
                    label: "Description du groupe",
                    type: "textarea",
                    required: false,
                },
                {
                    name: "members",
                    label: "Membres",
                    type: "array",
                    required: false,
                    fields: [
                        {
                            name: "name",
                            label: "Nom",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "role",
                            label: "Fonction / Rôle",
                            type: "text",
                            required: false,
                        },
                        {
                            name: "photo",
                            label: "Photo",
                            type: "upload",
                            relationTo: "media",
                            required: false,
                        },
                    ],
                },
            ],
        },
    ],
};
