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

const iconBox = "pulse-section-icon inline-flex shrink-0 items-center justify-center w-9 h-9 rounded-[10px] bg-gray-100 text-gray-900";

// Keep fields mounted while collapsed so edits and component state survive.
// Layout uses Tailwind so the section renders correctly even when the
// `body.pulse-app` design layer is not active.
export function PulseFormSection({ title, icon: Icon, children, headerActions, collapsible = true, defaultExpanded = true }: Props) {
  const id = useId();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const open = !collapsible || expanded;
  return (
    <section
      className="pulse-form-section bg-white rounded-2xl py-[22px] px-6 [&+&]:mt-5"
      aria-labelledby={`${id}-title`}
      onInvalidCapture={(event) => {
        if (!open) {
          setExpanded(true);
          const field = event.target as HTMLElement;
          requestAnimationFrame(() => field.focus());
        }
      }}
    >
      <div className="pulse-section-heading flex items-center gap-3">
        <h2 id={`${id}-title`} className="flex-1 min-w-0 m-0 text-sm font-semibold leading-snug normal-case tracking-normal text-gray-900">
          {collapsible ? (
            <button
              type="button"
              className="flex w-full items-center gap-2 min-h-[28px] text-left"
              aria-expanded={open}
              aria-controls={`${id}-body`}
              onClick={() => setExpanded(value => !value)}
            >
              <span className={iconBox}><Icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
              <span>{title}</span>
              <ChevronDown
                className={`pulse-section-chevron ml-auto shrink-0 text-gray-900 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                data-open={open}
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          ) : (
            <span className="pulse-section-label flex w-full items-center gap-2 min-h-[28px]">
              <span className={iconBox}><Icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
              {title}
            </span>
          )}
        </h2>
        {headerActions && <div className="pulse-section-actions">{headerActions}</div>}
      </div>
      <div id={`${id}-body`} className="pulse-section-body mt-3" hidden={!open}>{children}</div>
    </section>
  );
}
