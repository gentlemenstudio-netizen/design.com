import {
    Inter,
    Poppins,
    Montserrat,
    Playfair_Display,
    Raleway,
    Bebas_Neue,
    Oswald,
    Manrope,
    Space_Grotesk,
    DM_Sans,
    League_Spartan,
    Syne,
    Fraunces,
    Work_Sans,
    Baloo_Tamma_2,
    Roboto,
    Russo_One,
    Coiny,
    Gugi,
    Creepster,
    Sarpanch,
    Outfit,
    IBM_Plex_Sans,
    Lora,
    Fira_Sans,


} from "next/font/google";

/* =========================
   FONT LOADERS (TOP LEVEL)
========================= */

export const interFont = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const poppinsFont = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const montserratFont = Montserrat({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-montserrat",
});

export const playfairFont = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-playfair",
});

export const ralewayFont = Raleway({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-raleway",
});

export const bebasFont = Bebas_Neue({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-bebas",
});

export const oswaldFont = Oswald({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-oswald",
});

export const manropeFont = Manrope({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-manrope",
});

export const spaceGroteskFont = Space_Grotesk({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-space",
});

export const dmSansFont = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-dm",
});

export const leagueSpartanFont = League_Spartan({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-spartan",
});

export const syneFont = Syne({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-syne",
});

export const frauncesFont = Fraunces({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-fraunces",
});

export const workSansFont = Work_Sans({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-worksans",
});
export const balooTamma2Font = Baloo_Tamma_2({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-balootamma2",
});
export const robotoFont = Roboto({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-roboto",
});
export const russoOneFont = Russo_One({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-russoone",
});
export const coinyFont = Coiny({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-coiny",
});
export const gugiFont = Gugi({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-gugi",
});
export const creepsterFont = Creepster({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-creepster",
});
export const sarpanchFont = Sarpanch({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-sarpanch",
});
export const outfitFont = Outfit({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-outfit",
});
export const ibmPlexSansFont = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-ibmplexsans",
});
export const loraFont = Lora({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-lora",
});
export const firaSansFont = Fira_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-firasans",
});


/* =========================
   FONT REGISTRY (SAFE)
========================= */

export const BRAND_FONTS = [
    { key: "inter", label: "Inter", font: interFont },
    { key: "poppins", label: "Poppins", font: poppinsFont },
    { key: "montserrat", label: "Montserrat", font: montserratFont },
    { key: "playfair", label: "Playfair Display", font: playfairFont },
    { key: "raleway", label: "Raleway", font: ralewayFont },
    { key: "bebas", label: "Bebas Neue", font: bebasFont },
    { key: "oswald", label: "Oswald", font: oswaldFont },
    { key: "manrope", label: "Manrope", font: manropeFont },
    { key: "space", label: "Space Grotesk", font: spaceGroteskFont },
    { key: "dm", label: "DM Sans", font: dmSansFont },
    { key: "spartan", label: "League Spartan", font: leagueSpartanFont },
    { key: "syne", label: "Syne", font: syneFont },
    { key: "fraunces", label: "Fraunces", font: frauncesFont },
    { key: "worksans", label: "Work Sans", font: workSansFont },
    { key: "balootamma2", label: "Baloo Tamma 2", font: balooTamma2Font },
    { key: "roboto", label: "Roboto", font: robotoFont },
    { key: "russoone", label: "Russo One", font: russoOneFont },
    { key: "coiny", label: "Coiny", font: coinyFont },
    { key: "gugi", label: "Gugi", font: gugiFont },
    { key: "creepster", label: "Creepster", font: creepsterFont },
    { key: "sarpanch", label: "Sarpanch", font: sarpanchFont },
    { key: "outfit", label: "Outfit", font: outfitFont },
    { key: "ibmplexsans", label: "IBM Plex Sans", font: ibmPlexSansFont },
    { key: "lora", label: "Lora", font: loraFont },
    { key: "firasans", label: "Fira Sans", font: firaSansFont },
] as const;

/* =========================
   HELPERS
========================= */

export const FONT_VARIABLES = BRAND_FONTS.map(
    (f) => f.font.variable
).join(" ");

export const FONT_FAMILY_OPTIONS = BRAND_FONTS.map((f) => ({
    label: f.label,
    value: f.label,
    family: f.font.style.fontFamily,
}));
