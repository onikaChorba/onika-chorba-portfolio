<template>
  <header class="header">
    <div class="header__logo logo">
      <p class="logo__text">
        <span class="logo__text2">Onika</span> Chorba
      </p>
    </div>

    <nav class="header__nav">
      <ul class="header-navs">
        <li v-for="(el, index) in headerNav" :key="index">
          <a :href="el.to" class="header-nav" :class="{ 'header-nav-active': activeSection === el.to }"
            @click.prevent="scrollToSection(el.to)">
            {{ t(el.text) }}
          </a>
        </li>
      </ul>
    </nav>

    <div class="btn-wrapper">
      <button class="btn" @click.prevent="scrollToSection('#contact')">
        {{ t('header.contactBtn') }}
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

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import sunIcon from '../../assets/icons/sun.svg';
import moonIcon from '../../assets/icons/moon.svg';
import { loadLocaleMessages } from '../../locales';

const { t, locale } = useI18n();
const currentLocale = ref(locale.value);

const headerNav = ref([
  { text: 'header.home', to: "#home" },
  { text: 'header.about', to: "#about" },
  { text: 'header.projects', to: "#projects" },
]);

const isDark = ref(false);
const activeSection = ref('#home');

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  }
};

const switchLanguage = async () => {
  const newLocale = currentLocale.value === 'uk' ? 'en' : 'uk';
  await loadLocaleMessages(newLocale);
  locale.value = newLocale;
  currentLocale.value = newLocale;
};

// Плавний скрол до секції
const scrollToSection = (id) => {
  const section = document.querySelector(id);
  if (section) {
    const offset = 64; // висота header
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

// Підсвітка активної секції при скролі
const onScroll = () => {
  for (const nav of headerNav.value) {
    const section = document.querySelector(nav.to);
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 64 && rect.bottom > 64) {
        activeSection.value = nav.to;
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});

document.body.classList.add('dark');
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  height: 64px;
  background: var(--color-bg);
  padding: 0 20px;
  font-family: 'Montserat';
  font-weight: 400;
  font-size: 16px;
  color: var(--color-text);
  z-index: 1000;

  &__logo {
    font-size: 22px;
    font-family: "Oleo Script", system-ui;
  }
}

.logo {
  &__text {
    color: var(--color-text);
  }

  &__text2 {
    color: var(--color-primary);
  }
}

.header-navs {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 32px;
}

.header-nav {
  color: var(--color-text);
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 6px;
  transition: color 0.3s;
  cursor: pointer;

  &:hover {
    color: var(--color-primary);
  }
}

.header-nav-active {
  color: var(--color-primary);
  font-weight: 600;
}

.btn {
  border: 1.5px solid var(--color-btn-border);
  color: var(--color-btn-border);
  background: transparent;
  border-radius: 6px;
  padding: 6px 16px;
  cursor: pointer;
  font-family: "Montserat";
  font-weight: 400;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: var(--color-btn-hover-bg);
    color: var(--color-btn-hover-text);
  }
}

.btn-wrapper {
  display: flex;
  gap: 20px;
  align-items: center;
}

.btn-switch-theme,
.btn-switch-lang {
  cursor: pointer;
  border: none;
  background: none;
}

.btn-switch-theme {
  width: 30px;
  height: 30px;

  img {
    width: 100%;
    height: 100%;
  }
}

.btn-switch-lang {
  color: var(--color-text);
  font-weight: 600;
}
</style>
