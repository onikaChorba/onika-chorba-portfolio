<template>
  <header class="header">
    <div class="header__logo logo">
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
          <a :href="el.to" class="header-nav" :class="{ 'header-nav-active': activeSection === el.to }"
            @click.prevent="scrollToSection(el.to)">
            {{ t(el.text) }}
          </a>
        </li>
      </ul>

      <div class="btn-wrapper-mobile">
        <button class="btn" @click.prevent="scrollToSection('#contact')" v-if="!props.isAdmin">
          {{ t('header.contactBtn') }}
        </button>
        <button class="btn" @click.prevent="logout" v-else>Exit</button>
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
      <button class="btn" @click.prevent="logout" v-else>Exit</button>
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
const { t, locale } = useI18n();
const currentLocale = ref(locale.value);
const route = useRoute();

const isDark = ref(false);
const isMenuOpen = ref(false);
const isMobile = ref(window.innerWidth <= 768);

const headerNav = computed(() =>
  props.isAdmin && route.path.startsWith("/admin")
    ? [{ text: 'header.projects', to: '#projects' }]
    : [
      { text: 'header.home', to: '#home' },
      { text: 'header.about', to: '#about' },
      { text: 'header.projects', to: '#projects' },
    ]
);

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;

const applyTheme = (dark: boolean) => {
  document.body.classList.toggle('dark', dark);
  document.body.classList.toggle('light', !dark);
};
const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  isDark.value = savedTheme ? savedTheme === 'dark' : true;
  applyTheme(isDark.value);

  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 768;
    if (!isMobile.value) isMenuOpen.value = false;
  });
});

const switchLanguage = async () => {
  const newLocale = currentLocale.value === 'uk' ? 'en' : 'uk';
  await loadLocaleMessages(newLocale);
  locale.value = newLocale;
  currentLocale.value = newLocale;
};

const activeSection = ref('#home');
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
  background: var(--color-bg);
  z-index: 1000;

  &__logo {
    color: var(--color-text);
    font-size: 22px;
    font-family: "Oleo Script", system-ui;
  }
}

.header-navs {
  display: flex;
  list-style: none;
  gap: 32px;
  padding: 0;
  margin: 0;
}

.header-nav {
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  color: var(--color-text);
  transition: 0.3s;

  &:hover {
    color: var(--color-primary);
  }
}

.header-nav-active {
  color: var(--color-primary);
  font-weight: 600;
}

.btn-wrapper,
.btn-wrapper-mobile {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.btn {
  border: 1.5px solid var(--color-btn-border);
  color: var(--color-btn-border);
  background: transparent;
  border-radius: 6px;
  padding: 6px 16px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Montserat';

  &:hover {
    background: var(--color-btn-hover-bg);
    color: white;
    border-color: var(--color-btn-hover-bg);
  }
}

.btn-switch-theme,
.btn-switch-lang {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
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
</style>
