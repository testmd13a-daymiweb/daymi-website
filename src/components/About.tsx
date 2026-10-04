import GlassCard from "./GlassCard";

export default function About() {
  return (
    <section id="about" className="relative z-10 bg-black px-5 py-24 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[28px]"
          style={{
            background:
              "radial-gradient(120% 100% at 30% 100%, rgba(248,127,35,0.65), rgba(193,8,1,0.35) 45%, #000 85%)",
          }}
        >
          <div className="absolute inset-0 flex items-end p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/70">
              [ Host photo — FILL IN ]
            </p>
          </div>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange-hot">[ About ]</p>
          <h2 className="mt-3 text-balance font-sans text-[clamp(28px,4.5vw,52px)] font-extrabold leading-[1] tracking-tight text-white">
            Stubborn curiosity, on purpose.
          </h2>
          <p className="mt-6 text-gray-light">
            Daymi doesn't stay in one lane. Its subject is the unexpected: the odd question, the
            overlooked story, the topic nobody asked for but everybody ends up wanting to hear
            about. What ties the episodes together isn't a subject — it's an attitude. Curiosity
            that refuses to let go until it finds out why.
          </p>

          <GlassCard className="mt-8 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-hot">
              How to say it
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <bdi dir="rtl" className="fa-text text-2xl text-cream">
                دیمی
              </bdi>
              <span className="text-gray-mid">—</span>
              <span className="text-lg text-white">[Add pronunciation, e.g. "DAY-mee"]</span>
            </div>
            <p className="mt-3 text-sm text-gray-light">
              [FILL IN] A short line in the host's own words about what the name means and why it
              was chosen.
            </p>
          </GlassCard>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <GlassCard className="p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-hot">
                Made by
              </p>
              <p className="mt-2 text-white">[FILL IN: host / creator name]</p>
            </GlassCard>
            <GlassCard className="p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-hot">
                Made for
              </p>
              <p className="mt-2 text-white">
                [FILL IN: e.g. Persian speakers who prefer English interfaces, the diaspora, Persian
                learners, curious internationals]
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
