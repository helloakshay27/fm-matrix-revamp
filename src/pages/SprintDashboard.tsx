import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import { ChartNoAxesColumn, ChevronDown, Eye, List, LogOut, Plus } from "lucide-react";
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

// Define a Sprint type for better type safety
interface Sprint {
  id: string;
  // API sometimes returns `name` instead of `title`, keep both for compatibility
  name?: string;
  title: string;
  status: string;
  sprint_owner: string;
  start_date: string;
  end_date: string;
  duration: string;
  priority: string;
  number_of_projects: number;
  _raw: unknown; // Replace `any` with `unknown` for better type safety
}

// Define a type guard to safely access properties on `_raw`
const isSprintRaw = (raw: unknown): raw is { name?: string; owner_name?: string; sprint_owner_name?: string; project_count?: number; associated_projects_count?: number } => {
  return typeof raw === "object" && raw !== null;
};

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

// Fix transform to read API fields directly
const transformedSprints = (sprints: any[]) => {
  return sprints.map((item) => {
    return {
      id: String(item.id ?? ""),
      title: item.title ?? item.name ?? "",
      status: (item.status ?? "").charAt(0).toUpperCase() + (item.status ?? "").slice(1),
      sprint_owner: item.sprint_owner_name ?? "-",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      duration: item.duration ?? "",
      priority: item.priority ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1) : "",
      number_of_projects: item.associated_projects_count ?? item.project_count ?? 0,
    } as Sprint;
  });
};

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
]

export const SprintDashboard = () => {
  const { setCurrentSection } = useLayout();

  const view = localStorage.getItem("selectedView");

  useEffect(() => {
    setCurrentSection(view === "admin" ? "Value Added Services" : "Project Task");
  }, [setCurrentSection]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";

  // Redux state selectors
  const { data: sprintsData, loading: fetchLoading } = useSelector(
    (state: RootState) => state.fetchSprints
  );
  const { loading: createLoading } = useSelector(
    (state: RootState) => state.createSprint
  );
  const { loading: updateLoading } = useSelector(
    (state: RootState) => state.updateSprint
  );

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("List");
  const [addSprintModalOpen, setAddSprintModalOpen] = useState(false);
  const [owners, setOwners] = useState([]);

  // Wrap `getOwners` in `useCallback` to stabilize its reference
  const getOwners = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOwners(response.data.users);
    } catch (error) {
      handleError(error);
    }
  }, [baseUrl, token]);

  // Add missing dependencies to useEffect hooks
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSprints({ token, baseUrl })).unwrap();
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, [dispatch, token, baseUrl]);



  useEffect(() => {
    getOwners();
  }, [getOwners]);

  const fetchData = useCallback(async () => {
    try {
      const response = await dispatch(fetchSprints({ token, baseUrl })).unwrap();
      setSprints(transformedSprints(response));
    } catch (error) {
      console.error(error);
      toast.error(error || "Failed to fetch sprints");
    }
  }, [dispatch, token, baseUrl]);

  useEffect(() => {
    fetchData();
  }, [dispatch, token, baseUrl]);

  useEffect(() => {
    if (sprintsData && Array.isArray(sprintsData)) {
      setSprints(transformedSprints(sprintsData));
    }
  }, [sprintsData]);

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
      fetchData();
      setAddSprintModalOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error || "Failed to create sprint");
    }
  };

  const handleUpdateSprint = async (id: string, data: Partial<Sprint>) => {
    try {
      const payload = {
        sprint: data,
      };
      await dispatch(
        updateSprint({ token, baseUrl, id, data: payload })
      ).unwrap();
      toast.success("Sprint updated successfully");
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error(error || "Failed to update sprint");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const payload = {
        status: newStatus.toLowerCase(),
      };
      await dispatch(
        updateSprintStatus({ token, baseUrl, id, data: payload })
      ).unwrap();
      toast.success("Sprint status updated successfully");
      fetchData();
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
        return item.number_of_projects > 0 ? item.number_of_projects : "-"; // Ensure proper rendering of the value
      case "status": {
        const statusColorMap = {
          open: { dot: "bg-blue-500" },
          in_progress: { dot: "bg-amber-500" },
          on_hold: { dot: "bg-gray-500" },
          completed: { dot: "bg-teal-500" },
          overdue: { dot: "bg-red-500" },
        };

        const colors = statusColorMap[item.status as keyof typeof statusColorMap] || statusColorMap.open;

        return <FormControl
          variant="standard"
          sx={{ width: 148 }} // same as w-32
        >
          <Select
            value={item.status}
            onChange={(e) =>
              handleStatusChange(item.id, e.target.value as string)
            }
            // disabled
            disableUnderline
            renderValue={(value) => (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className={`inline-block w-2 h-2 rounded-full ${colors.dot}`}></span>
                <span>{statusOptions.find(opt => opt.value === value)?.label || value}</span>
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
              // "&.Mui-disabled": {
              //     color: "#000",
              // },
              // // For the selected value text
              // "&.Mui-disabled .MuiSelect-select": {
              //     color: "#000",
              //     WebkitTextFillColor: "#000",
              // },
            }}
          >
            {statusOptions.map((opt) => {
              const optColors = statusColorMap[opt.value as keyof typeof statusColorMap];
              return (
                <MenuItem key={opt.value} value={opt.value} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className={`inline-block w-2 h-2 rounded-full ${optColors?.dot || "bg-gray-500"}`}></span>
                  <span>{opt.label}</span>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
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
        return item[columnKey] || "-";
    }
  };

  const leftActions = (
    <>
      <Button
        className="bg-[#C72030] hover:bg-[#A01020] text-white"
        onClick={() => setAddSprintModalOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
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
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="stopped">Stopped</MenuItem>
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

      {/* Add Sprint Modal */}
      <AddSprintModal
        openDialog={addSprintModalOpen}
        handleCloseDialog={() => setAddSprintModalOpen(false)}
        owners={owners}
        onSubmit={(data) => {
          handleSubmit(data);
        }}
      />
    </div>
  );
};

// Ensure `handleError` is defined before its usage
const handleError = (error: unknown) => {
  console.error("An error occurred:", error);
};