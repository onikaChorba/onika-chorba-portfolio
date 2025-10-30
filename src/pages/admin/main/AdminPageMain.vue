<template>
  <div class="admin-page">
    <section>
      <h2>Hero</h2>
      <div class="lang-group" v-for="field in ['name', 'surname', 'title2', 'text']" :key="field">
        <label>{{ field }} (UA)
          <template v-if="field === 'text'">
            <textarea v-model="hero.uk[field]"></textarea>
          </template>
          <template v-else>
            <input v-model="hero.uk[field]" />
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
            <textarea v-model="about.uk[field]"></textarea>
          </template>
          <template v-else>
            <input v-model="about.uk[field]" />
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
            <input v-model="item.position.uk" />
          </label>
          <label>Position (EN)
            <input v-model="item.position.en" />
          </label>
        </div>

        <div class="lang-group">
          <label>Period (UA)
            <input v-model="item.period.uk" />
          </label>
          <label>Period (EN)
            <input v-model="item.period.en" />
          </label>
        </div>

        <div class="lang-group">
          <label>Description (UA)
            <textarea v-model="item.description.uk"></textarea>
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

const hero = ref<{ uk: Record<string, string>, en: Record<string, string> }>({
  uk: { name: '', surname: '', title2: '', text: '' },
  en: { name: '', surname: '', title2: '', text: '' }
});

const about = ref<{ uk: Record<string, string>, en: Record<string, string> }>({
  uk: { title: '', text1: '', text2: '', journeyTitle: '', skillsTitle: '', statsTitle: '' },
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
  if (snapUA.exists()) hero.value.uk = snapUA.data().hero || hero.value.uk;

  const docRefEn = doc(db, 'locales', 'en');
  const snapEN = await getDoc(docRefEn);
  if (snapEN.exists()) hero.value.en = snapEN.data().hero || hero.value.en;

  const aboutSnapUA = await getDoc(doc(db, 'locales', 'uk'));
  if (aboutSnapUA.exists()) about.value.uk = aboutSnapUA.data().about || about.value.uk;

  const aboutSnapEN = await getDoc(doc(db, 'locales', 'en'));
  if (aboutSnapEN.exists()) about.value.en = aboutSnapEN.data().about || about.value.en;

  const expSnap = await getDoc(doc(db, 'experience', 'main'));
  if (expSnap.exists()) {
    experience.value = expSnap.data().experience.map((item: any) => ({
      position: { uk: item.position?.uk || '', en: item.position?.en || '' },
      period: { uk: item.period?.uk || '', en: item.period?.en || '' },
      description: { uk: item.description?.uk || '', en: item.description?.en || '' },
    }));
  }
};

onMounted(loadData);

const saveAll = async () => {
  await setDoc(doc(db, 'locales', 'uk'), { hero: hero.value.uk, about: about.value.uk }, { merge: true });
  await setDoc(doc(db, 'locales', 'en'), { hero: hero.value.en, about: about.value.en }, { merge: true });
  await setDoc(doc(db, 'experience', 'main'), { experience: experience.value }, { merge: true });
  alert('✅ Збережено успішно');
};

const addExperience = () => {
  experience.value.push({
    position: { uk: '', en: '' },
    period: { uk: '', en: '' },
    description: { uk: '', en: '' },
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
  max-width: 1200px;
  margin: 0 auto;

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
      flex: 1 1 45%;
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

  .experience-item {
    background: var(--content-bg);
    padding: 16px 20px;
    border-radius: 10px;
    box-shadow: var(--box-shadow);
    margin-bottom: 16px;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
    }

    .lang-group {
      gap: 12px;
    }

    label {
      font-weight: 500;

      input,
      textarea {
        background: var(--tag-bg);
        border: 1px solid var(--color-btn-border);
        border-radius: 6px;
        padding: 8px 10px;
        margin-top: 6px;
      }

      textarea {
        min-height: 70px;
      }
    }
  }

  /* --- Адаптивність --- */

  @media (max-width: 1024px) {
    padding: 24px;

    .lang-group label {
      flex: 1 1 100%;
    }

    section h2 {
      font-size: 1.3rem;
    }
  }

  @media (max-width: 768px) {
    padding: 20px;

    section {
      padding: 16px;
    }

    .lang-group {
      flex-direction: column;
      gap: 12px;

      label {
        flex: 1 1 100%;
      }

      input,
      textarea {
        font-size: 0.9rem;
      }
    }

    button {
      width: 100%;
      align-self: stretch;
      font-size: 0.95rem;
      padding: 12px;
    }
  }

  @media (max-width: 480px) {
    padding: 16px;

    section {
      padding: 14px;
    }

    section h2 {
      font-size: 1.1rem;
    }

    .lang-group {
      gap: 10px;

      label {
        font-size: 0.9rem;
      }

      input,
      textarea {
        padding: 8px 10px;
        font-size: 0.85rem;
      }
    }

    button {
      font-size: 0.9rem;
      border-radius: 8px;
      padding: 10px;
    }
  }
}
</style>
