import { useParams } from "react-router-dom";
import { ObservationDetailView } from "@/components/vi-audit/ObservationDetailView";
import { useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

// Auditor: observation detail — read-only (plans are raised by SPOC and closed by Action Owner).
// Reads the observation from the audit payload (GET /vi_audits/:id.json).
const AuditorObservationDetailPage = () => {
  const { id, observationId } = useParams();
  const { audit, loading } = useViAuditDetail(id);
  return (
    <ObservationDetailView
      auditId={id}
      observationId={observationId}
      audit={audit}
      loading={loading}
      auditPath={`/safety/audit-list/${id}`}
    />
  );
};

export default AuditorObservationDetailPage;
