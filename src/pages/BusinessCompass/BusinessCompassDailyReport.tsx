import React, { useState, useRef, forwardRef, useEffect, useMemo } from "react";
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
  Eye,
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
import { calculateLivePreviewScore } from "@/utils/scoreCalculation";
import axios from "axios";
import { useTasks } from "@/hooks/useTasks";
import { useIssues } from "@/hooks/useIssues";
import { Dialog, DialogContent, Slide, Menu, MenuItem } from "@mui/material";
import ProjectTaskCreateModal from "@/components/ProjectTaskCreateModal";
import { TransitionProps } from "@mui/material/transitions";
import AddIssueModal from "@/components/AddIssueModal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface AttachmentFile {
  id: number;
  document_file_name: string;
  document_content_type: string;
  document_file_size: number;
  document_updated_at: string;
  relation: string;
  relation_id: number;
  active: number;
  changed_by: string | null;
  added_from: string | null;
  comments: string | null;
  url: string;
  document_url: string;
}

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
    past_kpis?: {
      kpi_id: number;
      actual_value: number | string;
      target_value: number | string;
      notes: string;
    }[];
  };
  url: string;
  attachments: AttachmentFile[];
  self_rating?: number;
  is_absent?: boolean;
}

const BusinessCompassDailyReport: React.FC = () => {
  const navigate = useNavigate();
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(now.getDate().toString());
  const [startDate, setStartDate] = useState(now.toLocaleDateString("en-CA"));
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isBannerExpanded, setIsBannerExpanded] = useState(false);
  const [selfRating, setSelfRating] = useState([2]);
  const [isAbsent, setIsAbsent] = useState(false);
  const [absenceReason, setAbsenceReason] = useState("");
  const [isDetailedScoreExpanded, setIsDetailedScoreExpanded] = useState(false);
  const [isScoreInfoExpanded, setIsScoreInfoExpanded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    now.toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(
    now.getFullYear().toString()
  );
  const [accomplishments, setAccomplishments] = useState<
    { id: string; text: string; completed: boolean; starred: boolean }[]
  >([]);
  const [planningItems, setPlanningItems] = useState<
    { id: string; text: string; starred: boolean }[]
  >([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      id: string;
      name: string;
      size: string;
      type: string;
      base64?: string;
      file?: File;
    }[]
  >([]);
  const [reportAttachments, setReportAttachments] = useState<AttachmentFile[]>(
    []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const closureFileInputRef = useRef<HTMLInputElement>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openIssueModal, setOpenIssueModal] = useState(false);
  const [taskIssueMenuAnchor, setTaskIssueMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [showClosureModal, setShowClosureModal] = useState(false);
  const [closureItem, setClosureItem] = useState<any>(null);
  const [closureRemarks, setClosureRemarks] = useState("");
  const [closureAttachments, setClosureAttachments] = useState<any[]>([]);
  const [isClosureSubmitting, setIsClosureSubmitting] = useState(false);

  // Tasks and Issues data state
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const [mergedTasksIssues, setMergedTasksIssues] = useState<any[]>([]);
  const [selectedTasksIssues, setSelectedTasksIssues] = useState<{
    [key: string]: boolean;
  }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  console.log(selectedTasksIssues)

  // Pagination state
  const [currentTasksPage, setCurrentTasksPage] = useState(1);
  const [currentIssuesPage, setCurrentIssuesPage] = useState(1);
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [hasMoreIssues, setHasMoreIssues] = useState(true);

  // Get current user for filtering my tasks/issues
  const user =
    typeof localStorage !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userId = user?.id;

  // Build filter for my issues
  const myIssuesFilter = `
  q[status_in][]=open
  &q[status_in][]=overdued
  &q[status_in][]=completed
  ${userId ? `&q[responsible_person_id_eq]=${userId}` : ""}
`.replace(/\s+/g, "");

  // Fetch tasks and issues with pagination
  const { data: tasksData, isLoading: tasksLoading } = useTasks({
    taskType: "my",
    page: currentTasksPage,
    filters: {
      "q[start_date_or_target_date_eq]": startDate,
    },
  });

  const { data: issuesData, isLoading: issuesLoading } = useIssues({
    baseUrl,
    token,
    page: currentIssuesPage,
    filters: myIssuesFilter,
    enabled: !!token && !!userId,
  });

  // Merge and filter tasks and issues with infinite scroll support
  useEffect(() => {
    const tasks =
      tasksData?.data?.task_managements || tasksData?.task_managements || [];
    const issues = issuesData?.issues || [];

    // Check if there are more pages
    const tasksPagination =
      tasksData?.data?.pagination || tasksData?.pagination;
    const issuesPagination = issuesData?.pagination;

    setHasMoreTasks(currentTasksPage < (tasksPagination?.total_pages || 1));
    setHasMoreIssues(currentIssuesPage < (issuesPagination?.total_pages || 1));

    // Transform tasks
    const transformedTasks = tasks.map((task: any) => ({
      id: `task-${task.id}`,
      title: task.title,
      type: "task",
      status: task.status || "open",
      priority: task.priority || "Medium",
      created_at: task.created_at,
      responsible: task.responsible_person_id,
      originalData: task,
    }));

    // Transform issues
    const transformedIssues = issues.map((issue: any) => ({
      id: `issue-${issue.id}`,
      title: issue.title,
      type: "issue",
      status: issue.status || "open",
      priority: issue.priority || "Medium",
      created_at: issue.created_at,
      responsible: issue.responsible_person_id,
      originalData: issue,
    }));

    const newData = [...transformedTasks, ...transformedIssues].sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    );

    // For first page, replace data; for subsequent pages, append
    if (currentTasksPage === 1 && currentIssuesPage === 1) {
      setMergedTasksIssues(newData);
    } else {
      setMergedTasksIssues((prev) => {
        // Remove duplicates by ID and append new data
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewData = newData.filter(
          (item) => !existingIds.has(item.id)
        );
        const merged = [...prev, ...uniqueNewData].sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        );
        return merged;
      });
    }

    setIsLoadingMore(false);
  }, [tasksData, issuesData, currentTasksPage, currentIssuesPage]);

  // Auto-select completed/closed tasks and issues
  useEffect(() => {
    const completedItems: { [key: string]: boolean } = {};
    mergedTasksIssues.forEach((item) => {
      if (item.status === "completed" || item.status === "closed") {
        completedItems[item.id] = true;
      }
    });
    setSelectedTasksIssues(completedItems);
  }, [mergedTasksIssues]);

  // Handle infinite scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (isNearBottom && !isLoadingMore && !tasksLoading && !issuesLoading) {
        setIsLoadingMore(true);

        // Load next page of tasks if available
        if (hasMoreTasks) {
          setCurrentTasksPage((prev) => prev + 1);
        }

        // Load next page of issues if available
        if (hasMoreIssues) {
          setCurrentIssuesPage((prev) => prev + 1);
        }

        // If no more pages, stop loading
        if (!hasMoreTasks && !hasMoreIssues) {
          setIsLoadingMore(false);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore, tasksLoading, issuesLoading, hasMoreTasks, hasMoreIssues]);

  // Calculate counts for different statuses
  const taskIssueCounts = useMemo(() => {
    const completed = mergedTasksIssues.filter(
      (item) => item.status === "completed" || item.status === "closed"
    ).length;
    const open = mergedTasksIssues.filter(
      (item) => item.status === "open" || item.status === "reopen"
    ).length;
    const overdue = mergedTasksIssues.filter(
      (item) => item.status === "overdue"
    ).length;
    const onHold = mergedTasksIssues.filter(
      (item) => item.status === "on_hold"
    ).length;
    const inProgress = mergedTasksIssues.filter(
      (item) => item.status === "in_progress"
    ).length;

    return {
      completed,
      open,
      overdue,
      onHold,
      inProgress,
      total: mergedTasksIssues.length,
    };
  }, [mergedTasksIssues]);

  // KPI State
  const [kpis, setKpis] = useState<any[]>([]);
  const [kpiLoading, setKpiLoading] = useState(false);
  const [kpiEntries, setKpiEntries] = useState<{ [key: number]: string }>({});

  // Calculate daily score based on current form data
  const dailyScore = useMemo(() => {
    // Convert kpi entries to the format expected by the calculator
    const kpisWithActualValues = kpis.map((kpi) => ({
      ...kpi,
      actual_value: kpiEntries[kpi.kpi_id] || 0,
    }));

    return calculateLivePreviewScore(
      kpisWithActualValues,
      accomplishments,
      mergedTasksIssues,
      planningItems
    );
  }, [kpis, kpiEntries, accomplishments, mergedTasksIssues, planningItems]);

  // Fetch KPIs based on selected date
  useEffect(() => {
    const fetchKpis = async () => {
      try {
        setKpiLoading(true);
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");

        if (!baseUrl || !token) {
          console.warn("Missing baseUrl or token");
          return;
        }

        const response = await axios.get(
          `https://${baseUrl}/kpis/due_entries.json?date=${startDate}&journal_type=daily`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.success && response.data.data) {
          setKpis(response.data.data.kpis || []);
          // Initialize entries from existing data
          const entries: { [key: number]: string } = {};
          response.data.data.kpis?.forEach((kpi: any) => {
            if (kpi.entry && kpi.entry.actual_value) {
              entries[kpi.kpi_id] = kpi.entry.actual_value;
            }
          });
          setKpiEntries(entries);
        }
      } catch (error) {
        console.error("Error fetching KPIs:", error);
      } finally {
        setKpiLoading(false);
      }
    };

    if (startDate) {
      fetchKpis();
    }
  }, [startDate]);

  // Helper function to determine if file is an image
  const isImageFile = (fileName: string, contentType: string) => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
    ];
    const lowerFileName = fileName.toLowerCase();
    return (
      contentType.startsWith("image/") ||
      imageExtensions.some((ext) => lowerFileName.endsWith(ext))
    );
  };

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

  // Transfer unchecked accomplishments to tomorrow's plan
  const transferUncheckedToTomorrow = () => {
    const unchecked = accomplishments.filter((a) => !a.completed);
    const newPlanItems = unchecked.map((a) => ({
      id: `transferred-${Date.now()}-${a.id}`,
      text: a.text,
      starred: a.starred,
    }));
    setPlanningItems((prev) => [...prev, ...newPlanItems]);
    setAccomplishments((prev) => prev.filter((a) => a.completed));
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerClosureFileUpload = () => {
    closureFileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const handleClosureFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    setClosureAttachments((prev) => [...prev, ...newFiles].slice(0, 5));
    // Reset input
    if (closureFileInputRef.current) closureFileInputRef.current.value = "";
  };

  const handleMarkItemClosed = async () => {
    if (!closureItem || !baseUrl || !token) return;
    console.log(closureItem)

    setIsClosureSubmitting(true);
    try {
      const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
      const isTask = closureItem.type === "task";
      const urlBase = `https://${baseUrl}`;

      // 🚨 FIX 1: "task-123" mein se sirf number nikalo API ke liye
      const realId = closureItem.id.replace("task-", "").replace("issue-", "");

      // 🚨 FIX 2: UI aur color ko turant update karo (Optimistic Update)
      setMergedTasksIssues((prev) =>
        prev.map((item) =>
          item.id === closureItem.id ? { ...item, status: "completed" } : item
        )
      );

      setSelectedTasksIssues((prev) => ({
        ...prev,
        [closureItem.id]: true,
      }));

      const formDataToSend = new FormData();

      // Step 1: Update the item status in API
      if (isTask) {
        formDataToSend.append("task_management[status]", "completed");
        closureAttachments.forEach((attachment) => {
          formDataToSend.append(
            `task_management[attachments][]`,
            attachment.file
          );
        });

        await axios.put(
          `${urlBase}/task_managements/${realId}.json`, // Yahan realId use kiya
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        formDataToSend.append("issue[status]", "completed");
        closureAttachments.forEach((attachment) => {
          formDataToSend.append(`issue[attachments][]`, attachment.file);
        });

        await axios.put(
          `${urlBase}/issues/${realId}.json`, // Yahan realId use kiya
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Step 2: Add closure remarks as a comment
      if (closureRemarks.trim()) {
        const commentPayload = {
          comment: {
            body: `Closure Remarks: ${closureRemarks}`,
            commentable_id: realId, // Yahan realId use kiya
            commentable_type: isTask ? "TaskManagement" : "Issue",
            commentor_id: userId,
            active: true,
          },
        };

        await axios.post(`${urlBase}/comments.json`, commentPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Close modal and reset
      setShowClosureModal(false);
      setClosureRemarks("");
      setClosureAttachments([]);
      setClosureItem(null);

      // Fetch updated tasks and issues
      setCurrentTasksPage(1);
      setCurrentIssuesPage(1);

      // Show success message
      const itemName = isTask ? "Task" : "Issue";
      const message =
        closureRemarks.trim() || closureAttachments.length > 0
          ? `${itemName} marked as closed with remarks and attachments`
          : `${itemName} marked as closed`;

      if (typeof window !== "undefined" && (window as any).toast) {
        (window as any).toast.success(message);
      }
    } catch (error) {
      console.error("Error marking item as closed:", error);
      const itemName = closureItem?.type === "task" ? "task" : "issue";

      // Agar API fail ho jaye toh color wapas pehle jaisa kar do (Optional but safe)
      setMergedTasksIssues((prev) =>
        prev.map((item) =>
          item.id === closureItem.id
            ? { ...item, status: closureItem.status }
            : item
        )
      );

      if (typeof window !== "undefined" && (window as any).toast) {
        (window as any).toast.error(`Failed to close ${itemName}`);
      }
    } finally {
      setIsClosureSubmitting(false);
    }
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
      } else if (isPast || isToday) {
        type = "missed";
        status = isToday ? "Today" : "Miss";
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
    setSelectedMonth(
      item.actualDate.toLocaleString("default", { month: "long" })
    );
    setSelectedYear(item.actualDate.getFullYear().toString());

    // Find the report for this date from reportsList
    const report = reportsList.find((r) => r.start_date === item.fullDate);

    if (report && report.id) {
      setCurrentReportId(report.id);

      // Populate accomplishments
      if (report.report_data?.accomplishments?.items) {
        setAccomplishments(
          report.report_data.accomplishments.items.map(
            (ach: any, idx: number) => ({
              id: `fetched-ach-${idx}`,
              text: ach.title || "",
              completed: true,
              starred: false,
            })
          )
        );
      } else {
        setAccomplishments([]);
      }

      // Load report attachments (from API response)
      if (report.attachments && report.attachments.length > 0) {
        setReportAttachments(report.attachments);
      } else {
        setReportAttachments([]);
      }

      // Populate planning items (tomorrow's plan)
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

      // Populate KPI entries
      if (report.report_data?.past_kpis) {
        const entries: { [key: number]: string } = {};
        report.report_data.past_kpis.forEach((kpiEntry: any) => {
          entries[kpiEntry.kpi_id] = kpiEntry.actual_value.toString();
        });
        setKpiEntries(entries);
      } else {
        setKpiEntries({});
      }

      // Set absence and rating
      if (report.is_absent !== undefined) setIsAbsent(report.is_absent);
      if (report.description) setAbsenceReason(report.description);
      if (report.self_rating !== undefined) setSelfRating([report.self_rating]);
      setSelectedTasksIssues({});
    } else {
      // No report found for this date, clear the form
      setCurrentReportId(null);
      setAccomplishments([]);
      setUploadedFiles([]);
      setReportAttachments([]);
      setPlanningItems([]);
      setKpiEntries({});
      setSelectedTasksIssues({});
      setIsAbsent(false);
      setAbsenceReason("");
      setSelfRating([2]);
    }
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

              // Load report attachments (from API response)
              if (
                existingReport.attachments &&
                existingReport.attachments.length > 0
              ) {
                setReportAttachments(existingReport.attachments);
              } else {
                setReportAttachments([]);
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

              if (rData.past_kpis) {
                const entries: { [key: number]: string } = {};
                rData.past_kpis.forEach((kpiEntry: any) => {
                  entries[kpiEntry.kpi_id] = kpiEntry.actual_value.toString();
                });
                setKpiEntries(entries);
              } else {
                setKpiEntries({});
              }

              if (existingReport.is_absent !== undefined)
                setIsAbsent(existingReport.is_absent);
              if (existingReport.description)
                setAbsenceReason(existingReport.description);
              if (existingReport.self_rating !== undefined)
                setSelfRating([existingReport.self_rating]);
              setSelectedTasksIssues({});
            }
          } else {
            setCurrentReportId(null);
            setAccomplishments([]);
            setUploadedFiles([]);
            setReportAttachments([]);
            setPlanningItems([]);
            setKpiEntries({});
            setSelectedTasksIssues({});
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
      });

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
          report_date: startDate,
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
            tasks_issues: mergedTasksIssues
              .filter(
                (item) =>
                  selectedTasksIssues[item.id] ||
                  item.status === "completed" ||
                  item.status === "closed"
              )
              .map((item) => ({
                id: item.originalData?.id,
                name: item.title,
                type: item.type,
                status: "completed",
                original_status: item.status,
                priority: item.priority,
              })),
            tomorrow_plan: planningItems.map((p) => ({
              title: p.text,
            })),
            past_kpis: kpis.map((kpi) => ({
              kpi_id: kpi.kpi_id,
              actual_value: kpiEntries[kpi.kpi_id]
                ? parseFloat(kpiEntries[kpi.kpi_id])
                : 0,
              target_value: parseFloat(kpi.target_value),
              notes: kpi.kpi_name,
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

      // Refetch reports list to update history
      fetchReportsList();

      // Redirect to history tab after a short delay
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab("history");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1500);
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-poppins pb-20 text-[#1a1a1a]">
      {/* Interactive Info Banner Card */}
      {isBannerVisible && (
        <Card
          className={cn(
            "bg-[#eff6ff] border-blue-200 rounded-[12px] shadow-sm overflow-hidden border transition-all duration-300",
            isBannerExpanded ? "max-h-[1000px]" : "max-h-[80px]"
          )}
        >
          <CardContent className="p-0">
            <div
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-blue-100/50 transition-colors"
              onClick={() => setIsBannerExpanded(!isBannerExpanded)}
            >
              <div className="bg-[#2563eb] text-white p-2.5 rounded-[8px] flex items-center justify-center shadow-sm">
                <Lightbulb size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#1e3a8a] text-sm tracking-tight">
                  How to Fill Your Daily Report
                </h4>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-blue-500 h-8 w-8 hover:bg-blue-100 rounded-full border-none transition-transform duration-200",
                    isBannerExpanded && "rotate-180"
                  )}
                >
                  <ChevronRight size={18} className="rotate-90" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 h-8 w-8 hover:bg-gray-100 rounded-full border-none"
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
                  <h5 className="text-sm font-bold text-[#1e3a8a]">
                    How to use:
                  </h5>
                  <ul className="space-y-2 text-xs text-[#1e3a8a]/70 font-medium list-disc pl-4">
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
                  <h5 className="text-sm font-bold text-[#1e3a8a] flex items-center gap-2">
                    💡 Best Practices:
                  </h5>
                  <ul className="space-y-2 text-xs text-[#1e3a8a]/70 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>
                        Be specific in accomplishments - 'Completed X project'
                        not just 'worked on projects'
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>
                        Tag team members in challenges when you need their help
                        using @mentions
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
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
          <TabsList className="bg-gray-100 p-1.5 rounded-[12px] h-auto inline-flex shadow-inner mb-6">
            <TabsTrigger
              value="submit"
              className="rounded-[10px] px-8 py-2 data-[state=active]:bg-white data-[state=active]:text-[#1a1a1a] data-[state=active]:shadow-md bg-transparent text-gray-500 transition-all font-bold text-sm"
            >
              Submit Report
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-[10px] px-8 py-2 data-[state=active]:bg-white data-[state=active]:text-[#1a1a1a] data-[state=active]:shadow-md bg-transparent text-gray-500 transition-all font-bold text-sm"
            >
              Report History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-6 mt-0">
            {/* Calendar Card */}
            <Card className="rounded-[16px] border border-gray-200 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <CalendarIcon size={20} className="text-blue-600" />
                    </div>
                    <span className="text-lg font-bold text-[#1a1a1a] tracking-tight">
                      Daily Report for {selectedDate}{" "}
                      {selectedMonth.slice(0, 3)}, {selectedYear}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x">
                  {days.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "min-w-[96px] h-[110px] rounded-[16px] flex flex-col items-center justify-center gap-1.5 cursor-pointer border-2 transition-all shrink-0 snap-center shadow-sm relative group",
                        item.isFuture &&
                          "opacity-40 grayscale cursor-not-allowed pointer-events-none",
                        item.type === "missed" &&
                          "bg-[#ef4444] text-white border-[#ef4444]/20 hover:bg-[#dc2626]",
                        item.type === "holiday" &&
                          "bg-[#facd55] text-[#854d0e] border-[#facd55]/20 hover:bg-[#facc15]",
                        item.type === "upcoming" &&
                          "bg-[#f8fafc] text-[#94a3b8] border-gray-100 hover:bg-gray-100",
                        item.type === "filled" &&
                          "bg-[#22c55e] text-white border-[#22c55e]/20 hover:bg-[#16a34a]",
                        selectedDate === item.date && !item.isFuture
                          ? "ring-4 ring-blue-500/20 scale-105 z-10 text-white"
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
                            item.type === "missed" || item.type === "filled"
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
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full border-2 border-blue-500 shadow-sm" />
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
                    <div className="w-3.5 h-3.5 rounded-[5px] bg-[#f1f5f9] shadow-inner border border-gray-100" />
                    <span className="opacity-80">Upcoming</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!isAbsent && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Daily KPIs Card */}
                {kpis.length > 0 && (
                  <Card className="rounded-[16px] border-2 border-[#f59e0b] overflow-hidden bg-white shadow-sm">
                    <div className="bg-[#fffbeb] p-5 flex items-center justify-between border-b border-[#f59e0b]/10">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-1 rounded-full border border-[#f59e0b]/30">
                          <TrendingUp size={18} className="text-[#f59e0b]" />
                        </div>
                        <h3 className="text-sm font-bold text-[#1a1a1a] tracking-tight">
                          Daily KPIs
                        </h3>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      {kpis.map((kpi) => (
                        <div
                          key={kpi.kpi_id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-[#fafafa] border border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-bold text-[#1a1a1a] truncate">
                                {kpi.kpi_name}
                              </h4>
                              {!kpi.submitted && (
                                <Badge className="bg-[#ef4444] text-white px-2 py-0.5 rounded-[4px] text-[10px] font-bold border-none shadow-sm whitespace-nowrap">
                                  new
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="font-medium">
                                Target: {kpi.unit} {kpi.target_value}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500">
                                {kpi.frequency_label}
                              </span>
                            </div>
                          </div>
                          <div className="w-32">
                            <input
                              type="number"
                              value={kpiEntries[kpi.kpi_id] || ""}
                              onChange={(e) =>
                                setKpiEntries((prev) => ({
                                  ...prev,
                                  [kpi.kpi_id]: e.target.value,
                                }))
                              }
                              placeholder="0"
                              className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[10px] text-sm font-bold text-right bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/30 focus:border-[#f59e0b]"
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Today's Accomplishments Card */}
                <Card className="rounded-[16px] border-2 border-[#10b981] overflow-hidden bg-white shadow-sm">
                  <div className="bg-[#ecfdf5] p-5 flex items-center justify-between border-b border-[#10b981]/10">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-1 rounded-full border border-[#10b981]/30">
                        <CheckCircle2 size={18} className="text-[#10b981]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#1a1a1a] tracking-tight">
                        Today's Accomplishments
                      </h3>
                    </div>
                    <Badge className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-3 py-1 rounded-[6px] text-[10px] font-black tracking-widest border-none shadow-sm">
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
                              "flex items-center gap-4 bg-white border rounded-[10px] p-3 transition-all",
                              item.completed
                                ? "border-[#10b981] bg-green-50/10"
                                : "border-gray-200"
                            )}
                          >
                            <div
                              className={cn(
                                "h-6 w-6 rounded-[6px] flex items-center justify-center cursor-pointer transition-colors border-2",
                                item.completed
                                  ? "bg-[#1a1a1a] border-[#1a1a1a]"
                                  : "bg-white border-gray-300"
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
                              className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full border-none opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeAccomplishment(item.id)}
                            >
                              <X size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {accomplishments.length === 0 && (
                        <div className="flex flex-col items-center gap-4 text-center py-10 bg-gray-50/50 rounded-[14px] border-2 border-dashed border-gray-100">
                          <div className="h-16 w-16 rounded-full bg-[#ecfdf5] border-2 border-[#10b981]/20 flex items-center justify-center">
                            <CheckCircle2
                              size={32}
                              className="text-[#10b981]/30"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-bold text-[#065f46]">
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
                          className="flex-1 h-11 border-[#10b981]/30 text-[#10b981] font-bold text-sm bg-white hover:bg-[#ecfdf5] rounded-[8px] flex items-center justify-center gap-2"
                          onClick={addAccomplishment}
                        >
                          <Plus size={18} />
                          Add Item
                        </Button>

                        {accomplishments.some((a) => !a.completed) && (
                          <Button
                            variant="outline"
                            className="h-11 border-blue-200 text-blue-600 font-bold text-xs bg-white hover:bg-blue-50 rounded-[8px] px-4"
                            onClick={transferUncheckedToTomorrow}
                          >
                            Transfer unchecked to tomorrow
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-[#059669] font-black uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                        <Info size={14} />
                        <span>Limits: Images 2MB, Others 5MB</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-400">
                          {uploadedFiles.length + reportAttachments.length}/5
                        </span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          multiple
                          className="hidden"
                        />
                        <Button
                          disabled={
                            uploadedFiles.length + reportAttachments.length >= 5
                          }
                          className={cn(
                            "bg-[#10b981] text-white font-black px-6 h-10 rounded-[8px] flex items-center gap-2 text-xs shadow-md transition-all border-none",
                            uploadedFiles.length + reportAttachments.length >= 5
                              ? "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                              : "hover:bg-[#059669]"
                          )}
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
                              <ImageIcon size={16} className="text-blue-500" />
                              <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
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
                                className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full border-none"
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

                    {/* Report Attachments Section */}
                    {reportAttachments && reportAttachments.length > 0 && (
                      <div className="space-y-3 mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Upload size={16} className="text-purple-600" />
                          <span className="text-sm font-bold text-[#1a1a1a]">
                            Linked Files ({reportAttachments.length})
                          </span>
                        </div>
                        <div className="space-y-2">
                          {reportAttachments.map(
                            (attachment: AttachmentFile, idx: number) => {
                              const isImage = isImageFile(
                                attachment.document_file_name,
                                attachment.document_content_type
                              );
                              return (
                                <div
                                  key={attachment.id || idx}
                                  className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-[10px] border border-purple-100 hover:shadow-md transition-all group cursor-pointer"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {isImage ? (
                                      <ImageIcon
                                        size={20}
                                        className="text-purple-600 shrink-0"
                                      />
                                    ) : (
                                      <FileText
                                        size={20}
                                        className="text-blue-600 shrink-0"
                                      />
                                    )}
                                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                                      <a
                                        href={attachment.document_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline line-clamp-2 group-hover:text-purple-700 transition-colors"
                                      >
                                        {attachment.document_file_name}
                                      </a>
                                      <span className="text-[11px] text-gray-600 font-medium">
                                        {attachment.relation} •{" "}
                                        {(
                                          attachment.document_file_size / 1024
                                        ).toFixed(2)}{" "}
                                        KB •{" "}
                                        {new Date(
                                          attachment.document_updated_at
                                        ).toLocaleDateString("en-US", {
                                          month: "numeric",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0 ml-3">
                                    <Badge className="bg-purple-100 text-purple-700 border-none px-2.5 py-0.5 text-[10px] font-bold rounded-[4px] whitespace-nowrap">
                                      {attachment.active
                                        ? "Active"
                                        : "Inactive"}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tasks & Issues Card */}
                <Card className="rounded-[8px] border-2 border-[#b91c1c] overflow-hidden bg-white shadow-sm mt-6">
                  <div className="bg-[#fef2f2] p-4 border-b border-[#b91c1c]/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-1 rounded-md border border-[#b91c1c]/30">
                            <CheckSquare size={16} className="text-[#b91c1c]" />
                          </div>
                          <h3 className="text-sm font-bold text-[#1a1a1a] tracking-tight">
                            Tasks & Issues
                          </h3>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {tasksLoading || issuesLoading
                            ? "Loading..."
                            : `Total: ${taskIssueCounts.total} items`}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Badge
                            variant="outline"
                            className="bg-[#ecfdf5] text-[#047857] border-none rounded-[4px] px-2 py-0.5 font-bold text-[9px] flex items-center gap-1 shadow-sm"
                          >
                            <CheckSquare size={10} />
                            Completed: {taskIssueCounts.completed}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#eff6ff] text-[#1d4ed8] border-none rounded-[4px] px-2 py-0.5 font-bold text-[9px] flex items-center gap-1 shadow-sm"
                          >
                            <Info size={10} />
                            Open: {taskIssueCounts.open}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#fef2f2] text-[#b91c1c] border-none rounded-[4px] px-2 py-0.5 font-bold text-[9px] flex items-center gap-1 shadow-sm"
                          >
                            <Clock size={10} />
                            Overdue: {taskIssueCounts.overdue}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#fef3c7] text-[#92400e] border-none rounded-[4px] px-2 py-0.5 font-bold text-[9px] flex items-center gap-1 shadow-sm"
                          >
                            <Clock size={10} />
                            In Progress: {taskIssueCounts.inProgress}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#f3e8ff] text-[#6b21a8] border-none rounded-[4px] px-2 py-0.5 font-bold text-[9px] flex items-center gap-1 shadow-sm"
                          >
                            <Clock size={10} />
                            On Hold: {taskIssueCounts.onHold}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-[#ea580c] text-white px-3 py-1 rounded-[4px] text-[9px] font-black tracking-widest shadow-md">
                          {taskIssueCounts.completed}/20 PTS
                        </div>
                        <Button
                          className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-black px-4 h-8 rounded-[4px] flex items-center gap-2 text-[10px] shadow-md transition-all border-none"
                          onClick={(e) =>
                            setTaskIssueMenuAnchor(e.currentTarget)
                          }
                        >
                          <Plus size={14} />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {tasksLoading || issuesLoading ? (
                      <div className="flex flex-col items-center justify-center text-center py-10">
                        <Loader2
                          size={40}
                          className="text-[#b91c1c]/30 animate-spin mb-3"
                        />
                        <p className="text-sm font-bold text-gray-500">
                          Loading tasks and issues...
                        </p>
                      </div>
                    ) : mergedTasksIssues.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-10">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                          <CheckSquare
                            size={40}
                            className="text-[#b91c1c]/20"
                          />
                          <p className="text-base font-bold text-gray-400 tracking-tight">
                            No open tasks or issues
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="space-y-2 max-h-[400px] overflow-y-auto"
                        ref={scrollContainerRef}
                      >
                        {mergedTasksIssues.map((item: any) => (
                          <div
                            key={item.id}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-[10px] border transition-all",
                              item.status === "completed" ||
                                item.status === "closed"
                                ? "bg-green-50/50 border-green-200/50"
                                : item.status === "overdue" ||
                                    item.status === "on_hold"
                                  ? "bg-red-50/50 border-red-200/50"
                                  : item.status === "in_progress"
                                    ? "bg-amber-50/50 border-amber-200/50"
                                    : "bg-blue-50/50 border-blue-200/50"
                            )}
                          >
                            <Checkbox
                              checked={
                                selectedTasksIssues[item.id] ||
                                item.status === "completed" ||
                                item.status === "closed"
                              }
                              onCheckedChange={(checked) => {
                                if (
                                  checked &&
                                  item.status !== "completed" &&
                                  item.status !== "closed"
                                ) {
                                  setClosureItem(item);
                                  setShowClosureModal(true);
                                } else {
                                  setSelectedTasksIssues((prev) => ({
                                    ...prev,
                                    [item.id]: checked as boolean,
                                  }));
                                }
                              }}
                              className="h-5 w-5 rounded-[4px] border-gray-300 data-[state=checked]:bg-[#1a1a1a] data-[state=checked]:border-[#1a1a1a]"
                            />
                            <button
                              onClick={() => {
                                const detailsUrl = item.type === "task"
                                  ? `/vas/tasks/${item.originalData?.id}`
                                  : `/vas/issues/${item.originalData?.id}`;
                                navigate(detailsUrl);
                              }}
                              className="p-1.5 hover:bg-gray-200 rounded-[6px] transition-colors"
                              title={`View ${item.type} details`}
                            >
                              <Eye size={16} className="text-gray-600 hover:text-gray-800" />
                            </button>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white text-gray-600 uppercase">
                                {item.type}
                              </span>
                              {item.status === "completed" ||
                              item.status === "closed" ? (
                                <CheckCircle2
                                  size={16}
                                  className="text-green-600"
                                />
                              ) : item.status === "overdue" ||
                                item.status === "on_hold" ? (
                                <AlertCircle
                                  size={16}
                                  className="text-red-600"
                                />
                              ) : item.status === "in_progress" ? (
                                <Clock size={16} className="text-amber-600" />
                              ) : (
                                <Info size={16} className="text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={cn(
                                  "text-sm font-medium truncate",
                                  (item.status === "completed" ||
                                    item.status === "closed") &&
                                    "line-through text-gray-400"
                                )}
                              >
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {item.status.replace(/_/g, " ")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className="text-[10px] px-2 py-1 rounded-full font-bold"
                                style={{
                                  backgroundColor:
                                    item.priority === "High"
                                      ? "#fee2e2"
                                      : item.priority === "Medium"
                                        ? "#fef3c7"
                                        : "#dcfce7",
                                  color:
                                    item.priority === "High"
                                      ? "#991b1b"
                                      : item.priority === "Medium"
                                        ? "#92400e"
                                        : "#166534",
                                }}
                              >
                                {item.priority}
                              </span>

                            </div>
                          </div>
                        ))}
                        {isLoadingMore && (
                          <div className="flex items-center justify-center py-4">
                            <Loader2
                              size={20}
                              className="text-[#b91c1c]/50 animate-spin mr-2"
                            />
                            <p className="text-xs text-gray-500 font-medium">
                              Loading more...
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Bottom Tip Banner */}
                <div className="mt-6 bg-[#fffde7] border border-[#fef08a] p-4 rounded-[12px] flex items-center gap-3 shadow-sm">
                  <div className="bg-white p-1.5 rounded-full shadow-inner border border-[#fef08a]">
                    <Lightbulb size={18} className="text-[#ca8a04]" />
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    <span className="font-bold text-[#ca8a04]">
                      Delegate or Delete:
                    </span>{" "}
                    Look at your list. What doesn't actually need doing?
                  </p>
                </div>

                {/* Plan Card */}
                <Card className="rounded-[16px] border-2 border-[#3b82f6] overflow-hidden bg-white shadow-sm mt-6">
                  <div className="bg-[#eff6ff] p-5 flex items-center justify-between border-b border-[#3b82f6]/10">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-1 rounded-full border border-[#3b82f6]/30">
                        <CheckCircle2 size={18} className="text-[#3b82f6]" />
                      </div>
                      <h3 className="text-sm font-bold tracking-tight text-blue-900">
                        Plan for {nextDayLabel || "Tomorrow"}
                      </h3>
                    </div>
                    <Badge className="bg-[#0891b2] hover:bg-[#0e7490] text-white px-3 py-1 rounded-[6px] text-[10px] font-black tracking-widest border-none shadow-sm">
                      {dailyScore.planningScore}/
                      {dailyScore.details.planning.maxPoints} PTS
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
                            <div className="flex items-center gap-4 bg-white border border-[#3b82f6]/30 rounded-[10px] p-3 shadow-sm hover:border-[#3b82f6] transition-all">
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
                                  className="text-[#3b82f6] cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
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
                        <div className="h-16 w-16 rounded-full bg-[#eff6ff] border-2 border-[#3b82f6]/20 flex items-center justify-center">
                          <Calendar size={32} className="text-[#3b82f6]/30" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-bold text-blue-900">
                            Plan your next working day!
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            List 3-5 key tasks for {nextDayLabel || "tomorrow"}{" "}
                            to stay focused.
                          </p>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full h-11 border-[#3b82f6]/30 text-[#3b82f6] font-bold text-sm bg-white hover:bg-[#eff6ff] rounded-[8px] flex items-center justify-center gap-2"
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
            <Card className="rounded-[16px] border border-gray-100 shadow-sm bg-white p-6 mt-6">
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
                      className="cursor-pointer [&_[role=slider]]:bg-black [&_[role=slider]]:border-black [&_[data-orientation=horizontal]]:h-1 [&_[data-orientation=horizontal]_span:first-child]:bg-black"
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-[10px] border border-gray-100 min-w-[150px] justify-center">
                    <Checkbox
                      id="absent"
                      checked={isAbsent}
                      onCheckedChange={(checked) =>
                        setIsAbsent(checked as boolean)
                      }
                      className="h-5 w-5 rounded-[4px] border-gray-300 data-[state=checked]:bg-[#1a1a1a] data-[state=checked]:border-[#1a1a1a]"
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
                      className="h-12 rounded-[10px] border-gray-200 focus:ring-[#22c55e]/20"
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
                        ? "Daily report updated successfully. Redirecting to history..."
                        : "Daily report submitted successfully. Redirecting to history..."}
                    </div>
                  )}
                  <button
                    className={cn(
                      // Base styles
                      "w-full h-[56px] font-black text-[18px] rounded-[14px] transition-all duration-200 ease-in-out border-none flex items-center justify-center gap-2",

                      // Hover Effects (Scale up slightly, add bigger shadow, push down on click)
                      isSubmitting
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:translate-y-0 active:shadow-sm",

                      // Background Colors with Hover states (! zaruri hai taaki koi aur CSS panga na kare)
                      currentReportId
                        ? "!bg-[#2563eb] hover:!bg-[#1d4ed8]" // Blue to Darker Blue
                        : "!bg-[#16a34a] hover:!bg-[#15803d]" // Green to Darker Green
                    )}
                    style={{ color: "#ffffff" }} // Text ko hamesha white rakhne ke liye
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          size={20}
                          className="animate-spin"
                          style={{ color: "#ffffff" }}
                        />
                        <span
                          style={{ color: "#ffffff", margin: 0, padding: 0 }}
                        >
                          {currentReportId ? "Updating..." : "Submitting..."}
                        </span>
                      </>
                    ) : (
                      <span style={{ color: "#ffffff", margin: 0, padding: 0 }}>
                        {currentReportId ? "Update" : "Submit"} Daily Report
                        (for {selectedDate} {selectedMonth.slice(0, 3)})
                      </span>
                    )}
                  </button>
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
                <Card className="rounded-[20px] border border-purple-100 shadow-sm overflow-hidden bg-[#fdfaff]">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-100 p-1.5 rounded-full">
                          <Target size={18} className="text-[#8b5cf6]" />
                        </div>
                        <h3 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-1.5">
                          Live Score Preview
                          <HelpCircle
                            size={14}
                            className="text-blue-500 cursor-pointer"
                          />
                        </h3>
                      </div>
                      <span className="text-3xl font-black text-[#8b5cf6] tracking-tighter">
                        {dailyScore.totalScore}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        {
                          label: "KPI Achievement",
                          score: `${dailyScore.kpiScore}/${dailyScore.details.kpi.maxPoints}`,
                          color: "text-green-600",
                        },
                        {
                          label: "Accomplishments",
                          score: `${dailyScore.accomplishmentsScore}/${dailyScore.details.accomplishments.maxPoints}`,
                          color: "text-purple-600",
                        },
                        {
                          label: "Tasks & Issues",
                          score: `${dailyScore.tasksIssuesScore}/${dailyScore.details.tasksIssues.maxPoints}`,
                          color: "text-[#ea580c]",
                        },
                        {
                          label: "Planning",
                          score: `${dailyScore.planningScore}/${dailyScore.details.planning.maxPoints}`,
                          color: "text-blue-600",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-[14px] border border-purple-50 flex flex-col items-center gap-1 shadow-sm"
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
                        className="flex items-center justify-between text-gray-400 group cursor-pointer hover:text-purple-600 transition-colors"
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
                        {/* 1. KPI Achievement Detail */}
                        <div className="bg-white rounded-[14px] border border-purple-50 p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Target size={16} className="text-green-600" />
                              <span className="text-xs font-black text-green-900 uppercase tracking-widest">
                                Daily KPI Achievement
                              </span>
                            </div>
                            <span className="text-xs font-black text-green-600">
                              {dailyScore.kpiScore}/
                              {dailyScore.details.kpi.maxPoints} pts
                            </span>
                          </div>
                          <div className="space-y-2.5 pl-6 border-l-2 border-green-50">
                            {dailyScore.details.kpi.hasKPIs ? (
                              <>
                                {dailyScore.details.kpi.kpis.map(
                                  (kpi: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-[11px] font-bold text-gray-500"
                                    >
                                      <span className="flex items-center gap-2">
                                        • {kpi.name}:
                                      </span>
                                      <span className="text-gray-900">
                                        {kpi.achievement.toFixed(1)}% ={" "}
                                        {kpi.points.toFixed(2)} pts
                                      </span>
                                    </div>
                                  )
                                )}
                                <div className="flex items-center justify-between text-[11px] font-black text-green-900 pt-1 border-t border-gray-50">
                                  <span>Average Achievement:</span>
                                  <span>
                                    {dailyScore.details.kpi.averageAchievement.toFixed(
                                      1
                                    )}
                                    %
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="text-[11px] font-bold text-gray-500 italic">
                                No KPIs for this date
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 2. Accomplishments Detail */}
                        <div className="bg-white rounded-[14px] border border-purple-50 p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ListTodo size={16} className="text-purple-600" />
                              <span className="text-xs font-black text-purple-900 uppercase tracking-widest">
                                Accomplishments
                              </span>
                            </div>
                            <span className="text-xs font-black text-purple-600">
                              {dailyScore.accomplishmentsScore}/
                              {dailyScore.details.accomplishments.maxPoints} pts
                            </span>
                          </div>
                          <div className="space-y-2.5 pl-6 border-l-2 border-purple-50">
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span className="flex items-center gap-2">
                                • Completed items:
                              </span>
                              <span className="text-gray-900">
                                {
                                  dailyScore.details.accomplishments
                                    .completedItems
                                }
                                /{dailyScore.details.accomplishments.totalItems}{" "}
                                items
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span className="flex items-center gap-2">
                                • Completion rate:
                              </span>
                              <span className="text-gray-900">
                                {dailyScore.details.accomplishments.completionPercentage.toFixed(
                                  0
                                )}
                                %
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-black text-purple-900 pt-1 border-t border-gray-50">
                              <span>Total earned:</span>
                              <span>
                                {dailyScore.accomplishmentsScore} pts (max{" "}
                                {dailyScore.details.accomplishments.maxPoints})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Tasks & Issues Detail */}
                        <div className="bg-white rounded-[14px] border border-purple-50 p-6 space-y-4">
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
                              {dailyScore.tasksIssuesScore}/
                              {dailyScore.details.tasksIssues.maxPoints} pts
                            </span>
                          </div>
                          <div className="bg-slate-50/50 rounded-[12px] border border-slate-100 p-4 space-y-3">
                            <p className="text-[11px] font-black text-[#1e40af] uppercase tracking-widest mb-2">
                              Score Calculation:
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                                <span className="flex items-center gap-2">
                                  <CheckCircle2
                                    size={12}
                                    className="text-green-500"
                                  />{" "}
                                  Closed On Time (
                                  {
                                    dailyScore.details.tasksIssues
                                      .closedOnTimeCount
                                  }{" "}
                                  × 5 pts)
                                </span>
                                <span className="text-green-600">
                                  +
                                  {dailyScore.details.tasksIssues
                                    .closedOnTimeCount * 5}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                                <span className="flex items-center gap-2">
                                  <Clock
                                    size={12}
                                    className="text-orange-500"
                                  />{" "}
                                  Closed Late (
                                  {
                                    dailyScore.details.tasksIssues
                                      .closedLateCount
                                  }{" "}
                                  × 2 pts)
                                </span>
                                <span className="text-orange-600">
                                  +
                                  {dailyScore.details.tasksIssues
                                    .closedLateCount * 2}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                                <span className="flex items-center gap-2">
                                  <TrendingUp
                                    size={12}
                                    className="text-blue-500"
                                  />{" "}
                                  New Issues (
                                  {
                                    dailyScore.details.tasksIssues
                                      .newIssuesCount
                                  }{" "}
                                  × 2 pts, max 10)
                                </span>
                                <span className="text-blue-600">
                                  +
                                  {Math.min(
                                    dailyScore.details.tasksIssues
                                      .newIssuesCount * 2,
                                    10
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-black text-gray-900 pt-1 border-t border-gray-100">
                                <span>Subtotal (Positive)</span>
                                <span>
                                  +
                                  {
                                    dailyScore.details.tasksIssues
                                      .positivePoints
                                  }
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-bold text-red-500">
                                <span className="flex items-center gap-2">
                                  <AlertCircle
                                    size={12}
                                    className="text-red-500"
                                  />{" "}
                                  Overdue Penalty (
                                  {dailyScore.details.tasksIssues.overdueCount}{" "}
                                  × 5 pts, max -15)
                                </span>
                                <span>
                                  {dailyScore.details.tasksIssues.penaltyPoints}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-black text-gray-900 pt-1 border-t border-gray-200">
                                <span className="text-sm">Final Score</span>
                                <span className="text-[#ea580c]">
                                  {dailyScore.tasksIssuesScore}/
                                  {dailyScore.details.tasksIssues.maxPoints} pts
                                </span>
                              </div>
                            </div>
                            <p className="text-[9px] text-gray-400 font-medium italic mt-2 leading-relaxed">
                              Note: Only tasks/issues closed on the report day
                              or new issues reported on that day are counted.
                            </p>
                          </div>
                        </div>

                        {/* 4. Planning Detail */}
                        <div className="bg-white rounded-[14px] border border-purple-50 p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CalendarCheck
                                size={16}
                                className="text-blue-600"
                              />
                              <span className="text-xs font-black text-blue-900 uppercase tracking-widest">
                                Planning for Next Day
                              </span>
                            </div>
                            <span className="text-xs font-black text-blue-600">
                              {dailyScore.planningScore}/
                              {dailyScore.details.planning.maxPoints} pts
                            </span>
                          </div>
                          <div className="space-y-2.5 pl-6 border-l-2 border-blue-50">
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span className="flex items-center gap-2">
                                • Regular items:
                              </span>
                              <span className="text-gray-900">
                                {dailyScore.details.planning.regularItems} × 2
                                pts ={" "}
                                {dailyScore.details.planning.regularItems * 2}{" "}
                                pts
                              </span>
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
                              <span className="text-gray-900">
                                {dailyScore.details.planning.starredItems} × 4
                                pts ={" "}
                                {dailyScore.details.planning.starredItems * 4}{" "}
                                pts
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-black text-blue-900 pt-1 border-t border-gray-50">
                              <span>Total earned:</span>
                              <span>
                                {dailyScore.planningScore}/
                                {dailyScore.details.planning.maxPoints} pts
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 5. Submission Timing Detail */}
                        <div className="bg-white rounded-[14px] border border-purple-50 p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-orange-600" />
                              <span className="text-xs font-black text-orange-900 uppercase tracking-widest">
                                Submission Timing
                              </span>
                            </div>
                            <span className="text-xs font-black text-orange-600">
                              {dailyScore.timingScore}/
                              {dailyScore.details.timing.maxPoints} pts
                            </span>
                          </div>
                          <div className="space-y-2.5 pl-6 border-l-2 border-orange-50">
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span className="flex items-center gap-2">
                                • Submission Time:
                              </span>
                              <span className="text-gray-900 font-bold">
                                {dailyScore.details.timing.submissionTime}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span className="flex items-center gap-2">
                                • Points Awarded:
                              </span>
                              <span className="text-orange-600 font-bold">
                                {dailyScore.timingScore} pts
                              </span>
                            </div>
                            <p className="text-[9px] text-gray-400 font-medium italic pt-2 border-t border-gray-100">
                              Note: Submission timing score is calculated based
                              on when the report is actually submitted. The live
                              preview shows 0 points as no submission time has
                              been recorded yet.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-purple-50/50 px-4 py-1.5 rounded-full">
                        <Zap
                          size={12}
                          className="text-orange-700 fill-orange-700"
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
                  "bg-[#eff6ff] border border-blue-100 rounded-[14px] overflow-hidden transition-all duration-300 shadow-sm",
                  isScoreInfoExpanded ? "max-h-[3000px]" : "max-h-[80px]"
                )}
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-100/50 transition-all border-b border-transparent"
                  onClick={() => setIsScoreInfoExpanded(!isScoreInfoExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-full shadow-sm">
                      <HelpCircle size={18} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-[#1e40af] tracking-tight">
                      How is the Automated Daily Score Calculated?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isScoreInfoExpanded && (
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                        Click to Expand
                      </span>
                    )}
                    <ChevronRight
                      size={18}
                      className={cn(
                        "text-blue-400 transition-transform duration-300",
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
                        <div className="bg-[#eff6ff] h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 border border-blue-100">
                          <TrendingUp size={20} className="text-[#3b82f6]" />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-bold text-[#1e40af] tracking-tight">
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
                                {report.report_data?.details?.self_rating ??
                                  report.report_data?.self_rating ??
                                  report.self_rating ??
                                  0}
                                /10
                              </Badge>
                              <Badge className="bg-[#dc2626] hover:bg-[#dc2626] text-white px-2.5 py-1.5 rounded-[4px] border-none text-xs font-bold flex items-center justify-center gap-1.5 w-fit shadow-sm">
                                <Target size={12} className="fill-white" />
                                {report.report_data?.total_score || 0}/100
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-[4px] text-[11px] font-medium w-fit mt-1"
                              >
                                {new Date(report.created_at).toLocaleTimeString(
                                  "en-US",
                                  { hour: "numeric", minute: "2-digit" }
                                )}
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
                                  const formattedDate =
                                    date.toLocaleDateString("en-CA");

                                  setStartDate(formattedDate);
                                  setSelectedDate(
                                    date.getDate().toString().padStart(2, "0")
                                  );
                                  setSelectedMonth(
                                    date.toLocaleString("default", {
                                      month: "long",
                                    })
                                  );
                                  setSelectedYear(
                                    date.getFullYear().toString()
                                  );
                                  setCurrentReportId(report.id);

                                  if (
                                    report.report_data?.accomplishments?.items
                                  ) {
                                    setAccomplishments(
                                      report.report_data.accomplishments.items.map(
                                        (ach: any, idx: number) => ({
                                          id: `fetched-ach-${idx}`,
                                          text: ach.title || "",
                                          completed: true,
                                          starred: false,
                                        })
                                      )
                                    );
                                  } else {
                                    setAccomplishments([]);
                                  }

                                  if (report.report_data?.tomorrow_plan) {
                                    setPlanningItems(
                                      report.report_data.tomorrow_plan.map(
                                        (p: any, idx: number) => ({
                                          id: `fetched-plan-${idx}`,
                                          text: p.title || "",
                                          starred: false,
                                        })
                                      )
                                    );
                                  } else {
                                    setPlanningItems([]);
                                  }

                                  if (report.report_data?.past_kpis) {
                                    const entries: { [key: number]: string } =
                                      {};
                                    report.report_data.past_kpis.forEach(
                                      (kpiEntry: any) => {
                                        entries[kpiEntry.kpi_id] =
                                          kpiEntry.actual_value.toString();
                                      }
                                    );
                                    setKpiEntries(entries);
                                  } else {
                                    setKpiEntries({});
                                  }

                                  if (
                                    report.report_data?.tasks_issues &&
                                    report.report_data.tasks_issues.length > 0
                                  ) {
                                    const selectedTasks: {
                                      [key: string]: boolean;
                                    } = {};
                                    report.report_data.tasks_issues.forEach(
                                      (task: any) => {
                                        const matchingItem =
                                          mergedTasksIssues.find(
                                            (item) => item.title === task.name
                                          );
                                        if (matchingItem) {
                                          selectedTasks[matchingItem.id] = true;
                                        }
                                      }
                                    );
                                    setSelectedTasksIssues(selectedTasks);
                                  } else {
                                    setSelectedTasksIssues({});
                                  }

                                  if (report.is_absent !== undefined)
                                    setIsAbsent(report.is_absent);
                                  if (report.description)
                                    setAbsenceReason(report.description);
                                  if (report.self_rating !== undefined)
                                    setSelfRating([report.self_rating]);

                                  setActiveTab("submit");
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }}
                              >
                                <Edit size={14} className="text-blue-500" />{" "}
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-4 text-red-600 border-gray-200 hover:bg-red-50 text-xs font-medium rounded-[4px] flex items-center justify-center gap-2 shadow-sm min-w-[85px]"
                                onClick={() => {
                                  // console.log("Delete report", report.id);
                                }}
                              >
                                <Trash2 size={14} className="text-red-500" />{" "}
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Score Breakdown container */}
                        {/* Score Breakdown container */}
                        <div className="bg-[#f8fafc] border border-gray-200 rounded-[8px] p-4 mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <BarChart3 size={14} className="text-blue-500" />
                            <span className="text-xs font-bold text-slate-700">
                              Score Breakdown
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* 1. Accomplishments */}
                            <div className="bg-white border border-gray-200 rounded-[6px] py-3 flex flex-col items-center justify-center shadow-sm">
                              <p className="text-[10px] text-gray-500 font-medium mb-1">
                                Accomplishments
                              </p>
                              <p className="text-base font-bold text-[#c026d3]">
                                {/* Naya key try karega, nahi mila toh purana 'tasks_completed', warna 0 */}
                                {report.report_data?.sections
                                  ?.accomplishments ??
                                  report.report_data?.sections
                                    ?.tasks_completed ??
                                  0}
                                /25
                              </p>
                            </div>

                            {/* 2. Tasks & Issues */}
                            <div className="bg-white border border-gray-200 rounded-[6px] py-3 flex flex-col items-center justify-center shadow-sm">
                              <p className="text-[10px] text-gray-500 font-medium mb-1">
                                Tasks & Issues
                              </p>
                              <p className="text-base font-bold text-[#ea580c]">
                                {/* Naya key try karega, nahi mila toh purana 'attendance', warna 0 */}
                                {report.report_data?.sections?.tasks_issues ??
                                  report.report_data?.sections?.attendance ??
                                  0}
                                /25
                              </p>
                            </div>

                            {/* 3. Planning */}
                            <div className="bg-white border border-gray-200 rounded-[6px] py-3 flex flex-col items-center justify-center shadow-sm">
                              <p className="text-[10px] text-gray-500 font-medium mb-1">
                                Planning
                              </p>
                              <p className="text-base font-bold text-[#0d9488]">
                                {/* Naya key try karega, nahi mila toh purana 'collaboration', warna 0 */}
                                {report.report_data?.sections?.planning ??
                                  report.report_data?.sections?.collaboration ??
                                  0}
                                /25
                              </p>
                            </div>

                            {/* 4. Timing (Yahan pehle 0/25 hardcoded tha) */}
                            <div className="bg-white border border-gray-200 rounded-[6px] py-3 flex flex-col items-center justify-center shadow-sm">
                              <p className="text-[10px] text-gray-500 font-medium mb-1">
                                Timing
                              </p>
                              <p className="text-base font-bold text-[#d97706]">
                                {report.report_data?.sections?.timing ?? 0}/25
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* KPIs Section */}
                        {report.report_data?.past_kpis &&
                          report.report_data.past_kpis.length > 0 && (
                            <div className="bg-[#fffbeb] border border-amber-200 rounded-[8px] p-4 mb-6">
                              <div className="flex items-center gap-2 mb-3">
                                <TrendingUp
                                  size={14}
                                  className="text-amber-500"
                                />
                                <span className="text-xs font-bold text-slate-700">
                                  Daily KPIs
                                </span>
                              </div>
                              <div className="space-y-3">
                                {report.report_data.past_kpis.map(
                                  (kpi: any, idx: number) => {
                                    const achievement =
                                      parseFloat(kpi.target_value) > 0
                                        ? (parseFloat(kpi.actual_value) /
                                            parseFloat(kpi.target_value)) *
                                          100
                                        : 0;
                                    const displayAchievement = Math.min(
                                      achievement,
                                      100
                                    );
                                    return (
                                      <div
                                        key={idx}
                                        className="bg-white border border-amber-100 rounded-[6px] p-3 shadow-sm"
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-sm font-semibold text-gray-800">
                                            {kpi.notes}
                                          </span>
                                          <Badge className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 border-none rounded-[4px]">
                                            {displayAchievement.toFixed(0)}%
                                          </Badge>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                          <div
                                            className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all"
                                            style={{
                                              width: `${displayAchievement}%`,
                                            }}
                                          />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {kpi.actual_value} /{" "}
                                          {kpi.target_value}
                                        </p>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}

                        {/* Tasks & Issues Section */}
                        {report.report_data?.tasks_issues &&
                          report.report_data.tasks_issues.length > 0 && (
                            <div className="bg-[#fef2f2] border border-red-200 rounded-[8px] p-4 mb-6">
                              <div className="flex items-center gap-2 mb-3">
                                <CheckSquare
                                  size={14}
                                  className="text-red-600"
                                />
                                <span className="text-xs font-bold text-slate-700">
                                  Completed Tasks & Issues
                                </span>
                              </div>
                              <div className="space-y-2">
                                {report.report_data.tasks_issues.map(
                                  (item: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="bg-white border border-red-100 rounded-[6px] p-3 shadow-sm flex items-start gap-2"
                                    >
                                      <span className="text-red-600 font-bold mt-0.5">
                                        ✓
                                      </span>
                                      <span className="text-sm text-gray-700">
                                        {item.name}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Bottom sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Accomplishments */}
                          <div className="border border-green-200 rounded-[8px] overflow-hidden bg-[#f0fdf4]">
                            <div className="px-4 py-3 border-b border-green-200/50 flex items-center gap-2">
                              <CheckCircle2
                                size={16}
                                className="text-green-600"
                              />
                              <span className="text-sm font-semibold text-[#1a1a1a]">
                                Accomplishments
                              </span>
                            </div>
                            <div className="p-4">
                              {report.report_data?.accomplishments?.items
                                ?.length ? (
                                <ul className="space-y-2">
                                  {report.report_data.accomplishments.items.map(
                                    (ach: any, idx: number) => (
                                      <li
                                        key={idx}
                                        className="bg-white border border-green-100 rounded-[6px] px-3 py-2 text-sm text-gray-700 shadow-sm flex items-start gap-2"
                                      >
                                        <span className="text-gray-400 font-medium">
                                          ✓
                                        </span>
                                        {ach.title}
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <div className="bg-white border border-green-100 rounded-[6px] px-3 py-2 text-sm shadow-sm flex items-start gap-2">
                                  <p className="text-gray-400 italic">
                                    No accomplishments.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Tomorrow's Plan */}
                          <div className="border border-purple-200 rounded-[8px] overflow-hidden bg-[#faf5ff]">
                            <div className="px-4 py-3 border-b border-purple-200/50 flex items-center gap-2">
                              <Target size={16} className="text-purple-600" />
                              <span className="text-sm font-semibold text-[#1a1a1a]">
                                Tomorrow's Plan
                              </span>
                            </div>
                            <div className="p-4">
                              {report.report_data?.tomorrow_plan?.length ? (
                                <ul className="space-y-2">
                                  {report.report_data.tomorrow_plan.map(
                                    (task: any, idx: number) => (
                                      <li
                                        key={idx}
                                        className="bg-white border border-purple-100 rounded-[6px] px-3 py-2 text-sm text-gray-700 shadow-sm flex items-start gap-2"
                                      >
                                        <span className="text-gray-400 font-bold mt-0.5">
                                          •
                                        </span>
                                        {task.title}
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <div className="bg-white border border-purple-100 rounded-[6px] px-3 py-2 text-sm shadow-sm flex items-start gap-2">
                                  <p className="text-gray-400 italic">
                                    No plan for tomorrow.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* API Response Attachments Section */}
                        {report.attachments &&
                          report.attachments.length > 0 && (
                            <div className="space-y-3 mt-6 pt-6 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <Upload size={16} className="text-purple-600" />
                                <span className="text-sm font-bold text-[#1a1a1a]">
                                  Linked Files ({report.attachments.length})
                                </span>
                              </div>
                              <div className="space-y-2">
                                {report.attachments.map(
                                  (attachment: AttachmentFile, idx: number) => {
                                    const isImage = isImageFile(
                                      attachment.document_file_name,
                                      attachment.document_content_type
                                    );
                                    return (
                                      <div
                                        key={attachment.id || idx}
                                        className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-[10px] border border-purple-100 hover:shadow-md transition-all group cursor-pointer"
                                      >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                          {isImage ? (
                                            <ImageIcon
                                              size={20}
                                              className="text-purple-600 shrink-0"
                                            />
                                          ) : (
                                            <FileText
                                              size={20}
                                              className="text-blue-600 shrink-0"
                                            />
                                          )}
                                          <div className="flex flex-col gap-1 min-w-0 flex-1">
                                            <a
                                              href={attachment.document_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline line-clamp-2 group-hover:text-purple-700 transition-colors"
                                            >
                                              {attachment.document_file_name}
                                            </a>
                                            <span className="text-[11px] text-gray-600 font-medium">
                                              {attachment.relation} •{" "}
                                              {(
                                                attachment.document_file_size /
                                                1024
                                              ).toFixed(2)}{" "}
                                              KB •{" "}
                                              {new Date(
                                                attachment.document_updated_at
                                              ).toLocaleDateString("en-US", {
                                                month: "numeric",
                                                day: "numeric",
                                                year: "numeric",
                                              })}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 ml-3">
                                          <Badge className="bg-purple-100 text-purple-700 border-none px-2.5 py-0.5 text-[10px] font-bold rounded-[4px] whitespace-nowrap">
                                            {attachment.active
                                              ? "Active"
                                              : "Inactive"}
                                          </Badge>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
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

      <Dialog
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        TransitionComponent={Transition}
        maxWidth={false}
      >
        <DialogContent
          className="w-1/2 fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto"
          style={{
            margin: 0,
            maxHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
          sx={{
            padding: "0 !important",
            "& .MuiDialogContent-root": {
              padding: "0 !important",
              overflow: "auto",
            },
          }}
        >
          <div className="sticky top-0 bg-white z-10">
            <h3 className="text-[14px] font-medium text-center mt-8">
              Add Tasks
            </h3>
            <X
              className="absolute top-[26px] right-8 cursor-pointer w-4 h-4"
              onClick={() => setOpenTaskModal(false)}
            />
            <hr className="border border-[#E95420] mt-4" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <ProjectTaskCreateModal
              isEdit={false}
              onCloseModal={() => setOpenTaskModal(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AddIssueModal
        openDialog={openIssueModal}
        handleCloseDialog={() => setOpenIssueModal(false)}
      />

      {/* Closure Remarks Modal */}
      <Dialog
        open={showClosureModal}
        onClose={() => {
          setShowClosureModal(false);
          setClosureRemarks("");
          setClosureAttachments([]);
          setClosureItem(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "rounded-[16px]",
          sx: {
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            maxHeight: "90vh",
          },
        }}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#1a1a1a]">
              Add Closure Remarks
            </h2>
            <button
              onClick={() => {
                setShowClosureModal(false);
                setClosureRemarks("");
                setClosureAttachments([]);
                setClosureItem(null);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {closureItem && (
            <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-3">
              <p className="text-xs text-gray-600 font-medium mb-1">Closing:</p>
              <p className="text-sm font-bold text-[#1a1a1a]">
                {closureItem.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 capitalize">
                {closureItem.type} • {closureItem.status.replace(/_/g, " ")}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1a1a1a]">
              Closure Remarks (Optional)
            </label>
            <textarea
              value={closureRemarks}
              onChange={(e) => setClosureRemarks(e.target.value)}
              placeholder="How was this resolved? What was done to close it?"
              className="w-full h-[120px] p-3 border border-[#e5e7eb] rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1a1a1a]">
              Attach Files (Optional)
            </label>
            <div className="flex items-center justify-between bg-gray-50 border border-[#e5e7eb] rounded-[10px] p-4">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-green-600">
                  {closureAttachments.length}/5
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  Limits: Images 2MB, Others 5MB
                </p>
              </div>
              <input
                type="file"
                ref={closureFileInputRef}
                onChange={handleClosureFileChange}
                multiple
                className="hidden"
              />
              <Button
                disabled={closureAttachments.length >= 5}
                onClick={triggerClosureFileUpload}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 h-9 rounded-[8px] flex items-center gap-2 text-xs shadow-md transition-all border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={14} />
                File Upload
              </Button>
            </div>
            {closureAttachments.length > 0 && (
              <div className="space-y-2 mt-3">
                {closureAttachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-blue-50/80 p-3 rounded-[10px] border border-blue-100 animate-in fade-in duration-300"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText size={16} className="text-blue-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full border-none shrink-0"
                      onClick={() =>
                        setClosureAttachments(
                          closureAttachments.filter((f) => f.id !== file.id)
                        )
                      }
                    >
                      <X size={14} className="text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              className="flex-1 h-11 border-gray-300 text-gray-700 font-bold text-sm bg-white hover:bg-gray-50 rounded-[8px]"
              onClick={() => {
                setShowClosureModal(false);
                setClosureRemarks("");
                setClosureAttachments([]);
                setClosureItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-[8px] flex items-center justify-center gap-2 shadow-md transition-all border-none disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleMarkItemClosed}
              disabled={isClosureSubmitting}
            >
              {isClosureSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Closing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Mark Closed
                </>
              )}
            </Button>
          </div>
        </div>
      </Dialog>

      <Menu
        anchorEl={taskIssueMenuAnchor}
        open={Boolean(taskIssueMenuAnchor)}
        onClose={() => setTaskIssueMenuAnchor(null)}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
            minWidth: "220px",
            overflow: "visible",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: -8,
              right: 20,
              width: 12,
              height: 12,
              backgroundColor: "#ffffff",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              boxShadow: "-4px -4px 8px rgba(0, 0, 0, 0.08)",
            },
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setOpenTaskModal(true);
            setTaskIssueMenuAnchor(null);
          }}
          sx={{
            py: 1.5,
            px: 2,
            margin: "8px 8px 4px 8px",
            borderRadius: "10px",
            backgroundColor: "transparent",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#f0f4ff",
              transform: "translateX(4px)",
            },
            "&:active": {
              backgroundColor: "#e0e8ff",
            },
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckSquare size={18} className="text-blue-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-gray-900 text-sm">Add Task</span>
              <span className="text-xs text-gray-500 font-medium">
                Create a new task
              </span>
            </div>
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenIssueModal(true);
            setTaskIssueMenuAnchor(null);
          }}
          sx={{
            py: 1.5,
            px: 2,
            margin: "4px 8px 8px 8px",
            borderRadius: "10px",
            backgroundColor: "transparent",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#fef2f2",
              transform: "translateX(4px)",
            },
            "&:active": {
              backgroundColor: "#fee2e2",
            },
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle size={18} className="text-red-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-gray-900 text-sm">Add Issue</span>
              <span className="text-xs text-gray-500 font-medium">
                Report a problem
              </span>
            </div>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default BusinessCompassDailyReport;
