import configPromise from "@payload-config";
import { getPayload } from "payload";

// Example Next.js Route Handler.
//
// Quick read:
// - Init Payload (so this route can query collections if needed).
// - Return a JSON response.

export const GET = async (request: Request) => {
    // --- Init (Payload) ---
    const payload = await getPayload({
        config: configPromise,
    });

    // `payload` is not used yet; keep it here as a template for future queries.

    // --- Response ---
    return Response.json({
        message: "This is an example of a custom route.",
    });
};
