import { createI18n } from "vue-i18n";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const messages: Record<string, Record<string, string>> = {};

export const loadLocaleMessages = async (locale: string) => {
  if (!messages[locale]) {
    const ref = doc(db, 'locales', locale);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      messages[locale] = snap.data() as Record<string, string>;
    } else {
      alert(`⚠️ No translations found for "${locale}"`);
    }
  } catch (e) {
    alert("Error loading locale messages:", e);
  }
  return messages[locale];
};

export const setupI18n = async (initialLocale = "uk") => {
  const loadedMessages = await loadLocaleMessages(initialLocale);

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
