import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "What is Daymi?",
    a: "Daymi is a curiosity-driven podcast. It doesn't stick to one topic — it follows whatever question refuses to let go, from the odd to the overlooked.",
  },
  {
    q: "What language are the episodes in?",
    a: "Daymi is available in Persian and English. Choose your language in the Listen menu or the Where to listen section.",
  },
  {
    q: "Where can I listen?",
    a: "Spotify, YouTube and Castbox, with separate channels for Persian and English. Links are in the \"Where to listen\" section above.",
  },
  {
    q: "How often do new episodes come out?",
    a: "Roughly every 10–14 days. [FILL IN: confirm cadence before publishing as a firm promise.]",
  },
  {
    q: "Can I suggest a topic?",
    a: "Yes — that's half the point. Use the \"Suggest a topic\" section above, in English or Persian.",
  },
  {
    q: "Where should I start?",
    a: "Check the starter episodes in the \"Where to listen\" section, or just press play on the latest one in the hero.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 bg-black px-5 py-24 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-orange-hot">
          [ FAQ ]
        </p>
        <h2 className="mt-3 text-balance text-center font-sans text-[clamp(28px,4.5vw,52px)] font-extrabold leading-[1] tracking-tight text-white">
          Questions, answered anyway.
        </h2>

        <div className="mt-10 flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`glass rounded-2xl border transition-colors duration-300 ${
                  isOpen ? "border-orange-hot/60 shadow-[0_0_30px_rgba(248,127,35,0.25)]" : "border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-white">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-orange-hot"
                  >
                    <Plus size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-gray-light">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
