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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { INCIDENT_COLUMNS, VI_INCIDENT_LIST, VI_INCIDENT_STATUS_TONE, type ViIncidentRecord } from "./viIncidentData";

export interface IncidentListStat {
  title: string;
  value: number;
  icon: LucideIcon;
}

// Same summary-card standard as the audit lists.
const summaryCardClass =
  "!bg-[#F5F4F0] !rounded-2xl !px-5 !py-[18px] !shadow-none hover:!shadow-none !cursor-default";
const summaryIconTileClass = "!w-9 !h-9 !bg-white !rounded-[10px]";

export const IncidentStatusPill = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11px] font-medium ${
      VI_INCIDENT_STATUS_TONE[status] ?? VI_INCIDENT_STATUS_TONE.Closed
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
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = data.filter((incident) => {
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

  const renderActions = (item: ViIncidentRecord) => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        onClick={() => navigate(`${detailBasePath}/${item.id}`)}
        title="View incident"
      >
        <Eye className="w-4 h-4" />
      </Button>
      {editDrafts && item.status === "Draft" && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-black hover:bg-gray-100"
          onClick={() => navigate(`${detailBasePath}/${item.id}/edit`)}
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

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-[14px] mb-6">
        {buildIncidentStats(data).map(({ title: statTitle, value, icon: Icon }) => (
          <StatsCard
            key={statTitle}
            title={statTitle}
            value={value}
            icon={<Icon className="w-[18px] h-[18px]" style={{ color: "rgba(26, 26, 24, 0.48)" }} />}
            className={summaryCardClass}
            iconWrapperClassName={summaryIconTileClass}
          />
        ))}
      </div>

      <EnhancedTable
        data={filtered}
        columns={INCIDENT_COLUMNS}
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
        onFilterClick={() => toast.info("Incident filters coming soon")}
        leftActions={leftActions}
      />
    </div>
  );
};
