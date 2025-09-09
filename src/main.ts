import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
// @ts-ignore
import { setupI18n } from "./locales";
import './assets/reset.css';
import './assets/main.scss';

async function bootstrap() {
  const i18n = await setupI18n("uk");

  const app = createApp(App);
  app.use(router);
  app.use(i18n);

  app.mount("#app");
}

bootstrap();
