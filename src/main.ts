import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/reset.css';
import './assets/main.scss';
import { createI18n } from 'vue-i18n';
import { loadLocaleMessages } from './locales';

async function bootstrap() {
  const defaultLocale = 'en';

  const messages = {
    uk: await loadLocaleMessages('uk'),
    en: await loadLocaleMessages('en'),
  };

  const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'en',
    messages,
  });

  const app = createApp(App);
  app.use(router);
  app.use(i18n);

  app.mount('#app');
}

bootstrap();
