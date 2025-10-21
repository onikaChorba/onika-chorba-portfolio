<template>
  <div class="admin-page">
    <section>
      <h2>Hero</h2>
      <div class="lang-group" v-for="field in ['name', 'surname', 'title2', 'text']" :key="field">
        <label>{{ field }} (UA)
          <input v-model="hero.ua[field]" />
        </label>
        <label>{{ field }} (EN)
          <input v-model="hero.en[field]" />
        </label>
      </div>
    </section>
    <hr />
    <section>
      <h2>About</h2>
      <div class="lang-group" v-for="field in ['title', 'text1', 'text2', 'journeyTitle', 'skillsTitle', 'statsTitle']"
        :key="field">
        <label>{{ field }} (UA)
          <input v-model="about.ua[field]" />
        </label>
        <label>{{ field }} (EN)
          <input v-model="about.en[field]" />
        </label>
      </div>
    </section>
    <hr />
    <section>
      <h2>Досвід</h2>
      <div v-for="(item, i) in experience" :key="i" class="experience-item">
        <label>Position:
          <input v-model="item.position[currentLocale]" />
        </label>
        <label>Company:
          <input v-model="item.company[currentLocale]" />
        </label>
        <label>Period:
          <input v-model="item.period[currentLocale]" />
        </label>
        <label>Description:
          <textarea v-model="item.description[currentLocale]"></textarea>
        </label>
      </div>
      <button @click="addExperience">Додати досвід</button>
    </section>

    <hr />
    <button @click="saveAll">Зберегти всі зміни</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const currentLocale = ref<'ua' | 'en'>(locale.value as 'ua' | 'en');

const hero = ref<{ ua: Record<string, string>; en: Record<string, string> }>({
  ua: { name: '', surname: '', title2: '', text: '' },
  en: { name: '', surname: '', title2: '', text: '' },
});

const about = ref<{ ua: Record<string, string>; en: Record<string, string> }>({
  ua: { title: '', text1: '', text2: '', journeyTitle: '', skillsTitle: '', statsTitle: '' },
  en: { title: '', text1: '', text2: '', journeyTitle: '', skillsTitle: '', statsTitle: '' },
});

interface IExperienceItem {
  position: Record<'ua' | 'en', string>;
  company: Record<'ua' | 'en', string>;
  period: Record<'ua' | 'en', string>;
  description: Record<'ua' | 'en', string>;
}
const experience = ref<IExperienceItem[]>([]);

const loadData = async () => {
  const heroSnapUA = await getDoc(doc(db, 'locales', 'uk'));
  if (heroSnapUA.exists()) hero.value.ua = heroSnapUA.data().hero || hero.value.ua;

  const heroSnapEN = await getDoc(doc(db, 'locales', 'en'));
  if (heroSnapEN.exists()) hero.value.en = heroSnapEN.data().hero || hero.value.en;

  const aboutSnapUA = await getDoc(doc(db, 'locales', 'uk'));
  if (aboutSnapUA.exists()) about.value.ua = aboutSnapUA.data().about || about.value.ua;

  const aboutSnapEN = await getDoc(doc(db, 'locales', 'en'));
  if (aboutSnapEN.exists()) about.value.en = aboutSnapEN.data().about || about.value.en;

  const expSnap = await getDoc(doc(db, 'experience', 'main'));
  if (expSnap.exists()) {
    experience.value = expSnap.data().experience.map((item: any) => ({
      position: { ua: item.position || '', en: item.position || '' },
      company: { ua: item.company || '', en: item.company || '' },
      period: { ua: item.period || '', en: item.period || '' },
      description: { ua: item.description || '', en: item.description || '' },
    }));
  }
};

onMounted(loadData);

const saveAll = async () => {
  await setDoc(doc(db, 'locales', 'uk'), { hero: hero.value.ua, about: about.value.ua }, { merge: true });
  await setDoc(doc(db, 'locales', 'en'), { hero: hero.value.en, about: about.value.en }, { merge: true });
  await setDoc(doc(db, 'experience', 'main'), { experience: experience.value }, { merge: true });
  alert('✅ Збережено успішно');
};

const addExperience = () => {
  experience.value.push({
    position: { ua: '', en: '' },
    company: { ua: '', en: '' },
    period: { ua: '', en: '' },
    description: { ua: '', en: '' },
  });
};
</script>

<style scoped lang="scss">
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;

  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  input,
  textarea,
  select {
    padding: 6px;
    border-radius: 6px;
    border: 1px solid #ccc;
    width: 100%;
  }

  textarea {
    min-height: 60px;
  }

  button {
    padding: 8px 12px;
    border-radius: 6px;
    background-color: var(--color-primary);
    color: #fff;
    cursor: pointer;
  }

  hr {
    margin: 20px 0;
    border: 1px solid #ccc;
  }

  .lang-group {
    display: flex;
    gap: 12px;
  }

  .experience-item {
    margin-bottom: 15px;
  }
}
</style>
