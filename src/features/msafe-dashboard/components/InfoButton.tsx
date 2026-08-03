import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { INFO_TEXTS } from '../data/constants';

type Props = {
  infoKey: string;
  title?: string;
};

type TipPos = { left: number; top: number };

export function InfoButton({ infoKey, title = "How It's Calculated" }: Props) {
  const text = INFO_TEXTS[infoKey] || 'Details on this metric.';
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<TipPos>({ left: 0, top: 0 });
  const tipId = useId();

  const positionTip = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const tipW = 320;
    let left = rect.right - tipW;
    if (left < 12) left = 12;
    if (left + tipW > window.innerWidth - 12) left = window.innerWidth - tipW - 12;
    let top = rect.bottom + 8;
    if (top + 160 > window.innerHeight) top = Math.max(12, rect.top - 160);
    setPos({ left, top });
  }, []);

  const show = useCallback(() => {
    positionTip();
    setOpen(true);
  }, [positionTip]);

  const hide = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    const onResize = () => positionTip();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, positionTip]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="info-btn"
        aria-label="More info"
        aria-describedby={open ? tipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        i
      </button>
      {open &&
        createPortal(
          <div
            id={tipId}
            className="info-float show"
            role="tooltip"
            style={{ left: pos.left, top: pos.top }}
          >
            <div className="info-hd">{title}</div>
            <div className="info-body">{text}</div>
          </div>,
          document.body,
        )}
    </>
  );
}
