import type { Locale } from "@/lib/i18n/locales";

import es, { type CvDict } from "./es";
import en from "./en";
import pt from "./pt";
import de from "./de";
import fr from "./fr";
import ja from "./ja";
import zh from "./zh";

export const CV_DICTIONARIES: Record<Locale, CvDict> = { es, en, pt, de, fr, ja, zh };
export type { CvDict };
