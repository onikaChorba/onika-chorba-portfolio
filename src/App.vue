<template>
  <Header :isAdmin="route.path.startsWith('/admin') && isAuthenticated" />

  <div class="container">
    <div v-if="route.path.startsWith('/admin') && !isAuthenticated" class="login-form">
      <h2>Вхід в адмінку</h2>
      <form @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Логін" ref="usernameInput"
          @keydown.enter.prevent="focusPassword" autofocus />
        <input v-model="password" type="password" placeholder="Пароль" ref="passwordInput"
          @keydown.enter.prevent="login" />
        <button type="submit" aria-label="submit">Увійти</button>
      </form>
    </div>

    <router-view v-if="!route.path.startsWith('/admin') || isAuthenticated" />
  </div>

  <Footer />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Header, Footer } from "./components";

const route = useRoute();
const router = useRouter();
const isAuthenticated = ref(false);
const username = ref("");
const password = ref("");
const showLoginForm = ref(false);
const usernameInput = ref<HTMLInputElement | null>(null);
const passwordInput = ref<HTMLInputElement | null>(null);

const focusPassword = () => {
  passwordInput.value?.focus();
};

const login = () => {
  if (username.value === import.meta.env.VITE_ADMIN_LOGIN && password.value === import.meta.env.VITE_ADMIN_PASSWORD) {
    isAuthenticated.value = true;
    showLoginForm.value = false;
    localStorage.setItem('isAuthenticated', 'true');
    router.push("/admin");
  } else {
    alert("Невірний логін або пароль");
    isAuthenticated.value = false;
    localStorage.removeItem('isAuthenticated')
  }
};

if (route.path.startsWith("/admin")) {
  showLoginForm.value = true;
}

watch(() => route.path, (newPath) => {
  showLoginForm.value = newPath.startsWith("/admin") && !isAuthenticated.value;
});

const updateTitle = () => {
  if (route.path.startsWith("/admin")) {
    document.title = isAuthenticated.value ? "Admin Panel | Portfolio" : "Login | Admin Panel";
  } else if (route.path === "/projects") {
    document.title = "Projects | Portfolio";
  } else if (route.path === "/about") {
    document.title = "About | Portfolio";
  } else {
    document.title = "Onika Chorba | Portfolio";
  }
};

onMounted(() => {
  if (localStorage.getItem('isAuthenticated') === 'true') {
    isAuthenticated.value = true;
  } else {
    isAuthenticated.value = false;
  }

  updateTitle();
});
</script>

<style scoped>
.container {
  padding-top: 64px;
  max-width: 1550px;
  min-height: calc(100vh - 50px);
  margin: auto;
  padding-left: 55px;
  padding-right: 55px;

  @media (min-width: 769px) {
    padding-left: 65px;
    padding-right: 65px;
  }
}

.bg-login {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: var(--overlay-color);
}

.login-form {
  max-width: 320px;
  width: 100%;
  padding: 24px;
  background: var(--content-bg);
  border-radius: 12px;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(10px);
  color: var(--color-text);
}

.login-form form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-form h2 {
  margin-bottom: 10px;
  text-align: center;
  color: var(--color-text);
}

.login-form input {
  padding: 10px;
  border: 1px solid var(--color-btn-border);
  border-radius: 6px;
  background: var(--content-bg);
  color: var(--color-text);

  &:focus {
    outline: none;
    box-shadow: var(--box-shadow);
  }
}

.login-form button {
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: var(--color-primary);
  color: var(--color-btn-hover-text);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.login-form button:hover {
  background: var(--color-btn-hover-bg);
}
</style>
