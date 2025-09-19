<template>
  <div class="bg">
    <Canvas />
  </div>
  <Hero />
  <About />
  <Projects />
  <Contact />
</template>

<script lang="js">
import { Canvas } from '@/components';
import { Hero, About, Contact, Projects } from '@/sections';

export default {
  components: {
    Hero,
    About,
    Canvas,
    Contact,
    Projects
  },
};
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: -1;
}
</style>
