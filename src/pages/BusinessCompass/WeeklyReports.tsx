import React from "react";
import {
  Calendar,
  Info,
  TrendingUp,
  Trophy,
  Plus,
  Upload,
  CheckSquare,
  AlertTriangle,
  X,
  Star,
  Target,
  MessageSquare,
  Activity,
  Send,
  Zap,
  Smile,
  Users,
  User,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Edit,
} from "lucide-react";
import { endOfWeek, format, getISOWeek, startOfWeek, subDays } from "date-fns";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AddTaskOrIssueDialog } from "@/components/BusinessCompass/AddTaskOrIssueDialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import { ENDPOINTS } from "@/config/apiConfig";
import { getUser } from "@/utils/auth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// --- Custom Auto-Sizing Textarea Component ---
const AutoSizingTextarea = ({
  value,
  onChange,
  placeholder,
  className,
}: any) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjust = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const scrollH = el.scrollHeight;
    const currentH = el.offsetHeight;
    if (scrollH > currentH) {
      el.style.height = `${scrollH}px`;
    }
  }, []);

  React.useEffect(() => {
    adjust();
  }, [value, adjust]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        adjust();
      }}
      onInput={adjust}
      placeholder={placeholder}
      className={cn("overflow-hidden outline-none w-full", className)}
      rows={1}
      style={{ minHeight: "40px", resize: "vertical" }}
    />
  );
};

const accentEmphasis = "#DA7756";
const cardChrome =
  "overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-white shadow-sm";
const sectionHeader =
  "border-b border-neutral-200/40 bg-white/60 px-4 py-4 sm:px-5";
const btnPrimary =
  "bg-[#DA7756] font-semibold text-white shadow-sm transition-colors hover:bg-[#c9673f]";
const btnOutline =
  "border border-[#DA7756]/25 bg-white text-[#DA7756] shadow-sm transition-colors hover:bg-[#fef6f4] hover:border-[#DA7756]/45";
const badgePoints =
  "border-0 bg-[#DA7756] px-3 py-1 text-xs text-white hover:bg-[#DA7756]";

type RemarkChipId =
  | "breakthrough"
  | "breakdown"
  | "remark"
  | "clientFeedback"
  | "employeeFeedback";

const REMARK_CHIP_META: Record<
  RemarkChipId,
  {
    label: string;
    border: string;
    bg: string;
    chipActive: string;
    chipInactive: string;
  }
> = {
  breakthrough: {
    label: "Breakthrough",
    border: "border-[#DA7756]",
    bg: "bg-[#fef6f4]",
    chipInactive:
      "border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
    chipActive:
      "border-[#DA7756] bg-[#DA7756] text-white shadow-sm hover:bg-[#DA7756]/90",
  },
  breakdown: {
    label: "Breakdown",
    border: "border-[#DA7756]",
    bg: "bg-[#fef6f4]",
    chipInactive:
      "border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
    chipActive:
      "border-[#DA7756] bg-[#DA7756] text-white shadow-sm hover:bg-[#c9673f]",
  },
  remark: {
    label: "Remark",
    border: "border-[#DA7756]",
    bg: "bg-[#fef6f4]",
    chipInactive:
      "border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
    chipActive:
      "border-[#DA7756] bg-[#DA7756] text-white shadow-sm hover:bg-[#DA7756]/90",
  },
  clientFeedback: {
    label: "Client Feedback",
    border: "border-[#DA7756]/70",
    bg: "bg-[#fef6f4]",
    chipInactive:
      "border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
    chipActive:
      "border-[#DA7756] bg-[#DA7756] text-white shadow-sm hover:bg-[#DA7756]/90",
  },
  employeeFeedback: {
    label: "Employee Feedback",
    border: "border-[#DA7756]/60",
    bg: "bg-[#fef6f4]",
    chipInactive:
      "border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
    chipActive:
      "border-[#DA7756] bg-[#DA7756] text-white shadow-sm hover:bg-[#c9673f]",
  },
};

const normalizeToString = (w: any): string => {
  if (typeof w === "string") return w;
  if (w && typeof w === "object") {
    if (typeof w.title === "string") return w.title;
    return JSON.stringify(w);
  }
  return String(w ?? "");
};

const WeeklyReports = () => {
  const [activeTab, setActiveTab] = React.useState("submit");
  const [addTaskOpen, setAddTaskOpen] = React.useState(false);
  const achievementFileInputRef = React.useRef<HTMLInputElement>(null);
  const [achievementUploads, setAchievementUploads] = React.useState<
    { name: string; size: number }[]
  >([]);

  const handleAchievementFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const currentCount = selectedFileNames.length;

    if (currentCount + newFiles.length > 5) {
      toast.error(
        `You can only upload a maximum of 5 files. You already have ${currentCount} selected.`
      );
      e.target.value = "";
      return;
    }

    const newNames = newFiles.map((f) => f.name);
    setSelectedFileNames((prev) => [...prev, ...newNames]);
    setUploadedFilesCount((prev) => prev + newFiles.length);
    toast.success(`Added ${newFiles.length} file(s)`);
    e.target.value = "";
  };

  const [wins, setWins] = React.useState<string[]>([]);
  const [checkedWins, setCheckedWins] = React.useState<Record<number, boolean>>(
    {}
  );
  const [starredWins, setStarredWins] = React.useState<Record<number, boolean>>(
    {}
  );

  const [dayPlans, setDayPlans] = React.useState<
    Record<string, { id: string; text: string; starred?: boolean }[]>
  >({});

  const [remarksText, setRemarksText] = React.useState("");
  const [remarksList, setRemarksList] = React.useState<
    { type: RemarkChipId | null; text: string }[]
  >([]);
  const [activeRemarkChip, setActiveRemarkChip] =
    React.useState<RemarkChipId | null>(null);
  const [remarksInteracted, setRemarksInteracted] = React.useState(false);
  const remarksTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(false);
  const [history, setHistory] = React.useState<any[]>([]);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [showDailyWinsDialog, setShowDailyWinsDialog] = React.useState(false);
  const [dailyReports, setDailyReports] = React.useState<any[]>([]);
  const [isLoadingDailyReports, setIsLoadingDailyReports] =
    React.useState(false);
  const [selectedDailyWins, setSelectedDailyWins] = React.useState<string[]>(
    []
  );
  const [uploadedFilesCount, setUploadedFilesCount] = React.useState(0);
  const [selectedFileNames, setSelectedFileNames] = React.useState<string[]>(
    []
  );
  const [selectedWeekOffset, setSelectedWeekOffset] = React.useState(0);
  const currentUser = getUser();

  const refDate = React.useMemo(() => new Date(), []);

  const currentWeekStart = React.useMemo(
    () => startOfWeek(refDate, { weekStartsOn: 1 }),
    [refDate]
  );
  const currentWeekEnd = React.useMemo(
    () => endOfWeek(refDate, { weekStartsOn: 1 }),
    [refDate]
  );

  const weekStart = React.useMemo(
    () => subDays(currentWeekStart, -selectedWeekOffset * 7),
    [currentWeekStart, selectedWeekOffset]
  );
  const weekEnd = React.useMemo(
    () => subDays(currentWeekEnd, -selectedWeekOffset * 7),
    [currentWeekEnd, selectedWeekOffset]
  );

  const monthTitle = format(weekStart, "MMM yyyy");
  const weekRangeLabel = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`;
  const weekNumLabel = String(getISOWeek(weekStart));
  const submitRangeLabel = `${format(weekStart, "d MMM")} - ${format(weekEnd, "d MMM")}`;

  const prevWeekStart = React.useMemo(
    () => subDays(currentWeekStart, 7),
    [currentWeekStart]
  );
  const prevWeekEnd = React.useMemo(
    () => subDays(currentWeekEnd, 7),
    [currentWeekEnd]
  );

  const currentWeekNum = String(getISOWeek(currentWeekStart));
  const currentWeekLabel = `${format(currentWeekStart, "MMM d")} - ${format(currentWeekEnd, "MMM d")}`;
  const lastWeekNum = String(getISOWeek(prevWeekStart));
  const lastWeekLabel = `${format(prevWeekStart, "MMM d")} - ${format(prevWeekEnd, "MMM d")}`;

  const importPrevWeekStart = React.useMemo(
    () => subDays(weekStart, 7),
    [weekStart]
  );
  const importPrevWeekEnd = React.useMemo(() => subDays(weekEnd, 7), [weekEnd]);

  const upcomingDays = React.useMemo(() => {
    const start = new Date(weekEnd);
    start.setDate(start.getDate() + 1);
    const labels: {
      key: string;
      short: string;
      color: string;
      canAdd: boolean;
    }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = format(d, "EEE d MMM");
      const colors = [
        "bg-white/80",
        "bg-[#f6f4ee]",
        "bg-white/80",
        "bg-[#f6f4ee]",
        "bg-white/80",
        "bg-[#f6f4ee]",
        "bg-white/80",
      ];
      const canAdd = i < 5;
      labels.push({
        key,
        short: format(d, "EEE d MMM"),
        color: colors[i] ?? "bg-slate-50",
        canAdd,
      });
    }
    return labels;
  }, [weekEnd]);

  const populateForm = React.useCallback(
    (item: any) => {
      setEditingId(item.id);

      const remarksData = item.report_data?.remarks;
      if (Array.isArray(remarksData)) {
        const transformedRemarks = remarksData.map((remark: any) => {
          if (typeof remark === "object" && remark !== null) {
            const [remarkType, remarkText] = Object.entries(remark)[0] || [
              "remark",
              "",
            ];
            return {
              type: remarkType as RemarkChipId | null,
              text:
                typeof remarkText === "string"
                  ? remarkText
                  : String(remarkText),
            };
          }
          return { type: null, text: String(remark) };
        });
        setRemarksList(transformedRemarks);
        setRemarksText("");
      } else if (remarksData) {
        setRemarksList([
          {
            type: item.report_data.remark_type as RemarkChipId | null,
            text: remarksData,
          },
        ]);
        setRemarksText("");
      } else {
        setRemarksList([]);
        setRemarksText(item.description || item.report_data?.big_win || "");
      }

      if (item.report_data?.remark_type) {
        setActiveRemarkChip(item.report_data.remark_type as RemarkChipId);
      }

      const rawAchievements =
        item.report_data?.achievements ||
        item.report_data?.accomplishments?.items?.map((i: any) => i.title) ||
        item.report_data?.accomplishments?.map((i: any) => i.title) ||
        [];
      const normalizedWins = rawAchievements.map(normalizeToString);
      setWins(normalizedWins);
      const defaultChecked: Record<number, boolean> = {};
      normalizedWins.forEach((_: string, i: number) => {
        defaultChecked[i] = true;
      });
      setCheckedWins(defaultChecked);

      let tasks =
        item.report_data?.tasks ||
        item.report_data?.week_plan?.map((i: any) => i.title) ||
        item.report_data?.tasks_issues?.map((i: any) => i.title) ||
        item.report_data?.tomorrow_plan?.map((i: any) => i.title) ||
        [];

      if (
        Array.isArray(tasks) &&
        tasks.length > 0 &&
        typeof tasks[0] === "object" &&
        !Array.isArray(tasks[0])
      ) {
        const dayKeyedObject = tasks[0];
        const dayMapping: Record<string, string> = {
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat",
          sun: "Sun",
        };

        const newDayPlans: Record<string, { id: string; text: string }[]> = {};
        Object.entries(dayKeyedObject).forEach(([dayKey, dayTasks]) => {
          const dayAbbr = dayMapping[dayKey.toLowerCase()];
          if (dayAbbr && Array.isArray(dayTasks)) {
            const matchingDay = upcomingDays.find((d) =>
              d.short.startsWith(dayAbbr)
            );
            if (matchingDay) {
              newDayPlans[matchingDay.key] = dayTasks.map((t: string) => ({
                id: crypto.randomUUID(),
                text: t,
              }));
            }
          }
        });

        if (Object.keys(newDayPlans).length > 0) {
          setDayPlans(newDayPlans);
        }
      } else if (tasks.length > 0) {
        const firstDay = upcomingDays.find((d) => d.canAdd)?.key;
        if (firstDay) {
          setDayPlans({
            [firstDay]: tasks.map((t: string) => ({
              id: crypto.randomUUID(),
              text: t,
            })),
          });
        }
      }
      toast.message("Report data loaded");
    },
    [upcomingDays]
  );

  const fetchHistory = React.useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const response = await apiClient.get(
        `${ENDPOINTS.USER_JOURNALS}?q[:journal_type]=weekly`
      );
      const items = response.data || [];
      setHistory(items);

      const currentWeekStartStr = format(weekStart, "yyyy-MM-dd");
      const existing = items.find(
        (i: any) => i.start_date === currentWeekStartStr
      );
      if (existing) {
        populateForm(existing);
      }
    } catch (error) {
      console.error("Failed to fetch weekly reports history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [weekStart, populateForm]);

  React.useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleAddWin = () => {
    const newIndex = wins.length;
    setWins([...wins, ""]);
    setCheckedWins((prev) => ({ ...prev, [newIndex]: false }));
  };

  const handleRemoveWin = (index: number) => {
    const newWins = wins.filter((_, i) => i !== index);
    setWins(newWins);
    const newChecked: Record<number, boolean> = {};
    newWins.forEach((_, i) => {
      const oldIndex = i < index ? i : i + 1;
      newChecked[i] = checkedWins[oldIndex] ?? true;
    });
    setCheckedWins(newChecked);
  };

  const handleWinChange = (index: number, value: string) => {
    const newWins = [...wins];
    newWins[index] = value;
    setWins(newWins);
  };

  // --- MODIFIED: Remove carried forward achievements from the current list ---
  const handleCarryForward = () => {
    const indicesToCarry: number[] = [];
    const uncheckedWins = wins.filter((win, i) => {
      if (!checkedWins[i] && win.trim() !== "") {
        indicesToCarry.push(i);
        return true;
      }
      return false;
    });

    if (uncheckedWins.length === 0) {
      toast.info("No uncompleted achievements to carry forward");
      return;
    }
    if (history.length === 0) {
      toast.error("No previous reports found to carry forward");
      return;
    }

    const latest = history.find((item) => item.id !== editingId);
    if (latest) {
      const firstDay = upcomingDays.find((d) => d.canAdd)?.key;
      if (firstDay) {
        setDayPlans((prev) => ({
          ...prev,
          [firstDay]: [
            ...(prev[firstDay] || []),
            ...uncheckedWins.map((win) => ({
              id: crypto.randomUUID(),
              text: win,
            })),
          ],
        }));

        // Remove the carried forward items from 'wins'
        const remainingWins: string[] = [];
        const newCheckedWins: Record<number, boolean> = {};
        const newStarredWins: Record<number, boolean> = {};

        let newIdx = 0;
        wins.forEach((win, i) => {
          if (!indicesToCarry.includes(i)) {
            remainingWins.push(win);
            newCheckedWins[newIdx] = checkedWins[i] ?? false;
            newStarredWins[newIdx] = starredWins[i] ?? false;
            newIdx++;
          }
        });

        setWins(remainingWins);
        setCheckedWins(newCheckedWins);
        setStarredWins(newStarredWins);

        toast.success(
          `Carried forward ${uncheckedWins.length} uncompleted achievement(s) and removed from list`
        );
      }
    }
  };

  const handleImportDailyWins = async () => {
    setIsLoadingDailyReports(true);
    setShowDailyWinsDialog(true);
    try {
      const response = await apiClient.get(
        `${ENDPOINTS.USER_JOURNALS}?q[:journal_type]=daily`
      );
      const allDaily = response.data || [];

      const prevStartStr = format(importPrevWeekStart, "yyyy-MM-dd");
      const prevEndStr = format(importPrevWeekEnd, "yyyy-MM-dd");

      const filtered = allDaily.filter((report: any) => {
        const raw = report.start_date || report.created_at;
        if (!raw) return false;
        const reportDateStr =
          typeof raw === "string"
            ? raw.split("T")[0]
            : format(new Date(raw), "yyyy-MM-dd");
        return reportDateStr >= prevStartStr && reportDateStr <= prevEndStr;
      });

      setDailyReports(filtered);
    } catch (error) {
      console.error("Failed to fetch daily reports:", error);
      toast.error("Failed to load daily reports");
    } finally {
      setIsLoadingDailyReports(false);
    }
  };

  const confirmImportDailyWins = () => {
    if (selectedDailyWins.length === 0) {
      toast.info("No wins selected");
      return;
    }
    setWins((prev) => [...prev, ...selectedDailyWins]);
    toast.success(`Imported ${selectedDailyWins.length} daily wins`);
    setShowDailyWinsDialog(false);
    setSelectedDailyWins([]);
  };

  const handleAddPlan = (day: string) => {
    setDayPlans((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), { id: crypto.randomUUID(), text: "" }],
    }));
  };

  const handleRemovePlan = (day: string, index: number) => {
    setDayPlans((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const handlePlanChange = (day: string, index: number, value: string) => {
    const newPlans = [...(dayPlans[day] || [])];
    newPlans[index] = { ...newPlans[index], text: value };
    setDayPlans((prev) => ({
      ...prev,
      [day]: newPlans,
    }));
  };

  const handleTogglePlanStar = (day: string, index: number) => {
    const newPlans = [...(dayPlans[day] || [])];
    newPlans[index] = { ...newPlans[index], starred: !newPlans[index].starred };
    setDayPlans((prev) => ({
      ...prev,
      [day]: newPlans,
    }));
  };

  const handleMovePlan = (
    day: string,
    index: number,
    direction: "up" | "down"
  ) => {
    const plans = [...(dayPlans[day] || [])];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= plans.length) return;

    const currentEl = document.getElementById(`plan-${plans[index].id}`);
    const swapEl = document.getElementById(`plan-${plans[swapIndex].id}`);

    if (currentEl && swapEl) {
      const currentRect = currentEl.getBoundingClientRect();
      const swapRect = swapEl.getBoundingClientRect();

      const currentDistance = swapRect.top - currentRect.top;
      const swapDistance = currentRect.top - swapRect.top;

      currentEl.style.transition =
        "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      swapEl.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      currentEl.style.zIndex = "10";
      swapEl.style.zIndex = "1";

      currentEl.style.transform = `translateY(${currentDistance}px)`;
      swapEl.style.transform = `translateY(${swapDistance}px)`;

      setTimeout(() => {
        currentEl.style.transition = "none";
        swapEl.style.transition = "none";
        currentEl.style.transform = "none";
        swapEl.style.transform = "none";
        currentEl.style.zIndex = "auto";
        swapEl.style.zIndex = "auto";

        setDayPlans((prev) => {
          const newPlans = [...(prev[day] || [])];
          [newPlans[index], newPlans[swapIndex]] = [
            newPlans[swapIndex],
            newPlans[index],
          ];
          return { ...prev, [day]: newPlans };
        });
      }, 300);
    } else {
      setDayPlans((prev) => {
        const newPlans = [...(prev[day] || [])];
        [newPlans[index], newPlans[swapIndex]] = [
          newPlans[swapIndex],
          newPlans[index],
        ];
        return { ...prev, [day]: newPlans };
      });
    }
  };

  const handleRemarkChipClick = (id: RemarkChipId) => {
    setActiveRemarkChip((prev) => (prev === id ? null : id));
    setRemarksInteracted(true);
  };

  const handleRemarksAreaActivate = () => {
    setRemarksInteracted(true);
  };

  const handleAddRemark = () => {
    if (!remarksText.trim()) {
      toast.error("Please enter a remark");
      return;
    }
    setRemarksList((prev) => [
      ...prev,
      { type: activeRemarkChip, text: remarksText.trim() },
    ]);
    setRemarksText("");
  };

  const handleRemoveRemark = (index: number) => {
    setRemarksList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFocusRemarks = () => {
    setRemarksInteracted(true);
    window.requestAnimationFrame(() => {
      remarksTextareaRef.current?.focus();
    });
  };

  const remarkVisual = activeRemarkChip
    ? REMARK_CHIP_META[activeRemarkChip]
    : remarksInteracted
      ? {
          border: "border-[#DA7756]",
          bg: "bg-[#fef6f4]/90",
        }
      : {
          border: "border-[#DA7756]/25",
          bg: "bg-white",
        };

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const finalRemarksList = [...remarksList];
      if (remarksText.trim()) {
        finalRemarksList.push({
          type: activeRemarkChip,
          text: remarksText.trim(),
        });
      }

      const combinedDescription = finalRemarksList
        .map((r) => r.text)
        .join("\n");

      const formattedRemarks = finalRemarksList.map((r) => {
        if (r.type) {
          return { [r.type]: r.text };
        } else {
          return { remark: r.text };
        }
      });

      const payload = {
        user_journal: {
          user_id: currentUser.id,
          journal_type: "weekly",
          start_date: format(weekStart, "yyyy-MM-dd"),
          end_date: format(weekEnd, "yyyy-MM-dd"),
          week_number: getISOWeek(weekStart),
          year: weekStart.getFullYear(),
          status: "submitted",
          description: combinedDescription,
          self_rating: 0,
          is_absent: false,
          report_data: {
            kpi: "weekly value",
            achievements: wins.filter((w) => w.trim() !== ""),
            tasks: [
              {
                ...Object.fromEntries(
                  Object.entries(dayPlans).map(([dayKey, tasks]) => {
                    const dayMatch = dayKey.match(/^(\w{3})/);
                    const dayAbbr = dayMatch
                      ? dayMatch[1].toLowerCase()
                      : dayKey.slice(0, 3).toLowerCase();
                    const filteredTasks = tasks
                      .filter((t) => t.text.trim() !== "")
                      .map((t) => t.text);
                    return [dayAbbr, filteredTasks];
                  })
                ),
              },
            ],
            past_kpis: [],
            total_score: 0,
            remarks: formattedRemarks,
            remark_type: activeRemarkChip,
            sections: {
              daily_scores: [0, 0, 0, 0, 0],
              bonus: 0,
              self_rating: 0,
              is_absent: false,
            },
            details: {
              self_rating: 0,
              is_absent: false,
            },
          },
        },
      };

      const response = editingId
        ? await apiClient.put(`/user_journals/${editingId}.json`, payload)
        : await apiClient.post(ENDPOINTS.USER_JOURNALS, payload);

      toast.success(
        editingId
          ? "Weekly report updated successfully"
          : "Weekly report submitted successfully"
      );
      fetchHistory();

      setActiveTab("history");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (error: any) {
      console.error("Failed to submit weekly report:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit weekly report"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = React.useCallback(
    (item: any) => {
      populateForm(item);

      if (item.start_date) {
        const itemDate = new Date(item.start_date);
        const currentStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const diffTime = itemDate.getTime() - currentStart.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
        const offsetWeeks = Math.round(diffDays / 7);
        setSelectedWeekOffset(offsetWeeks);
      }

      setActiveTab("submit");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    },
    [populateForm]
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <AddTaskOrIssueDialog open={addTaskOpen} onOpenChange={setAddTaskOpen} />
      <div className="mx-auto max-w-7xl space-y-6 font-poppins text-[#1a1a1a]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Weekly Report
          </h1>
          <p className="mt-1 text-sm text-neutral-500 sm:text-base">
            Track your weekly KPI performance and insights
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex h-auto w-full justify-start rounded-2xl bg-[#DA7756] p-1 sm:w-auto">
            <TabsTrigger
              value="submit"
              className="rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm data-[state=inactive]:text-white/80"
            >
              Submit Review
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm data-[state=inactive]:text-white/80"
            >
              Review History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="mt-6 space-y-6">
            <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 shrink-0 text-[#DA7756]" />
                <span className="text-lg font-semibold text-neutral-900">
                  {monthTitle}
                </span>
              </div>
              <div className="mb-4 rounded-xl bg-[#DA7756] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm">
                Filling Report For Week #{weekNumLabel}, {weekRangeLabel}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWeekOffset(-1);
                    const startStr = format(prevWeekStart, "yyyy-MM-dd");
                    const existing = history.find(
                      (i: any) => i.start_date === startStr
                    );
                    if (existing) populateForm(existing);
                    else {
                      setEditingId(null);
                      setWins([]);
                      setCheckedWins({});
                      setDayPlans({});
                      setRemarksList([]);
                      setRemarksText("");
                    }
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border transition-all",
                    selectedWeekOffset === -1
                      ? "bg-[#DA7756] border-[#DA7756] text-white shadow-sm"
                      : "bg-white/80 border-[#DA7756]/30 text-neutral-700 hover:bg-[#fef6f4] hover:border-[#DA7756]/50"
                  )}
                >
                  W{lastWeekNum} {lastWeekLabel}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedWeekOffset(0);
                    const startStr = format(currentWeekStart, "yyyy-MM-dd");
                    const existing = history.find(
                      (i: any) => i.start_date === startStr
                    );
                    if (existing) populateForm(existing);
                    else {
                      setEditingId(null);
                      setWins([]);
                      setCheckedWins({});
                      setDayPlans({});
                      setRemarksList([]);
                      setRemarksText("");
                    }
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border transition-all",
                    selectedWeekOffset === 0
                      ? "bg-[#DA7756] border-[#DA7756] text-white shadow-sm"
                      : "bg-white/80 border-[#DA7756]/30 text-neutral-700 hover:bg-[#fef6f4] hover:border-[#DA7756]/50"
                  )}
                >
                  W{currentWeekNum} {currentWeekLabel}
                  {selectedWeekOffset === 0 && (
                    <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                      Current
                    </span>
                  )}
                </button>
              </div>
            </Card>

            {/* Past Weeks KPIs */}
            <Card className={cn("overflow-hidden", cardChrome)}>
              <div
                className={cn(
                  "flex items-start justify-between",
                  sectionHeader
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#DA7756]" />
                    <h3 className="font-bold text-neutral-900">
                      Past Weeks KPIs
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Enter actual values and track your key metrics.
                  </p>
                </div>
                <Badge className={badgePoints}>0/20 pts</Badge>
              </div>
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <p className="text-lg text-neutral-400">
                  No KPIs assigned for this period.
                </p>
              </div>
            </Card>

            {/* Achievements */}
            <Card className={cn("overflow-hidden", cardChrome)}>
              <div
                className={cn(
                  "flex items-center justify-between",
                  sectionHeader
                )}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#DA7756]" />
                  <h3 className="font-bold text-neutral-900">
                    Your Achievements
                  </h3>
                </div>
                <Badge className={badgePoints}>0/15 pts</Badge>
              </div>
              <div className="space-y-4 p-6">
                {wins.map((win, index) => (
                  <div
                    key={index}
                    className="group relative flex items-start gap-3 rounded-xl border border-[#DA7756]/15 bg-white p-4 shadow-sm"
                  >
                    <Checkbox
                      className="mt-1 rounded border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      checked={checkedWins[index] ?? false}
                      onCheckedChange={(checked) =>
                        setCheckedWins((prev) => ({
                          ...prev,
                          [index]: !!checked,
                        }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setStarredWins((prev) => ({
                          ...prev,
                          [index]: !prev[index],
                        }))
                      }
                      className="mt-1 shrink-0 focus:outline-none transition-transform duration-150 active:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4 transition-colors duration-200",
                          starredWins[index]
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-neutral-300 hover:text-yellow-300"
                        )}
                      />
                    </button>
                    <Textarea
                      value={win}
                      onChange={(e) => handleWinChange(index, e.target.value)}
                      placeholder="Describe your win…"
                      className="min-h-[40px] flex-1 resize-none border-none bg-transparent p-0 text-sm text-neutral-700 placeholder:text-neutral-400 focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveWin(index)}
                      className="rounded-md p-1 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <div className="flex flex-col gap-3 sm:flex-row w-full">
                  <button
                    type="button"
                    onClick={handleImportDailyWins}
                    className="h-[46px] flex-1 rounded-[10px] border border-dashed border-[#93c5fd] bg-transparent text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4 text-slate-400" />
                    Import Daily Wins (last week&apos;s)
                  </button>
                  <button
                    type="button"
                    onClick={handleAddWin}
                    className="h-[46px] flex-1 rounded-[10px] bg-[#f5ebe8] text-[13px] font-bold text-[#881337] transition-colors hover:bg-[#eaddd7] flex items-center justify-center gap-2 shadow-none border-none"
                  >
                    <Plus className="h-4 w-4" />
                    Add Win
                  </button>
                </div>

                {wins.length > 0 &&
                  wins.some((w, i) => !checkedWins[i] && w.trim() !== "") && (
                    <Button
                      type="button"
                      onClick={handleCarryForward}
                      className={cn(
                        "h-12 w-full rounded-xl bg-[#e65100] hover:bg-[#d84315] text-white font-bold tracking-wide"
                      )}
                    >
                      Carry Forward Uncompleted
                    </Button>
                  )}
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-medium">
                      <Info className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Limits: Images 2MB, Others 5MB</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-neutral-400">
                        {uploadedFilesCount}/5
                      </span>
                      <input
                        ref={achievementFileInputRef}
                        type="file"
                        className="sr-only"
                        id="weekly-achievement-files"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,application/pdf"
                        onChange={handleAchievementFiles}
                      />
                      <Button
                        type="button"
                        onClick={() => achievementFileInputRef.current?.click()}
                        className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6 flex items-center gap-2 text-xs"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        File Upload
                      </Button>
                    </div>
                  </div>

                  {selectedFileNames.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedFileNames.map((name, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-neutral-100 text-[10px] text-neutral-600 px-2 py-0.5 rounded-lg flex items-center gap-1"
                        >
                          <span className="truncate max-w-[150px]">{name}</span>
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => {
                              const next = selectedFileNames.filter(
                                (_, idx) => idx !== i
                              );
                              setSelectedFileNames(next);
                              setUploadedFilesCount(next.length);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Tasks & Issues */}
            <Card className={cn("overflow-hidden", cardChrome)}>
              <div
                className={cn(
                  "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                  sectionHeader
                )}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-[#DA7756]" />
                    <h3 className="font-bold text-neutral-900">
                      Tasks & Issues
                    </h3>
                    <Badge className="border-0 bg-neutral-200 px-2 py-0 text-[10px] font-bold uppercase text-neutral-700">
                      Optional
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="border-0 bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800">
                      Closed: 0
                    </Badge>
                    <Badge className="border-0 bg-sky-100 px-3 py-1 text-[10px] font-bold text-sky-800">
                      Open: 0
                    </Badge>
                    <Badge className="border-0 bg-red-100 px-3 py-1 text-[10px] font-bold text-red-800">
                      Overdue: 0
                    </Badge>
                  </div>
                </div>
                <Button
                  type="button"
                  className={cn("shrink-0 rounded-xl", btnPrimary)}
                  onClick={() => setAddTaskOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 px-6 py-14 text-center">
                <CheckSquare className="h-12 w-12 text-neutral-200" />
                <p className="text-lg text-neutral-400">
                  No open tasks or issues.
                </p>
              </div>
            </Card>

            {/* Deep work */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#DA7756]" />
              <p className="text-sm text-neutral-800">
                <span className="font-bold">Deep Work Blocks:</span> Protect
                your &quot;Prime Time&quot;! Have you blocked 90-min chunks for
                high-level analysis?
              </p>
            </div>

            {/* Plan for coming week */}
            <Card className={cn("overflow-hidden", cardChrome)}>
              <div
                className={cn(
                  "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
                  sectionHeader
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Target className="h-5 w-5 text-[#DA7756]" />
                  <h3 className="font-bold text-neutral-900">
                    Plan for Coming Week
                  </h3>
                  <Badge className="border-0 bg-neutral-200 px-2 py-0 text-[10px] font-bold uppercase text-neutral-700">
                    Optional
                  </Badge>
                  <Info className="h-4 w-4 cursor-help text-neutral-400" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={badgePoints}>0/20 pts</Badge>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn("rounded-lg text-xs font-bold", btnOutline)}
                  >
                    Important & Not Urgent
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4">
                {upcomingDays.map((day) => (
                  <div key={day.key} className="flex flex-col gap-2">
                    <div
                      className={cn(
                        "flex items-center justify-between rounded-xl border border-[#DA7756]/15 p-3",
                        day.color
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-bold",
                          day.canAdd ? "text-[#DA7756]" : "text-neutral-400"
                        )}
                      >
                        {day.short}
                      </span>
                      {day.canAdd ? (
                        <button
                          type="button"
                          onClick={() => handleAddPlan(day.key)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#DA7756]/25 bg-white px-2.5 py-1.5 text-xs font-bold text-[#DA7756] shadow-sm transition-colors hover:bg-[#fef6f4] hover:border-[#DA7756]/45"
                        >
                          <Plus className="h-3 w-3" /> Add
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-400">—</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {dayPlans[day.key]?.map((planObj, index) => (
                        <div
                          key={planObj.id}
                          id={`plan-${planObj.id}`}
                          className="relative ml-2 flex items-start gap-3 rounded-xl border border-[#DA7756]/15 bg-white p-4 shadow-sm transition-all duration-200 hover:border-[#DA7756]/30 hover:shadow-md"
                        >
                          <button
                            type="button"
                            onClick={() => handleTogglePlanStar(day.key, index)}
                            className="mt-1 shrink-0 transition-transform duration-150 active:scale-110 focus:outline-none"
                            title={
                              planObj.starred ? "Unstar" : "Star this priority"
                            }
                          >
                            <Star
                              className={cn(
                                "h-4 w-4 transition-colors duration-200",
                                planObj.starred
                                  ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                                  : "text-neutral-300 hover:text-yellow-300"
                              )}
                            />
                          </button>
                          <AutoSizingTextarea
                            value={planObj.text}
                            onChange={(val: string) =>
                              handlePlanChange(day.key, index, val)
                            }
                            placeholder="What's your strategic priority?"
                            className="flex-1 rounded-md border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-[#DA7756]/50 focus:bg-white focus:ring-1 focus:ring-[#DA7756]/20 transition-all duration-200"
                          />
                          <div className="flex flex-col gap-1 relative z-20">
                            <button
                              type="button"
                              onClick={() => handleRemovePlan(day.key, index)}
                              className="rounded-md p-1 text-[#DA7756]/55 hover:bg-[#fef6f4] hover:text-[#DA7756]"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleMovePlan(day.key, index, "up")
                              }
                              disabled={index === 0}
                              className="rounded-md p-1 text-[#DA7756]/45 hover:bg-[#fef6f4] hover:text-[#DA7756] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleMovePlan(day.key, index, "down")
                              }
                              disabled={
                                index === (dayPlans[day.key]?.length ?? 0) - 1
                              }
                              className="rounded-md p-1 text-[#DA7756]/45 hover:bg-[#fef6f4] hover:text-[#DA7756] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Remarks */}
            <Card
              role="region"
              aria-label="Remarks"
              onMouseDown={handleRemarksAreaActivate}
              className={cn(
                "overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-sm transition-colors duration-200",
                remarkVisual.border,
                remarkVisual.bg
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare
                    className="h-5 w-5 shrink-0"
                    style={{ color: accentEmphasis }}
                  />
                  <h3 className="font-bold text-neutral-900">Remarks</h3>
                </div>
                <Badge
                  className="border-0 px-3 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: accentEmphasis }}
                >
                  0/25 pts
                </Badge>
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(REMARK_CHIP_META) as RemarkChipId[]).map(
                    (id) => {
                      const meta = REMARK_CHIP_META[id];
                      const isActive = activeRemarkChip === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => handleRemarkChipClick(id)}
                          className={cn(
                            "inline-flex h-9 items-center rounded-lg border px-3 text-[11px] font-bold transition-colors",
                            "active:scale-[0.98] active:brightness-95",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/35 focus-visible:ring-offset-2",
                            isActive ? meta.chipActive : meta.chipInactive
                          )}
                        >
                          {id === "breakthrough" && (
                            <Activity
                              className={cn(
                                "mr-1.5 h-3.5 w-3.5 shrink-0",
                                isActive ? "text-white" : "text-neutral-500"
                              )}
                            />
                          )}
                          {id === "breakdown" && (
                            <TrendingUp
                              className={cn(
                                "mr-1.5 h-3.5 w-3.5 shrink-0",
                                isActive ? "text-white" : "text-neutral-500"
                              )}
                            />
                          )}
                          {id === "employeeFeedback" && (
                            <User
                              className={cn(
                                "mr-1.5 h-3.5 w-3.5 shrink-0",
                                isActive ? "text-white" : "text-neutral-500"
                              )}
                            />
                          )}
                          {id === "clientFeedback" && (
                            <Users
                              className={cn(
                                "mr-1.5 h-3.5 w-3.5 shrink-0",
                                isActive ? "text-white" : "text-neutral-500"
                              )}
                            />
                          )}
                          {id === "remark" && (
                            <Smile
                              className={cn(
                                "mr-1.5 h-3.5 w-3.5 shrink-0",
                                isActive ? "text-white" : "text-neutral-500"
                              )}
                            />
                          )}
                          {meta.label}
                        </button>
                      );
                    }
                  )}
                </div>
                <Textarea
                  ref={remarksTextareaRef}
                  value={remarksText}
                  onChange={(e) => setRemarksText(e.target.value)}
                  onFocus={handleRemarksAreaActivate}
                  placeholder={
                    activeRemarkChip
                      ? `Add ${REMARK_CHIP_META[activeRemarkChip].label}...`
                      : "Enter at least one breakthrough, one breakdown, one remark and one client feedback…"
                  }
                  className="min-h-[120px] rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-inner outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
                />
                <Button
                  type="button"
                  onClick={handleAddRemark}
                  className="h-10 w-full rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8] transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add{" "}
                  {activeRemarkChip
                    ? REMARK_CHIP_META[activeRemarkChip].label
                    : "Remark"}
                </Button>

                {remarksList.length > 0 && (
                  <div className="mt-6 space-y-3 border-t border-dashed border-neutral-200 pt-6">
                    {remarksList.map((remark, index) => {
                      const isBreakdown = remark.type === "breakdown";
                      const isBreakthrough = remark.type === "breakthrough";
                      return (
                        <div
                          key={index}
                          className={cn(
                            "relative flex items-start gap-3 rounded-xl border p-4 shadow-sm",
                            isBreakdown
                              ? "bg-red-50 border-red-200 text-red-900"
                              : isBreakthrough
                                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                : "bg-white border-neutral-200 text-neutral-800"
                          )}
                        >
                          {remark.type === "breakdown" ? (
                            <TrendingUp className="h-4 w-4 text-red-500 mt-0.5" />
                          ) : remark.type === "breakthrough" ? (
                            <Activity className="h-4 w-4 text-emerald-500 mt-0.5" />
                          ) : remark.type === "employeeFeedback" ? (
                            <User className="h-4 w-4 text-blue-500 mt-0.5" />
                          ) : remark.type === "clientFeedback" ? (
                            <Users className="h-4 w-4 text-purple-500 mt-0.5" />
                          ) : remark.type === "remark" ? (
                            <Smile className="h-4 w-4 text-orange-500 mt-0.5" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-neutral-500 mt-0.5" />
                          )}
                          <div className="flex-1 space-y-1">
                            {remark.type && (
                              <p className="text-xs font-bold">
                                {REMARK_CHIP_META[remark.type as RemarkChipId]
                                  ?.label || remark.type}
                              </p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">
                              {remark.text}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveRemark(index)}
                            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>

            {/* Automated score */}
            <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#DA7756]" />
                  <h4 className="text-base font-bold text-neutral-900">
                    Automated Weekly Score
                  </h4>
                </div>
                <span className="text-2xl font-black text-[#DA7756]">
                  0/100
                </span>
              </div>
              <p className="mb-4 text-[11px] italic text-neutral-500">
                Based on KPIs, achievements, tasks, planning, and feedback.
              </p>
              <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {[
                  { label: "Weekly KPI", score: "0/20" },
                  { label: "Daily KPI", score: "0/10" },
                  { label: "KPIs", score: "0/20" },
                  { label: "Daily Win", score: "0/15" },
                  { label: "Planning", score: "0/20" },
                  { label: "Remarks", score: "0/25" },
                  { label: "Tasks", score: "0/10" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-md border border-neutral-100 bg-white p-2"
                  >
                    <p className="text-[9px] text-neutral-400">{stat.label}</p>
                    <p className="text-xs font-bold text-neutral-900">
                      {stat.score}
                    </p>
                  </div>
                ))}
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="py-2 text-xs font-bold text-neutral-700 hover:no-underline">
                    Detailed Score Calculation{" "}
                    <span className="ml-2 text-[10px] font-normal text-neutral-400">
                      (Click here to expand)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="mt-1 rounded-md bg-white/80 p-3 text-[11px] text-neutral-600">
                    The score combines completed KPIs, recorded achievements,
                    planning entries, remarks, and task completion.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={cn(
                "h-14 w-full rounded-[14px] text-[18px] font-black text-white shadow-sm border-none flex items-center justify-center gap-2 transition-all duration-200",
                isSubmitting
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:translate-y-0 active:shadow-sm",
                editingId
                  ? "bg-[#2563eb] hover:bg-[#1d4ed8]"
                  : "bg-[#16a34a] hover:bg-[#15803d]"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{editingId ? "Updating..." : "Submitting..."}</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>
                    {editingId
                      ? `Update Weekly Report (${submitRangeLabel})`
                      : `Submit Weekly Report (${submitRangeLabel})`}
                  </span>
                </>
              )}
            </button>

            <div className="flex flex-col gap-3 rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#DA7756] p-2 shadow-sm">
                  <Star className="h-4 w-4 fill-white text-white" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">
                      Bonus Opportunity!
                    </span>
                    <Badge className="border-0 bg-[#DA7756] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#DA7756]">
                      + 05 pts
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-neutral-600">
                    Submit within the week window to earn bonus points.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-neutral-500">
              <button
                type="button"
                className="underline decoration-dotted underline-offset-2 hover:text-[#DA7756]"
              >
                How is the Automated Weekly Score Calculated?
              </button>
            </p>
          </TabsContent>

          <TabsContent value="history" className="mt-6 space-y-6">
            {isLoadingHistory ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-60" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-32 rounded-xl" />
                      <Skeleton className="h-32 rounded-xl" />
                    </div>
                  </Card>
                ))
            ) : history.length > 0 ? (
              history.map((item) => {
                const reportData = item.report_data || {};
                const weekNum = item.start_date
                  ? getISOWeek(new Date(item.start_date))
                  : "??";
                const weekLabel =
                  item.start_date && item.end_date
                    ? `${format(new Date(item.start_date), "MMM d")}-${format(new Date(item.end_date), "d")}`
                    : "Unknown Date";

                const rawAchievements =
                  reportData.achievements ||
                  reportData.accomplishments?.items?.map((i: any) => i.title) ||
                  reportData.accomplishments?.map((i: any) => i.title) ||
                  [];
                const achievements: string[] =
                  rawAchievements.map(normalizeToString);

                const rawTasks =
                  reportData.tasks ||
                  reportData.week_plan?.map((i: any) => i.title) ||
                  reportData.tasks_issues?.map((i: any) => i.title) ||
                  reportData.tomorrow_plan?.map((i: any) => i.title) ||
                  [];

                const tasks: string[] = (() => {
                  if (
                    Array.isArray(rawTasks) &&
                    rawTasks.length > 0 &&
                    typeof rawTasks[0] === "object" &&
                    !Array.isArray(rawTasks[0])
                  ) {
                    return Object.values(rawTasks[0] as Record<string, any>)
                      .flat()
                      .map(normalizeToString)
                      .filter(Boolean);
                  }
                  return rawTasks.map(normalizeToString).filter(Boolean);
                })();

                const normalizeRemarks = (remarks: any): string => {
                  if (!remarks) return "No overall comments";
                  if (typeof remarks === "string") return remarks;
                  if (Array.isArray(remarks)) {
                    return remarks
                      .map((r: any) => {
                        if (typeof r === "string") return r;
                        if (typeof r === "object")
                          return Object.values(r).join(": ");
                        return String(r);
                      })
                      .join(" | ");
                  }
                  return String(remarks);
                };

                const stats = [
                  { label: "Weekly KPIs:", value: "0/20" },
                  { label: "Daily KPIs:", value: "0/10" },
                  {
                    label: "Starred Wins:",
                    value: `0/${achievements.length || 6}`,
                  },
                  { label: "Tasks/Issues:", value: "0/10" },
                  { label: "Planned:", value: `${tasks.length}/20` },
                  {
                    label: "Remarks:",
                    value: reportData.remarks ? "1/14" : "0/14",
                  },
                  { label: "SOPs:", value: "0/20" },
                ];

                const dayColors: Record<string, string> = {
                  Mon: "bg-[#e0e7ff] text-[#4338ca]",
                  Tue: "bg-[#dcfce7] text-[#15803d]",
                  Wed: "bg-[#fef9c3] text-[#a16207]",
                  Thu: "bg-[#f3e8ff] text-[#7e22ce]",
                  Fri: "bg-[#ffedd5] text-[#c2410c]",
                };

                return (
                  <Card
                    key={item.id}
                    className="overflow-hidden border border-[#DA7756]/20 bg-white shadow-md rounded-2xl"
                  >
                    <div className="bg-[#f8fafc] border-b border-neutral-100 p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="space-y-1 mt-6">
                          <h3 className="text-[1.3rem] font-bold text-neutral-900">
                            Wk# {weekNum}, {weekLabel}
                          </h3>
                          <p className="text-[15px] text-slate-500">
                            {currentUser
                              ? `${currentUser.firstname} ${currentUser.lastname}`
                              : "User Report"}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1.5 rounded-[6px] bg-[#dc2626] px-3 py-1 text-[13px] font-bold text-white shadow-sm">
                              <Star className="h-[14px] w-[14px]" />
                              <span>{reportData.total_score || 0}/100</span>
                            </div>
                            <div className="rounded-[6px] border border-slate-200 bg-white px-3 py-1 text-[13px] font-bold text-slate-800 shadow-sm">
                              0.0%
                            </div>
                          </div>

                          <div className="w-[220px] rounded-[10px] border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-[7px]">
                              {stats.map((s, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-[13px]"
                                >
                                  <span className="text-slate-500">
                                    {s.label}
                                  </span>
                                  <span className="font-bold text-slate-800">
                                    {s.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => handleViewDetails(item)}
                            className="mt-1 flex h-9 items-center gap-2 rounded-lg border-slate-200 bg-white px-5 text-[14px] font-semibold text-[#2563eb] shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Top Wins */}
                        <div className="rounded-xl border border-emerald-500/20 bg-white overflow-hidden flex flex-col">
                          <div className="bg-white border-b border-neutral-100 px-4 py-3 flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-emerald-500" />
                            <h4 className="font-bold text-emerald-600">
                              Top Wins
                            </h4>
                          </div>
                          <div className="p-4 space-y-3 flex-1 min-h-[200px]">
                            {achievements.length > 0 ? (
                              achievements.map((w: string, i: number) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2.5 text-sm text-neutral-700 font-medium"
                                >
                                  <div className="mt-1 h-4 w-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  </div>
                                  <span>{w}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-neutral-400 italic">
                                No wins recorded
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Next Week's Priorities */}
                        <div className="rounded-xl border border-indigo-500/20 bg-white overflow-hidden">
                          <div className="bg-white border-b border-neutral-100 px-4 py-3 flex items-center gap-2">
                            <Target className="h-5 w-5 text-indigo-500" />
                            <h4 className="font-bold text-indigo-600">
                              Next Week's Priorities
                            </h4>
                          </div>
                          <div className="p-4 space-y-3">
                            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                              <div key={day} className="space-y-2">
                                <div
                                  className={cn(
                                    "px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider",
                                    dayColors[day]
                                  )}
                                >
                                  {day}
                                </div>
                                <div className="pl-2 space-y-1.5">
                                  {day === "Mon" &&
                                    tasks
                                      .slice(0, 2)
                                      .map((t: string, i: number) => (
                                        <div
                                          key={i}
                                          className="flex items-center gap-2 text-sm text-neutral-700"
                                        >
                                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                          <span>{t}</span>
                                        </div>
                                      ))}
                                  {day !== "Mon" && <div className="h-4" />}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tasks & Issues */}
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2 text-orange-600">
                          <AlertTriangle className="h-5 w-5" />
                          <h4 className="font-bold">Tasks & Issues</h4>
                        </div>
                        {reportData.tasks_issues?.length > 0 ? (
                          reportData.tasks_issues.map((ti: any, i: number) => (
                            <div
                              key={i}
                              className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-4">
                                <X className="h-4 w-4 text-neutral-400" />
                                <span className="font-bold text-neutral-800">
                                  {ti.title}
                                </span>
                                <div className="flex gap-2">
                                  <Badge className="bg-white text-neutral-700 border-neutral-200 text-[10px] font-bold uppercase h-6">
                                    Task
                                  </Badge>
                                  <Badge className="bg-white text-neutral-700 border-neutral-200 text-[10px] font-bold uppercase h-6">
                                    {ti.status || "open"}
                                  </Badge>
                                </div>
                              </div>
                              <Badge className="bg-[#b45309] hover:bg-[#b45309] text-white text-[10px] font-bold uppercase h-6 px-3">
                                {ti.priority || "medium"}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 text-sm text-neutral-500 italic">
                            No issues recorded
                          </div>
                        )}
                      </div>

                      {/* Other Comments */}
                      <div className="mt-6 pt-6 border-t border-neutral-100">
                        <div className="flex items-center gap-2 text-neutral-500 mb-2">
                          <MessageSquare className="h-4 w-4" />
                          <h4 className="text-sm font-bold">Other Comments</h4>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-neutral-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                          <p>
                            <span className="font-bold uppercase text-[10px] text-neutral-500 mr-2">
                              REMARK:
                            </span>
                            {normalizeRemarks(reportData.remarks)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center">
                <div className="mb-4 rounded-full bg-neutral-50 p-4">
                  <BarChart3 className="h-8 w-8 text-neutral-300" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">
                  No review history found
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  You haven&apos;t submitted any weekly reports yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Import Daily Wins Dialog */}
      <Dialog open={showDailyWinsDialog} onOpenChange={setShowDailyWinsDialog}>
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden font-poppins">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold text-neutral-900">
              Select Daily Wins from Past Week
            </DialogTitle>
            <p className="text-sm text-neutral-500 mt-1">
              Choose accomplishments from your daily reports (
              {format(importPrevWeekStart, "MMM d")} to{" "}
              {format(importPrevWeekEnd, "MMM d")}) to add to this week&apos;s
              achievements.
            </p>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto p-6 pt-2 space-y-6">
            {isLoadingDailyReports ? (
              <div className="space-y-4 py-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : dailyReports.length > 0 ? (
              dailyReports.map((report: any) => {
                const rawDate = report.start_date || report.created_at;
                if (!rawDate) return null;
                const reportDate = new Date(rawDate);
                if (isNaN(reportDate.getTime())) return null;

                const rawWins =
                  report.report_data?.achievements ||
                  report.report_data?.accomplishments?.items?.map(
                    (i: any) => i.title || i
                  ) ||
                  (Array.isArray(report.report_data?.accomplishments)
                    ? report.report_data.accomplishments.map(
                        (i: any) => i.title || i
                      )
                    : []) ||
                  [];
                const reportWins: string[] = rawWins
                  .map(normalizeToString)
                  .filter(Boolean);

                return reportWins.length > 0 ? (
                  <div key={report.id} className="space-y-3">
                    <h4 className="text-sm font-bold text-neutral-700">
                      {format(reportDate, "EEE, MMM d")}
                    </h4>
                    <div className="space-y-2">
                      {reportWins.map((win: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-1">
                          <Checkbox
                            id={`win-${report.id}-${i}`}
                            checked={selectedDailyWins.includes(win)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedDailyWins((prev) => [...prev, win]);
                              } else {
                                setSelectedDailyWins((prev) =>
                                  prev.filter((w) => w !== win)
                                );
                              }
                            }}
                            className="rounded border-neutral-300"
                          />
                          <label
                            htmlFor={`win-${report.id}-${i}`}
                            className="text-sm text-neutral-700 cursor-pointer"
                          >
                            {win}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="h-px bg-neutral-100 mt-4 mx-[-24px]" />
                  </div>
                ) : null;
              })
            ) : (
              <div className="py-8 text-center text-neutral-500 text-sm italic">
                No daily reports with wins found for the past week.
              </div>
            )}
          </div>

          <DialogFooter className="p-6 pt-2 gap-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDailyWinsDialog(false)}
              className="rounded-xl border-neutral-200 text-neutral-700 font-bold px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmImportDailyWins}
              disabled={selectedDailyWins.length === 0}
              className="rounded-xl bg-neutral-400 hover:bg-neutral-500 text-white font-bold px-6"
            >
              Add Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyReports;
