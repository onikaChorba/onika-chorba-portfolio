<template>
  <form ref="form" class="form" id="form">
    <div class="name">
      <label class="text1" for="name" id="name">
        <p class="form__label">Name</p>
      </label>
      <input type="text" id="name" name="user_name" class="form__input" placeholder="Enter Your Name" />
    </div>

    <div class="email">
      <label class="text1" for="email">
        <p class="form__label">Email</p>
      </label>
      <input type="email" id="email" name="user_email" class="form__input" placeholder="Enter Your Email" />
    </div>

    <div class="message">
      <label class="text1" for="message">
        <p class="form__label">Message</p>
      </label>
      <textarea class="form__input textarea text1" id="message" name="message" placeholder="Enter Your Message" />
    </div>

    <div class="buttonForm">
      <button type="submit" class="buttonForm__button">
        <span class="buttonForm__text text">Submit</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";

const sendEmail = (e) => {

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
  transition-duration: 0.3s;

  &__button {
    width: 30%;
    border: none;
    background: var(--color-primary);
    border-radius: 10px;
    padding: 0.5rem 1rem;
  }

  &__text {
    font-weight: 600;
    color: var(--color-text);
    margin: 0 auto;
  }

  &:hover {
    background: var(--color-btn-hover-bg);
    color: var(--color-btn-hover-text);
    cursor: pointer;
  }
}

input {
  width: 100%;
}
</style>
