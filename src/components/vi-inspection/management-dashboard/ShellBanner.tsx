import { ViLogo } from "./icons";

export function ShellBanner() {
  return (
    <header className="vi-shell-banner">
      <div className="vi-shell-brand">
        <div className="vi-shell-logo"><ViLogo /></div>
        <div className="vi-shell-title">Vi my workspace <span>Dashboard</span> — Vi Inspection</div>
      </div>
      <div className="vi-shell-right">
        <div className="vi-shell-welcome"><b>Welcome,</b><br />Amrita Kulkarni</div>
        <div className="vi-shell-date"><b>Wednesday</b><br /><span>21st October, 2026</span></div>
      </div>
    </header>
  );
}
