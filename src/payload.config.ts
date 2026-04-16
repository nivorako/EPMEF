import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Events } from "./collections/Events";
import { SiteSettings } from "./globals/SiteSettings";

// Payload CMS configuration.
//
// Key integrations:
// - MongoDB via `@payloadcms/db-mongodb` (requires `DATABASE_URL`).
// - Lexical rich text editor for admin content.
// - `sharp` for image processing in the Media collection.
//
// Environment expectations:
// - `PAYLOAD_SECRET` should be a strong random secret in production.
// - `DATABASE_URL` should point to the MongoDB instance used by Payload.

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
    // --- Admin UI ---
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },

    // --- Collections (content model) ---
    collections: [Users, Media, Pages, Posts, Events],

    globals: [SiteSettings],

    // --- Rich text ---
    editor: lexicalEditor(),

    // --- Security / secrets ---
    secret: process.env.PAYLOAD_SECRET || "",

    // --- Type generation ---
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },

    // --- Database ---
    db: mongooseAdapter({
        url: process.env.DATABASE_URL || "",
    }),
    sharp,

    // --- Plugins ---
    plugins: [],
});
