import { IncidentFieldGrid as FieldGrid } from "@/components/vi-incident/IncidentFieldGrid";
import type { ReactNode } from "react";
import { CheckSquare, ShieldCheck } from "lucide-react";
import { DetailCard } from "@/components/ui/detail-card";
import { AuditStatusPill, DueLabel, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { AttachmentLinks } from "./IncidentFormFields";
import {
  ACTION_TYPE_LABEL,
  formatIncidentDate,
  groupPlansByItem,
  isPlanClosed,
  viIncidentPlanDueLabel,
  type ViIncidentActionPlan,
  type ViIncidentAssignment,
  type ViIncidentRecord,
} from "./viIncidentData";

/** "18 Sep 2026", or "18 Sep 2026 (extended to 30 Nov 2026)". */
export const planTargetLabel = (plan: ViIncidentActionPlan) => {
  if (!plan.targetDate) return "";
  const target = formatIncidentDate(plan.targetDate);
  return plan.extendTargetDate ? `${target} (extended to ${formatIncidentDate(plan.extendTargetDate)})` : target;
};

export const PlanStatusPill = ({ plan }: { plan: ViIncidentActionPlan }) => (
  <AuditStatusPill status={isPlanClosed(plan) ? "Closed By Action Owner" : "Pending By Action Owner"} />
);

// One owner's progress on a plan: open → draft (saved, not submitted) → closed (submitted).
const ASSIGNMENT_STATUS: Record<string, { label: string; tone: string }> = {
  closed: { label: "Action Taken", tone: "bg-[#DDEBD3] text-[#4A6B2E]" },
  draft: { label: "In Progress", tone: "bg-[#F8E4C7] text-[#8A5A12]" },
  open: { label: "Pending", tone: "bg-[#F5B5A6] text-[#8A2F1B]" },
};
const assignmentStatus = (a: ViIncidentAssignment) => ASSIGNMENT_STATUS[a.status] ?? ASSIGNMENT_STATUS.open;

/**
 * Every action owner of a plan with their own status, and whose end the action is pending on —
 * a plan with two owners stays pending until both have submitted.
 */
export const OwnerStatusList = ({
  plan,
  isMine,
}: {
  plan: ViIncidentActionPlan;
  /** Marks the logged-in owner's row with "You". */
  isMine?: (assignment: ViIncidentAssignment) => boolean;
}) => {
  if (!plan.assignments.length) {
    return <div className="text-sm font-medium text-gray-900">-</div>;
  }
  const pending = plan.assignments.filter((a) => a.status !== "closed");
  const ownerName = (a: ViIncidentAssignment) => a.owner?.name || "Unassigned";
  return (
    <div>
      <div className="mb-2 text-xs text-gray-500">
        Action Owners ({plan.assignments.length})
      </div>
      <ul className="divide-y divide-gray-200 rounded-[10px] border border-gray-200">
        {plan.assignments.map((a) => {
          const status = assignmentStatus(a);
          return (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <span className="truncate">{ownerName(a)}</span>
                  {isMine?.(a) && (
                    <span className="rounded-full bg-gray-100 px-2 py-[1px] text-[10px] font-semibold text-gray-600">
                      You
                    </span>
                  )}
                </div>
                {a.owner?.email && <div className="truncate text-xs text-gray-500">{a.owner.email}</div>}
              </div>
              <div className="flex items-center gap-2">
                {a.status === "closed" && a.closureDate && (
                  <span className="text-xs text-gray-500">Closed {formatIncidentDate(a.closureDate)}</span>
                )}
                <span className={`whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11px] font-medium ${status.tone}`}>
                  {status.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs font-medium text-gray-600">
        {pending.length
          ? `Pending with: ${pending.map((a) => (isMine?.(a) ? `${ownerName(a)} (You)` : ownerName(a))).join(", ")}`
          : isPlanClosed(plan)
            ? "All action owners have taken action"
            : "Action plan is still pending"}
      </p>
    </div>
  );
};

/** What one action owner did about a plan (text, closure date, attachments). */
export const AssignmentTaken = ({
  assignment,
  showOwner,
  tone = "card",
}: {
  assignment: ViIncidentAssignment;
  showOwner?: boolean;
  tone?: "card" | "inset";
}) => (
  <div className={tone === "inset" ? "border-t border-gray-200 bg-[#F6F4EE] px-4 py-4" : ""}>
    <div className="mb-1 flex items-center justify-between gap-3 text-xs font-semibold text-gray-500">
      <span>Action Taken{showOwner && assignment.owner ? ` — ${assignment.owner.name}` : ""}</span>
      {assignment.status === "draft" && <span className="font-medium">Draft</span>}
    </div>
    <p className="text-sm text-gray-900 whitespace-pre-wrap">{assignment.actionTaken}</p>
    <div className="mt-3">
      <FieldGrid
        columns={2}
        fields={[{ label: "Closure Date", value: assignment.closureDate && formatIncidentDate(assignment.closureDate) }]}
      />
    </div>
    {assignment.attachments.length > 0 && (
      <div className="mt-3">
        <AttachmentLinks attachments={assignment.attachments} tone={tone === "inset" ? "white" : "muted"} />
      </div>
    )}
  </div>
);

/**
 * Read-only action plan cards for an incident: per checklist item (root cause), the corrective and
 * preventive plans, every owner's status (whose end it's pending on) and the action each owner
 * submitted. `plans` can narrow the set (e.g. to plans the action owner is on); `isMine` marks the
 * logged-in owner; `renderPlanActions` adds per-plan buttons.
 */
export const IncidentActionPlanCards = ({
  incident,
  plans = incident.actionPlans,
  isMine,
  renderPlanActions,
}: {
  incident: ViIncidentRecord;
  plans?: ViIncidentActionPlan[];
  isMine?: (assignment: ViIncidentAssignment) => boolean;
  renderPlanActions?: (plan: ViIncidentActionPlan) => ReactNode;
}) => {
  const groups = groupPlansByItem(incident.checklistItems, plans);
  return (
    <>
      {groups.map((group, index) => (
        <div key={group.item.id} className="mb-5 space-y-5">
          <DetailCard
            icon={sectionIcon(CheckSquare)}
            title={groups.length > 1 ? `Checklist Item ${index + 1}` : "Checklist Item"}
          >
            {group.item.path && <p className="mb-3 text-xs text-gray-500">{group.item.path}</p>}
            <p className="text-sm text-gray-900">{group.item.name}</p>
          </DetailCard>

          {[...group.corrective, ...group.preventive].map((plan) => {
            // Submitted actions of every owner; a saved draft only for its own owner.
            const taken = plan.assignments.filter(
              (a) => a.actionTaken && (a.status === "closed" || (a.status === "draft" && isMine?.(a))),
            );
            const actions = renderPlanActions?.(plan);
            return (
              <DetailCard
                key={plan.id}
                icon={sectionIcon(ShieldCheck)}
                title={`${ACTION_TYPE_LABEL[plan.actionType]} Action Plan`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <PlanStatusPill plan={plan} />
                  <DueLabel label={viIncidentPlanDueLabel([plan])} />
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
                <div className="mt-4">
                  <OwnerStatusList plan={plan} isMine={isMine} />
                </div>
                {taken.map((assignment) => (
                  <div key={assignment.id} className="mt-4 border-t border-gray-200 pt-4">
                    <AssignmentTaken assignment={assignment} showOwner={plan.assignments.length > 1} />
                  </div>
                ))}
                {actions && <div className="mt-4 flex justify-end">{actions}</div>}
              </DetailCard>
            );
          })}
        </div>
      ))}
    </>
  );
};
