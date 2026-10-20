import { useParams } from "react-router-dom";
import { ObservationDetailView } from "@/components/vi-audit/ObservationDetailView";

// Functional Head: observation detail — read-only view of the observation and its CAPA plans.
const FunctionalHeadObservationDetailPage = () => {
  const { id, observationId } = useParams();
  return (
    <ObservationDetailView
      auditId={id}
      observationId={observationId}
      auditPath={`/safety/audit/functional-head/${id}`}
    />
  );
};

export default FunctionalHeadObservationDetailPage;
