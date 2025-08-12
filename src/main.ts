import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import { messages } from './locales'
import './assets/reset.css';
import './assets/main.scss';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'uk',
  messages,
})

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')
