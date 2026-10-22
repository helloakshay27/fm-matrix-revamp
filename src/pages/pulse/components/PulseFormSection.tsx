import { useId, useState, type ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  headerActions?: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

// Keep fields mounted while collapsed so edits and component state survive.
export function PulseFormSection({ title, icon: Icon, children, headerActions, collapsible = true, defaultExpanded = true }: Props) {
  const id = useId();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const open = !collapsible || expanded;
  return (
    <section className="pulse-form-section" aria-labelledby={`${id}-title`} onInvalidCapture={(event) => {
      if (!open) {
        setExpanded(true);
        const field = event.target as HTMLElement;
        requestAnimationFrame(() => field.focus());
      }
    }}>
      <div className="pulse-section-heading">
        <h2 id={`${id}-title`}>
          {collapsible ? (
            <button type="button" aria-expanded={open} aria-controls={`${id}-body`} onClick={() => setExpanded(value => !value)}>
              <span className="pulse-section-icon"><Icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
              <span>{title}</span>
              <ChevronDown className="pulse-section-chevron" data-open={open} size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>
          ) : <span className="pulse-section-label"><span className="pulse-section-icon"><Icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>{title}</span>}
        </h2>
        {headerActions && <div className="pulse-section-actions">{headerActions}</div>}
      </div>
      <div id={`${id}-body`} className="pulse-section-body" hidden={!open}>{children}</div>
    </section>
  );
}
