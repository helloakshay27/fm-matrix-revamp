import { AlertTriangle, CheckCircle2, ClipboardCheck, ClipboardList, Clock, ListChecks } from "lucide-react";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AUDIT_CARD_COLUMNS, VI_AUDIT_LIST, sumAuditList } from "@/components/vi-audit/viAuditListData";

// Functional Head: CAPA progress across audits.
const FunctionalHeadAuditListPage = () => {
  const stats: AuditListStat[] = [
    { title: "Total Audits", value: VI_AUDIT_LIST.length, icon: ClipboardList },
    { title: "Total Observations", value: sumAuditList("observations"), icon: ListChecks },
    { title: "CAPA Plan Not Started", value: sumAuditList("pendingActionPlanBySpoc"), icon: Clock },
    {
      title: "CAPA Plan Started",
      value: sumAuditList("actionPendingByOwner") + sumAuditList("actionTakenByOwner"),
      icon: ClipboardCheck,
    },
    { title: "CAPA Plan Not Closed By Action Owner", value: sumAuditList("actionPendingByOwner"), icon: AlertTriangle },
    { title: "CAPA Plan Closed By Action Owner", value: sumAuditList("actionTakenByOwner"), icon: CheckCircle2 },
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
