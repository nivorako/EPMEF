import Link from "next/link";
import type { HeroBlockData } from "./RenderBlocks";

// Hero — Full-width banner with background image, title, subtitle, and CTAs.
// The `-mt-16` pulls the hero under the fixed header for an immersive effect.

export function HeroSection({ data }: { data: HeroBlockData }) {
    const bgUrl = data.backgroundImage?.url;

    return (
        <section className="relative -mt-16 h-[70vh] min-h-[420px] flex items-center justify-center overflow-hidden">
            {bgUrl ? (
                <img
                    src={bgUrl}
                    alt={data.backgroundImage?.alt || ""}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light" />
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-3xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
                    {data.title}
                </h1>
                {data.subtitle && (
                    <p className="mt-4 text-lg sm:text-xl text-white/80 max-w-xl mx-auto">
                        {data.subtitle}
                    </p>
                )}
                {data.ctas && data.ctas.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-4 justify-center">
                        {data.ctas.map((cta, idx) => {
                            const isOutline = cta.style === "outline";
                            return (
                                <Link
                                    key={idx}
                                    href={cta.link}
                                    className={
                                        isOutline
                                            ? "px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-colors"
                                            : "px-6 py-3 bg-accent hover:bg-accent-light text-primary font-semibold rounded-lg transition-colors"
                                    }
                                >
                                    {cta.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
