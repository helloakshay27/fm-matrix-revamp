import { useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardList, Clock, ListChecks } from "lucide-react";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AUDIT_CARD_COLUMNS } from "@/components/vi-audit/viAuditListData";
import { dashboardCount, useViAuditDashboard, workflowCount } from "@/components/vi-audit/useViAuditDashboard";
import { VI_AUDIT_LIST_ENDPOINTS, useViAuditList } from "@/components/vi-audit/useViAuditList";
import {
  AuditFilterDialog,
  EMPTY_AUDIT_FILTERS,
  auditFiltersToParams,
  auditSearchToParams,
  type AuditStatusOption,
  type ViAuditFilters,
} from "@/components/vi-audit/AuditFilterDialog";

const STATUS_OPTIONS: AuditStatusOption[] = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

// SPOC: audits assigned for review — GET /vi_audits/spoc_audits.json?page=&per_page=20.
const SpocAuditListPage = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ViAuditFilters>(EMPTY_AUDIT_FILTERS);
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { audits, pagination, loading } = useViAuditList(
    page,
    VI_AUDIT_LIST_ENDPOINTS.spoc,
    { ...auditFiltersToParams(filters), ...auditSearchToParams(search) },
  );

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
      onFilterClick={() => setIsFilterOpen(true)}
      onSearch={(term) => {
        setSearch(term);
        setPage(1);
      }}
      pagination={{
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        onPageChange: setPage,
      }}
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

export default SpocAuditListPage;
