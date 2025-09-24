<template>
  <form ref="form" class="form" id="form">
    <div class="name">
      <label class="text1" for="name">
        <p class="form__label">{{ t('contact.name') }}</p>
      </label>
      <input type="text" id="name" name="user_name" class="form__input" :placeholder="t('contact.enterYourName')"
        required />
    </div>

    <div class="email">
      <label class="text1" for="email">
        <p class="form__label">{{ t('contact.email') }}</p>
      </label>
      <input type="email" id="email" name="user_email" class="form__input" :placeholder="t('contact.enterYourEmail')"
        required />
    </div>

    <div class="message">
      <label class="text1" for="message">
        <p class="form__label">{{ t('contact.message') }}</p>
      </label>
      <textarea class="form__input textarea text1" id="message" name="message"
        :placeholder="t('contact.enterYourMessage')" required></textarea>
    </div>

    <div class="buttonForm">
      <button type="submit" class="buttonForm__button" @click="sendEmail">
        <span class="buttonForm__text text">{{ t('contact.submit') }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const form = ref(null);

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

const sendEmail = async (e) => {
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
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
        }),
      }
    );

    if (!response.ok) throw new Error("Telegram API error");

    alert("Message sent successfully!");
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
  box-shadow: 5px 2px 7px -3px var(--color-primary);
  border: 1px solid var(--color-primary);
  padding: 2rem;

  &__label {
    margin: 20px 0px 10px 0px;
  }

  &__input {
    border: 1px solid var(--color-primary);
    background: var(--color-bg);
    padding: 1rem;
    color: var(--color-text);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    font-family: inherit;

    &::placeholder {
      opacity: 0.7;
      font-weight: 400;
      font-size: 20px;
      line-height: 28px;
    }

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 6px var(--color-primary);
    }
  }
}

.textarea {
  min-height: 200px;
  width: 100%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  font-family: inherit;

  &::placeholder {
    opacity: 0.7;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 6px var(--color-primary);
  }
}

.buttonForm {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &__button {
    cursor: pointer;
    width: 30%;
    border: none;
    background: var(--color-primary);
    border-radius: 10px;
    padding: 0.5rem 1rem;

    &:hover {
      background: var(--color-btn-hover-bg);
      color: var(--color-btn-hover-text);
      cursor: pointer;
    }
  }

  &__text {
    font-weight: 600;
    color: white;
    margin: 0 auto;
  }
}

input {
  width: 100%;
}
</style>
