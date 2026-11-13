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
// Layout uses Tailwind so the header renders correctly even when the
// `body.pulse-app` design layer (set by PulseSidebar) is not active; the
// `pulse-*` classes still let that layer refine it when it is.
export function PulsePageHeader({ title, parent, subtitle, actions, onBack, icon: Icon }: PulsePageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="pulse-page-header mb-6 min-w-0">
      {parent && <>
        <button
          type="button"
          className="pulse-back-button inline-flex items-center gap-1.5 min-h-[36px] text-[13px] font-medium text-gray-900 hover:text-gray-600"
          onClick={onBack ?? (() => navigate(parent.to))}
        >
          <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" /> Back
        </button>
        <nav aria-label="Breadcrumb" className="pulse-breadcrumb mt-1 mb-3 text-xs text-gray-500">
          <ol className="flex flex-wrap items-center gap-2 list-none p-0 m-0">
            <li><Link to={parent.to} className="hover:text-gray-900 hover:underline">{parent.label}</Link></li>
            <li aria-hidden="true" className="flex items-center"><ChevronRight size={14} strokeWidth={1.8} /></li>
            <li aria-current="page" className="text-gray-900">{title}</li>
          </ol>
        </nav>
      </>}
      <div className="pulse-page-heading-row flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="pulse-page-title-line flex items-center gap-3">
            {Icon && (
              <span className="pulse-page-title-icon inline-flex shrink-0 items-center justify-center w-9 h-9 rounded-[10px] bg-gray-100 text-gray-900">
                <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              </span>
            )}
            <h1 className="m-0 text-[22px] font-semibold leading-snug text-gray-900">{title}</h1>
          </div>
          {subtitle && <p className="mt-1.5 mb-0 text-[13px] text-gray-500">{subtitle}</p>}
        </div>
        {actions && <div className="pulse-page-actions flex flex-wrap gap-3">{actions}</div>}
      </div>
    </header>
  );
}
