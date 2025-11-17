<template>
  <form ref="form" class="form" id="form">
    <div class="name">
      <label class="text1" for="name">
        <p class="form__label">{{ contactTranslations.name || t('contact.name') }}</p>
      </label>
      <input type="text" id="name" name="user_name" class="form__input"
        :placeholder="contactTranslations.enterYourName || t('contact.enterYourName')" required />
    </div>

    <div class="email">
      <label class="text1" for="email">
        <p class="form__label">{{ contactTranslations.email || t('contact.email') }}</p>
      </label>
      <input type="email" id="email" name="user_email" class="form__input"
        :placeholder="contactTranslations.enterYourEmail || t('contact.enterYourEmail')" required />
    </div>

    <div class="message">
      <label class="text1" for="message">
        <p class="form__label">{{ contactTranslations.message || t('contact.message') }}</p>
      </label>
      <textarea class="form__input textarea text1" id="message" name="message"
        :placeholder="contactTranslations.enterYourMessage || t('contact.enterYourMessage')" required></textarea>
    </div>

    <div class="buttonForm">
      <button type="submit" class="buttonForm__button" @click="sendEmail" aria-label="submit button">
        <span class="buttonForm__text text">{{ contactTranslations.submit || t('contact.submit') }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from 'vue-i18n';

const form = ref(null);
const props = defineProps<{ contactTranslations: Record<string, string> }>();
const { t } = useI18n();

const localTranslations = ref({});
watch(
  () => props.contactTranslations,
  (newVal) => {
    localTranslations.value = newVal;
  },
  { deep: true, immediate: true }
);

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

const sendEmail = async (e: any) => {
  e.preventDefault();
  if (!form.value) return;

  const formData = new FormData(form.value);
  const name = formData.get("user_name");
  const email = formData.get("user_email");
  const message = formData.get("message");

  const text = `New message from contact form:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text }),
      }
    );

    if (!response.ok) throw new Error("Telegram API error");

    alert("Message sent successfully!");
    //@ts-ignore
    form.value.reset();
  } catch (error) {
    console.error(error);
    alert("Failed to send message.");
  }
};
</script>

<style scoped lang="scss">
.form {
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem;
  box-shadow: 5px 2px 7px -3px var(--color-primary);
  border: 1px solid var(--color-primary);

  &__label {
    margin: 10px 0 5px 0;
    font-size: 16px;
  }

  &__input {
    width: 100%;
    border: 1px solid var(--color-primary);
    background: var(--color-bg);
    padding: 0.8rem;
    color: var(--color-text);
    font-size: 16px;
    line-height: 22px;
    font-family: inherit;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &::placeholder {
      opacity: 0.7;
      font-size: 16px;
      line-height: 22px;
    }

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 4px var(--color-primary);
    }
  }
}

.textarea {
  width: 100%;
  min-height: 120px;
  padding: 0.8rem;
  font-size: 16px;
  line-height: 22px;
  font-family: inherit;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &::placeholder {
    font-size: 16px;
    line-height: 22px;
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 4px var(--color-primary);
  }
}

.buttonForm {
  margin-top: 1rem;
  display: flex;
  justify-content: center;

  &__button {
    cursor: pointer;
    width: 60%;
    min-width: 100px;
    border: none;
    border-radius: 8px;
    background: var(--color-primary);
    padding: 0.35rem 0.6rem;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background: var(--color-btn-hover-bg);
      color: var(--color-btn-hover-text);
    }
  }

  &__text {
    color: white;
  }
}

@media (max-width: 768px) {
  .form {
    padding: 1rem;
  }

  .form__input,
  .textarea {
    font-size: 14px;
    line-height: 20px;
    padding: 0.6rem;
  }

  .textarea {
    min-height: 100px;
  }

  .buttonForm__button {
    width: 70%;
    padding: 0.3rem 0.5rem;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .form {
    padding: 0.8rem;
  }

  .form__input,
  .textarea {
    font-size: 13px;
    line-height: 18px;
    padding: 0.5rem;
  }

  .textarea {
    min-height: 80px;
  }

  .buttonForm__button {
    width: 80%;
    padding: 0.25rem 0.5rem;
    font-size: 13px;
  }
}
</style>
