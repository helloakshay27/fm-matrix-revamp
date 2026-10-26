import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
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

// Summary cards use the plain StatsCard (ticket list look: #F6F4EE card, beige icon tile,
// brand icon); they aren't clickable here.
const summaryCardClass = "cursor-default hover:shadow-[0px_1px_8px_rgba(45,45,45,0.05)]";

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

  // Action icons — same markup as the ticket list action column.
  const renderActions = (item: ViAuditListRecord) => (
    <div className="flex items-center justify-center gap-1 w-full h-full min-h-[40px]">
      <button
        type="button"
        title="View audit"
        aria-label="View audit"
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        onClick={() => navigate(`${detailBasePath}/${item.id}`)}
      >
        <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
      </button>
      {editDrafts && String(item.status).toLowerCase() === "draft" && (
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
