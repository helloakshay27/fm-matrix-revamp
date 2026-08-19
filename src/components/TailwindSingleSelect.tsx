import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type TSOption = { label: string; value: string };

type Props = {
  label?: React.ReactNode;
  options: TSOption[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
};

const VI_RED = '#EE0B0B';
const LABEL_COLOR = '#6B7C5A';

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

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found?.label ?? placeholder;
  }, [options, value, placeholder]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const s = search.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(s));
  }, [options, search]);

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const hasValue = Boolean(value);

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
        className={`w-full h-10 inline-flex items-center justify-between rounded-lg border bg-white px-3 py-0 text-left text-sm transition-colors focus:outline-none ${
          open
            ? 'border-[#EE0B0B] ring-1 ring-[#EE0B0B]/30'
            : 'border-gray-300 hover:border-[#EE0B0B]'
        } ${buttonClassName}`}
        onClick={() => setOpen((o) => !o)}
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${hasValue ? 'text-gray-900' : 'text-gray-400'}`}>
          {selectedLabel}
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
            <ul className="py-1 text-sm text-gray-900" role="listbox">
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-gray-400 select-none">No options found</li>
              ) : (
                filteredOptions.map((o) => {
                  const active = o.value === value;
                  return (
                    <li
                      key={o.value}
                      className={`flex items-center px-3 py-2 cursor-pointer hover:bg-red-50 ${
                        active ? 'bg-red-50' : ''
                      }`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        handleSelect(o.value);
                        setSearch('');
                      }}
                      role="option"
                      aria-selected={active}
                    >
                      <span className="truncate">{o.label}</span>
                      {active ? (
                        <svg
                          className="ml-auto h-4 w-4 flex-shrink-0"
                          style={{ color: VI_RED }}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3-3a1 1 0 011.42-1.42l2.29 2.29 6.79-6.79a1 1 0 011.42 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : null}
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
};

export default TailwindSingleSelect;
