<template>
  <div class="projects" id="projects">
    <h2 class="projects__title title2">{{ projectsTranslations.projects || t('projects.projects') }}</h2>
    <p class="text">{{ projectsTranslations.about || t('projects.about') }}</p>

    <div class="filters">
      <button @click="setFilter(null)" :class="{ active: activeFilter === null }" aria-label="all">
        {{ projectsTranslations.all || t('projects.all') }}
      </button>
      <button v-for="tag in allTags" :key="tag" @click="setFilter(tag)" :class="{ active: activeFilter === tag }"
        aria-label="tag">
        {{ tag }}
      </button>
    </div>

    <div class="projectsBlock">
      <Project v-for="(project, index) in filteredProjects" :key="index" :project="project" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from "vue-i18n";
import { Project } from "../../components";
import { ref, onMounted, computed } from "vue";
import { db } from "../../firebase/firebase.config";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";

const { locale, t, setLocaleMessage } = useI18n<{ locale: string; t: any }>();
const projects = ref<any[]>([]);
const activeFilter = ref<string | null>(null);
const projectsTranslations = ref<Record<string, string>>({});

onMounted(async () => {
  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  projects.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const projectsDoc = doc(db, "locales", locale.value);
  const projectsSnap = await getDoc(projectsDoc);

  if (projectsSnap.exists()) {
    const messages = projectsSnap.data();
    projectsTranslations.value = messages.projects || {};
    setLocaleMessage(locale.value, messages);
  } else {
    console.warn("❌ Немає перекладів для about у Firestore");
  }
});

const allTags = computed(() => {
  const set = new Set<string>();
  projects.value.forEach((p) => {
    p.tags?.forEach((tag: string) => set.add(tag));
  });
  return Array.from(set).sort();
});

const filteredProjects = computed(() => {
  if (!activeFilter.value) return projects.value;
  return projects.value.filter((p) =>
    p.tags?.some((tag: string) => tag.toLowerCase() === activeFilter.value?.toLowerCase())
  );
});

function setFilter(tag: string | null) {
  activeFilter.value = tag;
}

watch(locale, async (newLocale) => {
  const projectsDoc = doc(db, "locales", newLocale);
  const projectsSnap = await getDoc(projectsDoc);
  if (projectsSnap.exists()) {
    const messages = projectsSnap.data();
    projectsTranslations.value = messages.projects || {};
    setLocaleMessage(newLocale, messages);
  }
});
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
  padding-bottom: 6px;

  button {
    flex: 0 0 auto;
    padding: 8px 14px;
    border: 1px solid var(--color-btn-border);
    cursor: pointer;
    border-radius: 16px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    background: var(--tag-bg);
    color: var(--color-text);
    box-shadow: var(--box-shadow);
    white-space: nowrap;

    &:hover {
      background: var(--color-btn-hover-bg);
      color: var(--color-btn-hover-text);
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }

    &.active {
      background: var(--color-primary);
      color: var(--color-btn-hover-text);
      border-color: var(--color-primary);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    }
  }
}

.projectsBlock {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 40px 0;
}
</style>
