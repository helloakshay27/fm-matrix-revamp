import { useParams } from "react-router-dom";
import { ObservationDetailView } from "@/components/vi-audit/ObservationDetailView";
import { VI_AUDIT_DETAIL_URLS, useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

// Functional Head: observation detail — read-only view of the observation and its CAPA plans.
const FunctionalHeadObservationDetailPage = () => {
  const { id, observationId } = useParams();
  const { audit, loading } = useViAuditDetail(id, VI_AUDIT_DETAIL_URLS.functionalHead);
  return (
    <ObservationDetailView
      auditId={id}
      observationId={observationId}
      audit={audit}
      loading={loading}
      auditPath={`/safety/audit/functional-head/${id}`}
    />
  );
};

export default FunctionalHeadObservationDetailPage;
