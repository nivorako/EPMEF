import type { MediaGalleryBlockData } from "./RenderBlocks";

// MediaGallery — Responsive grid of images with optional captions.

export function MediaGallerySection({
    data,
}: {
    data: MediaGalleryBlockData;
}) {
    return (
        <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {data.title && (
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-10">
                        {data.title}
                    </h2>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.items.map((item, idx) => (
                        <figure
                            key={idx}
                            className="group relative aspect-square rounded-xl overflow-hidden"
                        >
                            <img
                                src={item.media?.url || ""}
                                alt={item.media?.alt || item.caption || ""}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.caption && (
                                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.caption}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
