import { useEffect, useRef } from "react";

export default function MiniWaveform({ active = false, bars = 28 }: { active?: boolean; bars?: number }) {
  const barsRef = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    let t = 0;
    function tick() {
      t += active ? 0.14 : 0.03;
      barsRef.current.forEach((el, i) => {
        if (!el) return;
        const base = active ? 0.25 : 0.08;
        const h = base + Math.abs(Math.sin(t + i * 0.6)) * (active ? 0.75 : 0.15);
        el.style.transform = `scaleY(${h})`;
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <div className="flex h-6 items-center gap-[2px]" aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) barsRef.current[i] = el;
          }}
          className="h-full w-[3px] origin-center rounded-full bg-gradient-to-t from-orange-core to-orange-hot"
          style={{ transform: "scaleY(0.1)" }}
        />
      ))}
    </div>
  );
}
