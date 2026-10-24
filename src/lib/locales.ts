export type LocaleCode = "en" | "hi" | "de" | "fr" | "es" | "ja";

export type Locale = {
  code: LocaleCode;
  /** written in its own language, the way a reader looking for it would scan */
  label: string;
  /** the English exonym, so an English reader can still parse the row */
  english: string;
  region: string;
  available: boolean;
};

export const DEFAULT_LOCALE: LocaleCode = "en";

export const LOCALES: Locale[] = [
  { code: "en", label: "English", english: "English", region: "Global", available: true },
  { code: "hi", label: "हिन्दी", english: "Hindi", region: "India", available: false },
  { code: "de", label: "Deutsch", english: "German", region: "Germany", available: false },
  { code: "fr", label: "Français", english: "French", region: "France", available: false },
  { code: "es", label: "Español", english: "Spanish", region: "Spain", available: false },
  { code: "ja", label: "日本語", english: "Japanese", region: "Japan", available: false },
];

export const getLocale = (code: string): Locale =>
  LOCALES.find((l) => l.code === code) ??
  (LOCALES.find((l) => l.code === DEFAULT_LOCALE) as Locale);

export const STORAGE_KEY = "cyb-locale";
