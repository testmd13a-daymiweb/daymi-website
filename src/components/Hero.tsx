import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, ChevronDown } from "lucide-react";
import CuriosityOrb from "./CuriosityOrb";
import MagneticButton from "./MagneticButton";
import MiniWaveform from "./MiniWaveform";
import { episodes } from "../data/episodes";
import { useReducedMotion } from "../utils/useReducedMotion";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [orbSpeed, setOrbSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduced = useReducedMotion();
  const latest = episodes[0];

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const orbX = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.8, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const ended = () => setIsPlaying(false);
    audio.addEventListener("ended", ended);
    return () => audio.removeEventListener("ended", ended);
  }, []);

  async function toggleLatest() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    if (audio.src !== new URL(latest.audio, window.location.href).href) {
      audio.src = latest.audio;
      audio.currentTime = 0;
    }
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <section id="top" ref={ref} className="hero-section relative min-h-[100svh] xl:h-[100svh] xl:min-h-[740px] w-full overflow-hidden bg-black">
      <audio ref={audioRef} preload="metadata" src={latest.audio} aria-hidden="true" />
      {/* fire gradient rising from bottom */}
      <div className="pointer-events-none absolute inset-0 grad-fire opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.9),rgba(0,0,0,0.2)_55%,transparent_80%)]" />

      {/* The artwork/background is intentionally NOT transformed on scroll.
          Only the interactive orb is allowed to scale/move, so the hero never
          exposes a shrinking frame or a detached edge. */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/images/og-image.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <motion.div
        style={{ scale: orbScale, x: orbX, opacity: orbOpacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <CuriosityOrb
          isPlaying={isPlaying}
          reduced={reduced}
          radiusScale={0.38}
          interactionScale={1}
          rotationSpeed={orbSpeed}
          pointOpacityBoost={0.10}
          className="h-full w-full"
        />
      </motion.div>

      {/* corner meta tags */}
      <div className="absolute left-5 top-24 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/60 sm:left-8">
        [ New episode ]
      </div>
      <div className="absolute right-5 top-24 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-cream/50 sm:right-8 sm:block">
        [ Persian audio · English site ]
      </div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 flex min-h-[max(640px,100svh)] flex-col justify-end px-5 pb-24 pt-40 sm:px-10 sm:pb-32 xl:h-full">
        <h1 className="text-balance max-w-4xl font-sans text-[clamp(44px,9vw,152px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
          Curiosity that
          <br />
          won't let go.
        </h1>
        <p className="mt-6 max-w-md text-balance text-base sm:text-lg text-gray-light">
          Daymi is a Persian-language podcast about the unexpected — the questions
          nobody asked, answered anyway. The site is in English; the episodes are in Persian.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <MagneticButton
            className="bg-gradient-to-r from-orange-core to-orange-hot text-black shadow-[0_0_30px_rgba(248,127,35,0.5)]"
            cursorLabel="Play"
            onClick={toggleLatest}
          >
            {isPlaying ? <Pause size={16} className="fill-black" /> : <Play size={16} className="fill-black" />}
            {isPlaying ? "Pause the latest episode" : "Listen to the latest episode"}
          </MagneticButton>
          <MagneticButton
            as="a"
            href="#episodes"
            cursorLabel="Browse"
            className="border border-white/15 text-cream hover:border-orange-hot/60"
          >
            Browse episodes
          </MagneticButton>
        </div>
      </motion.div>

      {/* Hero controls — locked to the exact same right edge as the mini player. */}
      <div className="absolute bottom-24 right-5 z-20 hidden w-72 flex-col gap-3 sm:right-8 xl:flex">
        {/* Orb speed control sits directly above the player with a fixed, consistent gap. */}
        <div className="w-full rounded-2xl border border-orange-hot/20 bg-black/35 px-4 py-3 backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="orb-speed" className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/65">Orb speed</label>
            <span className="font-mono text-[10px] tabular-nums text-orange-hot">{orbSpeed.toFixed(2)}×</span>
          </div>
          <input
            id="orb-speed"
            type="range"
            min="0.15"
            max="3.5"
            step="0.05"
            value={orbSpeed}
            onChange={(e) => setOrbSpeed(Number(e.target.value))}
            aria-label="Adjust curiosity orb rotation speed"
            className="orb-speed-slider w-full"
          />
          <div className="mt-1 flex justify-between font-mono text-[8px] uppercase tracking-wider text-gray-mid">
            <span>Slow</span><span>Fast</span>
          </div>
        </div>

        {/* mini player */}
        <div className="glass w-full rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLatest}
            data-cursor={isPlaying ? "Pause" : "Play"}
            aria-label={isPlaying ? "Pause preview" : "Play latest episode"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-core to-orange-hot text-black"
          >
            {isPlaying ? <Pause size={16} className="fill-black" /> : <Play size={16} className="fill-black" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9px] uppercase tracking-wider text-orange-hot">Latest episode</p>
            <bdi className="block truncate text-sm font-medium text-cream" dir="auto">
              {latest.title}
            </bdi>
          </div>
        </div>
        <div className="mt-3">
          <MiniWaveform active={isPlaying} />
        </div>
        <p className="mt-2 text-[11px] text-gray-mid">Original Persian audio · {latest.duration}</p>
        </div>
      </div>

      <motion.a
        href="#ticker"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-cream/50"
        animate={reduced ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
        <ChevronDown size={16} />
      </motion.a>
    </section>
  );
}
