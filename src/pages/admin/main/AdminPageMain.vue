<template>
  <div class="admin-page">
    <section>
      <h2>Hero</h2>
      <div class="lang-group" v-for="field in ['name', 'surname', 'title2', 'text']" :key="field">
        <label>{{ field }} (UA)
          <template v-if="field === 'text'">
            <textarea v-model="hero.ua[field]"></textarea>
          </template>
          <template v-else>
            <input v-model="hero.ua[field]" />
          </template>
        </label>

        <label>{{ field }} (EN)
          <template v-if="field === 'text'">
            <textarea v-model="hero.en[field]"></textarea>
          </template>
          <template v-else>
            <input v-model="hero.en[field]" />
          </template>
        </label>
      </div>
    </section>
    <hr />
    <section>
      <h2>About</h2>
      <div class="lang-group" v-for="field in ['title', 'text1', 'text2', 'journeyTitle', 'skillsTitle', 'statsTitle']"
        :key="field">

        <label>{{ field }} (UA)
          <template v-if="field.toLowerCase().includes('text')">
            <textarea v-model="about.ua[field]"></textarea>
          </template>
          <template v-else>
            <input v-model="about.ua[field]" />
          </template>
        </label>

        <label>{{ field }} (EN)
          <template v-if="field.toLowerCase().includes('text')">
            <textarea v-model="about.en[field]"></textarea>
          </template>
          <template v-else>
            <input v-model="about.en[field]" />
          </template>
        </label>

      </div>
    </section>
    <hr />
    <section>
      <h2>Досвід</h2>
      <div v-for="(item, i) in experience" :key="i" class="experience-item">
        <div class="lang-group">
          <label>Position (UA)
            <input v-model="item.position.ua" />
          </label>
          <label>Position (EN)
            <input v-model="item.position.en" />
          </label>
        </div>

        <div class="lang-group">
          <label>Period (UA)
            <input v-model="item.period.ua" />
          </label>
          <label>Period (EN)
            <input v-model="item.period.en" />
          </label>
        </div>

        <div class="lang-group">
          <label>Description (UA)
            <textarea v-model="item.description.ua"></textarea>
          </label>
          <label>Description (EN)
            <textarea v-model="item.description.en"></textarea>
          </label>
        </div>
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
import { db } from '../../../firebase/firebase.config';

const hero = ref<{ ua: Record<string, string>, en: Record<string, string> }>({
  ua: { name: '', surname: '', title2: '', text: '' },
  en: { name: '', surname: '', title2: '', text: '' }
});

const about = ref<{ ua: Record<string, string>, en: Record<string, string> }>({
  ua: { title: '', text1: '', text2: '', journeyTitle: '', skillsTitle: '', statsTitle: '' },
  en: { title: '', text1: '', text2: '', journeyTitle: '', skillsTitle: '', statsTitle: '' }
});

interface IExperienceItem {
  position: Record<string, string>;
  period: Record<string, string>;
  description: Record<string, string>;
}

const experience = ref<IExperienceItem[]>([]);

const loadData = async () => {
  const docRef = doc(db, 'locales', 'uk');
  const snapUA = await getDoc(docRef);
  if (snapUA.exists()) hero.value.ua = snapUA.data().hero || hero.value.ua;

  const docRefEn = doc(db, 'locales', 'en');
  const snapEN = await getDoc(docRefEn);
  if (snapEN.exists()) hero.value.en = snapEN.data().hero || hero.value.en;

  const aboutSnapUA = await getDoc(doc(db, 'locales', 'uk'));
  if (aboutSnapUA.exists()) about.value.ua = aboutSnapUA.data().about || about.value.ua;

  const aboutSnapEN = await getDoc(doc(db, 'locales', 'en'));
  if (aboutSnapEN.exists()) about.value.en = aboutSnapEN.data().about || about.value.en;

  const expSnap = await getDoc(doc(db, 'experience', 'main'));
  if (expSnap.exists()) {
    experience.value = expSnap.data().experience.map((item: any) => ({
      position: { ua: item.position?.uk || '', en: item.position?.en || '' },
      period: { ua: item.period?.uk || '', en: item.period?.en || '' },
      description: { ua: item.description?.uk || '', en: item.description?.en || '' },
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
    period: { ua: '', en: '' },
    description: { ua: '', en: '' },
  });
};

</script>

<style scoped lang="scss">
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Inter', sans-serif;

  section {
    background: var(--content-bg);
    padding: 20px;
    border-radius: 12px;
    box-shadow: var(--box-shadow);
    transition: background 0.3s, color 0.3s;

    h2 {
      margin-bottom: 16px;
      color: var(--color-primary);
      font-weight: 600;
      font-size: 1.5rem;
      border-bottom: 2px solid var(--color-primary);
      padding-bottom: 4px;
    }
  }

  .lang-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 12px;

    label {
      flex: 1 1 200px;
      display: flex;
      flex-direction: column;
      font-weight: 500;

      input,
      textarea {
        margin-top: 6px;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid var(--color-btn-border);
        background: var(--tag-bg);
        color: var(--color-text);
        font-size: 0.95rem;
        transition: border-color 0.2s, background 0.2s;

        &:focus {
          border-color: var(--color-primary);
          outline: none;
          box-shadow: 0 0 0 3px rgba(200, 111, 141, 0.2);
        }
      }

      textarea {
        min-height: 80px;
        resize: vertical;
      }
    }
  }

  button {
    align-self: flex-start;
    padding: 10px 18px;
    border-radius: 10px;
    background-color: var(--color-primary);
    border: none;
    color: var(--color-btn-hover-text);
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;

    &:hover {
      background-color: var(--color-btn-hover-bg);
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
      box-shadow: var(--box-shadow);
    }
  }

  hr {
    border: 1px solid var(--tag-bg);
    margin: 32px 0;
  }
}
</style>
