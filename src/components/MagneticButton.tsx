import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode, MouseEvent, ElementType } from "react";
import { cn } from "../utils/cn";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  cursorLabel?: string;
  target?: string;
  rel?: string;
};

export default function MagneticButton({
  children,
  className,
  as = "button",
  href,
  onClick,
  cursorLabel,
  target,
  rel,
}: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 });

  function handleMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const Comp = motion[as === "a" ? "a" : "button"] as ElementType;

  return (
    <Comp
      data-cursor={cursorLabel}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold transition-colors duration-300",
        className
      )}
    >
      {children}
    </Comp>
  );
}
