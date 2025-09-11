<script setup lang="ts">
import { Form } from '@/components';
</script>

<template>
  <section class="contact" id="contact">
    <h2 class="contact__title title2">Contact</h2>
    <p class="text">
      I am currently seeking new job opportunities that allow me to
      contribute, learn and grow. If you have an opportunity that aligns with
      my skills and experience, please do not hesitate to contact me by
      submitting the form below. You can also
      <a class="link" href="https://drive.google.com/file/d/1kbBJHpm9OVrRh8W-LP6N_bNY2pbkSQMf/view?usp=sharing"
        target="_blank" rel="noreferrer">
        <span> view or download</span>
      </a>
      my resume on my contact page. I will get back to you as soon as
      possible.
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
