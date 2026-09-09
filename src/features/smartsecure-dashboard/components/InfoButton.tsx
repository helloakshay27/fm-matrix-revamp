import { useRef } from 'react';
import { INFO } from '../data/constants';
import { useSmartSecureDashboard } from '../context/DashboardContext';

export function InfoButton({ infoKey }: { infoKey: string }) {
  const { infoPopover, openInfoPopover, closeInfoPopover } = useSmartSecureDashboard();
  const btnRef = useRef<HTMLButtonElement>(null);
  if (!(infoKey in INFO)) return null;
  const isOpen = infoPopover?.key === infoKey;

  return (
    <span className="info-wrap">
      <button
        ref={btnRef}
        className="info-btn"
        title="How this is calculated"
        aria-label="How this is calculated"
        onClick={(e) => {
          e.stopPropagation();
          if (isOpen) {
            closeInfoPopover();
            return;
          }
          const rect = btnRef.current!.getBoundingClientRect();
          openInfoPopover(infoKey, rect);
        }}
      >
        i
      </button>
    </span>
  );
}
