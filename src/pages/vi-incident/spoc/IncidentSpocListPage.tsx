import { IncidentListView } from "@/components/vi-incident/IncidentListView";

export const INCIDENT_SPOC_PATH = "/safety/vi-incident/spoc";

// SPOC: incidents assigned for review. Open one to create its action plan.
const IncidentSpocListPage = () => (
  <IncidentListView title="Incident — SPOC" detailBasePath={INCIDENT_SPOC_PATH} storageKey="vi-incident-list-spoc" />
);

export default IncidentSpocListPage;
