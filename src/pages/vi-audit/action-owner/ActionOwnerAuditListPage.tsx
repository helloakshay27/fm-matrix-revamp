import { AlertTriangle, CheckCircle2, ClipboardList, ListChecks } from "lucide-react";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AUDIT_CARD_COLUMNS, VI_AUDIT_LIST, sumAuditList } from "@/components/vi-audit/viAuditListData";

// Action Owner: audits with CAPA plans assigned.
const ActionOwnerAuditListPage = () => {
  const stats: AuditListStat[] = [
    { title: "Total Audits", value: VI_AUDIT_LIST.length, icon: ClipboardList },
    { title: "Total Observations", value: sumAuditList("observations"), icon: ListChecks },
    { title: "CAPA Plan Not Closed By Action Owner", value: sumAuditList("actionPendingByOwner"), icon: AlertTriangle },
    { title: "CAPA Plan Closed By Action Owner", value: sumAuditList("actionTakenByOwner"), icon: CheckCircle2 },
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
