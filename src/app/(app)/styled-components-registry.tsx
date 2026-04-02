"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

// styled-components SSR support for Next.js App Router.
//
// On the server, we collect generated styles in a `ServerStyleSheet` and then
// inject them into the HTML stream via `useServerInsertedHTML`.
// On the client, we simply render children without the StyleSheetManager.

export default function StyledComponentsRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

    useServerInsertedHTML(() => {
        const styles = styledComponentsStyleSheet.getStyleElement();
        styledComponentsStyleSheet.instance.clearTag();
        return <>{styles}</>;
    });

    if (typeof window !== "undefined") {
        return <>{children}</>;
    }

    return (
        <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
            {children}
        </StyleSheetManager>
    );
}
