import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/* ─────────────────────────────────────────────────────────
   Figure.js — one behaviour for every graph in the portal.
   • Click the image: opens it enlarged in an in-page lightbox.
   • "Interactive" button: opens the interactive HTML plot in the
     same lightbox (iframe).
   • "New tab" link: opens the interactive HTML in a new tab
     (rel="noopener noreferrer").
   Nothing here touches the router or the URL hash.
   ───────────────────────────────────────────────────────── */

function Lightbox({ view, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (closeRef.current) closeRef.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (previous && previous.focus) previous.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={view.title}
      onClick={onClose}
    >
      <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-bar">
          <span className="lightbox-title">{view.title}</span>
          <span className="lightbox-bar-actions">
            {view.kind === "frame" && (
              <a href={view.src} target="_blank" rel="noopener noreferrer" className="figure-link">
                Open in a new tab
              </a>
            )}
            <button ref={closeRef} className="lightbox-close" onClick={onClose}>
              Close
            </button>
          </span>
        </div>
        <div className="lightbox-body">
          {view.kind === "frame" ? (
            <iframe src={view.src} title={view.title} className="lightbox-frame" />
          ) : (
            <img src={view.src} alt={view.alt || view.title} className="lightbox-image" />
          )}
        </div>
        {view.caption && <p className="lightbox-caption">{view.caption}</p>}
      </div>
    </div>,
    document.body
  );
}

export default function Figure({ src, interactiveSrc, title, alt, caption, note }) {
  const [view, setView] = useState(null);
  const [broken, setBroken] = useState(false);

  return (
    <figure className="figure">
      <button
        type="button"
        className="figure-open"
        aria-label={`Enlarge: ${title}`}
        onClick={() => src && !broken && setView({ kind: "image", src, title, alt, caption })}
        disabled={!src || broken}
      >
        {src && !broken ? (
          <img src={src} alt={alt || title} loading="lazy" onError={() => setBroken(true)} />
        ) : (
          <span className="figure-missing">Image not available</span>
        )}
      </button>
      <figcaption className="figure-caption">
        {note && <span className="figure-note">{note}</span>}
        {interactiveSrc && (
          <span className="figure-actions">
            <button
              type="button"
              className="figure-link"
              onClick={() => setView({ kind: "frame", src: interactiveSrc, title: `${title} (interactive)`, caption })}
            >
              Interactive view
            </button>
            <a href={interactiveSrc} target="_blank" rel="noopener noreferrer" className="figure-link">
              New tab
            </a>
          </span>
        )}
      </figcaption>
      {view && <Lightbox view={view} onClose={() => setView(null)} />}
    </figure>
  );
}
