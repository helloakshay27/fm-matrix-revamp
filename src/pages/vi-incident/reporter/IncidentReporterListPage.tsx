import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncidentListView } from "@/components/vi-incident/IncidentListView";

export const INCIDENT_REPORTER_PATH = "/safety/vi-incident/reporter";

// Reporter: incident list with "Add Incident" (creates a new incident in a 2-step form).
const IncidentReporterListPage = () => {
  const navigate = useNavigate();
  return (
    <IncidentListView
      title="Incident — Reporter"
      detailBasePath={INCIDENT_REPORTER_PATH}
      storageKey="vi-incident-list-reporter"
      editDrafts
      leftActions={
        <Button
          className="bg-brand hover:bg-brand-hover text-white"
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
