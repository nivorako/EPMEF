import type { Block } from "payload";

// EditorialBlock — Highlights the next upcoming event.
//
// References an event from the Events collection. Displays its title,
// date, description, and address. A "Litorjia" button is automatically
// shown when the event type is "culte".
//
// Optionally, editors can override the section heading and the CTA
// button label/link.

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
            name: "event",
            label: "Événement",
            type: "relationship",
            relationTo: "events" as never,
            required: true,
        },
        {
            name: "buttonLabelOverride",
            label: "Libellé du bouton (par défaut « Litorjia » si culte)",
            type: "text",
            required: false,
            admin: {
                description:
                    "Laissez vide pour le libellé par défaut. Le bouton ne s'affiche que si l'événement est un culte, sauf si vous remplissez ce champ.",
            },
        },
        {
            name: "buttonLinkOverride",
            label: "Lien du bouton (optionnel)",
            type: "text",
            required: false,
        },
    ],
};
