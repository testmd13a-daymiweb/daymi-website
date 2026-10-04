import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const TEXT =
  "We chase the questions nobody asked us to. Because curiosity, when it's stubborn enough, always gets its answer.";

function Word({
  word,
  progress,
  index,
  total,
}: {
  word: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="mx-[0.18em] inline-block">
      {word}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.3"] });
  const words = TEXT.split(" ");

  return (
    <section ref={ref} className="relative z-10 min-h-[160vh] bg-black">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(248,127,35,0.55), rgba(193,8,1,0.35) 45%, transparent 75%)",
          }}
        />
        <p className="relative max-w-4xl text-balance text-center font-sans text-[clamp(24px,4.2vw,56px)] font-semibold leading-[1.25] tracking-tight text-gray-light">
          {words.map((w, i) => (
            <Word key={i} word={w} progress={scrollYProgress} index={i} total={words.length} />
          ))}
        </p>
      </div>
    </section>
  );
}
