import { useNavigate, useParams } from "react-router-dom";
import { ObservationDetailView } from "@/components/vi-audit/ObservationDetailView";
import { VI_AUDIT_DETAIL_URLS, useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

// Functional Head: observation detail — read-only view of the observation and its CAPA plans;
// a plan opens its detail page with the action taken (CAPA).
const FunctionalHeadObservationDetailPage = () => {
  const navigate = useNavigate();
  const { id, observationId } = useParams();
  const auditPath = `/safety/audit/functional-head/${id}`;
  const { audit, loading } = useViAuditDetail(id, VI_AUDIT_DETAIL_URLS.functionalHead);
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

export default FunctionalHeadObservationDetailPage;
