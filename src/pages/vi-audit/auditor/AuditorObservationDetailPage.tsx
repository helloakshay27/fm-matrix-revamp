import { useNavigate, useParams } from "react-router-dom";
import { ObservationDetailView } from "@/components/vi-audit/ObservationDetailView";
import { useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

// Auditor: observation detail — read-only (plans are raised by SPOC and closed by Action Owner).
// Reads the observation from the audit payload (GET /vi_audits/:id.json); a plan opens its detail
// page with the action taken (CAPA).
const AuditorObservationDetailPage = () => {
  const navigate = useNavigate();
  const { id, observationId } = useParams();
  const auditPath = `/safety/audit-list/${id}`;
  const { audit, loading } = useViAuditDetail(id);
  return (
    <ObservationDetailView
      auditId={id}
      observationId={observationId}
      audit={audit}
      loading={loading}
      auditPath={auditPath}
      onSelectPlan={(plan) => navigate(`${auditPath}/observations/${observationId}/plans/${plan.id}`)}
    />
  );
};

export default AuditorObservationDetailPage;
