<script setup lang="ts">
import { Form } from '@/components';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section class="contact" id="contact">
    <h2 class="contact__title title2">{{ t('contact.contact') }}</h2>
    <p class="text">
      <i18n-t keypath="contact.contactText">
        <template #resumeLink>
          <a class="link" href="https://drive.google.com/file/d/1jdhA3vJxIkG1Xx1H1iss5eDB8JOkn7nk/view?usp=sharing"
            target="_blank" rel="noreferrer">
            <span>view or download</span>
          </a>
        </template>
      </i18n-t>
    </p>
    <div class="section">
      <Form />
    </div>
  </section>
</template>

<style scoped lang="scss">
.link {
  outline: none;
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    text-decoration: underline;
  }
}
</style>
