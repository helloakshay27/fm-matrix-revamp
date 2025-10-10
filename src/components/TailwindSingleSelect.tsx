import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type TSOption = { label: string; value: string };

type Props = {
  label?: string;
  options: TSOption[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
};

// Tailwind-styled single-select matching TailwindMultiSelect visuals (same height, border, chevron)
const TailwindSingleSelect: React.FC<Props> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select',
  className = '',
  buttonClassName = '',
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  // close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inRoot = !!rootRef.current && rootRef.current.contains(target);
      const inPortal = !!portalRef.current && portalRef.current.contains(target);
      if (!inRoot && !inPortal) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // position menu using viewport coords
  useEffect(() => {
    const updateCoords = () => {
      if (!buttonRef.current) return;
      const r = buttonRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom, left: r.left, width: r.width });
    };
    if (open) {
      updateCoords();
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
      return () => {
        window.removeEventListener('scroll', updateCoords, true);
        window.removeEventListener('resize', updateCoords);
      };
    }
  }, [open]);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found?.label ?? placeholder;
  }, [options, value, placeholder]);

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label ? (
        <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      ) : null}
      <button
        type="button"
        className={`w-56 min-w-[160px] h-10 inline-flex items-center justify-between rounded-[25px] border border-gray-300 bg-white px-3 py-0 text-left text-sm text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-0 focus:border-gray-400 ${buttonClassName}`}
        onClick={() => setOpen((o) => !o)}
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          className={`ml-2 h-4 w-4 text-gray-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>

      {open && coords && createPortal(
        <div
          ref={portalRef}
          className="z-[9999] max-h-64 overflow-auto rounded-[18px] border border-gray-200 bg-white shadow-lg"
          style={{ position: 'fixed', top: coords.top, left: coords.left, width: Math.max(200, Math.floor(coords.width)) }}
        >
          <ul className="py-1 text-sm text-gray-900" role="listbox">
            {options.map((o) => {
              const active = o.value === value;
              return (
                <li
                  key={o.value}
                  className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 ${active ? 'bg-gray-50' : ''}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(o.value)}
                  role="option"
                  aria-selected={active}
                >
                  <span className="truncate">{o.label}</span>
                  {active ? (
                    <svg className="ml-auto h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3-3a1 1 0 011.42-1.42l2.29 2.29 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
                    </svg>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TailwindSingleSelect;
