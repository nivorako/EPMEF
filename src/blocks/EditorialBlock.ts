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
    fields: [],
};
