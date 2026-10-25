import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Download, Eye, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { downloadInspectionReport } from "./downloadInspectionReport";
import {
  EMPTY_INSPECTION_FILTERS,
  INSPECTION_FILTER_KEYS,
  InspectionFilterDialog,
  type InspectionFilters,
} from "./InspectionFilterDialog";
import { fetchViInspection, num, useViInspectionDashboard, useViInspectionList, useViInspectionMasters } from "./viInspectionApi";
import {
  DASHBOARD_CARDS,
  INSPECTION_COLUMNS,
  INSPECTION_PATHS,
  formatInspectionDate,
  workflowLabel,
  workflowTone,
  type ViInspectionRecord,
  type ViInspectionRole,
} from "./viInspectionData";

// Same summary-card standard as the incident / audit lists.
const summaryCardClass =
  "!bg-[#F5F4F0] !rounded-2xl !px-5 !py-[18px] !shadow-none hover:!shadow-none !cursor-default";
const summaryIconTileClass = "!w-9 !h-9 !bg-white !rounded-[10px]";

export const InspectionStatusPill = ({ workflowKey, label }: { workflowKey: string; label?: string }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11px] font-medium ${workflowTone(
      workflowKey,
    )}`}
  >
    {label || workflowLabel(workflowKey) || "-"}
  </span>
);

const FILTER_LABEL: Record<string, string> = {
  date_from: "From",
  date_to: "To",
  status: "Status",
  circle_id: "Circle",
  personal_area_id: "Personnel Area",
  work_location_id: "Work Location",
  facility_type_id: "Type of Facility",
  inspection_type_id: "Inspection Type",
};

type InspectionRow = ViInspectionRecord & {
  inspectionDateLabel: string;
  targetDateLabel: string;
  spocName: string;
  functionalHeadName: string;
};

/**
 * Shared layout for the four role lists (dashboard cards + inspection table). Paging and filters run
 * on the server and live in the URL (?page=&date_from=&status=…), so links, refresh and back keep them.
 */
export const InspectionListView = ({
  role,
  title,
  storageKey,
  leftActions,
  editPath,
  enableReportDownload = false,
}: {
  role: ViInspectionRole;
  title: string;
  storageKey: string;
  leftActions?: ReactNode;
  /** Route for the edit button on rows the user may still edit (can_edit); omit for no edit button. */
  editPath?: (inspection: ViInspectionRecord) => string;
  enableReportDownload?: boolean;
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const page = Math.max(1, Math.floor(Number(searchParams.get("page"))) || 1);
  const filters = useMemo(
    () =>
      Object.fromEntries(INSPECTION_FILTER_KEYS.map((key) => [key, searchParams.get(key) ?? ""])) as InspectionFilters,
    [searchParams],
  );
  const query = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, v]) => v)), [filters]);

  const { inspections, pagination, loading } = useViInspectionList(role, page, query);
  const { counts } = useViInspectionDashboard(role);
  const { masters, loading: mastersLoading } = useViInspectionMasters();

  /** Writes filters and/or page to the URL; changing filters goes back to page 1. */
  const updateParams = (next: Partial<InspectionFilters>, nextPage?: number) =>
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      Object.entries(next).forEach(([key, value]) => (value ? params.set(key, value) : params.delete(key)));
      const target = nextPage ?? 1;
      if (target > 1) params.set("page", String(target));
      else params.delete("page");
      return params;
    });

  const filterValueLabel = (key: string, value: string) => {
    const options: Record<string, { value: string; label: string }[]> = {
      circle_id: masters.circles,
      personal_area_id: masters.personalAreas,
      work_location_id: masters.workLocations,
      facility_type_id: masters.facilityTypes,
      inspection_type_id: masters.inspectionTypes,
    };
    if (key === "status") return workflowLabel(value);
    if (key === "date_from" || key === "date_to") return formatInspectionDate(value);
    return options[key]?.find((o) => o.value === value)?.label ?? value;
  };
  const activeFilters = Object.entries(filters).filter(([, value]) => value);

  const rows: InspectionRow[] = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return inspections
      .map((inspection) => ({
        ...inspection,
        inspectionDateLabel: formatInspectionDate(inspection.inspectionDate),
        targetDateLabel: formatInspectionDate(inspection.targetDate),
        spocName: inspection.spoc?.name ?? "",
        functionalHeadName: inspection.functionalHead?.name ?? "",
      }))
      .filter(
        (row) =>
          !term ||
          [row.inspectionNo, row.inspectionType, row.circle, row.workLocation, row.spocName, row.inspectorLocation].some(
            (value) => value.toLowerCase().includes(term),
          ),
      );
  }, [inspections, searchTerm]);

  const handleDownload = async (row: InspectionRow) => {
    setDownloadingId(row.id);
    try {
      downloadInspectionReport(await fetchViInspection(row.id));
    } catch (error) {
      console.error("Inspection report failed:", error);
      toast.error("Unable to download report. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const renderCell = (item: InspectionRow, columnKey: string) => {
    if (columnKey === "workflowLabel") return <InspectionStatusPill workflowKey={item.workflowKey} label={item.workflowLabel} />;
    if (columnKey === "downloadReport")
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-black hover:bg-gray-100"
          title="Download report"
          aria-label={`Download report for ${item.inspectionNo}`}
          disabled={downloadingId === item.id}
          onClick={(event) => {
            event.stopPropagation();
            handleDownload(item);
          }}
        >
          <Download className="w-4 h-4" />
        </Button>
      );
    return <span>{String(item[columnKey as keyof InspectionRow] ?? "") || "-"}</span>;
  };

  const renderActions = (item: InspectionRow) => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        onClick={() => navigate(`${INSPECTION_PATHS[role]}/${item.id}`)}
        title="View inspection"
      >
        <Eye className="w-4 h-4" />
      </Button>
      {editPath && item.canEdit && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-black hover:bg-gray-100"
          onClick={() => navigate(editPath(item))}
          title="Edit draft"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold text-[#1A1A18] mb-4">{title}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[14px] mb-6">
        {DASHBOARD_CARDS[role].map(({ key, title: statTitle, icon: Icon }) => (
          <StatsCard
            key={key}
            title={statTitle}
            value={num(counts[key])}
            icon={<Icon className="w-[18px] h-[18px]" style={{ color: "rgba(26, 26, 24, 0.48)" }} />}
            className={summaryCardClass}
            iconWrapperClassName={summaryIconTileClass}
          />
        ))}
      </div>

      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activeFilters.map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700"
            >
              {FILTER_LABEL[key]}: {filterValueLabel(key, value)}
              <button
                type="button"
                onClick={() => updateParams({ [key]: "" })}
                className="text-gray-400 hover:text-gray-700"
                aria-label={`Remove ${FILTER_LABEL[key]} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => updateParams(EMPTY_INSPECTION_FILTERS)}
            className="text-xs font-medium text-brand hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <EnhancedTable
        data={rows}
        columns={
          enableReportDownload
            ? [...INSPECTION_COLUMNS, { key: "downloadReport", label: "Download Report", sortable: false, defaultVisible: true }]
            : INSPECTION_COLUMNS
        }
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey={storageKey}
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search this page..."
        loading={loading}
        loadingMessage="Loading inspections..."
        emptyMessage="No inspections found"
        pagination
        currentPage={Math.min(page, pagination.totalPages)}
        totalPages={pagination.totalPages}
        onPageChange={(next) => updateParams({}, next)}
        onFilterClick={() => setFilterOpen(true)}
        leftActions={leftActions}
      />

      <InspectionFilterDialog
        role={role}
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(next) => updateParams(next)}
        masters={masters}
        loading={mastersLoading}
      />
    </div>
  );
};
