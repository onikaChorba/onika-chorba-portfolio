<template>
  <section class="about" id="about">
    <h2 class="about__title title2">{{ aboutTranslations.title || t('about.title') }}</h2>
    <p class="text about__text">{{ aboutTranslations.text1 || t('about.text1') }}</p>
    <p class="text about__text">{{ aboutTranslations.text2 || t('about.text2') }}</p>

    <h2 class="about__title title3">{{ aboutTranslations.journeyTitle || t('about.journeyTitle') }}</h2>

    <div v-for="(item, i) in experience" :key="i" class="experience-item">
      <h3 class="strong">{{ item.position?.[locale] }}</h3>
      <span class="text">{{ item.company?.[locale] }}</span>
      <small class="small">{{ item.period?.[locale] }}</small>
      <br /> <br />
      <p class="text">{{ item.description?.[locale] }}</p>
    </div>
    <h2 class="about__title title2">{{ aboutTranslations.skillsTitle || t('about.skillsTitle') }}</h2>

    <div class="about__icon">
      <img
        src="https://github-readme-stats.vercel.app/api/top-langs/?username=onikaChorba&theme=dark&hide_border=false&include_all_commits=true&count_private=true&layout=compact"
        alt="status" class="statusSkill" width="350" />
      <div class="iconsSkills">
        <img v-for="(el, index) in filteredExperience" :key="index" :src="el.src" :alt="el.alt" class="iconSkills"
          width="40" :title="el.alt" />
      </div>
    </div>

    <h2 class="about__title title2">
      {{ aboutTranslations.statsTitle || t('about.statsTitle') }} <span>GitHub</span>
    </h2>

    <p align="center">
      <img
        src="https://github-readme-streak-stats.herokuapp.com?user=onikaChorba&theme=dark&hide_border=true&border_radius=4.8"
        alt="GitHub Streak Stats" class="status" />
    </p>
  </section>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { icons } from '../../icons';
import { ref, onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';

const { locale, t, setLocaleMessage } = useI18n<{ locale: string; t: any }>();

const experience = ref<any[]>([]);
const aboutTranslations = ref<Record<string, string>>({});
const selectedIcons = ['ts', 'js', 'react', 'redux', 'next', 'vue', 'html', 'css', 'scss', 'styledComponents', 'mui', 'wing', 'wb', 'api', 'git', 'gitLab', 'bitbuked', 'figma'];

onMounted(async () => {
  const refDoc = doc(db, "experience", "main");
  const aboutDoc = doc(db, "locales", locale.value);
  const snap = await getDoc(refDoc);
  const aboutSnap = await getDoc(aboutDoc);
  if (snap.exists()) {
    experience.value = snap.data().experience;
  } else {
    alert("❌ Немає досвіду у Firestore");
  }

  if (aboutSnap.exists()) {
    const messages = aboutSnap.data();
    aboutTranslations.value = messages.about || {};
    setLocaleMessage(locale.value, messages);
  } else {
    alert("❌ Немає перекладів для about у Firestore");
  }
});

const filteredExperience = icons.filter(icon => selectedIcons.includes(icon.alt));

watch(locale, async (newLocale) => {
  const aboutDoc = doc(db, "locales", newLocale);
  const aboutSnap = await getDoc(aboutDoc);
  if (aboutSnap.exists()) {
    const messages = aboutSnap.data();
    aboutTranslations.value = messages.about || {};
    setLocaleMessage(newLocale, messages);
  }
});
</script>

<style lang="scss" scoped>
.about {
  min-height: 100vh;

  &__text {
    margin-top: 1%;
  }

  &__icon {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }
}

.experience-item {
  margin-bottom: 15px;
}

.iconsSkills {
  width: 100%;
  margin: 0 auto;
  cursor: pointer;

  @media (min-width: 768px) {
    width: 73%;
  }
}

.iconSkills {
  margin-left: 2%;
  padding-top: 2%;
  padding-bottom: 2%;
  width: 40px;
  margin-right: 30px;
  transition: all 0.3s ease-in-out;

  @media (min-width: 576px) {
    width: 70px;
  }

  &:hover {
    transform: scale(1.2);
  }
}

.statusSkill {
  width: 100%;
  margin-bottom: 2rem;
  margin-top: 2rem;
  border: 2px solid white;
  border-radius: 10px;

  @media (min-width: 576px) {
    width: 50%;
  }

  @media (min-width: 768px) {
    width: 25%;
  }
}

.status {
  width: 100%;
  border: 2px solid white;
  border-radius: 10px;

  @media (min-width: 576px) {
    width: 50%;
  }

  @media (min-width: 768px) {
    width: 35%;
  }
}
</style>