<template>
  <div class="hero" id="home">
    <div>
      <img :src="gif" alt="Hero preview" class="gifImg" />
    </div>

    <div class="title">
      <h1 class="hero__title1 appear">
        <span class="hero__span">{{ heroTranslations.name || t('hero.name') }}</span>
        {{ heroTranslations.surname || t('hero.surname') }}
      </h1>
      <h2 class="hero__title2 title2 appear">
        {{ heroTranslations.title2 || t('hero.title2') }}
      </h2>
    </div>

    <p class="hero__text text appear">
      {{ heroTranslations.text || t('hero.text') }}
    </p>

    <button @click="scrollToAbout" class="arrow appear" aria-label="scroll to about">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ref, onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import gif from './../../assets/icons/dev.gif';

const { locale, t, setLocaleMessage } = useI18n<{ locale: string; t: any }>();
const heroTranslations = ref<Record<string, string>>({});

const scrollToAbout = () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(async () => {
  const elements = document.querySelectorAll('.appear');
  elements.forEach((el, idx) => {
    //@ts-ignore
    el.style.transitionDelay = `${idx * 0.2}s`;
    el.classList.add('visible');
  });

  const heroDoc = doc(db, "locales", locale.value);
  const heroSnap = await getDoc(heroDoc);

  if (heroSnap.exists()) {
    const messages = heroSnap.data();
    heroTranslations.value = messages.hero || {};
    setLocaleMessage(locale.value, messages);
  } else {
    console.warn("❌ Немає перекладів для about у Firestore");
  }
});

watch(locale, async (newLocale) => {
  const heroDoc = doc(db, "locales", newLocale);
  const heroSnap = await getDoc(heroDoc);
  if (heroSnap.exists()) {
    const messages = heroSnap.data();
    heroTranslations.value = messages.hero || {};
    setLocaleMessage(newLocale, messages);
  }
});
</script>

<style lang="scss" scoped>
.hero {
  width: 100%;
  min-height: calc(100vh - 64px);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(16px, 4vw, 32px);
  color: var(--color-text);
  text-align: center;

  .gifImg {
    width: clamp(180px, 40vw, 300px);
    height: auto;
  }

  &__title1 {
    font-family: "Oleo Script", system-ui;
    font-weight: 700;
    font-size: clamp(28px, 6vw, 48px);
    line-height: 1.1;
  }

  &__title2 {
    font-size: clamp(18px, 4vw, 28px);
    color: var(--color-primary);
    margin-top: -6px;
  }

  &__text {
    max-width: 600px;
    width: 100%;
    font-size: clamp(14px, 2.8vw, 18px);
    padding-bottom: 2%;
    opacity: 0.9;
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
  background: transparent;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

.arrow span {
  display: block;
  width: clamp(12px, 2vw, 24px);
  height: clamp(12px, 2vw, 24px);
  border-bottom: 4px solid var(--color-primary);
  border-right: 4px solid var(--color-primary);
  transform: rotate(45deg);
  margin: -6px;
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

@media (max-width: 480px) {
  .hero {
    padding-top: 60px;
  }
}
</style>
