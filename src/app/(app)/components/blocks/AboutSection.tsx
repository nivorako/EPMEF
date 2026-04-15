import type { AboutBlockData } from "./RenderBlocks";
import { RichText } from "./RichText";

// About — "Qui sommes-nous ?" section with optional side image.

export function AboutSection({ data }: { data: AboutBlockData }) {
    const hasImage = !!data.image?.url;

    return (
        <section className="py-16 sm:py-20 bg-stone-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    className={`grid gap-10 items-center ${
                        hasImage
                            ? "grid-cols-1 md:grid-cols-2"
                            : "grid-cols-1 max-w-3xl mx-auto"
                    }`}
                >
                    {/* Text column */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
                            {data.title}
                        </h2>
                        <div className="prose text-foreground/80 leading-relaxed">
                            <RichText content={data.content} />
                        </div>
                    </div>

                    {/* Image column */}
                    {hasImage && (
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                            <img
                                src={data.image!.url}
                                alt={data.image!.alt || ""}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
