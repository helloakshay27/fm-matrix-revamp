import { useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardList, Clock, ListChecks } from "lucide-react";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AUDIT_CARD_COLUMNS } from "@/components/vi-audit/viAuditListData";
import { dashboardCount, useViAuditDashboard, workflowCount } from "@/components/vi-audit/useViAuditDashboard";
import { VI_AUDIT_LIST_ENDPOINTS, useViAuditList } from "@/components/vi-audit/useViAuditList";

// SPOC: audits assigned for review — GET /vi_audits/spoc_audits.json?page=&per_page=20.
const SpocAuditListPage = () => {
  const [page, setPage] = useState(1);
  const { audits, pagination, loading } = useViAuditList(page, VI_AUDIT_LIST_ENDPOINTS.spoc);

  // Overall totals for the stats cards — GET /vi_audits/dashboard.json?role=spoc
  const { counts } = useViAuditDashboard("spoc");
  const stats: AuditListStat[] = [
    { title: "Total Audits", value: dashboardCount(counts?.total_audits), icon: ClipboardList },
    { title: "Total Observations", value: dashboardCount(counts?.total_observations), icon: ListChecks },
    { title: "Pending For My Review", value: workflowCount(counts, "pending_by_spoc"), icon: Clock },
    { title: "Pending By Action Owner", value: workflowCount(counts, "pending_by_action_owner"), icon: AlertTriangle },
    { title: "Closed By Action Owner", value: workflowCount(counts, "closed_by_action_owner"), icon: CheckCircle2 },
  ];

  return (
    <AuditListView
      title="Audit — SPOC"
      stats={stats}
      columns={AUDIT_CARD_COLUMNS}
      detailBasePath="/safety/audit/spoc"
      storageKey="vi-audit-list-spoc"
      data={audits}
      loading={loading}
      pagination={{
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        onPageChange: setPage,
      }}
    />
  );
};

export default SpocAuditListPage;
