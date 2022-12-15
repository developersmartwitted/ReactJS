import en from "./en.json";
import { I18nContext, createI18nContext, useI18n } from "@solid-primitives/i18n";

type Translate = <K extends string = keyof typeof en>(
  key: K,
  params?: Record<string, string>,
  defaultValue?: string
) => string;

const TranslationContextProvider = I18nContext.Provider;
const createTranslationContext = createI18nContext;
const dictionary = { en };
const useTranslation = (): Translate => {
  const [translate] = useI18n();

  return (key, params, defaultValue) => {
    return translate(key, params, defaultValue);
  };
};

export { TranslationContextProvider, createTranslationContext, dictionary, useTranslation };
