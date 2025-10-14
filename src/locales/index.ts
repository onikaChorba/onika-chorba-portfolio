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
  // ✅ 1. Спочатку чекаємо на переклади
  const loadedMessages = await loadLocaleMessages(initialLocale);

  // ✅ 2. Тільки тепер створюємо i18n
  const i18n = createI18n({
    legacy: false,
    locale: initialLocale,
    fallbackLocale: "en",
    messages: {
      [initialLocale]: loadedMessages,
    },
  });

  return i18n;
};
