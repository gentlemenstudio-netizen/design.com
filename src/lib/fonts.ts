export interface GoogleFont {
    label: string;
    family: string;
    weights: string[];
    category: "modern" | "serif" | "display" | "condensed";
}

/* =====================
   Best Logo Fonts
===================== */

export const GOOGLE_FONTS: GoogleFont[] = [
    // 🔹 Modern / Clean (most logos)
    {
        label: "Poppins",
        family: "Poppins",
        weights: ["400", "500", "600", "700"],
        category: "modern",
    },
    {
        label: "Montserrat",
        family: "Montserrat",
        weights: ["400", "600", "700"],
        category: "modern",
    },
    {
        label: "Raleway",
        family: "Raleway",
        weights: ["400", "600", "700"],
        category: "modern",
    },

    // 🔹 Serif / Elegant (luxury logos)
    {
        label: "Playfair Display",
        family: "Playfair Display",
        weights: ["400", "600", "700"],
        category: "serif",
    },

    // 🔹 Display / Bold branding
    {
        label: "Bebas Neue",
        family: "Bebas Neue",
        weights: ["400"],
        category: "display",
    },

    // 🔹 Condensed / Strong identity
    {
        label: "Oswald",
        family: "Oswald",
        weights: ["400", "600", "700"],
        category: "condensed",
    },
];
