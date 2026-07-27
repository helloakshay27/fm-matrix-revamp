import { useRef } from 'react';
import { INFO } from '../data/constants';
import { useDashboard } from '../context/DashboardContext';

export function InfoButton({ infoKey }: { infoKey: string }) {
  const { infoPopover, openInfoPopover, closeInfoPopover } = useDashboard();
  const btnRef = useRef<HTMLButtonElement>(null);
  if (!(infoKey in INFO)) return null;
  const isOpen = infoPopover?.key === infoKey;

  return (
    <button
      ref={btnRef}
      className="phg-info-btn"
      title="How this is calculated"
      aria-label="How this is calculated"
      onClick={(e) => {
        e.stopPropagation();
        if (isOpen) { closeInfoPopover(); return; }
        const rect = btnRef.current!.getBoundingClientRect();
        openInfoPopover(infoKey, rect);
      }}
    >
      i
    </button>
  );
}
