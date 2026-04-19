import Link from "next/link";
import type { EditorialBlockData } from "./RenderBlocks";
import type { EditorialEventData } from "./RenderBlocks";
import { RichText } from "./RichText";

// Editorial — Highlights the next upcoming event pulled from the Events collection.
// If eventType is "culte", a "Litorjia" CTA button is shown automatically.

export function EditorialSection({
    data: _data,
    event,
}: {
    data: EditorialBlockData;
    event?: EditorialEventData;
}) {
    if (!event) {
        return (
            <section className="py-16 sm:py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">
                        Notre prochain culte
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Prochain culte en préparation
                    </h2>
                </div>
            </section>
        );
    }

    const dateLabel = event.date
        ? new Date(event.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : null;

    const buttonLabel = "Litorjia";
    const buttonLink = event.slug ? `/events/${event.slug}/liturgie` : "#";

    return (
        <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">
                    Notre prochain culte
                </p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                    {event.title}
                </h2>
                {dateLabel && (
                    <p className="mt-3 text-lg text-muted">{dateLabel}</p>
                )}
                {event.address && (
                    <p className="mt-1 text-sm text-muted">
                        📍 {event.address}
                    </p>
                )}
                {!!event.description && (
                    <div className="mt-5 text-foreground/80 leading-relaxed max-w-2xl mx-auto prose">
                        <RichText content={event.description} />
                    </div>
                )}
                {buttonLabel && (
                    <div className="mt-8">
                        <Link
                            href={buttonLink}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
                        >
                            {buttonLabel}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
