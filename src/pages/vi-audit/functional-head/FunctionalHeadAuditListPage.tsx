import { AlertTriangle, CheckCircle2, ClipboardCheck, ClipboardList, Clock, ListChecks } from "lucide-react";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AUDIT_CARD_COLUMNS } from "@/components/vi-audit/viAuditListData";
import { dashboardCount, useViAuditDashboard, workflowCount } from "@/components/vi-audit/useViAuditDashboard";

// Functional Head: CAPA progress across audits.
const FunctionalHeadAuditListPage = () => {
  // Overall totals for the stats cards — GET /vi_audits/dashboard.json?role=functional_head
  const { counts } = useViAuditDashboard("functional_head");
  const pendingByOwner = workflowCount(counts, "pending_by_action_owner");
  const closedByOwner = workflowCount(counts, "closed_by_action_owner");
  const stats: AuditListStat[] = [
    { title: "Total Audits", value: dashboardCount(counts?.total_audits), icon: ClipboardList },
    { title: "Total Observations", value: dashboardCount(counts?.total_observations), icon: ListChecks },
    { title: "CAPA Plan Not Started", value: workflowCount(counts, "pending_by_spoc"), icon: Clock },
    { title: "CAPA Plan Started", value: pendingByOwner + closedByOwner, icon: ClipboardCheck },
    { title: "CAPA Plan Not Closed By Action Owner", value: pendingByOwner, icon: AlertTriangle },
    { title: "CAPA Plan Closed By Action Owner", value: closedByOwner, icon: CheckCircle2 },
  ];

  return (
    <AuditListView
      title="Audit — Functional Head"
      stats={stats}
      columns={AUDIT_CARD_COLUMNS}
      detailBasePath="/safety/audit/functional-head"
      storageKey="vi-audit-list-functional-head"
    />
  );
};

export default FunctionalHeadAuditListPage;
