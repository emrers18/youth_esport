"use client";

import { useEffect, useRef } from "react";

/**
 * Neon "comet trail" that follows the pointer: a pool of glowing dots is
 * spawned along the cursor's path and faded out over their lifespan, so the
 * closest dot is brightest and the trail dissolves shortly after the
 * pointer stops moving. Pooled DOM nodes (transform/opacity only) keep this
 * on the compositor; box-shadow + filter:blur give the neon glow.
 *
 * Purely decorative (aria-hidden, pointer-events-none) — inert on touch
 * devices and when the user prefers reduced motion.
 */

const POOL_SIZE = 40;
const LIFESPAN_MS = 550;
const SPACING_PX = 8;
const NEON_COLORS = ["#22e8ff", "#39ffb0", "#ff3ec8"];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1 -> 0
  size: number;
};

export function CometTrail() {
  const poolRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const pool = poolRef.current;
    const particles: (Particle | null)[] = new Array(POOL_SIZE).fill(null);
    let ringIndex = 0;
    let lastX = -1;
    let lastY = -1;
    let lastFrameTime = performance.now();
    let rafId = 0;

    const spawnAt = (x: number, y: number) => {
      const el = pool[ringIndex];
      if (!el) return;

      const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
      const size = 5 + Math.random() * 5;

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.background = color;
      el.style.boxShadow = `0 0 8px 2px ${color}, 0 0 18px 6px ${color}80`;
      el.style.opacity = "1";

      particles[ringIndex] = {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        life: 1,
        size,
      };

      ringIndex = (ringIndex + 1) % POOL_SIZE;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const { clientX: x, clientY: y } = e;

      if (lastX < 0) {
        spawnAt(x, y);
      } else {
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.hypot(dx, dy);
        const steps = Math.min(Math.max(1, Math.floor(dist / SPACING_PX)), POOL_SIZE);
        for (let i = 1; i <= steps; i++) {
          spawnAt(lastX + (dx * i) / steps, lastY + (dy * i) / steps);
        }
      }
      lastX = x;
      lastY = y;
    };

    const handlePointerLeave = () => {
      lastX = -1;
      lastY = -1;
    };

    const tick = (now: number) => {
      const dt = now - lastFrameTime;
      lastFrameTime = now;

      for (let i = 0; i < POOL_SIZE; i++) {
        const p = particles[i];
        const el = pool[i];
        if (!p || !el) continue;

        p.life -= dt / LIFESPAN_MS;
        if (p.life <= 0) {
          el.style.opacity = "0";
          particles[i] = null;
          continue;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const scale = Math.max(p.life, 0.05);
        el.style.opacity = String(p.life);
        el.style.transform = `translate3d(${p.x - p.size / 2}px, ${p.y - p.size / 2}px, 0) scale(${scale})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {Array.from({ length: POOL_SIZE }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            poolRef.current[i] = el;
          }}
          className="absolute top-0 left-0 rounded-full opacity-0 will-change-transform"
          style={{ filter: "blur(0.5px)" }}
        />
      ))}
    </div>
  );
}
