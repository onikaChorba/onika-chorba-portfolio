<template>
  <canvas ref="canvasRef" class="canvas" />
</template>

<script setup>
import { useCanvas } from './useCanvas';

const canvasRef = useCanvas();
</script>

<style scoped>
.canvas {
  display: block;
  width: 100%;
  height: 100vh;
}
</style>
