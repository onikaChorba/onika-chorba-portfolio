<template>
  <div className="hero" id="home">
    <img className="hero__img appear" src="https://media.giphy.com/media/3kPDmoWdBpQPNhCnUG/giphy.gif" alt="gifImg" />

    <div class="title">
      <h1 className="hero__title1 appear">
        <span className="hero__span">{{ t('hero.name') }}</span> {{ t('hero.surname') }}
      </h1>
      <h3 className="hero__title2 title2 appear">
        {{ t('hero.title2') }}
      </h3>
    </div>

    <p className="hero__text text appear">
      {{ t('hero.text') }}
    </p>

    <button @click="scrollToAbout" class="arrow appear">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</template>

<script setup lang="js">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const scrollToAbout = () => {
  document.getElementById('About')?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
  const elements = document.querySelectorAll('.appear');
  elements.forEach((el, idx) => {
    el.style.transitionDelay = `${idx * 0.2}s`;
    el.classList.add('visible');
  });
});
</script>

<style lang="scss" scoped>
.hero {
  width: 100%;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: var(--color-text);

  &__img {
    width: 300px;
  }

  &__title1 {
    font-family: "Oleo Script", system-ui;
    text-align: center;
    font-weight: 700;
    font-size: 44px;
    line-height: 50px;
  }

  &__title2 {
    font-size: 24px;
    text-align: center;
    color: var(--color-primary);
  }

  &__text {
    text-align: center;
    width: 70%;
    padding-bottom: 2%;
  }
}

.appear {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.appear.visible {
  opacity: 1;
  transform: translateY(0);
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
