"use client";

import { useEffect } from "react";

const COLORS = ["#C8102E", "#1B2A4A", "#D4C4A0", "#F5F0E6"];

export function PaymentConfetti() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    void import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 90,
        spread: 72,
        startVelocity: 36,
        origin: { y: 0.62 },
        colors: COLORS,
        disableForReducedMotion: true,
      });

      const burst = (x: number) => {
        confetti({
          particleCount: 44,
          angle: x < 0.5 ? 60 : 120,
          spread: 58,
          origin: { x, y: 0.72 },
          colors: COLORS,
          disableForReducedMotion: true,
        });
      };

      window.setTimeout(() => burst(0.18), 180);
      window.setTimeout(() => burst(0.82), 280);
    });
  }, []);

  return null;
}
