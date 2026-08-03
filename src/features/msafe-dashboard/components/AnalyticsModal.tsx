import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { ANALYTICS_CATALOG } from '../data/mockData';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Select Analytics modal — matches vi_msafe_v6.html structure & styling */
export function AnalyticsModal() {
  const { analyticsOpen, setAnalyticsOpen, selectedAnalytics, setSelectedAnalytics } =
    useMsafeDashboard();
  const [temp, setTemp] = useState<string[]>([]);

  useEffect(() => {
    if (analyticsOpen) setTemp([...selectedAnalytics]);
  }, [analyticsOpen, selectedAnalytics]);

  if (!analyticsOpen) return null;

  const items = ANALYTICS_CATALOG.items;
  const allChecked = items.length > 0 && items.every((it) => temp.includes(it.id));
  const n = temp.length;
  const countLabel = `${n} analytic${n === 1 ? '' : 's'} selected`;

  const toggleItem = (id: string) => {
    setTemp((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleGroup = () => {
    if (allChecked) setTemp((prev) => prev.filter((id) => !items.some((it) => it.id === id)));
    else {
      const ids = items.map((it) => it.id);
      setTemp((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  return (
    <>
      <div className="am-scrim open" onClick={() => setAnalyticsOpen(false)} aria-hidden />
      <div className="am-modal open" role="dialog" aria-labelledby="am-title">
        <div className="am-hd">
          <h3 id="am-title">Select Analytics</h3>
          <div className="s">Choose analytics from different modules</div>
        </div>

        <div className="am-body">
          <div className="am-group">
            <div className="am-group-hd">
              <Shield size={16} strokeWidth={2} />
              <div className="name">{ANALYTICS_CATALOG.label}</div>
              <button
                type="button"
                className={`am-checkbox ${allChecked ? 'checked' : ''}`}
                aria-label={allChecked ? 'Deselect all M-Safe analytics' : 'Select all M-Safe analytics'}
                onClick={toggleGroup}
              >
                <CheckMark />
              </button>
            </div>

            {items.map((it) => {
              const checked = temp.includes(it.id);
              return (
                <button
                  key={it.id}
                  type="button"
                  className="am-item"
                  onClick={() => toggleItem(it.id)}
                >
                  <span className={`am-checkbox ${checked ? 'checked' : ''}`} aria-hidden>
                    <CheckMark />
                  </span>
                  <span>{it.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="am-ft">
          <div className="count">{countLabel}</div>
          <div className="am-ft-actions">
            <button type="button" className="am-clear-btn" onClick={() => setTemp([])}>
              Clear All
            </button>
            <button
              type="button"
              className="am-apply-btn"
              onClick={() => {
                setSelectedAnalytics(temp);
                setAnalyticsOpen(false);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
