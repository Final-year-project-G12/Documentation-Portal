import { GLOSSARY } from "./glossary";

/* ─────────────────────────────────────────────────────────
   terms.js — finds glossary terms in a piece of text.
   splitTerms(text) -> [{ text, key? }]: segments of the text, where a
   segment with a `key` is a glossary term to underline. Each term is
   marked once per call; longer phrases win over shorter ones.
   ───────────────────────────────────────────────────────── */

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const WORD = "[\\p{L}\\p{N}_]";

const PATTERNS = GLOSSARY.flatMap((g) =>
  g.match.map((m) => ({
    key: g.key,
    phrase: m,
    re: new RegExp(`(?<!${WORD})${escapeRe(m)}(?!${WORD})`, g.cs ? "u" : "iu"),
  }))
).sort((a, b) => b.phrase.length - a.phrase.length);

/* Very common words are underlined only the first time they appear on a
   page; every other term is underlined once per block of text. Each page
   calls resetTerms() at the start of its render. */
const ONCE_PER_PAGE = new Set(["pcm", "regime", "latent", "melting", "cycling", "conductivity", "capsule", "solarfraction", "mcdm", "gmm"]);
let pageUsed = new Set();

export function resetTerms() {
  pageUsed = new Set();
}

export function splitTerms(text, used = new Set()) {
  let segs = [{ text: String(text) }];
  for (const p of PATTERNS) {
    if (used.has(p.key)) continue;
    if (ONCE_PER_PAGE.has(p.key) && pageUsed.has(p.key)) continue;
    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      if (seg.key) continue;
      const m = p.re.exec(seg.text);
      if (!m) continue;
      const before = seg.text.slice(0, m.index);
      const after = seg.text.slice(m.index + m[0].length);
      const next = [];
      if (before) next.push({ text: before });
      next.push({ text: m[0], key: p.key });
      if (after) next.push({ text: after });
      segs.splice(i, 1, ...next);
      used.add(p.key);
      if (ONCE_PER_PAGE.has(p.key)) pageUsed.add(p.key);
      break;
    }
  }
  return segs;
}

/* HTML version: marks terms in text between tags, skipping links, code and
   existing citation markers. `used` is shared across the whole string. */
export function termsHtml(html) {
  const used = new Set();
  let skip = 0;
  return String(html)
    .split(/(<[^>]+>)/)
    .map((part) => {
      if (part.startsWith("<")) {
        if (/^<(a|code)(\s|>)/i.test(part)) skip++;
        else if (/^<\/(a|code)>/i.test(part)) skip = Math.max(0, skip - 1);
        return part;
      }
      if (skip || !part.trim()) return part;
      return splitTerms(part, used)
        .map((s) =>
          s.key
            ? `<span class="term" tabindex="0" data-term="${s.key}">${s.text}</span>`
            : s.text
        )
        .join("");
    })
    .join("");
}
