import { useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "../utils/cn";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
};

export default function GlassCard({ children, className, tilt = false }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (tilt) {
      const rx = ((y / rect.height) - 0.5) * -8;
      const ry = ((x / rect.width) - 0.5) * 8;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    }
  }
  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    if (tilt) el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "glass glow-edge relative rounded-[28px] transition-transform duration-300 ease-out",
        className
      )}
      style={{
        backgroundImage:
          "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(248,127,35,0.14), transparent 70%)",
      }}
    >
      {children}
    </div>
  );
}
