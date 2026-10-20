import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { ObservationDetailView } from "@/components/vi-audit/ObservationDetailView";

// SPOC: observation detail with "Create Action Plan" (hidden once every plan is closed).
const SpocObservationDetailPage = () => {
  const navigate = useNavigate();
  const { id, observationId } = useParams();
  const auditPath = `/safety/audit/spoc/${id}`;

  return (
    <ObservationDetailView
      auditId={id}
      observationId={observationId}
      auditPath={auditPath}
      footer={({ observation, allPlansClosed }) =>
        allPlansClosed ? null : (
          <div className="fm-action-bar pt-4 sm:pt-6">
            <button
              type="button"
              className="fm-action-primary"
              onClick={() => navigate(`${auditPath}/observations/${observation.id}/action-plan`)}
            >
              <Plus className="w-4 h-4" />
              Create Action Plan
            </button>
          </div>
        )
      }
    />
  );
};

export default SpocObservationDetailPage;
