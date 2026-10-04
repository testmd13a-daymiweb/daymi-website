import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(true);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
    if (touch) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };

    function onMove(e: PointerEvent) {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
      const target = e.target as HTMLElement;
      const interactive = target.closest("[data-cursor]") as HTMLElement | null;
      setActive(!!target.closest("a,button,[role='button'],input,textarea"));
      setLabel(interactive?.dataset.cursor || null);
    }

    let raf = 0;
    function animate() {
      ring.x = ring.x + (pos.x - ring.x) * 0.18;
      ring.y = ring.y + (pos.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange"
        style={{ backgroundColor: "#f87f23" }}
      />
      <div
        ref={ringRef}
        className={`absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-200 ease-out ${
          label
            ? "h-16 w-16 border-orange-hot/70 bg-orange/10"
            : active
            ? "h-10 w-10 border-orange-hot/60 bg-transparent"
            : "h-7 w-7 border-cream/40 bg-transparent"
        }`}
      >
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-wider text-cream">{label}</span>
        )}
      </div>
    </div>
  );
}
