import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { splitTerms } from "../data/terms";
import { GLOSSARY_BY_KEY } from "../data/glossary";

/* ─────────────────────────────────────────────────────────
   Terms.js — hover definitions for technical terms.
   <Terms text="..."/>     marks glossary terms inside a string.
   <Term k="gmm">GMM</Term> marks one term by hand.
   <TermPopover/>           mounted once; shows the definition box
                            on hover, keyboard focus or tap.
   ───────────────────────────────────────────────────────── */

export function Term({ k, children }) {
  return (
    <span className="term" tabIndex={0} data-term={k}>
      {children}
    </span>
  );
}

export function Terms({ text, used }) {
  const segs = splitTerms(text, used || new Set());
  return (
    <>
      {segs.map((s, i) =>
        s.key ? (
          <Term key={i} k={s.key}>
            {s.text}
          </Term>
        ) : (
          <span key={i}>{s.text}</span>
        )
      )}
    </>
  );
}

export function TermPopover() {
  const [tip, setTip] = useState(null);

  useEffect(() => {
    let current = null;

    const show = (el) => {
      const entry = GLOSSARY_BY_KEY[el.dataset.term];
      if (!entry) return;
      if (current && current !== el) current.removeAttribute("aria-describedby");
      current = el;
      el.setAttribute("aria-describedby", "term-popover");
      const r = el.getBoundingClientRect();
      const width = Math.min(300, window.innerWidth - 16);
      const left = Math.max(8, Math.min(r.left + r.width / 2 - width / 2, window.innerWidth - width - 8));
      const above = r.top > 130;
      setTip({
        name: entry.name,
        def: entry.def,
        left,
        width,
        top: above ? r.top - 8 : r.bottom + 8,
        above,
      });
    };

    const hide = () => {
      if (current) current.removeAttribute("aria-describedby");
      current = null;
      setTip(null);
    };

    const termOf = (e) => (e.target && e.target.closest ? e.target.closest(".term") : null);

    const onOver = (e) => {
      const t = termOf(e);
      if (t) show(t);
    };
    const onOut = (e) => {
      const t = termOf(e);
      if (t && !t.contains(e.relatedTarget)) hide();
    };
    const onFocusIn = (e) => {
      const t = termOf(e);
      if (t) show(t);
    };
    const onFocusOut = (e) => {
      if (termOf(e)) hide();
    };
    const onClick = (e) => {
      // tap on touch screens: toggle
      const t = termOf(e);
      if (!t) hide();
      else if (current === t) hide();
      else show(t);
    };
    const onKey = (e) => {
      if (e.key === "Escape") hide();
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", hide, true);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", hide, true);
    };
  }, []);

  if (!tip) return null;
  return createPortal(
    <div
      id="term-popover"
      role="tooltip"
      className="term-popover"
      style={{
        left: tip.left,
        top: tip.top,
        width: tip.width,
        transform: tip.above ? "translateY(-100%)" : "none",
      }}
    >
      <strong>{tip.name}</strong>
      {tip.def}
    </div>,
    document.body
  );
}
