import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   useReveal — scroll-triggered entrance animations.
   Elements matching REVEAL_SELECTOR inside the returned ref
   fade and slide in when they enter the viewport, staggered
   among siblings. Stat values that are plain numbers count up.
   Content is visible by default: classes are added only by
   JS, and nothing animates when the user prefers reduced
   motion or IntersectionObserver is unavailable.
   Pass `deps` that change when new content is rendered
   (e.g. the selected tab) so new elements are picked up.
   ───────────────────────────────────────────────────────── */

const REVEAL_SELECTOR = [
  ".plots-section-header",
  ".section-desc",
  ".section-divider",
  ".result-stat-card",
  ".objective-card",
  ".territory-card",
  ".method-card",
  ".sdg-card",
  ".arch-step",
  ".pipeline-stage",
  ".diagram",
  ".data-table-wrapper",
  ".note-group",
  ".plot-type",
].join(",");

const STAGGER_MS = 70;
const MAX_STAGGER_STEPS = 6;
const SETTLE_MS = 900;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* "133 GW" → { value: 133, decimals: 0, prefix: "", suffix: " GW" }; ranges such as "48–50%" are skipped. */
function parseCountable(text) {
  const m = /^(\s*)(\d{1,3}(?:,\d{3})*|\d+)(\.\d+)?(\s?[A-Za-z%°]*\s*)$/.exec(text);
  if (!m) return null;
  const value = parseFloat((m[2] + (m[3] || "")).replace(/,/g, ""));
  if (!isFinite(value) || value === 0) return null;
  return { value, decimals: m[3] ? m[3].length - 1 : 0, prefix: m[1], suffix: m[4], grouped: m[2].includes(",") };
}

function countUp(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = "1";
  const original = el.textContent;
  const parsed = parseCountable(original);
  if (!parsed) return;
  const duration = 1100;
  const start = performance.now();
  const fmt = (v) => {
    const s = v.toFixed(parsed.decimals);
    return parsed.grouped ? Number(s).toLocaleString("en-US", { minimumFractionDigits: parsed.decimals }) : s;
  };
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = parsed.prefix + fmt(parsed.value * eased) + parsed.suffix;
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = original;
  };
  requestAnimationFrame(step);
}

export default function useReveal(deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") return undefined;

    const timers = [];
    const targets = Array.from(root.querySelectorAll(REVEAL_SELECTOR)).filter((el) => !el.dataset.revealed);

    targets.forEach((el) => {
      const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.matches(REVEAL_SELECTOR)) : [el];
      const idx = Math.min(siblings.indexOf(el), MAX_STAGGER_STEPS);
      el.style.setProperty("--reveal-delay", `${Math.max(idx, 0) * STAGGER_MS}ms`);
      el.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          observer.unobserve(el);
          el.dataset.revealed = "1";
          el.classList.add("is-visible");
          el.querySelectorAll(".result-stat-value").forEach(countUp);
          // Hand styling back to the normal CSS once the entrance has finished,
          // so hover transforms and transitions behave as before.
          const delay = parseInt(el.style.getPropertyValue("--reveal-delay"), 10) || 0;
          timers.push(
            setTimeout(() => {
              el.classList.remove("reveal", "is-visible");
              el.style.removeProperty("--reveal-delay");
            }, SETTLE_MS + delay)
          );
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      // Never leave content hidden if the effect is torn down mid-animation.
      targets.forEach((el) => {
        el.classList.remove("reveal", "is-visible");
        el.style.removeProperty("--reveal-delay");
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
