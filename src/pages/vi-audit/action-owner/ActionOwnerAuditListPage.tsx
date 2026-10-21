import { AlertTriangle, CheckCircle2, ClipboardList, ListChecks } from "lucide-react";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AUDIT_CARD_COLUMNS } from "@/components/vi-audit/viAuditListData";
import { dashboardCount, useViAuditDashboard, workflowCount } from "@/components/vi-audit/useViAuditDashboard";

// Action Owner: audits with CAPA plans assigned.
const ActionOwnerAuditListPage = () => {
  // Overall totals for the stats cards — GET /vi_audits/dashboard.json?role=action_owner
  const { counts } = useViAuditDashboard("action_owner");
  const stats: AuditListStat[] = [
    { title: "Total Audits", value: dashboardCount(counts?.total_audits), icon: ClipboardList },
    { title: "Total Observations", value: dashboardCount(counts?.total_observations), icon: ListChecks },
    { title: "CAPA Plan Not Closed By Action Owner", value: workflowCount(counts, "pending_by_action_owner"), icon: AlertTriangle },
    { title: "CAPA Plan Closed By Action Owner", value: workflowCount(counts, "closed_by_action_owner"), icon: CheckCircle2 },
  ];

  return (
    <AuditListView
      title="Audit — Action Owner"
      stats={stats}
      columns={AUDIT_CARD_COLUMNS}
      detailBasePath="/safety/audit/action-owner"
      storageKey="vi-audit-list-action-owner"
    />
  );
};

export default ActionOwnerAuditListPage;
