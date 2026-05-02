import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
    Calendar,
    Info,
    TrendingUp,
    TrendingDown,
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
    AlertCircle,
    Eye,
    CheckCircle2,
    Clock,
    Loader2,
    FileText,
} from "lucide-react";
import {
    addDays,
    endOfWeek,
    format,
    getISOWeek,
    startOfWeek,
    subDays,
} from "date-fns";
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
import {
    Dialog as MuiDialog,
    DialogContent as MuiDialogContent,
    Slide,
} from "@mui/material";
import axios from "axios";
import { Menu, MenuItem } from "@mui/material";
import ProjectTaskCreateModal from "@/components/ProjectTaskCreateModal";
import AddIssueModal from "@/components/AddIssueModal";
import { TransitionProps } from "@mui/material/transitions";
import { useTasks } from "@/hooks/useTasks";
import { useIssues } from "@/hooks/useIssues";
import { useNavigate } from "react-router-dom";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

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
        if (typeof w.text === "string") return w.text;
        return JSON.stringify(w);
    }
    return String(w ?? "");
};

const WeeklyReports = () => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = React.useState("submit");
    const [addTaskOpen, setAddTaskOpen] = React.useState(false);
    const achievementFileInputRef = React.useRef<HTMLInputElement>(null);
    const [achievementUploads, setAchievementUploads] = React.useState<
        { name: string; size: number }[]
    >([]);
    const [mergedTasksIssues, setMergedTasksIssues] = useState<any[]>([]);
    const [selectedTasksIssues, setSelectedTasksIssues] = useState<{
        [key: string]: boolean;
    }>({});
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [showClosureModal, setShowClosureModal] = useState(false);
    const [closureItem, setClosureItem] = useState<any>(null);
    const [closureRemarks, setClosureRemarks] = useState("");
    const [closureAttachments, setClosureAttachments] = useState<any[]>([]);
    const [isClosureSubmitting, setIsClosureSubmitting] = useState(false);
    const [currentTasksPage, setCurrentTasksPage] = useState(1);
    const [currentIssuesPage, setCurrentIssuesPage] = useState(1);
    const [hasMoreTasks, setHasMoreTasks] = useState(true);
    const [hasMoreIssues, setHasMoreIssues] = useState(true);
    const [kpis, setKpis] = useState<any[]>([]);
    const [kpiLoading, setKpiLoading] = useState(false);
    const [kpiEntries, setKpiEntries] = useState<{ [key: number]: string }>({});
    const [plannedEntries, setPlannedEntries] = useState<{
        [key: number]: string;
    }>({});
    const [dailyKpiSummary, setDailyKpiSummary] = useState<any>(null);
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
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [openIssueModal, setOpenIssueModal] = useState(false);
    const [taskIssueMenuAnchor, setTaskIssueMenuAnchor] =
        useState<null | HTMLElement>(null);
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

    const user =
        typeof localStorage !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : {};
    const userId = user?.id;

    const myIssuesFilter = `
      q[status_in][]=open
      &q[status_in][]=overdued
      &q[status_in][]=completed
      ${userId ? `&q[responsible_person_id_eq]=${userId}` : ""}
    `.replace(/\s+/g, "");

    const { data: tasksData, isLoading: tasksLoading } = useTasks({
        taskType: "my",
        page: currentTasksPage,
        filters: {
            "q[expected_start_date_gteq]": format(weekStart, "yyyy-MM-dd"),
            "q[target_date_lteq]": format(weekEnd, "yyyy-MM-dd"),
        },
    });

    const { data: issuesData, isLoading: issuesLoading } = useIssues({
        baseUrl,
        token,
        page: currentIssuesPage,
        filters: myIssuesFilter,
        enabled: !!token && !!userId,
    });

    useEffect(() => {
        const tasks =
            tasksData?.data?.task_managements || tasksData?.task_managements || [];
        const issues = issuesData?.issues || [];

        const tasksPagination =
            tasksData?.data?.pagination || tasksData?.pagination;
        const issuesPagination = issuesData?.pagination;

        setHasMoreTasks(currentTasksPage < (tasksPagination?.total_pages || 1));
        setHasMoreIssues(currentIssuesPage < (issuesPagination?.total_pages || 1));

        const transformedTasks = tasks.map((task: any) => ({
            id: `task-${task.id}`,
            title: task.title, // <-- API mein field name "title" hai ya "name"?
            type: "task",
            status: task.status || "open",
            priority: task.priority || "Medium",
            created_at: task.created_at,
            responsible: task.responsible_person_id,
            originalData: task,
        }));

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

        if (currentTasksPage === 1 && currentIssuesPage === 1) {
            setMergedTasksIssues(newData);
        } else {
            setMergedTasksIssues((prev) => {
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

    useEffect(() => {
        const completedItems: { [key: string]: boolean } = {};
        mergedTasksIssues.forEach((item) => {
            if (item.status === "completed" || item.status === "closed") {
                completedItems[item.id] = true;
            }
        });
        setSelectedTasksIssues(completedItems);
    }, [mergedTasksIssues]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

            if (isNearBottom && !isLoadingMore && !tasksLoading && !issuesLoading) {
                setIsLoadingMore(true);
                if (hasMoreTasks) setCurrentTasksPage((prev) => prev + 1);
                if (hasMoreIssues) setCurrentIssuesPage((prev) => prev + 1);
                if (!hasMoreTasks && !hasMoreIssues) setIsLoadingMore(false);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [isLoadingMore, tasksLoading, issuesLoading, hasMoreTasks, hasMoreIssues]);

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

    const weekLabels = React.useMemo(() => {
        return [
            { label: "Week -3", date: format(subDays(weekStart, 21), "MMM d") },
            { label: "Week -2", date: format(subDays(weekStart, 14), "MMM d") },
            { label: "Week -1", date: format(subDays(weekStart, 7), "MMM d") },
            {
                label: "Target Value",
                date: format(weekStart, "MMM d"),
                isTarget: true,
            },
            {
                label: "Actual (This Week)",
                date: format(weekStart, "MMM d"),
                isActual: true,
            },
            {
                label: "Planned Next",
                date: format(addDays(weekStart, 7), "MMM d"),
                isPlanned: true,
            },
        ];
    }, [weekStart]);

    const currentUser = getUser();

    // ─── Automated Score Calculation ──────────────────────────────────────────
    const weeklyScore = React.useMemo(() => {
        // 1. Weekly KPI Achievement (Max 20 points)
        const weeklyKpiValues = kpis.map((kpi) => {
            const actual = parseFloat(kpiEntries[kpi.kpi_id] || "0");
            const target = parseFloat(kpi.target_value || "0");
            if (target === 0) return actual > 0 ? 100 : 0;
            return Math.min((actual / target) * 100, 100);
        });
        const weeklyKpiAvg =
            weeklyKpiValues.length > 0
                ? weeklyKpiValues.reduce((a, b) => a + b, 0) / weeklyKpiValues.length
                : 0;
        const weeklyKpiScore = (20 * weeklyKpiAvg) / 100;

        // 2. Daily KPI Achievement (Max 10 points)
        const dailyKpiKpis = dailyKpiSummary?.kpis || [];
        const avgDailyAchievement =
            dailyKpiKpis.length > 0
                ? dailyKpiKpis.reduce(
                    (acc: number, kpi: any) =>
                        acc + parseFloat(kpi.achievement_percentage || "0"),
                    0
                ) / dailyKpiKpis.length
                : 0;

        let dailyKpiScore = 0;
        if (avgDailyAchievement >= 100) dailyKpiScore = 10;
        else if (avgDailyAchievement >= 90) dailyKpiScore = 7;
        else if (avgDailyAchievement >= 70) dailyKpiScore = 4;
        else dailyKpiScore = 0;

        // 3. Starred Achievements (Max 6 points)
        const starredCount = Object.values(starredWins).filter(Boolean).length;
        const achievementsScore = Math.min(starredCount * 2, 6);

        // 4. Tasks & Issues (Max 10 points)
        const closedTasks = mergedTasksIssues.filter(
            (item) => item.status === "completed" || item.status === "closed"
        ).length;
        const openTasks = mergedTasksIssues.filter(
            (item) => item.status === "open" || item.status === "reopen"
        ).length;
        const overdueTasks = mergedTasksIssues.filter(
            (item) => item.status === "overdue"
        ).length;

        const taskPositive = closedTasks * 2;
        const taskOpenPenalty = Math.max(openTasks * -0.5, -3);
        const taskOverduePenalty = Math.max(overdueTasks * -2, -5);
        const tasksScore = Math.min(
            Math.max(taskPositive + taskOpenPenalty + taskOverduePenalty, 0),
            10
        );

        // 5. SOPs Health & Status (Max 20 points)
        const sopHealth = 100; // Placeholder
        const sopStatus = "Running"; // Placeholder
        let sopScore = (sopHealth / 100) * 10;
        if (sopStatus === "Running") sopScore += 5;
        sopScore = Math.min(Math.max(sopScore, 0), 20);

        // 6. Items Planned for Coming Week (Max 20 points)
        const totalPlanned = Object.values(dayPlans).reduce((acc, tasks) => {
            return (
                acc +
                tasks.filter((t) => {
                    if (!t || typeof t !== "object") return false;
                    const text = (t as any)?.text;
                    return typeof text === "string" && text.trim() !== "";
                }).length
            );
        }, 0);
        const planningScore = Math.min(totalPlanned, 20);

        // 7. Remarks Logged (Max 14 points)
        let remarksScore = 0;
        remarksList.forEach((r) => {
            if (
                [
                    "breakthrough",
                    "breakdown",
                    "clientFeedback",
                    "employeeFeedback",
                ].includes(r.type || "")
            ) {
                remarksScore += 3;
            } else {
                remarksScore += 1;
            }
        });
        remarksScore = Math.min(remarksScore, 14);

        const totalScore = Math.min(
            weeklyKpiScore +
            dailyKpiScore +
            achievementsScore +
            tasksScore +
            sopScore +
            planningScore +
            remarksScore,
            100
        );

        return {
            total: totalScore,
            breakdown: {
                weeklyKpi: weeklyKpiScore,
                dailyKpi: dailyKpiScore,
                achievements: achievementsScore,
                tasks: tasksScore,
                sop: sopScore,
                planning: planningScore,
                remarks: remarksScore,
            },
        };
    }, [kpis, kpiEntries, dailyKpiSummary, starredWins, mergedTasksIssues, dayPlans, remarksList]);

    const closureFileInputRef = useRef<HTMLInputElement>(null);

    const triggerClosureFileUpload = () => closureFileInputRef.current?.click();

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
        if (closureFileInputRef.current) closureFileInputRef.current.value = "";
    };

    const handleMarkItemClosed = async () => {
        if (!closureItem || !baseUrl || !token) return;
        setIsClosureSubmitting(true);
        try {
            const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
            const isTask = closureItem.type === "task";
            const urlBase = `https://${baseUrl}`;
            const realId = closureItem.id.replace("task-", "").replace("issue-", "");

            setMergedTasksIssues((prev) =>
                prev.map((item) =>
                    item.id === closureItem.id ? { ...item, status: "completed" } : item
                )
            );
            setSelectedTasksIssues((prev) => ({ ...prev, [closureItem.id]: true }));

            const formDataToSend = new FormData();
            if (isTask) {
                formDataToSend.append("task_management[status]", "completed");
                closureAttachments.forEach((attachment) =>
                    formDataToSend.append(
                        `task_management[attachments][]`,
                        attachment.file
                    )
                );
                await axios.put(
                    `${urlBase}/task_managements/${realId}.json`,
                    formDataToSend,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                formDataToSend.append("issue[status]", "completed");
                closureAttachments.forEach((attachment) =>
                    formDataToSend.append(`issue[attachments][]`, attachment.file)
                );
                await axios.put(`${urlBase}/issues/${realId}.json`, formDataToSend, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            if (closureRemarks.trim()) {
                await axios.post(
                    `${urlBase}/comments.json`,
                    {
                        comment: {
                            body: `Closure Remarks: ${closureRemarks}`,
                            commentable_id: realId,
                            commentable_type: isTask ? "TaskManagement" : "Issue",
                            commentor_id: userId,
                            active: true,
                        },
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            setShowClosureModal(false);
            setClosureRemarks("");
            setClosureAttachments([]);
            setClosureItem(null);
            setCurrentTasksPage(1);
            setCurrentIssuesPage(1);
        } catch (error) {
            console.error("Error marking item as closed:", error);
            setMergedTasksIssues((prev) =>
                prev.map((item) =>
                    item.id === closureItem.id
                        ? { ...item, status: closureItem.status }
                        : item
                )
            );
        } finally {
            setIsClosureSubmitting(false);
        }
    };

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

    useEffect(() => {
        const fetchKpis = async () => {
            try {
                setKpiLoading(true);
                const baseUrl = localStorage.getItem("baseUrl");
                const token = localStorage.getItem("token");
                if (!baseUrl || !token) return;

                const response = await axios.get(
                    `https://${baseUrl}/kpis/due_entries.json?date=${format(weekStart, "yyyy-MM-dd")}&journal_type=weekly`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.data?.success && response.data?.data) {
                    setKpis(response.data.data.kpis || []);
                    const entries: { [key: number]: string } = {};
                    response.data.data.kpis?.forEach((kpi: any) => {
                        if (kpi.entry?.actual_value)
                            entries[kpi.kpi_id] = kpi.entry.actual_value;
                    });
                    setKpiEntries(entries);
                }
            } catch (error) {
                console.error("Error fetching KPIs:", error);
            } finally {
                setKpiLoading(false);
            }
        };
        if (weekStart) fetchKpis();
    }, [weekStart]);

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

            // Achievements mapping
            const apiAchievements = item.report_data?.achievements || [];
            if (Array.isArray(apiAchievements)) {
                const normalizedWins: string[] = [];
                const newStarredWins: Record<number, boolean> = {};
                apiAchievements.forEach((ach: any, idx: number) => {
                    if (typeof ach === "string") {
                        normalizedWins.push(ach);
                    } else if (typeof ach === "object" && ach !== null) {
                        const title = ach.title || ach.text || "";
                        normalizedWins.push(title);
                        if (ach.is_starred || ach.starred) {
                            newStarredWins[idx] = true;
                        }
                    }
                });
                setWins(normalizedWins);
                setStarredWins(newStarredWins);
                const defaultChecked: Record<number, boolean> = {};
                normalizedWins.forEach((_, i) => {
                    defaultChecked[i] = true;
                });
                setCheckedWins(defaultChecked);
            }

            // Plans mapping
            const apiPlans =
                item.report_data?.upcoming_week_plan || item.report_data?.tasks || [];
            const dayKeyedObject = Array.isArray(apiPlans) ? apiPlans[0] : apiPlans;

            if (dayKeyedObject && typeof dayKeyedObject === "object") {
                const dayMapping: Record<string, string> = {
                    mon: "Mon",
                    tue: "Tue",
                    wed: "Wed",
                    thu: "Thu",
                    fri: "Fri",
                    sat: "Sat",
                    sun: "Sun",
                };

                const newDayPlans: Record<
                    string,
                    { id: string; text: string; starred?: boolean }[]
                > = {};
                Object.entries(dayKeyedObject).forEach(([dayKey, dayTasks]) => {
                    const dayAbbr = dayMapping[dayKey.toLowerCase()];
                    if (dayAbbr && Array.isArray(dayTasks)) {
                        const matchingDay = upcomingDays.find((d) =>
                            d.short.startsWith(dayAbbr)
                        );
                        if (matchingDay) {
                            newDayPlans[matchingDay.key] = dayTasks.map((t: any) => {
                                if (typeof t === "string") {
                                    return {
                                        id: crypto.randomUUID(),
                                        text: t,
                                    };
                                }
                                return {
                                    id: t.id || crypto.randomUUID(),
                                    text: t.text || t.title || "",
                                    starred: t.starred || t.is_starred || false,
                                };
                            });
                        }
                    }
                });
                setDayPlans(newDayPlans);
            }

            if (item.report_data?.past_kpis) {
                const entries: { [key: number]: string } = {};
                const planned: { [key: number]: string } = {};
                item.report_data.past_kpis.forEach((kpiEntry: any) => {
                    entries[kpiEntry.kpi_id] = kpiEntry.actual_value.toString();
                    if (kpiEntry.planned_value) {
                        planned[kpiEntry.kpi_id] = kpiEntry.planned_value.toString();
                    }
                });
                setKpiEntries(entries);
                setPlannedEntries(planned);
            }

            if (item.daily_kpi_summary) {
                setDailyKpiSummary(item.daily_kpi_summary);
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
        setCheckedWins((prev) => ({ ...prev, [newIndex]: true }));
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
                        achievements: wins
                            .map((w, index) => ({
                                title: w,
                                is_starred: starredWins[index] ?? false
                            }))
                            .filter((item) => item.title.trim() !== ""),
                        upcoming_week_plan: [{
                            ...Object.fromEntries(
                                Object.entries(dayPlans).map(([dayKey, tasks]) => {
                                    // Extract day abbreviation (Mon, Tue, etc.) and convert to lowercase
                                    const dayMatch = dayKey.match(/^(\w{3})/);
                                    const dayAbbr = dayMatch ? dayMatch[1].toLowerCase() : dayKey.slice(0, 3).toLowerCase();
                                    // Filter out empty tasks
                                    const filteredTasks = tasks.filter(t => t.text.trim() !== '');
                                    return [dayAbbr, filteredTasks];
                                })
                            )
                        }],
                        tasks_issues: mergedTasksIssues
                            .filter((item) => selectedTasksIssues[item.id] === true)
                            .map((item) => ({
                                title:
                                    item.originalData?.title ||
                                    item.originalData?.name ||
                                    item.title ||
                                    "",
                                status: "completed",
                            })),
                        past_kpis: kpis.map((kpi) => ({
                            kpi_id: kpi.kpi_id,
                            actual_value: kpiEntries[kpi.kpi_id]
                                ? parseFloat(kpiEntries[kpi.kpi_id])
                                : 0,
                            target_value: parseFloat(kpi.target_value),
                            planned_value: plannedEntries[kpi.kpi_id] || "",
                            notes: kpi.kpi_name,
                        })),
                        total_score: Math.round(weeklyScore.total),
                        remarks: formattedRemarks,
                        remark_type: activeRemarkChip,
                        score_override: true,
                        sections: {
                            weekly_kpi_achievement: weeklyScore.breakdown.weeklyKpi,
                            daily_kpi_achievement: weeklyScore.breakdown.dailyKpi,
                            starred_achievements: weeklyScore.breakdown.achievements,
                            tasks_issues: weeklyScore.breakdown.tasks,
                            sop_health: weeklyScore.breakdown.sop,
                            planning: weeklyScore.breakdown.planning,
                            remarks: weeklyScore.breakdown.remarks,
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
                                    "flex items-center justify-between",
                                    sectionHeader
                                )}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-[#DA7756]" />
                                        <h3 className="font-bold text-neutral-900">
                                            Past Weeks KPIs
                                        </h3>
                                        <Info className="h-4 w-4 text-neutral-400 cursor-help" />
                                    </div>
                                    <p className="text-xs text-neutral-600 flex items-center gap-1">
                                        <span>💡</span> Enter actual values for this week and plan
                                        for next week. Track your key metrics.
                                    </p>
                                </div>
                                <Badge className={badgePoints}>
                                    {weeklyScore.breakdown.weeklyKpi}/20 pts
                                </Badge>
                            </div>

                            <div className="overflow-x-auto border-t border-neutral-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-neutral-100">
                                            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider min-w-[200px] whitespace-nowrap">
                                                KPI
                                            </th>
                                            {weekLabels.slice(0, 3).map((w, i) => (
                                                <th
                                                    key={i}
                                                    className="px-4 py-4 text-center whitespace-nowrap"
                                                >
                                                    <div className="text-xs font-bold text-neutral-500">
                                                        {w.label}
                                                    </div>
                                                    <div className="text-[10px] text-neutral-400 font-medium">
                                                        {w.date}
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="px-4 py-4 text-center bg-blue-50/50 whitespace-nowrap">
                                                <div className="text-xs font-bold text-blue-600">
                                                    Target Value
                                                </div>
                                                <div className="text-[10px] text-blue-600/70 font-medium">
                                                    {weekLabels[3].date}
                                                </div>
                                            </th>
                                            <th className="px-4 py-4 text-center bg-emerald-50/50 whitespace-nowrap w-32 min-w-[120px]">
                                                <div className="text-xs font-bold text-emerald-600">
                                                    Actual (This Week)
                                                </div>
                                                <div className="text-[10px] text-emerald-600/70 font-medium">
                                                    {weekLabels[4].date}
                                                </div>
                                            </th>
                                            <th className="px-4 py-4 text-center bg-violet-50/50 whitespace-nowrap w-32 min-w-[120px]">
                                                <div className="text-xs font-bold text-violet-600">
                                                    Planned Next
                                                </div>
                                                <div className="text-[10px] text-violet-600/70 font-medium">
                                                    {weekLabels[5].date}
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {kpis.map((kpi) => (
                                            <tr
                                                key={kpi.kpi_id}
                                                className="hover:bg-neutral-50/30 transition-colors"
                                            >
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-neutral-900">
                                                                {kpi.kpi_name}
                                                            </span>
                                                            {!kpi.submitted && (
                                                                <Badge className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0 h-4 border-none">
                                                                    new
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px] font-bold bg-neutral-50 text-neutral-500 border-neutral-200 py-0.5 whitespace-nowrap"
                                                            >
                                                                {kpi.unit || "%"}
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px] font-bold bg-neutral-50 text-neutral-500 border-neutral-200 py-0.5 flex items-center gap-1 whitespace-nowrap"
                                                            >
                                                                <Calendar className="h-3 w-3" />
                                                                {kpi.frequency_label || "Weekly"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Historical Weeks */}
                                                <td className="px-4 py-5 text-center text-sm font-medium text-neutral-400 whitespace-nowrap">
                                                    -
                                                </td>
                                                <td className="px-4 py-5 text-center text-sm font-medium text-neutral-400 whitespace-nowrap">
                                                    -
                                                </td>
                                                <td className="px-4 py-5 text-center text-sm font-bold text-neutral-500 whitespace-nowrap">
                                                    {kpi.past_entries?.[0]?.actual_value || "100"}
                                                </td>
                                                {/* Target Value */}
                                                <td className="px-4 py-5 text-center bg-blue-50/20 font-bold text-blue-600 whitespace-nowrap">
                                                    {kpi.target_value}
                                                </td>
                                                {/* Actual (This Week) */}
                                                <td className="px-4 py-5 bg-emerald-50/20 w-32">
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
                                                        className="w-full px-2 py-2 border border-emerald-200 rounded-[10px] text-sm font-bold text-center bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-neutral-300"
                                                    />
                                                </td>
                                                {/* Planned Next */}
                                                <td className="px-4 py-5 bg-violet-50/20 w-32">
                                                    <input
                                                        type="number"
                                                        value={plannedEntries[kpi.kpi_id] || ""}
                                                        onChange={(e) =>
                                                            setPlannedEntries((prev) => ({
                                                                ...prev,
                                                                [kpi.kpi_id]: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="0"
                                                        className="w-full px-2 py-2 border border-violet-200 rounded-[10px] text-sm font-bold text-center bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 placeholder:text-neutral-300"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {kpis.length === 0 && (
                                    <div className="py-20 text-center">
                                        <p className="text-sm text-neutral-400 font-medium">
                                            No KPIs assigned for this period.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Daily KPI Achievement */}
                        <Card className={cn("overflow-hidden", cardChrome)}>
                            <div
                                className={cn(
                                    "flex items-start justify-between",
                                    sectionHeader
                                )}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-[#DA7756]" />
                                        <h3 className="font-bold text-neutral-900">
                                            Daily KPI Summary - Week of{" "}
                                            {dailyKpiSummary?.week_start
                                                ? format(new Date(dailyKpiSummary.week_start), "MMM d")
                                                : "..."}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-neutral-600">
                                        Average achievement across daily KPIs submitted this week.
                                    </p>
                                </div>
                                <Badge className={badgePoints}>
                                    {weeklyScore.breakdown.dailyKpi}/10 pts
                                </Badge>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-neutral-100 bg-slate-50/50">
                                            <th className="px-4 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                                KPI
                                            </th>
                                            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                                                <th
                                                    key={i}
                                                    className="px-2 py-3 text-center text-[11px] font-bold text-neutral-500 uppercase"
                                                >
                                                    {day}
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 text-center text-[11px] font-bold text-neutral-500 uppercase bg-slate-100/50">
                                                Target
                                            </th>
                                            <th className="px-4 py-3 text-center text-[11px] font-bold text-neutral-500 uppercase bg-slate-100/50">
                                                Actual
                                            </th>
                                            <th className="px-4 py-3 text-center text-[11px] font-bold text-neutral-500 uppercase bg-slate-100/50">
                                                Ach %
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {dailyKpiSummary?.kpis?.map((kpi: any) => (
                                            <tr key={kpi.kpi_id} className="hover:bg-neutral-50/30">
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-neutral-900">
                                                            {kpi.kpi_name}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-400 font-medium bg-neutral-100 w-fit px-1.5 py-0.5 rounded mt-1">
                                                            {kpi.unit}
                                                        </span>
                                                    </div>
                                                </td>
                                                {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                                                    (day) => (
                                                        <td
                                                            key={day}
                                                            className="px-2 py-3 text-center text-xs text-neutral-500 font-medium"
                                                        >
                                                            {kpi.daily_values?.[day] ?? "-"}
                                                        </td>
                                                    )
                                                )}
                                                <td className="px-4 py-3 text-center text-xs font-bold text-neutral-900 bg-slate-50/30">
                                                    {kpi.target_value}
                                                </td>
                                                <td className="px-4 py-3 text-center text-xs font-bold text-neutral-900 bg-slate-50/30">
                                                    {kpi.actual_value}
                                                </td>
                                                <td className="px-4 py-3 text-center bg-slate-50/30">
                                                    <span
                                                        className={cn(
                                                            "inline-flex items-center justify-center px-2 py-1 rounded-[5px] text-[10px] font-bold text-white min-w-[35px]",
                                                            parseFloat(kpi.achievement_percentage) >= 100
                                                                ? "bg-green-600"
                                                                : parseFloat(kpi.achievement_percentage) >= 70
                                                                    ? "bg-amber-500"
                                                                    : "bg-red-600"
                                                        )}
                                                    >
                                                        {Math.round(kpi.achievement_percentage)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {!dailyKpiSummary?.kpis?.length && (
                                            <tr>
                                                <td
                                                    colSpan={11}
                                                    className="px-6 py-10 text-center text-sm text-neutral-400 italic"
                                                >
                                                    Daily KPI data will be fetched automatically from
                                                    submitted reports.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
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
                                <Badge className={badgePoints}>
                                    {weeklyScore.breakdown.achievements}/6 pts
                                </Badge>
                            </div>
                            <div className="space-y-4 p-6">
                                {wins.map((win, index) => (
                                    <div
                                        key={index}
                                        className="group relative flex items-start gap-3 rounded-xl border border-[#DA7756]/15 bg-white p-4 shadow-sm"
                                    >
                                        <Checkbox
                                            className="mt-1 rounded border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                            checked={checkedWins[index] ?? true}
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
                                    // onClick={() => setAddTaskOpen(true)}
                                    onClick={(e) => setTaskIssueMenuAnchor(e.currentTarget)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
                                {/* <CheckSquare className="h-12 w-12 text-neutral-200" />
                                <p className="text-lg text-neutral-400">
                                    No open tasks or issues.
                                </p> */}

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
                                        className="space-y-2 max-h-[400px] overflow-y-auto w-full"
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
                                                        const detailsUrl =
                                                            item.type === "task"
                                                                ? `/vas/tasks/${item.originalData?.id}`
                                                                : `/vas/issues/${item.originalData?.id}`;
                                                        navigate(detailsUrl);
                                                    }}
                                                    className="p-1.5 hover:bg-gray-200 rounded-[6px] transition-colors"
                                                    title={`View ${item.type} details`}
                                                >
                                                    <Eye
                                                        size={16}
                                                        className="text-gray-600 hover:text-gray-800"
                                                    />
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
                                                <span
                                                    className="text-[10px] px-2 py-1 rounded-full font-bold shrink-0"
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

                        {/* SOPs Health & Status */}
                        <Card className={cn("overflow-hidden", cardChrome)}>
                            <div
                                className={cn(
                                    "flex items-start justify-between",
                                    sectionHeader
                                )}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-[#DA7756]" />
                                        <h3 className="font-bold text-neutral-900">
                                            SOPs Health & Status
                                        </h3>
                                    </div>
                                    <p className="text-xs text-neutral-600">
                                        Maintain healthy and running SOPs for maximum points.
                                    </p>
                                </div>
                                <Badge className={badgePoints}>
                                    {weeklyScore.breakdown.sop}/20 pts
                                </Badge>
                            </div>
                            <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
                                <p className="text-sm text-neutral-400">
                                    SOP performance metrics will be automatically fetched and
                                    displayed here.
                                </p>
                            </div>
                        </Card>

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
                                    <Badge className={badgePoints}>
                                        {weeklyScore.breakdown.planning}/20 pts
                                    </Badge>
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
                                    {weeklyScore.breakdown.remarks}/14 pts
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

                        {/* Automated Weekly Score Preview */}
                        <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-[#DA7756]" />
                                    <h4 className="text-base font-bold text-neutral-900">
                                        Automated Weekly Score Preview
                                    </h4>
                                </div>
                                <span className="text-2xl font-black text-[#DA7756]">
                                    {Math.round(weeklyScore.total)}/100
                                </span>
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                                {[
                                    {
                                        label: "Weekly KPI",
                                        score: `${weeklyScore.breakdown.weeklyKpi}/20`,
                                        icon: <BarChart3 className="h-3 w-3" />,
                                    },
                                    {
                                        label: "Daily KPI",
                                        score: `${weeklyScore.breakdown.dailyKpi}/10`,
                                        icon: <Activity className="h-3 w-3" />,
                                    },
                                    {
                                        label: "Achievements",
                                        score: `${weeklyScore.breakdown.achievements}/6`,
                                        icon: <Trophy className="h-3 w-3" />,
                                    },
                                    {
                                        label: "Tasks",
                                        score: `${weeklyScore.breakdown.tasks}/10`,
                                        icon: <CheckSquare className="h-3 w-3" />,
                                    },
                                    {
                                        label: "SOPs",
                                        score: `${weeklyScore.breakdown.sop}/20`,
                                        icon: <Zap className="h-3 w-3" />,
                                    },
                                    {
                                        label: "Planning",
                                        score: `${weeklyScore.breakdown.planning}/20`,
                                        icon: <Target className="h-3 w-3" />,
                                    },
                                    {
                                        label: "Remarks",
                                        score: `${weeklyScore.breakdown.remarks}/14`,
                                        icon: <MessageSquare className="h-3 w-3" />,
                                    },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-xl border border-[#DA7756]/10 bg-white p-3 shadow-sm flex flex-col items-center text-center"
                                    >
                                        <div className="mb-1 text-[#DA7756] opacity-60">
                                            {stat.icon}
                                        </div>
                                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                                            {stat.label}
                                        </p>
                                        <p className="text-xs font-black text-neutral-900">
                                            {stat.score}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="details" className="border-none">
                                    <AccordionTrigger className="py-2 text-xs font-bold text-neutral-700 hover:no-underline justify-center gap-2">
                                        Detailed Score Calculation Breakdown
                                        <span className="text-[10px] font-normal text-neutral-400">
                                            (Click to view criteria)
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="mt-2 rounded-xl bg-white/60 border border-[#DA7756]/5 p-4 text-[11px] text-neutral-600 space-y-4 shadow-inner">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <p className="font-black text-neutral-800 flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-[#DA7756]" />
                                                        1. Weekly KPI Achievement (Max 20 pts)
                                                    </p>
                                                    <p className="text-[10px] text-neutral-500 italic mb-1">
                                                        Based on average achievement across all weekly KPIs.
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="bg-white/80 p-2 rounded border border-neutral-100 flex justify-between">
                                                            <span>≥100%</span>
                                                            <span className="font-bold text-[#DA7756]">
                                                                20 pts
                                                            </span>
                                                        </div>
                                                        <div className="bg-white/80 p-2 rounded border border-neutral-100 flex justify-between">
                                                            <span>90-99%</span>
                                                            <span className="font-bold text-[#DA7756]">
                                                                14 pts
                                                            </span>
                                                        </div>
                                                        <div className="bg-white/80 p-2 rounded border border-neutral-100 flex justify-between">
                                                            <span>70-89%</span>
                                                            <span className="font-bold text-[#DA7756]">
                                                                6 pts
                                                            </span>
                                                        </div>
                                                        <div className="bg-white/80 p-2 rounded border border-neutral-100 flex justify-between">
                                                            <span>&lt;70%</span>
                                                            <span className="font-bold text-neutral-400">
                                                                0 pts
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <p className="font-black text-neutral-800 flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-[#DA7756]" />
                                                        2. Daily KPI Achievement (Max 10 pts)
                                                    </p>
                                                    <p className="text-[10px] text-neutral-500 italic mb-1">
                                                        Average achievement across all daily KPIs submitted.
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="bg-white/80 p-2 rounded border border-neutral-100 flex justify-between">
                                                            <span>≥100%</span>
                                                            <span className="font-bold text-[#DA7756]">
                                                                10 pts
                                                            </span>
                                                        </div>
                                                        <div className="bg-white/80 p-2 rounded border border-neutral-100 flex justify-between">
                                                            <span>90-99%</span>
                                                            <span className="font-bold text-[#DA7756]">
                                                                7 pts
                                                            </span>
                                                        </div>
                                                        <div className="bg-white/80 p-2 rounded border border-neutral-100 flex justify-between">
                                                            <span>70-89%</span>
                                                            <span className="font-bold text-[#DA7756]">
                                                                4 pts
                                                            </span>
                                                        </div>
                                                        <div className="bg-white/80 p-2 rounded border border-neutral-100 flex justify-between">
                                                            <span>&lt;70%</span>
                                                            <span className="font-bold text-neutral-400">
                                                                0 pts
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <p className="font-black text-neutral-800 flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-[#DA7756]" />
                                                        3. Starred Achievements (Max 6 pts)
                                                    </p>
                                                    <div className="bg-white/80 p-2 rounded border border-neutral-100">
                                                        <p>
                                                            2 points per starred achievement. Star your top 3
                                                            impactful wins.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <p className="font-black text-neutral-800 flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-[#DA7756]" />
                                                        4. Tasks & Issues (Max 10 pts)
                                                    </p>
                                                    <div className="bg-white/80 p-3 rounded border border-neutral-100 grid grid-cols-1 gap-1.5">
                                                        <div className="flex justify-between">
                                                            <span>Closed tasks/issues:</span>
                                                            <span className="font-bold text-emerald-600">
                                                                +2 pts each
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Open tasks/issues:</span>
                                                            <span className="font-bold text-orange-600">
                                                                -0.5 pts each (max -3)
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Overdue tasks/issues:</span>
                                                            <span className="font-bold text-red-600">
                                                                -2 pts each (max -5)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <p className="font-black text-neutral-800 flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-[#DA7756]" />
                                                        5. SOPs Health & Status (Max 20 pts)
                                                    </p>
                                                    <div className="bg-white/80 p-3 rounded border border-neutral-100 space-y-2">
                                                        <div className="flex justify-between">
                                                            <span>Health Score (0-100):</span>
                                                            <span className="font-bold text-[#DA7756]">
                                                                0-10 pts
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 pt-1 border-t border-neutral-50 mt-1">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-100"
                                                            >
                                                                Running: +5
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[9px] bg-red-50 text-red-700 border-red-100"
                                                            >
                                                                Broken: -5
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[9px] bg-orange-50 text-orange-700 border-orange-100"
                                                            >
                                                                To Start: -2
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <p className="font-black text-neutral-800 flex items-center gap-2">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-[#DA7756]" />
                                                            6. Planning (20 pts)
                                                        </p>
                                                        <div className="bg-white/80 p-2 rounded border border-neutral-100">
                                                            <p>1 pt per unique priority item (Max 20).</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <p className="font-black text-neutral-800 flex items-center gap-2">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-[#DA7756]" />
                                                            7. Remarks (14 pts)
                                                        </p>
                                                        <div className="bg-white/80 p-2 rounded border border-neutral-100">
                                                            <p>
                                                                Insights & feedback (+3 pts each), others (+1
                                                                pt).
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                const getGroupedRemarks = (remarks: any) => {
                                    const grouped: Record<string, string[]> = {};

                                    if (!remarks) return grouped;

                                    const processItem = (item: any) => {
                                        if (typeof item === "string") {
                                            if (!grouped["remark"]) grouped["remark"] = [];
                                            grouped["remark"].push(item);
                                        } else if (typeof item === "object" && item !== null) {
                                            // Handle { type: "...", text: "..." } format
                                            if (item.type && item.text) {
                                                if (!grouped[item.type]) grouped[item.type] = [];
                                                grouped[item.type].push(item.text);
                                            } else {
                                                // Handle { key: "value" } format
                                                Object.entries(item).forEach(([key, value]) => {
                                                    if (!grouped[key]) grouped[key] = [];
                                                    grouped[key].push(String(value));
                                                });
                                            }
                                        }
                                    };

                                    if (Array.isArray(remarks)) {
                                        remarks.forEach(processItem);
                                    } else {
                                        processItem(remarks);
                                    }

                                    return grouped;
                                };

                                const groupedRemarks = getGroupedRemarks(reportData.remarks);
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
                                    reportData.upcoming_week_plan ||
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

                                const stats = [
                                    {
                                        label: "Weekly KPIs:",
                                        value: `${reportData.sections?.weekly_kpi_achievement || 0}/20`,
                                    },
                                    {
                                        label: "Daily KPIs:",
                                        value: `${reportData.sections?.daily_kpi_achievement || 0}/10`,
                                    },
                                    {
                                        label: "Starred Wins:",
                                        value: `${reportData.sections?.starred_achievements || 0}/6`,
                                    },
                                    {
                                        label: "Tasks/Issues:",
                                        value: `${reportData.sections?.tasks_issues || 0}/10`,
                                    },
                                    {
                                        label: "Planned:",
                                        value: `${reportData.sections?.planning || 0}/20`,
                                    },
                                    {
                                        label: "Remarks:",
                                        value: `${reportData.sections?.remarks || 0}/14`,
                                    },
                                    {
                                        label: "SOPs:",
                                        value: `${reportData.sections?.sop_health || 0}/20`,
                                    },
                                ];

                                const dayStyles: Record<
                                    string,
                                    { bg: string; text: string; dot: string }
                                > = {
                                    Mon: {
                                        bg: "bg-[#eef2ff]",
                                        text: "text-[#3730a3]",
                                        dot: "bg-[#6366f1]",
                                    },
                                    Tue: {
                                        bg: "bg-[#f0fdf4]",
                                        text: "text-[#166534]",
                                        dot: "bg-[#22c55e]",
                                    },
                                    Wed: {
                                        bg: "bg-[#fffbeb]",
                                        text: "text-[#92400e]",
                                        dot: "bg-[#f59e0b]",
                                    },
                                    Thu: {
                                        bg: "bg-[#faf5ff]",
                                        text: "text-[#6b21a8]",
                                        dot: "bg-[#a855f7]",
                                    },
                                    Fri: {
                                        bg: "bg-[#fff7ed]",
                                        text: "text-[#9a3412]",
                                        dot: "bg-[#f97316]",
                                    },
                                    Sat: {
                                        bg: "bg-[#f8fafc]",
                                        text: "text-[#334155]",
                                        dot: "bg-[#64748b]",
                                    },
                                    Sun: {
                                        bg: "bg-[#fef2f2]",
                                        text: "text-[#991b1b]",
                                        dot: "bg-[#ef4444]",
                                    },
                                };

                                const getTasksForDay = (day: string) => {
                                    const planObj = Array.isArray(reportData.upcoming_week_plan)
                                        ? reportData.upcoming_week_plan[0]
                                        : reportData.upcoming_week_plan;

                                    if (!planObj) return [];
                                    const dayKey = day.toLowerCase();
                                    const dayTasks = planObj[dayKey] || [];
                                    return Array.isArray(dayTasks) ? dayTasks : [];
                                };

                                return (
                                    <Card
                                        key={item.id}
                                        className="overflow-hidden border border-[#DA7756]/20 bg-white shadow-md rounded-2xl"
                                    >
                                        <div className="bg-[#f8fafc] border-b border-neutral-100 p-6">
                                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                                <div className="space-y-1 mt-6">
                                                    <h3 className="text-base font-bold text-neutral-900">
                                                        Wk# {weekNum}, {weekLabel}
                                                    </h3>
                                                    <p className="text-sm text-slate-500">
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
                                                        <h4 className="font-bold text-sm text-emerald-600">
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
                                                <div className="rounded-xl border border-blue-200 bg-white overflow-hidden shadow-sm">
                                                    <div className="bg-white border-b border-neutral-50 px-4 py-4 flex items-center gap-2.5">
                                                        <div className="flex items-center justify-center h-6 w-6 rounded-full border-2 border-[#2563eb] bg-white">
                                                            <div className="h-2.5 w-2.5 rounded-full border-2 border-[#2563eb]" />
                                                        </div>
                                                        <h4 className="font-bold text-sm text-[#2563eb] tracking-tight">
                                                            Next Week's Priorities
                                                        </h4>
                                                    </div>
                                                    <div className="p-4 space-y-5">
                                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                                                            (day) => {
                                                                const dayTasks = getTasksForDay(day);
                                                                if (dayTasks.length === 0) return null;
                                                                const style = dayStyles[day];

                                                                return (
                                                                    <div key={day} className="space-y-3">
                                                                        <div
                                                                            className={cn(
                                                                                "px-4 py-1.5 rounded-[6px] text-[13px] font-bold w-full",
                                                                                style.bg,
                                                                                style.text
                                                                            )}
                                                                        >
                                                                            {day}
                                                                        </div>
                                                                        <div className="pl-1 space-y-2">
                                                                            {dayTasks.map(
                                                                                (t: any, i: number) => (
                                                                                    <div
                                                                                        key={i}
                                                                                        className="flex items-start gap-3 text-[14px] text-slate-700 font-medium leading-relaxed"
                                                                                    >
                                                                                        <div
                                                                                            className={cn(
                                                                                                "h-2 w-2 rounded-full mt-2 shrink-0",
                                                                                                style.dot
                                                                                            )}
                                                                                        />
                                                                                        <span>
                                                                                            {typeof t === "string"
                                                                                                ? t
                                                                                                : t.text || t.title}
                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                        {Object.values(
                                                            Array.isArray(reportData.upcoming_week_plan)
                                                                ? reportData.upcoming_week_plan[0] || {}
                                                                : reportData.upcoming_week_plan || {}
                                                        ).flat().length === 0 && (
                                                                <div className="py-6 text-center">
                                                                    <p className="text-sm text-neutral-400 italic">
                                                                        No priorities recorded for next week
                                                                    </p>
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tasks & Issues */}
                                            <div className="mt-6 space-y-4">
                                                <div className="flex items-center gap-2 text-orange-600">
                                                    <AlertTriangle className="h-5 w-5" />
                                                    <h4 className="font-bold text-sm">Tasks & Issues</h4>
                                                </div>
                                                {reportData.tasks_issues?.length > 0 ? (
                                                    reportData.tasks_issues.map((ti: any, i: number) => (
                                                        <div
                                                            key={i}
                                                            className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex items-center justify-between text-xs"
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

                                            {/* Remarks History */}
                                            <div className="mt-6 pt-6 border-t border-neutral-100 space-y-4">
                                                {Object.entries(groupedRemarks).map(([type, items]) => {
                                                    if (!items || items.length === 0) return null;

                                                    const isBreakdown = type === "breakdown";
                                                    const isBreakthrough = type === "breakthrough";
                                                    const isEmployeeFeedback = type === "employeeFeedback";
                                                    const isClientFeedback = type === "clientFeedback";
                                                    const isOther = type === "remark";

                                                    const label = REMARK_CHIP_META[type as RemarkChipId]?.label || type;

                                                    let icon = <MessageSquare className="h-4 w-4" />;
                                                    let textColor = "text-neutral-500";
                                                    let iconColor = "text-neutral-500";

                                                    if (isBreakthrough) {
                                                        icon = <TrendingUp className="h-4 w-4" />;
                                                        textColor = "text-emerald-600";
                                                        iconColor = "text-emerald-500";
                                                    } else if (isBreakdown) {
                                                        icon = <TrendingDown className="h-4 w-4" />;
                                                        textColor = "text-red-600";
                                                        iconColor = "text-red-500";
                                                    } else if (isEmployeeFeedback) {
                                                        icon = <Users className="h-4 w-4" />;
                                                        textColor = "text-indigo-600";
                                                        iconColor = "text-indigo-500";
                                                    } else if (isClientFeedback) {
                                                        icon = <Smile className="h-4 w-4" />;
                                                        textColor = "text-blue-600";
                                                        iconColor = "text-blue-500";
                                                    }

                                                    return (
                                                        <div key={type} className="space-y-2">
                                                            <div className={cn("flex items-center gap-2", textColor)}>
                                                                <div className={iconColor}>{icon}</div>
                                                                <h4 className="text-sm font-bold">{label}</h4>
                                                            </div>
                                                            <ul className="space-y-1 pl-6">
                                                                {items.map((text, i) => (
                                                                    <li key={i} className="text-sm text-neutral-700 list-disc">
                                                                        {isOther && (
                                                                            <span className="font-bold uppercase text-[10px] text-neutral-500 mr-2">
                                                                                REMARK:
                                                                            </span>
                                                                        )}
                                                                        {text}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    );
                                                })}

                                                {Object.keys(groupedRemarks).length === 0 && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-neutral-500">
                                                            <MessageSquare className="h-4 w-4" />
                                                            <h4 className="text-sm font-bold">Other Comments</h4>
                                                        </div>
                                                        <p className="text-sm text-neutral-400 italic pl-6">
                                                            No overall comments
                                                        </p>
                                                    </div>
                                                )}
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
                                <h3 className="text-base font-bold text-neutral-900">
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

            <MuiDialog open={openTaskModal} onClose={() => setOpenTaskModal(false)} TransitionComponent={Transition} maxWidth={false}>
                <MuiDialogContent className="w-1/2 fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto" style={{ margin: 0, maxHeight: "100vh", display: "flex", flexDirection: "column" }} sx={{ padding: "0 !important" }}>
                    <div className="sticky top-0 bg-white z-10">
                        <h3 className="text-[14px] font-medium text-center mt-8">Add Tasks</h3>
                        <X className="absolute top-[26px] right-8 cursor-pointer w-4 h-4" onClick={() => setOpenTaskModal(false)} />
                        <hr className="border border-[#E95420] mt-4" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <ProjectTaskCreateModal isEdit={false} onCloseModal={() => setOpenTaskModal(false)} />
                    </div>
                </MuiDialogContent>
            </MuiDialog>

            <AddIssueModal openDialog={openIssueModal} handleCloseDialog={() => setOpenIssueModal(false)} />

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
                        "&:hover": {
                            backgroundColor: "#f0f4ff",
                            transform: "translateX(4px)",
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
                        "&:hover": {
                            backgroundColor: "#fef2f2",
                            transform: "translateX(4px)",
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

            <MuiDialog
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
                                className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 h-9 rounded-[8px] flex items-center gap-2 text-xs shadow-md transition-all border-none disabled:opacity-50"
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
                            className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-[8px] flex items-center justify-center gap-2 shadow-md border-none disabled:opacity-50"
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
            </MuiDialog>
        </div>
    );
};

export default WeeklyReports;
