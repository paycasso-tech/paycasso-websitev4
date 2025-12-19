"use client";

import { useEffect, useRef } from "react";

const CHARS = "01abcdef0123456789";

export default function CryptoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const fontSize = 18;
    const cols = Math.floor(canvas.width / fontSize);
    const rows = Math.floor(canvas.height / fontSize);

    ctx.font = `${fontSize}px monospace`;

    const draw = () => {
      // soft fade instead of clear
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255,255,255,0.8)";

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (Math.random() > 0.9) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            ctx.fillText(char, x * fontSize, y * fontSize);
          }
        }
      }
    };

    const interval = setInterval(draw, 120);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}
