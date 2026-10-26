import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncidentListView } from "@/components/vi-incident/IncidentListView";

export const INCIDENT_REPORTER_PATH = "/safety/vi-incident/reporter";

// Reporter: own incidents (GET /vi_incidents/reporter_incidents.json) with "Add Incident"
// (2-step form); drafts can be edited.
const IncidentReporterListPage = () => {
  const navigate = useNavigate();
  return (
    <IncidentListView
      role="reporter"
      title="Incident — Reporter"
      detailBasePath={INCIDENT_REPORTER_PATH}
      storageKey="vi-incident-list-reporter"
      editPath={(incident) => (incident.canEdit ? `${INCIDENT_REPORTER_PATH}/${incident.id}/edit` : null)}
      leftActions={
        <Button
          className="h-[42px] rounded-[8px] px-[22px] bg-brand hover:bg-brand-hover text-white"
          onClick={() => navigate(`${INCIDENT_REPORTER_PATH}/add`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Incident
        </Button>
      }
    />
  );
};

export default IncidentReporterListPage;
