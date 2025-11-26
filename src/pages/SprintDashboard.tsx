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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AddSprintModal from "@/components/AddSprintModal";

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

const transformedSprints = (sprints: any) => {
  return sprints.map((sprint: any) => {
    // Calculate duration
    let duration = "-";
    if (sprint.start_date && sprint.end_date) {
      const start = new Date(sprint.start_date);
      const end = new Date(sprint.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      
      duration = `${weeks}w:${days}d:${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`;
    }

    return {
      id: sprint.id,
      title: sprint.title,
      status: sprint.status
        ? sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)
        : "",
      sprint_owner: sprint.sprint_owner || sprint.owner_name || "-",
      start_date: sprint.start_date,
      end_date: sprint.end_date,
      duration: duration,
      priority: sprint.priority
        ? sprint.priority.charAt(0).toUpperCase() + sprint.priority.slice(1)
        : "",
      number_of_projects: sprint.number_of_projects || sprint.project_count || 0,
    };
  });
};

export const SprintDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [sprints, setSprints] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("List");
  const [addSprintModalOpen, setAddSprintModalOpen] = useState(false);

  // Mock owners data - TODO: Replace with actual API call
  const mockOwners = [
    { id: "1", full_name: "Test User Name" },
    { id: "2", full_name: "Sadanand Gupta" },
    { id: "3", full_name: "Ubaid Hashmat" },
    { id: "4", full_name: "Akshay" },
    { id: "5", full_name: "Yadav" },
  ];

  const fetchData = async () => {
    try {
      // TODO: Replace with actual sprint API call when available
      // const response = await dispatch(fetchSprints({ token, baseUrl })).unwrap();
      // setSprints(transformedSprints(response));
      
      // Mock data for now
      setSprints([
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
      ]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch sprints");
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, token, baseUrl]);

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Replace with actual create sprint API call
      // const payload = {
      //   sprint: {
      //     title: data.title,
      //     start_date: data.start_date,
      //     end_date: data.end_date,
      //     status: data.status || "active",
      //     sprint_owner: data.sprint_owner,
      //     priority: data.priority,
      //   },
      // };
      // await dispatch(createSprint({ token, baseUrl, data: payload })).unwrap();
      toast.success("Sprint created successfully");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create sprint");
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
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              item.status === "Active"
                ? "bg-green-100 text-green-800"
                : item.status === "Completed"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                item.status === "Active"
                  ? "bg-green-500"
                  : item.status === "Completed"
                  ? "bg-blue-500"
                  : "bg-gray-500"
              }`}
            ></span>
            {item.status}
          </span>
        );
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
          value={value || ""}
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
          <MenuItem value="on_hold">On Hold</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
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
          value={value || ""}
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
        onFilterClick={() => {}}
        canAddRow={true}
        readonlyColumns={["id", "duration", "number_of_projects"]}
        onAddRow={(newRowData) => {
          handleSubmit(newRowData);
        }}
        renderEditableCell={renderEditableCell}
        newRowPlaceholder="Click to add new sprint"
      />

      {/* Add Sprint Modal */}
      <AddSprintModal
        openDialog={addSprintModalOpen}
        handleCloseDialog={() => setAddSprintModalOpen(false)}
        owners={mockOwners}
        onSubmit={(data) => {
          handleSubmit(data);
        }}
      />
    </div>
  );
};
