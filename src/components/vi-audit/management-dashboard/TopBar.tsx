import type { ModuleKey, Persona } from "./data";
import { AuditTabIcon, GridIcon } from "./icons";

interface TopBarProps {
  persona: Persona;
  module: ModuleKey;
  role: string;
  onPersona: (persona: Persona) => void;
  onModule: (module: ModuleKey) => void;
}

export function TopBar({ persona, module, role, onPersona, onModule }: TopBarProps) {
  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div className="brand-text">
            <div className="name">Audit</div>
            <div className="sub">Vi MyWorkspace · Audit Management</div>
          </div>
        </div>
        <div className="persona-toggle">
          <button type="button" className={`persona-pill${persona === "admin" ? " active" : ""}`} onClick={() => onPersona("admin")}>
            Pan India
          </button>
          <button type="button" className={`persona-pill${persona === "circle" ? " active" : ""}`} onClick={() => onPersona("circle")}>
            Circle Manager
          </button>
        </div>
        <button type="button" className={`mydash-btn${module === "mydashboard" ? " active" : ""}`} onClick={() => onModule("mydashboard")}>
          <GridIcon />
          My Dashboard
        </button>
        <div className="tb-spacer" />
        <div className="tb-avatar">
          <div className="av">AK</div>
          <div className="av-txt">
            <div className="n">Amrita K.</div>
            <div className="r">{role}</div>
          </div>
        </div>
      </header>
    </>
  );
}

export function ModuleTabs({ module, onModule }: Pick<TopBarProps, "module" | "onModule">) {
  return (
    <nav className="module-tabs">
      <button type="button" className={`mtab${module === "audit" ? " active" : ""}`} onClick={() => onModule("audit")}>
        <AuditTabIcon />
        Audit
      </button>
    </nav>
  );
}
