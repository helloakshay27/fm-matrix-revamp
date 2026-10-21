import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, FileText, Plus, ShieldCheck } from "lucide-react";
import { DetailCard } from "@/components/ui/detail-card";
import { viAuditBasePath } from "@/components/vi-audit/viAuditData";
import { ActionPlanRecord, AuditLoadingState, AuditStatusPill, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { useViActionPlanDetail } from "@/components/vi-audit/useViActionPlanDetail";
import { useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

const viewMoreClass =
  "shrink-0 text-sm font-semibold text-[#1A1A18] underline underline-offset-4 hover:text-[rgba(26,26,24,0.68)]";

// Action Owner: one corrective / preventive action plan, with "Add Action Taken".
// Plan from GET /vi_audit_action_plans/:planId.json; parent audit / observation cards from
// GET /vi_audits/:id.json.
const ActionOwnerActionPlanDetailPage = () => {
  const navigate = useNavigate();
  const { id, observationId, planId } = useParams();
  const { detail: found, loading: planLoading } = useViActionPlanDetail(planId);
  const { audit, loading: auditLoading } = useViAuditDetail(id);
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

  const { plan, kind, canEdit } = found;
  const isClosed = plan.status === "Closed By Action Owner" || canEdit === false;

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
        ID: {[audit?.auditCode, observation?.id, plan.actionNo ?? plan.id].filter(Boolean).join("/")}
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
      <DetailCard icon={sectionIcon(FileText)} title={observation.id} className="mb-5">
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

      {!isClosed && (
        <div className="fm-action-bar pt-4 sm:pt-6">
          <button
            type="button"
            className="fm-action-primary"
            onClick={() => navigate(`${observationPath}/plans/${plan.id}/action-taken`)}
          >
            <Plus className="w-4 h-4" />
            Add Action Taken
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionOwnerActionPlanDetailPage;
