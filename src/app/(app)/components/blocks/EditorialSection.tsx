import Link from "next/link";
import type { EditorialBlockData } from "./RenderBlocks";

// Editorial — Highlights the next upcoming event with date, description, and optional CTA.

export function EditorialSection({ data }: { data: EditorialBlockData }) {
    const dateLabel = data.eventDate
        ? new Date(data.eventDate).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : null;

    return (
        <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                {data.heading && (
                    <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">
                        {data.heading}
                    </p>
                )}
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                    {data.eventTitle}
                </h2>
                {dateLabel && (
                    <p className="mt-3 text-lg text-muted">{dateLabel}</p>
                )}
                {data.eventDescription && (
                    <p className="mt-4 text-foreground/80 leading-relaxed max-w-2xl mx-auto">
                        {data.eventDescription}
                    </p>
                )}
                {data.buttonLabel && data.buttonLink && (
                    <div className="mt-8">
                        <Link
                            href={data.buttonLink}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
                        >
                            {data.buttonLabel}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
