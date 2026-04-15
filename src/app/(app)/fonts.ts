import { Montserrat, Inter } from "next/font/google";

export const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-heading",
});

export const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
    variable: "--font-body",
});
