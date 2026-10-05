import GlassCard from "./GlassCard";

export default function About() {
  return (
    <section id="about" className="relative z-10 bg-black px-5 py-24 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-orange-hot/20 bg-black">
          <img src="/images/host-orange-dots.png" alt="Daymi creator portrayed in glowing orange dots on black" loading="lazy" className="h-full w-full object-cover object-top" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <p className="absolute bottom-7 left-7 font-mono text-[10px] uppercase tracking-[0.25em] text-orange-hot">[ Behind the curiosity ]</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange-hot">[ About ]</p>
          <h2 className="mt-3 text-balance text-[clamp(28px,4.5vw,52px)] font-extrabold leading-none tracking-tight text-white">Stubborn curiosity, on purpose.</h2>
          <p className="mt-6 leading-7 text-gray-light">Daymi follows the questions hiding inside everyday life. Why did salt once hold so much power? How did money and the internet begin? Why do we laugh at the wrong moment, and where is everybody in the universe? Through stories about history, psychology, science and society, each episode opens another door.</p>
          <GlassCard className="mt-8 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-hot">One curiosity. Two languages.</p>
            <div className="mt-3 flex items-center gap-3"><bdi dir="rtl" className="fa-text text-2xl text-cream">دیمی</bdi><span className="text-gray-mid">/</span><span className="text-lg font-semibold text-white">DAYMI</span></div>
            <p className="mt-3 text-sm leading-6 text-gray-light">Explore Daymi in Persian or English. Full episodes are available on YouTube, Spotify and Castbox, with separate channels for each language.</p>
          </GlassCard>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <GlassCard className="p-6"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-hot">The stories</p><p className="mt-3 text-sm leading-6 text-cream">From the story of money to the Fermi paradox. History, human behaviour and the ideas that shape our world.</p></GlassCard>
            <GlassCard className="p-6"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-hot">Made for</p><p className="mt-3 text-sm leading-6 text-cream">Anyone who wants to look closer, ask another question and discover something unexpected.</p></GlassCard>
          </div>
          <a href="https://www.youtube.com/@daymipodcast.English" target="_blank" rel="noreferrer" className="mt-6 inline-block text-sm text-orange-hot hover:text-cream">Explore Daymi on YouTube ↗</a>
        </div>
      </div>
    </section>
  );
}
