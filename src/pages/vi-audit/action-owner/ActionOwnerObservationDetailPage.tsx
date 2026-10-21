import { useNavigate, useParams } from "react-router-dom";
import { ObservationDetailView } from "@/components/vi-audit/ObservationDetailView";

// Action Owner: observation detail — each corrective / preventive plan opens its plan page,
// where the action taken is added.
const ActionOwnerObservationDetailPage = () => {
  const navigate = useNavigate();
  const { id, observationId } = useParams();
  const auditPath = `/safety/audit/action-owner/${id}`;

  return (
    <ObservationDetailView
      auditId={id}
      observationId={observationId}
      auditPath={auditPath}
      onSelectPlan={(plan, { observation }) =>
        navigate(`${auditPath}/observations/${observation.id}/plans/${plan.id}`)
      }
    />
  );
};

export default ActionOwnerObservationDetailPage;
