import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { sampleTopics } from "../data/episodes";
import CuriosityOrb from "./CuriosityOrb";

type Node = { id: number; x: number; y: number; size: number; label: string };

const MAP_TOPICS = [
  sampleTopics[0], // déjà vu
  sampleTopics[2], // maps
  sampleTopics[3], // cats
  sampleTopics[4], // boredom
  sampleTopics[6], // yawn
  sampleTopics[8], // time
  sampleTopics[9], // street signs
  sampleTopics[1], // elevator music
];

export default function TopicConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  // Deliberately compact, balanced composition: fewer questions, clearer network.
  const nodes: Node[] = useMemo(() => {
    const positions = [
      [23, 22], [77, 22],
      [15, 51], [85, 51],
      [29, 79], [71, 79],
      [50, 91],
      [50, 9],
    ];
    return MAP_TOPICS.map((label, i) => ({
      id: i,
      x: positions[i][0],
      y: positions[i][1],
      size: 136 + ((i * 11) % 20),
      label,
    }));
  }, []);

  function nearestNode(clientX: number, clientY: number) {
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * 100;
    const py = ((clientY - rect.top) / rect.height) * 100;
    let nearest: Node | null = null;
    let best = Infinity;
    for (const node of nodes) {
      const dx = (px - node.x) * rect.width / 100;
      const dy = (py - node.y) * rect.height / 100;
      const distance = Math.hypot(dx, dy);
      if (distance < best) { best = distance; nearest = node; }
    }
    return best < 175 ? nearest?.id ?? null : null;
  }

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    setActiveId(nearestNode(e.clientX, e.clientY));
  }

  function handleLeave() { setActiveId(null); }

  const activeNode = activeId === null ? null : nodes.find((n) => n.id === activeId) ?? null;
  const particleCount = 5;

  return (
    <section className="relative z-10 overflow-hidden bg-black px-5 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange-hot">[ The curiosity map ]</p>
        <h2 className="mt-3 max-w-xl text-balance font-sans text-[clamp(28px,4.5vw,52px)] font-extrabold leading-[1] tracking-tight text-white">Every episode starts as a question.</h2>
        <p className="mt-4 max-w-lg text-sm leading-6 text-gray-light">Move through the questions. The curiosity orb reaches for the one you are closest to.</p>
      </div>

      <div
        ref={containerRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="relative mx-auto mt-10 hidden h-[540px] max-w-6xl overflow-visible md:block"
      >
        <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {activeNode && (
            <>
              <motion.line
                key={`line-${activeNode.id}`}
                x1="50" y1="50" x2={activeNode.x} y2={activeNode.y}
                vectorEffect="non-scaling-stroke"
                stroke="rgba(248,127,35,0.58)"
                strokeWidth="0.26"
                strokeLinecap="round"
                strokeDasharray="0.8 1.8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              />
              {Array.from({ length: particleCount }).map((_, i) => (
                <motion.circle
                  key={`particle-${activeNode.id}-${i}`}
                  r={i % 2 === 0 ? "0.46" : "0.32"}
                  fill={i % 2 === 0 ? "#F87F23" : "#F16001"}
                  initial={{ cx: 50, cy: 50, opacity: 0 }}
                  animate={{
                    cx: [50, activeNode.x],
                    cy: [50, activeNode.y],
                    opacity: [0, 0.95, 0.85, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    delay: i * 0.27,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
              <motion.circle
                cx={activeNode.x} cy={activeNode.y} r="0.85" fill="#F87F23"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
              />
            </>
          )}
        </svg>

        <div className="absolute left-1/2 top-1/2 z-20 h-32 w-32 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full border border-orange-hot/30 bg-black/45 shadow-[0_0_80px_rgba(248,127,35,0.16)] backdrop-blur-sm">
          <CuriosityOrb radiusScale={0.32} interactionScale={0.9} className="h-full w-full overflow-visible" />
          <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-orange-hot/20" />
        </div>

        {nodes.map((node) => {
          const isActive = activeId === node.id;
          return (
            <motion.button
              key={node.id}
              data-cursor="Explore"
              onMouseEnter={() => setActiveId(node.id)}
              onClick={() => setFilter((f) => (f === node.label ? null : node.label))}
              animate={{ scale: isActive ? 1.07 : 1, y: isActive ? -3 : 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="glass absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-orange-hot/25 px-4 py-3 text-center transition-colors duration-300 hover:border-orange-hot/70"
              style={{ left: `${node.x}%`, top: `${node.y}%`, width: node.size }}
            >
              <span className={`text-xs font-medium leading-4 ${isActive ? "text-cream" : "text-gray-light"}`}>{node.label}</span>
              <span className={`pointer-events-none absolute inset-0 rounded-full bg-orange-hot/20 blur-xl transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`} />
            </motion.button>
          );
        })}
      </div>

      <div className="no-scrollbar mt-10 flex gap-3 overflow-x-auto px-1 pb-2 md:hidden">
        {nodes.map((node) => (
          <button key={node.id} onClick={() => setFilter((f) => (f === node.label ? null : node.label))} className={`glass shrink-0 rounded-full px-4 py-2 text-xs ${filter === node.label ? "border-orange-hot text-cream" : "text-gray-light"}`}>
            {node.label}
          </button>
        ))}
      </div>

      {filter && <p className="mt-6 text-center font-mono text-xs text-orange-hot">Showing episodes about "{filter}" — connect this filter to your real episode list.</p>}
    </section>
  );
}
