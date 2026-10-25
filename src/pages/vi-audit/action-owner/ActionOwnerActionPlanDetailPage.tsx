import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ClipboardCheck, FileText, Paperclip, FilePenLine, Plus, ShieldCheck } from "lucide-react";
import { DetailCard } from "@/components/ui/detail-card";
import {
  hasSubmittedActionTaken,
  isPlanPendingByActionOwner,
  viAuditBasePath,
  type ViActionTaken,
} from "@/components/vi-audit/viAuditData";
import { ActionPlanRecord, AuditLoadingState, AuditStatusPill, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { useViActionPlanDetail } from "@/components/vi-audit/useViActionPlanDetail";
import { VI_AUDIT_DETAIL_URLS, useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

const viewMoreClass =
  "shrink-0 text-sm font-semibold text-[#1A1A18] underline underline-offset-4 hover:text-[rgba(26,26,24,0.68)]";

// Actions already taken against the plan (its CAPAs): description, closure date, attachments.
const ActionTakenList = ({ actions }: { actions: ViActionTaken[] }) => (
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
            <div className="flex flex-wrap gap-2">
              {action.attachments.map((file, index) => (
                <a
                  key={`${file.name}-${index}`}
                  href={file.url || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full bg-[#F5F4F0] px-3 py-1 text-xs text-[#1A1A18] hover:bg-[#EDEAE3]"
                >
                  <Paperclip className="w-3 h-3 shrink-0 text-[rgba(26,26,24,0.48)]" />
                  <span className="truncate">{file.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

// Action Owner: one corrective / preventive action plan, with "Add Action Taken".
// Plan from GET /vi_audit_action_plans/:planId.json; parent audit / observation cards from
// GET /vi_audits/:id.json.
const ActionOwnerActionPlanDetailPage = () => {
  const navigate = useNavigate();
  const { id, observationId, planId } = useParams();
  const { detail: found, loading: planLoading } = useViActionPlanDetail(planId);
  const { audit, loading: auditLoading } = useViAuditDetail(id, VI_AUDIT_DETAIL_URLS.actionOwner);
  const observation = audit?.observations.find((o) => o.id === observationId);

  const basePath = viAuditBasePath("action-owner");
  const auditPath = `${basePath}/${id}`;
  const observationPath = `${auditPath}/observations/${observationId}`;

  if (planLoading || auditLoading) return <AuditLoadingState message="Loading action plan..." />;

  if (!found) {
    return (
      <div className="p-6 min-h-screen">
        <button
          type="button"
          onClick={() => navigate(observationPath)}
          className="mb-4 inline-flex items-center gap-2 text-sm text-[rgba(26,26,24,0.68)] hover:text-[#1A1A18]"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <p className="text-sm text-[rgba(26,26,24,0.48)]">Action plan not found.</p>
      </div>
    );
  }

  const { plan, kind } = found;
  // "Add Action Taken" while the plan is still pending by the action owner, or while the
  // observation is still "Pending By SPOC" — and only until an action taken has been submitted.
  const isPending =
    !hasSubmittedActionTaken(plan) &&
    (isPlanPendingByActionOwner(plan) || observation?.status === "Pending By SPOC");
  const actionTaken = plan.capas ?? [];
  // A CAPA saved with "Save Draft" (not submitted yet) — the button continues it.
  const hasDraftActionTaken = actionTaken.some((capa) => capa.status && capa.status !== "closed");

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => navigate(observationPath)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back to observation"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Audit</h1>
        <AuditStatusPill status={plan.status} />
      </div>
      <p className="mb-6 pl-11 text-sm text-[rgba(26,26,24,0.48)]">
        ID: {[audit?.auditCode, observation?.observationNo ?? observation?.id, plan.actionNo ?? plan.id].filter(Boolean).join("/")}
      </p>

      {/* Parent audit */}
      {audit && (
      <DetailCard icon={sectionIcon(ClipboardCheck)} title={audit.auditCode} className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-[#1A1A18]">{audit.auditType} Audit</div>
            <div className="text-sm text-[rgba(26,26,24,0.68)]">{audit.basic.auditLocation}</div>
            <div className="flex items-center gap-2 pt-1 text-sm text-[rgba(26,26,24,0.48)]">
              Status: <AuditStatusPill status={audit.status} />
            </div>
          </div>
          <button type="button" onClick={() => navigate(auditPath)} className={viewMoreClass}>
            View More
          </button>
        </div>
      </DetailCard>
      )}

      {/* Parent observation */}
      {observation && (
      <DetailCard icon={sectionIcon(FileText)} title={observation.observationNo ?? observation.id} className="mb-5">
        <div className="flex items-start justify-between gap-4">
          <p className="line-clamp-2 text-sm text-[#1A1A18]">{observation.description}</p>
          <button type="button" onClick={() => navigate(observationPath)} className={viewMoreClass}>
            View More
          </button>
        </div>
      </DetailCard>
      )}

      {/* The action plan */}
      <DetailCard
        icon={sectionIcon(ShieldCheck)}
        title={kind === "corrective" ? "Corrective Action Plan" : "Preventive Action Plan"}
        className="mb-5"
      >
        <div className="overflow-hidden rounded-[12px] border border-[rgba(26,26,24,0.09)]">
          <ActionPlanRecord plan={plan} />
        </div>
      </DetailCard>

      {/* Actions taken so far (CAPAs) */}
      {actionTaken.length > 0 && (
        <DetailCard
          icon={sectionIcon(CheckCircle2)}
          title={kind === "corrective" ? "Corrective Action Taken" : "Preventive Action Taken"}
          className="mb-5"
        >
          <ActionTakenList actions={actionTaken} />
        </DetailCard>
      )}

      {isPending && (
        <div className="fm-action-bar pt-4 sm:pt-6">
          <button
            type="button"
            className="fm-action-primary"
            onClick={() => navigate(`${observationPath}/plans/${plan.id}/action-taken`)}
          >
            {hasDraftActionTaken ? (
              <>
                <FilePenLine className="w-4 h-4" />
                Continue Draft
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Action Taken
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionOwnerActionPlanDetailPage;
