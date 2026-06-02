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
    ChevronRight,
    BarChart3,
    Edit,
    AlertCircle,
    Eye,
    CheckCircle2,
    Clock,
    Loader2,
    FileText,
    Pencil,
    ListTodo,
    Play,
    Pause,
} from "lucide-react";
import {
    addDays,
    endOfWeek,
    format,
    getISOWeek,
    startOfWeek,
    subDays,
} from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { AddTaskOrIssueDialog } from "@/components/BusinessCompass/AddTaskOrIssueDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import { ENDPOINTS } from "@/config/apiConfig";
import { getUser } from "@/utils/auth";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
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
import ProjectTaskEditModal from "@/components/ProjectTaskEditModal";
import AddIssueModal from "@/components/AddIssueModal";
import EditIssueModal from "@/components/EditIssueModal";
import TodoDetailsModal from "@/components/TodoDetailsModal";
import AddToDoModal from "@/components/AddToDoModal";
import { TransitionProps } from "@mui/material/transitions";
import { useNavigate } from "react-router-dom";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";

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

interface WeeklyReportDraft {
    wins?: string[];
    checkedWins?: Record<number, boolean>;
    starredWins?: Record<number, boolean>;
    dayPlans?: Record<string, { id: string; text: string; starred?: boolean; source_id?: any; source_type?: string }[]>;
    remarksText?: string;
    remarksList?: { type: RemarkChipId | null; text: string }[];
    activeRemarkChip?: RemarkChipId | null;
    remarksInteracted?: boolean;
    kpiEntries?: { [key: number]: string };
    plannedEntries?: { [key: number]: string };
    selectedTasksIssues?: { [key: string]: boolean };
    selectedFileNames?: string[];
    uploadedFilesCount?: number;
}

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

const SOP_STATUS_OPTIONS = ["To Start", "Broken", "Running"] as const;

const normalizeSopStatus = (status: any) =>
    String(status || "")
        .toLowerCase()
        .replace(/\s+/g, "_");

const getSopStatusValue = (status: any) => {
    const normalizedStatus = normalizeSopStatus(status);
    if (normalizedStatus === "running") return "Running";
    if (normalizedStatus === "broken") return "Broken";
    return "To Start";
};

const formatSopValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "Not available";
    return String(value);
};

const formatSopDate = (value: any) => {
    if (!value) return "Not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";
    return format(date, "dd MMM yyyy, hh:mm a");
};

const roundScore = (score: number) => Number(score.toFixed(2));

const fmtDate = (d?: string) => {
    if (!d) return null;
    const dt = new Date(d);
    return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
};
const fmtHours = (h?: number) => {
    if (!h) return null;
    if (h < 1) return `${Math.round(h * 60)}m`;
    const wh = Math.floor(h); const m = Math.round((h - wh) * 60);
    return m > 0 ? `${wh}h ${m}m` : `${wh}h`;
};
const getOverdueLabel = (targetDate?: string) => {
    if (!targetDate) return null;
    const now = new Date(); const end = new Date(targetDate); end.setHours(23, 59, 59, 999);
    const diff = end.getTime() - now.getTime();
    if (diff > 0) return null;
    const abs = Math.abs(diff);
    const d = Math.floor(abs / 86400000); const h = Math.floor((abs % 86400000) / 3600000); const m = Math.floor((abs % 3600000) / 60000);
    if (d > 0) return `${d}d ${h}h overdue`;
    if (h > 0) return `${h}h ${m}m overdue`;
    return `${m}m overdue`;
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
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
    const [planWeekOpenItemId, setPlanWeekOpenItemId] = useState<string | null>(null);
    const [nextWeekScheduledItems, setNextWeekScheduledItems] = useState<any[]>([]);
    const [nextWeekScheduledLoading, setNextWeekScheduledLoading] = useState(false);
    const [starredCompletedItems, setStarredCompletedItems] = useState<Record<string, boolean>>({});
    const [showClosureModal, setShowClosureModal] = useState(false);
    const [closureItem, setClosureItem] = useState<any>(null);
    const [closureRemarks, setClosureRemarks] = useState("");
    const [closureAttachments, setClosureAttachments] = useState<any[]>([]);
    const [isClosureSubmitting, setIsClosureSubmitting] = useState(false);
    const [completingTaskIssueIds, setCompletingTaskIssueIds] = useState<
        Record<string, boolean>
    >({});
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
    const [pauseTaskId, setPauseTaskId] = useState<number | null>(null);
    const [isPauseLoading, setIsPauseLoading] = useState(false);
    const [updatingPlayPauseIds, setUpdatingPlayPauseIds] = useState<
        Record<string, boolean>
    >({});
    const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);
    const [overdueItem, setOverdueItem] = useState<any>(null);
    const [overdueReason, setOverdueReason] = useState("");
    const [isOverdueLoading, setIsOverdueLoading] = useState(false);
    const [pendingConfirmAction, setPendingConfirmAction] = useState<{ fn: () => void; label: string } | null>(null);
    const [currentTasksPage, setCurrentTasksPage] = useState(1);
    const [currentIssuesPage, setCurrentIssuesPage] = useState(1);
    const [hasMoreTasks, setHasMoreTasks] = useState(true);
    const [hasMoreIssues, setHasMoreIssues] = useState(true);
    const [tasksData, setTasksData] = useState<any>(null);
    const [issuesData, setIssuesData] = useState<any>(null);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [issuesLoading, setIssuesLoading] = useState(false);
    const [todosData, setTodosData] = useState<any[]>([]);
    const [todosLoading, setTodosLoading] = useState(false);
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
        Record<string, { id: string; text: string; starred?: boolean; source_id?: any; source_type?: string; originalData?: any }[]>
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
    const [openTodoModal, setOpenTodoModal] = useState(false);
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [editTaskData, setEditTaskData] = useState<any>(null);
    const [isEditIssueModalOpen, setIsEditIssueModalOpen] = useState(false);
    const [editIssueData, setEditIssueData] = useState<any>(null);
    const [isEditTodoModalOpen, setIsEditTodoModalOpen] = useState(false);
    const [editTodoData, setEditTodoData] = useState<any>(null);
    const [isTodoDetailsModalOpen, setIsTodoDetailsModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<any>(null);
    const [taskIssueMenuAnchor, setTaskIssueMenuAnchor] =
        useState<null | HTMLElement>(null);
    const [dayPlanMenuAnchor, setDayPlanMenuAnchor] = useState<{ el: HTMLElement; dayKey: string; date: string } | null>(null);
    const [planPreFillDate, setPlanPreFillDate] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = React.useState(false);
    const [history, setHistory] = React.useState<any[]>([]);
    const [editingId, setEditingId] = React.useState<number | null>(null);
    const [uploadedFilesCount, setUploadedFilesCount] = React.useState(0);
    const [selectedFileNames, setSelectedFileNames] = React.useState<string[]>(
        []
    );
    const [selectedWeekOffset, setSelectedWeekOffset] = React.useState(0);
    const [systemSops, setSystemSops] = React.useState<any[]>([]);
    const [isLoadingSops, setIsLoadingSops] = React.useState(false);
    const [sopsError, setSopsError] = React.useState<string | null>(null);
    const [tasksIssuesRefreshKey, setTasksIssuesRefreshKey] = React.useState(0);
    const [updatingSopStatus, setUpdatingSopStatus] = React.useState<
        Record<number, boolean>
    >({});
    const [updatingSopHealth, setUpdatingSopHealth] = React.useState<
        Record<number, boolean>
    >({});
    const [selectedSopId, setSelectedSopId] = React.useState<number | null>(null);
    const refDate = React.useMemo(() => new Date(), []);

    useEffect(() => {
        if (!taskIssueMenuAnchor) return;

        const closeTaskIssueMenuOnScroll = () => {
            setTaskIssueMenuAnchor(null);
        };
        const listenerOptions = { capture: true, passive: true } as AddEventListenerOptions;

        window.addEventListener("scroll", closeTaskIssueMenuOnScroll, listenerOptions);
        document.addEventListener("scroll", closeTaskIssueMenuOnScroll, listenerOptions);
        window.addEventListener("wheel", closeTaskIssueMenuOnScroll, listenerOptions);
        document.addEventListener("wheel", closeTaskIssueMenuOnScroll, listenerOptions);
        window.addEventListener("touchmove", closeTaskIssueMenuOnScroll, listenerOptions);
        document.addEventListener("touchmove", closeTaskIssueMenuOnScroll, listenerOptions);
        return () => {
            window.removeEventListener("scroll", closeTaskIssueMenuOnScroll, listenerOptions);
            document.removeEventListener("scroll", closeTaskIssueMenuOnScroll, listenerOptions);
            window.removeEventListener("wheel", closeTaskIssueMenuOnScroll, listenerOptions);
            document.removeEventListener("wheel", closeTaskIssueMenuOnScroll, listenerOptions);
            window.removeEventListener("touchmove", closeTaskIssueMenuOnScroll, listenerOptions);
            document.removeEventListener("touchmove", closeTaskIssueMenuOnScroll, listenerOptions);
        };
    }, [taskIssueMenuAnchor]);

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

    const selectedSop = React.useMemo(
        () => systemSops.find((sop) => sop.id === selectedSopId) || null,
        [selectedSopId, systemSops]
    );

    const user =
        typeof localStorage !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : {};
    const userId =
        localStorage.getItem("userId") || localStorage.getItem("user_id") || user?.id;
    const normalizedBaseUrl = React.useMemo(() => {
        const raw = String(baseUrl || "").trim().replace(/\/+$/, "");
        if (!raw) return "";
        return raw.startsWith("http://") || raw.startsWith("https://")
            ? raw
            : `https://${raw}`;
    }, [baseUrl]);
    const weekDraftKey = React.useMemo(
        () =>
            `business-compass-weekly-report-draft:${userId || "guest"}:${format(weekStart, "yyyy-MM-dd")}`,
        [userId, weekStart]
    );
    const canPersistDraftRef = React.useRef(false);
    const suppressDraftPersistenceRef = React.useRef(false);

    const getStoredDraft = React.useCallback(
        (key = weekDraftKey): WeeklyReportDraft | null => {
            try {
                const rawDraft = localStorage.getItem(key);
                return rawDraft ? JSON.parse(rawDraft) : null;
            } catch {
                return null;
            }
        },
        [weekDraftKey]
    );

    const clearStoredDraft = React.useCallback(
        (key = weekDraftKey) => {
            localStorage.removeItem(key);
        },
        [weekDraftKey]
    );

    const applyStoredDraft = React.useCallback((draft: WeeklyReportDraft | null) => {
        if (!draft) return;
        if (Array.isArray(draft.wins)) setWins(draft.wins);
        if (draft.checkedWins && typeof draft.checkedWins === "object")
            setCheckedWins(draft.checkedWins);
        if (draft.starredWins && typeof draft.starredWins === "object")
            setStarredWins(draft.starredWins);
        if (draft.dayPlans && typeof draft.dayPlans === "object")
            setDayPlans(draft.dayPlans);
        if (typeof draft.remarksText === "string")
            setRemarksText(draft.remarksText);
        if (Array.isArray(draft.remarksList))
            setRemarksList(draft.remarksList);
        if (
            draft.activeRemarkChip === null ||
            typeof draft.activeRemarkChip === "string"
        ) {
            setActiveRemarkChip(draft.activeRemarkChip);
        }
        if (typeof draft.remarksInteracted === "boolean")
            setRemarksInteracted(draft.remarksInteracted);
        if (draft.kpiEntries && typeof draft.kpiEntries === "object")
            setKpiEntries(draft.kpiEntries);
        if (draft.plannedEntries && typeof draft.plannedEntries === "object")
            setPlannedEntries(draft.plannedEntries);
        if (
            draft.selectedTasksIssues &&
            typeof draft.selectedTasksIssues === "object"
        ) {
            setSelectedTasksIssues(draft.selectedTasksIssues);
        }
        if (Array.isArray(draft.selectedFileNames))
            setSelectedFileNames(draft.selectedFileNames);
        if (typeof draft.uploadedFilesCount === "number")
            setUploadedFilesCount(draft.uploadedFilesCount);
    }, []);

    useEffect(() => {
        setCurrentTasksPage(1);
        setCurrentIssuesPage(1);
        setMergedTasksIssues([]);
        setTodosData([]);
    }, [weekEnd, userId]);

    useEffect(() => {
        const fetchWeeklyTasks = async () => {
            if (!normalizedBaseUrl) {
                setTasksData(null);
                return;
            }

            setTasksLoading(true);
            try {
                const params = new URLSearchParams();
                params.append("page", String(currentTasksPage));
                const year = new Date(weekStart).getFullYear();
                const weekNum = String(getISOWeek(weekStart)).padStart(2, "0");
                params.append("for_week", `${year}-W${weekNum}`);

                const response = await fetch(
                    `${normalizedBaseUrl}/task_managements/my_tasks.json?${params.toString()}`,
                    {
                        headers: {
                            Accept: "application/json",
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Tasks API failed with ${response.status}`);
                }

                setTasksData(await response.json());
            } catch (error) {
                console.error("Failed to fetch weekly tasks:", error);
                setTasksData(null);
            } finally {
                setTasksLoading(false);
            }
        };

        fetchWeeklyTasks();
    }, [normalizedBaseUrl, token, weekEnd, weekStart, currentTasksPage, tasksIssuesRefreshKey]);

    useEffect(() => {
        const fetchWeeklyIssues = async () => {
            if (!normalizedBaseUrl || !userId) {
                setIssuesData(null);
                return;
            }

            setIssuesLoading(true);
            try {
                const params = new URLSearchParams();
                params.append("page", String(currentIssuesPage));
                const year = new Date(weekStart).getFullYear();
                const weekNum = String(getISOWeek(weekStart)).padStart(2, "0");
                params.append("for_week", `${year}-W${weekNum}`);
                params.append("q[responsible_person_id_eq]", String(userId));

                const response = await fetch(
                    `${normalizedBaseUrl}/issues.json?${params.toString()}`,
                    {
                        headers: {
                            Accept: "application/json",
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Issues API failed with ${response.status}`);
                }

                setIssuesData(await response.json());
            } catch (error) {
                console.error("Failed to fetch weekly issues:", error);
                setIssuesData(null);
            } finally {
                setIssuesLoading(false);
            }
        };

        fetchWeeklyIssues();
    }, [normalizedBaseUrl, token, userId, weekEnd, weekStart, currentIssuesPage, tasksIssuesRefreshKey]);

    useEffect(() => {
        const fetchTodos = async () => {
            if (!normalizedBaseUrl || !userId) {
                setTodosData([]);
                return;
            }

            setTodosLoading(true);
            try {
                const params = new URLSearchParams();
                params.append("q[user_id_eq]", String(userId));
                const year = new Date(weekStart).getFullYear();
                const weekNum = String(getISOWeek(weekStart)).padStart(2, "0");
                params.append("for_week", `${year}-W${weekNum}`);

                const response = await fetch(
                    `${normalizedBaseUrl}/todos.json?${params.toString()}`,
                    {
                        headers: {
                            Accept: "application/json",
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Todos API failed with ${response.status}`);
                }

                const json = await response.json();
                const todos =
                    (Array.isArray(json) && json) ||
                    json?.todos ||
                    json?.data?.todos ||
                    json?.data ||
                    [];

                setTodosData(Array.isArray(todos) ? todos : []);
            } catch (error) {
                console.error("Failed to fetch weekly todos:", error);
                setTodosData([]);
            } finally {
                setTodosLoading(false);
            }
        };

        fetchTodos();
    }, [normalizedBaseUrl, token, userId, weekEnd, tasksIssuesRefreshKey]);

    useEffect(() => {
        const fetchNextWeekItems = async () => {
            if (!normalizedBaseUrl || !userId) return;
            setNextWeekScheduledLoading(true);
            try {
                const nextWeekStart = addDays(weekEnd, 1);
                const nextWeekYear = nextWeekStart.getFullYear();
                const nextWeekNum = String(getISOWeek(nextWeekStart)).padStart(2, "0");
                const forWeek = `${nextWeekYear}-W${nextWeekNum}`;
                const headers: Record<string, string> = {
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                };

                const [tasksRes, issuesRes, todosRes] = await Promise.allSettled([
                    fetch(`${normalizedBaseUrl}/task_managements/my_tasks.json?for_week=${forWeek}`, { headers }),
                    fetch(`${normalizedBaseUrl}/issues.json?for_week=${forWeek}&q[responsible_person_id_eq]=${userId}`, { headers }),
                    fetch(`${normalizedBaseUrl}/todos.json?for_week=${forWeek}&q[user_id_eq]=${userId}`, { headers }),
                ]);

                const rawTasks = tasksRes.status === "fulfilled" && tasksRes.value.ok
                    ? await tasksRes.value.json() : null;
                const rawIssues = issuesRes.status === "fulfilled" && issuesRes.value.ok
                    ? await issuesRes.value.json() : null;
                const rawTodos = todosRes.status === "fulfilled" && todosRes.value.ok
                    ? await todosRes.value.json() : null;

                const tasks: any[] = rawTasks?.data?.task_managements || rawTasks?.task_managements || (Array.isArray(rawTasks) ? rawTasks : []);
                const issues: any[] = rawIssues?.issues || rawIssues?.data?.issues || (Array.isArray(rawIssues) ? rawIssues : []);
                const todos: any[] = rawTodos?.todos || rawTodos?.data?.todos || rawTodos?.data || (Array.isArray(rawTodos) ? rawTodos : []);

                const completedStatuses = ["completed", "closed", "done"];
                const combined = [
                    ...tasks
                        .filter((t: any) => !completedStatuses.includes(String(t.status || "").toLowerCase()))
                        .map((t: any) => ({
                            id: `nw-task-${t.id}`,
                            title: t.title || t.name || "Untitled Task",
                            type: "task",
                            date: t.target_date || t.due_date || t.end_date || null,
                            priority: t.priority || null,
                            originalData: t,
                        })),
                    ...issues
                        .filter((i: any) => !completedStatuses.includes(String(i.status || "").toLowerCase()))
                        .map((i: any) => ({
                            id: `nw-issue-${i.id}`,
                            title: i.title || i.name || "Untitled Issue",
                            type: "issue",
                            date: i.target_date || i.due_date || i.end_date || null,
                            priority: i.priority || null,
                            originalData: i,
                        })),
                    ...todos
                        .filter((td: any) => !completedStatuses.includes(String(td.status || "").toLowerCase()))
                        .map((td: any) => ({
                            id: `nw-todo-${td.id}`,
                            title: td.title || td.name || td.description || "Untitled Todo",
                            type: "todo",
                            date: td.target_date || td.due_date || td.end_date || null,
                            priority: td.priority || null,
                            originalData: td,
                        })),
                ];

                setNextWeekScheduledItems(combined);
            } catch (err) {
                console.error("Failed to fetch next week items:", err);
                setNextWeekScheduledItems([]);
            } finally {
                setNextWeekScheduledLoading(false);
            }
        };

        fetchNextWeekItems();
    }, [normalizedBaseUrl, token, userId, weekEnd]);

    useEffect(() => {
        const tasks =
            tasksData?.data?.task_managements ||
            tasksData?.task_managements ||
            tasksData?.tasks ||
            (Array.isArray(tasksData?.data) ? tasksData.data : []) ||
            (Array.isArray(tasksData) ? tasksData : []);
        const issues =
            issuesData?.issues ||
            issuesData?.data?.issues ||
            (Array.isArray(issuesData?.data) ? issuesData.data : []) ||
            (Array.isArray(issuesData) ? issuesData : []);

        const tasksPagination =
            tasksData?.data?.pagination || tasksData?.pagination;
        const issuesPagination = issuesData?.pagination;

        setHasMoreTasks(currentTasksPage < (tasksPagination?.total_pages || 1));
        setHasMoreIssues(currentIssuesPage < (issuesPagination?.total_pages || 1));

        const transformedTasks = tasks.map((task: any) => ({
            id: `task-${task.id}`,
            title: task.title || task.name || task.heading || "Untitled Task",
            type: "task",
            status: String(task.status || "open").toLowerCase().replace(/\s+/g, "_"),
            priority: task.priority || "Medium",
            created_at: task.created_at,
            responsible: task.responsible_person_id,
            originalData: task,
        }));

        const transformedIssues = issues.map((issue: any) => ({
            id: `issue-${issue.id}`,
            title: issue.title || issue.name || issue.heading || "Untitled Issue",
            type: "issue",
            status: String(issue.status || "open").toLowerCase().replace(/\s+/g, "_"),
            priority: issue.priority || "Medium",
            created_at: issue.created_at,
            responsible: issue.responsible_person_id,
            originalData: issue,
        }));

        const transformedTodos = todosData.map((todo: any) => ({
            id: `todo-${todo.id}`,
            title:
                todo.title ||
                todo.name ||
                todo.heading ||
                todo.description ||
                todo.body ||
                "Untitled Todo",
            type: "todo",
            status: String(todo.status || "open").toLowerCase().replace(/\s+/g, "_"),
            priority: todo.priority || "Medium",
            created_at: todo.created_at || todo.target_date,
            responsible: todo.user_id,
            originalData: todo,
        }));

        const newData = [...transformedTasks, ...transformedIssues, ...transformedTodos].sort(
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
    }, [tasksData, issuesData, todosData, currentTasksPage, currentIssuesPage]);

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

            if (isNearBottom && !isLoadingMore && !tasksLoading && !issuesLoading && !todosLoading) {
                setIsLoadingMore(true);
                if (hasMoreTasks) setCurrentTasksPage((prev) => prev + 1);
                if (hasMoreIssues) setCurrentIssuesPage((prev) => prev + 1);
                if (!hasMoreTasks && !hasMoreIssues) setIsLoadingMore(false);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [isLoadingMore, tasksLoading, issuesLoading, todosLoading, hasMoreTasks, hasMoreIssues]);

    const taskIssueCounts = useMemo(() => {
        const completed = mergedTasksIssues.filter(
            (item) => item.status === "completed" || item.status === "closed"
        ).length;
        const open = mergedTasksIssues.filter(
            (item) => item.status === "open" || item.status === "reopen"
        ).length;
        const overdue = mergedTasksIssues.filter(
            (item) => item.status === "overdue" || item.status === "overdued"
        ).length;
        const onHold = mergedTasksIssues.filter(
            (item) => item.status === "on_hold"
        ).length;
        const inProgress = mergedTasksIssues.filter(
            (item) => item.status === "in_progress"
        ).length;
        const tasks = mergedTasksIssues.filter((item) => item.type === "task").length;
        const issues = mergedTasksIssues.filter((item) => item.type === "issue").length;
        const todos = mergedTasksIssues.filter((item) => item.type === "todo").length;

        return {
            completed,
            open,
            overdue,
            onHold,
            inProgress,
            tasks,
            issues,
            todos,
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

    const sopMetrics = React.useMemo(() => {
        const total = systemSops.length;
        const healthValues = systemSops
            .map((sop) => Number(sop.health_score ?? sop.healthPercent ?? sop.health ?? 0))
            .filter((value) => Number.isFinite(value));
        const averageHealth =
            healthValues.length > 0
                ? healthValues.reduce((sum, value) => sum + value, 0) / healthValues.length
                : 0;
        const totalHealth = healthValues.reduce((sum, value) => sum + value, 0);
        const healthScore = Math.min((totalHealth / 100) * 10, 10);
        const runningCount = systemSops.filter(
            (sop) => String(sop.status || "").toLowerCase() === "running"
        ).length;
        const runningRatio = total > 0 ? runningCount / total : 0;
        const totalStatusScore = systemSops.reduce((score, sop) => {
            const normalizedStatus = normalizeSopStatus(sop.status);

            if (normalizedStatus === "running") return score + 5;
            if (normalizedStatus === "broken") return score - 5;
            if (normalizedStatus === "to_start") return score - 2;

            return score;
        }, 0);
        const statusScore = Math.min(Math.max(totalStatusScore, 0), 10);
        const status =
            total === 0
                ? "No SOPs"
                : runningCount === total
                    ? "Running"
                    : runningCount > 0
                        ? "Partially Running"
                        : "Needs Attention";

        return {
            total,
            averageHealth: Math.round(averageHealth),
            healthScore: roundScore(healthScore),
            runningCount,
            runningRatio,
            statusScore: roundScore(statusScore),
            status,
        };
    }, [systemSops]);

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
            (item) => item.status === "overdue" || item.status === "overdued"
        ).length;

        const taskPositive = closedTasks * 2;
        const taskOpenPenalty = Math.max(openTasks * -0.5, -3);
        const taskOverduePenalty = Math.max(overdueTasks * -2, -5);
        const tasksScore = Math.min(
            Math.max(taskPositive + taskOpenPenalty + taskOverduePenalty, 0),
            10
        );

        // 5. SOPs Health & Status (Max 20 points)
        let sopScore = sopMetrics.healthScore + sopMetrics.statusScore;
        sopScore = Math.min(Math.max(sopScore, 0), 20);
        sopScore = roundScore(sopScore);

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
    }, [kpis, kpiEntries, dailyKpiSummary, starredWins, mergedTasksIssues, sopMetrics, dayPlans, remarksList]);

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

    const isDateOverdue = (dateStr: string | undefined) => {
        if (!dateStr) return false;
        const itemDate = new Date(dateStr);
        const today = new Date();
        if (Number.isNaN(itemDate.getTime())) return false;
        itemDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return itemDate < today;
    };

    const completeTaskIssueTodo = async (item: any, reason?: string) => {
        if (!item || !normalizedBaseUrl) return false;

        const realId = String(item.id || "")
            .replace("task-", "")
            .replace("issue-", "")
            .replace("todo-", "");
        const previousStatus = item.status;

        setCompletingTaskIssueIds((prev) => ({ ...prev, [item.id]: true }));
        setMergedTasksIssues((prev) =>
            prev.map((existing) =>
                existing.id === item.id ? { ...existing, status: "completed" } : existing
            )
        );
        setSelectedTasksIssues((prev) => ({ ...prev, [item.id]: true }));

        try {
            const headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            if (item.type === "task") {
                await axios.put(
                    `${normalizedBaseUrl}/task_managements/${realId}.json`,
                    { task_management: { status: "completed" } },
                    { headers }
                );
            } else if (item.type === "issue") {
                await axios.put(
                    `${normalizedBaseUrl}/issues/${realId}.json`,
                    { issue: { status: "completed" } },
                    { headers }
                );
            } else {
                await axios.put(
                    `${normalizedBaseUrl}/todos/${realId}.json`,
                    { todo: { status: "completed" } },
                    { headers }
                );
            }

            if (reason?.trim()) {
                await axios.post(
                    `${normalizedBaseUrl}/comments.json`,
                    {
                        comment: {
                            body: `Overdue reason: ${reason}`,
                            commentable_id: realId,
                            commentable_type:
                                item.type === "task"
                                    ? "TaskManagement"
                                    : item.type === "todo"
                                        ? "Todo"
                                        : "Issue",
                            commentor_id: JSON.parse(localStorage.getItem("user") || "{}")?.id,
                            active: true,
                        },
                    },
                    { headers }
                );
            }

            toast.success(
                `${String(item.type).charAt(0).toUpperCase() + String(item.type).slice(1)} ${reason?.trim() ? "completed with overdue reason" : "completed successfully"}`
            );
            setTasksIssuesRefreshKey((key) => key + 1);
            return true;
        } catch (error) {
            console.error("Error completing weekly task/issue/todo:", error);
            toast.error(`Failed to complete ${item.type}`);
            setMergedTasksIssues((prev) =>
                prev.map((existing) =>
                    existing.id === item.id
                        ? { ...existing, status: previousStatus }
                        : existing
                )
            );
            setSelectedTasksIssues((prev) => ({
                ...prev,
                [item.id]: previousStatus === "completed" || previousStatus === "closed",
            }));
        } finally {
            setCompletingTaskIssueIds((prev) => {
                const next = { ...prev };
                delete next[item.id];
                return next;
            });
        }
        return false;
    };

    const reopenTaskIssueTodo = async (item: any) => {
        if (!item || !normalizedBaseUrl) return;

        const realId = String(item.id || "")
            .replace("task-", "")
            .replace("issue-", "")
            .replace("todo-", "");

        setMergedTasksIssues((prev) =>
            prev.map((existing) =>
                existing.id === item.id ? { ...existing, status: "open" } : existing
            )
        );
        setSelectedTasksIssues((prev) => ({ ...prev, [item.id]: false }));

        try {
            const headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            if (item.type === "task") {
                await axios.put(
                    `${normalizedBaseUrl}/task_managements/${realId}.json`,
                    { task_management: { status: "open" } },
                    { headers }
                );
            } else if (item.type === "issue") {
                await axios.put(
                    `${normalizedBaseUrl}/issues/${realId}.json`,
                    { issue: { status: "open" } },
                    { headers }
                );
            } else {
                await axios.put(
                    `${normalizedBaseUrl}/todos/${realId}.json`,
                    { todo: { status: "open" } },
                    { headers }
                );
            }

            toast.success(`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} reopened successfully`);
        } catch (error) {
            console.error("Error reopening item:", error);
            toast.error(`Failed to reopen ${item.type}`);
            // Revert UI on failure
            setMergedTasksIssues((prev) =>
                prev.map((existing) =>
                    existing.id === item.id ? { ...existing, status: item.status } : existing
                )
            );
            setSelectedTasksIssues((prev) => ({ ...prev, [item.id]: true }));
        }
    };

    const handleCompleteTaskIssueTodo = async (item: any) => {
        const targetDate =
            item?.originalData?.target_date ||
            item?.originalData?.due_date ||
            item?.originalData?.end_date;
        const isOverdueItem =
            item?.status === "overdue" ||
            item?.status === "overdued" ||
            isDateOverdue(targetDate);

        if (isOverdueItem) {
            setOverdueItem(item);
            setOverdueReason("");
            setIsOverdueModalOpen(true);
            return;
        }

        await completeTaskIssueTodo(item);
    };

    const handleOverdueReasonSubmit = async () => {
        if (!overdueItem || !overdueReason.trim()) return;

        setIsOverdueLoading(true);
        try {
            const completed = await completeTaskIssueTodo(overdueItem, overdueReason.trim());
            if (completed) {
                setIsOverdueModalOpen(false);
                setOverdueItem(null);
                setOverdueReason("");
            }
        } finally {
            setIsOverdueLoading(false);
        }
    };

    const handlePlayTask = async (item: any) => {
        if (!item || item.type !== "task" || !normalizedBaseUrl) return;

        const realId = Number(
            String(item.id || "").replace("task-", "").replace("issue-", "")
        );
        if (!realId) return;

        setUpdatingPlayPauseIds((prev) => ({ ...prev, [item.id]: true }));
        try {
            await axios.put(
                `${normalizedBaseUrl}/task_managements/${realId}/update_status.json`,
                { status: "started" },
                {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );

            setMergedTasksIssues((prev) =>
                prev.map((existing) =>
                    existing.id === item.id
                        ? {
                            ...existing,
                            originalData: {
                                ...existing.originalData,
                                is_started: true,
                            },
                        }
                        : existing
                )
            );
            toast.success(
                "Task started successfully"
            );
            setTasksIssuesRefreshKey((key) => key + 1);
        } catch (error) {
            console.error("Failed to start task:", error);
            toast.error("Failed to start task");
        } finally {
            setUpdatingPlayPauseIds((prev) => {
                const next = { ...prev };
                delete next[item.id];
                return next;
            });
        }
    };

    const handlePauseTaskSubmit = async (reason: string, taskId: number | null) => {
        if (!taskId || !normalizedBaseUrl) return;

        const itemKey = `task-${taskId}`;

        setIsPauseLoading(true);
        setUpdatingPlayPauseIds((prev) => ({ ...prev, [itemKey]: true }));
        try {
            await axios.put(
                `${normalizedBaseUrl}/task_managements/${taskId}/update_status.json`,
                { status: "stopped" },
                {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );

            await axios.post(
                `${normalizedBaseUrl}/comments.json`,
                {
                    comment: {
                        body: `Paused with reason: ${reason}`,
                        commentable_id: taskId,
                        commentable_type: "TaskManagement",
                        commentor_id: JSON.parse(localStorage.getItem("user") || "{}")?.id,
                        active: true,
                    },
                },
                {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );

            setMergedTasksIssues((prev) =>
                prev.map((existing) =>
                    existing.id === itemKey
                        ? {
                            ...existing,
                            originalData: {
                                ...existing.originalData,
                                is_started: false,
                            },
                        }
                        : existing
                )
            );
            toast.success(
                "Task paused successfully"
            );
            setIsPauseModalOpen(false);
            setPauseTaskId(null);
            setTasksIssuesRefreshKey((key) => key + 1);
        } catch (error: any) {
            console.error("Failed to pause task:", error);
            toast.error(
                `Failed to pause task: ${error?.response?.data?.error || error?.message || "Server error"}`
            );
        } finally {
            setIsPauseLoading(false);
            setUpdatingPlayPauseIds((prev) => {
                const next = { ...prev };
                delete next[itemKey];
                return next;
            });
        }
    };

    const monthTitle = format(weekStart, "MMM yyyy");
    const weekRangeLabel = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`;
    const weekNumLabel = String(getISOWeek(weekStart));
    const submitRangeLabel = `${format(weekStart, "d MMM")} - ${format(weekEnd, "d MMM")}`;
    const currentDateValue = format(new Date(), "yyyy-MM-dd");
    const weekEndDateValue = format(weekEnd, "yyyy-MM-dd");

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

    const upcomingDays = React.useMemo(() => {
        const start = new Date(weekEnd);
        start.setDate(start.getDate() + 1);
        const labels: {
            key: string;
            short: string;
            date: string;
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
                date: format(d, "yyyy-MM-dd"),
                color: colors[i] ?? "bg-slate-50",
                canAdd,
            });
        }
        return labels;
    }, [weekEnd]);

    const nextWeekDateToKey = useMemo(() => {
        const map: Record<string, string> = {};
        const start = addDays(weekEnd, 1);
        upcomingDays.forEach((day, i) => {
            const d = addDays(start, i);
            map[format(d, "yyyy-MM-dd")] = day.key;
        });
        return map;
    }, [upcomingDays, weekEnd]);

    const nextWeekScheduledByDay = useMemo(() => {
        const grouped: Record<string, any[]> = {};
        nextWeekScheduledItems.forEach((item) => {
            const dateStr = item.date ? item.date.slice(0, 10) : null;
            const dayKey = dateStr ? nextWeekDateToKey[dateStr] : null;
            const key = dayKey ?? upcomingDays[0]?.key;
            if (!key) return;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(item);
        });
        return grouped;
    }, [nextWeekScheduledItems, nextWeekDateToKey, upcomingDays]);

    useEffect(() => {
        const fetchSystemSops = async () => {
            const assignedUserIds = new Set(
                [
                    localStorage.getItem("userId"),
                    localStorage.getItem("user_id"),
                    userId,
                ]
                    .filter((id) => id !== null && id !== undefined && String(id).trim() !== "")
                    .map((id) => String(id).trim())
            );

            if (assignedUserIds.size === 0) {
                setSystemSops([]);
                setSopsError("User id not found");
                return;
            }

            try {
                setIsLoadingSops(true);
                setSopsError(null);
                const response = await apiClient.get("/system_sops.json");
                const payload = response.data;
                const records = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.data?.system_sops)
                        ? payload.data.system_sops
                        : Array.isArray(payload?.data)
                            ? payload.data
                            : payload?.system_sops || [];
                const assignedSops = records.filter(
                    (sop: any) => assignedUserIds.has(String(sop.assignee_id).trim())
                );

                setSystemSops(assignedSops);
            } catch (error) {
                console.error("Failed to fetch SOPs:", error);
                setSystemSops([]);
                setSopsError("Failed to load SOPs");
            } finally {
                setIsLoadingSops(false);
            }
        };

        fetchSystemSops();
    }, [userId]);

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
        canPersistDraftRef.current = false;
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
            applyStoredDraft(getStoredDraft());
        } catch (error) {
            console.error("Failed to fetch weekly reports history:", error);
            applyStoredDraft(getStoredDraft());
        } finally {
            canPersistDraftRef.current = true;
            setIsLoadingHistory(false);
        }
    }, [weekStart, populateForm, getStoredDraft, applyStoredDraft]);

    React.useEffect(() => {
        canPersistDraftRef.current = false;
        suppressDraftPersistenceRef.current = false;
    }, [weekDraftKey]);

    React.useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    React.useEffect(() => {
        if (activeTab !== "submit") return;
        if (suppressDraftPersistenceRef.current) return;
        if (!canPersistDraftRef.current) return;
        const draft: WeeklyReportDraft = {
            wins,
            checkedWins,
            starredWins,
            dayPlans,
            remarksText,
            remarksList,
            activeRemarkChip,
            remarksInteracted,
            kpiEntries,
            plannedEntries,
            selectedTasksIssues,
            selectedFileNames,
            uploadedFilesCount,
        };
        localStorage.setItem(weekDraftKey, JSON.stringify(draft));
    }, [
        wins,
        checkedWins,
        starredWins,
        dayPlans,
        remarksText,
        remarksList,
        activeRemarkChip,
        remarksInteracted,
        kpiEntries,
        plannedEntries,
        selectedTasksIssues,
        selectedFileNames,
        uploadedFilesCount,
        weekDraftKey,
        activeTab,
    ]);

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

    const buildSopUpdatePayload = (sop: any, updates: Record<string, any>) => ({
        system_sop: {
            system_name: updates.system_name ?? sop.system_name ?? "",
            status: updates.status ?? getSopStatusValue(sop.status),
            priority: updates.priority ?? sop.priority ?? "",
            health_score: Number(updates.health_score ?? sop.health_score ?? 0),
            documentation_url:
                updates.documentation_url ?? sop.documentation_url ?? null,
            kpis: Array.isArray(updates.kpis)
                ? updates.kpis
                : Array.isArray(sop.kpis)
                    ? sop.kpis
                    : [],
        },
    });

    const handleSopStatusChange = async (sop: any, nextStatus: string) => {
        if (!sop?.id) return;

        setUpdatingSopStatus((prev) => ({ ...prev, [sop.id]: true }));
        try {
            const response = await apiClient.put(
                `/system_sops/${sop.id}.json`,
                buildSopUpdatePayload(sop, { status: nextStatus })
            );
            const updatedSop =
                response.data?.data?.system_sop ||
                response.data?.data ||
                response.data?.system_sop ||
                null;

            setSystemSops((prev) =>
                prev.map((item) =>
                    item.id === sop.id
                        ? {
                            ...item,
                            ...(updatedSop && typeof updatedSop === "object"
                                ? updatedSop
                                : {}),
                            status: nextStatus,
                        }
                        : item
                )
            );
            toast.success("SOP status updated");
        } catch (error) {
            console.error("Failed to update SOP status:", error);
            toast.error("Failed to update SOP status");
        } finally {
            setUpdatingSopStatus((prev) => ({ ...prev, [sop.id]: false }));
        }
    };

    const handleSopHealthPreview = (sopId: number, nextHealth: number) => {
        setSystemSops((prev) =>
            prev.map((item) =>
                item.id === sopId ? { ...item, health_score: nextHealth } : item
            )
        );
    };

    const handleSopHealthCommit = async (sop: any, nextHealth: number) => {
        if (!sop?.id) return;

        setUpdatingSopHealth((prev) => ({ ...prev, [sop.id]: true }));
        try {
            const response = await apiClient.put(
                `/system_sops/${sop.id}.json`,
                buildSopUpdatePayload(sop, { health_score: nextHealth })
            );
            const updatedSop =
                response.data?.data?.system_sop ||
                response.data?.data ||
                response.data?.system_sop ||
                null;

            setSystemSops((prev) =>
                prev.map((item) =>
                    item.id === sop.id
                        ? {
                            ...item,
                            ...(updatedSop && typeof updatedSop === "object"
                                ? updatedSop
                                : {}),
                            health_score: nextHealth,
                        }
                        : item
                )
            );
            toast.success("SOP health updated");
        } catch (error) {
            console.error("Failed to update SOP health:", error);
            toast.error("Failed to update SOP health");
        } finally {
            setUpdatingSopHealth((prev) => ({ ...prev, [sop.id]: false }));
        }
    };

    const handleAddPlan = (day: string) => {
        setDayPlans((prev) => ({
            ...prev,
            [day]: [...(prev[day] || []), { id: crypto.randomUUID(), text: "" }],
        }));
    };

    const handleAddItemToWeekPlan = (item: any, dayKey: string) => {
        setDayPlans((prev) => ({
            ...prev,
            [dayKey]: [
                ...(prev[dayKey] || []),
                {
                    id: crypto.randomUUID(),
                    text: item.title,
                    starred: false,
                    source_id: item.originalData?.id ?? item.id,
                    source_type: item.type,
                },
            ],
        }));
        toast.success(`Added to ${dayKey}`);
    };

    const addedToNextWeekIds = useMemo(() => {
        const ids = new Set<string>();
        mergedTasksIssues.forEach((item) => {
            const titleLower = (item.title || "").toLowerCase().trim();
            const alreadyAdded = Object.values(dayPlans).some((tasks) =>
                tasks.some(
                    (t) =>
                        (t.source_id != null && t.source_id === (item.originalData?.id ?? item.id)) ||
                        t.text.toLowerCase().trim() === titleLower
                )
            );
            if (alreadyAdded) ids.add(item.id);
        });
        return ids;
    }, [mergedTasksIssues, dayPlans]);

    const addItemToNextWeek = (item: any, dayKey?: string) => {
        const text = (item.title || "").trim();
        if (!text) return;
        const targetDay = dayKey ?? upcomingDays[0]?.key;
        if (!targetDay) return;
        const alreadyAdded = Object.values(dayPlans).some((tasks) =>
            tasks.some(
                (t) =>
                    (t.source_id != null && t.source_id === (item.originalData?.id ?? item.id)) ||
                    t.text.toLowerCase().trim() === text.toLowerCase()
            )
        );
        if (!alreadyAdded) {
            setDayPlans((prev) => ({
                ...prev,
                [targetDay]: [
                    ...(prev[targetDay] || []),
                    {
                        id: crypto.randomUUID(),
                        text,
                        starred: false,
                        source_id: item.originalData?.id ?? item.id,
                        source_type: item.type,
                        originalData: item.originalData ?? null,
                    },
                ],
            }));
        }
        setPlanWeekOpenItemId(null);
    };

    const removeItemFromNextWeek = (item: any) => {
        const titleLower = (item.title || "").toLowerCase().trim();
        const sourceId = item.originalData?.id ?? item.id;
        setDayPlans((prev) => {
            const updated: typeof prev = {};
            for (const [dayKey, tasks] of Object.entries(prev)) {
                updated[dayKey] = tasks.filter(
                    (t) =>
                        !(t.source_id != null && t.source_id === sourceId) &&
                        t.text.toLowerCase().trim() !== titleLower
                );
            }
            return updated;
        });
    };

    const addAllOverdueToNextWeek = () => {
        mergedTasksIssues
            .filter((item) => item.status === "overdue" || item.status === "overdued")
            .forEach((item) => addItemToNextWeek(item));
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

            const mondayPlanKey = upcomingDays[0]?.key;
            const uncompletedWins = wins
                .map((win, index) => ({ text: win.trim(), index }))
                .filter(({ text, index }) => text !== "" && checkedWins[index] === false);
            const effectiveDayPlans = { ...dayPlans };

            if (mondayPlanKey && uncompletedWins.length > 0) {
                const existingMondayPlans = effectiveDayPlans[mondayPlanKey] || [];
                const existingPlanText = new Set(
                    existingMondayPlans
                        .map((plan) => plan.text.trim().toLowerCase())
                        .filter(Boolean)
                );
                const carriedMondayPlans = uncompletedWins
                    .filter(({ text }) => !existingPlanText.has(text.toLowerCase()))
                    .map(({ text }) => ({
                        id: crypto.randomUUID(),
                        text,
                    }));

                effectiveDayPlans[mondayPlanKey] = [
                    ...existingMondayPlans,
                    ...carriedMondayPlans,
                ];
            }

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
                        achievements: [
                            ...wins
                                .map((w, index) => ({
                                    title: w,
                                    is_starred: starredWins[index] ?? false,
                                }))
                                .filter(
                                    (item, index) =>
                                        item.title.trim() !== "" && checkedWins[index] !== false
                                ),
                            ...mergedTasksIssues
                                .filter((item) =>
                                    ["completed", "closed", "done"].includes(item.status)
                                )
                                .map((item) => ({
                                    title: item.title,
                                    is_starred: starredCompletedItems[item.id] ?? false,
                                    source_type: item.type,
                                    source_id: item.originalData?.id ?? item.id,
                                })),
                        ],
                        upcoming_week_plan: [{
                            ...Object.fromEntries(
                                Object.entries(effectiveDayPlans).map(([dayKey, tasks]) => {
                                    const dayMatch = dayKey.match(/^(\w{3})/);
                                    const dayAbbr = dayMatch ? dayMatch[1].toLowerCase() : dayKey.slice(0, 3).toLowerCase();
                                    const planForDate = upcomingDays.find(d => d.key === dayKey)?.date ?? null;
                                    const filteredTasks = tasks
                                        .filter(t => t.text.trim() !== '')
                                        .map(t => ({
                                            id: t.id,
                                            text: t.text,
                                            starred: t.starred ?? false,
                                            source_id: t.source_id ?? null,
                                            source_type: t.source_type ?? null,
                                            plan_for_date: planForDate,
                                        }));
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
            suppressDraftPersistenceRef.current = true;
            canPersistDraftRef.current = false;
            clearStoredDraft();
            setActiveTab("history");
            fetchHistory();
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
                                <div className="flex items-center gap-2">
                                    <Badge className={badgePoints}>
                                        {weeklyScore.breakdown.achievements}/6 pts
                                    </Badge>
                                    <button
                                        type="button"
                                        onClick={handleAddWin}
                                        className="h-9 rounded-[10px] bg-[#f5ebe8] px-3 text-[12px] font-bold text-[#881337] transition-colors hover:bg-[#eaddd7] flex items-center justify-center gap-1.5 shadow-none border-none"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Win
                                    </button>
                                </div>
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
                                        <span className="mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 bg-gray-500 text-white">
                                            Note
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveWin(index)}
                                            className="rounded-md p-1 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}

                                {mergedTasksIssues
                                    .filter((item: any) =>
                                        ["completed", "closed", "done"].includes(item.status)
                                    )
                                    .map((item: any) => (
                                        <div
                                            key={`completed-${item.id}`}
                                            className="group relative flex items-start gap-3 rounded-xl border border-[#DA7756]/15 bg-white p-4 shadow-sm"
                                        >
                                            <Checkbox
                                                checked
                                                onCheckedChange={() => {
                                                    setPendingConfirmAction({
                                                        fn: () => reopenTaskIssueTodo(item),
                                                        label: `reopen this ${item.type} (status will change to open)`,
                                                    });
                                                }}
                                                className="mt-1 rounded border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 cursor-pointer"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setStarredCompletedItems((prev) => ({
                                                        ...prev,
                                                        [item.id]: !prev[item.id],
                                                    }))
                                                }
                                                className="mt-1 shrink-0 focus:outline-none transition-transform duration-150 active:scale-110"
                                            >
                                                <Star
                                                    className={cn(
                                                        "h-4 w-4 transition-colors duration-200",
                                                        starredCompletedItems[item.id]
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-neutral-300 hover:text-yellow-300"
                                                    )}
                                                />
                                            </button>
                                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                                                <p className="text-sm text-neutral-700 pt-0.5 line-through opacity-60">
                                                    {item.title}
                                                </p>
                                                {(() => {
                                                    const d = item.originalData;
                                                    const completionDate = fmtDate(d?.completed_at || d?.updated_at);
                                                    const effortEst = fmtHours(d?.total_allocated_hours || d?.estimated_hour);
                                                    let issueEffort: string | null = null;
                                                    if (item.type === "issue" && Array.isArray(d?.issue_allocation_times) && d.issue_allocation_times.length > 0) {
                                                        const totalMin = d.issue_allocation_times.reduce(
                                                            (sum: number, t: any) => sum + (t.hours * 60) + t.minutes, 0
                                                        );
                                                        if (totalMin > 0) {
                                                            const h = Math.floor(totalMin / 60);
                                                            const m = totalMin % 60;
                                                            issueEffort = h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`;
                                                        }
                                                    }
                                                    const hasInfo = completionDate || effortEst || issueEffort;
                                                    if (!hasInfo) return null;
                                                    return (
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            {completionDate && (
                                                                <span className="flex items-center gap-1 text-[10px] text-green-600">
                                                                    <Calendar className="h-2.5 w-2.5 shrink-0" />
                                                                    {completionDate}
                                                                </span>
                                                            )}
                                                            {effortEst && (
                                                                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                                    <Clock className="h-2.5 w-2.5 shrink-0" />
                                                                    Est: {effortEst}
                                                                </span>
                                                            )}
                                                            {issueEffort && (
                                                                <span className="flex items-center gap-1 text-[10px] text-purple-500">
                                                                    <Zap className="h-2.5 w-2.5 shrink-0" />
                                                                    Effort: {issueEffort}
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                            <span className={cn(
                                                "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 mt-1",
                                                item.type === "task" ? "bg-[#DA7756] text-white" : item.type === "issue" ? "bg-violet-600 text-white" : "bg-amber-500 text-white"
                                            )}>
                                                {item.type}
                                            </span>
                                            {item.priority && (
                                                <span
                                                    className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 mt-1"
                                                    style={{
                                                        backgroundColor: item.priority === "High" ? "#fee2e2" : item.priority === "Medium" ? "#fef3c7" : "#dcfce7",
                                                        color: item.priority === "High" ? "#991b1b" : item.priority === "Medium" ? "#92400e" : "#166534",
                                                    }}
                                                >
                                                    {item.priority}
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (item.type === "todo") {
                                                        setSelectedTodo(item.originalData);
                                                        setIsTodoDetailsModalOpen(true);
                                                    } else {
                                                        navigate(item.type === "task" ? `/vas/tasks/${item.originalData?.id}` : `/vas/issues/${item.originalData?.id}`);
                                                    }
                                                }}
                                                className="mt-1 p-1 hover:bg-gray-100 rounded-[6px] transition-colors shrink-0"
                                                title={`View ${item.type} details`}
                                            >
                                                <Eye className="h-4 w-4 text-[#DA7756]" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (item.type === "task") {
                                                        setEditTaskData(item.originalData);
                                                        setIsEditTaskModalOpen(true);
                                                    } else if (item.type === "issue") {
                                                        setEditIssueData(item.originalData);
                                                        setIsEditIssueModalOpen(true);
                                                    } else if (item.type === "todo") {
                                                        setEditTodoData(item.originalData);
                                                        setIsEditTodoModalOpen(true);
                                                    }
                                                }}
                                                className="mt-1 p-1 text-gray-500 hover:text-[#DA7756] transition-colors shrink-0"
                                                title={`Edit ${item.type}`}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}

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
                        <Card className="rounded-2xl border border-[#DA7756]/20 overflow-hidden bg-[#fff] shadow-sm mt-6">
                            <div className="bg-white p-4 border-b border-[#b91c1c]/10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <CheckSquare className="h-6 w-6 text-[#DA7756]" />
                                            <h3 className="text-sm font-bold text-[#1a1a1a] tracking-tight">
                                                Tasks, Issues & Todos
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {/* <Badge
                                                variant="outline"
                                                className="border-0 bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800"
                                            >
                                                Completed: {taskIssueCounts.completed}
                                            </Badge> */}
                                            <Badge
                                                variant="outline"
                                                className="border-0 bg-sky-100 px-3 py-1 text-[10px] font-bold text-sky-800"
                                            >
                                                Open: {taskIssueCounts.open}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="border-0 bg-red-100 px-3 py-1 text-[10px] font-bold text-red-800"
                                            >
                                                Overdue: {taskIssueCounts.overdue}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="border-0 bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-800"
                                            >
                                                In Progress: {taskIssueCounts.inProgress}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="border-0 bg-gray-100 px-3 py-1 text-[10px] font-bold text-gray-800"
                                            >
                                                On Hold: {taskIssueCounts.onHold}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge className={badgePoints}>
                                            {taskIssueCounts.completed}/20 PTS
                                        </Badge>
                                        <Button
                                            className="rounded-[8px] shadow-lg font-semibold text-sm"
                                            onClick={(e) => setTaskIssueMenuAnchor(e.currentTarget)}
                                        >
                                            <Plus size={14} />
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                {/* <CheckSquare className="h-12 w-12 text-neutral-200" />
                                <p className="text-lg text-neutral-400">
                                    No open tasks or issues.
                                </p> */}

                                {tasksLoading || issuesLoading || todosLoading ? (
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
                                                className="text-[#DA7756]/20"
                                            />
                                            <p className="text-base font-bold text-gray-400 tracking-tight">
                                                No open tasks or issues
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="space-y-3 max-h-[400px] overflow-y-auto pr-1"
                                        ref={scrollContainerRef}
                                    >
                                        {(
                                            [
                                                {
                                                    key: "overdue",
                                                    label: "Overdue",
                                                    statuses: ["overdue", "overdued"],
                                                    colorClass: "text-red-700",
                                                    bgItem: "bg-red-50/60 border-red-200",
                                                    headerBg: "bg-red-50 hover:bg-red-100",
                                                    pillBg: "bg-red-100 text-red-700",
                                                    showAddToNextWeek: true,
                                                    showBulkAdd: true,
                                                },
                                                {
                                                    key: "in_progress",
                                                    label: "In Progress",
                                                    statuses: ["in_progress", "started"],
                                                    colorClass: "text-sky-700",
                                                    bgItem: "bg-sky-50/60 border-sky-200",
                                                    headerBg: "bg-sky-50 hover:bg-sky-100",
                                                    pillBg: "bg-sky-100 text-sky-700",
                                                    showAddToNextWeek: true,
                                                    showBulkAdd: false,
                                                },
                                                {
                                                    key: "pending",
                                                    label: "Open",
                                                    statuses: ["open", "pending"],
                                                    colorClass: "text-slate-600",
                                                    bgItem: "bg-slate-50/60 border-slate-200",
                                                    headerBg: "bg-slate-50 hover:bg-slate-100",
                                                    pillBg: "bg-slate-100 text-slate-600",
                                                    showAddToNextWeek: true,
                                                    showBulkAdd: false,
                                                },
                                                {
                                                    key: "on_hold",
                                                    label: "On Hold",
                                                    statuses: ["on_hold"],
                                                    colorClass: "text-orange-700",
                                                    bgItem: "bg-orange-50/60 border-orange-200",
                                                    headerBg: "bg-orange-50 hover:bg-orange-100",
                                                    pillBg: "bg-orange-100 text-orange-700",
                                                    showAddToNextWeek: true,
                                                    showBulkAdd: false,
                                                },
                                                {
                                                    key: "reopened",
                                                    label: "Reopened",
                                                    statuses: ["reopen", "reopened"],
                                                    colorClass: "text-purple-700",
                                                    bgItem: "bg-purple-50/60 border-purple-200",
                                                    headerBg: "bg-purple-50 hover:bg-purple-100",
                                                    pillBg: "bg-purple-100 text-purple-700",
                                                    showAddToNextWeek: true,
                                                    showBulkAdd: false,
                                                },
                                            ] as const
                                        ).map((group) => {
                                            const items = mergedTasksIssues.filter((item: any) =>
                                                (group.statuses as readonly string[]).includes(item.status)
                                            );
                                            if (items.length === 0) return null;
                                            const isCollapsed = collapsedGroups.has(group.key);

                                            return (
                                                <div key={group.key}>
                                                    <button
                                                        className={cn(
                                                            "w-full flex items-center gap-2 px-3 py-2 rounded-[8px] transition-all mb-1.5",
                                                            group.headerBg
                                                        )}
                                                        onClick={() =>
                                                            setCollapsedGroups((prev) => {
                                                                const next = new Set(prev);
                                                                if (next.has(group.key)) next.delete(group.key);
                                                                else next.add(group.key);
                                                                return next;
                                                            })
                                                        }
                                                    >
                                                        <span className={cn("text-xs font-black uppercase tracking-wider flex-1 text-left", group.colorClass)}>
                                                            {group.label}
                                                        </span>
                                                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", group.pillBg)}>
                                                            {items.length}
                                                        </span>
                                                        <ChevronRight
                                                            size={14}
                                                            className={cn(
                                                                "transition-transform duration-200 ml-1",
                                                                group.colorClass,
                                                                !isCollapsed && "rotate-90"
                                                            )}
                                                        />
                                                    </button>

                                                    {!isCollapsed && (
                                                        <div className="space-y-1.5 pl-1">
                                                            {items.map((item: any) => {
                                                                const d = item.originalData;
                                                                const endDate = fmtDate(d?.target_date || d?.due_date || d?.end_date);
                                                                const effortEst = fmtHours(d?.total_allocated_hours || d?.estimated_hour);
                                                                const overdueLabel = getOverdueLabel(d?.target_date || d?.due_date || d?.end_date);

                                                                let issueEffort: string | null = null;
                                                                if (item.type === "issue" && Array.isArray(d?.issue_allocation_times) && d.issue_allocation_times.length > 0) {
                                                                    const totalMin = d.issue_allocation_times.reduce(
                                                                        (sum: number, t: any) => sum + (t.hours * 60) + t.minutes, 0
                                                                    );
                                                                    if (totalMin > 0) {
                                                                        const h = Math.floor(totalMin / 60);
                                                                        const m = totalMin % 60;
                                                                        issueEffort = h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`;
                                                                    }
                                                                }

                                                                let timeLeftLabel: string | null = null;
                                                                if (item.type === "issue" && d?.end_date && !overdueLabel) {
                                                                    const now = new Date();
                                                                    const end = new Date(d.end_date);
                                                                    end.setHours(23, 59, 59, 999);
                                                                    const diff = end.getTime() - now.getTime();
                                                                    if (diff > 0) {
                                                                        const days = Math.floor(diff / 86400000);
                                                                        const hrs = Math.floor((diff % 86400000) / 3600000);
                                                                        const mins = Math.floor((diff % 3600000) / 60000);
                                                                        if (days > 0) timeLeftLabel = `${days}d ${hrs}h left`;
                                                                        else if (hrs > 0) timeLeftLabel = `${hrs}h ${mins}m left`;
                                                                        else timeLeftLabel = `${mins}m left`;
                                                                    }
                                                                }

                                                                const hasInfo = endDate || effortEst || issueEffort || timeLeftLabel || (item.type === "task" && d?.active_time_till_now);

                                                                return (
                                                                    <div
                                                                        key={item.id}
                                                                        className={cn(
                                                                            "flex flex-col rounded-[10px] border transition-all group",
                                                                            group.bgItem
                                                                        )}
                                                                    >
                                                                        {/* Controls row */}
                                                                        <div className="flex items-center gap-2 p-2.5">
                                                                            <Checkbox
                                                                                checked={
                                                                                    selectedTasksIssues[item.id] ||
                                                                                    item.status === "completed" ||
                                                                                    item.status === "closed"
                                                                                }
                                                                                disabled={!!completingTaskIssueIds[item.id]}
                                                                                onCheckedChange={(checked) => {
                                                                                    if (
                                                                                        checked &&
                                                                                        item.status !== "completed" &&
                                                                                        item.status !== "closed"
                                                                                    ) {
                                                                                        setPendingConfirmAction({
                                                                                            fn: () => handleCompleteTaskIssueTodo(item),
                                                                                            label: `complete this ${item.type}`,
                                                                                        });
                                                                                    } else {
                                                                                        setSelectedTasksIssues((prev) => ({
                                                                                            ...prev,
                                                                                            [item.id]: checked as boolean,
                                                                                        }));
                                                                                    }
                                                                                }}
                                                                                className="h-4 w-4 rounded-[4px] border-gray-300 data-[state=checked]:bg-[#1a1a1a] data-[state=checked]:border-[#1a1a1a] shrink-0"
                                                                            />
                                                                            <button
                                                                                onClick={() => {
                                                                                    if (item.type === "todo") {
                                                                                        setSelectedTodo(item.originalData);
                                                                                        setIsTodoDetailsModalOpen(true);
                                                                                        return;
                                                                                    }
                                                                                    const detailsUrl =
                                                                                        item.type === "task"
                                                                                            ? `/vas/tasks/${item.originalData?.id}`
                                                                                            : `/vas/issues/${item.originalData?.id}`;
                                                                                    navigate(detailsUrl);
                                                                                }}
                                                                                className="p-1 hover:bg-white/60 rounded-[6px] transition-colors shrink-0"
                                                                                title={`View ${item.type} details`}
                                                                            >
                                                                                <Eye size={14} className="text-[#DA7756]" />
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    if (item.type === "task") {
                                                                                        setEditTaskData(item.originalData);
                                                                                        setIsEditTaskModalOpen(true);
                                                                                    } else if (item.type === "issue") {
                                                                                        setEditIssueData(item.originalData);
                                                                                        setIsEditIssueModalOpen(true);
                                                                                    } else if (item.type === "todo") {
                                                                                        setEditTodoData(item.originalData);
                                                                                        setIsEditTodoModalOpen(true);
                                                                                    }
                                                                                }}
                                                                                className="p-1 text-gray-500 hover:text-[#DA7756] transition-colors shrink-0"
                                                                                title={`Edit ${item.type}`}
                                                                            >
                                                                                <Pencil size={13} />
                                                                            </button>
                                                                            {item.type === "task" &&
                                                                                item.status !== "completed" &&
                                                                                item.status !== "closed" && (
                                                                                    item.originalData?.is_started ? (
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                setPauseTaskId(item.originalData.id);
                                                                                                setIsPauseModalOpen(true);
                                                                                            }}
                                                                                            disabled={!!updatingPlayPauseIds[item.id]}
                                                                                            className="p-1 hover:bg-white/60 rounded transition disabled:opacity-50 shrink-0"
                                                                                            title="Pause task"
                                                                                        >
                                                                                            {updatingPlayPauseIds[item.id] ? (
                                                                                                <Loader2 size={14} className="text-orange-500 animate-spin" />
                                                                                            ) : (
                                                                                                <Pause size={14} className="text-orange-500" />
                                                                                            )}
                                                                                        </button>
                                                                                    ) : (
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                handlePlayTask(item);
                                                                                            }}
                                                                                            disabled={!!updatingPlayPauseIds[item.id]}
                                                                                            className="p-1 hover:bg-white/60 rounded transition disabled:opacity-50 shrink-0"
                                                                                            title="Start task"
                                                                                        >
                                                                                            {updatingPlayPauseIds[item.id] ? (
                                                                                                <Loader2 size={14} className="text-green-500 animate-spin" />
                                                                                            ) : (
                                                                                                <Play size={14} className="text-green-500" />
                                                                                            )}
                                                                                        </button>
                                                                                    )
                                                                                )}
                                                                            <span className={cn(
                                                                                "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0",
                                                                                item.type === "task" ? "bg-[#DA7756] text-white" : item.type === "issue" ? "bg-violet-600 text-white" : "bg-amber-500 text-white"
                                                                            )}>
                                                                                {item.type}
                                                                            </span>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className={cn(
                                                                                    "text-sm font-medium truncate",
                                                                                    (item.status === "completed" || item.status === "closed") && "line-through opacity-60"
                                                                                )}>
                                                                                    {item.title}
                                                                                </p>
                                                                            </div>
                                                                            <span
                                                                                className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                                                                                style={{
                                                                                    backgroundColor: item.priority === "High" ? "#fee2e2" : item.priority === "Medium" ? "#fef3c7" : "#dcfce7",
                                                                                    color: item.priority === "High" ? "#991b1b" : item.priority === "Medium" ? "#92400e" : "#166534",
                                                                                }}
                                                                            >
                                                                                {item.priority}
                                                                            </span>
                                                                            {group.showAddToNextWeek && (
                                                                                addedToNextWeekIds.has(item.id) ? (
                                                                                    <button
                                                                                        onClick={(e) => { e.stopPropagation(); removeItemFromNextWeek(item); }}
                                                                                        className="shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-[6px] transition-all border whitespace-nowrap bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                                                                        title="Remove from next week plan"
                                                                                    >
                                                                                        Added ✓
                                                                                    </button>
                                                                                ) : (
                                                                                    <button
                                                                                        onClick={(e) => { e.stopPropagation(); setPlanWeekOpenItemId(planWeekOpenItemId === item.id ? null : item.id); }}
                                                                                        className={cn(
                                                                                            "shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-[6px] transition-all border whitespace-nowrap",
                                                                                            planWeekOpenItemId === item.id
                                                                                                ? "bg-[#DA7756] border-[#DA7756] text-white"
                                                                                                : "bg-white border-gray-200 text-gray-500 hover:border-[#DA7756] hover:text-[#DA7756] hover:bg-[#DA7756]/5 opacity-0 group-hover:opacity-100"
                                                                                        )}
                                                                                        title="Add to next week plan"
                                                                                    >
                                                                                        + Next Week
                                                                                    </button>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                        {/* Info row */}
                                                                        {hasInfo && (
                                                                            <div className="flex items-center gap-3 px-3 pb-2 flex-wrap">
                                                                                {endDate && (
                                                                                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                                                        <Calendar size={9} className="shrink-0" />
                                                                                        {endDate}
                                                                                    </span>
                                                                                )}
                                                                                {overdueLabel && (
                                                                                    <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600">
                                                                                        <AlertCircle size={9} className="shrink-0" />
                                                                                        {overdueLabel}
                                                                                    </span>
                                                                                )}
                                                                                {timeLeftLabel && (
                                                                                    <span className="flex items-center gap-1 text-[10px] text-blue-600">
                                                                                        <Clock size={9} className="shrink-0" />
                                                                                        {timeLeftLabel}
                                                                                    </span>
                                                                                )}
                                                                                {effortEst && (
                                                                                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                                                        <Clock size={9} className="shrink-0" />
                                                                                        Est: {effortEst}
                                                                                    </span>
                                                                                )}
                                                                                {issueEffort && (
                                                                                    <span className="flex items-center gap-1 text-[10px] text-purple-600">
                                                                                        <Zap size={9} className="shrink-0" />
                                                                                        Effort: {issueEffort}
                                                                                    </span>
                                                                                )}
                                                                                {item.type === "task" && d?.active_time_till_now && (
                                                                                    <span className="flex items-center gap-1 text-[10px] text-green-600">
                                                                                        <Zap size={9} className="shrink-0" />
                                                                                        <ActiveTimer activeTimeTillNow={d.active_time_till_now} isStarted={d.is_started} />
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        {/* Inline day picker */}
                                                                        {planWeekOpenItemId === item.id && (
                                                                            <div className="px-3 pb-3 pt-2 flex items-center gap-1.5 flex-wrap border-t border-dashed border-gray-200">
                                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
                                                                                    Pick day:
                                                                                </span>
                                                                                {upcomingDays.map((day) => (
                                                                                    <button
                                                                                        key={day.key}
                                                                                        onClick={(e) => { e.stopPropagation(); addItemToNextWeek(item, day.key); }}
                                                                                        className="text-[10px] font-semibold px-2 py-1 rounded-[6px] border border-[#DA7756]/30 bg-white text-[#DA7756] hover:bg-[#DA7756] hover:text-white hover:border-[#DA7756] transition-all whitespace-nowrap"
                                                                                    >
                                                                                        {day.short}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
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
                            <div className="px-6 py-6">
                                {isLoadingSops ? (
                                    <div className="flex items-center justify-center gap-2 py-4 text-sm text-neutral-500">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading SOP status...
                                    </div>
                                ) : sopsError ? (
                                    <p className="py-4 text-center text-sm text-red-500">
                                        {sopsError}
                                    </p>
                                ) : systemSops.length === 0 ? (
                                    <p className="py-4 text-center text-sm text-neutral-500">
                                        No SOPs assigned to you.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
                                                <p className="text-xs font-semibold uppercase text-neutral-500">
                                                    Health
                                                </p>
                                                <p className="mt-1 text-2xl font-bold text-neutral-900">
                                                    {sopMetrics.averageHealth}%
                                                </p>
                                            </div>
                                            <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
                                                <p className="text-xs font-semibold uppercase text-neutral-500">
                                                    Status
                                                </p>
                                                <p className="mt-1 text-sm font-bold text-neutral-900">
                                                    {sopMetrics.status}
                                                </p>
                                            </div>
                                            <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
                                                <p className="text-xs font-semibold uppercase text-neutral-500">
                                                    SOPs
                                                </p>
                                                <p className="mt-1 text-2xl font-bold text-neutral-900">
                                                    {sopMetrics.total}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {systemSops.map((sop) => (
                                                <div
                                                    key={sop.id}
                                                    className="rounded-xl border border-neutral-200 bg-white p-3"
                                                >
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-bold text-neutral-900">
                                                                {sop.system_name || "Untitled SOP"}
                                                            </p>
                                                            <p className="text-xs text-neutral-500">
                                                                {sop.department_name || "No department"}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs font-semibold">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="h-9 gap-1.5 rounded-lg border-[#DA7756]/25 bg-[#fef6f4] px-3 text-xs font-bold text-[#DA7756] shadow-sm hover:border-[#DA7756]/45 hover:bg-white hover:text-[#c9673f]"
                                                                onClick={() => setSelectedSopId(sop.id)}
                                                                aria-label={`View details for ${sop.system_name || "SOP"}`}
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                                View
                                                            </Button>
                                                            <Select
                                                                value={getSopStatusValue(sop.status)}
                                                                disabled={!!updatingSopStatus[sop.id]}
                                                                onValueChange={(value) =>
                                                                    handleSopStatusChange(sop, value)
                                                                }
                                                            >
                                                                <SelectTrigger className="h-9 w-[120px] rounded-lg border-neutral-200 bg-white text-xs font-bold text-neutral-700 focus:ring-[#DA7756]/25">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl border-neutral-200">
                                                                    {SOP_STATUS_OPTIONS.map((status) => (
                                                                        <SelectItem key={status} value={status}>
                                                                            {status}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {updatingSopStatus[sop.id] && (
                                                                <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 space-y-2">
                                                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
                                                            <span>Health</span>
                                                            <span className="text-neutral-800">
                                                                {Number(sop.health_score ?? 0)}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Slider
                                                                min={0}
                                                                max={100}
                                                                step={1}
                                                                value={[Number(sop.health_score ?? 0)]}
                                                                disabled={!!updatingSopHealth[sop.id]}
                                                                onValueChange={(value) =>
                                                                    handleSopHealthPreview(sop.id, value[0] ?? 0)
                                                                }
                                                                onValueCommit={(value) =>
                                                                    handleSopHealthCommit(sop, value[0] ?? 0)
                                                                }
                                                                className="[&>span:first-child]:bg-neutral-200 [&>span:first-child>span]:bg-[#DA7756] [&_[role=slider]]:border-[#DA7756] [&_[role=slider]]:bg-white"
                                                            />
                                                            {updatingSopHealth[sop.id] && (
                                                                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-neutral-400" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                                    onClick={(e) => setDayPlanMenuAnchor({ el: e.currentTarget, dayKey: day.key, date: day.date })}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-[#DA7756]/25 bg-white px-2.5 py-1.5 text-xs font-bold text-[#DA7756] shadow-sm transition-colors hover:bg-[#fef6f4] hover:border-[#DA7756]/45"
                                                >
                                                    <Plus className="h-3 w-3" /> Add
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-neutral-400">—</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {/* Next week scheduled items — read-only, not in payload */}
                                            {nextWeekScheduledLoading && !nextWeekScheduledItems.length ? (
                                                <div className="flex items-center gap-2 ml-2 py-2">
                                                    <Loader2 size={12} className="animate-spin text-gray-400" />
                                                    <span className="text-[11px] text-gray-400">Loading scheduled...</span>
                                                </div>
                                            ) : (
                                                nextWeekScheduledByDay[day.key]?.map((item: any) => (
                                                    <div
                                                        key={item.id}
                                                        className="relative ml-2 flex items-start gap-3 rounded-xl border border-[#DA7756]/15 bg-white p-4 shadow-sm transition-all duration-200 hover:border-[#DA7756]/30 hover:shadow-md"
                                                    >
                                                        <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className={cn(
                                                                    "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase",
                                                                    item.type === "task" ? "bg-[#DA7756] text-white" : item.type === "issue" ? "bg-violet-600 text-white" : "bg-amber-500 text-white"
                                                                )}>
                                                                    {item.type}
                                                                </span>
                                                                {item.priority && (
                                                                    <span
                                                                        className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                                                                        style={{
                                                                            backgroundColor: item.priority === "High" ? "#fee2e2" : item.priority === "Medium" ? "#fef3c7" : "#dcfce7",
                                                                            color: item.priority === "High" ? "#991b1b" : item.priority === "Medium" ? "#92400e" : "#166534",
                                                                        }}
                                                                    >
                                                                        {item.priority}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="rounded-md border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-500 cursor-not-allowed select-none">
                                                                {item.title}
                                                            </p>
                                                            {(() => {
                                                                const d = item.originalData;
                                                                const endDate = fmtDate(d?.target_date || d?.due_date || d?.end_date);
                                                                const effortEst = fmtHours(d?.total_allocated_hours || d?.estimated_hour);
                                                                const overdueLabel = getOverdueLabel(d?.target_date || d?.due_date || d?.end_date);
                                                                let timeLeftLabel: string | null = null;
                                                                if (item.type === "issue" && d?.end_date && !overdueLabel) {
                                                                    const now = new Date();
                                                                    const end = new Date(d.end_date);
                                                                    end.setHours(23, 59, 59, 999);
                                                                    const diff = end.getTime() - now.getTime();
                                                                    if (diff > 0) {
                                                                        const days = Math.floor(diff / 86400000);
                                                                        const hrs = Math.floor((diff % 86400000) / 3600000);
                                                                        const mins = Math.floor((diff % 3600000) / 60000);
                                                                        if (days > 0) timeLeftLabel = `${days}d ${hrs}h left`;
                                                                        else if (hrs > 0) timeLeftLabel = `${hrs}h ${mins}m left`;
                                                                        else timeLeftLabel = `${mins}m left`;
                                                                    }
                                                                }
                                                                const hasInfo = endDate || effortEst || overdueLabel || timeLeftLabel;
                                                                if (!hasInfo) return null;
                                                                return (
                                                                    <div className="flex items-center gap-3 flex-wrap">
                                                                        {endDate && (
                                                                            <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                                                <Calendar className="h-2.5 w-2.5 shrink-0" />
                                                                                {endDate}
                                                                            </span>
                                                                        )}
                                                                        {overdueLabel && (
                                                                            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600">
                                                                                <AlertCircle className="h-2.5 w-2.5 shrink-0" />
                                                                                {overdueLabel}
                                                                            </span>
                                                                        )}
                                                                        {timeLeftLabel && (
                                                                            <span className="flex items-center gap-1 text-[10px] text-blue-600">
                                                                                <Clock className="h-2.5 w-2.5 shrink-0" />
                                                                                {timeLeftLabel}
                                                                            </span>
                                                                        )}
                                                                        {effortEst && (
                                                                            <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                                                <Clock className="h-2.5 w-2.5 shrink-0" />
                                                                                Est: {effortEst}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                        <div className="flex flex-col gap-1 relative z-20">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (item.type === "todo") {
                                                                        setSelectedTodo(item.originalData);
                                                                        setIsTodoDetailsModalOpen(true);
                                                                    } else {
                                                                        navigate(item.type === "task" ? `/vas/tasks/${item.originalData?.id}` : `/vas/issues/${item.originalData?.id}`);
                                                                    }
                                                                }}
                                                                className="rounded-md p-1 text-[#DA7756]/55 hover:bg-[#fef6f4] hover:text-[#DA7756] transition-colors"
                                                                title={`View ${item.type}`}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
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
                                                        title={planObj.starred ? "Unstar" : "Star this priority"}
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
                                                    <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={cn(
                                                                "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase",
                                                                planObj.source_type === "task" ? "bg-[#DA7756] text-white" : planObj.source_type === "issue" ? "bg-violet-600 text-white" : planObj.source_type === "todo" ? "bg-amber-500 text-white" : "bg-gray-500 text-white"
                                                            )}>
                                                                {planObj.source_type || "Note"}
                                                            </span>
                                                            {planObj.originalData?.priority && (
                                                                <span
                                                                    className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                                                                    style={{
                                                                        backgroundColor: planObj.originalData.priority === "High" ? "#fee2e2" : planObj.originalData.priority === "Medium" ? "#fef3c7" : "#dcfce7",
                                                                        color: planObj.originalData.priority === "High" ? "#991b1b" : planObj.originalData.priority === "Medium" ? "#92400e" : "#166534",
                                                                    }}
                                                                >
                                                                    {planObj.originalData.priority}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {planObj.source_type ? (
                                                            <p className="rounded-md border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-500 cursor-not-allowed select-none">
                                                                {planObj.text}
                                                            </p>
                                                        ) : (
                                                            <AutoSizingTextarea
                                                                value={planObj.text}
                                                                onChange={(val: string) =>
                                                                    handlePlanChange(day.key, index, val)
                                                                }
                                                                placeholder="What's your strategic priority?"
                                                                className="rounded-md border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-[#DA7756]/50 focus:bg-white focus:ring-1 focus:ring-[#DA7756]/20 transition-all duration-200"
                                                            />
                                                        )}
                                                        {planObj.originalData && (() => {
                                                            const d = planObj.originalData;
                                                            const endDate = fmtDate(d?.target_date || d?.due_date || d?.end_date);
                                                            const effortEst = fmtHours(d?.total_allocated_hours || d?.estimated_hour);
                                                            const overdueLabel = getOverdueLabel(d?.target_date || d?.due_date || d?.end_date);
                                                            let timeLeftLabel: string | null = null;
                                                            if (planObj.source_type === "issue" && d?.end_date && !overdueLabel) {
                                                                const now = new Date();
                                                                const end = new Date(d.end_date);
                                                                end.setHours(23, 59, 59, 999);
                                                                const diff = end.getTime() - now.getTime();
                                                                if (diff > 0) {
                                                                    const days = Math.floor(diff / 86400000);
                                                                    const hrs = Math.floor((diff % 86400000) / 3600000);
                                                                    const mins = Math.floor((diff % 3600000) / 60000);
                                                                    if (days > 0) timeLeftLabel = `${days}d ${hrs}h left`;
                                                                    else if (hrs > 0) timeLeftLabel = `${hrs}h ${mins}m left`;
                                                                    else timeLeftLabel = `${mins}m left`;
                                                                }
                                                            }
                                                            const hasInfo = endDate || effortEst || overdueLabel || timeLeftLabel;
                                                            if (!hasInfo) return null;
                                                            return (
                                                                <div className="flex items-center gap-3 flex-wrap">
                                                                    {endDate && (
                                                                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                                            <Calendar className="h-2.5 w-2.5 shrink-0" />
                                                                            {endDate}
                                                                        </span>
                                                                    )}
                                                                    {overdueLabel && (
                                                                        <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600">
                                                                            <AlertCircle className="h-2.5 w-2.5 shrink-0" />
                                                                            {overdueLabel}
                                                                        </span>
                                                                    )}
                                                                    {timeLeftLabel && (
                                                                        <span className="flex items-center gap-1 text-[10px] text-blue-600">
                                                                            <Clock className="h-2.5 w-2.5 shrink-0" />
                                                                            {timeLeftLabel}
                                                                        </span>
                                                                    )}
                                                                    {effortEst && (
                                                                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                                            <Clock className="h-2.5 w-2.5 shrink-0" />
                                                                            Est: {effortEst}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
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
                                                            onClick={() => handleMovePlan(day.key, index, "up")}
                                                            disabled={index === 0 || !!planObj.source_type}
                                                            className="rounded-md p-1 text-[#DA7756]/45 hover:bg-[#fef6f4] hover:text-[#DA7756] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <ChevronUp className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMovePlan(day.key, index, "down")}
                                                            disabled={index === (dayPlans[day.key]?.length ?? 0) - 1 || !!planObj.source_type}
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

            <MuiDialog open={openTaskModal} onClose={() => setOpenTaskModal(false)} TransitionComponent={Transition} maxWidth={false}>
                <MuiDialogContent className="w-1/2 fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto" style={{ margin: 0, maxHeight: "100vh", display: "flex", flexDirection: "column" }} sx={{ padding: "0 !important" }}>
                    <div className="sticky top-0 bg-white z-10">
                        <h3 className="text-[14px] font-medium text-center mt-8">Add Tasks</h3>
                        <X className="absolute top-[26px] right-8 cursor-pointer w-4 h-4" onClick={() => setOpenTaskModal(false)} />
                        <hr className="border border-[#E95420] mt-4" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <ProjectTaskCreateModal
                            isEdit={false}
                            onCloseModal={() => setOpenTaskModal(false)}
                            prefillData={{
                                start_date: planPreFillDate ?? currentDateValue,
                            }}
                        />
                    </div>
                </MuiDialogContent>
            </MuiDialog>

            <AddIssueModal
                openDialog={openIssueModal}
                handleCloseDialog={() => setOpenIssueModal(false)}
                prefillData={{
                    start_date: planPreFillDate ?? currentDateValue,
                }}
            />

            <AddToDoModal
                isModalOpen={openTodoModal}
                setIsModalOpen={() => {
                    setOpenTodoModal(false);
                    setTasksIssuesRefreshKey((key) => key + 1);
                }}
                getTodos={() => setTasksIssuesRefreshKey((key) => key + 1)}
                prefillData={{
                    start_date: planPreFillDate ?? currentDateValue,
                    // target_date: weekEndDateValue,
                }}
            />

            <TodoDetailsModal
                isModalOpen={isTodoDetailsModalOpen}
                setIsModalOpen={setIsTodoDetailsModalOpen}
                todo={selectedTodo}
                onEditClick={() => {
                    setIsTodoDetailsModalOpen(false);
                    setEditTodoData(selectedTodo);
                    setIsEditTodoModalOpen(true);
                }}
            />

            <MuiDialog
                open={isEditTaskModalOpen}
                onClose={() => {
                    setIsEditTaskModalOpen(false);
                    setEditTaskData(null);
                }}
                TransitionComponent={Transition}
                maxWidth={false}
            >
                <MuiDialogContent
                    className="w-1/2 fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto"
                    style={{ margin: 0, maxHeight: "100vh", display: "flex", flexDirection: "column" }}
                    sx={{ padding: "0 !important" }}
                >
                    <div className="sticky top-0 bg-white z-10">
                        <h3 className="text-[14px] font-medium text-center mt-8">Edit Task</h3>
                        <X
                            className="absolute top-[26px] right-8 cursor-pointer w-4 h-4"
                            onClick={() => {
                                setIsEditTaskModalOpen(false);
                                setEditTaskData(null);
                            }}
                        />
                        <hr className="border border-[#E95420] mt-4" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <ProjectTaskEditModal
                            taskId={editTaskData?.id}
                            onCloseModal={() => {
                                setIsEditTaskModalOpen(false);
                                setEditTaskData(null);
                                setTasksIssuesRefreshKey((key) => key + 1);
                            }}
                        />
                    </div>
                </MuiDialogContent>
            </MuiDialog>

            <EditIssueModal
                openDialog={isEditIssueModalOpen}
                handleCloseDialog={() => {
                    setIsEditIssueModalOpen(false);
                    setEditIssueData(null);
                }}
                issueData={editIssueData}
                onIssueUpdated={() => setTasksIssuesRefreshKey((key) => key + 1)}
            />

            <AddToDoModal
                isModalOpen={isEditTodoModalOpen}
                setIsModalOpen={() => {
                    setIsEditTodoModalOpen(false);
                    setEditTodoData(null);
                    setTasksIssuesRefreshKey((key) => key + 1);
                }}
                getTodos={() => setTasksIssuesRefreshKey((key) => key + 1)}
                editingTodo={editTodoData}
                isEditMode={!!editTodoData}
                prefillData={editTodoData || {}}
            />

            <OverdueReasonModal
                isOpen={isOverdueModalOpen}
                onClose={() => {
                    setIsOverdueModalOpen(false);
                    setOverdueItem(null);
                    setOverdueReason("");
                }}
                reason={overdueReason}
                setReason={setOverdueReason}
                onSubmit={handleOverdueReasonSubmit}
                isLoading={isOverdueLoading}
            />

            <PauseReasonModal
                isOpen={isPauseModalOpen}
                onClose={() => {
                    setIsPauseModalOpen(false);
                    setPauseTaskId(null);
                }}
                onSubmit={handlePauseTaskSubmit}
                isLoading={isPauseLoading}
                taskId={pauseTaskId}
            />

            <Dialog
                open={Boolean(selectedSop)}
                onOpenChange={(open) => {
                    if (!open) setSelectedSopId(null);
                }}
            >
                <DialogContent className="max-h-[88vh] max-w-4xl overflow-hidden rounded-2xl border-neutral-200 bg-neutral-50 p-0 shadow-2xl">
                    {selectedSop && (
                        <div className="flex max-h-[88vh] flex-col">
                            <DialogHeader className="relative border-b border-neutral-200 bg-white px-6 py-5 pr-14">
                                <DialogClose className="absolute right-5 top-5 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700">
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                </DialogClose>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex min-w-0 gap-3">
                                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fef6f4] text-[#DA7756]">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                            <DialogTitle className="truncate text-xl font-bold text-neutral-900">
                                                {selectedSop.system_name || "Untitled SOP"}
                                            </DialogTitle>
                                            <DialogDescription className="text-sm text-neutral-500">
                                                {selectedSop.department_name || "No department"}
                                            </DialogDescription>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                                        <Badge className="rounded-full border-0 bg-[#fef6f4] px-3 py-1 text-[#DA7756] hover:bg-[#fef6f4]">
                                            {getSopStatusValue(selectedSop.status)}
                                        </Badge>
                                        <Badge className="rounded-full border-0 bg-neutral-100 px-3 py-1 capitalize text-neutral-700 hover:bg-neutral-100">
                                            {formatSopValue(selectedSop.priority)} priority
                                        </Badge>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                <Activity className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase text-neutral-500">Health</p>
                                                <p className="mt-0.5 text-xl font-bold text-neutral-900">
                                                    {Number(selectedSop.health_score ?? 0)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <Users className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold uppercase text-neutral-500">Department</p>
                                                <p className="mt-0.5 truncate text-sm font-bold text-neutral-900">
                                                    {formatSopValue(selectedSop.department_name)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold uppercase text-neutral-500">Assignee</p>
                                                <p className="mt-0.5 truncate text-sm font-bold text-neutral-900">
                                                    {formatSopValue(selectedSop.assignee_name)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                                    <p className="text-xs font-semibold uppercase text-neutral-500">Description</p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-800">
                                        {formatSopValue(selectedSop.description)}
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[
                                        ["Created By", selectedSop.created_by_name],
                                        ["Updated By", selectedSop.updated_by_name],
                                        ["Created At", formatSopDate(selectedSop.created_at)],
                                        ["Updated At", formatSopDate(selectedSop.updated_at)],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm"
                                        >
                                            <p className="text-xs font-semibold uppercase text-neutral-500">
                                                {label}
                                            </p>
                                            <p className="mt-1 break-words text-sm font-semibold text-neutral-900">
                                                {formatSopValue(value)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                                    <p className="text-xs font-semibold uppercase text-neutral-500">
                                        Documentation URL
                                    </p>
                                    {selectedSop.documentation_url ? (
                                        <a
                                            href={selectedSop.documentation_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 block break-all text-sm font-semibold text-[#DA7756] hover:underline"
                                        >
                                            {selectedSop.documentation_url}
                                        </a>
                                    ) : (
                                        <p className="mt-2 text-sm text-neutral-600">Not available</p>
                                    )}
                                </div>

                                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xs font-semibold uppercase text-neutral-500">KPIs</p>
                                        <Badge className="rounded-full border-0 bg-neutral-100 text-neutral-700 hover:bg-neutral-100">
                                            {Array.isArray(selectedSop.kpis) ? selectedSop.kpis.length : 0}
                                        </Badge>
                                    </div>
                                    {Array.isArray(selectedSop.kpis) && selectedSop.kpis.length > 0 ? (
                                        <div className="mt-3 space-y-2">
                                            {selectedSop.kpis.map((kpi: any) => (
                                                <div
                                                    key={kpi.id ?? `${kpi.kpi_id}-${kpi.position}`}
                                                    className="rounded-lg border border-neutral-100 bg-neutral-50 p-3"
                                                >
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-neutral-900">
                                                                {formatSopValue(kpi.kpi_name)}
                                                            </p>
                                                            <p className="text-xs text-neutral-500">
                                                                {formatSopValue(kpi.kpi_category)}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-neutral-600">
                                                            <span className="rounded-full bg-white px-2.5 py-1 capitalize text-neutral-700">
                                                                {formatSopValue(kpi.kpi_frequency)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-3 text-sm text-neutral-600">No KPIs linked.</p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="border-t border-neutral-200 bg-white px-6 py-4">
                                <Button
                                    type="button"
                                    className={cn("h-10 rounded-lg px-5", btnPrimary)}
                                    onClick={() => setSelectedSopId(null)}
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Menu
                anchorEl={taskIssueMenuAnchor}
                open={Boolean(taskIssueMenuAnchor)}
                onClose={() => setTaskIssueMenuAnchor(null)}
                disableScrollLock
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "12px",
                            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
                            minWidth: "240px",
                            overflow: "visible",
                            maxHeight: "none",
                            mt: 1,
                        },
                    },
                    list: {
                        sx: {
                            py: 0.5,
                            overflow: "visible",
                            maxHeight: "none",
                        },
                    },
                }}
                sx={{
                    "& .MuiPaper-root": {
                        borderRadius: "12px",
                        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
                        minWidth: "240px",
                        overflow: "visible",
                        maxHeight: "none !important",
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
                        setPlanPreFillDate(null);
                        setOpenTaskModal(true);
                        setTaskIssueMenuAnchor(null);
                    }}
                    sx={{
                        py: 1.5,
                        px: 2,
                        margin: "6px 8px 4px 8px",
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
                        setPlanPreFillDate(null);
                        setOpenIssueModal(true);
                        setTaskIssueMenuAnchor(null);
                    }}
                    sx={{
                        py: 1.5,
                        px: 2,
                        margin: "4px 8px 6px 8px",
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
                <MenuItem
                    onClick={() => {
                        setPlanPreFillDate(null);
                        setOpenTodoModal(true);
                        setTaskIssueMenuAnchor(null);
                    }}
                    sx={{
                        py: 1.5,
                        px: 2,
                        margin: "4px 8px",
                        borderRadius: "10px",
                        "&:hover": {
                            backgroundColor: "#fffbeb",
                            transform: "translateX(4px)",
                        },
                    }}
                >
                    <div className="flex items-center gap-3 w-full">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <ListTodo size={18} className="text-amber-600" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-gray-900 text-sm">Add Todo</span>
                            <span className="text-xs text-gray-500 font-medium">
                                Add a quick follow-up
                            </span>
                        </div>
                    </div>
                </MenuItem>
            </Menu>

            {/* Day plan dropdown menu */}
            <Menu
                anchorEl={dayPlanMenuAnchor?.el}
                open={Boolean(dayPlanMenuAnchor)}
                onClose={() => setDayPlanMenuAnchor(null)}
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
                        if (dayPlanMenuAnchor) handleAddPlan(dayPlanMenuAnchor.dayKey);
                        setDayPlanMenuAnchor(null);
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
                            <Plus size={18} className="text-blue-600" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-gray-900 text-sm">Add Note</span>
                            <span className="text-xs text-gray-500 font-medium">
                                {dayPlanMenuAnchor?.dayKey ?? "this day"}
                            </span>
                        </div>
                    </div>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (dayPlanMenuAnchor) setPlanPreFillDate(dayPlanMenuAnchor.date);
                        setOpenTaskModal(true);
                        setDayPlanMenuAnchor(null);
                    }}
                    sx={{
                        py: 1.5,
                        px: 2,
                        margin: "4px 8px 4px 8px",
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
                                {dayPlanMenuAnchor?.dayKey ?? "this day"}
                            </span>
                        </div>
                    </div>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (dayPlanMenuAnchor) setPlanPreFillDate(dayPlanMenuAnchor.date);
                        setOpenIssueModal(true);
                        setDayPlanMenuAnchor(null);
                    }}
                    sx={{
                        py: 1.5,
                        px: 2,
                        margin: "4px 8px 4px 8px",
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
                                {dayPlanMenuAnchor?.dayKey ?? "this day"}
                            </span>
                        </div>
                    </div>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (dayPlanMenuAnchor) setPlanPreFillDate(dayPlanMenuAnchor.date);
                        setOpenTodoModal(true);
                        setDayPlanMenuAnchor(null);
                    }}
                    sx={{
                        py: 1.5,
                        px: 2,
                        margin: "4px 8px 8px 8px",
                        borderRadius: "10px",
                        "&:hover": {
                            backgroundColor: "#fef9f0",
                            transform: "translateX(4px)",
                        },
                    }}
                >
                    <div className="flex items-center gap-3 w-full">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <ListTodo size={18} className="text-amber-600" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-gray-900 text-sm">Add Todo</span>
                            <span className="text-xs text-gray-500 font-medium">
                                {dayPlanMenuAnchor?.dayKey ?? "this day"}
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

            {/* Task completion confirmation modal */}
            {pendingConfirmAction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <AlertCircle size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Are you sure?</p>
                                <p className="text-xs text-gray-500 mt-0.5 capitalize">
                                    This will {pendingConfirmAction.label}.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setPendingConfirmAction(null)}
                                className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    pendingConfirmAction.fn();
                                    setPendingConfirmAction(null);
                                }}
                                className="px-4 py-1.5 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-[#333] rounded-lg transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const OverdueReasonModal = ({
    isOpen,
    onClose,
    reason,
    setReason,
    onSubmit,
    isLoading,
}: {
    isOpen: boolean;
    onClose: () => void;
    reason: string;
    setReason: (reason: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-[32rem] max-w-[calc(100vw-2rem)] border border-gray-200">
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Item is Overdue</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        This item is past its target date. Please provide a reason for the delay.
                    </p>
                </div>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for overdue..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA7756]/50 resize-none"
                    rows={4}
                    disabled={isLoading}
                />

                <div className="flex gap-2 justify-end pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-[#DA7756] hover:bg-[#c45f3a] text-white"
                        onClick={onSubmit}
                        disabled={!reason.trim() || isLoading}
                    >
                        {isLoading ? "Submitting..." : "Complete & Submit"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const PauseReasonModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    taskId,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string, taskId: number | null) => void;
    isLoading: boolean;
    taskId: number | null;
}) => {
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (!isOpen) setReason("");
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason for pausing the task");
            return;
        }
        onSubmit(reason, taskId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-[32rem] max-w-[calc(100vw-2rem)] border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-[#C72030] rounded-sm" />
                    <h2 className="text-lg font-bold text-gray-900">Pause Task</h2>
                </div>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Please provide a reason for pausing this task.
                </p>
                <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Reason
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for pausing this task..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#C72030] focus:ring-2 focus:ring-[#C72030] focus:ring-opacity-20 resize-none text-sm bg-white"
                        rows={4}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-[#C72030] text-white font-medium rounded-md hover:bg-[#b01c26] disabled:opacity-50 transition-colors text-sm"
                    >
                        {isLoading ? "Processing..." : "Pause Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WeeklyReports;
