import { Paperclip, type LucideIcon } from "lucide-react";
import { VI_AUDIT_STATUS_TONE, isPlanDateBreached, type ViActionPlan, type ViActionTaken } from "./viAuditData";

// Standard recessed tab strip with a raised neutral active segment.
export const auditTabsListClass =
  "inline-flex h-auto flex-wrap gap-1 rounded-[12px] border border-[rgba(26,26,24,0.06)] bg-[#F5F4F0] p-1";
export const auditTabTriggerClass =
  "rounded-[9px] px-4 py-2 text-[13px] font-semibold text-[rgba(26,26,24,0.68)] shadow-none transition-colors hover:text-[#1A1A18] data-[state=active]:bg-white data-[state=active]:text-[#1A1A18] data-[state=active]:shadow-[0_1px_3px_rgba(26,26,24,0.08)]";

/**
 * For multiline TextFields: MUI's TextareaAutosize renders a hidden copy of the textarea
 * (aria-hidden) to measure height, positioned with an inline `position: absolute`. The global
 * `[class*="MuiFormControl"] textarea { position: relative !important }` rules pull that copy
 * back into the layout, so the visible textarea only gets half the width. This puts the hidden
 * copy back out of the flow (more specific + !important) so the textarea fills the field.
 */
export const auditTextareaSx = {
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
  "& textarea:not([aria-hidden='true'])": {
    width: "100% !important",
  },
} as const;

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
        <DueLabel label={plan.dueLabel ?? (isPlanDateBreached(plan) ? "Date breached" : undefined)} />
      </div>
      <p className={`text-sm text-[#1A1A18] ${clampDescription ? "line-clamp-2" : ""}`}>{plan.description}</p>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:max-w-2xl">
        <div>
          <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Action Owner</div>
          <div className="text-sm font-medium text-[#1A1A18]">{plan.actionOwner}</div>
        </div>
        <div>
          <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Target Date</div>
          <div className="text-sm font-medium text-[#1A1A18]">{plan.targetDate}</div>
        </div>
        {/* Shown only when the target date has been extended */}
        {plan.extendedTargetDate && (
          <div>
            <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Extended Target Date</div>
            <div className="text-sm font-medium text-[#1A1A18]">{plan.extendedTargetDate}</div>
          </div>
        )}
      </div>
      {plan.extendedTargetDate && plan.extensionReason && (
        <div className="mt-3">
          <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Reason for Extension</div>
          <p className={`text-sm text-[#1A1A18] ${clampDescription ? "line-clamp-2" : ""}`}>{plan.extensionReason}</p>
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
      className="block w-full px-4 py-4 text-left transition-colors hover:bg-[#F7F6F2] focus-visible:outline-none focus-visible:bg-[#F7F6F2]"
    >
      {body}
    </button>
  ) : (
    <div className="px-4 py-4">{body}</div>
  );
};

// Actions already taken against the plan (its CAPAs): description, closure date, attachments.
export const ActionTakenList = ({ actions }: { actions: ViActionTaken[] }) => (
  <div className="divide-y divide-[rgba(26,26,24,0.08)] overflow-hidden rounded-[12px] border border-[rgba(26,26,24,0.09)]">
    {actions.map((action) => (
      <div key={action.id} className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-[#1A1A18] whitespace-pre-line">{action.description || "-"}</p>
          {/* CAPA status (draft / open / closed) */}
          {action.status && (
            <AuditStatusPill status={action.status === "closed" ? "Closed" : action.status === "open" ? "Open" : "Draft"} />
          )}
        </div>
        <div className="mt-3">
          <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Closure Date</div>
          <div className="text-sm font-medium text-[#1A1A18]">{action.closureDate || "-"}</div>
        </div>
        {action.attachments.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-[rgba(26,26,24,0.48)] mb-2">Attachments</div>
            <div className="flex flex-wrap gap-3">
              {action.attachments.map((file, index) => {
                // Image preview (URLs end in /download, so the type comes from the file name).
                const isImage = /\.(png|jpe?g)$/i.test(file.name) || /^data:image\//i.test(file.url);
                return (
                  <a
                    key={`${file.name}-${index}`}
                    href={file.url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={file.name}
                    className="group flex w-32 flex-col gap-1"
                  >
                    <span className="flex h-24 w-32 items-center justify-center overflow-hidden rounded-[12px] border border-[rgba(26,26,24,0.09)] bg-[#F5F4F0] group-hover:border-[rgba(26,26,24,0.28)]">
                      {file.url && isImage ? (
                        <img src={file.url} alt={file.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <Paperclip className="w-5 h-5 text-[rgba(26,26,24,0.48)]" />
                      )}
                    </span>
                    <span className="truncate text-[11px] text-[rgba(26,26,24,0.68)]">{file.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

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
