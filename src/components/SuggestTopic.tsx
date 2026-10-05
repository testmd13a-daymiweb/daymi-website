import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import MagneticButton from "./MagneticButton";

export default function SuggestTopic() {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

  }

  return (
    <section id="suggest" className="relative z-10 overflow-hidden bg-black px-5 py-28 sm:px-10">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            "radial-gradient(55% 60% at 20% 30%, rgba(248,127,35,0.5), transparent 70%), radial-gradient(45% 50% at 80% 70%, rgba(193,8,1,0.45), transparent 70%)",
            "radial-gradient(60% 55% at 30% 60%, rgba(248,127,35,0.5), transparent 70%), radial-gradient(50% 55% at 70% 30%, rgba(217,195,171,0.35), transparent 70%)",
            "radial-gradient(55% 60% at 20% 30%, rgba(248,127,35,0.5), transparent 70%), radial-gradient(45% 50% at 80% 70%, rgba(193,8,1,0.45), transparent 70%)",
          ],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "blur(80px)" }}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange-hot">
          [ Suggest a topic ]
        </p>
        <h2 className="mt-4 text-balance font-sans text-[clamp(30px,5vw,64px)] font-extrabold leading-[1] tracking-tight text-white">
          Got a question that won't leave you alone?
        </h2>
        <p className="mt-4 text-gray-light">
          Send it over. Write in English or Persian — if it's stubborn enough, we'll get to it.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <input
            dir="auto"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Why do we…?"
            aria-label="Your topic suggestion"
            className="glass w-full flex-1 rounded-full px-6 py-4 text-white placeholder:text-gray-mid focus:border-orange-hot/60"
            style={{ boxShadow: value ? "0 0 0 3px rgba(248,127,35,0.25)" : undefined }}
          />
          <MagneticButton
            as="button"
            disabled
            cursorLabel="Send"
            className="w-full shrink-0 bg-gradient-to-r from-orange-core to-orange-hot text-black shadow-[0_0_30px_rgba(248,127,35,0.45)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Send size={15} />
            Send it to Daymi
          </MagneticButton>
        </form>

        <p className="mt-4 text-sm text-gray-light" role="status">
          Topic submissions are coming soon. This form is not connected yet.
        </p>
      </div>
    </section>
  );
}
