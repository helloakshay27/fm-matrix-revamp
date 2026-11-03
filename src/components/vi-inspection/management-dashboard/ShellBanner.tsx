import { getUser } from "@/utils/auth";
import vimyworkspaceLogo from "@/assets/vimyworkspace-logo.png";

const ordinal = (day: number) => {
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${day}${suffix}`;
};

export function ShellBanner() {
  const user = getUser();
  const name = [user?.firstname, user?.lastname].filter(Boolean).join(" ");
  const today = new Date();
  return (
    <header className="vi-shell-banner">
      <div className="vi-shell-brand">
        {/* Vi My Workspace logo chip, as on the M-Safe dashboard */}
        <div className="vi-shell-logo-chip">
          <img src={vimyworkspaceLogo} alt="Vimyworkspace" className="vi-shell-logo-img" />
        </div>
        <div className="vi-shell-title">
          <span className="vi-shell-sub">Dashboard — Vi Inspection</span>
        </div>
      </div>
      <div className="vi-shell-right">
        {name && <div className="vi-shell-welcome"><b>Welcome,</b><br />{name}</div>}
        <div className="vi-shell-date">
          <b>{today.toLocaleDateString("en-GB", { weekday: "long" })}</b><br />
          <span>{ordinal(today.getDate())} {today.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
        </div>
      </div>
    </header>
  );
}
