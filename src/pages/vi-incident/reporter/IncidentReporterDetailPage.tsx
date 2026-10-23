import { useParams } from "react-router-dom";
import { IncidentDetailView } from "@/components/vi-incident/IncidentDetailView";
import { INCIDENT_REPORTER_PATH } from "./IncidentReporterListPage";

// Reporter: incident detail (read-only).
const IncidentReporterDetailPage = () => {
  const { id } = useParams();
  return <IncidentDetailView incidentId={id} listPath={INCIDENT_REPORTER_PATH} />;
};

export default IncidentReporterDetailPage;
