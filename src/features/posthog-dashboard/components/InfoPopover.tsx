import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { INFO } from '../data/constants';
import { useDashboard } from '../context/DashboardContext';

/** Single floating "how this is calculated" popover, positioned near whichever (i) button opened it.
 *  Portaled to document.body; `.info-pop` is a global rule in posthog-dashboard.css for that reason. */
export function InfoPopover() {
  const { infoPopover, closeInfoPopover } = useDashboard();
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!infoPopover || !popRef.current) { setPos(null); return; }
    const { rect } = infoPopover;
    const pw = popRef.current.offsetWidth, ph = popRef.current.offsetHeight, gap = 8;
    let left = rect.right - pw;
    if (left < 10) left = 10;
    if (left + pw > window.innerWidth - 10) left = window.innerWidth - pw - 10;
    let top = rect.bottom + gap;
    if (top + ph > window.innerHeight - 10) top = rect.top - ph - gap;
    if (top < 10) top = 10;
    setPos({ left, top });
  }, [infoPopover]);

  useEffect(() => {
    if (!infoPopover) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.info-pop') && !target.closest('.info-btn')) closeInfoPopover();
    };
    const onScroll = () => closeInfoPopover();
    const onResize = () => closeInfoPopover();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeInfoPopover(); };
    document.addEventListener('click', onDocClick);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKey);
    };
  }, [infoPopover, closeInfoPopover]);

  if (!infoPopover) return null;
  const info = INFO[infoPopover.key];
  if (!info) return null;

  return createPortal(
    <div
      ref={popRef}
      className="info-pop"
      style={{ display: 'block', left: pos?.left ?? -9999, top: pos?.top ?? -9999 }}
    >
      <div className="ipt">{info.t}</div>
      <div className="ipf"><span className="ipfk">How it's calculated</span>{info.f}</div>
      <div className="ipd">{info.d}</div>
    </div>,
    document.body,
  );
}
