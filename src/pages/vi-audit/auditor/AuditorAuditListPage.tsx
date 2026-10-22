import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ClipboardCheck, ClipboardList, Clock, ListChecks, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AuditTypeSelectModal } from "@/components/vi-audit/AuditTypeSelectModal";
import { AUDIT_FULL_COLUMNS } from "@/components/vi-audit/viAuditListData";
import { dashboardCount, useViAuditDashboard, workflowCount } from "@/components/vi-audit/useViAuditDashboard";
import { useViAuditList } from "@/components/vi-audit/useViAuditList";

const LIST_PATH = "/safety/audit-list";

// Auditor: audit list with "Add Audit" (audit type is picked in a modal first).
const AuditorAuditListPage = () => {
  const navigate = useNavigate();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  // GET /vi_audits.json?page=&per_page=20 (server-side pagination)
  const { audits, pagination, loading } = useViAuditList(page);

  // Overall totals for the stats cards — GET /vi_audits/dashboard.json?role=auditor
  const { counts } = useViAuditDashboard("auditor");
  const stats: AuditListStat[] = [
    { title: "Open Audits", value: dashboardCount(counts?.total_open_audits), icon: ClipboardList },
    { title: "Closed Audits", value: dashboardCount(counts?.total_closed_audits), icon: ClipboardCheck },
    { title: "Total Observations", value: dashboardCount(counts?.total_observations), icon: ListChecks },
    { title: "Pending Action Plan By SPOC", value: workflowCount(counts, "pending_by_spoc"), icon: Clock },
    { title: "Action Pending By Action Owner", value: workflowCount(counts, "pending_by_action_owner"), icon: AlertTriangle },
    { title: "Action Taken By Action Owner", value: workflowCount(counts, "closed_by_action_owner"), icon: CheckCircle2 },
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
