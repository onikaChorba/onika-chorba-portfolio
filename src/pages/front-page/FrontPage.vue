<template>
  <div class="bg">
    <Canvas />
  </div>
  <Hero />
  <About />
  <Projects />
  <Contact />

  <div class="contact-btns">
    <a v-for="(contactBtn, indx) in contactBtns" :key="indx" :href="contactBtn.href" target="_blank">
      <img :src="contactBtn.src" :alt="contactBtn.src" v-html="contactBtn.svg" />
    </a>
  </div>
</template>

<script lang="js">
import { icons } from '../../icons';
import { Canvas } from '@/components';
import { Hero, About, Contact, Projects } from '@/sections';

const contactBtns = [
  { href: "https://github.com/onikaChorba", src: icons.gitHub },
  {
    href: "https://www.linkedin.com/in/оnika-chorba-2b0339198/",
    src: icons.linkedin,
  },
  { href: "mailto:onika.chorba@gmail.com", src: icons.gmail },
];

export default {
  components: {
    Hero,
    About,
    Canvas,
    Contact,
    Projects
  },
  data() {
    return {
      contactBtns: [
        { href: "https://github.com/onikaChorba", src: icons.find(i => i.alt === 'gitHub').src },
        { href: "https://www.linkedin.com/in/оnika-chorba-2b0339198/", src: icons.find(i => i.alt === 'linkedin').src },
        { href: "mailto:onika.chorba@gmail.com", src: icons.find(i => i.alt === 'gmail').src },
      ]
    }
  }
};
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: -1;
}

.contact-btns {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
  border-radius: 0 12px 12px 0;
  background: var(--content-bg);
  box-shadow: var(--box-shadow);
  backdrop-filter: blur(6px);

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border: 2px solid var(--color-btn-border);
    border-radius: 50%;
    background: var(--color-bg);
    transition: all 0.25s ease;
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
      object-fit: contain;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
      transition: transform 0.2s ease;
    }

    &:hover {
      background: var(--color-btn-hover-bg);
      border-color: var(--color-btn-hover-bg);
      transform: translateX(4px);

      img {
        transform: scale(1.15);
        filter: brightness(1.1);
      }
    }
  }
}
</style>
