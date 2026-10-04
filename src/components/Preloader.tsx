import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem("daymi-visited"));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;
    sessionStorage.setItem("daymi-visited", "1");
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    function tick(t: number) {
      const p = Math.min(1, (t - start) / duration);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 250);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-6 h-24 w-24 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(248,127,35,0.9), rgba(193,8,1,0.5) 55%, transparent 75%)",
              filter: "blur(2px)",
            }}
          />
          <div className="font-mono text-xs tracking-[0.3em] text-cream/70">[ DAYMI ]</div>
          <div className="mt-5 h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-core via-orange-hot to-cream"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
