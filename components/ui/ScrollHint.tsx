"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SUMMARY_AT } from "@/lib/worldMapRoute";

const EASE = [0.16, 1, 0.3, 1] as const;
const IDLE_MS = 1600; // quiet time after the last scroll before the hint returns
const FIRST_MS = 2500; // first appearance, once the hero animations have played
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"]);

/**
 * A small mouse icon that fades in at the bottom centre when the visitor stops
 * scrolling, and disappears the moment they scroll again. Same look and size as the
 * hint on the world-map section.
 */
export function ScrollHint() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let timer = 0;

    // Inside the pinned map stage the hint only appears on the final summary
    // ("15 projects · 4 countries"), and then in the dark variant.
    const stageState = () => {
      const rect = document.querySelector("[data-dark-stage]")?.getBoundingClientRect();
      const mid = window.innerHeight * 0.5;
      if (!rect || rect.top >= mid || rect.bottom <= mid) return { inStage: false, summary: false };
      const progress = -rect.top / Math.max(rect.height - window.innerHeight, 1);
      return { inStage: true, summary: progress >= SUMMARY_AT };
    };

    const canShow = () => {
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 200;
      const { inStage, summary } = stageState();
      setDark(inStage);
      return !atBottom && (!inStage || summary);
    };

    const schedule = (ms: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setVisible(canShow()), ms);
    };

    const onActivity = () => {
      setVisible(false);
      schedule(IDLE_MS);
    };
    const onKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) onActivity();
    };

    schedule(FIRST_MS);
    window.addEventListener("scroll", onActivity, { passive: true });
    window.addEventListener("wheel", onActivity, { passive: true });
    window.addEventListener("touchmove", onActivity, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onActivity);
      window.removeEventListener("wheel", onActivity);
      window.removeEventListener("touchmove", onActivity);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 md:bottom-8"
        >
          <div
            className={
              dark
                ? "inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-white/50"
                : "inline-flex items-center gap-2 rounded-full border border-surface-border bg-white/60 px-4 py-2 text-xs uppercase tracking-widest text-muted shadow-sm backdrop-blur-md"
            }
          >
            <span
              className={`relative flex h-5 w-3 justify-center rounded-full border ${dark ? "border-white/30" : "border-accent/50"}`}
            >
              <span className={`mt-1 h-1.5 w-0.5 animate-bounce rounded-full ${dark ? "bg-white/60" : "bg-accent"}`} />
            </span>
            {t.hero.scrollHint}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
