import type { MetadataRoute } from "next";

// Robots.txt generation for Next.js metadata routes.
//
// Notes:
// - Uses `NEXT_PUBLIC_SITE_URL` as the canonical base URL for the sitemap link.
// - The current policy allows all user agents to crawl all routes.

export default function robots(): MetadataRoute.Robots {
    // --- Config ---
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // --- Output ---
    return {
        rules: {
            userAgent: "*",
            disallow: "/",
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
