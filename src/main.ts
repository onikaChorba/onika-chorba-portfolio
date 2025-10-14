import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/reset.css";
import "./assets/main.scss";
import { createI18n } from "vue-i18n";
import { loadLocaleMessages } from "./locales";

async function bootstrap() {
  const defaultLocale = "uk"; // або дістань із localStorage

  const messages = {
    uk: await loadLocaleMessages('uk'),
    en: await loadLocaleMessages('en'),
  };

  // 🟢 2. Створюємо i18n після завантаження
  const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'en',
    messages,
  });

  // 🟢 3. Тепер створюємо застосунок
  const app = createApp(App);
  app.use(router);
  app.use(i18n);
  app.mount("#app");
}

bootstrap();
