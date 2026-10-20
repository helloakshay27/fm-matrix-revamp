import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ClipboardCheck, ClipboardList, Clock, ListChecks, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AuditTypeSelectModal } from "@/components/vi-audit/AuditTypeSelectModal";
import { AUDIT_FULL_COLUMNS, VI_AUDIT_LIST, sumAuditList } from "@/components/vi-audit/viAuditListData";

const LIST_PATH = "/safety/audit-list";

// Auditor: audit list with "Add Audit" (audit type is picked in a modal first).
const AuditorAuditListPage = () => {
  const navigate = useNavigate();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const stats: AuditListStat[] = [
    { title: "Open Audits", value: VI_AUDIT_LIST.filter((a) => a.status === "Open").length, icon: ClipboardList },
    { title: "Closed Audits", value: VI_AUDIT_LIST.filter((a) => a.status === "Completed").length, icon: ClipboardCheck },
    { title: "Total Observations", value: sumAuditList("observations"), icon: ListChecks },
    { title: "Pending Action Plan By SPOC", value: sumAuditList("pendingActionPlanBySpoc"), icon: Clock },
    { title: "Action Pending By Action Owner", value: sumAuditList("actionPendingByOwner"), icon: AlertTriangle },
    { title: "Action Taken By Action Owner", value: sumAuditList("actionTakenByOwner"), icon: CheckCircle2 },
  ];

  return (
    <AuditListView
      title="Audit — Auditor"
      stats={stats}
      columns={AUDIT_FULL_COLUMNS}
      detailBasePath={LIST_PATH}
      storageKey="vi-audit-list-auditor"
      leftActions={
        <Button className="bg-brand hover:bg-brand-hover text-white" onClick={() => setIsTypeModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Audit
        </Button>
      }
    >
      <AuditTypeSelectModal
        open={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelect={(type) => {
          setIsTypeModalOpen(false);
          navigate(`${LIST_PATH}/add?type=${type}`);
        }}
      />
    </AuditListView>
  );
};

export default AuditorAuditListPage;
