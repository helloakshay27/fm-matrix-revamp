import { useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardList, Clock, ListChecks } from "lucide-react";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AUDIT_CARD_COLUMNS, sumAuditList } from "@/components/vi-audit/viAuditListData";
import { VI_AUDIT_LIST_ENDPOINTS, useViAuditList } from "@/components/vi-audit/useViAuditList";

// SPOC: audits assigned for review — GET /vi_audits/spoc_audits.json?page=&per_page=20.
const SpocAuditListPage = () => {
  const [page, setPage] = useState(1);
  const { audits, pagination, loading } = useViAuditList(page, VI_AUDIT_LIST_ENDPOINTS.spoc);

  // Counted from the audits on the current page until the API returns overall totals.
  const stats: AuditListStat[] = [
    { title: "Total Audits", value: pagination.totalCount || audits.length, icon: ClipboardList },
    { title: "Total Observations", value: sumAuditList("observations", audits), icon: ListChecks },
    { title: "Pending For My Review", value: sumAuditList("pendingActionPlanBySpoc", audits), icon: Clock },
    { title: "Pending By Action Owner", value: sumAuditList("actionPendingByOwner", audits), icon: AlertTriangle },
    { title: "Closed By Action Owner", value: sumAuditList("actionTakenByOwner", audits), icon: CheckCircle2 },
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
