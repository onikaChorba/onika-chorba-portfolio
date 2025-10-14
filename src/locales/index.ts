import { createI18n } from "vue-i18n";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const messages: Record<string, Record<string, string>> = {};

export const loadLocaleMessages = async (locale: string) => {
  if (!messages[locale]) {
    const ref = doc(db, 'locales', locale);
    const snap = await getDoc(ref);
    messages[locale] = snap.exists() ? snap.data() : {};
  }
  return messages[locale];
};

export const setupI18n = async (initialLocale = "uk") => {
  const i18n = createI18n({
    legacy: false,
    locale: initialLocale,
    fallbackLocale: "en",
    messages,
  });

  const loadedMessages = await loadLocaleMessages(initialLocale);
  i18n.global.setLocaleMessage(initialLocale, loadedMessages);

  return i18n;
};
