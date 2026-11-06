import type { ModuleKey, Persona } from "./data";
import { getUser } from "@/utils/auth";
import { AuditTabIcon } from "./icons";

interface TopBarProps {
  persona: Persona;
  module: ModuleKey;
  role: string;
  onPersona: (persona: Persona) => void;
  onModule: (module: ModuleKey) => void;
}

export function TopBar({ persona, role, onPersona }: TopBarProps) {
  // Logged-in user for the avatar.
  const user = getUser();
  const name = [user?.firstname, user?.lastname].filter(Boolean).join(" ");
  const initials = [user?.firstname, user?.lastname].map((part) => part?.trim()[0] ?? "").join("").toUpperCase();
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">P</div>
        <div className="brand-text">
          <div className="name">Inspection</div>
          <div className="sub">Vi MyWorkspace · Planned General Inspection</div>
        </div>
      </div>
      <div className="persona-toggle">
        <button type="button" className={`persona-pill${persona === "admin" ? " active" : ""}`} onClick={() => onPersona("admin")}>Pan India</button>
        <button type="button" className={`persona-pill${persona === "circle" ? " active" : ""}`} onClick={() => onPersona("circle")}>Circle Manager</button>
      </div>
      <div className="tb-spacer" />
      <div className="tb-avatar">
        {initials && <div className="av">{initials}</div>}
        <div className="av-txt">{name && <div className="n">{name}</div>}<div className="r">{role}</div></div>
      </div>
    </header>
  );
}

export function ModuleTabs({ module, onModule }: Pick<TopBarProps, "module" | "onModule">) {
  return (
    <nav className="module-tabs">
      <button type="button" className={`mtab${module === "inspection" ? " active" : ""}`} onClick={() => onModule("inspection")}>
        <AuditTabIcon /> Inspection
      </button>
    </nav>
  );
}
