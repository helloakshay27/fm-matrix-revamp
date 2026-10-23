import { AlertTriangle, CheckCircle2, ClipboardCheck, ClipboardList, Clock, ListChecks } from "lucide-react";
import { IncidentListView, type IncidentListStat } from "@/components/vi-incident/IncidentListView";
import {
  INCIDENT_CARD_COLUMNS,
  getViIncidentActionPlans,
  type ViIncidentRecord,
} from "@/components/vi-incident/viIncidentData";

export const INCIDENT_FUNCTIONAL_HEAD_PATH = "/safety/vi-incident/functional-head";

// Same cards as the audit Functional Head list, with incidents / action plans in place of audits / observations.
const buildFunctionalHeadStats = (records: ViIncidentRecord[]): IncidentListStat[] => {
  const count = (...statuses: string[]) => records.filter((r) => statuses.includes(r.status)).length;
  const pendingByOwner = count("Pending By Action Owner");
  const closedByOwner = count("Closed By Action Owner");
  const totalPlans = records.reduce((total, record) => total + getViIncidentActionPlans(record).length, 0);
  return [
    { title: "Total Incidents", value: records.length, icon: ClipboardList },
    { title: "Total Action Plans", value: totalPlans, icon: ListChecks },
    { title: "CAPA Plan Not Started", value: count("Open", "Pending By SPOC"), icon: Clock },
    { title: "CAPA Plan Started", value: pendingByOwner + closedByOwner, icon: ClipboardCheck },
    { title: "CAPA Plan Not Closed By Action Owner", value: pendingByOwner, icon: AlertTriangle },
    { title: "CAPA Plan Closed By Action Owner", value: closedByOwner, icon: CheckCircle2 },
  ];
};

// Functional Head: CAPA progress across incidents.
const IncidentFunctionalHeadListPage = () => (
  <IncidentListView
    title="Incident — Functional Head"
    detailBasePath={INCIDENT_FUNCTIONAL_HEAD_PATH}
    storageKey="vi-incident-list-functional-head"
    columns={INCIDENT_CARD_COLUMNS}
    buildStats={buildFunctionalHeadStats}
  />
);

export default IncidentFunctionalHeadListPage;
