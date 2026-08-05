import { useMemo } from 'react';

function formatViShellDate(d: Date) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';
  return {
    weekday: dayNames[d.getDay()],
    date: `${day}${suffix} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`,
  };
}

/** Red Vi My Workspace outer shell — matches vi_msafe_v6.html */
export function ViShellBanner() {
  const { weekday, date } = useMemo(() => formatViShellDate(new Date()), []);

  return (
    <header className="vi-shell-banner">
      <div className="vi-shell-brand">
        <div className="vi-shell-logo" aria-hidden>
          <svg viewBox="0 0 40 40" fill="none">
            <path
              d="M4 8l8 24 8-16 8 16 8-24"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="8" cy="6" r="2.5" fill="#fff" />
            <circle cx="20" cy="6" r="2.5" fill="#fff" />
            <circle cx="32" cy="6" r="2.5" fill="#fff" />
          </svg>
        </div>
        <div className="vi-shell-title">
          Vi my workspace <span>Dashboard</span> — Vi mSafe
        </div>
      </div>
      <div className="vi-shell-right">
        <div className="vi-shell-welcome">
          <b>Welcome,</b>
          <br />
          Amrita Kulkarni
        </div>
        <div className="vi-shell-date">
          <b>{weekday}</b>
          <br />
          <span>{date}</span>
        </div>
      </div>
    </header>
  );
}
