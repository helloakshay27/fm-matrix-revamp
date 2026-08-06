import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type TWOption = { label: string; value: string };

type Props = {
  label?: React.ReactNode;
  options: TWOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
};

const VI_RED = '#EE0B0B';
const LABEL_COLOR = '#6B7C5A';

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
  const [search, setSearch] = useState('');

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

  useEffect(() => {
    const updateCoords = () => {
      if (!buttonRef.current) return;
      const r = buttonRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 4, left: r.left, width: r.width });
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

  const values = useMemo(() => options.map((o) => o.value), [options]);
  const allCount = values.length;
  const selectedCount = selected.filter((v) => values.includes(v)).length;
  const allChecked = allCount > 0 && selectedCount === allCount;
  const indeterminate = selectedCount > 0 && selectedCount < allCount;

  const summary = useMemo(() => {
    if (selectedCount === 0) return placeholder;
    const labels = options.filter((o) => selected.includes(o.value)).map((o) => o.label);
    return labels.length > 3
      ? `${labels.slice(0, 3).join(', ')} +${labels.length - 3}`
      : labels.join(', ');
  }, [selected, options, selectedCount, placeholder]);

  const toggleAll = () => {
    if (allChecked) onChange([]);
    else onChange(values);
  };

  const toggleOne = (val: string) => {
    if (!values.includes(val)) return;
    if (selected.includes(val)) onChange(selected.filter((v) => v !== val));
    else onChange([...selected, val]);
  };

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const s = search.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(s));
  }, [options, search]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label ? (
        <label
          style={{
            display: 'block',
            fontFamily: '"Work Sans", "Helvetica Neue", Arial, sans-serif',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '100%',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: LABEL_COLOR,
            marginBottom: '6px',
          }}
        >
          {label}
        </label>
      ) : null}
      <button
        type="button"
        className={`w-full h-10 inline-flex items-center justify-between rounded-lg border bg-white px-3 py-0 text-left text-sm text-gray-900 transition-colors focus:outline-none ${
          open
            ? 'border-[#EE0B0B] ring-1 ring-[#EE0B0B]/30'
            : 'border-gray-300 hover:border-[#EE0B0B]'
        } ${buttonClassName}`}
        onClick={() => setOpen((o) => !o)}
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${selectedCount === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
          {summary}
        </span>
        <svg
          className={`ml-2 h-4 w-4 text-gray-500 transition-transform duration-150 flex-shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            ref={portalRef}
            className="z-[9999] max-h-64 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: Math.max(200, Math.floor(coords.width)),
            }}
          >
            <div className="px-3 pt-2 pb-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#EE0B0B]"
                autoFocus
              />
            </div>
            <ul className="py-1 text-sm text-gray-900" role="listbox" aria-multiselectable>
              <li
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-red-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={toggleAll}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: VI_RED }}
                  readOnly
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = indeterminate;
                  }}
                />
                <span className="ml-2 select-none">Select All</span>
              </li>
              <li className="my-1 border-t border-gray-100" />
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-gray-400 select-none">No options found</li>
              ) : (
                filteredOptions.map((o) => (
                  <li
                    key={o.value}
                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-red-50"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => toggleOne(o.value)}
                    role="option"
                    aria-selected={selected.includes(o.value)}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ accentColor: VI_RED }}
                      readOnly
                      checked={selected.includes(o.value)}
                    />
                    <span className="ml-2 select-none truncate">{o.label}</span>
                  </li>
                ))
              )}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
};

export default TailwindMultiSelect;
