<template>
  <div class="bg">
    <Canvas />
  </div>
  <Hero />
  <About />
</template>

<script lang="js">
import { Canvas } from '@/components';
import { Hero, About } from '@/sections';

export default {
  components: {
    Canvas,
    About,
    Hero
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
