"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = {
    label: string;
    href: string;
    isExternal: boolean;
};

export default function MobileNav({ items }: { items: NavItem[] }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Burger button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative z-50 flex flex-col items-center justify-center w-10 h-10 gap-1.5 md:hidden"
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
                <span
                    className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                        open ? "translate-y-2 rotate-45" : ""
                    }`}
                />
                <span
                    className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                        open ? "opacity-0" : ""
                    }`}
                />
                <span
                    className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                        open ? "-translate-y-2 -rotate-45" : ""
                    }`}
                />
            </button>

            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <div
                className={`fixed top-0 right-0 z-40 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <nav className="flex flex-col gap-1 pt-20 px-6">
                    {items.map((item, idx) =>
                        item.isExternal ? (
                            <a
                                key={idx}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setOpen(false)}
                                className="py-3 px-4 text-lg font-medium text-foreground hover:bg-primary/5 rounded-lg transition-colors"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                key={idx}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="py-3 px-4 text-lg font-medium text-foreground hover:bg-primary/5 rounded-lg transition-colors"
                            >
                                {item.label}
                            </Link>
                        ),
                    )}
                </nav>
            </div>
        </>
    );
}
