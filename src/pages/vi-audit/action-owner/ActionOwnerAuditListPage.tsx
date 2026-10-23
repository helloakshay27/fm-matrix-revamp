import { useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardList, ListChecks } from "lucide-react";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AUDIT_CARD_COLUMNS } from "@/components/vi-audit/viAuditListData";
import { dashboardCount, useViAuditDashboard, workflowCount } from "@/components/vi-audit/useViAuditDashboard";
import { VI_AUDIT_LIST_ENDPOINTS, useViAuditList } from "@/components/vi-audit/useViAuditList";
import {
  AuditFilterDialog,
  EMPTY_AUDIT_FILTERS,
  auditFiltersToParams,
  type AuditStatusOption,
  type ViAuditFilters,
} from "@/components/vi-audit/AuditFilterDialog";

const STATUS_OPTIONS: AuditStatusOption[] = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

// Action Owner: audits with CAPA plans assigned.
const ActionOwnerAuditListPage = () => {
  // GET /vi_audits/action_owner_audits.json?page=&per_page=20 (server-side pagination) + the filter dialog's q[...] params
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ViAuditFilters>(EMPTY_AUDIT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { audits, pagination, loading } = useViAuditList(
    page,
    VI_AUDIT_LIST_ENDPOINTS.actionOwner,
    auditFiltersToParams(filters),
  );
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
      data={audits}
      loading={loading}
      pagination={{
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        onPageChange: setPage,
      }}
      onFilterClick={() => setIsFilterOpen(true)}
    >
      <AuditFilterDialog
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        statusOptions={STATUS_OPTIONS}
        onApply={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />
    </AuditListView>
  );
};

export default ActionOwnerAuditListPage;
