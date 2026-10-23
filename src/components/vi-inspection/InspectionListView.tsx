import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ClipboardList, Clock, Download, Eye, FileEdit, type LucideIcon } from "lucide-react";
import { downloadInspectionReport } from "./downloadInspectionReport";
import { toast } from "sonner";
import { StatsCard } from "@/components/StatsCard";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import {
  INSPECTION_COLUMNS,
  getInspectionDisplayStatus,
  VI_INSPECTION_LIST,
  VI_INSPECTION_STATUS_TONE,
  type ViInspectionRecord,
  type ViInspectionStatus,
} from "./viInspectionData";

// Same summary cards as the audit / incident lists (plain StatsCard, ticket list look); not clickable.
const summaryCardClass = "cursor-default hover:shadow-[0px_1px_8px_rgba(45,45,45,0.05)]";

export const InspectionStatusPill = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap px-2 py-1 rounded text-xs font-medium ${
      VI_INSPECTION_STATUS_TONE[getInspectionDisplayStatus(status)] ?? VI_INSPECTION_STATUS_TONE.default
    }`}
  >
    {getInspectionDisplayStatus(status)}
  </span>
);

/** Stats shown on top of every inspection list (Total / Closed / Open / Pending / Closed by AO / Draft). */
const buildInspectionStats = (
  records: ViInspectionRecord[],
  statuses?: ViInspectionStatus[],
): { title: string; value: number; icon: LucideIcon }[] => {
  const count = (status: string) => records.filter((r) => r.status === status).length;
  const stats: { title: string; status?: ViInspectionStatus; value: number; icon: LucideIcon }[] = [
    { title: "Total Inspection", value: records.length, icon: ClipboardList },
    { title: "Closed Inspection", status: "Closed", value: count("Closed"), icon: CheckCircle2 },
    { title: "Open Inspection", status: "Open", value: count("Open"), icon: AlertTriangle },
    { title: "Pending By Action Owner", status: "Pending By Action Owner", value: count("Pending By Action Owner"), icon: Clock },
    { title: "Closed By Action Owner", status: "Closed By Action Owner", value: count("Closed By Action Owner"), icon: CheckCircle2 },
    { title: "Draft", status: "Draft", value: count("Draft"), icon: FileEdit },
  ];
  // Only the total plus the cards for statuses this role can see.
  return statuses ? stats.filter((stat) => !stat.status || statuses.includes(stat.status)) : stats;
};

/**
 * Shared layout for the inspection list pages (stats cards + inspection table). Each role page
 * (Inspector, SPOC, Action Owner, Functional Head) supplies its own title and actions.
 */
export const InspectionListView = ({
  title,
  detailBasePath,
  storageKey,
  leftActions,
  data: allData = VI_INSPECTION_LIST,
  statuses,
  enableReportDownload = false,
}: {
  title: string;
  /** The eye button opens `${detailBasePath}/${inspection.id}`. */
  detailBasePath: string;
  storageKey: string;
  leftActions?: ReactNode;
  data?: ViInspectionRecord[];
  /** Statuses this role can see (rows and stat cards); omit to show every status. */
  statuses?: ViInspectionStatus[];
  enableReportDownload?: boolean;
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const data = statuses ? allData.filter((inspection) => statuses.includes(inspection.status)) : allData;
  const stats = buildInspectionStats(data, statuses);

  const filtered = data.filter((inspection) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      String(inspection.inspectionId).includes(term) ||
      inspection.title.toLowerCase().includes(term) ||
      inspection.inspectionType.toLowerCase().includes(term) ||
      inspection.inspectionLocation.toLowerCase().includes(term) ||
      inspection.spoc.toLowerCase().includes(term)
    );
  });

  const renderCell = (item: ViInspectionRecord, columnKey: string) => {
    if (columnKey === "downloadReport") return (
      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Download report"
        aria-label={`Download report for inspection ${item.inspectionId}`}
        onClick={(event) => {
          event.stopPropagation();
          try {
            downloadInspectionReport(item);
          } catch {
            toast.error("Unable to download report. Please try again.");
          }
        }}
      >
        <Download className="w-4 h-4 text-gray-600 cursor-pointer hover:text-brand" />
      </button>
    );
    if (columnKey === "status") return <InspectionStatusPill status={item.status} />;
    return <span>{String(item[columnKey as keyof ViInspectionRecord] ?? "") || "-"}</span>;
  };

  // Action icon — same markup as the ticket list action column.
  const renderActions = (item: ViInspectionRecord) => (
    <div className="flex items-center justify-center gap-1 w-full h-full min-h-[40px]">
      <button
        type="button"
        title="View inspection"
        aria-label="View inspection"
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        onClick={() => navigate(`${detailBasePath}/${item.id}`)}
      >
        <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
      </button>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4">{title}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map(({ title: statTitle, value, icon: Icon }) => (
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
        data={filtered.map((inspection) => ({ ...inspection, status: getInspectionDisplayStatus(inspection.status) }))}
        columns={enableReportDownload ? [...INSPECTION_COLUMNS, {
          key: "downloadReport", label: "Download Report", sortable: false, defaultVisible: true,
        }] : INSPECTION_COLUMNS}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey={storageKey}
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        enableExport
        exportFileName={storageKey}
        emptyMessage="No inspections found"
        pagination
        pageSize={10}
        onFilterClick={() => toast.info("Inspection filters coming soon")}
        leftActions={leftActions}
      />
    </div>
  );
};
