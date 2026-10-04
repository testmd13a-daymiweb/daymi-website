import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, Play } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { PLATFORMS } from "../data/platforms";

const LINKS = [
  { label: "Episodes", href: "#episodes" },
  { label: "About", href: "#about" },
  { label: "Suggest a topic", href: "#suggest" },
  { label: "FAQ", href: "#faq" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [listenOpen, setListenOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <motion.nav
          animate={{
            paddingLeft: scrolled ? 10 : 18,
            paddingRight: scrolled ? 10 : 18,
            paddingTop: scrolled ? 8 : 10,
            paddingBottom: scrolled ? 8 : 10,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative flex w-full max-w-3xl items-center justify-between gap-4 rounded-full"
        >
          <a href="#top" className="flex items-center gap-2 pl-2" data-cursor="Home">
            <span className="font-sans text-lg font-extrabold tracking-tight text-white">DAYMI</span>
            <span dir="rtl" className="fa-text hidden text-sm text-cream/60 sm:inline">
              دیمی
            </span>
          </a>

          <ul className="hidden items-center gap-6 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-cursor="Open"
                  className="text-sm text-gray-light transition-colors hover:text-cream"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="relative">
            <MagneticButton
              className="bg-gradient-to-r from-orange-core to-orange-hot text-black shadow-[0_0_24px_rgba(248,127,35,0.45)]"
              cursorLabel="Listen"
              onClick={() => setListenOpen((v) => !v)}
            >
              <Play size={14} className="fill-black" />
              Listen
              <ChevronDown size={14} className={`transition-transform ${listenOpen ? "rotate-180" : ""}`} />
            </MagneticButton>

            <AnimatePresence>
              {listenOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="glass absolute right-0 top-full mt-3 w-56 rounded-2xl p-2"
                >
                  {PLATFORMS.map((p) => (
                    <a
                      key={p.name}
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="Open"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-light transition-colors hover:bg-white/5 hover:text-cream"
                    >
                      <p.icon size={16} className="text-orange-hot" />
                      {p.name}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-cream md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </motion.nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex flex-col bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between p-6">
              <span className="text-lg font-extrabold tracking-tight">DAYMI</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-1 flex-col items-start justify-center gap-6 px-8">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-4xl font-semibold tracking-tight text-white"
                >
                  {l.label}
                </motion.a>
              ))}
              <div className="mt-6 flex gap-4">
                {PLATFORMS.map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-hot/30 text-cream"
                    aria-label={p.name}
                  >
                    <p.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
