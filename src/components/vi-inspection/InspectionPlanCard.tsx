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
  <span className={`inline-flex items-center whitespace-nowrap rounded px-2 py-1 text-xs font-medium ${tone}`}>
    {children}
  </span>
);

const planPill = (plan: ViInspectionActionPlan) => {
  if (isPlanDraft(plan)) return <Pill tone="bg-yellow-100 text-yellow-700">Draft</Pill>;
  if (isPlanClosed(plan)) return <Pill tone="bg-green-100 text-green-700">Closed By Action Owner</Pill>;
  return <Pill tone="bg-yellow-100 text-yellow-700">Pending By Action Owner</Pill>;
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
    <div className="mt-2 space-y-3 rounded-[10px] bg-gray-50 px-3 py-3">
      {assignment.actionTakens.map((entry, index) => (
        <div key={entry.id || index} className={index > 0 ? "border-t border-gray-200 pt-3" : ""}>
          <div className="mb-1 text-xs font-semibold text-gray-500">
            Action Taken {assignment.actionTakens.length > 1 ? index + 1 : ""}
            {assignment.status !== "closed" && " (Draft)"}
          </div>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{entry.description || "-"}</p>
          <div className="mt-2 text-xs text-gray-500">
            Closure Date: <span className="font-medium text-gray-900">{formatInspectionDate(entry.closureDate) || "-"}</span>
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
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-gray-900">{ACTION_TYPE_LABEL[plan.actionType]} Action Plan</span>
        {planPill(plan)}
      </div>
      <p className="mb-4 border-b border-gray-200 pb-4 text-sm text-gray-900 whitespace-pre-wrap">
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
          <div className="mb-2 text-xs text-gray-500">Extension History</div>
          <ul className="space-y-1.5 text-xs text-gray-900">
            {plan.extensions.map((ext, i) => (
              <li key={i}>
                {formatInspectionDate(ext.previousDate) || "-"} → <span className="font-medium">{formatInspectionDate(ext.newDate)}</span>
                {ext.reason && <span className="text-gray-600"> — {ext.reason}</span>}
                {ext.by && <span className="text-gray-500"> ({ext.by}{ext.at ? `, ${formatInspectionDate(ext.at)}` : ""})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <div className="mb-2 text-xs text-gray-500">Responsible Persons ({plan.assignments.length})</div>
        {plan.assignments.length ? (
          <ul className="divide-y divide-gray-200 rounded-[10px] border border-gray-200">
            {plan.assignments.map((a) => {
              const status = assignmentStatus(a.status);
              const mine = Boolean(isMine?.(a));
              return (
                <li key={a.id} className="px-3 py-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <span className="truncate">{a.owner?.name || "Unassigned"}</span>
                        {mine && (
                          <span className="rounded-full bg-gray-100 px-2 py-[1px] text-[10px] font-semibold text-gray-600">
                            You
                          </span>
                        )}
                      </div>
                      {a.owner?.email && <div className="truncate text-xs text-gray-500">{a.owner.email}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      {a.status === "closed" && a.closureDate && (
                        <span className="text-xs text-gray-500">Closed {formatInspectionDate(a.closureDate)}</span>
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
          <div className="text-sm font-medium text-gray-900">-</div>
        )}
        {!isPlanDraft(plan) && plan.assignments.length > 0 && (
          <p className="mt-2 text-xs font-medium text-gray-600">
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
