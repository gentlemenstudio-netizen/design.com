export interface GoogleFont {
    label: string;
    family: string;
    weights: string[];
}

export const GOOGLE_FONTS: GoogleFont[] = [
    {
        label: "Inter",
        family: "Inter",
        weights: ["400", "500", "600", "700"],
    },
    {
        label: "Poppins",
        family: "Poppins",
        weights: ["400", "500", "600", "700"],
    },
    {
        label: "Montserrat",
        family: "Montserrat",
        weights: ["400", "600", "700"],
    },
    {
        label: "Playfair Display",
        family: "Playfair Display",
        weights: ["400", "600", "700"],
    },
];
