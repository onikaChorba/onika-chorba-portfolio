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
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Project } from "../../components";

const projects = ref([
  {
    name: "Test Project 1",
    textShort: "This is a description for project 1.",
    textButton: "View Project",
    imgMain: "https://via.placeholder.com/300x200",
    link: "#",
  },
  {
    name: "Test Project 2",
    textShort: "This is a description for project 2.",
    textButton: "View Project",
    imgMain: "https://via.placeholder.com/300x200",
    link: "#",
  },
  {
    name: "Test Project 3",
    textShort: "This is a description for project 3.",
    textButton: "View Project",
    imgMain: "https://via.placeholder.com/300x200",
    link: "#",
  },
]);

const { t } = useI18n();
</script>

<style scoped lang="scss"></style>
