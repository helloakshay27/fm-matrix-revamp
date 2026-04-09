import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckSquare,
  Users,
  FileText,
  Sparkles,
  Search,
  Users2,
  ListFilter,
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
  Plus,
  ExternalLink,
  ChevronDown,
  Settings2,
  FileSearch,
  Copy,
  BrainCircuit,
  UserPlus,
  User,
  Ticket,
  Eye,
  Edit,
  Trash2,
  Loader2,
  ArrowLeft,
  Calendar,
  Briefcase,
  Target,
  Trophy,
  Activity,
  Layers,
  MapPin,
  ArrowRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { cn } from "@/lib/utils";

type TabType = "status" | "setup" | "jd" | "samples";

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
  color: string;
}

const TABS: TabConfig[] = [
  { id: "status", label: "Job Status", icon: CheckSquare, color: "bg-red-700" },
  { id: "setup", label: "Job Setup", icon: Users, color: "bg-red-700" },
  { id: "jd", label: "JD", icon: FileText, color: "bg-red-700" },
  { id: "samples", label: "Sample JDs", icon: Sparkles, color: "bg-red-700" },
];

const JobsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("status");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [selectedUserForSetup, setSelectedUserForSetup] =
    useState<JobStatusUser | null>(null);
  const [selectedJDId, setSelectedJDId] = useState<number | null>(null);
  const [editingJDId, setEditingJDId] = useState<number | null>(null);
  const [isCreatingJD, setIsCreatingJD] = useState(false);

  const handleEditUserInSetup = (user: JobStatusUser) => {
    setSelectedUserForSetup(user);
    setActiveTab("setup");
  };

  const renderTabContent = () => {
    if (isCreatingJD) {
      return (
        <JDForm
          onBack={() => setIsCreatingJD(false)}
          onSuccess={() => {
            setIsCreatingJD(false);
            setActiveTab("jd");
          }}
        />
      );
    }

    if (editingJDId !== null) {
      return (
        <JDForm
          id={editingJDId}
          onBack={() => setEditingJDId(null)}
          onSuccess={() => {
            setEditingJDId(null);
            setActiveTab("jd");
          }}
        />
      );
    }

    if (selectedJDId !== null) {
      return (
        <JDDetailView
          id={selectedJDId}
          onBack={() => setSelectedJDId(null)}
          onEdit={(id) => {
            setSelectedJDId(null);
            setEditingJDId(id);
          }}
        />
      );
    }

    switch (activeTab) {
      case "status":
        return <JobStatusTab onEditUser={handleEditUserInSetup} />;
      case "setup":
        return <JobSetupTab selectedUser={selectedUserForSetup} />;
      case "jd":
        return (
          <JDTab
            viewType={viewType}
            setViewType={setViewType}
            onViewDetail={setSelectedJDId}
            onEditJD={setEditingJDId}
            onCreateManual={() => setIsCreatingJD(true)}
          />
        );
      case "samples":
        return <SampleJDsTab viewType={viewType} setViewType={setViewType} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 bg-slate-50/30 min-h-screen">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-poppins">
          Jobs
        </h1>
        <p className="text-slate-500 font-medium text-lg font-work-sans">
          Manage job descriptions, user assignments, and role definitions
        </p>
      </div>

      {/* Premium Tabs Selection */}
      <div className="bg-white/60 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-slate-200/60 flex gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-sm font-poppins",
              activeTab === tab.id
                ? `${tab.color} text-white shadow-md shadow-black/10 scale-[1.01]`
                : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-700"
            )}
          >
            <tab.icon
              className={cn(
                "w-4 h-4",
                activeTab === tab.id ? "animate-pulse" : ""
              )}
            />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8 transition-all duration-500">
        {renderTabContent()}
      </div>
    </div>
  );
};

// --- Sub-components for Tabs ---

// Define type for job status user data
interface JobStatusUser {
  user_id: number;
  name: string;
  email: string;
  department: string | null;
  department_id: number | null;
  role: string | null;
  jd: string | null;
  kpis: number;
  sops: number;
  daily_kra: number;
  weekly_kra: number;
}

interface JobStatusSummary {
  total_users: number;
  with_jd: number;
  with_kpis: number;
  setup_complete: number;
}

const JobStatusTab = ({
  onEditUser,
}: {
  onEditUser: (user: JobStatusUser) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<JobStatusUser[]>([]);
  const [summary, setSummary] = useState<JobStatusSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGroupedByDept, setIsGroupedByDept] = useState(false);
  const [deptFilter, setDeptFilter] = useState("all");
  const [setupStatusFilter, setSetupStatusFilter] = useState("all");

  // Extract unique departments from users data
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    users.forEach((user) => {
      if (user.department) {
        deptSet.add(user.department);
      }
    });
    return Array.from(deptSet).sort();
  }, [users]);

  const fetchJobStatus = useCallback(async () => {
    try {
      setLoading(true);
      const url = getFullUrl(API_CONFIG.ENDPOINTS.JOB_STATUS);
      const response = await axios.get(url, {
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (response.data.success) {
        setUsers(response.data.data.users);
        setSummary(response.data.data.summary);
      } else {
        toast.error("Failed to fetch job status data");
      }
    } catch (error) {
      console.error("Error fetching job status:", error);
      toast.error("An error occurred while fetching job status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobStatus();
  }, [fetchJobStatus]);

  const stats = useMemo(
    () => [
      {
        label: "Total Users",
        value: summary?.total_users?.toString() || "0",
        color: "text-slate-900",
      },
      {
        label: "With JD",
        value: summary?.with_jd?.toString() || "0",
        color: "text-emerald-500",
      },
      {
        label: "With KPIs",
        value: summary?.with_kpis?.toString() || "0",
        color: "text-blue-600",
      },
      {
        label: "Setup Complete",
        value: summary?.setup_complete?.toString() || "0",
        color: "text-violet-600",
      },
    ],
    [summary]
  );

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (deptFilter !== "all") {
      result = result.filter((user) => user.department === deptFilter);
    }

    if (setupStatusFilter !== "all") {
      result = result.filter((user) => {
        const isComplete = user.jd && user.kpis > 0;
        if (setupStatusFilter === "complete") {
          return isComplete;
        } else {
          return !isComplete;
        }
      });
    }

    if (isGroupedByDept) {
      result.sort((a, b) => {
        const deptA = a.department || "Z_UNASSIGNED";
        const deptB = b.department || "Z_UNASSIGNED";
        return deptA.localeCompare(deptB);
      });
    }

    return result;
  }, [users, searchTerm, deptFilter, setupStatusFilter, isGroupedByDept]);

  // Column configuration for EnhancedTable with FM Matrix fonts
  const columns: ColumnConfig[] = [
    { key: "name", label: "User", sortable: true, defaultVisible: true },
    {
      key: "department",
      label: "Department",
      sortable: true,
      defaultVisible: true,
    },
    { key: "role", label: "Role", sortable: true, defaultVisible: true },
    { key: "jd", label: "JD", sortable: true, defaultVisible: true },
    { key: "kpis", label: "KPIs", sortable: true, defaultVisible: true },
    { key: "sops", label: "SOPs", sortable: true, defaultVisible: true },
    {
      key: "daily_kra",
      label: "Daily KRA",
      sortable: true,
      defaultVisible: true,
    },
    {
      key: "weekly_kra",
      label: "Weekly KRA",
      sortable: true,
      defaultVisible: true,
    },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.user_id.toString()));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  // Custom cell renderer for EnhancedTable
  const renderCell = (item: JobStatusUser, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200 text-xs shadow-sm">
              {item.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                {item.name}
              </span>
              <span className="text-[11px] font-medium text-slate-400 leading-tight">
                {item.email}
              </span>
            </div>
          </div>
        );
      case "department":
        return (
          <span
            className={cn(
              "text-xs font-bold capitalize",
              item.department ? "text-slate-600" : "text-slate-300 italic"
            )}
          >
            {item.department || "N/A"}
          </span>
        );
      case "role":
        return (
          <span
            className={cn(
              "text-xs font-bold",
              item.role ? "text-slate-500" : "text-slate-300"
            )}
          >
            {item.role || "Not Set"}
          </span>
        );
      case "jd":
        return (
          <div className="flex items-center justify-center gap-2 font-bold">
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider",
                item.jd
                  ? "text-emerald-600 bg-emerald-50/50"
                  : "text-orange-500 bg-orange-50/50"
              )}
            >
              {item.jd ? "Defined" : "Not Set"}
            </span>
          </div>
        );
      case "kpis":
      case "sops":
      case "daily_kra":
      case "weekly_kra": {
        const val = item[columnKey as keyof JobStatusUser] as number;
        return (
          <div className="text-center font-bold text-sm text-slate-600 font-poppins">
            {val > 0 ? val : <span className="text-slate-200">0</span>}
          </div>
        );
      }
      default:
        return item[columnKey as keyof JobStatusUser]?.toString() || "";
    }
  };

  // Actions renderer for EnhancedTable
  const renderActions = (item: JobStatusUser) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-600 hover:bg-blue-50 transition-all duration-300 h-8 w-8 p-0"
        onClick={() => onEditUser(item)}
      >
        <Edit className="w-4 h-4" />
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
          >
            <CardContent className="p-6">
              <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider font-work-sans">
                {stat.label}
              </p>
              <p className={cn("text-3xl font-bold font-poppins", stat.color)}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="w-48">
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={setupStatusFilter} onValueChange={setSetupStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="complete">Setup Complete</SelectItem>
              <SelectItem value="incomplete">Setup Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={isGroupedByDept ? "default" : "outline"}
          className={cn(
            "h-11 px-6 border-slate-200 font-bold gap-2 transition-all",
            isGroupedByDept
              ? "bg-[#334155] text-white border-[#334155]"
              : "text-slate-600 bg-white"
          )}
          onClick={() => setIsGroupedByDept(!isGroupedByDept)}
        >
          <Users2 className="w-4 h-4" />
          {isGroupedByDept ? "Grouped" : "Group by Dept"}
        </Button>
      </div>

      {/* Enhanced Table */}
      <EnhancedTable
        data={filteredUsers}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        selectable={true}
        selectedItems={selectedUsers}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectUser}
        getItemId={(item) => item.user_id.toString()}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search users..."
        enableExport={true}
        exportFileName="job-status-report"
        loading={loading}
        emptyMessage="No users found"
        className="border-none shadow-sm bg-white overflow-hidden"
      />
    </div>
  );
};

interface UserSetupData {
  user: {
    id: number;
    name: string;
    email: string;
    department: string;
  };
  job_description: JobDescriptionDetail | null;
  additional_kpis: KPI[];
  sops: any[];
  all_kpis: KPI[];
  available_dept_kpis: KPI[];
  available_dept_sops: any[];
}

const JobSetupTab = ({
  selectedUser,
}: {
  selectedUser: JobStatusUser | null;
}) => {
  const [setupData, setSetupData] = useState<UserSetupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [jds, setJds] = useState<JobDescriptionItem[]>([]);

  // Selection States for POST
  const [selectedJDId, setSelectedJDId] = useState<number | null>(null);
  const [selectedKPIIds, setSelectedKPIIds] = useState<number[]>([]);
  const [selectedSOPIds, setSelectedSOPIds] = useState<number[]>([]);

  const fetchUserSetup = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      const url = getFullUrl(
        `${API_CONFIG.ENDPOINTS.USER_SETUP}/${userId}.json`
      );
      const response = await axios.get(url, {
        headers: { Authorization: getAuthHeader() },
      });
      if (response.data.success) {
        const data = response.data.data;
        setSetupData(data);

        // Initialize selections from current data
        setSelectedJDId(data.job_description?.id || null);
        setSelectedKPIIds(data.additional_kpis?.map((k: KPI) => k.id) || []);
        setSelectedSOPIds(data.sops?.map((s: any) => s.id) || []);
      }
    } catch (error) {
      console.error("Error fetching user setup:", error);
      toast.error("Failed to load user setup details");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJDs = async () => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.JOB_DESCRIPTIONS);
      const response = await axios.get(url, {
        headers: { Authorization: getAuthHeader() },
      });
      if (response.data.success) {
        setJds(response.data.data.job_descriptions);
      }
    } catch (error) {
      console.error("Error fetching JDs:", error);
    }
  };

  useEffect(() => {
    if (selectedUser?.user_id) {
      fetchUserSetup(selectedUser.user_id);
    }
    fetchJDs();
  }, [selectedUser, fetchUserSetup]);

  const handleSaveSetup = async () => {
    if (!selectedUser?.user_id) return;

    try {
      setSaving(true);
      const url = getFullUrl(
        `${API_CONFIG.ENDPOINTS.USER_SETUP}/${selectedUser.user_id}.json`
      );
      const payload = {
        job_description_id: selectedJDId,
        additional_kpi_ids: selectedKPIIds,
        sop_ids: selectedSOPIds,
      };

      const response = await axios.post(url, payload, {
        headers: { Authorization: getAuthHeader() },
      });

      if (response.data.success) {
        toast.success("Job setup saved successfully!");
        fetchUserSetup(selectedUser.user_id); // Refresh data
      } else {
        toast.error(response.data.message || "Failed to save setup");
      }
    } catch (error) {
      console.error("Error saving setup:", error);
      toast.error("An error occurred while saving setup");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveJD = async () => {
    if (!selectedUser?.user_id) return;
    if (
      !window.confirm(
        "Are you sure you want to remove the Job Description from this user?"
      )
    )
      return;

    try {
      setSaving(true);
      const url = getFullUrl(
        `${API_CONFIG.ENDPOINTS.USER_SETUP}/${selectedUser.user_id}.json`
      );
      const payload = {
        job_description_id: null,
        additional_kpi_ids: selectedKPIIds,
        sop_ids: selectedSOPIds,
      };

      const response = await axios.post(url, payload, {
        headers: { Authorization: getAuthHeader() },
      });

      if (response.data.success) {
        toast.success("Job Description removed successfully");
        setSelectedJDId(null);
        fetchUserSetup(selectedUser.user_id);
      } else {
        toast.error(response.data.message || "Failed to remove JD");
      }
    } catch (error) {
      console.error("Error removing JD:", error);
      toast.error("An error occurred while removing JD");
    } finally {
      setSaving(false);
    }
  };

  const toggleKPI = (kpiId: number) => {
    setSelectedKPIIds((prev) =>
      prev.includes(kpiId)
        ? prev.filter((id) => id !== kpiId)
        : [...prev, kpiId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Select User Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-8 space-y-4 bg-white">
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            Select User to Configure
          </h3>
          <div className="relative">
            <Select value={selectedUser?.name || ""}>
              <SelectTrigger className="h-14 border-slate-200 bg-white text-slate-500 font-medium px-4 text-base">
                <SelectValue placeholder="Search and select a user..." />
              </SelectTrigger>
              <SelectContent className="border-none shadow-2xl p-2 rounded-xl">
                <SelectItem value="adhip" className="py-3 rounded-lg font-bold">
                  Adhip Shetty
                </SelectItem>
                <SelectItem value="user2" className="py-3 rounded-lg font-bold">
                  User 2
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {setupData ? (
        <div className="space-y-6">
          {/* User Information Card */}
          <div className="bg-white p-6 rounded-none border border-slate-200 shadow-none flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-100 flex items-center justify-center font-black text-xl text-[#C72030] border border-slate-200">
                {setupData.user.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  {setupData.user.name}
                </h4>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {setupData.user.department}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    {setupData.user.email}
                  </span>
                </div>
              </div>
            </div>
            <Button
              className="bg-[#C72030] hover:bg-red-800 text-white rounded-none px-8 font-black flex items-center gap-2"
              onClick={handleSaveSetup}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save Mapping"
              )}
              <CheckSquare className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Description Assignment */}
            <div className="bg-white p-6 rounded-none border border-slate-200 shadow-none space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <FileText className="w-5 h-5 text-[#C72030]" />
                <h4 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                  Job Description
                </h4>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  Assign JD to User
                </label>
                <Select
                  value={selectedJDId?.toString() || ""}
                  onValueChange={(val) => setSelectedJDId(parseInt(val))}
                >
                  <SelectTrigger className="h-12 border-slate-200 rounded-none bg-slate-50/50 focus:bg-white transition-all font-bold">
                    <SelectValue placeholder="Search for a Job Description..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border shadow-none p-1">
                    {jds.map((jd) => (
                      <SelectItem
                        key={jd.id}
                        value={jd.id.toString()}
                        className="rounded-none font-bold py-3 text-sm"
                      >
                        {jd.job_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {setupData.job_description &&
              selectedJDId === setupData.job_description.id ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-emerald-700">
                      {setupData.job_description.job_title}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500 text-white rounded-none uppercase text-[9px] font-black">
                        Current JD
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-[10px] font-black uppercase"
                        onClick={handleRemoveJD}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-emerald-400 uppercase">
                        KRAs
                      </span>
                      <span className="text-sm font-black text-emerald-700">
                        {jds.find((j) => j.id === selectedJDId)?.kras_count ||
                          0}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-emerald-400 uppercase">
                        KPIs
                      </span>
                      <span className="text-sm font-black text-emerald-700">
                        {jds.find((j) => j.id === selectedJDId)?.kpis_count ||
                          0}
                      </span>
                    </div>
                  </div>
                </div>
              ) : selectedJDId ? (
                <div className="p-4 bg-blue-50 border border-blue-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-blue-700">
                      {jds.find((j) => j.id === selectedJDId)?.job_title}
                    </p>
                    <Badge className="bg-blue-500 text-white rounded-none uppercase text-[9px] font-black">
                      New Match
                    </Badge>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-blue-400 uppercase">
                        KRAs
                      </span>
                      <span className="text-sm font-black text-blue-700">
                        {jds.find((j) => j.id === selectedJDId)?.kras_count ||
                          0}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-blue-400 uppercase">
                        KPIs
                      </span>
                      <span className="text-sm font-black text-blue-700">
                        {jds.find((j) => j.id === selectedJDId)?.kpis_count ||
                          0}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-200 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-400">
                    No Job Description assigned to this user yet.
                  </p>
                </div>
              )}
            </div>

            {/* KPI Assignment Detail */}
            <div className="bg-white p-6 rounded-none border border-slate-200 shadow-none space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <Activity className="w-5 h-5 text-[#C72030]" />
                <h4 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                  KPI Management
                </h4>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Department KPIs
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {setupData.available_dept_kpis.length > 0 ? (
                      setupData.available_dept_kpis.map((kpi) => (
                        <Badge
                          key={kpi.id}
                          variant="outline"
                          onClick={() => toggleKPI(kpi.id)}
                          className={cn(
                            "rounded-none font-bold flex items-center gap-2 py-1.5 px-3 cursor-pointer transition-colors",
                            selectedKPIIds.includes(kpi.id)
                              ? "bg-[#C72030] border-[#C72030] text-white"
                              : "border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100"
                          )}
                        >
                          {kpi.name}
                          {selectedKPIIds.includes(kpi.id) ? (
                            <CheckSquare className="w-3 h-3" />
                          ) : (
                            <Plus className="w-3 h-3 text-[#C72030]" />
                          )}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 font-medium py-2 italic">
                        No department-specific KPIs available.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Additional Private KPIs
                  </p>
                  <div className="space-y-2">
                    {setupData.all_kpis
                      .filter((k) => selectedKPIIds.includes(k.id))
                      .map((kpi) => (
                        <div
                          key={kpi.id}
                          className="p-3 border border-slate-100 flex items-center justify-between group bg-slate-50/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-[#C72030]" />
                            <span className="text-sm font-bold text-slate-700">
                              {kpi.name}
                            </span>
                          </div>
                          <Trash2
                            className="w-3.5 h-3.5 text-slate-300 hover:text-red-500 cursor-pointer transition-colors"
                            onClick={() => toggleKPI(kpi.id)}
                          />
                        </div>
                      ))}
                    <Button
                      variant="outline"
                      className="w-full rounded-none border-dashed border-slate-200 h-10 font-bold text-slate-400 hover:text-[#C72030] hover:bg-red-50"
                    >
                      + Add Custom Private KPI
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-none shadow-none bg-slate-50 p-12 text-center rounded-none">
          <div className="space-y-4 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 font-poppins">
              No User Selected
            </h3>
            <p className="text-slate-500 font-medium text-lg leading-relaxed font-work-sans">
              Search and select a user to configure their job profile
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

// Define type for job description items
interface JobDescriptionItem {
  id: number;
  job_title: string;
  department: string | null;
  experience_level: string;
  employment_type: string;
  status: string;
  kras_count: number;
  kpis_count: number;
  users_count: number;
  created_at: string;
}

interface KRA {
  id: number;
  description: string;
  track_daily: boolean;
  track_weekly: boolean;
  position: number;
}

interface KPI {
  id: number;
  name: string;
  category: string;
  unit: string;
  frequency: string;
  target_value: string;
  current_value: string;
}

interface JobDescriptionDetail extends JobDescriptionItem {
  summary: string | null;
  reports_to: string | null;
  qualifications: string | null;
  kras: KRA[];
  kpis: KPI[];
}

const JDTab = ({
  viewType,
  setViewType,
  onViewDetail,
  onEditJD,
  onCreateManual,
}: {
  viewType: "grid" | "list";
  setViewType: (val: "grid" | "list") => void;
  onViewDetail: (id: number) => void;
  onEditJD: (id: number) => void;
  onCreateManual: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJDs, setSelectedJDs] = useState<string[]>([]);
  const [jds, setJds] = useState<JobDescriptionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJDs = useCallback(async () => {
    try {
      setLoading(true);
      const url = getFullUrl(API_CONFIG.ENDPOINTS.JOB_DESCRIPTIONS);
      const response = await axios.get(url, {
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (response.data.success) {
        setJds(response.data.data.job_descriptions);
      } else {
        toast.error("Failed to fetch job descriptions");
      }
    } catch (error) {
      console.error("Error fetching job descriptions:", error);
      toast.error("An error occurred while fetching job descriptions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJDs();
  }, [fetchJDs]);

  const handleDeleteJD = async (id: number) => {
    if (
      !window.confirm("Are you sure you want to archive this Job Description?")
    )
      return;

    try {
      const url = getFullUrl(`${API_CONFIG.ENDPOINTS.JD_DETAIL}/${id}.json`);
      const response = await axios.delete(url, {
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (response.data.success) {
        toast.success("Job Description archived successfully");
        fetchJDs();
      } else {
        toast.error(response.data.message || "Failed to archive JD");
      }
    } catch (error) {
      console.error("Error deleting JD:", error);
      toast.error("An error occurred while deleting JD");
    }
  };

  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [userCountFilter, setUserCountFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  const filteredJDs = useMemo(() => {
    return jds.filter((jd) => {
      const matchesSearch =
        !searchTerm ||
        jd.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (jd.department?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);

      const matchesAssignment =
        assignmentFilter === "all" ||
        (assignmentFilter === "assigned" && (jd.users_count || 0) > 0) ||
        (assignmentFilter === "unassigned" && (jd.users_count || 0) === 0);

      const matchesUserCount =
        userCountFilter === "all" ||
        (userCountFilter === "0" && (jd.users_count || 0) === 0) ||
        (userCountFilter === "1-5" &&
          (jd.users_count || 0) >= 1 &&
          (jd.users_count || 0) <= 5) ||
        (userCountFilter === "6+" && (jd.users_count || 0) >= 6);

      const matchesDept =
        deptFilter === "all" ||
        jd.department?.toLowerCase() === deptFilter.toLowerCase();

      return matchesSearch && matchesAssignment && matchesUserCount && matchesDept;
    });
  }, [jds, searchTerm, assignmentFilter, userCountFilter, deptFilter]);

  // Extract unique departments for the filter
  const departments = useMemo(() => {
    const depts = new Set(jds.map((jd) => jd.department).filter(Boolean));
    return Array.from(depts);
  }, [jds]);

  // Column configuration for EnhancedTable
  const columns: ColumnConfig[] = [
    {
      key: "job_title",
      label: "Job Title",
      sortable: true,
      defaultVisible: true,
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      defaultVisible: true,
    },
    {
      key: "experience_level",
      label: "Experience",
      sortable: true,
      defaultVisible: true,
    },
    {
      key: "employment_type",
      label: "Type",
      sortable: true,
      defaultVisible: true,
    },
    { key: "status", label: "Status", sortable: true, defaultVisible: true },
    { key: "kpis_count", label: "KPIs", sortable: true, defaultVisible: true },
    { key: "kras_count", label: "KRAs", sortable: true, defaultVisible: true },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
      defaultVisible: true,
    },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJDs(filteredJDs.map((jd) => jd.id.toString()));
    } else {
      setSelectedJDs([]);
    }
  };

  const handleSelectJD = (jdId: string, checked: boolean) => {
    if (checked) {
      setSelectedJDs((prev) => [...prev, jdId]);
    } else {
      setSelectedJDs((prev) => prev.filter((id) => id !== jdId));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-800 border-green-200",
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      archived: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge
        className={`px-2 py-1 text-xs font-semibold border capitalize ${statusColors[statusLower] || "bg-gray-100 text-gray-800 border-gray-200"}`}
      >
        {status}
      </Badge>
    );
  };

  // Custom cell renderer for EnhancedTable
  const renderCell = (item: JobDescriptionItem, columnKey: string) => {
    switch (columnKey) {
      case "job_title":
        return (
          <span className="font-bold text-blue-600 cursor-pointer hover:underline">
            {item.job_title}
          </span>
        );
      case "department":
        return (
          <span className="text-sm font-medium text-slate-500">
            {item.department || "General"}
          </span>
        );
      case "experience_level":
      case "employment_type":
        return (
          <span className="text-sm font-medium text-slate-600 capitalize">
            {item[columnKey as keyof JobDescriptionItem]
              ?.toString()
              .replace("_", " ")}
          </span>
        );
      case "status":
        return getStatusBadge(item.status);
      case "kpis_count":
      case "kras_count":
        return (
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="bg-slate-50 text-slate-600 font-bold border-slate-200"
            >
              {item[columnKey as keyof JobDescriptionItem] || 0}
            </Badge>
          </div>
        );
      case "created_at":
        return (
          <span className="text-sm text-slate-500 font-medium">
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        );
      default:
        return item[columnKey as keyof JobDescriptionItem]?.toString() || "";
    }
  };

  // Actions renderer for EnhancedTable
  const renderActions = (item: JobDescriptionItem) => {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
          title="Delete"
          onClick={() => handleDeleteJD(item.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 font-poppins">
          Job Descriptions
        </h1>

        <div className="flex items-center gap-3">
          <Button
            className="bg-[#C72030] hover:bg-red-700 text-white px-4 py-2 flex items-center gap-2 rounded-none"
            onClick={onCreateManual}
          >
            <Plus className="w-4 h-4" />
            Create Manual
          </Button>

          <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setViewType("grid")}
              className={`p-2 rounded transition-all ${viewType === "grid" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`p-2 rounded transition-all ${viewType === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-48">
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept || ""}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={userCountFilter} onValueChange={setUserCountFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Counts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counts</SelectItem>
              <SelectItem value="0">0 Users</SelectItem>
              <SelectItem value="1-5">1-5 Users</SelectItem>
              <SelectItem value="6+">6+ Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Table / Grid View */}
      {viewType === "list" ? (
        <EnhancedTable
          data={filteredJDs}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          selectable={true}
          selectedItems={selectedJDs}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectJD}
          getItemId={(item) => item.id.toString()}
          enableSearch={true}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search job titles..."
          enableExport={true}
          exportFileName="job-descriptions"
          emptyMessage="No job descriptions yet"
          className="bg-white rounded-lg border overflow-hidden"
          loading={loading}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="animate-pulse border-slate-200">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-slate-100 rounded w-20"></div>
                      <div className="h-8 bg-slate-100 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : filteredJDs.length > 0 ? (
            filteredJDs.map((jd) => (
              <Card
                key={jd.id}
                className="border-slate-200 hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3
                      className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
                      onClick={() => onViewDetail(jd.id)}
                    >
                      {jd.job_title}
                    </h3>
                    {getStatusBadge(jd.status)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Users className="w-4 h-4" />
                      {jd.department || "General"}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <FileText className="w-4 h-4" />
                      {jd.experience_level.replace("_", " ")} •{" "}
                      {jd.employment_type.replace("_", " ")}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        KPIs
                      </span>
                      <span className="text-sm font-black text-emerald-600">
                        {jd.kpis_count}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-slate-100"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        KRAs
                      </span>
                      <span className="text-sm font-black text-blue-600">
                        {jd.kras_count}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-xs text-slate-400 font-medium italic">
                      Created: {new Date(jd.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                        onClick={() => onViewDetail(jd.id)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                        onClick={() => onEditJD(jd.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                        onClick={() => handleDeleteJD(jd.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-medium">
                No job descriptions found matching your criteria.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selection Info */}
      {selectedJDs.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          {selectedJDs.length} job description(s) selected
        </div>
      )}
    </div>
  );
};

const JDDetailView = ({
  id,
  onBack,
  onEdit,
}: {
  id: number;
  onBack: () => void;
  onEdit: (id: number) => void;
}) => {
  const [detail, setDetail] = useState<JobDescriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJDDetail = useCallback(async () => {
    try {
      setLoading(true);
      const url = getFullUrl(`${API_CONFIG.ENDPOINTS.JD_DETAIL}/${id}.json`);
      const response = await axios.get(url, {
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (response.data.success) {
        setDetail(response.data.data);
      } else {
        toast.error("Failed to fetch job description details");
      }
    } catch (error) {
      console.error("Error fetching JD details:", error);
      toast.error("An error occurred while fetching JD details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJDDetail();
  }, [fetchJDDetail]);

  const [availableKPIs, setAvailableKPIs] = useState<KPI[]>([]);
  const [linking, setLinking] = useState(false);
  const [showLinkSelector, setShowLinkSelector] = useState(false);

  const fetchAvailableKPIs = async () => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.KPIS);
      const response = await axios.get(url, {
        headers: { Authorization: getAuthHeader() },
      });
      if (response.data.success) {
        // Filter out already linked KPIs
        const linkedIds = new Set(detail?.kpis.map((k) => k.id));
        const unlinked = response.data.data.kpis.filter(
          (k: KPI) => !linkedIds.has(k.id)
        );
        setAvailableKPIs(unlinked);
      }
    } catch (error) {
      console.error("Error fetching available KPIs:", error);
    }
  };

  const handleLinkKPI = async (kpiId: number) => {
    try {
      setLinking(true);
      const url = getFullUrl(
        `${API_CONFIG.ENDPOINTS.JD_DETAIL}/${id}/link_kpi.json`
      );
      const response = await axios.post(
        url,
        { kpi_id: kpiId },
        {
          headers: { Authorization: getAuthHeader() },
        }
      );

      if (response.data.success) {
        toast.success("KPI linked successfully!");
        setShowLinkSelector(false);
        fetchJDDetail();
      } else {
        toast.error(response.data.message || "Failed to link KPI");
      }
    } catch (error) {
      console.error("Error linking KPI:", error);
      toast.error("An error occurred while linking KPI");
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkKPI = async (kpiId: number) => {
    if (!window.confirm("Are you sure you want to unlink this KPI?")) return;

    try {
      const url = getFullUrl(
        `${API_CONFIG.ENDPOINTS.JD_DETAIL}/${id}/unlink_kpi?kpi_id=${kpiId}`
      );
      const response = await axios.delete(url, {
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (response.data.success) {
        toast.success("KPI unlinked successfully");
        fetchJDDetail();
      } else {
        toast.error(response.data.message || "Failed to unlink KPI");
      }
    } catch (error) {
      console.error("Error unlinking KPI:", error);
      toast.error("An error occurred while unlinking KPI");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-8 text-center text-slate-500">
        Job description not found.
        <Button onClick={onBack} variant="outline" className="ml-4">
          Back
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-800 border-green-200",
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      archived: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge
        className={`px-3 py-1 text-sm font-bold border capitalize ${statusColors[statusLower] || "bg-gray-100 text-gray-800 border-gray-200"}`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Detail Header */}
      <div className="flex items-start justify-between bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-start gap-6">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-12 w-12 p-0 border-slate-200 hover:bg-slate-50 transition-all"
            onClick={onBack}
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </Button>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {detail.job_title}
              </h1>
              {getStatusBadge(detail.status)}
            </div>
            <div className="flex items-center gap-6 text-slate-500">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <span className="font-bold">
                  {detail.department || "General"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                <span className="font-bold capitalize">
                  {detail.experience_level.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-500" />
                <span className="font-bold">
                  Created {new Date(detail.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-12 px-6 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            onClick={() => {
              setShowLinkSelector(true);
              fetchAvailableKPIs();
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Link KPI
          </Button>
          <Button className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200">
            <Copy className="w-4 h-4 mr-2" />
            Clone JD
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Core Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          <Card className="border-none shadow-sm overflow-hidden bg-white rounded-3xl">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Job Summary
                </h3>
              </div>
              <p className="text-slate-600 font-medium text-lg leading-relaxed whitespace-pre-wrap italic bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                "{detail.summary || "No summary provided."}"
              </p>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-3">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                    Reports To
                  </p>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-700">
                      {detail.reports_to || "Not specified"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                    Employment Type
                  </p>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-700 capitalize">
                      {detail.employment_type.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                  Preferred Qualifications
                </p>
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 font-medium text-slate-600 whitespace-pre-wrap">
                  {detail.qualifications || "No qualifications specified."}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KRAs Section */}
          <Card className="border-none shadow-sm overflow-hidden bg-white rounded-3xl">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Key Result Areas (KRAs)
                  </h3>
                </div>
                <Badge
                  variant="secondary"
                  className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-bold border-emerald-100"
                >
                  {detail.kras.length} Result Areas
                </Badge>
              </div>

              <div className="bg-slate-50/30 rounded-3xl border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100/50 hover:bg-slate-100/50 border-slate-100">
                      <TableHead className="w-[80px] font-black text-slate-500 uppercase tracking-wider text-[10px] pl-6 py-4">
                        Pos
                      </TableHead>
                      <TableHead className="font-black text-slate-500 uppercase tracking-wider text-[10px] py-4">
                        Description
                      </TableHead>
                      <TableHead className="w-[120px] font-black text-slate-500 uppercase tracking-wider text-[10px] text-center py-4">
                        Daily
                      </TableHead>
                      <TableHead className="w-[120px] font-black text-slate-500 uppercase tracking-wider text-[10px] text-center py-4">
                        Weekly
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detail.kras.length > 0 ? (
                      detail.kras.map((kra) => (
                        <TableRow
                          key={kra.id}
                          className="hover:bg-white transition-colors border-slate-50 group"
                        >
                          <TableCell className="pl-6 font-black text-slate-400 group-hover:text-blue-500 transition-colors">
                            #{kra.position}
                          </TableCell>
                          <TableCell className="font-bold text-slate-700 py-6 text-base">
                            {kra.description}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              {kra.track_daily ? (
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                                  <CheckSquare className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center">
                                  <ChevronDown className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              {kra.track_weekly ? (
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                                  <CheckSquare className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center">
                                  <ChevronDown className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-32 text-center text-slate-400 font-medium"
                        >
                          No KRAs assigned yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - KPIs */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm overflow-hidden bg-white rounded-3xl h-full">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">KPIs</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-violet-600"
                    onClick={() => {
                      setShowLinkSelector(!showLinkSelector);
                      if (!showLinkSelector) fetchAvailableKPIs();
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Badge
                    variant="secondary"
                    className="px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 font-bold border-violet-100"
                  >
                    {detail.kpis.length} Indicators
                  </Badge>
                </div>
              </div>

              {showLinkSelector && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Select KPI to Link
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setShowLinkSelector(false)}
                    >
                      <ChevronDown className="w-3 h-3 rotate-180" />
                    </Button>
                  </div>
                  {availableKPIs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {availableKPIs.map((kpi) => (
                        <div
                          key={kpi.id}
                          onClick={() => handleLinkKPI(kpi.id)}
                          className="p-3 bg-white border border-slate-100 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-700 group-hover:text-violet-700">
                              {kpi.name}
                            </p>
                            <p className="text-[9px] text-slate-400">
                              {kpi.category}
                            </p>
                          </div>
                          <Plus className="w-3 h-3 text-slate-300 group-hover:text-violet-500" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic py-2">
                      No unlinked KPIs available.
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {detail.kpis.length > 0 ? (
                  detail.kpis.map((kpi) => (
                    <div
                      key={kpi.id}
                      className="p-5 border border-slate-100 rounded-3xl hover:shadow-md hover:border-blue-200 transition-all group bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-slate-800 text-lg group-hover:text-blue-600 transition-colors uppercase leading-tight tracking-tight">
                            {kpi.name}
                          </h4>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Badge className="bg-slate-100 text-slate-500 font-bold border-none px-2 rounded-lg text-[10px]">
                              {kpi.category}
                            </Badge>
                            <Badge className="bg-blue-50 text-blue-500 font-bold border-none px-2 rounded-lg text-[10px] capitalize">
                              {kpi.frequency}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                              Target
                            </p>
                            <p className="text-xl font-black text-slate-900 leading-tight">
                              {kpi.unit === "₹"
                                ? `₹${kpi.target_value}`
                                : `${kpi.target_value}${kpi.unit === "percent" ? "%" : ""}`}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-300 hover:text-red-600 transition-colors"
                            onClick={() => handleUnlinkKPI(kpi.id)}
                            title="Unlink KPI"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Simple progress track */}
                      <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-wider text-slate-400">
                          <span>Progress</span>
                          <span className="text-blue-600">
                            {(
                              (parseFloat(kpi.current_value) /
                                parseFloat(kpi.target_value)) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                          <div
                            className="h-full bg-blue-500 rounded-full shadow-inner transition-all duration-1000"
                            style={{
                              width: `${Math.min(100, (parseFloat(kpi.current_value) / parseFloat(kpi.target_value)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">
                      No KPIs defined for this role.
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 font-black"
                      onClick={() => {
                        setShowLinkSelector(true);
                        fetchAvailableKPIs();
                      }}
                    >
                      Assign KPIs
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SampleJDsTab = ({
  viewType,
  setViewType,
}: {
  viewType: string;
  setViewType: (val: "grid" | "list") => void;
}) => {
  const samples = [
    {
      title: "Academic Coordinator",
      tags: ["Academics", "Education"],
      kpis: "5 KPIs",
      highlights: [
        "Ensure 100% curriculum coverage on schedule",
        "Improve average teacher performance scores by 15%",
      ],
      industry: "Education",
    },
    {
      title: "Account Manager",
      tags: ["Client Services", "Services"],
      kpis: "5 KPIs",
      highlights: [
        "Achieve 100% client retention target",
        "Identify and close upsell opportunities worth 20% growth",
      ],
      industry: "Services",
    },
    {
      title: "Accountant",
      tags: ["Finance", "Other"],
      kpis: "5 KPIs",
      highlights: [],
      industry: "Finance",
    },
    {
      title: "Admissions Counselor",
      tags: ["Admissions", "Education"],
      kpis: "5 KPIs",
      highlights: [],
      industry: "Education",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
          Sample Job Descriptions
        </h3>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100/80 p-1.5 rounded-xl flex gap-1 shadow-inner border border-slate-200/40">
            <button
              onClick={() => setViewType("grid")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewType === "grid"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewType === "list"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1.5">
          <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
            Search Job Titles
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by job title..."
              className="pl-12 h-14 border-slate-200 bg-white shadow-sm text-lg font-medium rounded-2xl focus:ring-orange-200 focus:border-orange-400"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
            Filter by Industry
          </label>
          <Select>
            <SelectTrigger className="h-14 border-slate-200 bg-white shadow-sm text-lg font-medium rounded-2xl">
              <SelectValue placeholder="Select industry..." />
            </SelectTrigger>
            <SelectContent className="border-none shadow-2xl p-2 rounded-xl">
              <SelectItem value="edu" className="py-3 rounded-lg font-bold">
                Education
              </SelectItem>
              <SelectItem value="srv" className="py-3 rounded-lg font-bold">
                Services
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {samples.map((sample, i) => (
          <Card
            key={i}
            className="border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group bg-white hover:-translate-y-1 flex flex-col border-l-4 border-l-blue-500/0 hover:border-l-blue-500"
          >
            <CardContent className="p-8 space-y-6 flex-1 relative">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      className="w-6 h-6 rounded-lg border-2 border-slate-200 text-orange-600 focus:ring-orange-500 transition-all cursor-pointer"
                    />
                    <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {sample.title}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sample.tags.map((tag, j) => (
                      <Badge
                        key={j}
                        variant="secondary"
                        className={cn(
                          "px-4 py-1.5 rounded-full font-bold text-sm",
                          j === 0
                            ? "bg-blue-50 text-blue-600"
                            : "bg-slate-100/50 text-slate-500"
                        )}
                      >
                        {tag}
                      </Badge>
                    ))}
                    <Badge
                      variant="secondary"
                      className="px-4 py-1.5 rounded-full font-bold text-sm bg-purple-50 text-purple-600 flex items-center gap-1.5 shadow-sm"
                    >
                      <BrainCircuit className="w-3.5 h-3.5" />
                      {sample.kpis}
                    </Badge>
                  </div>
                </div>
                <Button className="h-10 px-6 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-violet-100">
                  <Copy className="w-4 h-4" />
                  Use
                </Button>
              </div>

              {sample.highlights.length > 0 && (
                <div className="space-y-3 pt-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Key Highlights
                  </p>
                  <ul className="space-y-3">
                    {sample.highlights.map((point, k) => (
                      <li
                        key={k}
                        className="flex gap-4 text-base font-bold text-slate-600 leading-relaxed group/li"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0 group-hover/li:scale-150 transition-transform" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-wider hover:gap-3 transition-all mt-4">
                Show Full Description
                <ChevronDown className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const JDForm = ({
  id,
  onBack,
  onSuccess,
}: {
  id?: number;
  onBack: () => void;
  onSuccess: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Basic Form State
  const [formData, setFormData] = useState({
    job_title: "",
    department: "",
    experience_level: "junior",
    employment_type: "full_time",
    status: "active",
    summary: "",
    reports_to: "",
    qualifications: "",
  });

  // KRAs State
  const [kras, setKras] = useState<Partial<KRA>[]>([
    { description: "", track_daily: false, track_weekly: true, position: 1 },
  ]);

  // KPIs State
  const [kpis, setKpis] = useState<Partial<KPI>[]>([
    {
      name: "",
      category: "Operations",
      unit: "percent",
      frequency: "monthly",
      target_value: "0",
      current_value: "0",
    },
  ]);

  useEffect(() => {
    if (id) {
      const fetchJDDetail = async () => {
        try {
          setFetching(true);
          const url = getFullUrl(
            `${API_CONFIG.ENDPOINTS.JD_DETAIL}/${id}.json`
          );
          const response = await axios.get(url, {
            headers: {
              Authorization: getAuthHeader(),
            },
          });

          if (response.data.success) {
            const data = response.data.data;
            setFormData({
              job_title: data.job_title || "",
              department: data.department || "",
              experience_level: data.experience_level || "junior",
              employment_type: data.employment_type || "full_time",
              status: data.status || "active",
              summary: data.summary || "",
              reports_to: data.reports_to || "",
              qualifications: data.qualifications || "",
            });
            setKras(
              data.kras.length > 0
                ? data.kras
                : [
                    {
                      description: "",
                      track_daily: false,
                      track_weekly: true,
                      position: 1,
                    },
                  ]
            );
            setKpis(
              data.kpis.length > 0
                ? data.kpis
                : [
                    {
                      name: "",
                      category: "Operations",
                      unit: "percent",
                      frequency: "monthly",
                      target_value: "0",
                      current_value: "0",
                    },
                  ]
            );
          }
        } catch (error) {
          console.error("Error fetching JD for edit:", error);
          toast.error("Failed to load job description for editing");
        } finally {
          setFetching(false);
        }
      };
      fetchJDDetail();
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addKRA = () => {
    setKras([
      ...kras,
      {
        description: "",
        track_daily: false,
        track_weekly: true,
        position: kras.length + 1,
      },
    ]);
  };

  const removeKRA = (index: number) => {
    setKras(kras.filter((_, i) => i !== index));
  };

  const updateKRA = (index: number, field: keyof KRA, value: any) => {
    const newKras = [...kras];
    newKras[index] = { ...newKras[index], [field]: value };
    setKras(newKras);
  };

  const addKPI = () => {
    setKpis([
      ...kpis,
      {
        name: "",
        category: "Operations",
        unit: "percent",
        frequency: "monthly",
        target_value: "0",
        current_value: "0",
      },
    ]);
  };

  const removeKPI = (index: number) => {
    setKpis(kpis.filter((_, i) => i !== index));
  };

  const updateKPI = (index: number, field: keyof KPI, value: any) => {
    const newKpis = [...kpis];
    newKpis[index] = { ...newKpis[index], [field]: value };
    setKpis(newKpis);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
        kras: kras.filter((k) => k.description?.trim()),
        kpis: kpis.filter((k) => k.name?.trim()),
      };

      const url = id
        ? getFullUrl(`${API_CONFIG.ENDPOINTS.JD_DETAIL}/${id}.json`)
        : getFullUrl(API_CONFIG.ENDPOINTS.JOB_DESCRIPTIONS);

      const method = id ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: payload,
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (response.data.success) {
        toast.success(
          `Job Description ${id ? "updated" : "created"} successfully!`
        );
        onSuccess();
      } else {
        toast.error(
          response.data.message || `Failed to ${id ? "update" : "create"} JD`
        );
      }
    } catch (error) {
      console.error(`Error ${id ? "updating" : "creating"} JD:`, error);
      toast.error(`An error occurred while ${id ? "updating" : "creating"} JD`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 font-work-sans">
      {/* Creation Header */}
      <div className="bg-white p-6 rounded-none shadow-none border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="h-10 w-10 border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center rounded-none"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-bold text-slate-900">
                {id ? "Update" : "Create New"} Job Description
              </h1>
              <p className="text-slate-500 font-medium text-sm">
                Step {step} of 3:{" "}
                {step === 1
                  ? "Basic Details"
                  : step === 2
                    ? "Key Result Areas"
                    : "Performance Indicators"}
              </p>
            </div>
          </div>
          <div className="flex gap-2 invisible">
            {/* Keeping spacing structure but making top buttons invisible as they move to bottom */}
            <Button variant="outline" className="h-10 px-6 rounded-none">Cancel</Button>
          </div>
        </div>
      </div>

      {/* Progress Stepper - Flat Style */}
      <div className="bg-white border border-slate-200 px-6 py-4 flex items-center gap-4 rounded-none">
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-none flex items-center justify-center font-bold text-sm",
                  step === num
                    ? "bg-[#C72030] text-white"
                    : step > num
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                )}
              >
                {step > num ? <CheckSquare className="w-4 h-4" /> : num}
              </div>
              <span
                className={cn(
                  "text-sm font-bold uppercase tracking-tight",
                  step === num ? "text-slate-900" : "text-slate-400"
                )}
              >
                {num === 1 ? "Details" : num === 2 ? "KRAs" : "KPIs"}
              </span>
            </div>
            {num < 3 && (
              <div
                className={cn(
                  "h-[1px] flex-1",
                  step > num ? "bg-emerald-400" : "bg-slate-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {step === 1 && (
          <div className="bg-white rounded-none shadow-none border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4 text-[#C72030]" />
                Role Information
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">
                    Job Title
                  </label>
                  <Input
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Software Engineer"
                    className="h-11 border-slate-200 rounded-none text-base font-medium bg-white focus:border-[#C72030] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">
                    Department
                  </label>
                  <Input
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Engineering"
                    className="h-11 border-slate-200 rounded-none text-base font-medium bg-white focus:border-[#C72030] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">
                    Experience Level
                  </label>
                  <Select
                    value={formData.experience_level}
                    onValueChange={(v) =>
                      handleSelectChange("experience_level", v)
                    }
                  >
                    <SelectTrigger className="h-11 border-slate-200 rounded-none text-base font-medium bg-white focus:border-[#C72030] transition-colors">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border shadow-lg p-1">
                      <SelectItem
                        value="intern"
                        className="rounded-none font-bold"
                      >
                        Intern
                      </SelectItem>
                      <SelectItem
                        value="junior"
                        className="rounded-none font-bold"
                      >
                        Junior
                      </SelectItem>
                      <SelectItem
                        value="mid"
                        className="rounded-none font-bold"
                      >
                        Mid-Level
                      </SelectItem>
                      <SelectItem
                        value="senior"
                        className="rounded-none font-bold"
                      >
                        Senior
                      </SelectItem>
                      <SelectItem
                        value="lead"
                        className="rounded-none font-bold"
                      >
                        Lead
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">
                    Employment Type
                  </label>
                  <Select
                    value={formData.employment_type}
                    onValueChange={(v) =>
                      handleSelectChange("employment_type", v)
                    }
                  >
                    <SelectTrigger className="h-11 border-slate-200 rounded-none text-base font-medium bg-white focus:border-[#C72030] transition-colors">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border shadow-lg p-1">
                      <SelectItem
                        value="full_time"
                        className="rounded-none font-bold"
                      >
                        Full Time
                      </SelectItem>
                      <SelectItem
                        value="part_time"
                        className="rounded-none font-bold"
                      >
                        Part Time
                      </SelectItem>
                      <SelectItem
                        value="contract"
                        className="rounded-none font-bold"
                      >
                        Contract
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">
                  Reports To
                </label>
                <Input
                  name="reports_to"
                  value={formData.reports_to}
                  onChange={handleInputChange}
                  placeholder="e.g. Engineering Manager"
                  className="h-11 border-slate-200 rounded-none text-base font-medium bg-white focus:border-[#C72030] shadow-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">
                  Job Summary
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-4 border border-slate-200 rounded-none text-base font-medium bg-white focus:border-[#C72030] outline-none transition-all resize-none"
                  placeholder="Provide a high-level overview of the role..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-0.5">
                  Qualifications
                </label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-4 border border-slate-200 rounded-none text-base font-medium bg-white focus:border-[#C72030] outline-none transition-all resize-none"
                  placeholder="Key skills, education, and experience required..."
                />
              </div>
            </CardContent>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-none shadow-none border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#C72030]" />
                Key Result Areas
              </h3>
              <Button
                variant="outline"
                onClick={addKRA}
                className="h-9 border-slate-200 font-bold rounded-none hover:bg-slate-50"
              >
                <Plus className="w-3 h-3 mr-2" />
                Add KRA
              </Button>
            </div>
            <CardContent className="p-6 space-y-4">
              {kras.map((kra, index) => (
                <div
                  key={index}
                  className="p-4 border border-slate-100 rounded-none bg-slate-50/30 space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-none bg-slate-900 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <textarea
                      value={kra.description}
                      onChange={(e) =>
                        updateKRA(index, "description", e.target.value)
                      }
                      placeholder="KRA Description..."
                      className="flex-1 p-2 bg-transparent border-b border-slate-200 focus:border-[#C72030] focus:ring-0 text-base font-medium text-slate-700 placeholder-slate-300 resize-none outline-none"
                      rows={2}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-red-500 rounded-none p-1"
                      onClick={() => removeKRA(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-6 pl-12">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        updateKRA(index, "track_daily", !kra.track_daily)
                      }
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-none border flex items-center justify-center transition-all",
                          kra.track_daily
                            ? "bg-[#C72030] border-[#C72030] text-white"
                            : "border-slate-300 bg-white"
                        )}
                      >
                        {kra.track_daily && <CheckSquare className="w-3 h-3" />}
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Track Daily
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        updateKRA(index, "track_weekly", !kra.track_weekly)
                      }
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-none border flex items-center justify-center transition-all",
                          kra.track_weekly
                            ? "bg-[#C72030] border-[#C72030] text-white"
                            : "border-slate-300 bg-white"
                        )}
                      >
                        {kra.track_weekly && (
                          <CheckSquare className="w-3 h-3" />
                        )}
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Track Weekly
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-none shadow-none border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#C72030]" />
                Key Performance Indicators
              </h3>
              <Button
                variant="outline"
                onClick={addKPI}
                className="h-9 border-slate-200 font-bold rounded-none hover:bg-slate-50"
              >
                <Plus className="w-3 h-3 mr-2" />
                Add KPI
              </Button>
            </div>
            <CardContent className="p-6 space-y-6">
              {kpis.map((kpi, index) => (
                <div
                  key={index}
                  className="p-6 border border-slate-200 rounded-none bg-slate-50/30 space-y-5 relative"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">
                        KPI Name
                      </label>
                      <Input
                        value={kpi.name}
                        onChange={(e) =>
                          updateKPI(index, "name", e.target.value)
                        }
                        placeholder="e.g. Sales Conversion Rate"
                        className="h-10 border-slate-200 rounded-none text-base font-bold bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">
                        Category
                      </label>
                      <Select
                        value={kpi.category}
                        onValueChange={(v) => updateKPI(index, "category", v)}
                      >
                        <SelectTrigger className="h-10 border-slate-200 rounded-none text-base font-bold bg-white">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border shadow-lg p-1">
                          <SelectItem
                            value="Operations"
                            className="rounded-none font-bold"
                          >
                            Operations
                          </SelectItem>
                          <SelectItem
                            value="Sales"
                            className="rounded-none font-bold"
                          >
                            Sales
                          </SelectItem>
                          <SelectItem
                            value="Finance"
                            className="rounded-none font-bold"
                          >
                            Finance
                          </SelectItem>
                          <SelectItem
                            value="Culture"
                            className="rounded-none font-bold"
                          >
                            Culture
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">
                          Unit
                        </label>
                        <Select
                          value={kpi.unit}
                          onValueChange={(v) => updateKPI(index, "unit", v)}
                        >
                          <SelectTrigger className="h-10 border-slate-200 rounded-none text-base font-bold bg-white">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border shadow-lg p-1">
                            <SelectItem
                              value="percent"
                              className="rounded-none font-bold"
                            >
                              Percentage (%)
                            </SelectItem>
                            <SelectItem
                              value="amount"
                              className="rounded-none font-bold"
                            >
                              Amount (₹)
                            </SelectItem>
                            <SelectItem
                              value="number"
                              className="rounded-none font-bold"
                            >
                              Number (#)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">
                          Frequency
                        </label>
                        <Select
                          value={kpi.frequency}
                          onValueChange={(v) =>
                            updateKPI(index, "frequency", v)
                          }
                        >
                          <SelectTrigger className="h-10 border-slate-200 rounded-none text-base font-bold bg-white">
                            <SelectValue placeholder="Frequency" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border shadow-lg p-1">
                            <SelectItem
                              value="daily"
                              className="rounded-none font-bold"
                            >
                              Daily
                            </SelectItem>
                            <SelectItem
                              value="weekly"
                              className="rounded-none font-bold"
                            >
                              Weekly
                            </SelectItem>
                            <SelectItem
                              value="monthly"
                              className="rounded-none font-bold"
                            >
                              Monthly
                            </SelectItem>
                            <SelectItem
                              value="quarterly"
                              className="rounded-none font-bold"
                            >
                              Quarterly
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">
                        Target Value
                      </label>
                      <Input
                        type="number"
                        value={kpi.target_value}
                        onChange={(e) =>
                          updateKPI(index, "target_value", e.target.value)
                        }
                        className="h-10 border-slate-200 rounded-none text-base font-black bg-white text-slate-900"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500 rounded-none p-1"
                    onClick={() => removeKPI(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </div>
        )}
      </div>

      {/* Centered Bottom Action Buttons */}
      <div className="flex justify-center gap-4 py-8 border-t border-slate-100 bg-white/50 backdrop-blur-sm sticky bottom-0 z-10 w-full mt-8">
        <Button
          variant="outline"
          className="h-12 px-10 rounded-none border-slate-200 font-bold text-slate-600 hover:bg-white shadow-sm transition-all"
          onClick={onBack}
        >
          Cancel
        </Button>
        {step < 3 ? (
          <Button
            className="h-12 px-10 rounded-none bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-200 flex items-center gap-2 transition-all active:scale-95"
            onClick={() => setStep(step + 1)}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            className="h-12 px-10 rounded-none bg-[#C72030] hover:bg-red-800 text-white font-bold shadow-lg shadow-red-200 flex items-center gap-2 transition-all active:scale-95"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {id ? "Update & Sync JD" : "Save & Publish JD"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
