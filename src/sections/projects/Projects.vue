<template>
  <div class="projects" id="projects">
    <h2 class="projects__title title2">{{ t('projects.projects') }}</h2>
    <p class="text">{{ t('projects.about') }}</p>
    <div class="projectsBlock">
      <Project v-for="(project, index) in projects" :key="index" :project="project" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
import { Project } from "../../components";
import { db } from "../../firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";

const projects = ref<any[]>([]);
const { t } = useI18n();

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "projects"));
  projects.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
});
</script>

<style scoped lang="scss">
.projectsBlock {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 40px 0;
}
</style>
