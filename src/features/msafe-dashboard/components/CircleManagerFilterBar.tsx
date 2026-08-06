import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CIRCLES, FUNCTIONS, ZONES } from '../data/constants';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

export function CircleManagerFilterBar() {
  const {
    persona,
    circle,
    setCircle,
    functions,
    setFunctions,
    zone,
    setZone,
    empType,
    setEmpType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    applyFilters,
    resetFilters,
    setPageTitle,
  } = useMsafeDashboard();

  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (fieldRef.current && !fieldRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  if (persona !== 'circle') return null;

  const summary =
    functions.length === 0
      ? 'Select Function'
      : functions.length === 1
        ? functions[0]
        : `${functions.length} Functions Selected`;

  const toggleFn = (fn: string) => {
    setFunctions(functions.includes(fn) ? functions.filter((f) => f !== fn) : [...functions, fn]);
  };

  return (
    <div className="cm-filter-bar" style={{ display: 'flex' }}>
      <div className="cm-filter-field">
        <span className="cm-filter-label">
          Circle <em>*</em>
        </span>
        <select
          value={circle}
          onChange={(e) => {
            setCircle(e.target.value);
            setPageTitle(`M-Safe · ${e.target.value} Circle`);
          }}
        >
          {CIRCLES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="cm-filter-field cm-multiselect" id="cm-function-field" ref={fieldRef}>
        <span className="cm-filter-label">
          Function <em>*</em>
        </span>
        <button type="button" className="cm-multiselect-btn" onClick={() => setOpen((o) => !o)}>
          <span>{summary}</span>
          <ChevronDown size={13} />
        </button>
        <div className={`cm-multiselect-panel ${open ? 'open' : ''}`}>
          {FUNCTIONS.map((fn) => (
            <label key={fn} className="cm-ms-item">
              <input type="checkbox" checked={functions.includes(fn)} onChange={() => toggleFn(fn)} />
              {fn}
            </label>
          ))}
        </div>
      </div>

      <div className="cm-filter-field">
        <span className="cm-filter-label">Zone</span>
        <select
          value={zone}
          onChange={(e) => {
            setZone(e.target.value);
            setPageTitle(
              e.target.value === 'All Zones'
                ? `M-Safe · ${circle} Circle`
                : `M-Safe · ${circle} · ${e.target.value} Zone`,
            );
          }}
        >
          {ZONES.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      <div className="cm-filter-field">
        <span className="cm-filter-label">
          Employee Type <em>*</em>
        </span>
        <select value={empType} onChange={(e) => setEmpType(e.target.value)}>
          <option>Internal / External</option>
          <option>Internal (FTE)</option>
          <option>External (Non-FTE)</option>
        </select>
      </div>

      <div className="cm-filter-field cm-date-field">
        <span className="cm-filter-label">
          Start Date <em>*</em>
        </span>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>

      <span className="cm-filter-to">to</span>

      <div className="cm-filter-field cm-date-field">
        <span className="cm-filter-label">
          End Date <em>*</em>
        </span>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <button type="button" className="cm-apply-btn" onClick={applyFilters}>
        Apply
      </button>
      <button type="button" className="cm-reset-btn" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );
}
