import { ArrowUpRight } from "lucide-react";
import GlassCard from "./GlassCard";
import { LISTEN_GROUPS } from "../data/platforms";

export default function WhereToListen() {
  return (
    <section className="relative z-10 bg-black px-5 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange-hot">[ Where to listen ]</p>
        <h2 className="mt-3 text-balance font-sans text-[clamp(28px,4.5vw,52px)] font-extrabold leading-[1] tracking-tight text-white">
          Pick your language and platform.
        </h2>

        {LISTEN_GROUPS.map((group) => (
          <div key={group.language} className="mt-10">
            <h3 className="mb-4 text-xl font-bold text-cream">{group.label}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {group.platforms.map((p) => (
            <a key={p.name} href={p.href} target="_blank" rel="noreferrer" data-cursor="Open">
              <GlassCard className="flex h-full flex-col justify-between gap-6 p-6">
                <div className="flex items-center justify-between">
                  <p.icon size={22} className="text-orange-hot" />
                  <ArrowUpRight size={16} className="text-gray-mid transition-colors group-hover:text-cream" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{p.name}</p>
                  <p className="mt-1 text-sm text-gray-light">{p.blurb}</p>
                </div>
              </GlassCard>
            </a>
          ))}
            </div>
          </div>
        ))}

        <GlassCard className="mt-6 flex flex-col items-start justify-between gap-6 p-5 sm:p-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-lg font-bold text-white">Not sure where to start?</p>
            <p className="mt-1 max-w-md text-sm text-gray-light">
              [FILL IN] Link three starter episodes here once they're picked — good on-ramps for new listeners.
            </p>
          </div>
          <a
            href="#episodes"
            data-cursor="Open"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-orange-hot/30 px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:border-orange-hot/70"
          >
            See starter episodes <ArrowUpRight size={14} />
          </a>
        </GlassCard>
      </div>
    </section>
  );
}
