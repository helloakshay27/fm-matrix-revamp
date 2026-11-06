import { getUser } from "@/utils/auth";
import type { ModuleKey, Persona } from "./data";
import { AuditTabIcon } from "./icons";

interface TopBarProps {
  persona: Persona;
  module: ModuleKey;
  role: string;
  onPersona: (persona: Persona) => void;
  onModule: (module: ModuleKey) => void;
}

// `module` / `onModule` stay in the props for when the My Dashboard button is restored.
export function TopBar({ persona, role, onPersona }: TopBarProps) {
  const user = getUser();
  const firstName = user?.firstname?.trim() || "User";
  const lastInitial = user?.lastname?.trim()?.[0];
  const shortName = lastInitial ? `${firstName} ${lastInitial}.` : firstName;
  const initials = `${firstName[0] || ""}${lastInitial || ""}`.toUpperCase() || "U";

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">I</div>
        <div className="brand-text">
          <div className="name">Incident</div>
          <div className="sub">Vi MyWorkspace · Incident Management</div>
        </div>
      </div>
      <div className="persona-toggle">
        <button type="button" className={`persona-pill${persona === "admin" ? " active" : ""}`} onClick={() => onPersona("admin")}>Pan India</button>
        <button type="button" className={`persona-pill${persona === "circle" ? " active" : ""}`} onClick={() => onPersona("circle")}>Circle Manager</button>
      </div>
      {/* My Dashboard is hidden for now.
      <button type="button" className={`mydash-btn${module === "mydashboard" ? " active" : ""}`} onClick={() => onModule("mydashboard")}>
        <GridIcon /> My Dashboard
      </button> */}
      <div className="tb-spacer" />
      <div className="tb-avatar">
        <div className="av">{initials}</div>
        <div className="av-txt"><div className="n">{shortName}</div><div className="r">{role}</div></div>
      </div>
    </header>
  );
}

export function ModuleTabs({ module, onModule }: Pick<TopBarProps, "module" | "onModule">) {
  return (
    <nav className="module-tabs">
      <button type="button" className={`mtab${module === "incident" ? " active" : ""}`} onClick={() => onModule("incident")}>
        <AuditTabIcon /> Incident
      </button>
    </nav>
  );
}
