import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import type { ColumnConfig } from "@/hooks/useEnhancedTable";
import type { SitesResponse } from "@/services/fmAdoptionApi";

const columns: ColumnConfig[] = [
  { key: "site_name", label: "Site", sortable: true, defaultVisible: true },
  { key: "company_name", label: "Company", sortable: true, defaultVisible: true },
  { key: "users", label: "Users", sortable: true, defaultVisible: true },
  { key: "sessions", label: "Sessions", sortable: true, defaultVisible: true },
  { key: "events", label: "Events", sortable: true, defaultVisible: true },
];

function renderCell(item: SitesResponse["sites"][number], columnKey: string) {
  const value = item[columnKey as keyof typeof item];
  return typeof value === "number" ? value.toLocaleString() : value ?? "-";
}

interface SitesTableProps {
  sites: SitesResponse["sites"];
  loading?: boolean;
}

export function SitesTable({ sites, loading }: SitesTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-brand-border">
      <EnhancedTable
        data={sites}
        columns={columns}
        renderCell={renderCell}
        storageKey="fm-adoption-sites-table"
        emptyMessage="No site activity for this range"
        loading={loading}
      />
    </div>
  );
}
