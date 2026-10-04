import { useEffect, useRef } from "react";
import { sampleTopics } from "../data/episodes";
import { useReducedMotion } from "../utils/useReducedMotion";

function Row({ reverse = false, speedRef }: { reverse?: boolean; speedRef: React.MutableRefObject<number> }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let pos = 0;
    let raf = 0;
    function tick() {
      const el = trackRef.current;
      if (el && !hoverRef.current) {
        const base = 0.6 * (reverse ? -1 : 1);
        pos += base * speedRef.current;
        const width = el.scrollWidth / 2;
        if (pos <= -width) pos += width;
        if (pos > 0) pos -= width;
        el.style.transform = `translateX(${pos}px)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reverse, reduced, speedRef]);

  const items = [...sampleTopics, ...sampleTopics];

  return (
    <div
      className="overflow-hidden whitespace-nowrap py-3"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      <div ref={trackRef} className="inline-flex items-center gap-8 will-change-transform">
        {items.map((topic, i) => (
          <span key={i} className="inline-flex items-center gap-8">
            <span
              className={`font-sans text-3xl font-extrabold tracking-tight sm:text-5xl ${
                reverse ? "text-transparent [-webkit-text-stroke:1px_#f87f23]" : "text-cream/90"
              }`}
            >
              {topic}
            </span>
            <span className="text-2xl text-orange-hot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TopicsTicker() {
  const speedRef = useRef(1);

  useEffect(() => {
    let last = window.scrollY;
    let decay: number;
    function onScroll() {
      const delta = Math.abs(window.scrollY - last);
      last = window.scrollY;
      speedRef.current = Math.min(6, 1 + delta * 0.15);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    decay = window.setInterval(() => {
      speedRef.current = speedRef.current + (1 - speedRef.current) * 0.05;
    }, 50);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(decay);
    };
  }, []);

  return (
    <section id="ticker" className="relative z-10 border-y border-white/5 bg-black py-8">
      <Row speedRef={speedRef} />
      <Row reverse speedRef={speedRef} />
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-gray-mid">
        Sample topics — swap in real episode titles once the feed is connected
      </p>
    </section>
  );
}
