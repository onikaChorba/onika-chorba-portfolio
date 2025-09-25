<template>
  <Header v-if="!route.path.startsWith('/admin') && !isAuthenticated" />
  <Header v-else-if="isAuthenticated" />
  <div class="container">
    <div class="bg-login" v-if="showLoginForm && !isAuthenticated">
      <Canvas />
    </div>

    <div v-if="showLoginForm && !isAuthenticated" class="login-form">
      <h2>Вхід в адмінку</h2>
      <form @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Логін" ref="usernameInput"
          @keydown.enter.prevent="focusPassword" autofocus />
        <input v-model="password" type="password" placeholder="Пароль" ref="passwordInput"
          @keydown.enter.prevent="login" />
        <button type="submit">Увійти</button>
      </form>
    </div>

    <AdminPage v-else-if="isAuthenticated && route.path.startsWith('/admin')" />
    <FrontPage v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Header, Canvas } from "./components";
import { FrontPage, AdminPage } from './pages';

const route = useRoute();
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
  if (username.value === "admin" && password.value === "1234") {
    isAuthenticated.value = true;
    showLoginForm.value = false;
    localStorage.setItem('isAutenticated', 'true')
  } else {
    alert("Невірний логін або пароль");
    isAuthenticated.value = false;
    localStorage.removeItem('isAutenticated')
  }
};

if (route.path.startsWith("/admin")) {
  showLoginForm.value = true;
}

watch(() => route.path, (newPath) => {
  if (newPath.startsWith("/admin") && !isAuthenticated.value) {
    showLoginForm.value = true;
  } else {
    showLoginForm.value = false;
  }
});

onMounted(() => {
  if (localStorage.getItem('isAutenticated') === 'true') {
    isAuthenticated.value = true;
    showLoginForm.value = false;
  } else {
    isAuthenticated.value = false;
    showLoginForm.value = true;
  }
})
</script>

<style scoped>
.container {
  padding-top: 64px;
  max-width: 1550px;
  margin: auto;
  padding-left: 20px;
  padding-right: 20px;
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

.login-form h2 {
  margin-bottom: 10px;
  text-align: center;
  color: var(--color-text);
}

.login-form input {
  padding: 10px;
  border: 1px solid var(--color-btn-border);
  border-radius: 6px;
  background: #fff;
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
