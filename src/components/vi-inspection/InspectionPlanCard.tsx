import type { ReactNode } from "react";
import { FieldGrid } from "@/components/vi-audit/ViAuditUi";
import { AttachmentLinks } from "@/components/vi-incident/IncidentFormFields";
import {
  ACTION_TYPE_LABEL,
  assignmentStatus,
  formatInspectionDate,
  isPlanClosed,
  isPlanDraft,
  type ViInspectionActionPlan,
  type ViInspectionAssignment,
} from "./viInspectionData";

const Pill = ({ tone, children }: { tone: string; children: ReactNode }) => (
  <span className={`inline-flex items-center whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11px] font-medium ${tone}`}>
    {children}
  </span>
);

const planPill = (plan: ViInspectionActionPlan) => {
  if (isPlanDraft(plan)) return <Pill tone="bg-[#FBE3D8] text-[#B5502A]">Draft</Pill>;
  if (isPlanClosed(plan)) return <Pill tone="bg-[#DDEBD3] text-[#4A6B2E]">Closed By Action Owner</Pill>;
  return <Pill tone="bg-[#F8E4C7] text-[#8A5A12]">Pending By Action Owner</Pill>;
};

/** "18 Sep 2026", or "18 Sep 2026 (extended to 30 Nov 2026)". */
export const planTargetLabel = (plan: ViInspectionActionPlan) => {
  if (!plan.targetDate) return "";
  const target = formatInspectionDate(plan.targetDate);
  return plan.extendTargetDate ? `${target} (extended to ${formatInspectionDate(plan.extendTargetDate)})` : target;
};

/** One owner's action-taken entries (each with description, closure date and attachments). */
const AssignmentEntries = ({ assignment, isMine }: { assignment: ViInspectionAssignment; isMine: boolean }) => {
  // Entries of an unsubmitted assignment are the owner's own draft.
  if (!assignment.actionTakens.length || (assignment.status !== "closed" && !isMine)) return null;
  return (
    <div className="mt-2 space-y-3 rounded-[10px] bg-[#F7F6F2] px-3 py-3">
      {assignment.actionTakens.map((entry, index) => (
        <div key={entry.id || index} className={index > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-3" : ""}>
          <div className="mb-1 text-xs font-semibold text-[rgba(26,26,24,0.48)]">
            Action Taken {assignment.actionTakens.length > 1 ? index + 1 : ""}
            {assignment.status !== "closed" && " (Draft)"}
          </div>
          <p className="text-sm text-[#1A1A18] whitespace-pre-wrap">{entry.description || "-"}</p>
          <div className="mt-2 text-xs text-[rgba(26,26,24,0.48)]">
            Closure Date: <span className="font-medium text-[#1A1A18]">{formatInspectionDate(entry.closureDate) || "-"}</span>
          </div>
          {entry.attachments.length > 0 && (
            <div className="mt-2">
              <AttachmentLinks attachments={entry.attachments} tone="white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Read-only corrective / preventive plan: description, original and extended target date with the
 * extension history, every responsible person's status and their action-taken entries.
 */
export const InspectionPlanCard = ({
  plan,
  isMine,
  actions,
}: {
  plan: ViInspectionActionPlan;
  /** Marks the logged-in owner's assignment ("You") and shows their unsubmitted entries. */
  isMine?: (assignment: ViInspectionAssignment) => boolean;
  /** Extra controls, e.g. the SPOC's "Extend Target Date". */
  actions?: ReactNode;
}) => {
  const pending = plan.assignments.filter((a) => a.status !== "closed");
  return (
    <div className="rounded-xl border border-[rgba(26,26,24,0.09)] p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-[#1A1A18]">{ACTION_TYPE_LABEL[plan.actionType]} Action Plan</span>
        {planPill(plan)}
      </div>
      <p className="mb-4 border-b border-[rgba(26,26,24,0.09)] pb-4 text-sm text-[#1A1A18] whitespace-pre-wrap">
        {plan.description || "-"}
      </p>
      <FieldGrid
        columns={2}
        fields={[
          { label: "Target Date", value: planTargetLabel(plan) },
          ...(plan.extensionReason ? [{ label: "Reason for Extension", value: plan.extensionReason }] : []),
        ]}
      />

      {plan.extensions.length > 1 && (
        <div className="mt-4">
          <div className="mb-2 text-xs text-[rgba(26,26,24,0.48)]">Extension History</div>
          <ul className="space-y-1.5 text-xs text-[#1A1A18]">
            {plan.extensions.map((ext, i) => (
              <li key={i}>
                {formatInspectionDate(ext.previousDate) || "-"} → <span className="font-medium">{formatInspectionDate(ext.newDate)}</span>
                {ext.reason && <span className="text-[rgba(26,26,24,0.68)]"> — {ext.reason}</span>}
                {ext.by && <span className="text-[rgba(26,26,24,0.48)]"> ({ext.by}{ext.at ? `, ${formatInspectionDate(ext.at)}` : ""})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <div className="mb-2 text-xs text-[rgba(26,26,24,0.48)]">Responsible Persons ({plan.assignments.length})</div>
        {plan.assignments.length ? (
          <ul className="divide-y divide-[rgba(26,26,24,0.08)] rounded-[10px] border border-[rgba(26,26,24,0.09)]">
            {plan.assignments.map((a) => {
              const status = assignmentStatus(a.status);
              const mine = Boolean(isMine?.(a));
              return (
                <li key={a.id} className="px-3 py-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#1A1A18]">
                        <span className="truncate">{a.owner?.name || "Unassigned"}</span>
                        {mine && (
                          <span className="rounded-full bg-[#F5F4F0] px-2 py-[1px] text-[10px] font-semibold text-[rgba(26,26,24,0.68)]">
                            You
                          </span>
                        )}
                      </div>
                      {a.owner?.email && <div className="truncate text-xs text-[rgba(26,26,24,0.48)]">{a.owner.email}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      {a.status === "closed" && a.closureDate && (
                        <span className="text-xs text-[rgba(26,26,24,0.48)]">Closed {formatInspectionDate(a.closureDate)}</span>
                      )}
                      {!isPlanDraft(plan) && <Pill tone={status.tone}>{status.label}</Pill>}
                    </div>
                  </div>
                  <AssignmentEntries assignment={a} isMine={mine} />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-sm font-medium text-[#1A1A18]">-</div>
        )}
        {!isPlanDraft(plan) && plan.assignments.length > 0 && (
          <p className="mt-2 text-xs font-medium text-[rgba(26,26,24,0.68)]">
            {pending.length
              ? `Pending with: ${pending.map((a) => a.owner?.name || "Unassigned").join(", ")}`
              : "All responsible persons have taken action"}
          </p>
        )}
      </div>

      {actions && <div className="mt-4">{actions}</div>}
    </div>
  );
};
