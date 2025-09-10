import { createI18n } from "vue-i18n";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const messages: Record<string, Record<string, string>> = {};

export const loadLocaleMessages = async (locale: string) => {
  const ref = doc(db, "locales", locale);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    messages[locale] = snap.data() as Record<string, string>;
  } else {
    console.warn(`No translations found for ${locale}`);
  }

  return messages;
};

export const setupI18n = async (initialLocale: string = "uk") => {
  await loadLocaleMessages(initialLocale);

  return createI18n({
    legacy: false,
    locale: initialLocale,
    fallbackLocale: "en",
    messages,
  });
};
