import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Search, Crown, Trophy, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUser } from "@/utils/auth";
import { Trash2 } from "lucide-react";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";

interface EmployeeOfTheMonth {
  userId: string;
  userName: string;
  role: string;
  month: string;
  points: string[];
  profileImage?: string;
}

interface EOMHistoryItem {
  extra_field_id: number;
  month?: string;
  field_name?: string;
  full_name?: string;
  field_description?: string;
  role?: string;
  field_value?: string;
  profile_image?: string;
  id?: number | string;
}

const AchievementPoint = ({
  point,
  index,
  onUpdate,
  onRemove,
  showRemove,
}: {
  point: string;
  index: number;
  onUpdate: (val: string) => void;
  onRemove: () => void;
  showRemove: boolean;
}) => {
  const [localVal, setLocalVal] = useState(point);

  useEffect(() => {
    setLocalVal(point);
  }, [point]);

  return (
    <div className="flex gap-2">
      <Input
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={() => onUpdate(localVal)}
        placeholder={`Achievement ${index + 1}`}
        className="border-gray-200 focus:border-red-300 focus:ring-red-100"
      />
      {showRemove && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 px-2"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

const EmployeeOfTheMonthSetup: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser() as unknown as { lock_role?: { company_id?: number | string } };
  const companyId = localStorage.getItem("org_id") || user?.lock_role?.company_id || "116";
  const currentConfigRef = useRef<any>(null);

  const [employeeOfTheMonth, setEmployeeOfTheMonth] = useState<EmployeeOfTheMonth>({
    userId: "",
    userName: "",
    role: "Employee",
    month: "",
    points: [""],
    profileImage: "",
  });

  const [users, setUsers] = useState<
    {
      id: string;
      full_name: string;
      role_name?: string;
      profile_image?: string;
    }[]
  >([]);

  const [eomLoading, setEomLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [eomHistory, setEomHistory] = useState<EOMHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState("");

  const historyColumns: ColumnConfig[] = [
    { key: "month", label: "Month", sortable: true, draggable: true, hideable: true, defaultVisible: true },
    { key: "full_name", label: "Employee Name", sortable: true, draggable: true, hideable: true, defaultVisible: true },
    { key: "role", label: "Role", sortable: true, draggable: true, hideable: true, defaultVisible: true },
  ];

  const filteredUsers = React.useMemo(() => {
    if (!searchTerm) return users.slice(0, 50);
    return users
      .filter((u) => u.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 50);
  }, [users, searchTerm]);

  const fetchEOMHistory = React.useCallback(async () => {
    if (!companyId) return;
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      // 1. Try the specialized endpoint with resource filters
      const response = await axios.get(
        `${protocol}${baseUrl}/extra_fields/employee_of_the_month?resource_id=${companyId}&resource_type=CompanySetup`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let fetchedAnns = [];
      if (response.data?.employee_of_the_month) {
        const data = response.data.employee_of_the_month;
        fetchedAnns = Array.isArray(data) ? data : (data ? [data] : []);
      }

      // 2. Fallback to generic group_name fetch if specialized fails or is empty
      if (fetchedAnns.length === 0) {
        const fallbackEndpoint = `${protocol}${baseUrl}/extra_fields?resource_id=${companyId}&resource_type=CompanySetup&group_name=employee_of_the_month`;
        const fallbackRes = await axios.get(fallbackEndpoint, { headers: { Authorization: `Bearer ${token}` } });
        
        if (Array.isArray(fallbackRes.data)) {
           fetchedAnns = fallbackRes.data;
        } else if (Array.isArray(fallbackRes.data?.data)) {
           fetchedAnns = fallbackRes.data.data;
        } else if (Array.isArray(fallbackRes.data?.employee_of_the_month)) {
           fetchedAnns = fallbackRes.data.employee_of_the_month;
        }
      }

      if (fetchedAnns.length > 0) {
        const processedHistory = fetchedAnns.map((h: any) => {
          let historyItem = {
            extra_field_id: h.id || h.extra_field_id,
            id: h.id || h.extra_field_id,
            month: h.field_name || "",
            full_name: h.field_description || "N/A",
            role: "Employee",
            profile_image: ""
          };

          if (h.field_value && h.field_value.trim().startsWith("{")) {
            try {
              const parsed = JSON.parse(h.field_value);
              historyItem = {
                ...historyItem,
                ...parsed,
                // Ensure we don't overwrite IDs from the parse if they are missing
                id: h.id || h.extra_field_id,
                extra_field_id: h.id || h.extra_field_id
              };
            } catch (e) {
              console.error("Failed to parse history field_value:", e);
            }
          }
          return historyItem;
        });
        setEomHistory(processedHistory);
      } else {
        setEomHistory([]);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setHistoryLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!companyId) return;
      try {
        const token = localStorage.getItem("token");
        const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
        const protocol = baseUrl.startsWith("http") ? "" : "https://";

        // Fetch Org Config
        const orgRes = await axios.get(
          `${protocol}${baseUrl}/organizations/${companyId}.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const orgData = orgRes.data?.organization || orgRes.data?.data || orgRes.data;
        if (orgData?.other_config) {
          let config = orgData.other_config;
          if (typeof config === "string") {
            try { config = JSON.parse(config); } catch (e) {}
          }
          currentConfigRef.current = config;
          if (config.employee_of_the_month) {
            setEmployeeOfTheMonth({
              userId: config.employee_of_the_month.userId || "",
              userName: config.employee_of_the_month.userName || "",
              role: config.employee_of_the_month.role || "Employee",
              month: config.employee_of_the_month.month || "",
              points: config.employee_of_the_month.points || [""],
              profileImage: config.employee_of_the_month.profileImage || "",
            });
          }
        }

        // Fetch Users
        const usersRes = await axios.get(
          `${protocol}${baseUrl}/pms/users/get_escalate_to_users.json?per_page=1000`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (usersRes.data?.users) {
          setUsers(usersRes.data.users);
        }

        // Fetch History
        fetchEOMHistory();
      } catch (error) {
        console.error("Failed to fetch EOM data:", error);
      }
    };

    fetchInitialData();
  }, [companyId, fetchEOMHistory]);

  const handleEOMUpdate = async () => {
    if (!employeeOfTheMonth.userId || !employeeOfTheMonth.month) {
      toast.error("Please select an employee and a month");
      return;
    }
    setEomLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      const existingConfig = currentConfigRef.current || {};
      const otherConfig = {
        ...existingConfig,
        employee_of_the_month: {
          userId: employeeOfTheMonth.userId,
          userName: employeeOfTheMonth.userName,
          role: employeeOfTheMonth.role,
          month: employeeOfTheMonth.month,
          points: employeeOfTheMonth.points,
          profileImage: employeeOfTheMonth.profileImage,
        },
      };

      const formData = new FormData();
      formData.append("organization[other_config]", JSON.stringify(otherConfig));

      await axios.put(
        `${protocol}${baseUrl}/organizations/${companyId}.json`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      currentConfigRef.current = otherConfig;
      
      // Update Cache
      const updateTime = Date.now().toString();
      localStorage.setItem("company_hub_update_time", updateTime);
      localStorage.setItem("company_hub_eom", JSON.stringify({
        name: employeeOfTheMonth.userName,
        role: employeeOfTheMonth.role,
        month: employeeOfTheMonth.month,
        points: employeeOfTheMonth.points,
        userId: employeeOfTheMonth.userId,
        profileImage: employeeOfTheMonth.profileImage,
      }));

      // History Sync
      const [monthName, yearName] = employeeOfTheMonth.month.split(" ");
      const monthMap: Record<string, string> = {
        January: "01", February: "02", March: "03", April: "04",
        May: "05", June: "06", July: "07", August: "08",
        September: "09", October: "10", November: "11", December: "12",
      };
      const formattedMonth = yearName && monthName ? `${yearName}-${monthMap[monthName] || "01"}` : employeeOfTheMonth.month;

      const historyPayload = {
        extra_field: {
          resource_id: parseInt(String(companyId), 10),
          resource_type: "CompanySetup",
          field_name: formattedMonth,
          group_name: "employee_of_the_month",
          field_value: JSON.stringify({
            full_name: employeeOfTheMonth.userName,
            role: employeeOfTheMonth.role,
            profile_image: employeeOfTheMonth.profileImage,
            month: employeeOfTheMonth.month,
            userId: employeeOfTheMonth.userId
          }),
        },
      };

      const historyRes = await axios.get(`${protocol}${baseUrl}/extra_fields/employee_of_the_month?resource_id=${companyId}&resource_type=CompanySetup`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const histDataArr = historyRes.data?.employee_of_the_month;
      const historyItems = Array.isArray(histDataArr) ? histDataArr : (histDataArr ? [histDataArr] : []);
      const existing = historyItems.find(h => h.field_name === formattedMonth);

      if (existing) {
        await axios.put(`${protocol}${baseUrl}/extra_fields/${existing.id || existing.extra_field_id}`, historyPayload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
      } else {
        await axios.post(`${protocol}${baseUrl}/extra_fields`, historyPayload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
      }

      fetchEOMHistory();
      toast.success("Employee of the Month updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update Employee of the Month");
    } finally {
      setEomLoading(false);
    }
  };

  const handleDeleteEOMHistory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this history record?")) return;
    try {
      const token = localStorage.getItem("token");
      const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";
      await axios.delete(`${protocol}${baseUrl}/extra_fields/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEomHistory(prev => prev.filter(h => (h.extra_field_id || h.id) !== id));
      toast.success("History record deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete history");
    }
  };

  const renderCellHistory = (item: EOMHistoryItem, columnKey: string) => {
    switch (columnKey) {
      case "month":
        return <span className="font-medium text-gray-900">{item.month || item.field_name}</span>;
      case "full_name":
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
              {(item.profile_image || item.field_description) ? (
                <img src={item.profile_image || item.field_description} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Crown className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <span className="text-gray-600 font-medium">
              {item.full_name || item.field_description || "N/A"}
            </span>
          </div>
        );
      case "role":
        return <span className="text-gray-600">{item.role || "Employee"}</span>;
      default:
        return null;
    }
  };

  const renderActionsHistory = (item: EOMHistoryItem) => (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDeleteEOMHistory(Number(item.extra_field_id || item.id))}
        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-[#C72030]" />
              <h1 className="text-2xl font-bold text-gray-800">
                Employee of the Month Setup
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Select Employee</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between h-11 border-gray-300 font-normal hover:bg-white text-gray-700",
                        open && "border-blue-500 ring-1 ring-blue-500"
                      )}
                    >
                      <span className="truncate">
                        {employeeOfTheMonth.userId ? users.find(u => String(u.id) === employeeOfTheMonth.userId)?.full_name : "Select Employee"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white border border-gray-200 shadow-xl rounded-md overflow-hidden">
                    <Command className="w-full">
                      <div className="p-3 bg-white border-b">
                        <div className="relative flex items-center border-2 border-blue-400 rounded-xl px-3 py-1 bg-white">
                          <Search className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                          <CommandInput
                            placeholder="Type to search..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            className="h-9 border-none focus:ring-0 w-full"
                          />
                        </div>
                      </div>
                      <CommandList className="max-h-[280px]">
                        <CommandEmpty className="py-4 text-center text-gray-500 text-sm">No employee found.</CommandEmpty>
                        <CommandGroup className="p-1">
                          {filteredUsers.map((u) => (
                            <CommandItem
                              key={u.id}
                              value={u.full_name}
                              onSelect={() => {
                                setEmployeeOfTheMonth({
                                  ...employeeOfTheMonth,
                                  userId: String(u.id),
                                  userName: u.full_name,
                                  role: u.role_name || "Employee",
                                  profileImage: u.profile_image || "",
                                });
                                setOpen(false);
                                setSearchTerm("");
                              }}
                              className="flex items-center px-3 py-2.5 cursor-pointer text-gray-700 hover:bg-blue-50 rounded-md"
                            >
                              <Check className={cn("mr-3 h-4 w-4 text-blue-600", employeeOfTheMonth.userId === String(u.id) ? "opacity-100" : "opacity-0")} />
                              <span className="flex-1">{u.full_name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Select Month</Label>
                <Select
                  value={employeeOfTheMonth.month}
                  onValueChange={(value) => setEmployeeOfTheMonth({ ...employeeOfTheMonth, month: value })}
                >
                  <SelectTrigger className="w-full border-gray-200 h-11">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                      <SelectItem key={m} value={`${m} ${new Date().getFullYear()}`}>
                        {m} {new Date().getFullYear()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 block mb-3">Achievement Points</Label>
              <div className="space-y-3">
                {employeeOfTheMonth.points.map((point, idx) => (
                  <AchievementPoint
                    key={idx}
                    point={point}
                    index={idx}
                    showRemove={employeeOfTheMonth.points.length > 1}
                    onUpdate={(newVal) => {
                      const newPoints = [...employeeOfTheMonth.points];
                      newPoints[idx] = newVal;
                      setEmployeeOfTheMonth({ ...employeeOfTheMonth, points: newPoints });
                    }}
                    onRemove={() => {
                      const newPoints = employeeOfTheMonth.points.filter((_, i) => i !== idx);
                      setEmployeeOfTheMonth({ ...employeeOfTheMonth, points: newPoints });
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEmployeeOfTheMonth({ ...employeeOfTheMonth, points: [...employeeOfTheMonth.points, ""] })}
                  className="border-dashed py-0 h-8 text-xs text-gray-500"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Achievement Point
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-6 border-t">
              <Button variant="outline" onClick={() => navigate(-1)} className="border-[#C72030] text-[#C72030] px-8">Cancel</Button>
              <Button onClick={handleEOMUpdate} disabled={eomLoading} className="bg-[#C72030] text-white hover:bg-[#a61a28] px-8 font-semibold">
                {eomLoading ? "Saving..." : "Save Employee of Month"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-[#C72030]" />
              <h2 className="text-2xl font-bold text-gray-800">History</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search history..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none w-full sm:w-64 h-10"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <EnhancedTable
              data={eomHistory}
              columns={historyColumns}
              renderCell={renderCellHistory}
              renderActions={renderActionsHistory}
              getItemId={(item: EOMHistoryItem) => String(item.extra_field_id || item.id)}
              searchTerm={historySearch}
              onSearchChange={setHistorySearch}
              hideTableSearch={true}
              enableExport={true}
              storageKey="eom-history-table"
              pagination={true}
              pageSize={5}
              loading={historyLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOfTheMonthSetup;
