import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const PERSIAN_TEXT =
  "ما دنبال سؤال‌هایی می‌رویم که هیچ‌کس از ما نخواسته جوابشان را پیدا کنیم. چون کنجکاوی، وقتی دست‌بردار نباشد، بالاخره به جوابش می‌رسد.";

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
  const passages = [{ text: TEXT, language: "en", direction: "ltr" }, { text: PERSIAN_TEXT, language: "fa", direction: "rtl" }] as const;

  return (
    <section id="manifesto" ref={ref} className="relative z-10 min-h-[160vh] bg-black">
      <div className="sticky top-0 flex min-h-[100svh] items-center justify-center px-5 py-28 sm:px-10">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(248,127,35,0.55), rgba(193,8,1,0.35) 45%, transparent 75%)",
          }}
        />
        <div className="relative grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16" dir="ltr">
          {passages.map(({ text, language, direction }) => {
            const words = text.split(" ");
            return (
              <p key={language} lang={language} dir={direction} className={`text-balance text-[clamp(24px,3vw,42px)] font-semibold text-gray-light ${language === "fa" ? "fa-text text-right leading-[1.8]" : "font-sans text-left leading-[1.4] tracking-tight"}`}>
                {words.map((word, index) => <Word key={index} word={word} progress={scrollYProgress} index={index} total={words.length} />)}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
