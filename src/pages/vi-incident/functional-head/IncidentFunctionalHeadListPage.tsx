import { AlertTriangle, CheckCircle2, ClipboardCheck, ClipboardList, Clock, ShieldCheck } from "lucide-react";
import { IncidentListView, type IncidentStatsBuilder } from "@/components/vi-incident/IncidentListView";
import { INCIDENT_CARD_COLUMNS } from "@/components/vi-incident/viIncidentData";
import { dashboardCount, dashboardGroupCount } from "@/components/vi-incident/viIncidentApi";

export const INCIDENT_FUNCTIONAL_HEAD_PATH = "/safety/vi-incident/functional-head";

// Same cards as the audit Functional Head list, with incidents / action plans in place of audits /
// observations — from GET /vi_incidents/functional_head_dashboard.json (workflow + milestones).
const buildFunctionalHeadStats: IncidentStatsBuilder = (d) => [
  { title: "Total Incidents", value: dashboardCount(d, "total_assigned_incidents", "total_incidents"), icon: ClipboardList },
  { title: "Closed Incidents", value: dashboardCount(d, "closed_incidents"), icon: ShieldCheck },
  { title: "CAPA Plan Not Started", value: dashboardGroupCount(d, "workflow", "pending_by_spoc"), icon: Clock },
  { title: "CAPA Plan Started", value: dashboardGroupCount(d, "milestones", "spoc_work_completed"), icon: ClipboardCheck },
  {
    title: "CAPA Plan Not Closed By Action Owner",
    value: dashboardGroupCount(d, "milestones", "action_owner_work_pending"),
    icon: AlertTriangle,
  },
  {
    title: "CAPA Plan Closed By Action Owner",
    value: dashboardGroupCount(d, "milestones", "action_owner_work_completed"),
    icon: CheckCircle2,
  },
];

// Functional Head: CAPA progress across incidents (GET /vi_incidents/functional_head_incidents.json).
const IncidentFunctionalHeadListPage = () => (
  <IncidentListView
    role="functional_head"
    title="Incident — Functional Head"
    detailBasePath={INCIDENT_FUNCTIONAL_HEAD_PATH}
    storageKey="vi-incident-list-functional-head"
    columns={INCIDENT_CARD_COLUMNS}
    buildStats={buildFunctionalHeadStats}
  />
);

export default IncidentFunctionalHeadListPage;
