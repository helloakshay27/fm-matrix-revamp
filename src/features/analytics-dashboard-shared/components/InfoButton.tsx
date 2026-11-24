import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * The small `i` affordance on every tile and chart card.
 * Handles both click and hover cleanly. When clicking an `i` button or moving away,
 * it closes properly and never stays stuck open over other buttons or cards.
 */
export function InfoButton({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <span
      ref={wrapRef}
      className={`info-wrap${isOpen ? ' is-open' : ''}`}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="info-btn"
        aria-label="How this is calculated"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
          (e.currentTarget as HTMLButtonElement).blur();
        }}
      >
        i
      </button>
      <div className="info-pop">{children}</div>
    </span>
  );
}

/** Formula + business-meaning body, the shape every KPI tile's popover uses. */
export function KpiInfoBody({ formula, meaning }: { formula: string; meaning: string }) {
  return (
    <>
      <b>Formula</b>
      {formula}
      <div className="sep">
        <b>Business meaning</b>
        {meaning}
      </div>
    </>
  );
}
