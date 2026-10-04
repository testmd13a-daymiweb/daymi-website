import MagneticButton from "./MagneticButton";
import { Play } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative z-10 bg-black px-5 pb-10 pt-4 sm:px-10">
      <div
        className="relative mx-auto flex max-w-6xl flex-col items-center overflow-hidden rounded-[28px] px-8 py-20 text-center sm:py-28"
        style={{
          background: "linear-gradient(180deg, #1a0d08 0%, #7a2a05 55%, #e85002 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{ background: "radial-gradient(60% 100% at 50% 100%, rgba(255,186,120,0.65), transparent 75%)" }}
        />
        <p className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-black/70">
          [ Stubborn curiosity ]
        </p>
        <h2 className="relative mt-4 text-balance font-sans text-[clamp(32px,6vw,76px)] font-extrabold leading-[0.98] tracking-tight text-black">
          Ready to get curious?
        </h2>
        <div className="relative mt-8">
          <MagneticButton
            as="a"
            href="#top"
            cursorLabel="Listen"
            className="bg-black text-cream shadow-[0_0_30px_rgba(0,0,0,0.35)]"
          >
            <Play size={16} className="fill-cream" />
            Listen now
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
