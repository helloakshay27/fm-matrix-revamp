import { IncidentListView } from "@/components/vi-incident/IncidentListView";

// Role list pages (SPOC / Action Owner / Functional Head) — layout only until their Figma flows are built.
const IncidentRolePlaceholderPage = ({ role, path }: { role: string; path: string }) => (
  <IncidentListView title={`Incident — ${role}`} detailBasePath={path} storageKey={`vi-incident-list-${path.split("/").pop()}`} />
);

export const IncidentFunctionalHeadListPage = () => (
  <IncidentRolePlaceholderPage role="Functional Head" path="/safety/vi-incident/functional-head" />
);
