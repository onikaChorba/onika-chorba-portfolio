<template>
  <header class="header" :class="{ hidden: isHidden }">
    <div class="header__logo logo" @click="scrollToSection('#home')">
      <p class="logo__text"><span class="logo__text2">Onika</span> Chorba</p>
    </div>

    <button class="burger" @click="toggleMenu">
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
    </button>

    <nav class="header__nav" :class="{ open: isMenuOpen }">
      <ul class="header-navs">
        <li v-for="(el, index) in headerNav" :key="index">
          <router-link v-if="props.isAdmin && route.path.startsWith('/admin')" :to="el.to" class="header-nav"
            :class="{ 'header-nav-active': route.path === el.to }">
            {{ t(el.textKey) }}
          </router-link>

          <a v-else :href="el.to" class="header-nav" :class="{ 'header-nav-active': activeSection === el.to }"
            @click.prevent="scrollToSection(el.to)">
            {{ t(el.textKey) }}
          </a>
        </li>
      </ul>

      <div class="btn-wrapper-mobile">
        <button class="btn" @click.prevent="scrollToSection('#contact')" v-if="!props.isAdmin">
          {{ t('header.contactBtn') }}
        </button>
        <button class="btn" @click.prevent="logout" v-else>
          {{ t('header.exitBtn') }}
        </button>
        <button class="btn-switch-theme" @click="toggleTheme">
          <img :src="isDark ? sunIcon : moonIcon" />
        </button>
        <button @click="switchLanguage" class="btn-switch-lang">
          {{ currentLocale === 'uk' ? 'EN' : 'UA' }}
        </button>
      </div>
    </nav>

    <div class="btn-wrapper" v-if="!isMobile">
      <button class="btn" @click.prevent="scrollToSection('#contact')" v-if="!props.isAdmin">
        {{ t('header.contactBtn') }}
      </button>
      <button class="btn" @click.prevent="logout" v-else>
        {{ t('header.exitBtn') }}
      </button>
      <button class="btn-switch-theme" @click="toggleTheme">
        <img :src="isDark ? sunIcon : moonIcon" />
      </button>
      <button @click="switchLanguage" class="btn-switch-lang">
        {{ currentLocale === 'uk' ? 'EN' : 'UA' }}
      </button>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import sunIcon from '../../assets/icons/sun.svg';
import moonIcon from '../../assets/icons/moon.svg';
import { loadLocaleMessages } from '../../locales';

const props = defineProps<{ isAdmin: boolean }>();
const route = useRoute();

const { locale, t, setLocaleMessage } = useI18n({ useScope: 'global' });
const currentLocale = ref(locale.value);

const isDark = ref(true);
const isMenuOpen = ref(false);
const isMobile = ref(window.innerWidth <= 768);
const isHidden = ref(false);
let lastScroll = 0;

const headerNav = computed(() =>
  props.isAdmin && route.path.startsWith('/admin')
    ? [
      { textKey: 'header.mainInfo', to: '/admin' },
      { textKey: 'header.adminProjects', to: '/admin/projects' },
    ]
    : [
      { textKey: 'header.home', to: '#home' },
      { textKey: 'header.about', to: '#about' },
      { textKey: 'header.projects', to: '#projects' },
    ]
);

const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);
const applyTheme = (dark: boolean) => {
  document.body.classList.toggle('dark', dark);
  document.body.classList.toggle('light', !dark);
};
const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

const scrollToSection = (id: string) => {
  const section = document.querySelector(id);
  if (section) {
    const offset = 64;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    isMenuOpen.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('isAuthenticated');
  window.location.href = '/admin';
};

// зміна мови
const switchLanguage = async () => {
  const newLocale = locale.value === 'uk' ? 'en' : 'uk';
  const messages = await loadLocaleMessages(newLocale);

  // тут ми оновлюємо локалі через setLocaleMessage
  setLocaleMessage(newLocale, messages);

  // змінюємо поточну мову
  locale.value = newLocale;
};

const activeSection = ref('#home');

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  isDark.value = savedTheme ? savedTheme === 'dark' : true;
  applyTheme(isDark.value);

  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 768;
    if (!isMobile.value) isMenuOpen.value = false;
  });

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    isHidden.value = currentScroll > lastScroll && currentScroll > 100;
    lastScroll = currentScroll;
  });
});
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 20px;
  box-shadow: var(--box-shadow);
  z-index: 1000;
  background: var(--color-bg);
  backdrop-filter: blur(10px);
  transition: transform 0.4s ease, background 0.4s ease;

  &.hidden {
    transform: translateY(-100%);
  }

  &__logo {
    color: var(--color-text);
    font-size: 24px;
    font-family: "Oleo Script", system-ui;
    cursor: pointer;
    animation: fadeSlideIn 0.6s ease forwards;
  }
}

.header-navs {
  display: flex;
  list-style: none;
  gap: 32px;
  padding: 0;
  margin: 0;
  animation: fadeSlideIn 0.8s ease forwards;
}

.header-nav {
  padding: 6px 16px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  color: var(--color-text);
  transition: 0.3s, transform 0.3s;

  &:hover {
    color: var(--color-primary);
    transform: scale(1.1);
    box-shadow: var(--box-shadow);
    background: rgba(0, 0, 0, 0.05);
  }
}

.header-nav-active {
  color: var(--color-primary);
  font-weight: 600;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0%;
    height: 2px;
    background: var(--color-primary);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
}

.btn-wrapper,
.btn-wrapper-mobile {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.btn {
  border: none;
  padding: 10px 20px;
  font-family: 'Montserat';
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-btn-hover-bg));
  color: white;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
}

.btn-switch-theme,
.btn-switch-lang {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  font-weight: 700;
}

.btn-switch-theme img {
  width: 30px;
  height: 30px;
}

.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  background: none;
  border: none;

  span {
    display: block;
    width: 25px;
    height: 3px;
    background: var(--color-text);
    transition: 0.3s;
  }

  span.open:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  span.open:nth-child(2) {
    opacity: 0;
  }

  span.open:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
  }
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 32px;
  transition: max-height 0.3s ease;
}

.header__nav.open {
  max-height: 500px;
}

.btn-wrapper-mobile {
  display: none;
}

@media (max-width: 768px) {
  .burger {
    display: flex;
  }

  .header__nav {
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    flex-direction: column;
    background: var(--color-bg);
    overflow: hidden;
    max-height: 0;
  }

  .header-navs {
    flex-direction: column;
    gap: 10px;
    padding: 10px 0;
  }

  .btn-wrapper {
    display: none;
  }

  .btn-wrapper-mobile {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }
}

@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
