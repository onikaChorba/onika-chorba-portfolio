<template>
  <div class="project-card" @click="openModal">
    <div class="project-img">
      <img :src="project.imgs && project.imgs.length ? project.imgs[0] : 'https://via.placeholder.com/600x400'"
        :alt="project.name || 'Project image'" />
    </div>
    <div class="project-content">
      <h3 class="project-title">{{ project.name }}</h3>
      <p class="project-text">{{ locale === 'uk' ? project.text.uk : project.text.en }}</p>
      <div class="project-tags">
        <span v-for="(tag, idx) in project.tags" :key="idx" class="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
  <Modal v-if="isModalOpen" :project="project" @close="isModalOpen = false" />
</template>

<script setup lang="ts">
import { Modal } from '../index';
import { ref } from 'vue';
import { Project } from '../../types';
import { useI18n } from 'vue-i18n';
defineProps<{ project: Project }>();

const { locale } = useI18n();
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};

</script>

<style scoped lang="scss">
.project-card {
  position: relative;
  max-width: 30%;
  width: 100%;
  margin: 1%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  cursor: pointer;
  transition: transform 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  }

  .project-img {
    display: block;
    width: 100%;
    height: 0;
    padding-bottom: 66.66%;
    position: relative;
    overflow: hidden;
    border-radius: 16px;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: filter 0.4s ease;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      transition: background 0.4s ease;
    }
  }

  &:hover .project-img::after {
    background: var(--overlay-color);
  }

  .project-content {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 85%;
    transform: translate(-50%, -50%) scale(0);
    background: var(--content-bg);
    backdrop-filter: blur(10px);
    border-radius: 14px;
    padding: 20px;
    color: var(--color-text);
    text-align: center;
    transition: transform 0.5s ease, opacity 0.5s ease;
    opacity: 0;

    .project-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--color-primary);
    }

    .project-text {
      font-size: 1rem;
      margin-bottom: 12px;
    }

    .project-tags {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;

      .tag {
        background: var(--tag-bg);
        border: 1px solid var(--color-btn-border);
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        color: var(--color-text);
        transition: all 0.3s ease;

        &:hover {
          background: var(--color-btn-hover-bg);
          color: var(--color-btn-hover-text);
        }
      }
    }
  }

  &:hover .project-content {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  @media (max-width: 1200px) {
    max-width: 46%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 10px 0;
  }
}
</style>
