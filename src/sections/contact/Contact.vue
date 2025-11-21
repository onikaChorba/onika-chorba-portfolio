<template>
  <section class="contact" id="contact">
    <h2 class="contact__title title2">{{ contactTranslations.contact || t('contact.contact') }}</h2>
    <p class="text" v-html="contactTextWithLink"></p>
    <div class="section">
      <Form :contact-translations="contactTranslations" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Form } from '@/components';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import { ref, onMounted, computed, watch } from 'vue';

const { locale, t, setLocaleMessage } = useI18n<{ locale: string; t: any }>();
const contactTranslations = ref<Record<string, string>>({});

onMounted(async () => {
  const contactDoc = doc(db, "locales", locale.value);
  const contactSnap = await getDoc(contactDoc);
  if (contactSnap.exists()) {
    const messages = contactSnap.data();
    contactTranslations.value = messages.contact || {};
    setLocaleMessage(locale.value, messages);
  } else {
    alert("❌ Немає перекладів для about у Firestore");
  }
});

watch(locale, async (newLocale) => {
  const contactDoc = doc(db, "locales", newLocale);
  const contactSnap = await getDoc(contactDoc);
  if (contactSnap.exists()) {
    const messages = contactSnap.data();
    contactTranslations.value = messages.contact || {};
    setLocaleMessage(newLocale, messages);
  }
});

const contactTextWithLink = computed(() => {
  const base = contactTranslations.value.contactText || t('contact.contactText');
  const linkHtml = `<a class="link" href="/resume">${contactTranslations.value.viewOrDownload || t('contact.viewOrDownload')}</a>`;
  return base.replace('{resumeLink}', linkHtml);
});

</script>

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
