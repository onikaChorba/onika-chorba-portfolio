import App from './App.vue';
import './assets/reset.css';
import './assets/main.scss';
import router from './router';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { loadLocaleMessages } from './locales';

async function bootstrap() {
  const defaultLocale = 'en';

  const messages = await loadLocaleMessages(defaultLocale);

  const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'en',
    messages: {
      [defaultLocale]: messages
    }
  });

  const app = createApp(App);
  app.use(router);
  app.use(i18n);

  app.mount('#app');
}

bootstrap();
