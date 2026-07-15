import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import {
  ChartNoAxesColumn,
  ChevronDown,
  Eye,
  List,
  LogOut,
  Plus,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AddSprintModal from "@/components/AddSprintModal";
import { useLayout } from "@/contexts/LayoutContext";
import { CountdownTimer } from "@/components/Sprints/CountdownTimer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchSprints,
  createSprint,
  updateSprint,
  updateSprintStatus,
} from "@/store/slices/sprintSlice";
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Sprint {
  id: string;
  name?: string;
  title: string;
  status: string;
  sprint_owner: string;
  start_date: string;
  end_date: string;
  duration: string;
  priority: string;
  number_of_projects: number;
}

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "Sprint Id",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "title",
    label: "Sprint Title",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "sprint_owner",
    label: "Sprint Owner",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "start_date",
    label: "Start Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "end_date",
    label: "End Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "duration",
    label: "Duration",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "priority",
    label: "Priority",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "number_of_projects",
    label: "Number Of Projects",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

const transformedSprints = (sprints: any[]): Sprint[] =>
  sprints.map((item) => ({
    id: String(item.id ?? ""),
    title: item.title ?? item.name ?? "",
    status:
      (item.status ?? "").charAt(0).toUpperCase() +
      (item.status ?? "").slice(1),
    sprint_owner: item.sprint_owner_name ?? "-",
    start_date: item.start_date ?? "",
    end_date: item.end_date ?? "",
    duration: item.duration ?? "",
    priority: item.priority
      ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1)
      : "",
    number_of_projects:
      item.associated_projects_count ?? item.project_count ?? 0,
  }));

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
];

const statusColorMap: Record<string, { dot: string }> = {
  open: { dot: "#3b82f6" },
  in_progress: { dot: "#f59e0b" },
  on_hold: { dot: "#6b7280" },
  completed: { dot: "#14b8a6" },
  overdue: { dot: "#ef4444" },
  started: { dot: "#22c55e" },
  stopped: { dot: "#f87171" },
};

const statusLabelMap: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  on_hold: "On Hold",
  completed: "Completed",
  overdue: "Overdue",
  started: "Started",
  stopped: "Stopped",
};

export const SprintDashboard = () => {
  const { setCurrentSection } = useLayout();
  const view = localStorage.getItem("selectedView");

  useEffect(() => {
    setCurrentSection(
      view === "admin" ? "Value Added Services" : "Project Task"
    );
  }, [setCurrentSection]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";

  const { loading: fetchLoading } = useSelector(
    (state: RootState) => state.fetchSprints
  );
  const { loading: createLoading } = useSelector(
    (state: RootState) => state.createSprint
  );
  const { loading: updateLoading } = useSelector(
    (state: RootState) => state.updateSprint
  );

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("List");
  const [addSprintModalOpen, setAddSprintModalOpen] = useState(false);
  const [owners, setOwners] = useState([]);

  const getOwners = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOwners(response.data.users);
    } catch (error) {
      handleError(error);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    getOwners();
  }, [getOwners]);

  const fetchData = useCallback(
    async (page = 1) => {
      try {
        const response = await dispatch(
          fetchSprints({ token, baseUrl, page })
        ).unwrap();
        const sprintList = Array.isArray(response)
          ? response
          : (response.sprints ?? []);
        setSprints(transformedSprints(sprintList));
        if (response.pagination) {
          setPagination({
            current_page: response.pagination.current_page,
            total_count: response.pagination.total_count,
            total_pages: response.pagination.total_pages,
          });
        }
      } catch (error) {
        console.error(error);
        toast.error((error as string) || "Failed to fetch sprints");
      }
    },
    [dispatch, token, baseUrl]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handlePageChange = async (page: number) => {
    if (
      page < 1 ||
      page > pagination.total_pages ||
      page === pagination.current_page ||
      fetchLoading
    )
      return;
    setPagination((prev) => ({ ...prev, current_page: page }));
    await fetchData(page);
  };

  const handleSubmit = async (data: Sprint) => {
    try {
      const payload = {
        sprint: {
          title: data.title,
          owner_id: data.sprint_owner,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status,
          priority: data.priority,
        },
      };
      await dispatch(createSprint({ token, baseUrl, data: payload })).unwrap();
      toast.success("Sprint created successfully");
      fetchData(pagination.current_page);
      setAddSprintModalOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error || "Failed to create sprint");
    }
  };

  const handleUpdateSprint = async (id: string, data: Partial<Sprint>) => {
    try {
      await dispatch(
        updateSprint({ token, baseUrl, id, data: { sprint: data } })
      ).unwrap();
      toast.success("Sprint updated successfully");
      fetchData(pagination.current_page);
    } catch (error: any) {
      console.error(error);
      toast.error(error || "Failed to update sprint");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await dispatch(
        updateSprintStatus({
          token,
          baseUrl,
          id,
          data: { status: newStatus.toLowerCase() },
        })
      ).unwrap();
      toast.success("Sprint status updated successfully");
      fetchData(pagination.current_page);
    } catch (error: any) {
      console.error(error);
      toast.error(error || "Failed to update sprint status");
    }
  };

  const renderActions = (item: any) => (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/vas/sprint/details/${item.id}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/vas/sprint/${item.id}`)}
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderCell = (item: Sprint, columnKey: string) => {
    switch (columnKey) {
      case "number_of_projects":
        return item.number_of_projects > 0 ? item.number_of_projects : "-";
      case "status": {
        const rawStatus = (item.status ?? "").toLowerCase();
        const colors = statusColorMap[rawStatus] ?? { dot: "#9ca3af" };
        return (
          <FormControl variant="standard" sx={{ width: 148 }}>
            <Select
              value={rawStatus}
              onChange={(e) =>
                handleStatusChange(item.id, e.target.value as string)
              }
              disableUnderline
              renderValue={(value) => (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: statusColorMap[value as string]?.dot ?? "#9ca3af" }}
                  />
                  <span>
                    {statusLabelMap[value as string] ?? value}
                  </span>
                </div>
              )}
              sx={{
                fontSize: "0.875rem",
                cursor: "pointer",
                "& .MuiSelect-select": {
                  padding: "4px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                },
              }}
            >
              {statusOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: statusColorMap[opt.value]?.dot ?? "#6b7280" }}
                  />
                  <span>{opt.label}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
      case "duration":
        if (item.start_date && item.end_date) {
          return (
            <CountdownTimer
              startDate={item.start_date}
              targetDate={item.end_date}
            />
          );
        }
        return "-";
      default:
        return item[columnKey as keyof Sprint] || "-";
    }
  };

  const leftActions = (
    <Button
      className="bg-[#C72030] hover:bg-[#A01020] text-white"
      onClick={() => setAddSprintModalOpen(true)}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  );

  const renderEditableCell = (columnKey: string, value: any, onChange: any) => {
    if (columnKey === "status") {
      return (
        <Select
          value={value?.toLowerCase() || ""}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">
            <em>Select status</em>
          </MenuItem>
          {statusOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      );
    }
    if (columnKey === "start_date" || columnKey === "end_date") {
      return (
        <TextField
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        />
      );
    }
    if (columnKey === "priority") {
      return (
        <Select
          value={value?.toLowerCase() || ""}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">
            <em>Select priority</em>
          </MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </Select>
      );
    }
    if (columnKey === "title") {
      return (
        <TextField
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
        />
      );
    }
    return null;
  };

  const rightActions = (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
      >
        <span className="text-red-600 font-medium flex items-center gap-2">
          {selectedView === "Kanban" ? (
            <ChartNoAxesColumn className="w-4 h-4 rotate-180 text-red-600" />
          ) : (
            <List className="w-4 h-4 text-red-600" />
          )}
          {selectedView}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
          <div className="py-2">
            <button
              onClick={() => {
                setSelectedView("Kanban");
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              <div className="w-4 flex justify-center">
                <ChartNoAxesColumn className="rotate-180 text-[#C72030]" />
              </div>
              <span className="text-gray-700">Kanban</span>
            </button>
            <button
              onClick={() => {
                setSelectedView("List");
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              <div className="w-4 flex justify-center">
                <List className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-gray-700">List</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const isLoading = fetchLoading || createLoading || updateLoading;

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) return null;
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            aria-disabled={isLoading}
            className={isLoading ? "pointer-events-none opacity-50" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="e1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={isLoading}
                className={isLoading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={isLoading}
                className={isLoading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="e2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  aria-disabled={isLoading}
                  className={isLoading ? "pointer-events-none opacity-50" : ""}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              aria-disabled={isLoading}
              className={isLoading ? "pointer-events-none opacity-50" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              aria-disabled={isLoading}
              className={isLoading ? "pointer-events-none opacity-50" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="p-6">
      <EnhancedTable
        data={sprints}
        columns={columns}
        renderActions={renderActions}
        renderCell={renderCell}
        leftActions={leftActions}
        rightActions={rightActions}
        storageKey="sprint-table"
        onFilterClick={() => { }}
        loading={isLoading}
      />

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.current_page - 1))
                }
                className={
                  pagination.current_page === 1 || isLoading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(
                    Math.min(
                      pagination.total_pages,
                      pagination.current_page + 1
                    )
                  )
                }
                className={
                  pagination.current_page === pagination.total_pages ||
                    isLoading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <AddSprintModal
        openDialog={addSprintModalOpen}
        handleCloseDialog={() => setAddSprintModalOpen(false)}
        owners={owners}
        onSubmit={(data) => handleSubmit(data)}
      />
    </div>
  );
};

const handleError = (error: unknown) => {
  console.error("An error occurred:", error);
};
