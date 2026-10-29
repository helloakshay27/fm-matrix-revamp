import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Eye, Shield, Paperclip, ClipboardList, CheckCircle2, XCircle, Ticket, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TicketPagination } from "@/components/TicketPagination";
import { PatrollingFilterModal, type PatrollingFilters } from "@/components/PatrollingFilterModal";
import { useDebounce } from "@/hooks/useDebounce";
import {
  fetchPatrollingResponses,
  fetchPatrollingResponseDetails,
  exportPatrollingResponses,
  PatrollingApiError,
  type PatrollingListParams,
  type PatrollingResponseRow,
  type PatrollingQuestion,
  type PatrollingListResponse,
} from "@/services/patrollingResponsesAPI";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The API sends site time (e.g. 2026-10-28T22:00:00.000+05:30). Read the digits directly
// instead of going through Date(), which would shift it into the browser's time zone.
const formatDateTime = (iso?: string | null) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso || "");
  if (!m) return "-";
  const hour = Number(m[4]);
  const time = `${hour % 12 || 12}:${m[5]} ${hour < 12 ? "am" : "pm"}`;
  return `${m[3]} ${MONTHS[Number(m[2]) - 1]} ${m[1]}, ${time}`;
};

const statusLabel = (status?: string | null) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";

const statusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "missed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const dash = (v?: string | number | null) =>
  v === undefined || v === null || v === "" ? "-" : String(v);

const toApiFilters = (f: PatrollingFilters): PatrollingListParams => ({
  status: f.status,
  building_id: f.buildingId ?? undefined,
  wing_id: f.wingId ?? undefined,
  area_id: f.areaId ?? undefined,
  floor_id: f.floorId ?? undefined,
  room_id: f.roomId ?? undefined,
});

const errorMessage = (err: unknown, fallback: string) => {
  if (err instanceof PatrollingApiError) {
    if (err.status === 401) return "Your session has expired. Please log in again.";
    if (err.status === 403) return "You don't have permission to view patrolling responses.";
    return err.message;
  }
  return fallback;
};

export const PatrollingResponsePage = () => {
  const [responses, setResponses] = useState<PatrollingResponseRow[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<PatrollingListResponse["summary"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<PatrollingFilters>({});
  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  const [selected, setSelected] = useState<PatrollingResponseRow | null>(null);
  const [details, setDetails] = useState<PatrollingQuestion[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filters + search, shared by the list and export calls (no paging).
  const queryFilters = useMemo<PatrollingListParams>(
    () => ({ ...toApiFilters(appliedFilters), search: debouncedSearch.trim() }),
    [appliedFilters, debouncedSearch]
  );

  // Ignore responses from calls that have since been superseded.
  const latestRequest = useRef(0);

  const fetchResponses = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setIsLoading(true);
    try {
      const res = await fetchPatrollingResponses({
        ...queryFilters,
        page: currentPage,
        per_page: perPage,
      });
      if (requestId !== latestRequest.current) return;
      setSummary(res.summary ?? null);
      setResponses(res.data ?? []);
      setTotalEntries(res.pagination?.total_entries ?? 0);
      setTotalPages(Math.max(1, res.pagination?.total_pages ?? 1));
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setResponses([]);
      setTotalEntries(0);
      setTotalPages(1);
      toast.error(errorMessage(err, "Failed to load patrolling responses"));
    } finally {
      if (requestId === latestRequest.current) setIsLoading(false);
    }
  }, [queryFilters, currentPage, perPage]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  // Back to the first page whenever the search text or filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [queryFilters]);

  const openDetails = async (item: PatrollingResponseRow) => {
    setSelected(item);
    setDetails([]);
    setIsDetailLoading(true);
    try {
      const res = await fetchPatrollingResponseDetails(item.response_id);
      setDetails(res.data?.questions ?? []);
    } catch (err) {
      setSelected(null);
      toast.error(
        err instanceof PatrollingApiError && err.status === 404
          ? "This response could not be found."
          : errorMessage(err, "Failed to load response details")
      );
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { blob, filename } = await exportPatrollingResponses(queryFilters);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    } catch (err) {
      toast.error(errorMessage(err, "Failed to export patrolling responses"));
    } finally {
      setIsExporting(false);
    }
  };

  const col = (key: string, label: string, sortable = true) => ({
    key,
    label,
    sortable,
    draggable: true,
    defaultVisible: true,
    hideable: true,
  });

  const columns = useMemo(
    () => [
      col("response_id", "Response ID"),
      col("patrol_name", "Patrol Name"),
      col("checkpoint_name", "Checkpoint name"),
      col("building", "Building"),
      col("wing", "Wing"),
      col("area", "Area"),
      col("floor", "Floor"),
      col("room", "Room"),
      col("schedule_time", "Schedule Date/Time"),
      col("grace_time_hours", "Grace Time(Hours)"),
      col("status", "Status"),
      col("patrolling_date", "Patrolling Date"),
      col("patrolling_time", "Patrolling Time"),
    ],
    []
  );

  const renderCell = (item: PatrollingResponseRow, columnKey: string) => {
    switch (columnKey) {
      case "schedule_time":
        return <span className="text-sm">{formatDateTime(item.schedule_time)}</span>;
      case "status":
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(item.status)}`}>
            {statusLabel(item.status)}
          </span>
        );
      default:
        return <span className="text-sm">{dash(item[columnKey as keyof PatrollingResponseRow] as string | number | null)}</span>;
    }
  };

  const renderActions = (item: PatrollingResponseRow) => (
    <Button
      size="sm"
      variant="ghost"
      className="p-1"
      title="View response details"
      onClick={() => openDetails(item)}
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
      {/* Response Details Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-6xl" aria-describedby="patrol-response-desc">
          <DialogHeader>
            <DialogTitle>
              Response Details{selected ? ` — ${selected.response_id}` : ""}
            </DialogTitle>
            <div id="patrol-response-desc" className="sr-only">
              Questions and answers submitted for this patrolling response
            </div>
          </DialogHeader>
          <div className="overflow-auto max-h-[65vh] border border-gray-200 rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f6f4ee]">
                  {[
                    "Question",
                    "Answer",
                    "Comments",
                    "Submitted By",
                    "Attachments",
                    "Approve By",
                    "Approve Date/Time",
                    "Ticket Id",
                    "Incident Id",
                  ].map((h) => (
                    <TableHead key={h} className="whitespace-nowrap font-semibold text-gray-900">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isDetailLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : details.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {selected?.status === "missed"
                        ? "No answers — this checkpoint was missed"
                        : "No responses found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  details.map((d) => (
                    <TableRow key={d.question_id}>
                      <TableCell className="min-w-[220px]">{dash(d.question)}</TableCell>
                      <TableCell>{dash(d.answer)}</TableCell>
                      <TableCell className="min-w-[140px]">{dash(d.comments)}</TableCell>
                      <TableCell className="whitespace-nowrap">{dash(d.submitted_by)}</TableCell>
                      <TableCell>
                        {d.attachments?.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {d.attachments.map((a, i) => (
                              <a
                                key={a.id ?? i}
                                href={a.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
                              >
                                <Paperclip className="w-3.5 h-3.5" />
                                {a.file_name}
                              </a>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{dash(d.approved_by)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDateTime(d.approved_on)}</TableCell>
                      <TableCell>{d.ticket_ids?.length ? d.ticket_ids.join(", ") : "-"}</TableCell>
                      <TableCell>{d.incident_ids?.length ? d.incident_ids.join(", ") : "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-brand">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patrolling Responses</h1>
          <p className="text-sm text-gray-600">View patrolling responses</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Patrol Scheduled", value: summary?.total_scheduled, icon: ClipboardList },
          { label: "Completed", value: summary?.completed, icon: CheckCircle2 },
          { label: "Missed", value: summary?.missed, icon: XCircle },
          { label: "Ticket Raised", value: summary?.tickets_raised, icon: Ticket },
          { label: "Incident Reported", value: summary?.incidents_reported, icon: AlertTriangle },
        ].map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.label}
              className="relative bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
                <IconComponent className="w-6 h-6 text-brand" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">{item.value ?? "0"}</div>
                <div className="text-sm font-medium text-[#1A1A1A]">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto animate-fade-in">
        <div className="space-y-4">
          <EnhancedTable
            data={responses}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="patrolling-responses-table"
            enableExport={true}
            onExport={handleExport}
            isExporting={isExporting}
            getItemId={(item: PatrollingResponseRow) => item.response_id}
            disableClientSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search responses..."
            pagination={false}
            pageSize={perPage}
            hideColumnsButton={false}
            hideTableExport={false}
            loading={isLoading}
            emptyMessage="No responses found"
            onFilterClick={() => setIsFilterOpen(true)}
            rightActions={
              activeFilterCount > 0 ? (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-brand text-white">
                  {activeFilterCount}
                </span>
              ) : null
            }
          />
          {totalEntries > 0 && (
            <TicketPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalEntries}
              perPage={perPage}
              isLoading={isLoading}
              onPageChange={(page) => setCurrentPage(page)}
              onPerPageChange={(newPerPage) => {
                setPerPage(newPerPage);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      </div>

      <PatrollingFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => {
          setAppliedFilters(filters);
        }}
      />
    </div>
  );
};
