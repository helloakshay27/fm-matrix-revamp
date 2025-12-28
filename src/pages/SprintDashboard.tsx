import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { MenuItem, Select, TextField } from "@mui/material";
import {
  ChartNoAxesColumn,
  ChevronDown,
  Eye,
  List,
  Plus,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { cache } from "@/utils/cacheUtils";
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

const transformedSprints = (sprints: any[]) => {
  return sprints.map((sprint: any) => {
    return {
      id: sprint.id,
      title: sprint.title || sprint.name,
      status: sprint.status
        ? sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)
        : "",
      sprint_owner: sprint.sprint_owner || sprint.owner_name || sprint.sprint_owner_name || "-",
      start_date: sprint.start_date,
      end_date: sprint.end_date,
      duration: sprint.duration || "",
      priority: sprint.priority
        ? sprint.priority.charAt(0).toUpperCase() + sprint.priority.slice(1)
        : "",
      number_of_projects: sprint.number_of_projects || sprint.project_count || sprint.associated_projects_count || 0,
      // Keep raw data for updates
      _raw: sprint,
    };
  });
};

export const SprintDashboard = () => {
  const { setCurrentSection } = useLayout();

  useEffect(() => {
    setCurrentSection("Project Task");
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

  const [sprints, setSprints] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("List");
  const [addSprintModalOpen, setAddSprintModalOpen] = useState(false);
  const [owners, setOwners] = useState([])

  const getOwners = async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Asset`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setOwners(response.data.users);
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  useEffect(() => {
    getOwners()
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const cachedResult = await cache.getOrFetch(
        'sprints_list',
        async () => {
          // TODO: Replace with actual sprint API call when available
          // const response = await dispatch(fetchSprints({ token, baseUrl })).unwrap();
          // return transformedSprints(response);

          // Mock data for now
          return [
            {
              id: "S-78",
              title: "test 333",
              status: "Active",
              sprint_owner: "Test User Name",
              start_date: "2025-11-04",
              end_date: "2025-11-04",
              duration: "0w:0d:00h:00m:00s",
              priority: "Medium",
              number_of_projects: 3,
            },
          ];
        },
        2 * 60 * 1000, // Fresh for 2 minutes
        10 * 60 * 1000 // Stale up to 10 minutes
      );
      setSprints(cachedResult.data);
    } catch (error) {
      console.log(error);
      toast.error(error || "Failed to fetch sprints");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [dispatch, token, baseUrl]);

  useEffect(() => {
    if (sprintsData && Array.isArray(sprintsData)) {
      setSprints(transformedSprints(sprintsData));
    }
  }, [sprintsData]);

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        sprint: {
          title: data.sprint?.title || data.title,
          owner_id: data.sprint?.owner_id || data.sprint_owner,
          start_date: data.sprint?.start_date || data.start_date,
          end_date: data.sprint?.end_date || data.end_date,
          status: data.sprint?.status || data.status || "active",
          priority: data.sprint?.priority || data.priority,
        },
      };

      await dispatch(createSprint({ token, baseUrl, data: payload })).unwrap();
      toast.success("Sprint created successfully");
      fetchData();
      setAddSprintModalOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error || "Failed to create sprint");
    }
  };

  const handleUpdateSprint = async (id: string, data: any) => {
    try {
      const payload = {
        sprint: data,
      };
      await dispatch(updateSprint({ token, baseUrl, id, data: payload })).unwrap();
      toast.success("Sprint updated successfully");
      fetchData();
    } catch (error: any) {
      console.log(error);
      toast.error(error || "Failed to update sprint");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const payload = {
        status: newStatus.toLowerCase(),
      };
      await dispatch(updateSprintStatus({ token, baseUrl, id, data: payload })).unwrap();
      toast.success("Sprint status updated successfully");
      fetchData();
    } catch (error: any) {
      console.log(error);
      toast.error(error || "Failed to update sprint status");
    }
  };

  const renderActions = (item: any) => (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/maintenance/sprint/details/${item.id}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "status":
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === "Active"
              ? "bg-green-100 text-green-800"
              : item.status === "Completed"
                ? "bg-blue-100 text-blue-800"
                : item.status === "In_progress"
                  ? "bg-yellow-100 text-yellow-800"
                  : item.status === "Stopped"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status === "Active"
                ? "bg-green-500"
                : item.status === "Completed"
                  ? "bg-blue-500"
                  : item.status === "In_progress"
                    ? "bg-yellow-500"
                    : item.status === "Stopped"
                      ? "bg-red-500"
                      : "bg-gray-500"
                }`}
            ></span>
            {item.status}
          </span>
        );
      case "duration":
        if (item.start_date && item.end_date) {
          return <CountdownTimer startDate={item.start_date} targetDate={item.end_date} />;
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
        canAddRow={true}
        readonlyColumns={["id", "duration", "number_of_projects"]}
        onAddRow={(newRowData) => {
          handleSubmit(newRowData);
        }}
        renderEditableCell={renderEditableCell}
        newRowPlaceholder="Click to add new sprint"
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
