<template>
  <div class="bg">
    <Canvas />
  </div>
  <Header />
  <Hero />
</template>

<script lang="js">
import { Header, Canvas } from '@/components';
import { Hero } from '@/sections';

export default {
  components: {
    Canvas,
    Header,
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
