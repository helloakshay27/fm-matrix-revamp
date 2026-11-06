import { useNavigate, useParams } from "react-router-dom";
import { ObservationDetailView } from "@/components/vi-audit/ObservationDetailView";
import { VI_AUDIT_DETAIL_URLS, useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

// Action Owner: observation detail — each corrective / preventive plan opens its plan page,
// where the action taken is added. Reads the observation from GET /vi_audits/:id.json.
const ActionOwnerObservationDetailPage = () => {
  const navigate = useNavigate();
  const { id, observationId } = useParams();
  const { audit, loading } = useViAuditDetail(id, VI_AUDIT_DETAIL_URLS.actionOwner);
  const auditPath = `/safety/audit/action-owner/${id}`;

  return (
    <ObservationDetailView
      auditId={id}
      observationId={observationId}
      audit={audit}
      loading={loading}
      auditPath={auditPath}
      onSelectPlan={(plan, { observation }) =>
        navigate(`${auditPath}/observations/${observation.id}/plans/${plan.id}`)
      }
    />
  );
};

export default ActionOwnerObservationDetailPage;
