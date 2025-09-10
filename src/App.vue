<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Header } from "./components";
import { FrontPage, AdminPage } from './pages';

const route = useRoute();
const isAuthenticated = ref(false);

const login = () => {
  const username = prompt("Enter username:");
  const password = prompt("Enter password:");

  if (username === "admin" && password === "1234") {
    isAuthenticated.value = true;
  } else {
    alert("Невірний логін або пароль");
    isAuthenticated.value = false;
  }
};

if (route.path.startsWith("/admin")) {
  login();
}

watch(() => route.path, (newPath) => {
  if (newPath.startsWith("/admin") && !isAuthenticated.value) {
    login();
  }
});
</script>

<template>
  <Header />
  <div class="container">
    <AdminPage v-if="isAuthenticated && route.path.startsWith('/admin')" />
    <FrontPage v-else />
  </div>
</template>

<style scoped>
.container {
  padding-top: 64px;
  max-width: 1550px;
  margin: auto;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
