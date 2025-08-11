<template>
  <header class="header">
    <div class="header__logo logo">
      <!-- <img :src="myImg" alt="photo1" class="logo__img" /> -->
      <p class="logo__text">
        <span class="logo__text2">Onika</span> Chorba
      </p>
    </div>
    <nav class="header__nav">
      <ul class="headerNavs">
        <li v-for="(el, index) in headerNav" :key="index">
          <RouterLink class="headerNav" active-class="headerNavActive" :to="el.to">
            {{ el.text }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const headerNav = ref([
  { text: "Home", to: "/" },
  { text: "About Me", to: "/about" },
  { text: "Projects", to: "/projects" },
  { text: "Contact", to: "/contact" },
]);
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgb(34, 3, 5);
  padding: 1%;

  z-index: 9000;

  /* замість @include screen-tb - медіа запит для планшетів і вище */
  @media (min-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &__logo {
    width: 100%;

    @media (min-width: 768px) {
      width: 30%;
    }
  }

  &__nav {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    @media (min-width: 768px) {
      width: 70%;
    }
  }
}

.logo {
  display: flex;
  align-items: center;
  animation: logoAnimation 1s ease-in-out;
  text-transform: uppercase;

  @media (min-width: 768px) {
    justify-content: center;
  }

  &__img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  &__text {
    margin-left: 20px;
    /* замість @include font-size(700, 22px, 30px) */
    font-weight: 700;
    font-size: 22px;
    line-height: 30px;
    color: white;
  }

  &__text2 {
    color: grey;
    transition-duration: 1s;

    &:hover {
      cursor: pointer;
      color: #800000;
      letter-spacing: 5px;
    }
  }
}

@keyframes logoAnimation {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.headerNavs {
  animation: logoAnimation 1s ease-in-out;
  width: 100%;
  text-align: right;

  @media (min-width: 768px) {
    width: 100%;
    margin-right: 3%;
  }
}

.headerNav {
  text-align: right;
  cursor: pointer;
  margin-left: 3%;
  /* замість @include font-size(700, 20px, 24px) */
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  transition-duration: 1s;

  &:hover {
    color: #800000;
  }
}

.headerNavActive {
  color: #800000;
}
</style>
