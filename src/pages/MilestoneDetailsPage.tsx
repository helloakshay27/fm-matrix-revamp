import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ScrollText, ClipboardList, Pencil, Trash2, ChevronDown, ChevronDownCircle } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import EditMilestoneModal from "@/components/EditMilestoneModal";
import { useAppDispatch } from "@/store/hooks";
import { createMilestone, fetchDependentMilestones, fetchMilestoneById, updateMilestoneStatus } from "@/store/slices/projectMilestoneSlice";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { format } from "date-fns";
import { MenuItem, Select, TextField } from "@mui/material";

interface Dependency {
  title?: string;
  status?: string;
  owner_name?: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
}

interface MilestoneData {
  id?: string | number;
  title?: string;
  status?: string;
  created_by_name?: string;
  created_at?: string;
  owner_name?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  task_managements?: any[];
}

const dependencyColumns: ColumnConfig[] = [
  {
    key: "title",
    label: "Milestone Title",
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
    key: "owner_name",
    label: "Milestone Owner",
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
];

const mapStatusToDisplay = (rawStatus: string | undefined) => {
  if (!rawStatus) return "Open";
  const statusMap: { [key: string]: string } = {
    open: "Open",
    in_progress: "In Progress",
    on_hold: "On Hold",
    overdue: "Overdue",
    completed: "Completed",
  };
  return statusMap[rawStatus.toLowerCase()] || "Open";
};

const mapDisplayToApiStatus = (displayStatus: string) => {
  const reverseStatusMap: { [key: string]: string } = {
    Open: "open",
    "In Progress": "in_progress",
    "On Hold": "on_hold",
    Overdue: "overdue",
    Completed: "completed",
  };
  return reverseStatusMap[displayStatus] || "open";
};

const calculateDuration = (start: string | undefined, end: string | undefined) => {
  if (!start || !end) return "N/A";

  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  endDate.setHours(23, 59, 59, 999);

  if (now < startDate) {
    return "Not started";
  }

  const diffMs = endDate.getTime() - now.getTime();
  if (diffMs <= 0) return "0s";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  return `${days > 0 ? days + "d " : ""}${remainingHours > 0 ? remainingHours + "h " : ""}${remainingMinutes > 0 ? remainingMinutes + "m " : ""
    }${remainingSeconds}s`;
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

export const MilestoneDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id, mid } = useParams<{ id: string; mid: string }>();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [milestoneDetails, setMilestoneDetails] = useState<MilestoneData>({});
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Open");
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(false);
  const [isDependencyCollapsed, setIsDependencyCollapsed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const response = await dispatch(fetchMilestoneById({ baseUrl, token, id: mid })).unwrap();
      setMilestoneDetails(response);
      setSelectedOption(mapStatusToDisplay(response.status));
    } catch (error) {
      console.error("Error fetching milestone details:", error);
      toast.error(String(error) || "Failed to fetch milestone details");
    }
  };

  const getDependencies = async () => {
    try {
      const response = await dispatch(fetchDependentMilestones({ baseUrl, token, id: mid })).unwrap();
      setDependencies(response);
    } catch (error) {
      console.error("Error fetching dependencies:", error);
      toast.error(String(error) || "Failed to fetch dependencies");
    }
  };

  const getOwners = async () => {
    try {
      const response = await dispatch(fetchFMUsers()).unwrap();
      setOwners(response.users);
    } catch (error) {
      console.log(error);
      toast.error(String(error) || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchData();
    getOwners();
    getDependencies();
  }, []);

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

  const handleStatusChange = async (option: string) => {
    if (milestoneDetails.task_managements && milestoneDetails.task_managements.length > 0) {
      toast.error("Cannot change status while task managements exist");
      setOpenDropdown(false);
      return;
    }

    setSelectedOption(option);
    setOpenDropdown(false);

    try {
      await dispatch(
        updateMilestoneStatus({
          token,
          baseUrl,
          id: mid || "",
          payload: { status: mapDisplayToApiStatus(option) },
        })
      ).unwrap();
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
      setSelectedOption(mapStatusToDisplay(milestoneDetails.status));
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-red-100 text-red-800";
    switch (status.toLowerCase()) {
      case "open":
        return "bg-red-100 text-red-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "on_hold":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColorDot = (status: string | undefined) => {
    if (!status) return "bg-red-500";
    switch (status.toLowerCase()) {
      case "open":
        return "bg-red-500";
      case "overdue":
        return "bg-red-500";
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-yellow-500";
      case "on_hold":
        return "bg-gray-500";
      default:
        return "bg-red-500";
    }
  };

  const handleAddDependency = async (newRowData: Partial<Dependency>) => {
    console.log(newRowData)
    try {
      if (!newRowData.title?.trim()) {
        toast.error("Please enter milestone title");
        return;
      }
      if (!newRowData.start_date || !newRowData.end_date) {
        toast.error("Please select start and end dates");
        return;
      }
      if (!newRowData.owner_name) {
        toast.error("Please select milestone owner");
        return;
      }

      // Validate that end_date is after start_date
      if (new Date(newRowData.end_date) <= new Date(newRowData.start_date)) {
        toast.error("End date must be after start date");
        return;
      }

      // Create payload matching API expectations
      const payload = {
        milestone: {
          title: newRowData.title,
          start_date: newRowData.start_date,
          end_date: newRowData.end_date,
          status: "open",
          owner_id: newRowData.owner_name,
          project_management_id: id,
          depends_on_id: milestoneDetails?.id,
        },
      };

      // Dispatch createMilestone action
      await dispatch(createMilestone({ token, baseUrl, data: payload })).unwrap();

      toast.success("Dependency added successfully");
      await getDependencies();
    } catch (error) {
      console.log(error);
      toast.error(String(error) || "Failed to add dependency");
    }
  };

  const getDropdownPosition = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!event.currentTarget) return { top: 0, left: 0, width: 0 };
    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownHeight = 150;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const openUpward = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

    return {
      top: openUpward ? rect.top + window.scrollY - dropdownHeight : rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    };
  };

  const dropdownOptions = ["Open", "In Progress", "On Hold", "Overdue", "Completed"];

  const renderDependencyCell = (item: any, columnKey: string) => {
    if (columnKey === "status") {
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            item.status
          )}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status?.toLowerCase() === "open"
              ? "bg-red-500"
              : item.status?.toLowerCase() === "in_progress"
                ? "bg-green-500"
                : item.status?.toLowerCase() === "overdue"
                  ? "bg-red-500"
                  : item.status?.toLowerCase() === "completed"
                    ? "bg-gray-500"
                    : "bg-gray-400"
              }`}
          ></span>
          {item.status}
        </span>
      );
    }
    return item[columnKey] || "-";
  };

  return (
    <>
      <div className="m-4">
        <div className="px-4 pt-1">
          {/* Title */}
          <h2 className="text-[15px] p-3 px-0">
            <span className="mr-3">M-0{milestoneDetails.id}</span>
            <span>{milestoneDetails.title}</span>
          </h2>
          <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

          {/* Header Info and Status */}
          <div className="flex items-center justify-between my-3 text-[12px]">
            <div className="flex items-center gap-3 text-[#323232] flex-wrap">
              <span>Created By: {milestoneDetails.created_by_name}</span>
              <span className="h-6 w-[1px] border border-gray-300"></span>
              <span className="flex items-center gap-3">
                Created On: {formatToDDMMYYYY_AMPM(milestoneDetails.created_at)}
              </span>
              <span className="h-6 w-[1px] border border-gray-300"></span>

              {/* Status Dropdown */}
              <div className="relative w-[150px]" ref={dropdownRef}>
                <div
                  className="flex items-center justify-between gap-1 cursor-pointer px-2 py-1"
                  onClick={() => setOpenDropdown(!openDropdown)}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setOpenDropdown(!openDropdown)}
                >
                  <span className="text-[13px] font-medium text-[#c72030]">{selectedOption}</span>
                  <ChevronDown
                    size={15}
                    className={`${!milestoneDetails.task_managements || milestoneDetails.task_managements.length === 0
                      ? openDropdown
                        ? "rotate-180"
                        : ""
                      : ""
                      } transition-transform`}
                  />
                </div>

                {/* Only show dropdown if no task_managements exist */}
                {(!milestoneDetails.task_managements || milestoneDetails.task_managements.length === 0) && (
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
                          className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option ? "bg-gray-100 font-semibold" : ""
                            }`}
                          onClick={() => handleStatusChange(option)}
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <span className="h-6 w-[1px] border border-gray-300"></span>
              <span className="cursor-pointer flex items-center gap-1" onClick={() => setEditModalOpen(true)}>
                <Pencil className="mx-1" size={15} /> Edit Milestone
              </span>
            </div>
          </div>

          <div className="border-b-[3px] border-grey my-3"></div>

          {/* Details Section */}
          <div className="border rounded-md shadow-custom p-5 mb-4">
            <div className="font-[600] text-[16px] flex items-center gap-4">
              <ChevronDownCircle
                color="#E95420"
                size={30}
                className={`${isDetailsCollapsed ? "rotate-180" : "rotate-0"
                  } transition-transform cursor-pointer`}
                onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
              />
              Details
            </div>
            <div
              className={`mt-3 transition-all duration-300 ease-in-out overflow-hidden ${isDetailsCollapsed ? "max-h-0" : "max-h-[500px]"
                }`}
            >
              <div className="flex flex-col">
                <div className="w-1/2 flex items-center justify-start gap-3 ml-36">
                  <div className="text-right text-[12px] font-[500]">Responsible Person:</div>
                  <div className="text-left text-[12px]">{milestoneDetails.owner_name}</div>
                </div>

                <span className="border h-[1px] inline-block w-full my-4"></span>

                <div className="w-1/2 flex items-center justify-start gap-3 ml-36">
                  <div className="text-right text-[12px] font-[500]">Duration:</div>
                  <CountdownTimer
                    startDate={milestoneDetails.start_date}
                    targetDate={milestoneDetails.end_date}
                  />
                </div>

                <span className="border h-[1px] inline-block w-full my-4"></span>

                <div className="w-1/2 flex items-center justify-start gap-3 ml-36">
                  <div className="text-right text-[12px] font-[500]">Start Date:</div>
                  <div className="text-left text-[12px]">
                    {milestoneDetails?.start_date?.split("T")[0]}
                  </div>
                </div>

                <span className="border h-[1px] inline-block w-full my-4"></span>

                <div className="w-1/2 flex items-center justify-start gap-3 ml-36">
                  <div className="text-right text-[12px] font-[500]">End Date:</div>
                  <div className="text-left text-[12px]">{milestoneDetails?.end_date?.split("T")[0]}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dependencies Section */}
          <div>
            <div className="flex items-center justify-between my-3">
              <div className="flex items-center gap-10">
                <div className="text-[14px] font-[400] cursor-pointer">Dependencies</div>
              </div>
            </div>
            <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
            <div className="mt-4 overflow-x-auto">
              <EnhancedTable
                data={dependencies}
                columns={dependencyColumns}
                storageKey="milestone-dependencies-table"
                hideColumnsButton={true}
                hideTableExport={true}
                hideTableSearch={true}
                exportFileName="milestone-dependencies"
                pagination={true}
                pageSize={10}
                emptyMessage="No dependencies available"
                className="min-w-[1200px]"
                renderCell={renderDependencyCell}
                canAddRow={true}
                newRowPlaceholder="Add Milestone title"
                onAddRow={handleAddDependency}
                readonlyColumns={["status", "duration"]}
                renderEditableCell={(columnKey: string, value: any, onChange: (value: any) => void) => {
                  if (columnKey === "milestone_title") {
                    return (
                      <TextField
                        type="text"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Enter milestone title"
                        size="small"
                        sx={{ minWidth: 200 }}
                      />
                    );
                  }
                  if (columnKey === "owner_name") {
                    return (
                      <Select
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        displayEmpty
                        size="small"
                        sx={{ minWidth: 200 }}
                      >
                        <MenuItem value="">
                          <em>Select owner</em>
                        </MenuItem>
                        {owners?.map((owner: any) => (
                          <MenuItem key={owner.id} value={owner.id}>
                            {owner.full_name}
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
                        sx={{ minWidth: 150 }}
                        InputLabelProps={{ shrink: true }}
                      />
                    );
                  }
                  return (
                    <TextField
                      type="text"
                      value={value || ""}
                      onChange={(e) => onChange(e.target.value)}
                      size="small"
                      sx={{ minWidth: 150 }}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Milestone Modal */}
      {editModalOpen && (
        <EditMilestoneModal
          openDialog={editModalOpen}
          handleCloseDialog={() => setEditModalOpen(false)}
          owners={owners}
          milestoneData={milestoneDetails as any}
          onUpdate={fetchData}
        />
      )}
    </>
  );
};

export default MilestoneDetailsPage;
