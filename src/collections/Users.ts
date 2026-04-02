import type { CollectionConfig } from "payload";

// Collection: Users
//
// Enables authentication for the Payload admin UI.
// Notes:
// - Payload will add email/password fields automatically when `auth: true`.
// - Extend `fields` to add roles/permissions/profile info if needed.

export const Users: CollectionConfig = {
    slug: "users",
    admin: {
        useAsTitle: "email",
    },
    auth: true,
    fields: [
        // Email added by default
        // Add more fields as needed
    ],
};
