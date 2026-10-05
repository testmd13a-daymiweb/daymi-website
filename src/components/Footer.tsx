import { LISTEN_GROUPS } from "../data/platforms";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-black pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-white">DAYMI</span>
            <span dir="rtl" className="fa-text text-sm text-cream/60">
              دیمی
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-gray-light">
            A podcast in Persian and English about unexpected things, driven by a stubborn curiosity.
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-hot">Listen</p>
          {LISTEN_GROUPS.map((group) => (
            <div key={group.language} className="mt-4">
              <p className="text-sm font-semibold text-cream">{group.label}</p>
              <ul className="mt-2 space-y-2">
            {group.platforms.map((p) => (
              <li key={p.name}>
                <a href={p.href} target="_blank" rel="noreferrer" className="text-sm text-gray-light hover:text-cream">
                  {p.name}
                </a>
              </li>
            ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-hot">Get in touch</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-light">
            <li>[FILL IN: contact email]</li>
            <li>[FILL IN: Telegram / other channel]</li>
            <li>
              <a href="#suggest" className="hover:text-cream">
                Suggest a topic →
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-5 sm:px-10">
        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-gray-mid sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Daymi. All rights reserved.</p>
          <p>Built for the stubbornly curious.</p>
        </div>
      </div>

      <div className="relative mt-4 select-none overflow-hidden">
        <p
          aria-hidden="true"
          className="translate-y-[22%] text-center font-sans text-[clamp(90px,24vw,320px)] font-extrabold leading-none tracking-[-0.04em] text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(248,127,35,0.9) 0%, rgba(193,8,1,0.5) 55%, rgba(0,0,0,0) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          DAYMI
        </p>
      </div>
    </footer>
  );
}
