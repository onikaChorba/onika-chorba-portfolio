import { ref, onMounted, onBeforeUnmount, watch, Ref, nextTick } from "vue";

interface Properties {
  bg: string;
  colors: string[];
  radius: number;
  maxCircle: number;
  maxV: number;
  minRadius: number;
  maxRadius: number;
  lineLength: number;
  circlesLife: number;
}

interface Circle {
  x: number;
  y: number;
  vX: number;
  vY: number;
  circlesLife: number;
  randomColor: string;
  radius: number;
  position(): void;
  reDraw(): void;
  reLiveCircle(): void;
}

export function useCanvas(themeClassRef?: Ref<string>) {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const properties = ref<Properties>({
    bg: "#fff",
    colors: ["#000"],
    radius: 1,
    maxCircle: 80,
    maxV: 0.5,
    minRadius: 1.5,
    maxRadius: 3,
    lineLength: 150,
    circlesLife: 18,
  });

  const updateProperties = async () => {
    await nextTick();
    const rootStyles = getComputedStyle(document.body);
    const isLight = document.body.classList.contains("light");
    const width = window.innerWidth;

    properties.value = {
      bg: rootStyles.getPropertyValue("--color-bg").trim(),
      colors: isLight
        ? [
          rootStyles.getPropertyValue("--color-text").trim(),
          rootStyles.getPropertyValue("--color-primary").trim(),
          "#DED9DB",
          "#FFFEFF",
        ]
        : [
          rootStyles.getPropertyValue("--color-text").trim(),
          rootStyles.getPropertyValue("--color-primary").trim(),
          "#888",
          "#fff",
        ],
      radius: 1,
      maxCircle: width < 768 ? 50 : 80,
      maxV: 0.5,
      minRadius: 1.5,
      maxRadius: 3,
      lineLength: width < 768 ? 100 : 150,
      circlesLife: 18,
    };
  };

  onMounted(() => {
    const canvas = canvasRef.value!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let circles: Circle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateProperties();
    };

    const reDrawBackground = () => {
      ctx.fillStyle = properties.value.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawLines = () => {
      for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
          const x1 = circles[i].x;
          const y1 = circles[i].y;
          const x2 = circles[j].x;
          const y2 = circles[j].y;

          const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          const isLight = document.body.classList.contains("light");

          if (length < properties.value.lineLength) {
            const opacity = 1 - length / properties.value.lineLength;
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = isLight
              ? `rgba(255,255,255,${opacity})`
              : `rgba(139,71,98,${opacity})`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
    };

    class Circles implements Circle {
      x: number;
      y: number;
      vX: number;
      vY: number;
      circlesLife: number;
      randomColor: string;
      radius: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vX =
          Math.random() * (properties.value.maxV * 2) - properties.value.maxV;
        this.vY =
          Math.random() * (properties.value.maxV * 2) - properties.value.maxV;
        this.circlesLife = Math.random() * properties.value.circlesLife * 60;
        this.randomColor =
          properties.value.colors[
          Math.floor(Math.random() * properties.value.colors.length)
          ];
        this.radius =
          Math.random() *
          (properties.value.maxRadius - properties.value.minRadius) +
          properties.value.minRadius;
      }

      position() {
        if (
          (this.x + this.vX > canvas.width && this.vX > 0) ||
          (this.x + this.vX < 0 && this.vX < 0)
        ) {
          this.vX *= -1;
        }
        if (
          (this.y + this.vY > canvas.height && this.vY > 0) ||
          (this.y + this.vY < 0 && this.vY < 0)
        ) {
          this.vY *= -1;
        }
        this.x += this.vX;
        this.y += this.vY;
      }

      reDraw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.randomColor;
        ctx.fill();
      }

      reLiveCircle() {
        if (this.circlesLife < 1) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vX =
            Math.random() * (properties.value.maxV * 2) -
            properties.value.maxV;
          this.vY =
            Math.random() * (properties.value.maxV * 2) -
            properties.value.maxV;
          this.circlesLife =
            Math.random() * properties.value.circlesLife * 60;
          this.randomColor =
            properties.value.colors[
            Math.floor(Math.random() * properties.value.colors.length)
            ];
          this.radius =
            Math.random() *
            (properties.value.maxRadius - properties.value.minRadius) +
            properties.value.minRadius;
        }
        this.circlesLife--;
      }
    }

    const reDrawCircles = () => {
      for (let i = 0; i < circles.length; i++) {
        circles[i].reLiveCircle();
        circles[i].reDraw();
        circles[i].position();
      }
    };

    const loop = () => {
      reDrawBackground();
      drawLines();
      reDrawCircles();
      animationFrameId = requestAnimationFrame(loop);
    };

    const animate = () => {
      circles = [];
      for (let i = 0; i < properties.value.maxCircle; i++) {
        circles.push(new Circles());
      }
      loop();
    };

    resizeCanvas();
    updateProperties().then(animate);

    window.addEventListener("resize", resizeCanvas);

    const observer = new MutationObserver(() => updateProperties());
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    if (themeClassRef) {
      watch(themeClassRef, () => {
        updateProperties();
      });
    }

    onBeforeUnmount(() => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    });
  });

  return canvasRef;
}
