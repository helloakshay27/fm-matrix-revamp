import { useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardList, ListChecks } from "lucide-react";
import { AuditListView, type AuditListStat } from "@/components/vi-audit/AuditListView";
import { AUDIT_CARD_COLUMNS } from "@/components/vi-audit/viAuditListData";
import { dashboardCount, useViAuditDashboard, workflowCount } from "@/components/vi-audit/useViAuditDashboard";
import {
  AuditFilterDialog,
  EMPTY_AUDIT_FILTERS,
  type AuditStatusOption,
  type ViAuditFilters,
} from "@/components/vi-audit/AuditFilterDialog";

const STATUS_OPTIONS: AuditStatusOption[] = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

// Action Owner: audits with CAPA plans assigned.
const ActionOwnerAuditListPage = () => {
  // Filter dialog state. The table is still placeholder data (no list API yet), so these filters
  // are kept here to be sent with the list request once the endpoint is wired (auditFiltersToParams).
  const [filters, setFilters] = useState<ViAuditFilters>(EMPTY_AUDIT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
      onFilterClick={() => setIsFilterOpen(true)}
    >
      <AuditFilterDialog
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        statusOptions={STATUS_OPTIONS}
        onApply={setFilters}
      />
    </AuditListView>
  );
};

export default ActionOwnerAuditListPage;
