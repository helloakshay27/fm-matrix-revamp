import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Play, Pause, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  FormControl,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import IssueFilterModal from "@/components/IssueFilterModal";

const ISSUE_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "reopen", label: "Reopen" },
  { value: "closed", label: "Closed" },
  { value: "overdue", label: "Overdued" },
];

const ISSUE_STATUS_DOT: Record<string, string> = {
  open: "bg-blue-500", in_progress: "bg-amber-500", on_hold: "bg-gray-500",
  completed: "bg-teal-500", reopen: "bg-orange-500", closed: "bg-green-800", overdue: "bg-red-500",
};

const SprintIssuePauseModal = ({ isOpen, onClose, onSubmit, onEndIssue, isLoading, issueId }: any) => {
  const [reason, setReason] = useState("");
  useEffect(() => { if (!isOpen) setReason(""); }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[30rem]">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Reason for Pause/End</h2>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Enter reason..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-6"
          rows={4}
          disabled={isLoading}
        />
        <div className="flex gap-3 justify-between">
          <Button onClick={() => { if (!reason.trim()) { toast.error("Please enter a reason"); return; } onEndIssue(reason, issueId); }} disabled={isLoading} className="!bg-red-600 !text-white rounded-md disabled:opacity-50">
            {isLoading ? "Submitting..." : "End Issue"}
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={() => { if (!reason.trim()) { toast.error("Please enter a reason"); return; } onSubmit(reason, issueId); }} disabled={isLoading} className="bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
              {isLoading ? "Submitting..." : "Pause Issue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const sprintIssueColumns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, draggable: false, defaultVisible: true },
  { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
  { key: "title", label: "Title", sortable: true, draggable: true, defaultVisible: true },
  { key: "project_name", label: "Project Name", sortable: true, draggable: true, defaultVisible: true },
  { key: "issue_type", label: "Type", sortable: true, draggable: true, defaultVisible: true },
  { key: "priority", label: "Priority", sortable: true, draggable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, draggable: true, defaultVisible: true },
  { key: "assigned_to", label: "Responsible Person", sortable: true, draggable: true, defaultVisible: true },
  { key: "raised_by", label: "Raised By", sortable: true, draggable: true, defaultVisible: true },
  { key: "start_date", label: "Start Date", sortable: true, draggable: true, defaultVisible: true },
  { key: "due_date", label: "End Date", sortable: true, draggable: true, defaultVisible: true },
  { key: "started_time", label: "Actual Efforts Taken", sortable: false, draggable: true, defaultVisible: true },
  { key: "comment", label: "Comment", sortable: true, draggable: true, defaultVisible: true },
];

const mapSprintIssueData = (issue: any) => ({
  id: issue.id?.toString() || "",
  project_name: issue.project_management_name || "Not Selected",
  milestone_name: issue.milstone_name,
  task_name: issue.task_management_name,
  sub_task_name: issue.sub_task_management_name,
  title: issue.title || "",
  description: issue.description || "",
  issue_type: issue.issue_type || "",
  priority: issue.priority || "",
  status: issue.status || "open",
  assigned_to: issue.responsible_person_id,
  raised_by: issue?.created_by?.name,
  start_date: issue.start_date ? new Date(issue.start_date).toLocaleDateString() : "",
  due_date: issue.end_date
    ? new Date(issue.end_date).toLocaleDateString()
    : issue.target_date ? new Date(issue.target_date).toLocaleDateString() : "",
  comment: Array.isArray(issue.comments) && issue.comments.length > 0
    ? issue.comments[issue.comments.length - 1]?.body || ""
    : "",
  is_started: issue.is_started || false,
  active_time_till_now: issue.active_time_till_now || null,
});

interface SprintIssueListProps {
  sprintId: string;
  initialMemberId?: number;
}

export default function SprintIssueList({
  sprintId,
  initialMemberId,
}: SprintIssueListProps) {
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();

  const [issues, setIssues] = useState<any[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [paginationData, setPaginationData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<any[]>([]);
  const [issueTypeOptions, setIssueTypeOptions] = useState<any[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState("");
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [pauseIssueId, setPauseIssueId] = useState<number | null>(null);
  const [isPauseLoading, setIsPauseLoading] = useState(false);
  const [issueSearchQuery, setIssueSearchQuery] = useState("");
  const [issueTempSearch, setIssueTempSearch] = useState("");
  const debounceTimerIssue = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRenderIssue = useRef(true);

  const fetchIssues = useCallback(async (filters = "", page = 1, search = "") => {
    setLoadingIssues(true);
    try {
      let qs = filters ? `${filters}&page=${page}` : `page=${page}`;
      if (search.trim()) qs += `&q[title_cont]=${encodeURIComponent(search.trim())}`;
      const r = await axios.get(
        `https://${baseUrl}/sprints/${sprintId}/sprint_issue_list.json?${qs}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const raw = r.data?.issues || r.data?.data?.issues || (Array.isArray(r.data) ? r.data : []);
      setIssues(Array.isArray(raw) ? raw.map(mapSprintIssueData) : []);
      setPaginationData(r.data?.pagination || r.data?.data?.pagination || null);
    } catch (e) {
      console.error("Error fetching sprint issues:", e);
    } finally {
      setLoadingIssues(false);
    }
  }, [sprintId, baseUrl, token]);

  useEffect(() => {
    if (!sprintId) return;
    if (initialMemberId != null) {
      const filterString = `q[responsible_person_id_in][]=${initialMemberId}`;
      setAppliedFilters(filterString);
      fetchIssues(filterString, 1, "");
    } else {
      fetchIssues("", 1, "");
    }
  }, [fetchIssues]);

  useEffect(() => {
    if (isFirstRenderIssue.current) { isFirstRenderIssue.current = false; return; }
    if (initialMemberId == null) return;
    const filterString = `q[responsible_person_id_in][]=${initialMemberId}`;
    setAppliedFilters(filterString);
    fetchIssues(filterString, 1, "");
  }, [initialMemberId]);

  useEffect(() => {
    if (debounceTimerIssue.current) clearTimeout(debounceTimerIssue.current);
    debounceTimerIssue.current = setTimeout(() => {
      setIssueSearchQuery(issueTempSearch);
      setCurrentPage(1);
      fetchIssues(appliedFilters, 1, issueTempSearch);
    }, 500);
    return () => { if (debounceTimerIssue.current) clearTimeout(debounceTimerIssue.current); };
  }, [issueTempSearch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const r = await axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(r.data?.users || []);
      } catch (e) { }
    };
    const fetchIssueTypes = async () => {
      try {
        const r = await axios.get(`https://${baseUrl}/issue_types.json`, { headers: { Authorization: `Bearer ${token}` } });
        setIssueTypeOptions((r.data || []).map((i: any) => ({ value: i.id, label: i.name })));
      } catch (e) { }
    };
    fetchUsers();
    fetchIssueTypes();
  }, [baseUrl, token]);

  const issueApiCall = async (id: string, data: object) => {
    await axios.put(`https://${baseUrl}/issues/${id}.json`, { issue: data }, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
    fetchIssues(appliedFilters, currentPage, issueSearchQuery);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page === currentPage || loadingIssues) return;
    if (paginationData && page > paginationData.total_pages) return;
    setCurrentPage(page);
    fetchIssues(appliedFilters, page, issueSearchQuery);
  };

  const handlePlayIssue = async (id: number) => {
    try {
      await issueApiCall(String(id), { status: "started" });
      toast.success("Issue started successfully");
    } catch { toast.error("Failed to start issue"); }
  };

  const handlePauseIssueSubmit = async (reason: string, iid: number) => {
    setIsPauseLoading(true);
    try {
      await issueApiCall(String(iid), { status: "stopped" });
      toast.success("Issue paused");
      setIsPauseModalOpen(false);
      setPauseIssueId(null);
    } catch { toast.error("Failed to pause issue"); } finally { setIsPauseLoading(false); }
  };

  const handleEndIssueSubmit = async (reason: string, iid: number) => {
    setIsPauseLoading(true);
    try {
      await issueApiCall(String(iid), { status: "completed" });
      toast.success("Issue ended");
      setIsPauseModalOpen(false);
      setPauseIssueId(null);
    } catch { toast.error("Failed to end issue"); } finally { setIsPauseLoading(false); }
  };

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === "actions") {
      return (
        <div className="flex items-center justify-center gap-2">
          <Button size="sm" variant="ghost" className="p-1" onClick={() => navigate(`/vas/issues/${item.id}`)} title="View Issue">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      );
    }
    if (columnKey === "title") {
      const isCompleted = item.status === "completed" || item.status === "closed";
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 w-[20rem]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild><span className="w-full truncate">{item.title}</span></TooltipTrigger>
                <TooltipContent className="rounded-[5px]"><p>{item.title}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {!isCompleted && (
              item.is_started ? (
                <button onClick={() => { setPauseIssueId(Number(item.id)); setIsPauseModalOpen(true); }} className="p-1 hover:bg-gray-200 rounded transition" title="Pause issue">
                  <Pause size={13} className="text-orange-500" />
                </button>
              ) : (
                <button onClick={() => handlePlayIssue(Number(item.id))} className="p-1 hover:bg-gray-200 rounded transition" title="Start issue">
                  <Play size={13} className="text-green-500" />
                </button>
              )
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {item.milestone_name && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{item.milestone_name}</span>}
            {item.task_name && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{item.task_name}</span>}
          </div>
        </div>
      );
    }
    if (columnKey === "started_time") {
      return <ActiveTimer activeTimeTillNow={item?.active_time_till_now} isStarted={item?.is_started} />;
    }
    if (columnKey === "priority") return item[columnKey];
    if (columnKey === "status") {
      return (
        <FormControl variant="standard" sx={{ width: 148 }}>
          <MuiSelect
            value={item.status || "open"}
            onChange={async e => { try { await issueApiCall(item.id, { status: e.target.value }); toast.success("Status updated"); } catch { toast.error("Failed to update"); } }}
            disableUnderline
            renderValue={v => (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className={`inline-block w-2 h-2 rounded-full ${ISSUE_STATUS_DOT[v as string] || "bg-gray-500"}`} />
                <span>{ISSUE_STATUS_OPTIONS.find(o => o.value === v)?.label || v}</span>
              </div>
            )}
            sx={{ fontSize: "0.875rem", "& .MuiSelect-select": { padding: "4px 0" } }}
          >
            {ISSUE_STATUS_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span className={`inline-block w-2 h-2 rounded-full ${ISSUE_STATUS_DOT[opt.value] || "bg-gray-500"}`} />
                <span>{opt.label}</span>
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
      );
    }
    if (columnKey === "issue_type") {
      return (
        <FormControl variant="standard" sx={{ width: 128 }}>
          <MuiSelect
            value={item.issue_type || ""}
            onChange={async e => { try { await issueApiCall(item.id, { issue_type: e.target.value }); toast.success("Type updated"); } catch { toast.error("Failed to update"); } }}
            disableUnderline
            sx={{ fontSize: "0.875rem", "& .MuiSelect-select": { padding: "4px 0" } }}
          >
            {issueTypeOptions.map((opt: any) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </MuiSelect>
        </FormControl>
      );
    }
    if (columnKey === "assigned_to") {
      return (
        <FormControl variant="standard" sx={{ width: 188 }}>
          <MuiSelect
            value={item.assigned_to || ""}
            onChange={async e => { try { await issueApiCall(item.id, { responsible_person_id: e.target.value }); toast.success("Assignee updated"); } catch { toast.error("Failed to update"); } }}
            disableUnderline
            sx={{ fontSize: "0.875rem", "& .MuiSelect-select": { padding: "4px 0" } }}
          >
            {users.map((u: any) => <MenuItem key={u.id} value={u.id}>{u.full_name}</MenuItem>)}
          </MuiSelect>
        </FormControl>
      );
    }
    if (columnKey === "comment") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">{item.comment || "No comment"}</div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[20rem] rounded-[5px] text-wrap"><p className="mx-2">{item.comment || "No comment"}</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return item[columnKey];
  };

  if (loadingIssues && !issues.length) {
    return (
      <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading sprint issues</span>
      </div>
    );
  }

  return (
    <>
      <EnhancedTable
        data={issues}
        columns={sprintIssueColumns}
        renderCell={renderCell}
        loading={loadingIssues}
        searchValue={issueTempSearch}
        onSearchChange={(val: string) => setIssueTempSearch(val)}
        onFilterClick={() => setIsFilterModalOpen(true)}
        leftActions={
          <div className="flex items-center gap-2 px-4 py-1 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-gray-700 font-medium text-sm">Total Issues:</span>
            <span className="text-lg font-bold text-[#C72030]">{paginationData?.total_count || 0}</span>
          </div>
        }
      />

      {paginationData && paginationData.total_pages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 || loadingIssues ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {(() => {
                const totalPages = paginationData.total_pages;
                const pagesToShow = new Set<number>([1, totalPages, currentPage]);
                if (currentPage > 1) pagesToShow.add(currentPage - 1);
                if (currentPage < totalPages) pagesToShow.add(currentPage + 1);
                if (totalPages > 7) { pagesToShow.add(2); pagesToShow.add(totalPages - 1); }
                const sorted = Array.from(pagesToShow).sort((a, b) => a - b);
                const items: React.ReactNode[] = [];
                sorted.forEach((page, idx) => {
                  if (idx > 0 && sorted[idx - 1] < page - 1) {
                    items.push(<PaginationItem key={`e${sorted[idx - 1]}`}><PaginationEllipsis /></PaginationItem>);
                  }
                  items.push(
                    <PaginationItem key={page}>
                      <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page} className="cursor-pointer">{page}</PaginationLink>
                    </PaginationItem>
                  );
                });
                return items;
              })()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(paginationData.total_pages, currentPage + 1))}
                  className={currentPage === paginationData.total_pages || loadingIssues ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <IssueFilterModal
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
        onApplyFilters={(filterString: string) => {
          setAppliedFilters(filterString);
          setCurrentPage(1);
          fetchIssues(filterString, 1, issueSearchQuery);
        }}
        issueTypes={issueTypeOptions}
        users={users}
        projects={[]}
      />

      <SprintIssuePauseModal
        isOpen={isPauseModalOpen}
        onClose={() => { setIsPauseModalOpen(false); setPauseIssueId(null); }}
        onSubmit={handlePauseIssueSubmit}
        onEndIssue={handleEndIssueSubmit}
        isLoading={isPauseLoading}
        issueId={pauseIssueId}
      />
    </>
  );
}
