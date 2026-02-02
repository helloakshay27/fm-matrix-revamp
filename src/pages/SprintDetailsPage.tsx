import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronDownCircle, Eye, ScrollText, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useLayout } from "@/contexts/LayoutContext";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchSprintById } from "@/store/slices/sprintSlice";

interface SprintDetails {
  id?: string | number;
  title?: string;
  created_by_name?: string; // align naming to milestone page
  created_at?: string;
  status?: string;
  responsible_person?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
}

interface Task {
  task_title?: string;
  status?: string;
  responsible_person?: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
  priority?: string;
}

const taskColumns: ColumnConfig[] = [
  { key: "task_title", label: "Task Title", sortable: true, draggable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, draggable: true, defaultVisible: true },
  { key: "responsible_person", label: "Responsible Person", sortable: true, draggable: true, defaultVisible: true },
  { key: "start_date", label: "Start Date", sortable: true, draggable: true, defaultVisible: true },
  { key: "end_date", label: "End Date", sortable: true, draggable: true, defaultVisible: true },
  { key: "duration", label: "Duration", sortable: true, draggable: true, defaultVisible: true },
  { key: "priority", label: "Priority", sortable: true, draggable: true, defaultVisible: true },
];

function formatToDDMMYYYY_AMPM(dateString: string | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, "0");
  return `${day}/${month}/${year} ${hoursStr}:${minutes} ${ampm}`;
}

const calculateDuration = (start?: string, end?: string) => {
  if (!start || !end) return "";
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  endDate.setHours(23, 59, 59, 999);
  if (now < startDate) return "Not started";
  const diffMs = endDate.getTime() - now.getTime();
  if (diffMs <= 0) return "0s";
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  return `${days > 0 ? days + "d " : ""}${remainingHours > 0 ? remainingHours + "h " : ""}${remainingMinutes > 0 ? remainingMinutes + "m" : ""}`;
};

const CountdownTimer = ({ startDate, targetDate }: { startDate?: string; targetDate?: string }) => {
  const [countdown, setCountdown] = useState(calculateDuration(startDate, targetDate));
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateDuration(startDate, targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, startDate]);
  return <div className="text-left text-[#029464] text-[12px]">{countdown}</div>;
};

// Define API shapes based on backend response
interface ApiSprintTask {
  id: number;
  sprint_id?: number;
  task_id?: number;
  created_at?: string;
  status?: string;
  title?: string;
  name?: string;
  responsible_person?: string;
  owner_name?: string;
  start_date?: string;
  end_date?: string;
  duration?: string | null;
  priority?: string | null;
}

interface ApiSprint {
  id: number;
  name?: string;
  title?: string;
  description?: string | null;
  project_id?: number;
  duration?: string | null;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  owner_id?: number | null;
  sprint_owner_name?: string | null;
  status?: string; // e.g., "open"
  priority?: string | null;
  created_at?: string;
  updated_at?: string;
  associated_projects_count?: number;
  sprint_tasks?: ApiSprintTask[];
}

// Normalize raw status to display value
const mapStatusToDisplay = (raw?: string) => {
  if (!raw) return "Open";
  const m: Record<string, string> = {
    open: "Open",
    in_progress: "In Progress",
    on_hold: "On Hold",
    overdue: "Overdue",
    completed: "Completed",
    active: "Active",
  };
  return m[raw.toLowerCase()] ?? raw;
};

const STATUS_COLORS = {
  active: "bg-[#E4636A] text-white",
  in_progress: "bg-[#08AEEA] text-white",
  on_hold: "bg-[#7BD2B5] text-black",
  overdue: "bg-[#FF2733] text-white",
  completed: "bg-[#83D17A] text-black",
};

const mapDisplayToApiStatus = (displayStatus) => {
  const reverseStatusMap = {
    Active: "active",
    "In Progress": "in_progress",
    "On Hold": "on_hold",
    Overdue: "overdue",
    Completed: "completed",
  };
  return reverseStatusMap[displayStatus] || "open";
};

const dropdownOptions = [
  "Open",
  "In Progress",
  "On Hold",
  "Overdue",
  "Completed",
];

// Map API sprint -> local details type
const mapApiToDetails = (api: ApiSprint): SprintDetails => ({
  id: api.id,
  title: api.title ?? api.name,
  created_by_name: undefined, // field not present in sprint response
  created_at: api.created_at,
  status: mapStatusToDisplay(api.status),
  responsible_person: api.sprint_owner_name ?? "-",
  priority: api.priority ?? "-",
  start_date: api.start_date,
  end_date: api.end_date,
});

// Map API sprint_tasks -> table rows
const mapApiTasks = (api: ApiSprint): Task[] => {
  const list = api.sprint_tasks ?? [];
  return list.map((t) => ({
    task_title: t.title ?? t.name ?? `Task #${t.task_id ?? t.id}`,
    status: mapStatusToDisplay(t.status),
    responsible_person: t.responsible_person ?? t.owner_name ?? "-",
    start_date: t.start_date ?? "",
    end_date: t.end_date ?? "",
    duration: t.duration ?? "",
    priority: t.priority ?? "",
  }));
};

export const SprintDetailsPage = () => {
  const { setCurrentSection } = useLayout();
  useEffect(() => {
    setCurrentSection("Project Task");
  }, [setCurrentSection]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";

  const [sprintDetails, setSprintDetails] = useState<SprintDetails>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Open");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const resp = (await dispatch(fetchSprintById({ token, baseUrl, id })).unwrap()) as ApiSprint;
      setSprintDetails(mapApiToDetails(resp));
      setTasks(mapApiTasks(resp));
    } catch (error) {
      toast.error(String(error) || "Failed to fetch sprint details");
    }
  }, [id, dispatch, token, baseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    setOpenDropdown(false);

    // await dispatch(
    //   updateTaskStatus({
    //     baseUrl,
    //     token,
    //     id: taskId,
    //     data: {
    //       status: mapDisplayToApiStatus(option),
    //     },
    //   })
    // ).unwrap();
    fetchData();
    toast.dismiss();
    toast.success("Status updated successfully");
  };

  const renderTaskCell = (item: Task, columnKey: string) => item[columnKey as keyof Task] ?? "-";

  return (
    <div className="m-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="py-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="px-4 pt-1">
        {/* Title */}
        <h2 className="text-[15px] p-3 px-0">
          <span className="mr-3">S-{sprintDetails.id}</span>
          <span>{sprintDetails.title}</span>
        </h2>
        <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

        {/* Header Info & Dropdown (visual only to match image) */}
        <div className="flex items-center justify-between my-3 text-[12px]">
          <div className="flex items-center gap-3 text-[#323232] flex-wrap">
            <span>Created By: {sprintDetails.created_by_name}</span>
            <span className="h-6 w-[1px] border border-gray-300"></span>
            <span className="flex items-center gap-3">
              Created On: {formatToDDMMYYYY_AMPM(sprintDetails.created_at)}
            </span>
            <span className="h-6 w-[1px] border border-gray-300"></span>

            {/* Dropdown */}
            <span
              className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm ${STATUS_COLORS[mapDisplayToApiStatus(selectedOption).toLowerCase()] || "bg-gray-400 text-white"}`}
            >
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center gap-1 cursor-pointer px-2 py-1"
                  onClick={() => setOpenDropdown(!openDropdown)}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown}
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setOpenDropdown(!openDropdown)
                  }
                >
                  <span className="text-[13px]">{selectedOption}</span>
                  <ChevronDown
                    size={15}
                    className={`${openDropdown ? "rotate-180" : ""
                      } transition-transform`}
                  />
                </div>
                <ul
                  className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? "block" : "hidden"
                    }`}
                  role="menu"
                  style={{
                    minWidth: "150px",
                    maxHeight: "400px",
                    overflowY: "auto",
                    zIndex: 1000,
                  }}
                >
                  {dropdownOptions.map((option, idx) => (
                    <li key={idx} role="menuitem">
                      <button
                        className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option
                          ? "bg-gray-100 font-semibold"
                          : ""
                          }`}
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </span>
          </div>
        </div>

        <div className="border-b-[3px] border-grey my-3"></div>

        {/* Details Section (matches card style) */}
        <div className="border rounded-[10px] shadow-md p-5 mb-4">
          <div className="font-[600] text-[16px] flex items-center gap-4">
            <ChevronDownCircle color="#E95420" size={30} />
            Details
          </div>
          <div className="mt-3">
            {/* Rows styled like milestone */}
            <div className="flex items-center gap-3 ml-10">
              <span className="text-[13px] font-medium text-[#1A1A1A]">Responsible Person:</span>
              <span className="text-[13px] text-[#1A1A1A]">{sprintDetails.responsible_person || "-"}</span>
            </div>
            <span className="border h-[1px] inline-block w-full my-4"></span>
            <div className="flex items-center gap-3 ml-10">
              <span className="text-[13px] font-medium text-[#1A1A1A]">Priority:</span>
              <span className="text-[13px] text-[#1A1A1A]">{sprintDetails.priority || "-"}</span>
            </div>
            <span className="border h-[1px] inline-block w-full my-4"></span>
            <div className="flex items-center gap-3 ml-10">
              <span className="text-[13px] font-medium text-[#1A1A1A]">Start Date:</span>
              <span className="text-[13px] text-[#1A1A1A]">{sprintDetails.start_date || "-"}</span>
            </div>
            <span className="border h-[1px] inline-block w-full my-4"></span>
            <div className="flex items-center gap-3 ml-10">
              <span className="text-[13px] font-medium text-[#1A1A1A]">End Date:</span>
              <span className="text-[13px] text-[#1A1A1A]">{sprintDetails.end_date || "-"}</span>
            </div>
          </div>
        </div>

        {/* Tasks Section header + table */}
        <div>
          <div className="flex items-center justify-between my-3">
            <div className="flex items-center gap-10">
              <div className="text-[14px] font-[400] cursor-pointer">Tasks</div>
            </div>
          </div>
          <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
          <div className="mt-4 overflow-x-auto">
            <EnhancedTable
              data={tasks}
              columns={taskColumns}
              storageKey="sprint-tasks-table"
              hideColumnsButton={true}
              hideTableExport={true}
              hideTableSearch={true}
              exportFileName="sprint-tasks"
              pagination={true}
              pageSize={10}
              emptyMessage=""
              className="min-w-[1200px]"
              renderCell={renderTaskCell}
              renderActions={(item) => (
                <div className="flex items-center justify-center gap-2">
                  <Button size="sm" variant="ghost" className="p-1" title="View Task Details">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintDetailsPage;
