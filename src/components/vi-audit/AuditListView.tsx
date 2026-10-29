import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import type { ColumnConfig } from "@/hooks/useEnhancedTable";
import { VI_AUDIT_LIST, type ViAuditListRecord } from "./viAuditListData";
import { AuditStatusPill } from "./ViAuditUi";

export interface AuditListStat {
  title: string;
  value: number;
  icon: LucideIcon;
}

// Summary-card standard: #F5F4F0 card, 16px radius, 18px 20px padding, no shadow,
// white 36x36 icon tile (10px radius) with a neutral 18px line icon.
const summaryCardClass =
  "!bg-[#F5F4F0] !rounded-2xl !px-5 !py-[18px] !shadow-none hover:!shadow-none !cursor-default";
const summaryIconTileClass = "!w-9 !h-9 !bg-white !rounded-[10px]";

/**
 * Shared layout for the audit list pages (stats cards + audit table). Each role page
 * (Auditor, SPOC, Action Owner, Functional Head) supplies its own title, stats, columns,
 * detail route and actions.
 */
export const AuditListView = ({
  title,
  stats,
  columns,
  detailBasePath,
  storageKey,
  leftActions,
  children,
  data,
  loading = false,
  pagination,
  editDrafts = false,
  onFilterClick,
  onSearch,
}: {
  title: string;
  stats: AuditListStat[];
  columns: ColumnConfig[];
  /** The eye button opens `${detailBasePath}/${audit.id}`. */
  detailBasePath: string;
  storageKey: string;
  leftActions?: ReactNode;
  /** Extra page-level content (e.g. modals). */
  children?: ReactNode;
  /** Rows to show (e.g. from the audit API). Defaults to the placeholder list. */
  data?: ViAuditListRecord[];
  loading?: boolean;
  /** Server-side pagination — the table shows `data` as one page and asks for others. */
  pagination?: { currentPage: number; totalPages: number; onPageChange: (page: number) => void };
  /** Draft rows also get an edit button, opening `${detailBasePath}/${audit.id}/edit`. */
  editDrafts?: boolean;
  /** Opens the page's filter dialog from the table's filter button. */
  onFilterClick?: () => void;
  /** Server-side search by Audit ID — called (debounced) with the search box text. */
  onSearch?: (term: string) => void;
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Searching through the API: wait for typing to pause, then let the page refetch.
  useEffect(() => {
    if (!onSearch) return;
    const timer = setTimeout(() => onSearch(searchTerm.trim()), 400);
    return () => clearTimeout(timer);
    // onSearch is recreated by the page on every render; only the text matters here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const rows = data ?? VI_AUDIT_LIST;
  const filteredAudits = rows.filter((a) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term || onSearch) return true;
    return (
      a.requestorName.toLowerCase().includes(term) ||
      a.mailId.toLowerCase().includes(term) ||
      a.vendorName.toLowerCase().includes(term) ||
      a.auditLocation.toLowerCase().includes(term) ||
      String(a.auditId).includes(term)
    );
  });

  const renderCell = (item: ViAuditListRecord, columnKey: string) => {
    switch (columnKey) {
      case "status":
        return <AuditStatusPill status={item.status} />;
      case "auditType":
        return <span>{item.auditType} Audit</span>;
      case "auditLocation":
        // Long addresses wrap inside the column instead of stretching the table.
        return <span className="block min-w-[180px] max-w-[280px] whitespace-normal break-words">{item.auditLocation}</span>;
      default:
        return <span>{String(item[columnKey as keyof ViAuditListRecord] ?? "")}</span>;
    }
  };

  const renderActions = (item: ViAuditListRecord) => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        onClick={() => navigate(`${detailBasePath}/${item.id}`)}
        title="View audit"
      >
        <Eye className="w-4 h-4" />
      </Button>
      {editDrafts && String(item.status).toLowerCase() === "draft" && (
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[14px] mb-6">
        {stats.map(({ title: statTitle, value, icon: Icon }) => (
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
        data={filteredAudits}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey={storageKey}
        enableSearch
        searchTerm={searchTerm}
        loading={loading}
        loadingMessage="Loading audits..."
        onSearchChange={setSearchTerm}
        searchPlaceholder={onSearch ? "Search by Audit ID..." : "Search..."}
        disableClientSearch={!!onSearch}
        enableExport
        exportFileName={storageKey}
        emptyMessage="No audits found"
        pagination
        pageSize={pagination ? undefined : 10}
        currentPage={pagination?.currentPage}
        totalPages={pagination?.totalPages}
        onPageChange={pagination?.onPageChange}
        onFilterClick={onFilterClick ?? (() => toast.info("Audit filters coming soon"))}
        leftActions={leftActions}
      />

      {children}
    </div>
  );
};
