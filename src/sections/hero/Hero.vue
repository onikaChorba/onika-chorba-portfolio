<template>
  <div className="hero" id="home">
    <img className="hero__img" src="https://media.giphy.com/media/3kPDmoWdBpQPNhCnUG/giphy.gif" alt="gifImg" />
    <div class="title">
      <h1 className="hero__title1">
        <span className="hero__span"> {{ t('hero.name') }} </span> {{ t('hero.surname') }}
      </h1>
      <h3 className="hero__title2 title2"> {{ t('hero.title2') }}</h3>
    </div>
    <p className="hero__text text">
      {{ t('hero.text') }}
    </p>
    <button @click="scrollToAbout" class="arrow">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</template>

<script setup lang="js">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const scrollToAbout = () => {
  document.getElementById('About')?.scrollIntoView({ behavior: 'smooth' })
}

</script>

<style lang="scss" scoped>
.hero {
  width: 100%;
  min-height: calc(100vh - 64px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: var(--color-text);

  &__img {
    width: 300px;

    img {
      width: 100%;
    }
  }

  &__title1 {
    font-family: "Oleo Script", system-ui;
    text-align: center;
    font-weight: 700;
    font-size: 44px;
    line-height: 50px;
    position: relative;
    display: inline-block;
  }

  &__span {
    display: inline-block;
    cursor: pointer;
    transition: letter-spacing 2s, color 2s;
    color: var(--color-primary);
  }

  &__text {
    text-align: center;
    width: 70%;
    padding-bottom: 2%;
  }
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}

.arrow {
  transform: translate(-50%, -50%) rotate(-360deg);
  cursor: pointer;
  background: transparent;
  border: none;
}

.arrow span {
  display: block;
  width: 1.5vw;
  height: 1.5vw;
  border-bottom: 5px solid var(--color-primary);
  border-right: 5px solid var(--color-primary);
  transform: rotate(45deg);
  margin: -10px;
  animation: animate 2s infinite;
}

.arrow span:nth-child(2) {
  animation-delay: -0.2s;
}

.arrow span:nth-child(3) {
  animation-delay: -0.4s;
}

@keyframes animate {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(-20px, -20px);
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: rotate(45deg) translate(20px, 20px);
  }
}
</style>
