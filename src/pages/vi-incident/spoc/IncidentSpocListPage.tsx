import { AlertTriangle, CheckCircle2, ClipboardCheck, ClipboardList, Clock, ListTodo, Search } from "lucide-react";
import { IncidentListView, type IncidentStatsBuilder } from "@/components/vi-incident/IncidentListView";
import {
  dashboardCount,
  dashboardGroupCount,
  dashboardGroupLabel,
} from "@/components/vi-incident/viIncidentApi";

export const INCIDENT_SPOC_PATH = "/safety/vi-incident/spoc";

// SPOC dashboard (GET /vi_incidents/spoc_dashboard.json) — drafts never reach the SPOC.
// Workflow / milestone cards take their titles from the API's labels; the text here is only a fallback.
const buildSpocStats: IncidentStatsBuilder = (d) => {
  const group = (kind: "workflow" | "milestones", key: string, fallback: string) => ({
    title: dashboardGroupLabel(d, kind, key, fallback),
    value: dashboardGroupCount(d, kind, key),
  });
  return [
    { title: "Total Incidents", value: dashboardCount(d, "total_assigned_incidents", "total_incidents"), icon: ClipboardList },
    { title: "Closed Incident", value: dashboardCount(d, "closed_incidents"), icon: CheckCircle2 },
    { title: "Open Incident", value: dashboardCount(d, "open_incidents"), icon: AlertTriangle },
    { ...group("workflow", "pending_by_spoc", "Pending By SPOC"), icon: Search },
    { ...group("workflow", "pending_by_action_owner", "Pending By Action Owner"), icon: Clock },
    { ...group("workflow", "closed_by_action_owner", "Closed By Action Owner"), icon: CheckCircle2 },
    { ...group("milestones", "spoc_work_completed", "Investigation Completed"), icon: ClipboardCheck },
    { ...group("milestones", "action_owner_work_pending", "Action Owner Work Pending"), icon: ListTodo },
  ];
};

// SPOC: incidents assigned for review (GET /vi_incidents/spoc_incidents.json). Open one to create its action plan.
const IncidentSpocListPage = () => (
  <IncidentListView
    role="spoc"
    title="Incident — SPOC"
    detailBasePath={INCIDENT_SPOC_PATH}
    storageKey="vi-incident-list-spoc"
    buildStats={buildSpocStats}
  />
);

export default IncidentSpocListPage;
