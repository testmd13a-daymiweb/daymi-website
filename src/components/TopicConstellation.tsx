import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { englishEpisodeFallback } from "../data/englishEpisodes";
import { useOverlay } from "../utils/useOverlay";
import CuriosityOrb from "./CuriosityOrb";

type MapEpisode = { id: string; title: string };
const POSITIONS = [[23, 22], [77, 22], [15, 51], [85, 51], [29, 79], [71, 79], [50, 91], [50, 9]];

export default function TopicConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1152, height: 540 });
  const [episodes, setEpisodes] = useState<MapEpisode[]>(englishEpisodeFallback);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<MapEpisode | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/episodes?language=english", { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(data => {
        if (Array.isArray(data.episodes) && data.episodes.length) {
          setEpisodes(data.episodes.slice(0, 8).map((episode: { youtubeId: string; title: string }) => ({
            id: episode.youtubeId,
            title: episode.title.replace(/^Episode\s*-\s*\d+\s*-\s*/i, ""),
          })));
        }
      }).catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);

  useOverlay(!!selected, () => setSelected(null));

  const nodes = useMemo(() => episodes.map((episode, index) => ({
    ...episode, x: POSITIONS[index][0] * size.width / 100,
    y: POSITIONS[index][1] * size.height / 100,
  })), [episodes, size]);
  const active = nodes.find(node => node.id === activeId);
  const center = { x: size.width / 2, y: size.height / 2 };
  const dx = active ? active.x - center.x : 0;
  const dy = active ? active.y - center.y : 0;
  const distance = Math.hypot(dx, dy) || 1;
  const start = { x: center.x + dx / distance * 66, y: center.y + dy / distance * 66 };
  // Stop at the edge of the label instead of crossing its text.
  const edgeDistance = Math.min(88 / Math.max(Math.abs(dx / distance), 0.001), 34 / Math.max(Math.abs(dy / distance), 0.001));
  const end = active ? { x: active.x - dx / distance * edgeDistance, y: active.y - dy / distance * edgeDistance } : center;

  return (
    <section className="relative z-10 overflow-hidden bg-black px-5 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange-hot">[ The curiosity map ]</p>
        <h2 className="mt-3 max-w-xl text-balance text-[clamp(28px,4.5vw,52px)] font-extrabold leading-none tracking-tight text-white">Every episode starts as a question.</h2>
        <p className="mt-4 max-w-lg text-sm leading-6 text-gray-light">Explore real stories from Daymi in English. Pick an episode and follow your curiosity.</p>
      </div>
      <div ref={containerRef} onPointerMove={event => {
        if (event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        const nearest = nodes.map(node => ({ node, distance: Math.hypot(event.clientX - rect.left - node.x, event.clientY - rect.top - node.y) })).sort((a,b) => a.distance-b.distance)[0];
        setActiveId(nearest && nearest.distance < 140 ? nearest.node.id : null);
      }} onPointerLeave={() => setActiveId(null)} className="relative mx-auto mt-10 hidden h-[540px] max-w-6xl lg:block">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
          {active && <g key={active.id}>
            <motion.line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#F87F23" strokeWidth={1.2} strokeOpacity={0.5} strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            {!reduced && Array.from({ length: 4 }, (_, index) => <motion.circle key={index} r={index % 2 ? 2.5 : 3.5} fill="#F87F23" initial={{ cx: start.x, cy: start.y, opacity: 0 }} animate={{ cx: [start.x, end.x], cy: [start.y, end.y], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.8, delay: index * 0.4, repeat: Infinity, ease: "linear" }} />)}
            <circle cx={end.x} cy={end.y} r={3} fill="#F87F23" />
          </g>}
        </svg>
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-orange-hot/30 bg-black shadow-[0_0_60px_rgba(248,127,35,0.15)]">
          <CuriosityOrb radiusScale={0.38} interactionScale={0} reduced={!!reduced} className="h-full w-full" />
        </div>
        {nodes.map(node => <div key={node.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: node.x, top: node.y }}>
          <motion.button data-cursor="Play" onFocus={() => setActiveId(node.id)} onBlur={() => setActiveId(null)} onClick={() => setSelected(node)} animate={{ scale: activeId === node.id ? 1.04 : 1 }} className="glass relative flex h-[68px] w-44 items-center justify-center rounded-full border-orange-hot/25 px-4 text-center hover:border-orange-hot/70 focus-visible:outline focus-visible:outline-orange-hot" title={node.title}>
            <span className={`line-clamp-3 text-xs font-medium leading-4 ${activeId === node.id ? "text-cream" : "text-gray-light"}`}>{node.title}</span>
          </motion.button>
        </div>)}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
        {episodes.map(episode => <button key={episode.id} onClick={() => setSelected(episode)} className="glass rounded-2xl px-4 py-3 text-left text-sm text-cream">{episode.title}</button>)}
      </div>
      {createPortal(<AnimatePresence>{selected && <motion.div role="dialog" aria-modal="true" aria-label={selected.title} data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
        <div onClick={event => event.stopPropagation()} className="glass relative max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain w-full max-w-3xl rounded-3xl p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4"><h3 className="text-lg font-bold text-cream">{selected.title}</h3><button autoFocus aria-label="Close episode" onClick={() => setSelected(null)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20"><X size={18} /></button></div>
          <iframe src={`https://www.youtube.com/embed/${selected.id}?autoplay=1`} title={selected.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="aspect-video min-h-[200px] w-full rounded-2xl" />
        </div>
      </motion.div>}</AnimatePresence>, document.body)}
    </section>
  );
}
