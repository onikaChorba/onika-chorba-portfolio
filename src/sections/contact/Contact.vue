<template>
  <section class="contact" id="contact">
    <h2 class="contact__title title2">{{ contactTranslations.contact || t('contact.contact') }}</h2>
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
      <Form :contact-translations="contactTranslations" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form } from '@/components';
import { ref, onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';

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
    console.warn("❌ Немає перекладів для about у Firestore");
  }
});

watch(locale, async (newLocale) => {
  const contactDoc = doc(db, "locales", newLocale);
  const contactSnap = await getDoc(contactDoc);
  if (contactSnap.exists()) {
    const messages = contactSnap.data();
    contactTranslations.value = messages.about || {};
    setLocaleMessage(newLocale, messages);
  }
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
