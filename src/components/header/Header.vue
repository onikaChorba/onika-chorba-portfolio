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
          <RouterLink class="header-nav" active-class="header-nav-active" :to="el.to">
            {{ el.text }}
          </RouterLink>
        </li>
      </ul>
    </nav>
    <button class="btn">
      Contact
    </button>
    <button class="btn-switch" @click="toggleTheme">
      <img :src="isDark ? sunIcon : moonIcon" />
    </button>
  </header>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import moonIcon from '../../assets/icons/moon.svg'
import sunIcon from '../../assets/icons/sun.svg'

const headerNav = ref([
  { text: "Home", to: "/" },
  { text: "About Me", to: "/about" },
  { text: "Projects", to: "/projects" },
  { text: "Contact", to: "/contact" },
]);

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  }
}

document.body.classList.add('light');
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  height: 64px;
  background: transparent;
  padding: 0 20px;
  font-family: 'Montserat';
  font-weight: 400;
  font-size: 16px;
  color: var(--color-text);
  position: relative;

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
  transition: color 0.3s, border 0.3s;
  cursor: pointer;
}

.header-nav:hover {
  color: var(--color-primary);
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

.btn-switch {
  border: none;
  background: none;
  width: 30px;
  height: 30px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
