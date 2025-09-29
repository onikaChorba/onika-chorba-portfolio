<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal"> <button class="modal-close" @click="$emit('close')">×</button>
      <div class="img-wrapper">
        <img v-if="project.imgs?.length" :src="project.imgs[project.imgs.length - 1]" :alt="project.name" />
      </div>
      <h2>{{ project.name }}</h2>
      <p>{{ project.text?.[locale as 'en' | 'uk'] }}</p>
      <div class="tags"> <span v-for="(tag, idx) in project.tags" :key="idx">{{ tag }}</span> </div>
      <ul class="tools">
        <li v-for="(tool, index) in project.tools?.[locale as 'en' | 'uk'] || []" :key="index">
          <strong><img :src="icons.find(i => i.alt === 'check')?.src" alt="check" class="tool-icon" />{{
            tool.split(':')[0] }}:</strong>
          <p>{{ tool.split(':').slice(1).join(':').trim() }}</p>
        </li>
      </ul>
      <div class="links"> <a v-if="project.links?.browser" :href="project.links.browser" target="_blank"
          class="btn browser"> <img :src="icons.find(i => i.alt === 'browser')?.src" alt="browser" class="btn-icon" />
          Live Demo </a> <a v-if="project.links?.gitHub" :href="project.links.gitHub" target="_blank"
          class="btn github"> <img :src="icons.find(i => i.alt === 'gitHubLink')?.src" alt="GitHub" class="btn-icon" />
          View on GitHub </a> </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { icons } from '../../icons';
import { Project } from '../../types';


defineProps<{ project: Project }>();

const { locale } = useI18n();

</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal {
  background: var(--color-bg);
  color: var(--color-text);
  border-radius: 16px;
  padding: 24px;
  max-height: 90vh;
  width: 90%;
  max-width: 600px;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--box-shadow);
  animation: scaleIn 0.3s ease;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-bg);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-primary);
    border-radius: 8px;
    border: 2px solid var(--color-bg);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-btn-hover-bg);
  }

  h2 {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--color-primary);
  }

  p {
    margin-bottom: 12px;
    line-height: 1.5;
  }
}

.img-wrapper {
  width: 100%;
  aspect-ratio: 3 / 3;
  overflow-y: auto;
  border-radius: 12px;
  margin: 12px 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-bg);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-primary);
    border-radius: 8px;
    border: 2px solid var(--color-bg);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-btn-hover-bg);
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 12px;
  }
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text);
}

.tools {
  padding: 0;

  li {
    display: flex;
    align-items: center;
    font-size: 0.95rem;

    .tool-icon {
      width: 20px;
      margin-right: 8px;
    }
  }
}

.tools li {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.tools li strong {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 0.3rem;
  color: var(--color-primary);
}

.tools li p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.tags {
  margin: 16px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    background: var(--color-btn-border);
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    color: white;
  }
}

.links {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  .btn {
    flex: 1;
    min-width: 140px;
    text-align: center;
    padding: 5px 10px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    &.browser {
      background: var(--color-primary);
      color: #fff;

      &:hover {
        background: var(--color-btn-hover-bg);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }
    }

    &.github {
      background: #24292e;
      color: #fff;

      &:hover {
        background: #333d47;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .btn-icon {
    width: 30px;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
