import { useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, ClipboardList, Clock, ListChecks } from "lucide-react";
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

// Functional Head: CAPA progress across audits.
const FunctionalHeadAuditListPage = () => {
  // GET /vi_audits/functional_head_audits.json?page=&per_page=20 (server-side pagination) + the filter dialog's q[...] params
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ViAuditFilters>(EMPTY_AUDIT_FILTERS);
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { audits, pagination, loading } = useViAuditList(
    page,
    VI_AUDIT_LIST_ENDPOINTS.functionalHead,
    { ...auditFiltersToParams(filters), ...auditSearchToParams(search) },
  );
  // Overall totals for the stats cards — GET /vi_audits/dashboard.json?role=functional_head
  const { counts } = useViAuditDashboard("functional_head");
  const pendingByOwner = workflowCount(counts, "pending_by_action_owner");
  const closedByOwner = workflowCount(counts, "closed_by_action_owner");
  const stats: AuditListStat[] = [
    { title: "Total Audits", value: dashboardCount(counts?.total_audits), icon: ClipboardList },
    { title: "Total Observations", value: dashboardCount(counts?.total_observations), icon: ListChecks },
    { title: "CAPA Plan Not Started", value: workflowCount(counts, "pending_by_spoc"), icon: Clock },
    { title: "CAPA Plan Started", value: pendingByOwner + closedByOwner, icon: ClipboardCheck },
    { title: "CAPA Plan Not Closed By Action Owner", value: pendingByOwner, icon: AlertTriangle },
    { title: "CAPA Plan Closed By Action Owner", value: closedByOwner, icon: CheckCircle2 },
  ];

  return (
    <AuditListView
      title="Audit — Functional Head"
      stats={stats}
      columns={AUDIT_CARD_COLUMNS}
      detailBasePath="/safety/audit/functional-head"
      storageKey="vi-audit-list-functional-head"
      data={audits}
      loading={loading}
      pagination={{
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        onPageChange: setPage,
      }}
      onFilterClick={() => setIsFilterOpen(true)}
      onSearch={(term) => {
        setSearch(term);
        setPage(1);
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

export default FunctionalHeadAuditListPage;
