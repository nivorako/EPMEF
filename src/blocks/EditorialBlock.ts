import type { Block } from "payload";

// EditorialBlock — Highlights the next upcoming event.
//
// Displays event title, date, short description, and an optional CTA button
// (e.g. "Rejoindre le culte").

export const EditorialBlock: Block = {
    slug: "editorial",
    labels: { singular: "Éditorial / Événement", plural: "Éditoriaux" },
    fields: [
        {
            name: "heading",
            label: "Titre de section",
            type: "text",
            required: false,
            defaultValue: "Prochain événement",
        },
        {
            name: "eventTitle",
            label: "Titre de l'événement",
            type: "text",
            required: true,
        },
        {
            name: "eventDate",
            label: "Date de l'événement",
            type: "date",
            required: true,
            admin: {
                date: {
                    displayFormat: "dd/MM/yyyy",
                },
            },
        },
        {
            name: "eventDescription",
            label: "Description courte",
            type: "textarea",
            required: false,
        },
        {
            name: "buttonLabel",
            label: "Texte du bouton",
            type: "text",
            required: false,
        },
        {
            name: "buttonLink",
            label: "Lien du bouton",
            type: "text",
            required: false,
            admin: {
                condition: (_, siblingData) => !!siblingData?.buttonLabel,
            },
        },
    ],
};
