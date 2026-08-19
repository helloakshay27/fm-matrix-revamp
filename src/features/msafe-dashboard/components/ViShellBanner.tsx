import { useMemo } from 'react';
import vimyworkspaceLogo from '@/assets/vimyworkspace-logo.png';
import { getUser } from '@/utils/auth';

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
  const user = getUser();
  const displayName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || 'User';

  return (
    <header className="vi-shell-banner">
      <div className="vi-shell-brand">
        <div className="vi-shell-logo-chip">
          <img src={vimyworkspaceLogo} alt="Vimyworkspace" className="vi-shell-logo-img" />
        </div>
        <div className="vi-shell-title">
          <span className="vi-shell-sub">Dashboard — Vi mSafe</span>
        </div>
      </div>
      <div className="vi-shell-right">
        <div className="vi-shell-welcome">
          <b>Welcome,</b>
          <br />
          {displayName}
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
