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

    const body = document.body;
    const isLight = body.classList.contains("light");
    const rootStyles = getComputedStyle(body);
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
    const ctx = canvas.getContext("2d")!;
    let circles: Circle[] = [];
    let animationFrameId = 0;

    // ❗️ Кешована тема — щоб не читати DOM у циклі
    let isLightTheme = document.body.classList.contains("light");

    // ❗️ Кешування розміру екрана
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
      const lineLength = properties.value.lineLength;
      ctx.lineWidth = 2.5;

      for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
          const dx = circles[j].x - circles[i].x;
          const dy = circles[j].y - circles[i].y;
          const length = Math.sqrt(dx * dx + dy * dy);

          if (length < lineLength) {
            const opacity = 1 - length / lineLength;

            ctx.strokeStyle = isLightTheme
              ? `rgba(255,255,255,${opacity})`
              : `rgba(139,71,98,${opacity})`;

            ctx.beginPath();
            ctx.moveTo(circles[i].x, circles[i].y);
            ctx.lineTo(circles[j].x, circles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    class Circles implements Circle {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
      vX =
        Math.random() * (properties.value.maxV * 2) - properties.value.maxV;
      vY =
        Math.random() * (properties.value.maxV * 2) - properties.value.maxV;
      circlesLife =
        Math.random() * properties.value.circlesLife * 60;
      randomColor =
        properties.value.colors[
        Math.floor(Math.random() * properties.value.colors.length)
        ];
      radius =
        Math.random() *
        (properties.value.maxRadius - properties.value.minRadius) +
        properties.value.minRadius;

      position() {
        const w = canvas.width;
        const h = canvas.height;

        if ((this.x + this.vX > w && this.vX > 0) || (this.x + this.vX < 0 && this.vX < 0))
          this.vX *= -1;
        if ((this.y + this.vY > h && this.vY > 0) || (this.y + this.vY < 0 && this.vY < 0))
          this.vY *= -1;

        this.x += this.vX;
        this.y += this.vY;
      }

      reDraw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.randomColor;
        ctx.fill();
      }

      reLiveCircle() {
        if (this.circlesLife < 1) {
          const p = properties.value;

          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vX = Math.random() * (p.maxV * 2) - p.maxV;
          this.vY = Math.random() * (p.maxV * 2) - p.maxV;
          this.circlesLife = Math.random() * p.circlesLife * 60;
          this.randomColor =
            p.colors[Math.floor(Math.random() * p.colors.length)];
          this.radius =
            Math.random() * (p.maxRadius - p.minRadius) + p.minRadius;
        }
        this.circlesLife--;
      }
    }

    const reDrawCircles = () => {
      for (const c of circles) {
        c.reLiveCircle();
        c.reDraw();
        c.position();
      }
    };

    const loop = () => {
      reDrawBackground();
      drawLines();
      reDrawCircles();
      animationFrameId = requestAnimationFrame(loop);
    };

    const start = () => {
      circles = [];
      for (let i = 0; i < properties.value.maxCircle; i++) {
        circles.push(new Circles());
      }
      loop();
    };

    resizeCanvas();
    updateProperties().then(start);

    window.addEventListener("resize", resizeCanvas);

    const observer = new MutationObserver(() => {
      isLightTheme = document.body.classList.contains("light");
      updateProperties();
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    if (themeClassRef) {
      watch(themeClassRef, () => updateProperties());
    }

    onBeforeUnmount(() => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    });
  });

  return canvasRef;
}
