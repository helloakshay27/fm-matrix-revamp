import type { LucideIcon } from "lucide-react";
import { VI_AUDIT_STATUS_TONE, type ViActionPlan } from "./viAuditData";

// Standard recessed tab strip with a raised neutral active segment.
export const auditTabsListClass =
  "inline-flex h-auto flex-wrap gap-1 rounded-[12px] border border-[rgba(26,26,24,0.06)] bg-[#F5F4F0] p-1";
export const auditTabTriggerClass =
  "rounded-[9px] px-4 py-2 text-[13px] font-semibold text-[rgba(26,26,24,0.68)] shadow-none transition-colors hover:text-[#1A1A18] data-[state=active]:bg-white data-[state=active]:text-[#1A1A18] data-[state=active]:shadow-[0_1px_3px_rgba(26,26,24,0.08)]";

export const sectionIcon = (Icon: LucideIcon) => (
  <Icon className="w-[18px] h-[18px]" style={{ color: "rgba(26, 26, 24, 0.68)" }} />
);

export const AuditStatusPill = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11px] font-medium ${
      VI_AUDIT_STATUS_TONE[status] ?? VI_AUDIT_STATUS_TONE.Closed
    }`}
  >
    {status}
  </span>
);

// CAPA progress tone from the API key (capa_plan_not_started / …_in_progress / …_completed);
// unknown keys fall back to neutral.
const capaProgressTone = (progressKey = "") => {
  const key = progressKey.toLowerCase();
  if (key.includes("not_started")) return VI_AUDIT_STATUS_TONE.Draft;
  if (key.includes("complete") || key.includes("closed") || key.includes("done")) return VI_AUDIT_STATUS_TONE.Completed;
  if (key.includes("progress") || key.includes("started")) return VI_AUDIT_STATUS_TONE.Open;
  return VI_AUDIT_STATUS_TONE.Closed;
};

// Badge for an action plan's CAPA progress (capa_progress label, toned by capa_progress_key).
export const CapaProgressPill = ({ label, progressKey }: { label: string; progressKey?: string }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11px] font-medium ${capaProgressTone(
      progressKey,
    )}`}
  >
    {label}
  </span>
);

// Read-only label / value grid used inside the detail cards.
export const FieldGrid = ({
  fields,
  columns = 3,
}: {
  fields: { label: string; value?: string; span?: boolean }[];
  columns?: 2 | 3 | 4;
}) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 ${
      columns === 4 ? "lg:grid-cols-4" : columns === 3 ? "lg:grid-cols-3" : ""
    } gap-x-6 gap-y-4`}
  >
    {fields.map(({ label, value, span }) => (
      <div key={label} className={span ? "sm:col-span-2 lg:col-span-full" : ""}>
        <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">{label}</div>
        <div className="text-sm font-medium text-[#1A1A18] break-words">{value || "-"}</div>
      </div>
    ))}
  </div>
);

// Due date marker on observation / action-plan cards (warning tone).
export const DueLabel = ({ label }: { label?: string }) =>
  label ? <span className="text-xs font-medium text-[#B04A55] whitespace-nowrap">{label}</span> : null;

// One corrective / preventive action-plan record (ID, due date, description, owner,
// target date, CAPA progress — or status when the API sends no CAPA progress). Pass `onClick`
// to make the whole record open its detail page.
export const ActionPlanRecord = ({
  plan,
  onClick,
  clampDescription = false,
}: {
  plan: ViActionPlan;
  onClick?: () => void;
  clampDescription?: boolean;
}) => {
  const body = (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-[rgba(26,26,24,0.48)]">{plan.actionNo ?? plan.id}</span>
        <DueLabel label={plan.dueLabel} />
      </div>
      <p className={`text-sm text-[#1A1A18] ${clampDescription ? "line-clamp-2" : ""}`}>{plan.description}</p>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:max-w-md">
        <div>
          <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Action Owner</div>
          <div className="text-sm font-medium text-[#1A1A18]">{plan.actionOwner}</div>
        </div>
        <div>
          <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Target Date</div>
          <div className="text-sm font-medium text-[#1A1A18]">{plan.targetDate}</div>
        </div>
      </div>
      <div className="mt-3">
        {plan.capaProgress ? (
          <CapaProgressPill label={plan.capaProgress} progressKey={plan.capaProgressKey} />
        ) : (
          <AuditStatusPill status={plan.status} />
        )}
      </div>
    </>
  );

  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className="block w-full px-4 py-4 text-left transition-colors hover:bg-[#F7F6F2] focus-visible:outline-none focus-visible:bg-[#F7F6F2]"
    >
      {body}
    </button>
  ) : (
    <div className="px-4 py-4">{body}</div>
  );
};

// Full-page loading / not-found state for the audit detail screens.
export const AuditLoadingState = ({ message, onBack }: { message: string; onBack?: () => void }) => (
  <div className="p-6 min-h-screen">
    {onBack && (
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 text-sm text-[rgba(26,26,24,0.68)] hover:text-[#1A1A18]"
      >
        ← Back
      </button>
    )}
    <p className="py-16 text-center text-sm text-[rgba(26,26,24,0.48)]">{message}</p>
  </div>
);
