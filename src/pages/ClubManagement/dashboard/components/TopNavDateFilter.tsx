import React, { useState } from 'react';

type Mode = 'day' | 'month' | 'range';

const DEFAULT_DAY = '2026-07-14';
const DEFAULT_MONTH = '2026-07';
const DEFAULT_RANGE_FROM = '2026-07-01';
const DEFAULT_RANGE_TO = '2026-07-14';
const DEFAULT_RESULT = 'Showing: 14 Jul 2026';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(v: string): string {
  if (!v) return '';
  const d = new Date(v + 'T12:00:00');
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function formatMonth(v: string): string {
  if (!v) return '';
  const [y, m] = v.split('-');
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}

export const TopNavDateFilter: React.FC = () => {
  const [mode, setMode] = useState<Mode>('day');
  const [day, setDay] = useState(DEFAULT_DAY);
  const [month, setMonth] = useState(DEFAULT_MONTH);
  const [rangeFrom, setRangeFrom] = useState(DEFAULT_RANGE_FROM);
  const [rangeTo, setRangeTo] = useState(DEFAULT_RANGE_TO);
  const [result, setResult] = useState(DEFAULT_RESULT);

  const apply = () => {
    if (mode === 'day') setResult('Showing: ' + formatDate(day));
    else if (mode === 'month') setResult('Showing: ' + formatMonth(month));
    else setResult('Showing: ' + formatDate(rangeFrom) + ' – ' + formatDate(rangeTo));
  };

  const reset = () => {
    setDay(DEFAULT_DAY);
    setMonth(DEFAULT_MONTH);
    setRangeFrom(DEFAULT_RANGE_FROM);
    setRangeTo(DEFAULT_RANGE_TO);
    setResult(DEFAULT_RESULT);
    setMode('day');
  };

  return (
    <div className="topnav-datefilter">
      <div className="dfb-tab-group">
        <button className={'dfb-tab' + (mode === 'day' ? ' active' : '')} onClick={() => setMode('day')}>Day</button>
        <button className={'dfb-tab' + (mode === 'month' ? ' active' : '')} onClick={() => setMode('month')}>Month</button>
        <button className={'dfb-tab' + (mode === 'range' ? ' active' : '')} onClick={() => setMode('range')}>Range</button>
      </div>
      <span className="dfb-select-lbl">Select Date:</span>
      {mode === 'day' && <input type="date" className="dfb-date-input" value={day} onChange={(e) => setDay(e.target.value)} />}
      {mode === 'month' && <input type="month" className="dfb-date-input" value={month} onChange={(e) => setMonth(e.target.value)} />}
      {mode === 'range' && (
        <div className="dfb-range-row">
          <input type="date" className="dfb-date-input" value={rangeFrom} onChange={(e) => setRangeFrom(e.target.value)} />
          <span className="dfb-range-sep">to</span>
          <input type="date" className="dfb-date-input" value={rangeTo} onChange={(e) => setRangeTo(e.target.value)} />
        </div>
      )}
      <button className="dfb-apply" onClick={apply}>Apply</button>
      <button className="dfb-reset" onClick={reset}>Reset</button>
      <span className="dfb-result">{result}</span>
    </div>
  );
};
