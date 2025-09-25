бургерне меню<template>
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
      <button class="btn" @click.prevent="scrollToSection('#contact')" v-if="!props.isAdmin">
        {{ t('header.contactBtn') }}
      </button>
      <button class="btn" @click.prevent="logout" v-else>
        Exit
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import sunIcon from '../../assets/icons/sun.svg';
import { ref, onMounted, onUnmounted } from 'vue';
import moonIcon from '../../assets/icons/moon.svg';
import { loadLocaleMessages } from '../../locales';

const props = defineProps<{ isAdmin: boolean }>();
const { t, locale } = useI18n();
const currentLocale = ref(locale.value);

const route = useRoute();

const headerNav = computed(() =>
  props.isAdmin && route.path.startsWith("/admin")
    ? [{ text: 'header.projects', to: '#projects' }]
    : [
      { text: 'header.home', to: '#home' },
      { text: 'header.about', to: '#about' },
      { text: 'header.projects', to: '#projects' },
    ]
);
const isDark = ref(false);

const applyTheme = (dark: boolean) => {
  if (dark) {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    isDark.value = true;
  }
  applyTheme(isDark.value);
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
  }
};

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

const logout = () => {
  localStorage.removeItem('isAuthenticated');
  window.location.href = '/admin';
};

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
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
    border: 1.5px solid var(--color-btn-hover-bg);
    background-color: var(--color-btn-hover-bg);
    color: white;
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