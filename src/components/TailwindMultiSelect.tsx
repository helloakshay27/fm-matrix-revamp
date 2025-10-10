import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type TWOption = { label: string; value: string };

type Props = {
  label?: string;
  options: TWOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
};

// A lightweight Tailwind-based multi-select with a Select All checkbox.
// - Click outside closes the dropdown
// - Shows first 3 selected labels, then +N
// - Select All toggles all real options
const TailwindMultiSelect: React.FC<Props> = ({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Multiple Selected',
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

  // Recompute dropdown position when opening, and on window resize/scroll
  useEffect(() => {
    const updateCoords = () => {
      if (!buttonRef.current) return;
      const r = buttonRef.current.getBoundingClientRect();
      // Position relative to the viewport for position: fixed; do NOT add window scroll offsets
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

  const values = useMemo(() => options.map(o => o.value), [options]);
  const allCount = values.length;
  const selectedCount = selected.filter(v => values.includes(v)).length;
  const allChecked = allCount > 0 && selectedCount === allCount;
  const indeterminate = selectedCount > 0 && selectedCount < allCount;

  const summary = useMemo(() => {
    if (selectedCount === 0) return placeholder;
    const labels = options.filter(o => selected.includes(o.value)).map(o => o.label);
    return labels.length > 3 ? `${labels.slice(0, 3).join(', ')} +${labels.length - 3}` : labels.join(', ');
  }, [selected, options, selectedCount, placeholder]);

  const toggleAll = () => {
    if (allChecked) onChange([]);
    else onChange(values);
  };

  const toggleOne = (val: string) => {
    if (!values.includes(val)) return;
    if (selected.includes(val)) onChange(selected.filter(v => v !== val));
    else onChange([...selected, val]);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label ? (
        <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      ) : null}
      <button
        type="button"
        className={`w-56 min-w-[160px] h-10 inline-flex items-center justify-between rounded-[25px] border border-gray-300 bg-white px-3 py-0 text-left text-sm text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-0 focus:border-gray-400 ${buttonClassName}`}
        onClick={() => setOpen(o => !o)}
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{summary}</span>
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
          <ul className="py-1 text-sm text-gray-900" role="listbox" aria-multiselectable>
            <li
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
              onMouseDown={(e) => e.preventDefault()}
              onClick={toggleAll}
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 accent-red-600 focus:ring-red-600"
                style={{ accentColor: '#EE0B0B' }}
                readOnly
                checked={allChecked}
                ref={(el) => { if (el) el.indeterminate = indeterminate; }}
              />
              <span className="ml-2 select-none">Select All</span>
            </li>
            <li className="my-1 border-t border-gray-100" />
            {options.map((o) => (
              <li
                key={o.value}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => toggleOne(o.value)}
                role="option"
                aria-selected={selected.includes(o.value)}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-red-600 focus:ring-red-600"
                  style={{ accentColor: '#EE0B0B' }}
                  readOnly
                  checked={selected.includes(o.value)}
                />
                <span className="ml-2 select-none truncate">{o.label}</span>
              </li>
            ))}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TailwindMultiSelect;
