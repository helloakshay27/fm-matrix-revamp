import { useParams } from "react-router-dom";
import { ObservationDetailView } from "@/components/vi-audit/ObservationDetailView";

// Auditor: observation detail — read-only (plans are raised by SPOC and closed by Action Owner).
const AuditorObservationDetailPage = () => {
  const { id, observationId } = useParams();
  return (
    <ObservationDetailView
      auditId={id}
      observationId={observationId}
      auditPath={`/safety/audit-list/${id}`}
    />
  );
};

export default AuditorObservationDetailPage;
