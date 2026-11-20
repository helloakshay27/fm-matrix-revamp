import { useId, useState, type ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  headerActions?: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  /**
   * "card" matches the Club Management form cards (e.g. /club-management/class-booking/add):
   * hairline-bordered card, small round grey icon chip, UPPERCASE title, no collapse.
   * Uses its own classes so the body.pulse-app section overrides don't restyle it.
   */
  variant?: "pulse" | "card";
}

function CardSection({ title, icon: Icon, children, headerActions }: Pick<Props, "title" | "icon" | "children" | "headerActions">) {
  const id = useId();
  return (
    <section
      className="bg-white rounded-2xl border border-[rgba(26,26,24,0.09)] shadow-none overflow-hidden"
      aria-labelledby={`${id}-title`}
    >
      <div className="p-4 sm:p-6 flex justify-between items-center gap-3 bg-white">
        <h2
          id={`${id}-title`}
          className="m-0 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.02em] text-[#2c2c2c]"
        >
          <span className="bg-[#f5f4f0] text-[rgba(26,26,24,0.68)] rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
          </span>
          {title}
        </h2>
        {headerActions && <div>{headerActions}</div>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

const iconBox = "pulse-section-icon inline-flex shrink-0 items-center justify-center w-9 h-9 rounded-[10px] bg-gray-100 text-gray-900";

// Keep fields mounted while collapsed so edits and component state survive.
// Layout uses Tailwind so the section renders correctly even when the
// `body.pulse-app` design layer is not active.
export function PulseFormSection(props: Props) {
  if (props.variant === "card") return <CardSection {...props} />;
  return <DefaultSection {...props} />;
}

function DefaultSection({ title, icon: Icon, children, headerActions, collapsible = true, defaultExpanded = true }: Props) {
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
