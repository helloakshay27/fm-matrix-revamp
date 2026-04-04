import React, { useState, useRef } from "react";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";
import {
  Lightbulb,
  X,
  ChevronRight,
  Calendar as CalendarIcon,
  Info,
  ChevronLeft,
  CheckCircle2,
  Plus,
  Upload,
  CheckSquare,
  AlertCircle,
  Clock,
  Calendar,
  Target,
  HelpCircle,
  Zap,
  Star,
  TrendingUp,
  ListTodo,
  CalendarCheck,
  ListChecks,
  BarChart3,
  Image as ImageIcon,
  FileText,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./BusinessCompass.css";
import AddTaskOrIssueModal from "@/components/BusinessCompass/AddTaskOrIssueModal";
import { getBaseUrl, getToken } from "@/utils/auth";
import axios from "axios";

interface DailyReport {
  id: number;
  user_id: number;
  journal_type: string;
  start_date: string;
  end_date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  report_data?: {
    kpi?: string;
    total_score?: number;
    is_absent?: boolean;
    absence_reason?: string;
    self_rating?: number;
    sections?: {
      attendance?: number;
      collaboration?: number;
      tasks_completed?: number;
      is_absent?: boolean;
      self_rating?: number;
    };
    details?: {
      notes?: string | null;
      is_absent?: boolean;
      self_rating?: number;
    };
    accomplishments?: {
      items: { title: string }[];
      attachments: any[];
    };
    tomorrow_plan?: { title: string }[];
    tasks_issues?: any[];
  };
  url: string;
  attachments: unknown[];
  self_rating?: number;
  is_absent?: boolean;
}

const BusinessCompassDailyReport: React.FC = () => {
  const now = new Date();
  const btnPrimary =
    "bg-[#DA7756] text-white font-bold shadow-sm transition-colors hover:bg-[#c9673f] border-none";
  const btnOutline =
    "bg-white text-[#DA7756] border border-[rgba(218,119,86,0.25)] shadow-sm transition-colors hover:bg-[#fef6f4] hover:border-[rgba(218,119,86,0.45)]";
  const btnIcon =
    "border border-[rgba(218,119,86,0.22)] bg-white text-[#DA7756]/70 shadow-sm hover:bg-[#fef6f4] hover:text-[#DA7756]";

  const [selectedDate, setSelectedDate] = useState(now.getDate().toString());
  const [startDate, setStartDate] = useState(now.toLocaleDateString("en-CA"));
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isBannerExpanded, setIsBannerExpanded] = useState(false);
  const [selfRating, setSelfRating] = useState([2]);
  const [isAbsent, setIsAbsent] = useState(false);
  const [absenceReason, setAbsenceReason] = useState("");
  const [isDetailedScoreExpanded, setIsDetailedScoreExpanded] = useState(false);
  const [isScoreInfoExpanded, setIsScoreInfoExpanded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(now.toLocaleString('default', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(now.getFullYear().toString());
  const [accomplishments, setAccomplishments] = useState<
    { id: string; text: string; completed: boolean; starred: boolean }[]
  >([]);
  const [planningItems, setPlanningItems] = useState<
    { id: string; text: string; starred: boolean }[]
  >([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    { id: string; name: string; size: string; type: string; base64?: string; file?: File }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const addAccomplishment = () => {
    setAccomplishments([
      ...accomplishments,
      { id: Date.now().toString(), text: "", completed: true, starred: false },
    ]);
  };

  const removeAccomplishment = (id: string) => {
    setAccomplishments(accomplishments.filter((a) => a.id !== id));
  };

  const toggleAccomplishment = (id: string) => {
    setAccomplishments(
      accomplishments.map((a) =>
        a.id === id ? { ...a, completed: !a.completed } : a
      )
    );
  };

  const toggleStar = (id: string) => {
    setAccomplishments(
      accomplishments.map((a) =>
        a.id === id ? { ...a, starred: !a.starred } : a
      )
    );
  };

  const addPlanningItem = () => {
    setPlanningItems([
      ...planningItems,
      { id: Date.now().toString(), text: "", starred: false },
    ]);
  };

  const removePlanningItem = (id: string) => {
    setPlanningItems(planningItems.filter((p) => p.id !== id));
  };

  const togglePlanningStar = (id: string) => {
    setPlanningItems(
      planningItems.map((p) =>
        p.id === id ? { ...p, starred: !p.starred } : p
      )
    );
  };

  const updatePlanningText = (id: string, text: string) => {
    setPlanningItems(
      planningItems.map((p) => (p.id === id ? { ...p, text } : p))
    );
  };

  const updateAccomplishmentText = (id: string, text: string) => {
    setAccomplishments(
      accomplishments.map((a) => (a.id === id ? { ...a, text } : a))
    );
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          type: file.type,
          base64,
          file,
        };
      })
    );

    setUploadedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentReportId, setCurrentReportId] = useState<number | null>(null);
  const [reportsList, setReportsList] = useState<DailyReport[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("submit");

  const [viewStartDate, setViewStartDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    // Start from 3 days ago to center today
    d.setDate(d.getDate() - 3);
    return d;
  });

  const days = React.useMemo(() => {
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(viewStartDate);
    for (let i = 0; i < 9; i++) {
      const dateStr = date.toLocaleDateString("en-CA");
      const isToday = date.getTime() === today.getTime();
      const isPast = date.getTime() < today.getTime();
      const isFuture = date.getTime() > today.getTime();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      const report = reportsList.find((r) => r.start_date === dateStr);

      let type: "filled" | "missed" | "holiday" | "upcoming" = "upcoming";
      let status = "";

      if (report) {
        type = "filled";
        status = report.report_data?.total_score
          ? `+${report.report_data.total_score}`
          : "Done";
      } else if (isWeekend) {
        type = "holiday";
        status = "Holiday";
      } else if (isPast) {
        type = "missed";
        status = "Miss";
      } else if (isToday) {
        type = "upcoming";
        status = "Today";
      } else {
        type = "upcoming";
        status = "";
      }

      result.push({
        day: date.toLocaleString("default", { weekday: "short" }),
        date: date.getDate().toString(),
        fullDate: dateStr,
        status,
        type,
        actualDate: new Date(date),
        isFuture,
      });
      date.setDate(date.getDate() + 1);
    }
    return result;
  }, [viewStartDate, reportsList]);

  const handlePrevWeek = () => {
    const newDate = new Date(viewStartDate);
    newDate.setDate(newDate.getDate() - 7);
    setViewStartDate(newDate);

    // Update month/year display
    const midWeek = new Date(newDate);
    midWeek.setDate(midWeek.getDate() + 3);
    setSelectedMonth(midWeek.toLocaleString("default", { month: "long" }));
    setSelectedYear(midWeek.getFullYear().toString());
  };

  const handleNextWeek = () => {
    const newDate = new Date(viewStartDate);
    newDate.setDate(newDate.getDate() + 7);
    setViewStartDate(newDate);

    // Update month/year display
    const midWeek = new Date(newDate);
    midWeek.setDate(midWeek.getDate() + 3);
    setSelectedMonth(midWeek.toLocaleString("default", { month: "long" }));
    setSelectedYear(midWeek.getFullYear().toString());
  };

  const handleSelectDate = (item: any) => {
    setSelectedDate(item.date);
    setStartDate(item.fullDate);
    setSelectedMonth(item.actualDate.toLocaleString("default", { month: "long" }));
    setSelectedYear(item.actualDate.getFullYear().toString());
  };

  const nextDayLabel = React.useMemo(() => {
    try {
      const dateObj = new Date(
        `${selectedDate} ${selectedMonth} ${selectedYear}`
      );
      if (isNaN(dateObj.getTime())) return "";

      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);

      // If next day is Sunday (0), skip to Monday (+1 day)
      if (nextDay.getDay() === 0) {
        nextDay.setDate(nextDay.getDate() + 1);
      }

      return nextDay.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    } catch (e) {
      return "";
    }
  }, [selectedDate, selectedMonth, selectedYear]);

  // Fetch report for the selected date to see if we should PUT or POST
  React.useEffect(() => {
    const fetchExistingReport = async () => {
      try {
        const baseUrl = getBaseUrl() ?? "https://fm-uat-api.lockated.com";
        const token = getToken();
        if (!token) return;

        const queryParams = new URLSearchParams();
        queryParams.append("q[journal_type_eq]", "daily");
        queryParams.append("q[start_date_eq]", startDate);

        const url = `${baseUrl.replace(/\/+$/, "")}/user_journals.json?${queryParams.toString()}`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = response.data;
          const journals = Array.isArray(data)
            ? data
            : data.user_journals || [];
          const existingReport = journals.find(
            (j: {
              id: number;
              start_date: string;
              report_data?: Record<string, unknown>;
            }) => j.start_date === startDate
          );

          if (existingReport && existingReport.id) {
            setCurrentReportId(existingReport.id);
            // Populate state with data from existing report
            if (existingReport.report_data) {
              const rData = existingReport.report_data as any;

              if (rData.accomplishments?.items) {
                setAccomplishments(
                  rData.accomplishments.items.map((ach: any, idx: number) => ({
                    id: `fetched-ach-${idx}`,
                    text: ach.title || "",
                    completed: true,
                    starred: false,
                  }))
                );
              }

              if (rData.accomplishments?.attachments) {
                setUploadedFiles(
                  rData.accomplishments.attachments.map((att: any, idx: number) => ({
                    id: `fetched-att-${idx}`,
                    name: att.filename,
                    size: "N/A",
                    type: att.content_type,
                    base64: att.base64,
                  }))
                );
              }

              if (rData.tomorrow_plan) {
                setPlanningItems(
                  rData.tomorrow_plan.map((p: any, idx: number) => ({
                    id: `fetched-plan-${idx}`,
                    text: p.title || "",
                    starred: false,
                  }))
                );
              }

              if (existingReport.is_absent !== undefined) setIsAbsent(existingReport.is_absent);
              if (existingReport.description) setAbsenceReason(existingReport.description);
              if (existingReport.self_rating !== undefined)
                setSelfRating([existingReport.self_rating]);
            }
          } else {
            setCurrentReportId(null);
            setAccomplishments([]);
            setIsAbsent(false);
            setAbsenceReason("");
            setSelfRating([2]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch existing report:", err);
      }
    };

    fetchExistingReport();
  }, [startDate]);

  const fetchReportsList = async () => {
    try {
      setIsHistoryLoading(true);
      const baseUrl = getBaseUrl() ?? "https://fm-uat-api.lockated.com";
      const token = getToken();
      if (!token) return;

      const queryParams = new URLSearchParams();
      queryParams.append("q[journal_type_eq]", "daily");

      // Filter by current month/year
      const monthIndex =
        new Date(`${selectedMonth} 1, ${selectedYear}`).getMonth() + 1;
      const startDate = `${selectedYear}-${monthIndex
        .toString()
        .padStart(2, "0")}-01`;
      const lastDay = new Date(parseInt(selectedYear), monthIndex, 0).getDate();
      const endDate = `${selectedYear}-${monthIndex
        .toString()
        .padStart(2, "0")}-${lastDay.toString().padStart(2, "0")}`;

      queryParams.append("q[start_date_gteq]", startDate);
      queryParams.append("q[start_date_lteq]", endDate);

      const url = `${baseUrl.replace(
        /\/+$/,
        ""
      )}/user_journals.json?${queryParams.toString()}`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      setReportsList(response.data || []);
    } catch (err) {
      console.error("Failed to fetch reports history:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReportsList();
  }, [selectedMonth, selectedYear]);

  const handleSubmit = async () => {
    // Basic validation
    if (!isAbsent && accomplishments.length === 0) {
      setSubmitError(
        "Please add at least one accomplishment before submitting."
      );
      return;
    }
    if (isAbsent && !absenceReason.trim()) {
      setSubmitError("Please provide a reason for your absence.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const baseUrl = getBaseUrl() ?? "https://fm-uat-api.lockated.com";
      const token = getToken();

      const payload = {
        user_journal: {
          journal_type: "daily",
          start_date: startDate,
          end_date: startDate,
          self_rating: selfRating[0],
          is_absent: isAbsent,
          description: isAbsent ? absenceReason : null,
          report_data: {
            accomplishments: {
              items: accomplishments.map((a) => ({
                title: a.text,
              })),
              attachments: uploadedFiles.map((f) => ({
                filename: f.name,
                content_type: f.type,
                base64: f.base64,
              })),
            },
            tasks_issues: [], // No state for this yet in the component
            tomorrow_plan: planningItems.map((p) => ({
              title: p.text,
            })),
          },
        },
      };

      const queryParams = new URLSearchParams();
      queryParams.append("q[journal_type_eq]", "daily");

      const endpoint = currentReportId
        ? `/user_journals/${currentReportId}.json`
        : "/user_journals.json";
      const method = currentReportId ? "PUT" : "POST";

      const url = `${baseUrl.replace(/\/+$/, "")}${endpoint}?${queryParams.toString()}`;

      const response = await axios({
        method: method,
        url: url,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data: payload,
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(
          `Server returned ${response.status} ${response.statusText}`
        );
      }

      const data = response.data;

      // If we just created it, store the new ID to allow subsequent PUT updates
      if (!currentReportId && data.id) {
        setCurrentReportId(data.id);
      }

      setSubmitSuccess(true);
      fetchReportsList();
      setTimeout(() => setSubmitSuccess(false), 5000);

      // Clear form data after successful submission
      if (!isAbsent) {
        setAccomplishments([]);
        setUploadedFiles([]);
      }
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#f6f4ee] p-6 pb-20 font-poppins text-[#1a1a1a]">
      <AdminViewEmulation />
      {/* Interactive Info Banner Card */}
      {isBannerVisible && (
        <Card
          className={cn(
            "overflow-hidden rounded-[12px] border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm transition-all duration-300",
            isBannerExpanded ? "max-h-[1000px]" : "max-h-[80px]"
          )}
        >
          <CardContent className="p-0">
            <div
              className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-[#fef6f4]"
              onClick={() => setIsBannerExpanded(!isBannerExpanded)}
            >
              <div className="flex items-center justify-center rounded-[10px] bg-[#DA7756] p-2.5 text-white shadow-sm">
                <Lightbulb size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold tracking-tight text-[#1a1a1a]">
                  How to Fill Your Daily Report
                </h4>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-xl border-none text-[#DA7756] transition-transform duration-200 hover:bg-[#fef6f4]",
                    isBannerExpanded && "rotate-180"
                  )}
                >
                  <ChevronRight size={18} className="rotate-90" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl border-none text-[#DA7756]/60 hover:bg-[#fef6f4] hover:text-[#DA7756]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBannerVisible(false);
                  }}
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {isBannerExpanded && (
              <div className="px-16 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <h5 className="text-sm font-bold text-[#1a1a1a]">
                    How to use:
                  </h5>
                  <ul className="list-disc space-y-2 pl-4 text-xs font-medium text-neutral-700">
                    <li>
                      Fill your daily report at the end of each workday to track
                      accomplishments and challenges.
                    </li>
                    <li>
                      Rate your day honestly (1-10) - this helps identify
                      patterns in your productivity.
                    </li>
                    <li>
                      List 3-5 key accomplishments from today and check off
                      completed items from yesterday's plan.
                    </li>
                    <li>
                      Mention challenges you faced - your manager can provide
                      support and remove blockers.
                    </li>
                    <li>
                      Plan tomorrow's priorities - this helps you start the next
                      day with clarity.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="flex items-center gap-2 text-sm font-bold text-[#1a1a1a]">
                    💡 Best Practices:
                  </h5>
                  <ul className="space-y-2 text-xs font-medium text-neutral-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#DA7756]">✓</span>
                      <span>
                        Be specific in accomplishments - 'Completed X project'
                        not just 'worked on projects'
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#DA7756]">✓</span>
                      <span>
                        Tag team members in challenges when you need their help
                        using @mentions
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#DA7756]">✓</span>
                      <span>
                        Keep tomorrow's plan realistic - 3-5 key priorities is
                        better than a long list
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-[#1a1a1a] tracking-tight">
            Daily Report
          </h1>
        </div>

  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 inline-flex h-auto rounded-2xl bg-[#DA7756] p-1 shadow-sm">
            <TabsTrigger
              value="submit"
              className="rounded-xl px-8 py-2 bg-transparent text-sm font-bold text-white/80 transition-all data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm"
            >
              Submit Report
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-xl px-8 py-2 bg-transparent text-sm font-bold text-white/80 transition-all data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm"
            >
              Report History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-6 mt-0">
            {/* Calendar Card */}
            <Card className="overflow-hidden rounded-[16px] border border-[#DA7756]/20 bg-[#fffaf8] shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-[rgba(218,119,86,0.18)] bg-[#FAECE7] p-2">
                      <CalendarIcon size={20} className="text-[#DA7756]" />
                    </div>
                    <span className="text-lg font-bold text-[#1a1a1a] tracking-tight">
                      Daily Report for {selectedDate}{" "}
                      {selectedMonth.slice(0, 3)}, {selectedYear}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-8 w-8 rounded-xl", btnIcon)}
                      onClick={handlePrevWeek}
                    >
                      <ChevronLeft size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-8 w-8 rounded-xl", btnIcon)}
                      onClick={handleNextWeek}
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div> */}
                </div>

                <div className="flex gap-4 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x">
                  {days.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "min-w-[96px] h-[110px] rounded-[16px] flex flex-col items-center justify-center gap-1.5 cursor-pointer border-2 transition-all shrink-0 snap-center shadow-sm relative group",
                        item.isFuture && "opacity-40 grayscale cursor-not-allowed pointer-events-none",
                        item.type === "missed" &&
                        "bg-[#ef4444] text-white border-[#ef4444]/20 hover:bg-[#dc2626]",
                        item.type === "holiday" &&
                        "bg-[#facd55] text-[#854d0e] border-[#facd55]/20 hover:bg-[#facc15]",
                        item.type === "upcoming" &&
                          "bg-[#fdf8f6] text-[#b08972] border-[#DA7756]/10 hover:bg-[#fef6f4]",
                        item.type === "filled" &&
                          "bg-[#22c55e] text-white border-[#22c55e]/20 hover:bg-[#16a34a]",
                        selectedDate === item.date && !item.isFuture
                          ? "z-10 scale-105 border-[#DA7756] bg-[#DA7756] text-white ring-4 ring-[#DA7756]/20"
                          : "border-transparent"
                      )}
                      onClick={() => !item.isFuture && handleSelectDate(item)}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                        {item.day}
                      </span>
                      <span className="text-3xl font-black tracking-tighter">
                        {item.date}
                      </span>
                      {item.status && (
                        <Badge
                          className={cn(
                            "text-[9px] font-black px-2 py-0 h-5 rounded-[6px] border-none shadow-none uppercase tracking-tighter",
                            (item.type === "missed" || item.type === "filled")
                              ? "bg-white/20 text-white"
                              : "bg-black/10 text-[#854d0e]",
                            selectedDate === item.date &&
                            "bg-white/20 text-white"
                          )}
                        >
                          {item.status}
                        </Badge>
                      )}
                      {selectedDate === item.date && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-[#DA7756] bg-white shadow-sm" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 pt-4 border-t border-gray-50 mt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-wider">
                    <div className="w-3.5 h-3.5 rounded-[5px] bg-[#22c55e] shadow-sm" />
                    <span className="opacity-80">Filled</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-wider">
                    <div className="w-3.5 h-3.5 rounded-[5px] bg-[#ef4444] shadow-sm" />
                    <span className="opacity-80">Missed (click to fill)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-wider">
                    <div className="w-3.5 h-3.5 rounded-[5px] bg-[#facd55] shadow-sm" />
                    <span className="opacity-80">Holiday</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-wider">
                    <div className="h-3.5 w-3.5 rounded-[5px] border border-[#DA7756]/15 bg-[#fdf8f6] shadow-inner" />
                    <span className="opacity-80">Upcoming</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!isAbsent && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Today's Accomplishments Card */}
                <Card className="overflow-hidden rounded-[16px] border-2 border-[#DA7756]/30 bg-[#fffaf8] shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#DA7756]/10 bg-[#fef6f4] p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full border border-[#DA7756]/30 bg-white p-1">
                        <CheckCircle2 size={18} className="text-[#DA7756]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#1a1a1a] tracking-tight">
                        Today's Accomplishments
                      </h3>
                    </div>
                    <Badge className="rounded-[6px] border-none bg-[#DA7756] px-3 py-1 text-[10px] font-black tracking-widest text-white shadow-sm hover:bg-[#DA7756]">
                      {accomplishments.filter((a) => a.completed).length * 5}/25
                      PTS
                    </Badge>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                      {accomplishments.map((item) => (
                        <div
                          key={item.id}
                          className="relative group animate-in fade-in duration-300"
                        >
                          <div
                            className={cn(
                              "flex items-center gap-4 rounded-[10px] border bg-white p-3 transition-all",
                              item.completed
                                ? "border-[#DA7756]/35 bg-[#fef6f4]"
                                : "border-[#DA7756]/15"
                            )}
                          >
                            <div
                              className={cn(
                                "h-6 w-6 rounded-[6px] flex items-center justify-center cursor-pointer transition-colors border-2",
                                item.completed
                                  ? "border-[#DA7756] bg-[#DA7756]"
                                  : "border-[#DA7756]/30 bg-white"
                              )}
                              onClick={() => toggleAccomplishment(item.id)}
                            >
                              {item.completed && (
                                <CheckCircle2
                                  size={14}
                                  className="text-white"
                                />
                              )}
                            </div>

                            <Star
                              size={18}
                              className={cn(
                                "cursor-pointer transition-all",
                                item.starred
                                  ? "text-[#eab308] fill-[#eab308]"
                                  : "text-gray-300 hover:text-gray-400"
                              )}
                              onClick={() => toggleStar(item.id)}
                            />

                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) =>
                                updateAccomplishmentText(
                                  item.id,
                                  e.target.value
                                )
                              }
                              placeholder="Describe your accomplishment..."
                              className={cn(
                                "flex-1 bg-transparent border-none outline-none text-sm font-medium transition-all",
                                item.completed
                                  ? "text-gray-400 line-through"
                                  : "text-gray-700"
                              )}
                            />

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full border-none text-[#DA7756]/45 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#fef6f4] hover:text-[#DA7756]"
                              onClick={() => removeAccomplishment(item.id)}
                            >
                              <X size={16} className="text-[#DA7756]" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {accomplishments.length === 0 && (
                        <div className="flex flex-col items-center gap-4 text-center py-10 bg-gray-50/50 rounded-[14px] border-2 border-dashed border-gray-100">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#DA7756]/20 bg-[#fef6f4]">
                            <CheckCircle2
                              size={32}
                              className="text-[#DA7756]/30"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-bold text-[#1a1a1a]">
                              What did you get done today?
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              Add your accomplishments to celebrate your
                              progress!
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className={cn("flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm", btnOutline)}
                          onClick={addAccomplishment}
                        >
                          <Plus size={18} />
                          Add Item
                        </Button>

                        {accomplishments.some((a) => !a.completed) && (
                          <Button
                            variant="outline"
                            className={cn("h-11 rounded-xl px-4 text-xs", btnOutline)}
                          >
                            Transfer unchecked to tomorrow
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-[#DA7756]/20 bg-[#fef6f4] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#DA7756]">
                        <Info size={14} />
                        <span>Limits: Images 2MB, Others 5MB</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-400">
                          {uploadedFiles.length}/5
                        </span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          multiple
                          className="hidden"
                        />
                        <Button
                          className={cn("flex h-10 items-center gap-2 rounded-xl px-6 text-xs", btnPrimary)}
                          onClick={triggerFileUpload}
                        >
                          <Upload size={16} />
                          File Upload
                        </Button>
                      </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between bg-gray-50/80 p-3 rounded-[10px] border border-gray-100 animate-in fade-in duration-300"
                          >
                            <div className="flex items-center gap-3">
                              <ImageIcon size={16} className="text-[#DA7756]" />
                              <span className="cursor-pointer text-sm font-medium text-[#DA7756] hover:underline">
                                {file.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {file.size}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full border-none text-[#DA7756]/55 hover:bg-[#fef6f4] hover:text-[#DA7756]"
                                onClick={() =>
                                  setUploadedFiles(
                                    uploadedFiles.filter(
                                      (f) => f.id !== file.id
                                    )
                                  )
                                }
                              >
                                <X size={14} className="text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tasks & Issues Card */}
                <Card className="mt-6 overflow-hidden rounded-[8px] border-2 border-[#DA7756]/30 bg-[#fffaf8] shadow-sm">
                  <div className="border-b border-[#DA7756]/10 bg-[#fef6f4] p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="rounded-md border border-[#DA7756]/30 bg-white p-1">
                            <CheckSquare size={16} className="text-[#DA7756]" />
                          </div>
                          <h3 className="text-sm font-bold text-[#1a1a1a] tracking-tight">
                            Tasks & Issues
                          </h3>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">
                          Check the box for completed items to mark them
                          completed.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Badge
                            variant="outline"
                            className="bg-[#ecfdf5] text-[#047857] border-none rounded-[4px] px-2 py-0.5 font-bold text-[9px] flex items-center gap-1 shadow-sm"
                          >
                            <CheckSquare size={10} />
                            Closed: 0
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#eff6ff] text-[#1d4ed8] border-none rounded-[4px] px-2 py-0.5 font-bold text-[9px] flex items-center gap-1 shadow-sm"
                          >
                            <Info size={10} />
                            Open: 0
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#fef2f2] text-[#b91c1c] border-none rounded-[4px] px-2 py-0.5 font-bold text-[9px] flex items-center gap-1 shadow-sm"
                          >
                            <Clock size={10} />
                            Overdue: 0
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-[#DA7756] px-3 py-1 text-[9px] font-black tracking-widest text-white shadow-sm">
                          0/20 PTS
                        </div>
                        <Button
                          className={cn("flex h-8 items-center gap-2 rounded-lg px-4 text-[10px]", btnPrimary)}
                          onClick={() => setIsAddTaskModalOpen(true)}
                        >
                          <Plus size={14} />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <CheckSquare size={40} className="text-[#DA7756]/20" />
                      <p className="text-base font-bold text-gray-400 tracking-tight">
                        No open tasks or issues
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Bottom Tip Banner */}
                <div className="mt-6 flex items-center gap-3 rounded-[12px] border border-[#DA7756]/20 bg-[#fef6f4] p-4 shadow-sm">
                  <div className="rounded-full border border-[#DA7756]/20 bg-white p-1.5 shadow-inner">
                    <Lightbulb size={18} className="text-[#DA7756]" />
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    <span className="font-bold text-[#DA7756]">
                      Delegate or Delete:
                    </span>{" "}
                    Look at your list. What doesn't actually need doing?
                  </p>
                </div>

                {/* Plan Card */}
                <Card className="mt-6 overflow-hidden rounded-[16px] border-2 border-[#DA7756]/30 bg-[#fffaf8] shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#DA7756]/10 bg-[#fef6f4] p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full border border-[#DA7756]/30 bg-white p-1">
                        <CheckCircle2 size={18} className="text-[#DA7756]" />
                      </div>
                      <h3 className="text-sm font-bold tracking-tight text-[#1a1a1a]">
                        Plan for {nextDayLabel || "Tomorrow"}
                      </h3>
                    </div>
                    <Badge className="rounded-[6px] border-none bg-[#DA7756] px-3 py-1 text-[10px] font-black tracking-widest text-white shadow-sm hover:bg-[#DA7756]">
                      0/25 PTS
                    </Badge>
                  </div>

                  <CardContent
                    className={cn("p-6", planningItems.length === 0 && "py-10")}
                  >
                    {planningItems.length > 0 ? (
                      <div className="space-y-4 mb-4">
                        {planningItems.map((item) => (
                          <div
                            key={item.id}
                            className="relative group animate-in fade-in slide-in-from-top-1 duration-200"
                          >
                            <div className="flex items-center gap-4 rounded-[10px] border border-[#DA7756]/20 bg-white p-3 shadow-sm transition-all hover:border-[#DA7756]">
                              <Star
                                size={18}
                                className={cn(
                                  "cursor-pointer transition-all shrink-0",
                                  item.starred
                                    ? "text-[#eab308] fill-[#eab308]"
                                    : "text-gray-300 hover:text-gray-400"
                                )}
                                onClick={() => togglePlanningStar(item.id)}
                              />

                              <input
                                type="text"
                                value={item.text}
                                onChange={(e) =>
                                  updatePlanningText(item.id, e.target.value)
                                }
                                placeholder="What's your strategic priority?"
                                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400"
                              />

                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={18}
                                  className="cursor-pointer text-[#DA7756] opacity-70 transition-opacity hover:opacity-100"
                                />
                                <X
                                  size={18}
                                  className="text-red-500 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                                  onClick={() => removePlanningItem(item.id)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-center mb-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#DA7756]/20 bg-[#fef6f4]">
                          <Calendar size={32} className="text-[#DA7756]/30" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-bold text-[#1a1a1a]">
                            Plan your next working day!
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            List 3-5 key tasks for {nextDayLabel || "tomorrow"} to stay focused.
                          </p>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className={cn("flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm", btnOutline)}
                      onClick={addPlanningItem}
                    >
                      <Plus size={18} />
                      Add Item
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Submission Section */}
            <Card className="mt-6 rounded-[16px] border border-[#DA7756]/20 bg-[#fffaf8] p-6 shadow-sm">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 w-full space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-bold text-black">
                        Self Rating (1-10)
                      </Label>
                      <span className="text-sm font-black text-green-700">
                        {selfRating[0]}/10
                      </span>
                    </div>
                    <Slider
                      value={selfRating}
                      onValueChange={setSelfRating}
                      max={10}
                      step={1}
                      className="cursor-pointer [&_[role=slider]]:bg-[#DA7756] [&_[role=slider]]:border-[#DA7756] [&_[data-orientation=horizontal]]:h-1 [&_[data-orientation=horizontal]_span:first-child]:bg-[#DA7756]"
                    />
                  </div>

                  <div className="flex min-w-[150px] items-center justify-center gap-3 rounded-[10px] border border-[#DA7756]/15 bg-[#fef6f4] px-4 py-3">
                    <Checkbox
                      id="absent"
                      checked={isAbsent}
                      onCheckedChange={(checked) =>
                        setIsAbsent(checked as boolean)
                      }
                      className="h-5 w-5 rounded-[4px] border-[#DA7756]/35 data-[state=checked]:border-[#DA7756] data-[state=checked]:bg-[#DA7756]"
                    />
                    <label
                      htmlFor="absent"
                      className="text-sm font-bold text-[#1a1a1a] cursor-pointer"
                    >
                      Mark as Absent
                    </label>
                  </div>
                </div>

                {isAbsent && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                      Reason for Absence <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Why are you absent today?"
                      value={absenceReason}
                      onChange={(e) => setAbsenceReason(e.target.value)}
                      className="h-12 rounded-[10px] border-[#DA7756]/20 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]"
                    />
                  </div>
                )}

                <div className="pt-2">
                  {submitError && (
                    <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 border border-red-100">
                      <AlertCircle size={16} />
                      {submitError}
                    </div>
                  )}
                  {submitSuccess && (
                    <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 border border-green-100">
                      <CheckCircle2 size={16} />
                      {currentReportId
                        ? "Daily report updated successfully."
                        : "Daily report submitted successfully."}
                    </div>
                  )}
                  <Button
                    className={cn("h-14 w-full rounded-2xl text-lg focus-visible:ring-0 disabled:opacity-50", btnPrimary)}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={20} className="animate-spin" />
                        {currentReportId ? "Updating..." : "Submitting..."}
                      </span>
                    ) : (
                      `${currentReportId ? "Update" : "Submit"} Daily Report (for ${selectedDate} ${selectedMonth.slice(0, 3)})`
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {!isAbsent && accomplishments.length === 0 && (
              <p className="mt-4 text-xs text-red-500 text-center font-bold animate-in fade-in duration-500">
                Please add at least one accomplishment before submitting
              </p>
            )}

            {/* Live Score Preview Section */}
            {!isAbsent && (
              <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="overflow-hidden rounded-[20px] border border-[#DA7756]/20 bg-[#fffaf8] shadow-sm">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-[#FAECE7] p-1.5">
                          <Target size={18} className="text-[#DA7756]" />
                        </div>
                        <h3 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-1.5">
                          Live Score Preview
                          <HelpCircle
                            size={14}
                            className="cursor-pointer text-[#DA7756]"
                          />
                        </h3>
                      </div>
                      <span className="text-3xl font-black tracking-tighter text-[#DA7756]">
                        0/100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        {
                          label: "Accomplishments",
                          score: "0/25",
                          color: "text-purple-600",
                        },
                        {
                          label: "Tasks",
                          score: "0/25",
                          color: "text-[#ea580c]",
                        },
                        {
                          label: "Planning",
                          score: "0/25",
                          color: "text-blue-600",
                        },
                        {
                          label: "Timing",
                          score: "0/25",
                          color: "text-[#ea580c]",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-1 rounded-[14px] border border-[#DA7756]/15 bg-white p-4 shadow-sm"
                        >
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {item.label}
                          </span>
                          <span
                            className={cn(
                              "text-xl font-black tracking-tight",
                              item.color
                            )}
                          >
                            {item.score}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-purple-50">
                      <div
                        className="group flex cursor-pointer items-center justify-between text-gray-400 transition-colors hover:text-[#DA7756]"
                        onClick={() =>
                          setIsDetailedScoreExpanded(!isDetailedScoreExpanded)
                        }
                      >
                        <span className="text-xs font-bold tracking-tight">
                          Detailed Score Calculation{" "}
                          <span className="font-medium opacity-60">
                            (Click here to{" "}
                            {isDetailedScoreExpanded ? "collapse" : "expand"})
                          </span>
                        </span>
                        <ChevronRight
                          size={18}
                          className={cn(
                            "transition-transform duration-300",
                            isDetailedScoreExpanded ? "-rotate-90" : "rotate-90"
                          )}
                        />
                      </div>
                    </div>

                    {isDetailedScoreExpanded && (
                      <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        {/* 1. Accomplishments Detail */}
                        <div className="space-y-4 rounded-[14px] border border-[#DA7756]/15 bg-white p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ListTodo size={16} className="text-[#DA7756]" />
                              <span className="text-xs font-black uppercase tracking-widest text-[#1a1a1a]">
                                Accomplishments
                              </span>
                            </div>
                            <span className="text-xs font-black text-[#DA7756]">
                              0/25 pts
                            </span>
                          </div>
                          <div className="space-y-2.5 border-l-2 border-[#DA7756]/15 pl-6">
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span className="flex items-center gap-2">
                                • Regular items:
                              </span>
                              <span className="text-gray-900">0 × 2.5 pts</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span className="flex items-center gap-2">
                                •{" "}
                                <Star
                                  size={12}
                                  className="text-[#eab308] fill-[#eab308]"
                                />{" "}
                                Starred items:
                              </span>
                              <span className="text-gray-900">0 × 5 pts</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-50 pt-1 text-[11px] font-black text-[#1a1a1a]">
                              <span>Total earned:</span>
                              <span>0 pts (max 25)</span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Tasks & Issues Detail */}
                        <div className="space-y-4 rounded-[14px] border border-[#DA7756]/15 bg-white p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckSquare
                                size={16}
                                className="text-[#ea580c]"
                              />
                              <span className="text-xs font-black text-[#ea580c] uppercase tracking-widest">
                                Tasks & Issues
                              </span>
                            </div>
                            <span className="text-xs font-black text-[#ea580c]">
                              0/25 pts
                            </span>
                          </div>
                          <div className="space-y-3 rounded-[12px] border border-[#DA7756]/10 bg-[#fef6f4] p-4">
                            <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-[#1a1a1a]">
                              Score Calculation:
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                                <span className="flex items-center gap-2">
                                  <CheckCircle2
                                    size={12}
                                    className="text-green-500"
                                  />{" "}
                                  Closed Tasks (0 × ~4 pts avg)
                                </span>
                                <span className="text-green-600">+0</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                                <span className="flex items-center gap-2">
                                  <TrendingUp
                                    size={12}
                                    className="text-[#DA7756]"
                                  />{" "}
                                  New Issues (0 × 2 pts, max 10)
                                </span>
                                <span className="text-[#DA7756]">+0</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-black text-gray-900 pt-1 border-t border-gray-100">
                                <span>Subtotal (Positive)</span>
                                <span>+0</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-bold text-red-500">
                                <span className="flex items-center gap-2">
                                  <AlertCircle
                                    size={12}
                                    className="text-red-500"
                                  />{" "}
                                  Overdue Penalty (0 × 5 pts, max -15)
                                </span>
                                <span>-0</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-black text-gray-900 pt-1 border-t border-gray-200">
                                <span className="text-sm">Final Score</span>
                                <span className="text-[#ea580c]">0/25 pts</span>
                              </div>
                            </div>
                            <p className="text-[9px] text-gray-400 font-medium italic mt-2 leading-relaxed">
                              Note: The final score from the backend may differ
                              slightly as it considers exact target dates for
                              closed tasks (+5 for on-time, +2 for delayed).
                            </p>
                          </div>
                        </div>

                        {/* 3. Planning Detail */}
                        <div className="space-y-4 rounded-[14px] border border-[#DA7756]/15 bg-white p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CalendarCheck
                                size={16}
                                className="text-[#DA7756]"
                              />
                              <span className="text-xs font-black uppercase tracking-widest text-[#1a1a1a]">
                                Planning
                              </span>
                            </div>
                            <span className="text-xs font-black text-[#DA7756]">
                              0/25 pts
                            </span>
                          </div>
                          <div className="space-y-2.5 border-l-2 border-[#DA7756]/15 pl-6">
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span className="flex items-center gap-2">
                                • Regular items:
                              </span>
                              <span className="text-gray-900">0 × 2 pts</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span className="flex items-center gap-2">
                                •{" "}
                                <Star
                                  size={12}
                                  className="text-[#eab308] fill-[#eab308]"
                                />{" "}
                                Starred items:
                              </span>
                              <span className="text-gray-900">0 × 4 pts</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-50 pt-1 text-[11px] font-black text-[#1a1a1a]">
                              <span>Total earned:</span>
                              <span>0/25 pts</span>
                            </div>
                          </div>
                        </div>

                        {/* 4. Submission Timing Detail */}
                        <div className="space-y-4 rounded-[14px] border border-[#DA7756]/15 bg-white p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-[#ea580c]" />
                              <span className="text-xs font-black text-[#ea580c] uppercase tracking-widest">
                                Submission Timing
                              </span>
                            </div>
                            <span className="text-xs font-black text-[#ea580c]">
                              0/25 pts
                            </span>
                          </div>
                          <div className="space-y-2.5 pl-6 border-l-2 border-[#ea580c]/30">
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span className="flex items-center gap-2">
                                • Timing:
                              </span>
                              <span className="text-red-600 font-bold">
                                After 9am next day — 0 pts
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span className="flex items-center gap-2">
                                • Bonus percentage:
                              </span>
                              <span className="text-[#ea580c]">0% of 25</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <div className="flex items-center gap-1.5 rounded-full bg-[#fef6f4] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#DA7756]">
                        <Zap
                          size={12}
                          className="fill-[#DA7756] text-[#DA7756]"
                        />
                        <span>
                          This is a live preview. Final score calculated after
                          submission.
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="mt-8">
              {/* Automation Info Banner */}
              <div
                className={cn(
                  "overflow-hidden rounded-[14px] border border-[#DA7756]/20 bg-[#DA7756]/10 transition-all duration-300 shadow-sm",
                  isScoreInfoExpanded ? "max-h-[3000px]" : "max-h-[80px]"
                )}
              >
                <div
                  className="flex cursor-pointer items-center justify-between border-b border-transparent p-4 transition-all hover:bg-[#fef6f4]"
                  onClick={() => setIsScoreInfoExpanded(!isScoreInfoExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white p-1.5 shadow-sm">
                      <HelpCircle size={18} className="text-[#DA7756]" />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-[#1a1a1a]">
                      How is the Automated Daily Score Calculated?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isScoreInfoExpanded && (
                      <span className="text-xs font-bold uppercase tracking-wider text-[#DA7756]">
                        Click to Expand
                      </span>
                    )}
                    <ChevronRight
                      size={18}
                      className={cn(
                        "text-[#DA7756]/70 transition-transform duration-300",
                        isScoreInfoExpanded ? "-rotate-90" : "rotate-90"
                      )}
                    />
                  </div>
                </div>

                {isScoreInfoExpanded && (
                  <div className="p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 gap-6">
                      {/* 1. Daily KPI */}
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#DA7756]/15 bg-[#fef6f4]">
                          <TrendingUp size={20} className="text-[#DA7756]" />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-bold tracking-tight text-[#1a1a1a]">
                              1. Daily KPI Achievement (Max 20 points)
                            </h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5 italic">
                              Calculated as:{" "}
                              <span className="font-bold text-slate-700">
                                Max Points × (Average Achievement % ÷ 100)
                              </span>
                            </p>
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-600 font-medium list-disc pl-4">
                            <li>100% achievement: 20 points</li>
                            <li>90% achievement: 18 points</li>
                            <li>75% achievement: 15 points</li>
                            <li>50% achievement: 10 points</li>
                          </ul>
                          <p className="text-[11px] text-[#1e40af] font-bold italic opacity-70">
                            * If a KPI has target 0 but actual is positive, it's
                            counted as 100% achievement.
                          </p>
                        </div>
                      </div>

                      {/* 2. Checklist */}
                      <div className="flex gap-4">
                        <div className="bg-[#ecfdf5] h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 border border-green-100">
                          <CheckCircle2 size={20} className="text-[#10b981]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-[#065f46] tracking-tight">
                            2. Daily Checklist Achievement (Max 10 points)
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                            Points awarded proportionally based on percentage of
                            daily KRA items completed.
                          </p>
                        </div>
                      </div>

                      {/* 3. Accomplishments */}
                      <div className="flex gap-4">
                        <div className="bg-[#f5f3ff] h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 border border-purple-100">
                          <ListTodo size={20} className="text-[#8b5cf6]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-purple-900 tracking-tight">
                            3. Accomplishments (Max 10 points)
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                            Points awarded proportionally based on percentage of
                            accomplishments marked as completed.
                          </p>
                        </div>
                      </div>

                      {/* 4. Tasks & Issues */}
                      <div className="flex gap-4">
                        <div className="bg-[#fff7ed] h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 border border-orange-100">
                          <CheckSquare size={20} className="text-[#ea580c]" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-[#9a3412] tracking-tight">
                            4. Tasks & Issues (Max 20 points)
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-600 font-medium list-disc pl-4 leading-relaxed">
                            <li>
                              Task/issue closed on report day (within target
                              date or no target):{" "}
                              <span className="text-green-600 font-bold">
                                +5 points each
                              </span>
                            </li>
                            <li>
                              Task/issue closed on report day (after target
                              date):{" "}
                              <span className="text-blue-600 font-bold">
                                +2 points each
                              </span>
                            </li>
                            <li>
                              New issue reported on report day:{" "}
                              <span className="text-blue-600 font-bold">
                                +2 points each (max 10 points)
                              </span>
                            </li>
                            <li>
                              Overdue tasks/issues:{" "}
                              <span className="text-red-600 font-bold">
                                -5 points each (max -15 deduction)
                              </span>
                            </li>
                          </ul>
                          <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed pt-1">
                            Only tasks closed on the day of the report or new
                            issues reported on that day are counted. For larger
                            numbers of tasks/issues, the total positive score is
                            capped at the maximum available points before
                            penalties are applied.
                          </p>
                        </div>
                      </div>

                      {/* 5. Items Planned */}
                      <div className="flex gap-4">
                        <div className="bg-[#ecfeff] h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 border border-cyan-100">
                          <Calendar size={20} className="text-cyan-600" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-[#164e63] tracking-tight">
                            5. Items Planned for Coming Day (Max 20 points)
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-600 font-medium list-disc pl-4 leading-relaxed">
                            <li>
                              Regular items:{" "}
                              <span className="text-slate-900 font-bold">
                                +2 points each
                              </span>
                            </li>
                            <li>
                              <span className="inline-flex items-center gap-1">
                                <Star
                                  size={12}
                                  className="text-[#eab308] fill-[#eab308]"
                                />{" "}
                                Starred items:
                              </span>{" "}
                              <span className="text-slate-900 font-bold">
                                +4 points each (double points, max 3 stars)
                              </span>
                            </li>
                          </ul>
                          <p className="text-xs text-slate-400 font-medium italic">
                            Planning ahead shows proactivity and organization.
                          </p>
                        </div>
                      </div>

                      {/* 6. Report Timing */}
                      <div className="flex gap-4">
                        <div className="bg-[#fffbeb] h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 border border-yellow-100">
                          <Clock size={20} className="text-yellow-600" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-yellow-900 tracking-tight">
                            6. Report Timing (Max 20 points)
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-600 font-medium list-disc pl-4">
                            <li>
                              Submitted by 7pm same day:{" "}
                              <span className="text-slate-900 font-bold">
                                20 points
                              </span>
                            </li>
                            <li>
                              Submitted by 11:59pm same day:{" "}
                              <span className="text-slate-900 font-bold">
                                15 points
                              </span>
                            </li>
                            <li>
                              Submitted 12am-7am next day:{" "}
                              <span className="text-slate-900 font-bold">
                                10 points
                              </span>
                            </li>
                            <li>
                              Submitted 7am-9am next day:{" "}
                              <span className="text-slate-900 font-bold">
                                5 points
                              </span>
                            </li>
                            <li>
                              Submitted after 9am next day:{" "}
                              <span className="text-slate-900 font-bold">
                                0 points
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Point Allocation Box */}
                    <div className="bg-[#eff6ff] border border-blue-100 rounded-[14px] p-6 space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-white p-1 rounded-md shadow-sm">
                          <BarChart3 size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-black text-[#1e40af] uppercase tracking-widest">
                          Dynamic Point Allocation
                        </span>
                      </div>
                      <ul className="space-y-2 text-xs text-[#1e40af] font-medium leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="font-bold">•</span>
                          <span>
                            <span className="font-black">
                              No Checklist Items:
                            </span>{" "}
                            Accomplishments get +10 bonus points (max 20)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold">•</span>
                          <span>
                            <span className="font-black">No Daily KPIs:</span>{" "}
                            Accomplishments, Tasks, Planning, and Timing each
                            get +5 bonus points
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0 pt-0">
            {isHistoryLoading ? (
              <Card className="p-20 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-[16px]">
                <Loader2
                  size={40}
                  className="text-blue-500 animate-spin mb-4"
                />
                <p className="text-gray-500 font-bold">
                  Loading your report history...
                </p>
              </Card>
            ) : reportsList.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-6">
                  {reportsList.map((report) => (
                    <Card
                      key={report.id}
                      className="bg-white border border-gray-200 rounded-[12px] shadow-sm overflow-hidden transition-all"
                    >
                      <div className="p-6">
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                          <div>
                            <h2 className="text-xl font-medium text-[#1a1a1a]">
                              {new Date(report.start_date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </h2>
                            <p className="text-sm text-gray-500 mt-2">
                              By: Common Admin Id
                            </p>
                          </div>

                          <div className="flex items-start gap-4">
                            {/* Badges */}
                            <div className="flex flex-col items-end gap-2">
                              <Badge className="bg-[#f59e0b] hover:bg-[#f59e0b] text-white px-2.5 py-1.5 rounded-[4px] border-none text-xs font-bold flex items-center justify-center gap-1.5 w-fit shadow-sm">
                                <Star size={12} className="fill-white" />
                                {report.report_data?.details?.self_rating ?? report.report_data?.self_rating ?? report.self_rating ?? 0}/10
                              </Badge>
                              <Badge className="bg-[#dc2626] hover:bg-[#dc2626] text-white px-2.5 py-1.5 rounded-[4px] border-none text-xs font-bold flex items-center justify-center gap-1.5 w-fit shadow-sm">
                                <Target size={12} className="fill-white" />
                                {report.report_data?.total_score || 0}/100
                              </Badge>
                              <Badge variant="outline" className="text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-[4px] text-[11px] font-medium w-fit mt-1">
                                {new Date(report.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                              </Badge>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-4 text-blue-600 border-gray-200 hover:bg-blue-50 text-xs font-medium rounded-[4px] flex items-center justify-center gap-2 shadow-sm min-w-[85px]"
                                onClick={() => {
                                  const date = new Date(report.start_date);
                                  const formattedDate = date.toLocaleDateString("en-CA");

                                  // Set the start date first (this triggers the fetchExistingReport useEffect)
                                  setStartDate(formattedDate);

                                  // Set calendar dates
                                  setSelectedDate(
                                    date.getDate().toString().padStart(2, "0")
                                  );
                                  setSelectedMonth(
                                    date.toLocaleString("default", { month: "long" })
                                  );
                                  setSelectedYear(date.getFullYear().toString());

                                  // Set the current report ID
                                  setCurrentReportId(report.id);

                                  // Populate accomplishments
                                  if (report.report_data?.accomplishments?.items) {
                                    setAccomplishments(
                                      report.report_data.accomplishments.items.map((ach: any, idx: number) => ({
                                        id: `fetched-ach-${idx}`,
                                        text: ach.title || "",
                                        completed: true,
                                        starred: false,
                                      }))
                                    );
                                  } else {
                                    setAccomplishments([]);
                                  }

                                  // Load accomplishment attachments
                                  if (report.report_data?.accomplishments?.attachments) {
                                    setUploadedFiles(
                                      report.report_data.accomplishments.attachments.map((att: any, idx: number) => ({
                                        id: `fetched-att-${idx}`,
                                        name: att.filename,
                                        size: "N/A",
                                        type: att.content_type,
                                        base64: att.base64,
                                      }))
                                    );
                                  } else {
                                    setUploadedFiles([]);
                                  }

                                  // Populate planning items
                                  if (report.report_data?.tomorrow_plan) {
                                    setPlanningItems(
                                      report.report_data.tomorrow_plan.map((p: any, idx: number) => ({
                                        id: `fetched-plan-${idx}`,
                                        text: p.title || "",
                                        starred: false,
                                      }))
                                    );
                                  } else {
                                    setPlanningItems([]);
                                  }

                                  // Set absence and rating
                                  if (report.is_absent !== undefined) setIsAbsent(report.is_absent);
                                  if (report.description) setAbsenceReason(report.description);
                                  if (report.self_rating !== undefined)
                                    setSelfRating([report.self_rating]);

                                  // Switch to submit tab
                                  setActiveTab("submit");

                                  // Scroll to top
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                              >
                                <Edit size={14} className="text-blue-500" /> Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-4 text-red-600 border-gray-200 hover:bg-red-50 text-xs font-medium rounded-[4px] flex items-center justify-center gap-2 shadow-sm min-w-[85px]"
                                onClick={() => {
                                  // console.log("Delete report", report.id);
                                }}
                              >
                                <Trash2 size={14} className="text-red-500" /> Delete
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Score Breakdown container */}
                        <div className="bg-[#f8fafc] border border-gray-200 rounded-[8px] p-4 mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <BarChart3 size={14} className="text-blue-500" />
                            <span className="text-xs font-bold text-slate-700">Score Breakdown</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white border border-gray-200 rounded-[6px] py-3 flex flex-col items-center justify-center shadow-sm">
                              <p className="text-[10px] text-gray-500 font-medium mb-1">Accomplishments</p>
                              <p className="text-base font-bold text-[#c026d3]">{report.report_data?.sections?.tasks_completed || 0}/25</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-[6px] py-3 flex flex-col items-center justify-center shadow-sm">
                              <p className="text-[10px] text-gray-500 font-medium mb-1">Tasks</p>
                              <p className="text-base font-bold text-[#ea580c]">{report.report_data?.sections?.attendance || 0}/25</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-[6px] py-3 flex flex-col items-center justify-center shadow-sm">
                              <p className="text-[10px] text-gray-500 font-medium mb-1">Planning</p>
                              <p className="text-base font-bold text-[#0d9488]">{report.report_data?.sections?.collaboration || 0}/25</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-[6px] py-3 flex flex-col items-center justify-center shadow-sm">
                              <p className="text-[10px] text-gray-500 font-medium mb-1">Timing</p>
                              <p className="text-base font-bold text-[#d97706]">0/25</p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Accomplishments */}
                          <div className="border border-green-200 rounded-[8px] overflow-hidden bg-[#f0fdf4]">
                            <div className="px-4 py-3 border-b border-green-200/50 flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-green-600" />
                              <span className="text-sm font-semibold text-[#1a1a1a]">Accomplishments</span>
                            </div>
                            <div className="p-4">
                              {report.report_data?.accomplishments?.items?.length ? (
                                <ul className="space-y-2">
                                  {report.report_data.accomplishments.items.map((ach: any, idx: number) => (
                                    <li key={idx} className="bg-white border border-green-100 rounded-[6px] px-3 py-2 text-sm text-gray-700 shadow-sm flex items-start gap-2">
                                      <span className="text-gray-400 font-medium">✓</span>
                                      {ach.title}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="bg-white border border-green-100 rounded-[6px] px-3 py-2 text-sm shadow-sm flex items-start gap-2">
                                  <p className="text-gray-400 italic">No accomplishments.</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Tomorrow's Plan */}
                          <div className="border border-purple-200 rounded-[8px] overflow-hidden bg-[#faf5ff]">
                            <div className="px-4 py-3 border-b border-purple-200/50 flex items-center gap-2">
                              <Target size={16} className="text-purple-600" />
                              <span className="text-sm font-semibold text-[#1a1a1a]">Tomorrow's Plan</span>
                            </div>
                            <div className="p-4">
                              {report.report_data?.tomorrow_plan?.length ? (
                                <ul className="space-y-2">
                                  {report.report_data.tomorrow_plan.map((task: any, idx: number) => (
                                    <li key={idx} className="bg-white border border-purple-100 rounded-[6px] px-3 py-2 text-sm text-gray-700 shadow-sm flex items-start gap-2">
                                      <span className="text-gray-400 font-bold mt-0.5">•</span>
                                      {task.title}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="bg-white border border-purple-100 rounded-[6px] px-3 py-2 text-sm shadow-sm flex items-start gap-2">
                                  <p className="text-gray-400 italic">No plan for tomorrow.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Attachments Section */}
                        {report.report_data?.accomplishments?.attachments?.length > 0 && (
                          <div className="space-y-3 mt-4">
                            <div className="flex items-center gap-2">
                              <Upload size={16} className="text-blue-600" />
                              <span className="text-sm font-bold text-[#1a1a1a]">Attachments ({report.report_data.accomplishments.attachments.length})</span>
                            </div>
                            <div className="space-y-2">
                              {report.report_data.accomplishments.attachments.map((att: any, idx: number) => (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    window.open(att.base64, '_blank');
                                  }}
                                  className="flex items-center justify-between bg-gray-50/80 p-3 rounded-[10px] border border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <ImageIcon size={16} className="text-blue-500" />
                                    <span className="text-sm font-medium text-blue-600 hover:underline">
                                      {att.filename}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {att.size || 'N/A'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="p-20 text-center text-gray-400 bg-white border border-gray-100 rounded-[16px] shadow-sm flex flex-col items-center gap-2">
                <CalendarIcon size={48} className="opacity-10 mb-2" />
                <p className="text-lg font-bold text-gray-300 tracking-tight">
                  No report history found for this period
                </p>
                <p className="text-sm font-medium text-gray-400/80">
                  Try selecting a different month or year
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <AddTaskOrIssueModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />
    </div>
  );
};

export default BusinessCompassDailyReport;
