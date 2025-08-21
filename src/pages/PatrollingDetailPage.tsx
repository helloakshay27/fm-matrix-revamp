import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  MapPin,
  ListChecks,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  FileTextIcon,
  QrCode,
  Activity,
  Shield,
  Eye,
  Download,
  Info,
  Plus,
  AlertCircle,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { toast } from "sonner";
import { DeletePatrollingModal } from "@/components/DeletePatrollingModal";

// Type definitions matching the API response
interface ChecklistData {
  id: number;
  name: string;
  check_type: string;
  snag_audit_category_id: number;
  company_id: number;
  user_id: number;
  active: number;
  created_at: string;
  updated_at: string;
}

interface QuestionData {
  id: number;
  task: string;
  type: string;
  mandatory: boolean;
  qnumber: number;
  options: string[];
  created_at: string;
  updated_at: string;
}

interface CronSetting {
  id: number;
  cron_period: string | null;
  cron_dom: string | null;
  cron_month: string | null;
  cron_mins: string | null;
  cron_dow: string | null;
  cron_time_hour: string | null;
  cron_time_min: string | null;
  cron_of: string;
  cron_of_id: number;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  cron_expression: string;
}

interface ScheduleData {
  id: number;
  assigned_guard_id: number;
  assigned_guard_name?: string;
  supervisor_name?: string;
  supervisor_id: number;
  active: boolean;
  cron_setting?: CronSetting;
  created_at: string;
  updated_at: string;
  name?: string; // Optional as it might not be in the actual API response
  frequency_type?: string; // Optional as it might not be in the actual API response
  start_time?: string; // Optional as it might not be in the actual API response
  end_time?: string; // Optional as it might not be in the actual API response
}

interface CheckpointData {
  id: number;
  name: string;
  description: string;
  order_sequence: number;
  building_id: number | null;
  wing_id: number | null;
  floor_id: number | null;
  room_id: number | null;
  area_id?: number | null;
  area_name?: string;
  estimated_time_minutes: number;
  snag_checklist_id?: number | null;
  schedule_ids?: number[];
  created_at: string;
  updated_at: string;
  qr_code_available: boolean;
  qr_code_url?: string;
  building_name?: string;
  wing_name?: string;
  floor_name?: string;
  room_name?: string;
}

interface PatrollingDetail {
  id: number;
  name: string;
  description: string;
  estimated_duration_minutes: number;
  auto_ticket: boolean;
  validity_start_date: string;
  validity_end_date: string;
  grace_period_minutes: number;
  active: boolean;
  resource_type: string;
  resource_id: number;
  created_by_id: number;
  created_at: string;
  updated_at: string;
  checklist?: ChecklistData | null;
  questions: QuestionData[];
  schedules: ScheduleData[];
  checkpoints: CheckpointData[];
  recent_sessions: any[];
  summary: {
    questions_count: number;
    schedules_count: number;
    checkpoints_count: number;
    recent_sessions_count: number;
    total_sessions_count: number;
  };
}

export const PatrollingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patrolling, setPatrolling] = useState<PatrollingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("patrol-information");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State for checklist questions when checklist is selected
  const [checklistQuestions, setChecklistQuestions] = useState<QuestionData[]>(
    []
  );
  const [loadingChecklistQuestions, setLoadingChecklistQuestions] =
    useState(false);

  useEffect(() => {
    if (id) {
      fetchPatrollingDetail(parseInt(id));
    }
  }, [id]);

  // Fetch checklist questions when patrolling has a checklist
  useEffect(() => {
    if (patrolling?.checklist?.id) {
      fetchChecklistQuestions(patrolling.checklist.id);
    }
  }, [patrolling?.checklist?.id]);

  const fetchChecklistQuestions = async (checklistId: number) => {
    setLoadingChecklistQuestions(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      if (!baseUrl || !token) {
        throw new Error("API configuration is missing");
      }

      const apiUrl = getFullUrl(
        `/pms/admin/snag_checklists/${checklistId}.json`
      );

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data?.snag_questions) {
        // Map checklist questions to the same format as patrolling questions
        const mappedQuestions = result.data.snag_questions.map(
          (q: any, index: number) => ({
            id: q.id,
            task: q.descr || q.task || "",
            type:
              q.qtype === "multiple"
                ? "multiple_choice"
                : q.qtype === "yesno"
                ? "yes_no"
                : q.qtype || "text",
            mandatory: !!q.quest_mandatory,
            qnumber: index + 1,
            options: q.snag_quest_options
              ? q.snag_quest_options.map((opt: any) => opt.qname || opt.name)
              : [],
            created_at: q.created_at || new Date().toISOString(),
            updated_at: q.updated_at || new Date().toISOString(),
          })
        );
        setChecklistQuestions(mappedQuestions);
      }
    } catch (error: any) {
      console.error("Error fetching checklist questions:", error);
      toast.error(`Failed to load checklist questions: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setLoadingChecklistQuestions(false);
    }
  };

  const fetchPatrollingDetail = async (patrollingId: number) => {
    setLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      if (!baseUrl || !token) {
        throw new Error("API configuration is missing");
      }

      const apiUrl = getFullUrl(`/patrolling/setup/${patrollingId}.json`);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setPatrolling(result.data);
      } else {
        throw new Error("Failed to fetch patrolling details");
      }
    } catch (error: any) {
      console.error("Error fetching patrolling details:", error);
      toast.error(`Failed to load patrolling details: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "—";
    try {
      return new Date(timeString).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const formatCronExpression = (cronExpression: string) => {
    if (!cronExpression) return null;

    try {
      // Parse cron expression: "minutes hours days months day-of-week"
      const parts = cronExpression.split(" ");
      if (parts.length !== 5) return null; // Return null if not standard format

      const [minutes, hours, days, months, dayOfWeek] = parts;

      const formatValue = (
        value: string,
        type: "minutes" | "hours" | "days" | "months" | "weekdays"
      ) => {
        if (value === "*") return "All";
        if (value === "?") return "Any";

        const items = value.split(",");

        if (type === "months" && items.length <= 12) {
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const monthList = items.map((m) => {
            const monthNum = parseInt(m);
            return monthNames[monthNum - 1] || m;
          });
          return monthList.join(", ");
        }

        if (type === "weekdays" && items.length <= 7) {
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const weekdayList = items.map((d) => {
            const dayNum = parseInt(d);
            return dayNames[dayNum] || d;
          });
          return weekdayList.join(", ");
        }

        if (type === "hours" && items.length <= 24) {
          return items.map((h) => h.padStart(2, "0")).join(", ");
        }

        if (type === "minutes" && items.length <= 60) {
          return items.map((m) => m.padStart(2, "0")).join(", ");
        }

        if (items.length <= 10) {
          return items.join(", ");
        }

        return `${items.length} values`;
      };

      return {
        hours: formatValue(hours, "hours"),
        minutes: formatValue(minutes, "minutes"),
        dayOfWeek: formatValue(dayOfWeek, "weekdays"),
        months: formatValue(months, "months"),
        days: formatValue(days, "days"),
      };
    } catch (error) {
      return null;
    }
  };

  const handleEdit = () => {
    navigate(`/security/patrolling/edit/${id}`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      if (!baseUrl || !token) {
        throw new Error("API configuration is missing");
      }

      const apiUrl = getFullUrl(`/patrolling/setup/${id}.json`);

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Patrolling deleted successfully!", {
        duration: 3000,
      });

      setIsDeleteModalOpen(false);
      navigate("/security/patrolling");
    } catch (error: any) {
      console.error("Error deleting patrolling:", error);
      toast.error(`Failed to delete patrolling: ${error.message}`, {
        duration: 5000,
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-2 text-gray-600">
            Loading patrolling details...
          </span>
        </div>
      </div>
    );
  }

  if (!patrolling) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">
            Patrolling not found
          </h2>
          <p className="text-gray-600 mt-2">
            The requested patrolling could not be found.
          </p>
          <Button
            onClick={() => navigate("/security/patrolling")}
            className="mt-4"
          >
            Back to Patrolling List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/security/patrolling")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patrolling List
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            Patrolling Details - {patrolling.name}
          </h1>
          <div className="flex gap-2">
            <Badge
              variant={patrolling.active ? "default" : "secondary"}
              className="mr-2"
            >
              {patrolling.active ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Inactive
                </>
              )}
            </Badge>
            <Button
              onClick={handleEdit}
              variant="outline"
              className="border-[#C72030] text-[#C72030]"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              style={{ backgroundColor: "#C72030" }}
              className="text-white hover:bg-[#C72030]/90"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-nowrap justify-start overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg h-auto p-0 text-sm">
            {[
              { label: "Patrol Information", value: "patrol-information" },
              { label: "Questions", value: "questions" },
              { label: "Schedules", value: "schedules" },
              { label: "Checkpoints", value: "checkpoints" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Patrol Information */}
          <TabsContent value="patrol-information" className="p-3 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-or-600" />
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-xl font-semibold">
                        {patrolling.grace_period_minutes} min
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <ListChecks className="w-8 h-8 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Questions</p>
                      <p className="text-xl font-semibold">
                        {patrolling.summary?.questions_count || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Schedules</p>
                      <p className="text-xl font-semibold">
                        {patrolling.summary?.schedules_count || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-8 h-8 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Checkpoints</p>
                      <p className="text-xl font-semibold">
                        {patrolling.summary?.checkpoints_count || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <Shield className="h-4 w-4" />
                  </div>
                  PATROL INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Name:</strong> {patrolling.name}
                  </div>
                  <div>
                    <strong>Description:</strong>{" "}
                    {patrolling.description || "—"}
                  </div>
                  <div>
                    <strong>Start Date:</strong>{" "}
                    {formatDate(patrolling.validity_start_date)}
                  </div>
                  <div>
                    <strong>End Date:</strong>{" "}
                    {formatDate(patrolling.validity_end_date)}
                  </div>
                  <div>
                    <strong>Grace Period:</strong>{" "}
                    {patrolling.grace_period_minutes} minutes
                  </div>

                  <div>
                    <strong>Status:</strong>
                    <Badge
                      variant={patrolling.active ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {patrolling.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <strong>Created on:</strong>{" "}
                    {formatDateTime(patrolling.created_at)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checklist Information */}
            {patrolling.checklist && (
              <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
                <CardHeader className="bg-[#F6F4EE] mb-6">
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                      <ListChecks className="h-4 w-4" />
                    </div>
                    CHECKLIST INFORMATION
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Checklist Name:</strong>{" "}
                      {patrolling.checklist.name}
                    </div>
                    <div>
                      <strong>Check Type:</strong>{" "}
                      {patrolling.checklist.check_type}
                    </div>

                    <div>
                      <strong>Status:</strong>
                      <Badge
                        variant={
                          patrolling.checklist.active ? "default" : "secondary"
                        }
                        className="ml-2"
                      >
                        {patrolling.checklist.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div>
                      <strong>Created on:</strong>{" "}
                      {formatDateTime(patrolling.checklist.created_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* QR Code Section */}
            {patrolling.checkpoints &&
              patrolling.checkpoints.some &&
              patrolling.checkpoints.some((cp) => cp.qr_code_available) && (
                <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
                  <CardHeader className="bg-[#F6F4EE] mb-6">
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                        <QrCode className="h-4 w-4" />
                      </div>
                      QR CODES (
                      {
                        patrolling.checkpoints.filter(
                          (cp) => cp.qr_code_available
                        ).length
                      }
                      )
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {patrolling.checkpoints
                        .filter((cp) => cp.qr_code_available)
                        .map((checkpoint) => (
                          <div
                            key={checkpoint.id}
                            className="p-4 border rounded-lg bg-white shadow-sm"
                          >
                            <div className="text-center">
                              <div className="mb-3">
                                <p className="font-medium text-sm">
                                  {checkpoint.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Order #{checkpoint.order_sequence}
                                </p>
                                <Badge
                                  variant="default"
                                  className="text-xs mt-1"
                                >
                                  <QrCode className="w-3 h-3 mr-1" />
                                  QR Available
                                </Badge>
                              </div>

                              {checkpoint.qr_code_url ? (
                                <div className="space-y-3">
                                  <div className="flex justify-center">
                                    <img
                                      src={checkpoint.qr_code_url}
                                      alt={`QR Code for ${checkpoint.name}`}
                                      className="w-32 h-32 object-contain border border-gray-200 rounded"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        e.currentTarget.nextElementSibling?.classList.remove(
                                          "hidden"
                                        );
                                      }}
                                    />
                                    <div className="hidden w-32 h-32 border border-gray-200 rounded flex items-center justify-center bg-gray-50">
                                      <div className="text-center">
                                        <QrCode className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                        <p className="text-xs text-gray-500">
                                          QR Code Error
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 justify-center">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        window.open(
                                          checkpoint.qr_code_url,
                                          "_blank"
                                        )
                                      }
                                      className="text-xs"
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      View
                                    </Button>
                                    {/* <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(checkpoint.qr_code_url!);
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `checkpoint_${checkpoint.id}_qr_code.png`;
                                        document.body.appendChild(a);
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                        document.body.removeChild(a);
                                        toast.success('QR Code downloaded successfully!');
                                      } catch (error) {
                                        toast.error('Failed to download QR Code');
                                      }
                                    }}
                                    className="text-xs"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                  </Button> */}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-32 h-32 border border-gray-200 rounded flex items-center justify-center bg-gray-50 mx-auto">
                                  <div className="text-center">
                                    <QrCode className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                    <p className="text-xs text-gray-500">
                                      QR Code Available
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      No URL provided
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <QrCode className="w-5 h-5 text-gray-600" />
                        <p className="text-sm font-medium text-gray-800">
                          QR Code Summary
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong>
                          {
                            patrolling.checkpoints.filter(
                              (cp) => cp.qr_code_available
                            ).length
                          }
                        </strong>{" "}
                        out of <strong>{patrolling.checkpoints.length}</strong>{" "}
                        checkpoints have QR codes available.
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Guards can scan these QR codes to check in at each
                        checkpoint during patrol.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
          </TabsContent>

          {/* Questions */}
          <TabsContent value="questions" className="p-3 sm:p-6">
            {patrolling.checklist && checklistQuestions.length > 0 ? (
              // Show checklist questions
              <>
                <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Questions from Checklist
                      </p>
                      <p className="text-xs text-gray-600">
                        Questions are loaded from the selected checklist:{" "}
                        <strong>{patrolling.checklist.name}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
                  <CardHeader className="bg-[#F6F4EE] mb-6">
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                        <ListChecks className="h-4 w-4" />
                      </div>
                      CHECKLIST QUESTIONS ({checklistQuestions.length})
                      {loadingChecklistQuestions && (
                        <Loader2 className="w-4 h-4 animate-spin ml-2 text-[#C72030]" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Q#</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Mandatory</TableHead>
                            <TableHead>Options</TableHead>
                            <TableHead>Created on</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white">
                          {checklistQuestions.map((question) => (
                            <TableRow key={question.id}>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  Q{question.qnumber}
                                </Badge>
                              </TableCell>
                              <TableCell>{question.id}</TableCell>
                              <TableCell>{question.task}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {question.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {question.mandatory ? (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Required
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Optional
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {question.options.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {question.options.map((option, index) => (
                                      <span
                                        key={index}
                                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                                      >
                                        {option}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  "—"
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-gray-600">
                                {formatDateTime(question.created_at)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Show patrolling questions
              <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
                <CardHeader className="bg-[#F6F4EE] mb-6">
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                      <ListChecks className="h-4 w-4" />
                    </div>
                    QUESTIONS ({patrolling.questions?.length || 0})
                    {patrolling.checklist && loadingChecklistQuestions && (
                      <Loader2 className="w-4 h-4 animate-spin ml-2 text-[#C72030]" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
         

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Q#</TableHead>
                          <TableHead>Question</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Mandatory</TableHead>
                          <TableHead>Options</TableHead>
                          <TableHead>Created on</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white">
                        {patrolling.questions &&
                        patrolling.questions.length > 0 ? (
                          patrolling.questions.map((question) => (
                            <TableRow key={question.id}>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  Q{question.qnumber}
                                </Badge>
                              </TableCell>
                              <TableCell>{question.task}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {question.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {question.mandatory ? (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Required
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Optional
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {question.options.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {question.options.map((option, index) => (
                                      <span
                                        key={index}
                                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                                      >
                                        {option}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  "—"
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-gray-600">
                                {formatDateTime(question.created_at)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center text-gray-600"
                            >
                              No questions available.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Schedules */}
          <TabsContent value="schedules" className="p-3 sm:p-6">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                      <Calendar className="h-4 w-4" />
                    </div>
                    SCHEDULES ({patrolling.schedules?.length || 0})
                  </div>
                  {patrolling.schedules && patrolling.schedules.length > 0 && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#C72030] rounded-full animate-pulse"></div>
                        <span className="text-[#C72030] font-medium">
                          Active: {patrolling.schedules.filter(s => s.active).length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-600 font-medium">
                          Inactive: {patrolling.schedules.filter(s => !s.active).length}
                        </span>
                      </div>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patrolling.schedules && patrolling.schedules.length > 0 ? (
                  <div className="space-y-6">
                    {patrolling.schedules.map((schedule) => (
                      <div key={schedule.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300">
                        {/* Schedule Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${schedule.active ? 'bg-[#C72030]' : 'bg-gray-400'} text-white rounded-full flex items-center justify-center font-semibold shadow-sm`}>
                              #{schedule.id}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                Schedule #{schedule.id}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-sm text-gray-500 flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Created {formatDateTime(schedule.created_at)}
                                </p>
                                {schedule.cron_setting?.cron_expression && (
                                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Scheduled
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={schedule.active ? "default" : "secondary"}
                            className={`px-3 py-1 ${schedule.active ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                          >
                            {schedule.active ? (
                              <>
                                <div className="w-2 h-2 bg-[#C72030] rounded-full mr-2 animate-pulse" />
                                Active
                              </>
                            ) : (
                              <>
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </div>

                        {/* Schedule Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Personnel Information */}
                          <div className="space-y-4">
                            <div className="border-l-4 pl-4">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Users className="w-4 h-4 mr-2 text-gray-600" />
                                Personnel Assignment
                              </h4>
                              <div className="space-y-3">
                                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-900">Guard</span>
                                  </div>
                                  <p className="text-sm text-gray-800 font-medium">
                                    {schedule.assigned_guard_name || 
                                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                                        ID: {schedule.assigned_guard_id}
                                      </span>
                                    }
                                  </p>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Eye className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-900">Supervisor</span>
                                  </div>
                                  <p className="text-sm text-gray-800 font-medium">
                                    {schedule.supervisor_name || 
                                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                                        ID: {schedule.supervisor_id}
                                      </span>
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Schedule Timing */}
                          <div className="space-y-4">
                            <div className="border-l-4 border-gray-500 pl-4">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-600" />
                                Schedule Timing
                              </h4>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                {schedule.cron_setting?.cron_expression ? (
                                  <div className="space-y-3">
                                    {(() => {
                                      const cronData = formatCronExpression(
                                        schedule.cron_setting.cron_expression
                                      );
                                      return cronData ? (
                                        <>
                                          <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                              <div className="text-xs text-gray-700 font-medium mb-1">Hours</div>
                                              <div className="text-sm font-bold text-gray-900">
                                                {cronData.hours}
                                              </div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                              <div className="text-xs text-gray-700 font-medium mb-1">Minutes</div>
                                              <div className="text-sm font-bold text-gray-900">
                                                {cronData.minutes}
                                              </div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                              <div className="text-xs text-gray-700 font-medium mb-1">Day of Week</div>
                                              <div className="text-sm font-bold text-gray-900">
                                                {cronData.dayOfWeek}
                                              </div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                              <div className="text-xs text-gray-700 font-medium mb-1">Month</div>
                                              <div className="text-sm font-bold text-gray-900">
                                                {cronData.months}
                                              </div>
                                            </div>
                                          </div>
                                          <details className="group mt-3">
                                            <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800 select-none flex items-center gap-1">
                                              <Code className="w-3 h-3" />
                                              Show raw cron expression
                                            </summary>
                                            <div className="mt-2 p-3 bg-gray-900 text-green-400 rounded-lg text-xs font-mono border overflow-x-auto shadow-inner">
                                              {schedule.cron_setting.cron_expression}
                                            </div>
                                          </details>
                                        </>
                                      ) : (
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                                              <AlertCircle className="w-3 h-3 mr-1" />
                                              Custom Schedule
                                            </Badge>
                                          </div>
                                          <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono border overflow-x-auto shadow-inner">
                                            {schedule.cron_setting.cron_expression}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                ) : (
                                  <div className="text-center text-gray-400 py-6">
                                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm font-medium">No schedule timing configured</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                    
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Schedules Configured
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      No patrol schedules have been set up yet. Schedules define when and how often patrols should be conducted.
                    </p>
                    <Button 
                      onClick={() => navigate(`/security/patrolling/edit/${id}`)}
                      className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Schedule
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Checkpoints */}
          <TabsContent value="checkpoints" className="p-3 sm:p-6">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4" />
                  </div>
                  CHECKPOINTS ({patrolling.checkpoints?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>QR Code</TableHead>
                        <TableHead>Created On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {patrolling.checkpoints &&
                      patrolling.checkpoints.length > 0 ? (
                        patrolling.checkpoints
                          .sort((a, b) => a.order_sequence - b.order_sequence)
                          .map((checkpoint) => (
                            <TableRow key={checkpoint.id}>
                              <TableCell>
                                <Badge variant="outline">
                                  #{checkpoint.order_sequence}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {checkpoint.name}
                              </TableCell>
                              <TableCell>
                                {checkpoint.description || "—"}
                              </TableCell>
                             
                              <TableCell>
                                <div className="text-sm">
                                  <div>
                                    Building:{" "}
                                    {checkpoint.building_name || "N/A"}
                                  </div>
                                  <div>
                                    Wing: {checkpoint.wing_name || "N/A"}
                                  </div>
                                  <div>
                                    Floor: {checkpoint.floor_name || "N/A"}
                                  </div>
                                  <div>
                                    Room: {checkpoint.room_name || "N/A"}
                                  </div>
                                  {checkpoint.area_name && (
                                    <div>Area: {checkpoint.area_name}</div>
                                  )}
                                </div>
                              </TableCell>
                            
                              <TableCell>
                                {checkpoint.qr_code_available ? (
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="default"
                                      className="text-xs"
                                    >
                                      <QrCode className="w-3 h-3 mr-1" />
                                      Available
                                    </Badge>
                                    {checkpoint.qr_code_url && (
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            window.open(
                                              checkpoint.qr_code_url,
                                              "_blank"
                                            )
                                          }
                                          className="p-1 h-6 w-6"
                                          title="View QR Code"
                                        >
                                          <Eye className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={async () => {
                                            try {
                                              const response = await fetch(
                                                checkpoint.qr_code_url!
                                              );
                                              const blob =
                                                await response.blob();
                                              const url =
                                                window.URL.createObjectURL(
                                                  blob
                                                );
                                              const a =
                                                document.createElement("a");
                                              a.href = url;
                                              a.download = `checkpoint_${checkpoint.id}_qr_code.png`;
                                              document.body.appendChild(a);
                                              a.click();
                                              window.URL.revokeObjectURL(url);
                                              document.body.removeChild(a);
                                              toast.success(
                                                "QR Code downloaded successfully!"
                                              );
                                            } catch (error) {
                                              toast.error(
                                                "Failed to download QR Code"
                                              );
                                            }
                                          }}
                                          className="p-1 h-6 w-6"
                                          title="Download QR Code"
                                        >
                                          <Download className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Not Available
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-gray-600">
                                {formatDateTime(checkpoint.created_at)}
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center text-gray-600"
                          >
                            No checkpoints available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Sessions */}
          <TabsContent value="recent-sessions" className="p-3 sm:p-6">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <Activity className="h-4 w-4" />
                  </div>
                  RECENT SESSIONS ({patrolling.recent_sessions?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Session Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Guard</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {patrolling.recent_sessions &&
                      patrolling.recent_sessions.length > 0 ? (
                        patrolling.recent_sessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>
                              {formatDateTime(session.session_date)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  session.status === "completed"
                                    ? "default"
                                    : session.status === "in_progress"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {session.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>{session.guard_name || "—"}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {session.checkpoints_completed}/
                                {session.total_checkpoints} checkpoints
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div
                                    className="bg-[#C72030] h-2 rounded-full"
                                    style={{
                                      width: `${
                                        (session.checkpoints_completed /
                                          session.total_checkpoints) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center text-gray-600 py-8"
                          >
                            <div className="flex flex-col items-center">
                              <Activity className="w-12 h-12 text-gray-300 mb-2" />
                              <p>No recent sessions found.</p>
                              <p className="text-sm text-gray-500">
                                Sessions will appear here once patrolling
                                starts.
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Modal */}
      {id && (
        <DeletePatrollingModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          patrollingId={parseInt(id)}
        />
      )}
    </div>
  );
};
