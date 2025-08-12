<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { icons } from '../../icons';

const { t } = useI18n()

</script>

<template>
  <section class="about" id="About">
    <h2 class="about__title title2">{{ t('about.title') }}</h2>
    <p class="text about__text">{{ t('about.text1') }}</p>
    <p class="text about__text">{{ t('about.text2') }}</p>

    <h2 class="about__title title3">{{ t('about.journeyTitle') }}</h2>
    <p class="strong">{{ t('about.exp1Title') }}</p>
    <p class="text">{{ t('about.exp1Date') }}</p>
    <br />
    <p class="text about__text">{{ t('about.exp1Text') }}</p>
    <br /><br /><br />
    <p class="strong">{{ t('about.exp2Title') }}</p>
    <p class="text">{{ t('about.exp2Date') }}</p>
    <br />
    <p class="text about__text">{{ t('about.exp2Text') }}</p>

    <h2 class="about__title title2">{{ t('about.skillsTitle') }}</h2>
    <div class="about__icon">
      <img
        src="https://github-readme-stats.vercel.app/api/top-langs/?username=onikaChorba&theme=dark&hide_border=false&include_all_commits=true&count_private=true&layout=compact"
        alt="status" class="statusSkill" />
      <div class="iconsSkills">
        <img v-for="(el, index) in icons" :key="index" :src="el.src" :alt="el.alt" class="iconSkills" :title="el.alt" />
      </div>
    </div>

    <h2 class="about__title title2">
      {{ t('about.statsTitle') }} <span>GitHub</span>
    </h2>
    <a href="https://git.io/streak-stats">
      <img
        src="http://github-readme-streak-stats.herokuapp.com?user=onikaChorba&theme=dark&hide_border=true&border_radius=4.8"
        alt="status" class="status" />
    </a>
  </section>
</template>

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
