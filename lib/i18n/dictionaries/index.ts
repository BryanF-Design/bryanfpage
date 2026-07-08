import type { Locale } from "../locales";
import type { Dictionary } from "./es";
import es from "./es";
import en from "./en";
import pt from "./pt";
import de from "./de";
import fr from "./fr";
import ja from "./ja";
import zh from "./zh";

export const DICTIONARIES: Record<Locale, Dictionary> = {
  es: es as unknown as Dictionary,
  en,
  pt,
  de,
  fr,
  ja,
  zh,
};
export type { Dictionary };
