<script setup lang="ts">
import { Form } from '@/components';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section class="contact" id="contact">
    <h2 class="contact__title title2">{{ t('contact.contact') }}</h2>
    <p class="text" v-html="t('contact.contactText')"></p>

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
