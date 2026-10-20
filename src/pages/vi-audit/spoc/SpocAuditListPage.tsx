import { AlertTriangle, CheckCircle2, ClipboardList, Clock, ListChecks } from "lucide-react";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AUDIT_CARD_COLUMNS, VI_AUDIT_LIST, sumAuditList } from "@/components/vi-audit/viAuditListData";

// SPOC: audits assigned for review.
const SpocAuditListPage = () => {
  const stats: AuditListStat[] = [
    { title: "Total Audits", value: VI_AUDIT_LIST.length, icon: ClipboardList },
    { title: "Total Observations", value: sumAuditList("observations"), icon: ListChecks },
    { title: "Pending For My Review", value: sumAuditList("pendingActionPlanBySpoc"), icon: Clock },
    { title: "Pending By Action Owner", value: sumAuditList("actionPendingByOwner"), icon: AlertTriangle },
    { title: "Closed By Action Owner", value: sumAuditList("actionTakenByOwner"), icon: CheckCircle2 },
  ];

  return (
    <AuditListView
      title="Audit — SPOC"
      stats={stats}
      columns={AUDIT_CARD_COLUMNS}
      detailBasePath="/safety/audit/spoc"
      storageKey="vi-audit-list-spoc"
    />
  );
};

export default SpocAuditListPage;
