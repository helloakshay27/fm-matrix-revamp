import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  FileEdit,
  HeartPulse,
  Pencil,
  Search,
  type LucideIcon,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import type { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useDebounce } from "@/hooks/useDebounce";
import {
  EMPTY_INCIDENT_FILTERS,
  IncidentFilterDialog,
  incidentFiltersToQuery,
  type IncidentFilters,
} from "./IncidentFilterDialog";
import {
  dashboardCount,
  dashboardGroupCount,
  dashboardGroupLabel,
  dashboardWorkflowOptions,
  useViIncidentDashboard,
  useViIncidentDetails,
  useViIncidentList,
} from "./viIncidentApi";
import { INCIDENT_COLUMNS, VI_INCIDENT_STATUS_TONE, type ViIncidentRecord, type ViIncidentRole } from "./viIncidentData";

export interface IncidentListStat {
  title: string;
  value: number;
  icon: LucideIcon;
}

/** Builds a role's stat cards from its dashboard counters (GET /vi_incidents/<role>_dashboard.json). */
export type IncidentStatsBuilder = (dashboard: Record<string, unknown>) => IncidentListStat[];

// Same summary-card standard as the audit lists.
// Plain StatsCard (ticket list look), not clickable — same as the audit lists.
const summaryCardClass = "cursor-default hover:shadow-[0px_1px_8px_rgba(45,45,45,0.05)]";

export const IncidentStatusPill = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap px-2 py-1 rounded text-xs font-medium ${
      VI_INCIDENT_STATUS_TONE[status] ?? VI_INCIDENT_STATUS_TONE.default
    }`}
  >
    {status || "-"}
  </span>
);

/** Reporter stats (GET /vi_incidents/reporter_dashboard.json). */
export const buildIncidentStats: IncidentStatsBuilder = (d) => [
  { title: "Total Incidents", value: dashboardCount(d, "total_incidents", "total_assigned_incidents"), icon: ClipboardList },
  { title: "Closed Incident", value: dashboardCount(d, "closed_incidents"), icon: CheckCircle2 },
  { title: "Open Incident", value: dashboardCount(d, "open_incidents"), icon: AlertTriangle },
  // Workflow cards use the API's labels; the text here is only a fallback.
  {
    title: dashboardGroupLabel(d, "workflow", "pending_by_spoc", "Pending By SPOC"),
    value: dashboardGroupCount(d, "workflow", "pending_by_spoc"),
    icon: Search,
  },
  {
    title: dashboardGroupLabel(d, "workflow", "pending_by_action_owner", "Pending By Action Owner"),
    value: dashboardGroupCount(d, "workflow", "pending_by_action_owner"),
    icon: Clock,
  },
  {
    title: dashboardGroupLabel(d, "workflow", "closed_by_action_owner", "Closed By Action Owner"),
    value: dashboardGroupCount(d, "workflow", "closed_by_action_owner"),
    icon: CheckCircle2,
  },
  { title: "Draft", value: dashboardCount(d, "draft_incidents"), icon: FileEdit },
  { title: "Injury Records", value: dashboardCount(d, "total_injury_records"), icon: HeartPulse },
];

/**
 * Shared layout for the incident list pages (stats cards + incident table). Each role page
 * (Reporter, SPOC, Action Owner, Functional Head) supplies its role, title, detail route and actions.
 * Paging, search (incident ID) and filters run on the server.
 */
export const IncidentListView = ({
  role,
  title,
  detailBasePath,
  storageKey,
  leftActions,
  editPath,
  needsDetail,
  buildStats =buildIncidentStats,
  columns = INCIDENT_COLUMNS,
  extraQuery,
}: {
  role: ViIncidentRole;
  title: string;
  /** The eye button opens `${detailBasePath}/${incident.id}`. */
  detailBasePath: string;
  storageKey: string;
  /** Toolbar content; a function receives the role's dashboard (e.g. for dashboard-driven filters). */
  leftActions?: ReactNode | ((dashboard: Record<string, unknown>) => ReactNode);
  /** Route for the edit button on an incident this role saved as a draft; null → no edit button. */
  editPath?: (incident: ViIncidentRecord) => string | null;
  /** Rows whose list data can't tell `editPath` enough; their full record is fetched and used instead. */
  needsDetail?: (incident: ViIncidentRecord) => boolean;
  /** Stat cards for this role — defaults to the reporter's six. */
  buildStats?: IncidentStatsBuilder;
  /** Table columns — defaults to the full incident column set. */
  columns?: ColumnConfig[];
  /** Role-specific list params (e.g. the action owner's assignment_status); a change goes back to page 1. */
  extraQuery?: Record<string, string>;
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm.trim(), 400);
  const [filters, setFilters] = useState<IncidentFilters>(EMPTY_INCIDENT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  const extraKey = JSON.stringify(extraQuery ?? {});
  const [appliedExtraKey, setAppliedExtraKey] = useState(extraKey);
  if (appliedExtraKey !== extraKey) {
    setAppliedExtraKey(extraKey);
    setPage(1);
  }

  const query = useMemo(
    () => ({
      ...incidentFiltersToQuery(filters),
      ...(debouncedSearch ? { "q[incident_no_cont]": debouncedSearch } : {}),
      ...Object.fromEntries(Object.entries(JSON.parse(extraKey) as Record<string, string>).filter(([, v]) => v)),
    }),
    [filters, debouncedSearch, extraKey],
  );
  const { incidents, pagination, loading } = useViIncidentList(role, page, query);
  const { dashboard } = useViIncidentDashboard(role);
  const detailIds = useMemo(
    () => (needsDetail ? incidents.filter(needsDetail).map((incident) => incident.id) : []),
    [incidents, needsDetail],
  );
  const details = useViIncidentDetails(detailIds);

  const renderCell = (item: ViIncidentRecord, columnKey: string) => {
    if (columnKey === "status") {
      // A row with an edit button is this role's draft.
      const draft = item.status !== "Draft" && Boolean(editPath?.(details.get(item.id) ?? item));
      return (
        <div className="flex flex-wrap items-center gap-1">
          <IncidentStatusPill status={item.status} />
          {draft && <IncidentStatusPill status="Draft" />}
        </div>
      );
    }
    return <span>{String(item[columnKey as keyof ViIncidentRecord] ?? "") || "-"}</span>;
  };

  const renderActions = (item: ViIncidentRecord) => (
    <div className="flex items-center justify-center gap-1 w-full h-full min-h-[40px]">
      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        onClick={() => navigate(`${detailBasePath}/${item.id}`)}
        title="View incident"
      >
        <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
      </button>
      {editPath?.(details.get(item.id) ?? item) && (
        <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded transition-colors"
          onClick={() => navigate(editPath(details.get(item.id) ?? item)!)}
          title="Edit draft"
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
        {buildStats(dashboard).map(({ title: statTitle, value, icon: Icon }) => (
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
        data={incidents}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey={storageKey}
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={(term) => {
          setSearchTerm(term);
          setPage(1);
        }}
        disableClientSearch
        loading={loading}
        loadingMessage="Loading incidents..."
        searchPlaceholder="Search by incident ID..."
        enableExport
        exportFileName={storageKey}
        emptyMessage="No incidents found"
        pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
        onFilterClick={() => setFilterOpen(true)}
        leftActions={typeof leftActions === "function" ? leftActions(dashboard) : leftActions}
      />

      <IncidentFilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        statusOptions={dashboardWorkflowOptions(dashboard)}
        onApply={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />
    </div>
  );
};
