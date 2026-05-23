import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export type Theme = "light" | "dark";

export const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999, radius: 120 };
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const accent = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-app-highlight")
        .trim();

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles.length = 0;
      for (
        let index = 0;
        index < Math.max(42, Math.floor(width / 18));
        index += 1
      ) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.4 + 0.8,
        });
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const rgb = accent() || "251 188 4";
      const rgba = rgb.split(/\s+/).join(", ");
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < pointer.radius && distance > 0) {
          const force = (pointer.radius - distance) / pointer.radius;
          particle.x -= (dx / distance) * force * 3;
          particle.y -= (dy / distance) * force * 3;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgba}, 0.72)`;
        ctx.fill();

        for (let next = index + 1; next < particles.length; next += 1) {
          const other = particles[next];
          const lineDx = particle.x - other.x;
          const lineDy = particle.y - other.y;
          const lineDistance = Math.sqrt(lineDx * lineDx + lineDy * lineDy);
          if (lineDistance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${rgba}, ${0.11 - lineDistance / 1200})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />
  );
}

export function MotionCard({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.article
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={reveal}
      transition={{ duration: 0.62, delay, ease: "easeOut" }}
    >
      {children}
    </motion.article>
  );
}
