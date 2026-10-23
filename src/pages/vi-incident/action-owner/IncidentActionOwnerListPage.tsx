import { IncidentListView } from "@/components/vi-incident/IncidentListView";

export const INCIDENT_ACTION_OWNER_PATH = "/safety/vi-incident/action-owner";

// Action Owner: incidents with action plans assigned to them. Open one to add the action taken.
const IncidentActionOwnerListPage = () => (
  <IncidentListView
    title="Incident — Action Owner"
    detailBasePath={INCIDENT_ACTION_OWNER_PATH}
    storageKey="vi-incident-list-action-owner"
  />
);

export default IncidentActionOwnerListPage;
