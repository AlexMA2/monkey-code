"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiProps {
  duration?: number;
}

export function Confetti({ duration = 4000 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const gravity = 0.25;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = ["#ff5964", "#35a7ff", "#38b000", "#ffc300", "#ff9f1c", "#e0aaff"];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.8,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 16 - 8,
        speedY: -Math.random() * 15 - 10,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 8 - 4,
        opacity: 1,
      });
    }

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration && particles.length === 0) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (elapsed < duration * 0.7 && Math.random() < 0.4) {
        particles.push({
          x: 0,
          y: canvas.height * 0.8,
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 10 + 5,
          speedY: -Math.random() * 12 - 5,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 8 - 4,
          opacity: 1,
        });
        particles.push({
          x: canvas.width,
          y: canvas.height * 0.8,
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: -Math.random() * 10 - 5,
          speedY: -Math.random() * 12 - 5,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 8 - 4,
          opacity: 1,
        });
      }

      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += gravity;
        p.rotation += p.rotationSpeed;

        if (elapsed > duration * 0.8) {
          p.opacity -= 0.02;
        }

        if (p.y > canvas.height || p.x < -20 || p.x > canvas.width + 20 || p.opacity <= 0) {
          particles.splice(idx, 1);
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          
          if (idx % 2 === 0) {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, 2 * Math.PI);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
    />
  );
}
