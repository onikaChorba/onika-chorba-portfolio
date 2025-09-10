import App from './App.vue'
import './assets/reset.css';
import './assets/main.scss';
import router from './router';
import { createApp } from 'vue';
// @ts-ignore
import { setupI18n } from "./locales";

async function bootstrap() {
  const i18n = await setupI18n("en");

  const app = createApp(App);
  app.use(router);
  app.use(i18n);

  app.mount("#app");
}

bootstrap();
