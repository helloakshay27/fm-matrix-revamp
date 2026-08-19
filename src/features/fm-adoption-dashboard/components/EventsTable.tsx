import { useState } from "react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import type { ColumnConfig } from "@/hooks/useEnhancedTable";
import type { EventsResponse } from "@/services/fmAdoptionApi";

const columns: ColumnConfig[] = [
  { key: "name", label: "Event", sortable: true, defaultVisible: true },
  { key: "events", label: "Events", sortable: true, defaultVisible: true },
  { key: "users", label: "Users", sortable: true, defaultVisible: true },
];

function renderCell(item: EventsResponse["events"][number], columnKey: string) {
  const value = item[columnKey as keyof typeof item];
  return typeof value === "number" ? value.toLocaleString() : value ?? "-";
}

interface EventsTableProps {
  events: EventsResponse["events"];
  loading?: boolean;
}

export function EventsTable({ events, loading }: EventsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="overflow-hidden rounded-lg border border-brand-border">
      <EnhancedTable
        data={events}
        columns={columns}
        renderCell={renderCell}
        storageKey="fm-adoption-events-table"
        emptyMessage="No events recorded for this range"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search events..."
        enableSearch
        pagination
        pageSize={10}
        loading={loading}
      />
    </div>
  );
}
