import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ClipboardCheck, ClipboardList, Clock, ListChecks, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AuditTypeSelectModal } from "@/components/vi-audit/AuditTypeSelectModal";
import { AUDIT_FULL_COLUMNS, sumAuditList } from "@/components/vi-audit/viAuditListData";
import { useViAuditList } from "@/components/vi-audit/useViAuditList";

const LIST_PATH = "/safety/audit-list";

// Auditor: audit list with "Add Audit" (audit type is picked in a modal first).
const AuditorAuditListPage = () => {
  const navigate = useNavigate();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  // GET /vi_audits.json?page=&per_page=20 (server-side pagination)
  const { audits, pagination, loading } = useViAuditList(page);

  // Counted from the audits on the current page until the API returns overall totals.
  const isClosed = (status: string) => ["closed", "completed"].includes(status.toLowerCase());
  const stats: AuditListStat[] = [
    { title: "Open Audits", value: audits.filter((a) => a.status && !isClosed(a.status)).length, icon: ClipboardList },
    { title: "Closed Audits", value: audits.filter((a) => a.status && isClosed(a.status)).length, icon: ClipboardCheck },
    { title: "Total Observations", value: sumAuditList("observations", audits), icon: ListChecks },
    { title: "Pending Action Plan By SPOC", value: sumAuditList("pendingActionPlanBySpoc", audits), icon: Clock },
    { title: "Action Pending By Action Owner", value: sumAuditList("actionPendingByOwner", audits), icon: AlertTriangle },
    { title: "Action Taken By Action Owner", value: sumAuditList("actionTakenByOwner", audits), icon: CheckCircle2 },
  ];

  return (
    <AuditListView
      title="Audit — Auditor"
      stats={stats}
      columns={AUDIT_FULL_COLUMNS}
      detailBasePath={LIST_PATH}
      storageKey="vi-audit-list-auditor"
      data={audits}
      loading={loading}
      pagination={{
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        onPageChange: setPage,
      }}
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
