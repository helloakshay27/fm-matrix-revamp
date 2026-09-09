import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { defaultDateRange, type DateRangeParams } from '@/services/clubDashboardApi';

type Mode = 'day' | 'month' | 'range';

const TODAY = new Date();
const TODAY_STR = format(TODAY, 'yyyy-MM-dd');
const CURRENT_MONTH_STR = format(TODAY, 'yyyy-MM');
const DEFAULT_RANGE = defaultDateRange(); // last one year: today minus 1 year -> today

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(v: string): string {
  if (!v) return '';
  const d = new Date(v + 'T12:00:00');
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function formatMonthLabel(v: string): string {
  if (!v) return '';
  const [y, m] = v.split('-');
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}

function defaultResultLabel(): string {
  return `Showing: ${formatDate(DEFAULT_RANGE.from_date)} – ${formatDate(DEFAULT_RANGE.to_date)}`;
}

interface TopNavDateFilterProps {
  onApply?: (range: Required<DateRangeParams>) => void;
}

export const TopNavDateFilter: React.FC<TopNavDateFilterProps> = ({ onApply }) => {
  const [mode, setMode] = useState<Mode>('range');
  const [day, setDay] = useState(TODAY_STR);
  const [month, setMonth] = useState(CURRENT_MONTH_STR);
  const [rangeFrom, setRangeFrom] = useState(DEFAULT_RANGE.from_date);
  const [rangeTo, setRangeTo] = useState(DEFAULT_RANGE.to_date);
  const [result, setResult] = useState(defaultResultLabel());

  const apply = () => {
    let from_date: string;
    let to_date: string;
    let label: string;

    if (mode === 'day') {
      from_date = to_date = day;
      label = 'Showing: ' + formatDate(day);
    } else if (mode === 'month') {
      const monthDate = new Date(month + '-01T12:00:00');
      from_date = format(startOfMonth(monthDate), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd');
      to_date = month === CURRENT_MONTH_STR ? TODAY_STR : monthEnd;
      label = 'Showing: ' + formatMonthLabel(month);
    } else {
      from_date = rangeFrom;
      to_date = rangeTo;
      label = 'Showing: ' + formatDate(rangeFrom) + ' – ' + formatDate(rangeTo);
    }

    setResult(label);
    onApply?.({ from_date, to_date });
  };

  const reset = () => {
    setMode('range');
    setDay(TODAY_STR);
    setMonth(CURRENT_MONTH_STR);
    setRangeFrom(DEFAULT_RANGE.from_date);
    setRangeTo(DEFAULT_RANGE.to_date);
    setResult(defaultResultLabel());
    onApply?.(DEFAULT_RANGE);
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
