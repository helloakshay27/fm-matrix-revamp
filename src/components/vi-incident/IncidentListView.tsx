import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  FileEdit,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import type { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  EMPTY_INCIDENT_FILTERS,
  IncidentFilterDialog,
  matchesIncidentFilters,
  type IncidentFilters,
} from "./IncidentFilterDialog";
import { INCIDENT_COLUMNS, VI_INCIDENT_LIST, VI_INCIDENT_STATUS_TONE, type ViIncidentRecord } from "./viIncidentData";

export interface IncidentListStat {
  title: string;
  value: number;
  icon: LucideIcon;
}

// Same summary cards as the audit lists (plain StatsCard, ticket list look); not clickable here.
const summaryCardClass = "cursor-default hover:shadow-[0px_1px_8px_rgba(45,45,45,0.05)]";

export const IncidentStatusPill = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap px-2 py-1 rounded text-xs font-medium ${
      VI_INCIDENT_STATUS_TONE[status] ?? VI_INCIDENT_STATUS_TONE.default
    }`}
  >
    {status}
  </span>
);

/** Stats shown on top of every incident list (Total / Closed / Open / Pending / Closed by AO / Draft). */
export const buildIncidentStats = (records: ViIncidentRecord[]): IncidentListStat[] => {
  const count = (status: string) => records.filter((r) => r.status === status).length;
  return [
    { title: "Total Incidents", value: records.length, icon: ClipboardList },
    { title: "Closed Incident", value: count("Closed"), icon: CheckCircle2 },
    { title: "Open Incident", value: count("Open") + count("Pending By SPOC"), icon: AlertTriangle },
    { title: "Pending By Action Owner", value: count("Pending By Action Owner"), icon: Clock },
    { title: "Closed By Action Owner", value: count("Closed By Action Owner"), icon: CheckCircle2 },
    { title: "Draft", value: count("Draft"), icon: FileEdit },
  ];
};

/**
 * Shared layout for the incident list pages (stats cards + incident table). Each role page
 * (Reporter, SPOC, Action Owner, Functional Head) supplies its own title, detail route and actions.
 */
export const IncidentListView = ({
  title,
  detailBasePath,
  storageKey,
  leftActions,
  data = VI_INCIDENT_LIST,
  loading = false,
  editDrafts = false,
  buildStats = buildIncidentStats,
  columns = INCIDENT_COLUMNS,
}: {
  title: string;
  /** The eye button opens `${detailBasePath}/${incident.id}`. */
  detailBasePath: string;
  storageKey: string;
  leftActions?: ReactNode;
  data?: ViIncidentRecord[];
  loading?: boolean;
  /** Draft rows also get an edit button, opening `${detailBasePath}/${incident.id}/edit`. */
  editDrafts?: boolean;
  /** Stat cards for this role — defaults to the standard six. */
  buildStats?: (records: ViIncidentRecord[]) => IncidentListStat[];
  /** Table columns — defaults to the full incident column set. */
  columns?: ColumnConfig[];
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<IncidentFilters>(EMPTY_INCIDENT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = data.filter((incident) => {
    if (!matchesIncidentFilters(incident, filters)) return false;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      String(incident.incidentId).includes(term) ||
      incident.classification.toLowerCase().includes(term) ||
      incident.category.toLowerCase().includes(term) ||
      incident.incidentLocation.toLowerCase().includes(term) ||
      incident.spoc.toLowerCase().includes(term)
    );
  });

  const renderCell = (item: ViIncidentRecord, columnKey: string) => {
    if (columnKey === "status") return <IncidentStatusPill status={item.status} />;
    return <span>{String(item[columnKey as keyof ViIncidentRecord] ?? "") || "-"}</span>;
  };

  // Action icons — same markup as the ticket list action column.
  const renderActions = (item: ViIncidentRecord) => (
    <div className="flex items-center justify-center gap-1 w-full h-full min-h-[40px]">
      <button
        type="button"
        title="View incident"
        aria-label="View incident"
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        onClick={() => navigate(`${detailBasePath}/${item.id}`)}
      >
        <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
      </button>
      {editDrafts && item.status === "Draft" && (
        <button
          type="button"
          title="Edit draft"
          aria-label="Edit draft"
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          onClick={() => navigate(`${detailBasePath}/${item.id}/edit`)}
        >
          <Pencil className="w-4 h-4 text-gray-600 cursor-pointer hover:text-brand" />
        </button>
      )}
    </div>
  );

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4">{title}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {buildStats(data).map(({ title: statTitle, value, icon: Icon }) => (
          <StatsCard
            key={statTitle}
            title={statTitle}
            value={value}
            icon={<Icon className="w-6 h-6 text-brand" />}
            className={summaryCardClass}
          />
        ))}
      </div>

      <EnhancedTable
        data={filtered}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey={storageKey}
        enableSearch
        searchTerm={searchTerm}
        loading={loading}
        loadingMessage="Loading incidents..."
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        enableExport
        exportFileName={storageKey}
        emptyMessage="No incidents found"
        pagination
        pageSize={10}
        onFilterClick={() => setFilterOpen(true)}
        leftActions={leftActions}
      />

      <IncidentFilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  );
};
