import type { LucideIcon } from "lucide-react";
import { VI_AUDIT_STATUS_TONE, isPlanDateBreached, type ViActionPlan } from "./viAuditData";

// Page tabs in the Ticket details style (TicketDetailsPage): the strip sits in a white bordered
// box (auditTabsWrapperClass), equal-width segments, beige + brand text when active.
export const auditTabsWrapperClass = "bg-white rounded-lg border border-gray-200 shadow-sm";
export const auditTabsListClass = "w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch";
export const auditTabTriggerClass =
  "flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-brand border-r border-gray-200 last:border-r-0 font-semibold";
export const auditTabContentClass = "p-4 sm:p-6";

// MUI outlined field look of the ticket forms (AddTicketDashboard fieldStyles): white input,
// #ddd border, brand border + label on hover / focus. Styles only the input box (no fixed height,
// no root background), so multiline fields grow and nothing shows below the field.
export const auditFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "#ddd" },
    "&:hover fieldset": { borderColor: "var(--color-primary)" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
  // Multiline: MUI's TextareaAutosize renders a hidden copy (aria-hidden) to measure height; the
  // global `[class*="MuiFormControl"] textarea { position: relative !important }` pulls it into
  // the layout so the visible textarea gets half the width. Keep the copy out of the flow.
  "& textarea[aria-hidden='true']": {
    position: "absolute !important",
    visibility: "hidden",
    top: 0,
    left: 0,
    width: "100% !important",
    height: "0 !important",
    minHeight: "0 !important",
    maxHeight: "0 !important",
    padding: "0 !important",
    overflow: "hidden !important",
    pointerEvents: "none",
  },
  "& textarea:not([aria-hidden='true'])": { width: "100% !important" },
} as const;

/**
 * Only the text-area fix part of auditFieldSx, for multiline TextFields that don't use the full
 * field look (hidden TextareaAutosize copy kept out of the layout so the textarea is full width).
 */
export const auditTextareaSx = {
  "& textarea[aria-hidden='true']": auditFieldSx["& textarea[aria-hidden='true']"],
  "& textarea:not([aria-hidden='true'])": auditFieldSx["& textarea:not([aria-hidden='true'])"],
} as const;

// MUI Switch / Checkbox in the brand colour (on / checked), like the ticket module controls.
export const auditSwitchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--color-primary)" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "var(--color-primary)", opacity: 0.5 },
} as const;
export const auditCheckboxSx = {
  "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "var(--color-primary)" },
} as const;

// Section-card header icon (inside DetailCard's round tile), brand coloured like the ticket cards.
export const sectionIcon = (Icon: LucideIcon) => <Icon className="w-5 h-5 text-brand" />;

// Status badge — same shape and tones as the ticket table status.
export const AuditStatusPill = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap px-2 py-1 rounded text-xs font-medium ${
      VI_AUDIT_STATUS_TONE[status] ?? VI_AUDIT_STATUS_TONE.default
    }`}
  >
    {status}
  </span>
);

// CAPA progress tone from the API key (capa_plan_not_started / …_in_progress / …_completed);
// unknown keys fall back to the default tone.
const capaProgressTone = (progressKey = "") => {
  const key = progressKey.toLowerCase();
  if (key.includes("not_started")) return VI_AUDIT_STATUS_TONE.Draft;
  if (key.includes("complete") || key.includes("closed") || key.includes("done")) return VI_AUDIT_STATUS_TONE.Completed;
  if (key.includes("progress") || key.includes("started")) return VI_AUDIT_STATUS_TONE.Open;
  return VI_AUDIT_STATUS_TONE.default;
};

// Badge for an action plan's CAPA progress (capa_progress label, toned by capa_progress_key).
export const CapaProgressPill = ({ label, progressKey }: { label: string; progressKey?: string }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap px-2 py-1 rounded text-xs font-medium ${capaProgressTone(
      progressKey,
    )}`}
  >
    {label}
  </span>
);

// Read-only label / value grid used inside the detail cards — label on the left, value on the
// right, as in the ticket details cards.
export const FieldGrid = ({
  fields,
  columns = 3,
}: {
  fields: { label: string; value?: string; span?: boolean }[];
  columns?: 2 | 3 | 4;
}) => (
  <div
    className={`grid grid-cols-1 md:grid-cols-2 ${
      columns === 4 ? "lg:grid-cols-4" : columns === 3 ? "lg:grid-cols-3" : ""
    } gap-y-4 gap-x-8`}
  >
    {fields.map(({ label, value, span }) => (
      <div key={label} className={`flex items-start ${span ? "md:col-span-2 lg:col-span-full" : ""}`}>
        <div className="w-[140px] text-[14px] leading-tight text-gray-500 tracking-wide flex-shrink-0">{label}</div>
        <div className="text-[14px] font-semibold text-gray-900 flex-1 break-words">{value || "-"}</div>
      </div>
    ))}
  </div>
);

// Due date marker on observation / action-plan cards (warning tone).
export const DueLabel = ({ label }: { label?: string }) =>
  label ? <span className="text-xs font-semibold text-brand whitespace-nowrap">{label}</span> : null;

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
        <span className="text-xs font-semibold text-gray-500">{plan.actionNo ?? plan.id}</span>
        <DueLabel label={plan.dueLabel ?? (isPlanDateBreached(plan) ? "Date breached" : undefined)} />
      </div>
      <p className={`text-sm text-gray-900 ${clampDescription ? "line-clamp-2" : ""}`}>{plan.description}</p>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 sm:max-w-xl">
        <div className="flex items-start">
          <div className="w-[120px] text-[14px] leading-tight text-gray-500 tracking-wide flex-shrink-0">Action Owner</div>
          <div className="text-[14px] font-semibold text-gray-900">{plan.actionOwner || "-"}</div>
        </div>
        <div className="flex items-start">
          <div className="w-[120px] text-[14px] leading-tight text-gray-500 tracking-wide flex-shrink-0">Target Date</div>
          <div className="text-[14px] font-semibold text-gray-900">{plan.targetDate || "-"}</div>
        </div>
        {/* Shown only when the target date has been extended */}
        {plan.extendedTargetDate && (
          <div className="flex items-start">
            <div className="w-[120px] text-[14px] leading-tight text-gray-500 tracking-wide flex-shrink-0">Extended Target Date</div>
            <div className="text-[14px] font-semibold text-gray-900">{plan.extendedTargetDate}</div>
          </div>
        )}
      </div>
      {plan.extendedTargetDate && plan.extensionReason && (
        <div className="mt-2 flex items-start">
          <div className="w-[120px] text-[14px] leading-tight text-gray-500 tracking-wide flex-shrink-0">Reason for Extension</div>
          <p className={`text-[14px] font-semibold text-gray-900 flex-1 ${clampDescription ? "line-clamp-2" : ""}`}>{plan.extensionReason}</p>
        </div>
      )}
      <div className="mt-3">
        {plan.capaClosure ? (
          // capa_closure label, toned by capa_closure_key (closed by action owner = green, else pending)
          <span
            className={`inline-flex items-center whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11px] font-medium ${
              plan.capaClosureKey === "capa_plan_closed_by_action_owner"
                ? VI_AUDIT_STATUS_TONE["Closed By Action Owner"]
                : VI_AUDIT_STATUS_TONE["Pending By Action Owner"]
            }`}
          >
            {plan.capaClosure}
          </span>
        ) : plan.capaProgress ? (
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
      className="block w-full bg-white px-4 py-4 text-left transition-colors hover:bg-[#F6F4EE] focus-visible:outline-none focus-visible:bg-[#F6F4EE]"
    >
      {body}
    </button>
  ) : (
    <div className="bg-white px-4 py-4">{body}</div>
  );
};

// Full-page loading / not-found state for the audit detail screens.
export const AuditLoadingState = ({ message, onBack }: { message: string; onBack?: () => void }) => (
  <div className="p-4 sm:p-6 min-h-screen">
    {onBack && (
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mb-4">
        ← Back
      </button>
    )}
    <p className="py-16 text-center text-sm text-gray-500">{message}</p>
  </div>
);
