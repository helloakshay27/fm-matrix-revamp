import { useNavigate, useParams } from "react-router-dom";
import { IncidentDetailView } from "@/components/vi-incident/IncidentDetailView";
import { getViIncident } from "@/components/vi-incident/viIncidentData";
import { INCIDENT_SPOC_PATH } from "./IncidentSpocListPage";

// SPOC: incident detail with the "Create Action Plan" action.
const IncidentSpocDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const status = getViIncident(id).status;
  // The SPOC can only create the plan while the incident is waiting on them.
  const canCreatePlan = status === "Pending By SPOC" || status === "Open";

  return (
    <IncidentDetailView
      incidentId={id}
      listPath={INCIDENT_SPOC_PATH}
      footer={
        canCreatePlan ? (
          <button
            type="button"
            className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            onClick={() => navigate(`${INCIDENT_SPOC_PATH}/${id}/action-plan`)}
          >
            Create Action Plan
          </button>
        ) : undefined
      }
    />
  );
};

export default IncidentSpocDetailPage;
