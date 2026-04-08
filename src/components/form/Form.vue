<template>
  <form ref="form" class="form" @submit.prevent="sendEmail">
    <div class="form-group">
      <label class="text1" for="name">
        <p class="form__label">{{ contactTranslations.name || t('contact.name') }}</p>
      </label>
      <input v-model.trim="formData.user_name" type="text" id="name" class="form__input"
        :class="{ 'input-error': errors.user_name }"
        :placeholder="contactTranslations.enterYourName || t('contact.enterYourName')" @input="errors.user_name = ''" />
      <span v-if="errors.user_name" class="error-text">{{ errors.user_name }}</span>
    </div>

    <div class="form-group">
      <label class="form__label text1" for="email">{{ contactTranslations.email || t('contact.email') }}</label>
      <input v-model.trim="formData.user_email" type="email" id="email" class="form__input"
        :class="{ 'input-error': errors.user_email }"
        :placeholder="contactTranslations.enterYourEmail || t('contact.enterYourEmail')" @input="validateEmailField" />
      <span v-if="errors.user_email" class="error-text">{{ errors.user_email }}</span>
    </div>

    <div class="form-group">
      <label class="text1" for="message">
        <p class="form__label">{{ contactTranslations.message || t('contact.message') }}</p>
      </label>
      <textarea v-model.trim="formData.message" class="form__input textarea text1" id="message"
        :class="{ 'input-error': errors.message }"
        :placeholder="contactTranslations.enterYourMessage || t('contact.enterYourMessage')"
        @input="errors.message = ''"></textarea>
      <span v-if="errors.message" class="error-text">{{ errors.message }}</span>
    </div>

    <div class="buttonForm">
      <button type="submit" class="buttonForm__button" :disabled="isSubmitting">
        <span class="buttonForm__text text">
          {{ isSubmitting ? '...' : (contactTranslations.submit || t('contact.submit')) }}
        </span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useI18n } from 'vue-i18n';

const props = defineProps<{ contactTranslations: Record<string, string> }>();
const { t } = useI18n();

const isSubmitting = ref(false);

const formData = reactive({
  user_name: '',
  user_email: '',
  message: ''
});

const errors = reactive({
  user_name: '',
  user_email: '',
  message: ''
});

const validateEmailField = () => {
  const email = formData.user_email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.user_email = "Email є обов'язковим";
  } else if (!emailRegex.test(email)) {
    errors.user_email = "Введіть коректну адресу (наприклад: example@mail.com)";
  } else {
    errors.user_email = "";
  }
};

const validateForm = () => {
  let isValid = true;

  errors.user_name = '';
  errors.user_email = '';
  errors.message = '';

  if (!formData.user_name) {
    errors.user_name = "Ім'я обов'язкове";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.user_email) {
    errors.user_email = "Email обов'язковий";
    isValid = false;
  } else if (!emailRegex.test(formData.user_email)) {
    errors.user_email = "Невірний формат (наприклад: name@mail.com)";
    isValid = false;
  }

  if (!formData.message) {
    errors.message = "Повідомлення не може бути порожнім";
    isValid = false;
  }

  return isValid;
};

const handleInput = (field: keyof typeof errors) => {
  errors[field] = '';
};

const sendEmail = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  const text = `Нове повідомлення:\nІм'я: ${formData.user_name}\nEmail: ${formData.user_email}\nПовідомлення: ${formData.message}`;

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

    alert("Повідомлення надіслано!");

    formData.user_name = '';
    formData.user_email = '';
    formData.message = '';
  } catch (error) {
    alert("Помилка при відправці");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.input-error {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 2px #ff4d4f !important;
}

.error-text {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.buttonForm__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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
    color: white;

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
