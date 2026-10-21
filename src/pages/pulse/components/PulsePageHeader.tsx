import type { ReactNode } from "react";
import { ArrowLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface PulsePageHeaderProps {
  title: string;
  parent?: { label: string; to: string };
  subtitle?: string;
  actions?: ReactNode;
  onBack?: () => void;
  icon?: LucideIcon;
}

// Audit 01.01/01.02: Back, breadcrumb, page title, then toolbar/content.
export function PulsePageHeader({ title, parent, subtitle, actions, onBack, icon: Icon }: PulsePageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="pulse-page-header">
      {parent && <>
        <button type="button" className="pulse-back-button" onClick={onBack ?? (() => navigate(parent.to))}>
          <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" /> Back
        </button>
        <nav aria-label="Breadcrumb" className="pulse-breadcrumb">
          <ol>
            <li><Link to={parent.to}>{parent.label}</Link></li>
            <li aria-hidden="true"><ChevronRight size={14} strokeWidth={1.8} /></li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
      </>}
      <div className="pulse-page-heading-row">
        <div><div className="pulse-page-title-line">{Icon && <span className="pulse-page-title-icon"><Icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>}<h1>{title}</h1></div>{subtitle && <p>{subtitle}</p>}</div>
        {actions && <div className="pulse-page-actions">{actions}</div>}
      </div>
    </header>
  );
}
