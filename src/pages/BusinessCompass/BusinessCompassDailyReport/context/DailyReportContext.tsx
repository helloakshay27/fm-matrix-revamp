import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertCircle,
  CalendarCheck,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";
import { getBaseUrl, getToken } from "@/utils/auth";
import { calculateLivePreviewScore } from "@/utils/scoreCalculation";
import { useBusinessCompassIssues } from "@/hooks/useBusinessCompassIssues";
import { useBusinessCompassTasks } from "@/hooks/useBusinessCompassTasks";
import { useBusinessCompassTodos } from "@/hooks/useBusinessCompassTodos";
import { taskIssueGroupKeys, taskIssueGroupKeySet } from "../types";
import type {
  AccomplishmentItem,
  ApplyDraftOptions,
  AttachmentFile,
  DailyReport,
  DailyReportDraft,
  TaskIssueGroupKey,
} from "../types";
import {
  cleanReportText,
  getNonEmptyReportItems,
  getOverdueLabel,
  getPriorityClass,
  getPriorityColors,
  getReportDateKey,
  getReportItemText,
  buildItemSourceRef,
  sanitizeOriginalData,
  isReportBackedDraft,
  hasMeaningfulDraftData,
  isCompleted,
  buildDraftStorageKey,
  normalizeReportForUi,
} from "../utils";
import {
  fetchCompletedItemsForDate,
  fetchExistingReport,
  fetchKpis,
  fetchPlanSource,
  fetchReporteeReports,
  fetchReportsList,
  fetchRosterWorkingDays,
  fetchTodoDetails,
  fetchTomorrowScheduled,
  deleteUserJournal,
  submitUserJournal,
  completeTask,
  completeTodo,
  completeIssue,
  markItemClosedWithAttachments,
  postComment,
  updateTaskStatus,
  updateIssueStatus,
} from "../api";

export interface DailyReportContextValue {
  isPATMSynced: boolean;
  navigate: ReturnType<typeof useNavigate>;
  now: Date;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  selfRating: number[];
  setSelfRating: React.Dispatch<React.SetStateAction<number[]>>;
  isAbsent: boolean;
  setIsAbsent: React.Dispatch<React.SetStateAction<boolean>>;
  absenceReason: string;
  setAbsenceReason: React.Dispatch<React.SetStateAction<string>>;
  isDetailedScoreExpanded: boolean;
  setIsDetailedScoreExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isScoreInfoExpanded: boolean;
  setIsScoreInfoExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
  accomplishments: AccomplishmentItem[];
  setAccomplishments: React.Dispatch<React.SetStateAction<AccomplishmentItem[]>>;
  planningItems: any[];
  setPlanningItems: React.Dispatch<React.SetStateAction<any[]>>;
  uploadedFiles: any[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<any[]>>;
  reportAttachments: AttachmentFile[];
  setReportAttachments: React.Dispatch<React.SetStateAction<AttachmentFile[]>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  closureFileInputRef: React.RefObject<HTMLInputElement>;
  isEditTaskModalOpen: boolean;
  setIsEditTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editTaskData: any;
  setEditTaskData: React.Dispatch<React.SetStateAction<any>>;
  isEditIssueModalOpen: boolean;
  setIsEditIssueModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editIssueData: any;
  setEditIssueData: React.Dispatch<React.SetStateAction<any>>;
  isEditTodoModalOpen: boolean;
  setIsEditTodoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editTodoData: any;
  setEditTodoData: React.Dispatch<React.SetStateAction<any>>;
  isTodoDetailsLoading: boolean;
  setIsTodoDetailsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleViewReportItem: (item: any) => Promise<void>;
  handleEditReportItem: (item: any) => void;
  taskIssueMenuAnchor: null | HTMLElement;
  setTaskIssueMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  isTaskCreateModalOpen: boolean;
  setIsTaskCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isIssueCreateModalOpen: boolean;
  setIsIssueCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTodoCreateModalOpen: boolean;
  setIsTodoCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  planDateResetKey: number;
  setPlanDateResetKey: React.Dispatch<React.SetStateAction<number>>;
  isFromPlan: boolean;
  setIsFromPlan: React.Dispatch<React.SetStateAction<boolean>>;
  planningMenuAnchor: null | HTMLElement;
  setPlanningMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  convertMenuAnchor: null | HTMLElement;
  setConvertMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  convertMenuItem: AccomplishmentItem | null;
  setConvertMenuItem: React.Dispatch<React.SetStateAction<AccomplishmentItem | null>>;
  convertTitle: string;
  setConvertTitle: React.Dispatch<React.SetStateAction<string>>;
  isFromConvert: boolean;
  setIsFromConvert: React.Dispatch<React.SetStateAction<boolean>>;
  pendingConvertItemRef: React.MutableRefObject<AccomplishmentItem | null>;
  showClosureModal: boolean;
  setShowClosureModal: React.Dispatch<React.SetStateAction<boolean>>;
  closureItem: any;
  setClosureItem: React.Dispatch<React.SetStateAction<any>>;
  closureRemarks: string;
  setClosureRemarks: React.Dispatch<React.SetStateAction<string>>;
  closureAttachments: any[];
  setClosureAttachments: React.Dispatch<React.SetStateAction<any[]>>;
  isClosureSubmitting: boolean;
  isOverdueModalOpen: boolean;
  setIsOverdueModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  overdueItemId: string | null;
  setOverdueItemId: React.Dispatch<React.SetStateAction<string | null>>;
  isOverdueLoading: boolean;
  overdueReason: string;
  setOverdueReason: React.Dispatch<React.SetStateAction<string>>;
  isDetailsModalOpen: boolean;
  setIsDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTodo: any;
  setSelectedTodo: React.Dispatch<React.SetStateAction<any>>;
  isPauseModalOpen: boolean;
  setIsPauseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pauseTaskId: number | null;
  setPauseTaskId: React.Dispatch<React.SetStateAction<number | null>>;
  isPauseLoading: boolean;
  pendingPlayTaskId: number | null;
  setPendingPlayTaskId: React.Dispatch<React.SetStateAction<number | null>>;
  pendingPauseTaskId: number | null;
  setPendingPauseTaskId: React.Dispatch<React.SetStateAction<number | null>>;
  playingTaskIds: Set<number>;
  setPlayingTaskIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  pauseIssueId: number | null;
  setPauseIssueId: React.Dispatch<React.SetStateAction<number | null>>;
  pendingPlayIssueId: number | null;
  setPendingPlayIssueId: React.Dispatch<React.SetStateAction<number | null>>;
  pendingPauseIssueId: number | null;
  setPendingPauseIssueId: React.Dispatch<React.SetStateAction<number | null>>;
  pendingReopenItem: any;
  setPendingReopenItem: React.Dispatch<React.SetStateAction<any>>;
  reopenReason: string;
  setReopenReason: React.Dispatch<React.SetStateAction<string>>;
  isReopenLoading: boolean;
  setIsReopenLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAiPopupOpen: boolean;
  setIsAiPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  aiPopupTab: "accomplishments" | "plan";
  setAiPopupTab: React.Dispatch<React.SetStateAction<"accomplishments" | "plan">>;
  aiPromptText: string;
  setAiPromptText: React.Dispatch<React.SetStateAction<string>>;
  baseUrl: string | null;
  token: string | null;
  mergedTasksIssues: any[];
  setMergedTasksIssues: React.Dispatch<React.SetStateAction<any[]>>;
  selectedTasksIssues: { [key: string]: boolean };
  setSelectedTasksIssues: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  calendarStripRef: React.RefObject<HTMLDivElement>;
  isLoadingMore: boolean;
  hiddenAutoIds: Set<string>;
  setHiddenAutoIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  autoStarredIds: Set<string>;
  setAutoStarredIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  collapsedGroups: Set<string>;
  setCollapsedGroups: React.Dispatch<React.SetStateAction<Set<string>>>;
  pendingConfirmAction: { fn: () => void; label: string } | null;
  setPendingConfirmAction: React.Dispatch<
    React.SetStateAction<{ fn: () => void; label: string } | null>
  >;
  currentTasksPage: number;
  setCurrentTasksPage: React.Dispatch<React.SetStateAction<number>>;
  currentIssuesPage: number;
  setCurrentIssuesPage: React.Dispatch<React.SetStateAction<number>>;
  hasMoreTasks: boolean;
  hasMoreIssues: boolean;
  completedTasksIssuesToday: any[];
  completedItemsLoading: boolean;
  tomorrowScheduledItems: any[];
  tomorrowScheduledLoading: boolean;
  tomorrowFetchDone: boolean;
  hiddenTomorrowScheduledIds: Set<string>;
  setHiddenTomorrowScheduledIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  yesterdaySourceIds: Set<string>;
  setYesterdaySourceIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  planSourceCache: Record<string, any>;
  setPlanSourceCache: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  user: any;
  userId: any;
  rosterWorkingDays: Record<string, string[]> | null;
  setRosterWorkingDays: React.Dispatch<
    React.SetStateAction<Record<string, string[]> | null>
  >;
  fetchTasks: () => void;
  fetchIssues: () => void;
  isRosterHoliday: (date: Date) => boolean;
  getNextWorkingDay: (dateStr: string) => string;
  getPrevWorkingDay: (dateStr: string) => string;
  upsertCompletedItem: (item: any) => void;
  removeCompletedItem: (itemId: string) => void;
  markDraftDirty: () => void;
  getStoredDraft: (key?: string) => DailyReportDraft | null;
  clearStoredDraft: (key?: string) => void;
  clearStoredDraftsForDate: (date: string) => void;
  isLocallyDeletedReport: (report: any) => boolean;
  applyStoredDraft: (draft: DailyReportDraft | null, options?: ApplyDraftOptions) => void;
  applyDraftForMissingReport: () => void;
  tasksData: any;
  tasksLoading: boolean;
  refetchTasks: () => void;
  issuesData: any;
  issuesLoading: boolean;
  refetchIssues: () => void;
  todosData: any;
  todosLoading: boolean;
  refetchTodos: () => void;
  taskIssueCounts: {
    completed: number;
    open: number;
    overdue: number;
    onHold: number;
    inProgress: number;
    tasks: number;
    issues: number;
    todos: number;
    total: number;
  };
  openOnlyTaskIssueGroup: (activeKey: TaskIssueGroupKey) => void;
  openAllTaskIssueGroups: () => void;
  addedToTomorrowIds: Set<string>;
  autoAddedAccomplishments: any[];
  noteMatchedTaskIssues: any[];
  noteMatchedTaskIssueIds: Set<string>;
  visibleAccomplishments: AccomplishmentItem[];
  dedupedTomorrowItems: any[];
  kpis: any[];
  setKpis: React.Dispatch<React.SetStateAction<any[]>>;
  kpiLoading: boolean;
  kpiEntries: { [key: number]: string };
  setKpiEntries: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  dailyScore: any;
  addAccomplishment: () => void;
  removeAccomplishment: (id: string) => void;
  completeAccomplishmentConversion: () => void;
  toggleAccomplishment: (id: string) => void;
  toggleStar: (id: string) => void;
  addPlanningItem: () => void;
  removePlanningItem: (id: string) => void;
  togglePlanningStar: (id: string) => void;
  updatePlanningText: (id: string, text: string) => void;
  updateAccomplishmentText: (id: string, text: string) => void;
  transferUncheckedToTomorrow: () => void;
  hideAutoAccomplishment: (sourceId: string) => void;
  getBorrowedItemKey: (member: any, item: any) => string;
  toggleBorrowedAccomplishment: (member: any, item: any) => void;
  toggleBorrowedPlanItem: (member: any, item: any) => void;
  planningItemMatchesSourceItem: (plan: any, item: any) => boolean;
  addItemToTomorrow: (item: any) => void;
  toggleScheduledTomorrowStar: (item: any) => void;
  removeItemFromTomorrow: (item: any) => void;
  hideTomorrowScheduledItem: (item: any) => void;
  addAllOverdueToTomorrow: () => void;
  triggerFileUpload: () => void;
  triggerClosureFileUpload: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleClosureFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleMarkItemClosed: () => Promise<void>;
  handleCompleteItem: (item: any) => Promise<void>;
  handleRevertToOpen: (item: any, reason: string) => Promise<void>;
  handleOverdueReasonSubmit: (reason: string) => Promise<void>;
  handlePlayTask: (taskId: number) => Promise<void>;
  handlePauseTaskSubmit: (reason: string, taskId: number) => Promise<void>;
  handlePlayIssue: (issueId: number) => Promise<void>;
  handlePauseIssueSubmit: (reason: string, issueId: number) => Promise<void>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  currentReportId: number | null;
  setCurrentReportId: React.Dispatch<React.SetStateAction<number | null>>;
  reportsList: DailyReport[];
  setReportsList: React.Dispatch<React.SetStateAction<DailyReport[]>>;
  isHistoryLoading: boolean;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  taskStatusFilter: "open" | "overdue" | "in_progress" | "on_hold";
  setTaskStatusFilter: React.Dispatch<
    React.SetStateAction<"open" | "overdue" | "in_progress" | "on_hold">
  >;
  tasksSectionRef: React.RefObject<HTMLDivElement>;
  accomplishmentsSectionRef: React.RefObject<HTMLDivElement>;
  planningSectionRef: React.RefObject<HTMLDivElement>;
  calendarTodayRef: React.RefObject<HTMLDivElement>;
  resetReportFormState: () => void;
  viewStartDate: Date;
  setViewStartDate: React.Dispatch<React.SetStateAction<Date>>;
  todayDateKey: string;
  isDragging: boolean;
  hasDraggedRef: React.MutableRefObject<boolean>;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  handleWheel: (e: React.WheelEvent) => void;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  days: any[];
  handleSelectDate: (item: any) => void;
  nextDayLabel: string;
  fetchReportsListFn: () => Promise<void>;
  handleSubmit: () => Promise<void>;
  reporteeSummary: { total: number; submitted: number; missed: number };
  reporteeDepartments: any[];
  reporteeManagerName: string;
  isReporteeLoading: boolean;
  reporteeError: string | null;
  expandedReportees: string[];
  setExpandedReportees: React.Dispatch<React.SetStateAction<string[]>>;
  reporteeMembers: any[];
  toggleReportee: (id: string) => void;
  livePreviewMetrics: { accPct: number; timing: string };
  aiInsights: Array<{
    id: string;
    title: string;
    description: string;
    action: string;
    color: string;
    icon: React.ReactNode;
    onAction: () => void;
  }>;
  dailyAiSuggestions: Array<{
    tone: string;
    title: string;
    actionLabel: string;
    description: string;
    Icon: React.ComponentType<any>;
    action: () => void;
  }>;
  formattedSelectedDate: string;
  submitDateLabel: string;
  filteredTasksForTable: any[];
  handleDeleteReport: (report: DailyReport) => Promise<void>;
}

const DailyReportContext = createContext<DailyReportContextValue | null>(null);

export const useDailyReport = () => {
  const ctx = useContext(DailyReportContext);
  if (!ctx)
    throw new Error("useDailyReport must be used within DailyReportProvider");
  return ctx;
};

const apiCtx = () => ({
  baseUrl: localStorage.getItem("baseUrl") || "",
  token: localStorage.getItem("token") || "",
  userId: JSON.parse(localStorage.getItem("user") || "{}")?.id,
});

export const DailyReportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isPATMSynced = false;
  const navigate = useNavigate();
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(now.getDate().toString());
  const [startDate, setStartDate] = useState(now.toLocaleDateString("en-CA"));
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
  const [accomplishments, setAccomplishments] = useState<AccomplishmentItem[]>([]);
  const [planningItems, setPlanningItems] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [reportAttachments, setReportAttachments] = useState<AttachmentFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const closureFileInputRef = useRef<HTMLInputElement>(null);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState<any>(null);
  const [isEditIssueModalOpen, setIsEditIssueModalOpen] = useState(false);
  const [editIssueData, setEditIssueData] = useState<any>(null);
  const [isEditTodoModalOpen, setIsEditTodoModalOpen] = useState(false);
  const [editTodoData, setEditTodoData] = useState<any>(null);
  const [isTodoDetailsLoading, setIsTodoDetailsLoading] = useState(false);

  const [taskIssueMenuAnchor, setTaskIssueMenuAnchor] = useState<null | HTMLElement>(null);
  const [isTaskCreateModalOpen, setIsTaskCreateModalOpen] = useState(false);
  const [isIssueCreateModalOpen, setIsIssueCreateModalOpen] = useState(false);
  const [isTodoCreateModalOpen, setIsTodoCreateModalOpen] = useState(false);
  const [planDateResetKey, setPlanDateResetKey] = useState(0);
  const [isFromPlan, setIsFromPlan] = useState(false);
  const [planningMenuAnchor, setPlanningMenuAnchor] = useState<null | HTMLElement>(null);
  const [convertMenuAnchor, setConvertMenuAnchor] = useState<null | HTMLElement>(null);
  const [convertMenuItem, setConvertMenuItem] = useState<AccomplishmentItem | null>(null);
  const [convertTitle, setConvertTitle] = useState("");
  const [isFromConvert, setIsFromConvert] = useState(false);
  const pendingConvertItemRef = useRef<AccomplishmentItem | null>(null);

  useEffect(() => {
    if (!convertMenuAnchor) return;
    const handleScroll = () => {
      setConvertMenuAnchor(null);
      setConvertMenuItem(null);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [convertMenuAnchor]);

  const [showClosureModal, setShowClosureModal] = useState(false);
  const [closureItem, setClosureItem] = useState<any>(null);
  const [closureRemarks, setClosureRemarks] = useState("");
  const [closureAttachments, setClosureAttachments] = useState<any[]>([]);
  const [isClosureSubmitting, setIsClosureSubmitting] = useState(false);
  const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);
  const [overdueItemId, setOverdueItemId] = useState<string | null>(null);
  const [isOverdueLoading, setIsOverdueLoading] = useState(false);
  const [overdueReason, setOverdueReason] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<any>(null);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [pauseTaskId, setPauseTaskId] = useState<number | null>(null);
  const [isPauseLoading, setIsPauseLoading] = useState(false);
  const [pendingPlayTaskId, setPendingPlayTaskId] = useState<number | null>(null);
  const [pendingPauseTaskId, setPendingPauseTaskId] = useState<number | null>(null);
  const [playingTaskIds, setPlayingTaskIds] = useState<Set<number>>(new Set());
  const [pauseIssueId, setPauseIssueId] = useState<number | null>(null);
  const [pendingPlayIssueId, setPendingPlayIssueId] = useState<number | null>(null);
  const [pendingPauseIssueId, setPendingPauseIssueId] = useState<number | null>(null);
  const [pendingReopenItem, setPendingReopenItem] = useState<any>(null);
  const [reopenReason, setReopenReason] = useState("");
  const [isReopenLoading, setIsReopenLoading] = useState(false);
  const [isAiPopupOpen, setIsAiPopupOpen] = useState(false);
  const [aiPopupTab, setAiPopupTab] = useState<"accomplishments" | "plan">("accomplishments");
  const [aiPromptText, setAiPromptText] = useState("");

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const [mergedTasksIssues, setMergedTasksIssues] = useState<any[]>([]);
  const [selectedTasksIssues, setSelectedTasksIssues] = useState<{ [key: string]: boolean }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const calendarStripRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hiddenAutoIds, setHiddenAutoIds] = useState<Set<string>>(new Set());
  const [autoStarredIds, setAutoStarredIds] = useState<Set<string>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [pendingConfirmAction, setPendingConfirmAction] = useState<{ fn: () => void; label: string } | null>(null);

  const [currentTasksPage, setCurrentTasksPage] = useState(1);
  const [currentIssuesPage, setCurrentIssuesPage] = useState(1);
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [hasMoreIssues, setHasMoreIssues] = useState(true);
  const [completedTasksIssuesToday, setCompletedTasksIssuesToday] = useState<any[]>([]);
  const [completedItemsLoading, setCompletedItemsLoading] = useState(false);
  const [tomorrowScheduledItems, setTomorrowScheduledItems] = useState<any[]>([]);
  const [tomorrowScheduledLoading, setTomorrowScheduledLoading] = useState(false);
  const [tomorrowFetchDone, setTomorrowFetchDone] = useState(false);
  const [hiddenTomorrowScheduledIds, setHiddenTomorrowScheduledIds] = useState<Set<string>>(new Set());
  const [yesterdaySourceIds, setYesterdaySourceIds] = useState<Set<string>>(new Set());
  const [planSourceCache, setPlanSourceCache] = useState<Record<string, any>>({});

  const user =
    typeof localStorage !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userId = user?.id;

  const [rosterWorkingDays, setRosterWorkingDays] = useState<Record<string, string[]> | null>(null);

  useEffect(() => {
    const rosterId = user?.user_roster_id;
    if (!rosterId || !baseUrl || !token) return;
    fetchRosterWorkingDays(apiCtx(), rosterId)
      .then((days) => {
        if (days && typeof days === "object") setRosterWorkingDays(days);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = () => {
    if (!baseUrl || !token || !userId) return;
    setCurrentTasksPage(1);
  };

  const fetchIssues = () => {
    if (!baseUrl || !token || !userId) return;
    setCurrentIssuesPage(1);
  };

  const isRosterHoliday = (date: Date): boolean => {
    const jsDay = date.getDay();
    const rosterDay = jsDay === 0 ? 7 : jsDay;
    const weekOfMonth = Math.ceil(date.getDate() / 7).toString();
    if (rosterWorkingDays) {
      return !rosterWorkingDays[weekOfMonth]?.includes(rosterDay.toString());
    }
    return jsDay === 0 || jsDay === 6;
  };

  const getNextWorkingDay = (dateStr: string): string => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    while (isRosterHoliday(date)) {
      date.setDate(date.getDate() + 1);
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const getPrevWorkingDay = (dateStr: string): string => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    while (isRosterHoliday(date)) {
      date.setDate(date.getDate() - 1);
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    const forDate = startDate;
    if (!baseUrl || !token || !userId) return;
    let active = true;
    setTomorrowFetchDone(false);
    setTomorrowScheduledLoading(true);
    const nextDay = getNextWorkingDay(forDate);
    fetchTomorrowScheduled(apiCtx(), nextDay)
      .then(({ tasks, issues, todos }) => {
        const combined = [
          ...tasks
            .filter((t: any) => !isCompleted(t.status))
            .map((t: any) => ({
              id: `task-${t.id}`,
              title: t.title || t.name || "",
              type: "task" as const,
              priority: t.priority || null,
              originalData: t,
            })),
          ...issues
            .filter((i: any) => !isCompleted(i.status))
            .map((i: any) => ({
              id: `issue-${i.id}`,
              title: i.title || "",
              type: "issue" as const,
              priority: i.priority || null,
              originalData: i,
            })),
          ...todos
            .filter((t: any) => !isCompleted(t.status))
            .map((t: any) => ({
              id: `todo-${t.id}`,
              title: t.title || "",
              type: "todo" as const,
              priority: t.priority || null,
              originalData: t,
            })),
        ].filter((item) => item.title.trim() !== "");
        if (active) setTomorrowScheduledItems(combined);
      })
      .catch((err) => {
        console.error("Failed to fetch tomorrow's scheduled items:", err);
        if (active) setTomorrowScheduledItems([]);
      })
      .finally(() => {
        if (active) {
          setTomorrowScheduledLoading(false);
          setTomorrowFetchDone(true);
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, baseUrl, token, userId]);

  useEffect(() => {
    const forDate = startDate;
    if (!baseUrl || !token || !userId || !forDate) return;
    let active = true;
    setCompletedItemsLoading(true);
    fetchCompletedItemsForDate(apiCtx(), forDate)
      .then(({ tasks, issues, todos }) => {
        const transformedTasks = tasks.map((task: any) => ({
          id: `task-${task.id}`,
          title: task.title,
          type: "task",
          status: task.status || "completed",
          priority: task.priority || "Medium",
          created_at: task.created_at,
          responsible: task.responsible_person_id,
          originalData: task,
        }));

        const transformedIssues = issues.map((issue: any) => ({
          id: `issue-${issue.id}`,
          title: issue.title,
          type: "issue",
          status: issue.status || "completed",
          priority: issue.priority || "Medium",
          created_at: issue.created_at,
          responsible: issue.responsible_person_id,
          originalData: issue,
        }));

        const transformedTodos = todos.map((todo: any) => {
          if (todo.task_management) {
            const task = todo.task_management;
            return {
              id: `task-${task.id}`,
              title: task.title || todo.title,
              type: "task",
              status: task.status || "completed",
              priority: task.priority || todo.priority || "Medium",
              created_at: task.created_at,
              responsible: task.responsible_person_id,
              originalData: task,
            };
          }
          return {
            id: `todo-${todo.id}`,
            title: todo.title,
            type: "todo",
            status: todo.status || "completed",
            priority: todo.priority || "Medium",
            created_at: todo.created_at,
            responsible: todo.user_id,
            originalData: todo,
          };
        });

        const todoPromotedTaskIds = new Set(
          transformedTodos.filter((t) => t.type === "task").map((t) => t.id)
        );
        const dedupedTasks = transformedTasks.filter(
          (t: any) => !todoPromotedTaskIds.has(t.id)
        );

        if (active)
          setCompletedTasksIssuesToday([
            ...dedupedTasks,
            ...transformedIssues,
            ...transformedTodos,
          ]);
      })
      .catch((err) => {
        console.error("Failed to fetch completed items for date:", err);
      })
      .finally(() => {
        if (active) setCompletedItemsLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, baseUrl, token, userId]);

  const upsertCompletedItem = (item: any) => {
    setCompletedTasksIssuesToday((prev) => {
      const withoutItem = prev.filter((i) => i.id !== item.id);
      return [...withoutItem, { ...item, status: "completed" }];
    });
  };

  const removeCompletedItem = (itemId: string) => {
    setCompletedTasksIssuesToday((prev) => prev.filter((i) => i.id !== itemId));
  };

  const buildDraftKey = (date: string) => buildDraftStorageKey(date, userId);
  const canPersistDraftRef = useRef(false);
  const draftDirtyRef = useRef(false);
  const deletedReportIdsRef = useRef<Set<number>>(new Set());
  const deletedReportDatesRef = useRef<Set<string>>(new Set());

  const markDraftDirty = useCallback(() => {
    draftDirtyRef.current = true;
    canPersistDraftRef.current = true;
  }, []);

  const getStoredDraft = useCallback(
    (key = buildDraftKey(startDate)): DailyReportDraft | null => {
      try {
        const rawDraft = localStorage.getItem(key);
        return rawDraft ? JSON.parse(rawDraft) : null;
      } catch {
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [startDate, userId]
  );

  const clearStoredDraft = useCallback(
    (key = buildDraftKey(startDate)) => {
      localStorage.removeItem(key);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [startDate, userId]
  );

  const clearStoredDraftsForDate = useCallback(
    (date: string) => {
      const dateKey = getReportDateKey(date);
      const draftPrefix = "business-compass-daily-report-draft:";

      [
        buildDraftStorageKey(dateKey, userId),
        buildDraftStorageKey(dateKey, userId),
        buildDraftStorageKey(dateKey, "guest"),
      ].forEach((key) => localStorage.removeItem(key));

      for (let i = localStorage.length - 1; i >= 0; i -= 1) {
        const key = localStorage.key(i);
        if (
          key?.startsWith(draftPrefix) &&
          getReportDateKey(key.split(":").pop()) === dateKey
        ) {
          localStorage.removeItem(key);
        }
      }
    },
    [userId]
  );

  const isLocallyDeletedReport = useCallback((report: any) => {
    const reportId = Number(report?.id);
    const reportDate = getReportDateKey(report?.start_date);
    return (
      (Number.isFinite(reportId) && deletedReportIdsRef.current.has(reportId)) ||
      (!!reportDate && deletedReportDatesRef.current.has(reportDate))
    );
  }, []);

  const applyStoredDraft = useCallback(
    (draft: DailyReportDraft | null, options: ApplyDraftOptions = {}) => {
      if (!draft) return;
      if (!hasMeaningfulDraftData(draft)) return;
      const allowEmptyLists = options.allowEmptyLists ?? false;
      const mergeWithCurrent = options.mergeWithCurrent ?? false;
      if (Array.isArray(draft.accomplishments)) {
        const cleanAccomplishments = draft.accomplishments
          .filter((a) => cleanReportText(a.text) !== "")
          .map((a) => ({ ...a, text: cleanReportText(a.text) }));
        if (cleanAccomplishments.length || allowEmptyLists) {
          if (mergeWithCurrent) {
            const draftTexts = new Set(
              cleanAccomplishments.map((a) => a.text.toLowerCase())
            );
            setAccomplishments((prev) => [
              ...cleanAccomplishments,
              ...prev.filter(
                (a) => !draftTexts.has(cleanReportText(a.text).toLowerCase())
              ),
            ]);
          } else {
            setAccomplishments(cleanAccomplishments);
          }
        }
      }
      if (Array.isArray(draft.planningItems)) {
        const cleanPlanningItems = draft.planningItems
          .filter((p) => cleanReportText(p.text) !== "")
          .map((p) => ({ ...p, text: cleanReportText(p.text) }));
        if (cleanPlanningItems.length || allowEmptyLists) {
          if (mergeWithCurrent) {
            const draftTexts = new Set(
              cleanPlanningItems.map((p) => p.text.toLowerCase())
            );
            setPlanningItems((prev) => [
              ...cleanPlanningItems,
              ...prev.filter(
                (p) => !draftTexts.has(cleanReportText(p.text).toLowerCase())
              ),
            ]);
          } else {
            setPlanningItems(cleanPlanningItems);
          }
        }
      }
      if (Array.isArray(draft.selfRating)) setSelfRating(draft.selfRating);
      if (typeof draft.isAbsent === "boolean") setIsAbsent(draft.isAbsent);
      if (typeof draft.absenceReason === "string")
        setAbsenceReason(draft.absenceReason);
      if (draft.kpiEntries && typeof draft.kpiEntries === "object")
        setKpiEntries(draft.kpiEntries);
      if (draft.selectedTasksIssues && typeof draft.selectedTasksIssues === "object") {
        setSelectedTasksIssues(draft.selectedTasksIssues);
      }
      if (Array.isArray(draft.hiddenAutoIds)) {
        setHiddenAutoIds(new Set(draft.hiddenAutoIds));
      }
    },
    []
  );

  const applyDraftForMissingReport = useCallback(() => {
    const draft = getStoredDraft();
    if (!draft) return;
    if (isReportBackedDraft(draft)) {
      clearStoredDraft();
      return;
    }
    applyStoredDraft(draft, { allowEmptyLists: true, mergeWithCurrent: true });
  }, [applyStoredDraft, clearStoredDraft, getStoredDraft]);

  const myIssuesFilter = `
  for_date=${startDate}
  ${userId ? `&q[responsible_person_id_eq]=${userId}` : ""}
`.replace(/\s+/g, "");

  const {
    data: tasksData,
    isLoading: tasksLoading,
    refetch: refetchTasks,
  } = useBusinessCompassTasks({
    page: currentTasksPage,
    filters: { for_date: startDate },
  });

  const {
    data: issuesData,
    isLoading: issuesLoading,
    refetch: refetchIssues,
  } = useBusinessCompassIssues({
    page: currentIssuesPage,
    filters: myIssuesFilter,
    enabled: !!token && !!userId,
  });

  const {
    data: todosData,
    isLoading: todosLoading,
    refetch: refetchTodos,
  } = useBusinessCompassTodos({
    page: 1,
    filters: {
      for_date: startDate,
      "q[user_id_eq]": userId?.toString() || "",
    },
    enabled: !!token && !!userId,
  });

  useEffect(() => {
    const tasks = tasksData?.tasks || [];
    const issues = issuesData?.issues || [];
    const todos = todosData?.todos || [];
    const tasksPagination = tasksData?.meta;
    const issuesPagination = issuesData?.meta;

    setHasMoreTasks(currentTasksPage < (tasksPagination?.total_pages || 1));
    setHasMoreIssues(currentIssuesPage < (issuesPagination?.total_pages || 1));

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

    const transformedTodos = todos.map((todo: any) => {
      if (todo.task_management) {
        const task = todo.task_management;
        return {
          id: `task-${task.id}`,
          title: task.title || todo.title,
          type: "task",
          status: task.status || "open",
          priority: task.priority || todo.priority || "Medium",
          created_at: task.created_at,
          responsible: task.responsible_person_id,
          originalData: task,
        };
      }
      return {
        id: `todo-${todo.id}`,
        title: todo.title,
        type: "todo",
        status: todo.status || "open",
        priority: todo.priority || "Medium",
        created_at: todo.created_at,
        responsible: todo.user_id,
        originalData: todo,
      };
    });

    const todoPromotedTaskIds = new Set(
      transformedTodos.filter((t) => t.type === "task").map((t) => t.id)
    );
    const dedupedTasks = transformedTasks.filter(
      (t: any) => !todoPromotedTaskIds.has(t.id)
    );

    const sortItems = (items: any[]) =>
      items.sort((a, b) => {
        const aOverdue = a.status === "overdue" ? 0 : 1;
        const bOverdue = b.status === "overdue" ? 0 : 1;
        if (aOverdue !== bOverdue) return aOverdue - bOverdue;
        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      });

    const newData = sortItems([
      ...dedupedTasks,
      ...transformedIssues,
      ...transformedTodos,
    ]);

    if (currentTasksPage === 1 && currentIssuesPage === 1) {
      setMergedTasksIssues(newData);
    } else {
      setMergedTasksIssues((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewData = newData.filter(
          (item) => !existingIds.has(item.id)
        );
        return sortItems([...prev, ...uniqueNewData]);
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
    setHiddenAutoIds(new Set());
    setAutoStarredIds(new Set());
    setYesterdaySourceIds(new Set());
  }, [startDate]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (
        isNearBottom &&
        !isLoadingMore &&
        !tasksLoading &&
        !issuesLoading &&
        !todosLoading
      ) {
        setIsLoadingMore(true);
        if (hasMoreTasks) setCurrentTasksPage((prev) => prev + 1);
        if (hasMoreIssues) setCurrentIssuesPage((prev) => prev + 1);
        if (!hasMoreTasks && !hasMoreIssues) setIsLoadingMore(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [
    isLoadingMore,
    tasksLoading,
    issuesLoading,
    todosLoading,
    hasMoreTasks,
    hasMoreIssues,
  ]);

  const openOnlyTaskIssueGroup = (activeKey: TaskIssueGroupKey) => {
    setCollapsedGroups((prev) => {
      const next = new Set([...prev].filter((key) => !taskIssueGroupKeySet.has(key)));
      taskIssueGroupKeys.forEach((key) => {
        if (key !== activeKey) next.add(key);
      });
      return next;
    });
  };

  const openAllTaskIssueGroups = () => {
    setCollapsedGroups((prev) => {
      return new Set([...prev].filter((key) => !taskIssueGroupKeySet.has(key)));
    });
  };

  const addedToTomorrowIds = useMemo(() => {
    const ids = new Set<string>();
    const planTexts = planningItems.map((p) => cleanReportText(p.text).toLowerCase());
    mergedTasksIssues.forEach((item) => {
      const text = cleanReportText(item.title || "").toLowerCase();
      if (text && planTexts.includes(text)) {
        ids.add(item.id);
      }
    });
    console.log(
      "[AddedToTomorrow debug] planningItems texts:",
      planningItems.map((p) => ({ id: p.id, text: p.text, cleaned: cleanReportText(p.text).toLowerCase() }))
    );
    console.log(
      "[AddedToTomorrow debug] mergedTasksIssues titles:",
      mergedTasksIssues.map((i) => ({ id: i.id, title: i.title, cleaned: cleanReportText(i.title || "").toLowerCase() }))
    );
    console.log("[AddedToTomorrow debug] matched ids:", Array.from(ids));
    return ids;
  }, [mergedTasksIssues, planningItems]);

  const autoAddedAccomplishments = useMemo(() => {
    return completedTasksIssuesToday.filter((item) => {
      return (
        isCompleted(item.status) &&
        !hiddenAutoIds.has(item.id) &&
        !!(item.title || "").trim() &&
        !addedToTomorrowIds.has(item.id)
      );
    });
  }, [completedTasksIssuesToday, hiddenAutoIds, addedToTomorrowIds]);

  const noteMatchedTaskIssues = useMemo(() => {
    const noteTexts = new Set(
      accomplishments
        .map((a) => cleanReportText(a.text).toLowerCase())
        .filter((text) => text !== "")
    );
    if (!noteTexts.size) return [];
    return mergedTasksIssues.filter((item) => {
      const title = cleanReportText(item.title || "").toLowerCase();
      return title !== "" && noteTexts.has(title);
    });
  }, [accomplishments, mergedTasksIssues]);

  const noteMatchedTaskIssueIds = useMemo(
    () => new Set(noteMatchedTaskIssues.map((item) => item.id)),
    [noteMatchedTaskIssues]
  );

  const taskIssueCounts = useMemo(() => {
    let completed = 0, open = 0, overdue = 0, onHold = 0, inProgress = 0, tasks = 0, issues = 0, todos = 0;
    for (const item of mergedTasksIssues) {
      const st = item.status;
      const isPlayed = item.originalData?.is_started || item.is_started || playingTaskIds.has(item.originalData?.id);
      const isDone = st === "completed" || st === "closed" || st === "done";
      const d = item.originalData;
      const isOverdueByDate =
        !isDone &&
        !!getOverdueLabel(d?.target_date || d?.due_date || d?.end_date);
      const isInPlanForToday =
        (yesterdaySourceIds.has(item.id) || noteMatchedTaskIssueIds.has(item.id)) &&
        !isPlayed;
      if (isInPlanForToday || addedToTomorrowIds.has(item.id)) {
        // Shown only in "Plan for Today" / already moved to tomorrow's plan —
        // don't double-count it into a status bucket too.
      } else if (isDone) completed++;
      else if (isOverdueByDate || st === "overdue" || st === "overdued") overdue++;
      else if (st === "on_hold") onHold++;
      else if (st === "in_progress" || (["open", "pending"].includes(st) && isPlayed)) inProgress++;
      else if ((st === "open" || st === "reopen") && !isPlayed) open++;
      if (item.type === "task") tasks++;
      else if (item.type === "issue") issues++;
      else if (item.type === "todo") todos++;
    }
    return { completed, open, overdue, onHold, inProgress, tasks, issues, todos, total: mergedTasksIssues.length };
  }, [mergedTasksIssues, playingTaskIds, yesterdaySourceIds, noteMatchedTaskIssueIds, addedToTomorrowIds]);

  const visibleAccomplishments = useMemo(() => {
    const autoTitles = new Set(
      autoAddedAccomplishments.map((item) =>
        cleanReportText(item.title || "").toLowerCase()
      )
    );
    const taskIssueTitles = new Set(
      noteMatchedTaskIssues.map((item) =>
        cleanReportText(item.title || "").toLowerCase()
      )
    );
    const filtered = accomplishments.filter((a) => {
      const text = cleanReportText(a.text).toLowerCase();
      return !autoTitles.has(text) && !taskIssueTitles.has(text);
    });
    return [...filtered].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  }, [accomplishments, autoAddedAccomplishments, noteMatchedTaskIssues]);

  const dedupedTomorrowItems = useMemo(() => {
    return tomorrowScheduledItems.filter(
      (item) => !hiddenTomorrowScheduledIds.has(item.id)
    );
  }, [hiddenTomorrowScheduledIds, tomorrowScheduledItems]);

  useEffect(() => {
    setHiddenTomorrowScheduledIds(new Set());
  }, [startDate]);

  const [kpis, setKpis] = useState<any[]>([]);
  const [kpiLoading, setKpiLoading] = useState(false);
  const [kpiEntries, setKpiEntries] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        setKpiLoading(true);
        const { kpis: kpiList, entries } = await fetchKpis(startDate);
        setKpis(kpiList);
        setKpiEntries(entries);
      } catch (error) {
        console.error("Error fetching KPIs:", error);
      } finally {
        setKpiLoading(false);
      }
    };
    if (startDate) fetchKpiData();
  }, [startDate]);

  const dailyScore = useMemo(() => {
    const kpisWithActualValues = kpis.map((kpi) => ({
      ...kpi,
      actual_value: kpiEntries[kpi.kpi_id] || 0,
    }));
    const nonEmptyAccomplishments = [
      ...visibleAccomplishments.filter((a) => cleanReportText(a.text) !== ""),
      ...autoAddedAccomplishments.map((item) => {
        const autoStarKey = String(item.id);
        const isStarred = autoStarredIds.has(autoStarKey);
        return {
          id: `auto-${autoStarKey}`,
          text: item.title || "",
          completed: true,
          starred: isStarred,
          star: isStarred,
          is_starred: isStarred,
        };
      }),
    ];
    const nonEmptyPlanningItems = planningItems.filter(
      (p) => cleanReportText(p.text) !== ""
    );
    return calculateLivePreviewScore(
      kpisWithActualValues,
      nonEmptyAccomplishments,
      mergedTasksIssues,
      nonEmptyPlanningItems
    );
  }, [
    kpis,
    kpiEntries,
    visibleAccomplishments,
    autoAddedAccomplishments,
    autoStarredIds,
    mergedTasksIssues,
    planningItems,
  ]);

  const addAccomplishment = () => {
    markDraftDirty();
    const id = Date.now().toString();
    setAccomplishments([
      {
        id,
        text: "",
        completed: true,
        starred: false,
        fromYesterday: false,
      },
      ...accomplishments,
    ]);
  };

  const removeAccomplishment = (id: string) => {
    markDraftDirty();
    setAccomplishments(accomplishments.filter((a) => a.id !== id));
    setPlanningItems((prev) => prev.filter((p) => p.id !== `from-accom-${id}`));
  };

  const completeAccomplishmentConversion = useCallback(() => {
    const item = pendingConvertItemRef.current;
    if (!item) return;
    pendingConvertItemRef.current = null;
    markDraftDirty();
    setAccomplishments((prev) => prev.filter((a) => a.id !== item.id));
  }, [markDraftDirty]);

  const toggleAccomplishment = (id: string) => {
    markDraftDirty();
    const item = accomplishments.find((a) => a.id === id);
    setAccomplishments(
      accomplishments.map((a) =>
        a.id === id ? { ...a, completed: !a.completed } : a
      )
    );
  };

  const toggleStar = (id: string) => {
    markDraftDirty();
    setAccomplishments(
      accomplishments.map((a) =>
        a.id === id ? { ...a, starred: !a.starred } : a
      )
    );
  };

  const addPlanningItem = () => {
    markDraftDirty();
    setPlanningItems([
      { id: Date.now().toString(), text: "", starred: false },
      ...planningItems,
    ]);
  };

  const removePlanningItem = (id: string) => {
    markDraftDirty();
    if (id.startsWith("from-accom-")) {
      const originalId = id.replace("from-accom-", "");
      const planItem = planningItems.find((p) => p.id === id);
      if (planItem && !accomplishments.some((a) => a.id === originalId)) {
        setAccomplishments((prev) => [
          ...prev,
          { id: originalId, text: planItem.text, completed: false, starred: false },
        ]);
      }
    }
    setPlanningItems(planningItems.filter((p) => p.id !== id));
  };

  const togglePlanningStar = (id: string) => {
    markDraftDirty();
    setPlanningItems(
      planningItems.map((p) =>
        p.id === id ? { ...p, starred: !p.starred } : p
      )
    );
  };

  const updatePlanningText = (id: string, text: string) => {
    markDraftDirty();
    setPlanningItems(
      planningItems.map((p) => (p.id === id ? { ...p, text } : p))
    );
  };

  const updateAccomplishmentText = (id: string, text: string) => {
    markDraftDirty();
    setAccomplishments(
      accomplishments.map((a) => (a.id === id ? { ...a, text } : a))
    );
    setPlanningItems((prev) =>
      prev.map((p) => (p.id === `from-accom-${id}` ? { ...p, text } : p))
    );
  };

  const transferUncheckedToTomorrow = () => {
    markDraftDirty();
    const unchecked = accomplishments.filter((a) => !a.completed);
    const newPlanItems = unchecked.map((a) => ({
      id: `transferred-${Date.now()}-${a.id}`,
      text: a.text,
      starred: a.starred,
    }));
    setPlanningItems((prev) => [...prev, ...newPlanItems]);
    setAccomplishments((prev) => prev.filter((a) => a.completed));
  };

  const hideAutoAccomplishment = (sourceId: string) => {
    markDraftDirty();
    setHiddenAutoIds((prev) => new Set([...prev, sourceId]));
  };

  const getBorrowedItemKey = (member: any, item: any) => {
    const sourceId = item?.originalData?.id ?? item?.source_id;
    const sourceType = item?.source_type || item?.type || "note";
    const identity = sourceId ?? cleanReportText(item?.title || item?.text || item?.name || "");
    return `${member?.user_id}:${sourceType}:${identity}`;
  };

  const toggleBorrowedAccomplishment = (member: any, item: any) => {
    const text = cleanReportText(item?.title || item?.text || item?.name || "");
    if (!text) return;
    const id = `borrowed-${getBorrowedItemKey(member, item)}`;
    markDraftDirty();
    setAccomplishments((prev) =>
      prev.some((a) => a.id === id)
        ? prev.filter((a) => a.id !== id)
        : [
            {
              id,
              text,
              completed: true,
              starred: false,
              ownerId: member?.user_id ?? null,
              ownerName: member?.name?.trim() || "",
              ...buildItemSourceRef(item),
              originalData: item?.originalData ?? null,
            },
            ...prev,
          ]
    );
  };

  const toggleBorrowedPlanItem = (member: any, item: any) => {
    const text = cleanReportText(item?.title || item?.text || item?.name || "");
    if (!text) return;
    const id = `borrowed-plan-${getBorrowedItemKey(member, item)}`;
    markDraftDirty();
    setPlanningItems((prev) =>
      prev.some((p) => p.id === id)
        ? prev.filter((p) => p.id !== id)
        : [
            {
              id,
              text,
              starred: false,
              ownerId: member?.user_id ?? null,
              ownerName: member?.name?.trim() || "",
              ...buildItemSourceRef(item),
              originalData: item?.originalData ?? null,
            },
            ...prev,
          ]
    );
  };

  const planningItemMatchesSourceItem = (
    plan: { text: string; source_id?: number | null; source_type?: string | null },
    item: any
  ) => {
    const sourceId = item.originalData?.id ?? null;
    const itemText = cleanReportText(item.title || item.text || "").toLowerCase();
    return (
      (plan.source_id != null &&
        sourceId != null &&
        plan.source_id === sourceId &&
        (!plan.source_type || plan.source_type === item.type)) ||
      cleanReportText(plan.text).toLowerCase() === itemText
    );
  };

  const addItemToTomorrow = (item: any) => {
    const text = cleanReportText(item.title || item.text || "");
    if (!text) return;
    const alreadyInPlan = planningItems.some(
      (p) => cleanReportText(p.text).toLowerCase() === text.toLowerCase()
    );
    if (!alreadyInPlan) {
      const sourceId = item.originalData?.id ?? null;
      const sourceType = item.type ?? null;
      setPlanningItems((prev) => [
        ...prev,
        {
          id: `tomorrow-${item.id}-${Date.now()}`,
          text,
          starred: false,
          source_id: sourceId,
          source_type: sourceType,
          originalData: item.originalData ?? null,
        },
      ]);
      markDraftDirty();
    }
  };

  const toggleScheduledTomorrowStar = (item: any) => {
    const text = cleanReportText(item.title || item.text || "");
    if (!text) return;

    setPlanningItems((prev) => {
      let found = false;
      const updated = prev.map((plan) => {
        if (!found && planningItemMatchesSourceItem(plan, item)) {
          found = true;
          return { ...plan, starred: !plan.starred };
        }
        return plan;
      });

      if (found) return updated;

      return [
        ...updated,
        {
          id: `tomorrow-${item.id}-${Date.now()}`,
          text,
          starred: true,
          source_id: item.originalData?.id ?? null,
          source_type: item.type ?? null,
          originalData: item.originalData ?? null,
        },
      ];
    });
    markDraftDirty();
  };

  const removeItemFromTomorrow = (item: any) => {
    const text = cleanReportText(item.title || item.text || "").toLowerCase();
    setPlanningItems((prev) =>
      prev.filter((p) => cleanReportText(p.text).toLowerCase() !== text)
    );
    markDraftDirty();
  };

  const hideTomorrowScheduledItem = (item: any) => {
    setHiddenTomorrowScheduledIds((prev) => new Set([...prev, item.id]));
    removeItemFromTomorrow(item);
  };

  const addAllOverdueToTomorrow = () => {
    mergedTasksIssues
      .filter((item) => {
        const isDone = ["completed", "closed", "done"].includes(item.status);
        if (isDone) return false;
        const d = item.originalData;
        const isOverdueByDate = !!getOverdueLabel(
          d?.target_date || d?.due_date || d?.end_date
        );
        return (
          isOverdueByDate ||
          item.status === "overdue" ||
          item.status === "overdued"
        );
      })
      .forEach(addItemToTomorrow);
  };

  const triggerFileUpload = () => fileInputRef.current?.click();
  const triggerClosureFileUpload = () => closureFileInputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    markDraftDirty();
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClosureFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const realId = markItemClosedWithAttachments(apiCtx(), closureItem, closureAttachments);
      setMergedTasksIssues((prev) =>
        prev.map((item) =>
          item.id === closureItem.id ? { ...item, status: "completed" } : item
        )
      );
      markDraftDirty();
      setSelectedTasksIssues((prev) => ({ ...prev, [closureItem.id]: true }));

      await realId;

      if (closureRemarks.trim()) {
        const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
        const isTask = closureItem.type === "task";
        const isTodo = closureItem.type === "todo";
        await postComment(apiCtx(), {
          body: `Closure Remarks: ${closureRemarks}`,
          commentable_id: await realId,
          commentable_type: isTask ? "TaskManagement" : isTodo ? "Todo" : "Issue",
          commentor_id: userId,
          active: true,
        });
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

  const handleCompleteItem = async (item: any) => {
    try {
      const isTask = item.type === "task";
      const isTodo = item.type === "todo";
      const realId = Number(item.id.replace("task-", "").replace("issue-", "").replace("todo-", ""));
      const targetDate = item.originalData?.target_date || item.originalData?.due_date;

      const isDateOverdue = (dateStr: string | undefined) => {
        if (!dateStr) return false;
        const itemDate = new Date(dateStr);
        const today = new Date();
        itemDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return itemDate < today;
      };

      if (isDateOverdue(targetDate)) {
        setOverdueItemId(item.id);
        setIsOverdueModalOpen(true);
        return;
      }

      setMergedTasksIssues((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "completed" } : i))
      );
      setSelectedTasksIssues((prev) => ({ ...prev, [item.id]: true }));
      upsertCompletedItem(item);

      if (isTask) {
        await completeTask(apiCtx(), realId, "completed");
      } else if (isTodo) {
        await completeTodo(apiCtx(), realId, "completed");
      } else {
        await completeIssue(apiCtx(), realId, "completed");
      }

      toast.success(
        `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} completed successfully`
      );
    } catch (error) {
      console.error("Error completing item:", error);
      toast.error(`Failed to complete ${item.type}`);
      setMergedTasksIssues((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: item.status } : i))
      );
      removeCompletedItem(item.id);
    }
  };

  const handleRevertToOpen = async (item: any, reason: string) => {
    const realId = Number(item.id.replace("task-", "").replace("issue-", "").replace("todo-", ""));
    const isTask = item.type === "task";
    const isTodo = item.type === "todo";
    const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

    setMergedTasksIssues((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "open" } : i))
    );
    removeCompletedItem(item.id);
    setSelectedTasksIssues((prev) => ({ ...prev, [item.id]: false }));

    try {
      if (isTask) {
        await completeTask(apiCtx(), realId, "open");
        if (reason.trim()) {
          await postComment(apiCtx(), {
            body: `Reopened: ${reason}`,
            commentable_id: Number(realId),
            commentable_type: "TaskManagement",
            commentor_id: userId,
          });
        }
      } else if (isTodo) {
        await completeTodo(apiCtx(), realId, "open");
      } else {
        await completeIssue(apiCtx(), realId, "open");
        if (reason.trim()) {
          await postComment(apiCtx(), {
            body: `Reopened: ${reason}`,
            commentable_id: Number(realId),
            commentable_type: "Issue",
            commentor_id: userId,
          });
        }
      }
      toast.success(
        `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} marked as open`
      );
    } catch (error) {
      console.error("Error reverting status:", error);
      toast.error(`Failed to revert ${item.type}`);
      setMergedTasksIssues((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: item.status } : i))
      );
      upsertCompletedItem(item);
    }
  };

  const handleOverdueReasonSubmit = async (reason: string) => {
    if (!overdueItemId) return;

    setIsOverdueLoading(true);
    try {
      const item = mergedTasksIssues.find((i) => i.id === overdueItemId);
      if (!item) return;

      const isTask = item.type === "task";
      const isTodo = item.type === "todo";
      const realId = Number(item.id.replace("task-", "").replace("issue-", "").replace("todo-", ""));
      const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

      setMergedTasksIssues((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "completed" } : i))
      );
      setSelectedTasksIssues((prev) => ({ ...prev, [item.id]: true }));
      upsertCompletedItem(item);

      if (isTask) {
        await completeTask(apiCtx(), realId, "completed");
      } else if (isTodo) {
        await completeTodo(apiCtx(), realId, "completed");
      } else {
        await completeIssue(apiCtx(), realId, "completed");
      }

      await postComment(apiCtx(), {
        body: `Overdue reason: ${reason}`,
        commentable_id: realId,
        commentable_type: isTask ? "TaskManagement" : isTodo ? "Todo" : "Issue",
        commentor_id: userId,
        active: true,
      });

      toast.success(
        `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} completed with overdue reason`
      );
      setIsOverdueModalOpen(false);
      setOverdueItemId(null);
      setOverdueReason("");
    } catch (error) {
      console.error("Error submitting overdue reason:", error);
      toast.error("Failed to complete item");
    } finally {
      setIsOverdueLoading(false);
    }
  };

  const handlePlayTask = async (taskId: number) => {
    setPlayingTaskIds((prev) => new Set(prev).add(taskId));
    try {
      await updateTaskStatus(apiCtx(), taskId, "started");
      toast.success("Task started successfully");
      refetchTasks();
    } catch (error) {
      console.error("Failed to start task:", error);
      toast.error("Failed to start task");
    } finally {
      setPlayingTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  const handlePauseTaskSubmit = async (reason: string, taskId: number) => {
    if (!taskId) return;
    setIsPauseLoading(true);
    try {
      await updateTaskStatus(apiCtx(), taskId, "stopped");
      await postComment(apiCtx(), {
        body: `Paused with reason: ${reason}`,
        commentable_id: taskId,
        commentable_type: "TaskManagement",
        commentor_id: JSON.parse(localStorage.getItem("user") || "{}")?.id,
        active: true,
      });
      toast.success("Task paused successfully");
      setIsPauseModalOpen(false);
      setPauseTaskId(null);
      refetchTasks();
    } catch (error: any) {
      console.error("Failed to pause task:", error);
      toast.error(
        `Failed to pause task: ${error?.response?.data?.error || error?.message || "Server error"}`
      );
    } finally {
      setIsPauseLoading(false);
    }
  };

  const handlePlayIssue = async (issueId: number) => {
    setPlayingTaskIds((prev) => new Set(prev).add(issueId));
    try {
      await updateIssueStatus(apiCtx(), issueId, "started");
      toast.success("Issue started successfully");
      refetchIssues();
    } catch (error) {
      console.error("Failed to start issue:", error);
      toast.error("Failed to start issue");
    } finally {
      setPlayingTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(issueId);
        return next;
      });
    }
  };

  const handlePauseIssueSubmit = async (reason: string, issueId: number) => {
    if (!issueId) return;
    setIsPauseLoading(true);
    try {
      await updateIssueStatus(apiCtx(), issueId, "stopped");
      await postComment(apiCtx(), {
        body: `Paused with reason: ${reason}`,
        commentable_id: issueId,
        commentable_type: "Issue",
        commentor_id: JSON.parse(localStorage.getItem("user") || "{}")?.id,
        active: true,
      });
      toast.success("Issue paused successfully");
      setIsPauseModalOpen(false);
      setPauseIssueId(null);
      refetchIssues();
    } catch (error: any) {
      console.error("Failed to pause issue:", error);
      toast.error(
        `Failed to pause issue: ${error?.response?.data?.error || error?.message || "Server error"}`
      );
    } finally {
      setIsPauseLoading(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentReportId, setCurrentReportId] = useState<number | null>(null);
  const [reportsList, setReportsList] = useState<DailyReport[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("submit");
  const [taskStatusFilter, setTaskStatusFilter] = useState<"open" | "overdue" | "in_progress" | "on_hold">("open");
  const tasksSectionRef = useRef<HTMLDivElement>(null);
  const accomplishmentsSectionRef = useRef<HTMLDivElement>(null);
  const planningSectionRef = useRef<HTMLDivElement>(null);
  const calendarTodayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAiPopupOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsAiPopupOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAiPopupOpen]);

  const resetReportFormState = useCallback(() => {
    canPersistDraftRef.current = false;
    draftDirtyRef.current = false;
    setCurrentReportId(null);
    setAccomplishments([]);
    setPlanningItems([]);
    setUploadedFiles([]);
    setReportAttachments([]);
    setSelectedTasksIssues({});
    setKpiEntries({});
    setIsAbsent(false);
    setAbsenceReason("");
    setSelfRating([2]);
    setSubmitError(null);
    setSubmitSuccess(false);
    setHiddenAutoIds(new Set());
  }, []);

  const [viewStartDate, setViewStartDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  });
  const todayDateKey = useMemo(
    () => new Date().toLocaleDateString("en-CA"),
    []
  );

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current) return;
    const diffX = Math.abs(e.clientX - dragStartRef.current.x);
    const diffY = Math.abs(e.clientY - dragStartRef.current.y);
    if (diffX > 10 || diffY > 10) {
      hasDraggedRef.current = true;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragStartRef.current) return;
    const diffX = e.clientX - dragStartRef.current.x;
    dragStartRef.current = null;
    setIsDragging(false);
    if (diffX > 50) {
      handlePrevWeek();
    } else if (diffX < -50) {
      handleNextWeek();
    }
  };

  const handleMouseLeave = () => {
    dragStartRef.current = null;
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    hasDraggedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const diffX = Math.abs(e.touches[0].clientX - dragStartRef.current.x);
    const diffY = Math.abs(e.touches[0].clientY - dragStartRef.current.y);
    if (diffX > 10 || diffY > 10) {
      hasDraggedRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const diffX = e.changedTouches[0].clientX - dragStartRef.current.x;
    dragStartRef.current = null;
    if (diffX > 50) {
      handlePrevWeek();
    } else if (diffX < -50) {
      handleNextWeek();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 20) {
      if (e.deltaX > 0) {
        handleNextWeek();
      } else {
        handlePrevWeek();
      }
    }
  };

  const handlePrevWeek = () => {
    const newDate = new Date(viewStartDate);
    newDate.setDate(newDate.getDate() - 7);
    setViewStartDate(newDate);
    const midWeek = new Date(newDate);
    midWeek.setDate(midWeek.getDate() + 3);
    setSelectedMonth(midWeek.toLocaleString("default", { month: "long" }));
    setSelectedYear(midWeek.getFullYear().toString());
  };

  const handleNextWeek = () => {
    const newDate = new Date(viewStartDate);
    newDate.setDate(newDate.getDate() + 7);
    const maxStartDate = new Date();
    maxStartDate.setHours(0, 0, 0, 0);
    const day = maxStartDate.getDay();
    maxStartDate.setDate(maxStartDate.getDate() - day);
    const nextStartDate =
      newDate.getTime() > maxStartDate.getTime() ? maxStartDate : newDate;
    setViewStartDate(nextStartDate);
    const midWeek = new Date(nextStartDate);
    midWeek.setDate(midWeek.getDate() + 3);
    setSelectedMonth(midWeek.toLocaleString("default", { month: "long" }));
    setSelectedYear(midWeek.getFullYear().toString());
  };

  const days = useMemo(() => {
    const result: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(viewStartDate);
    for (let i = 0; i < 7; i++) {
      const dateStr = date.toLocaleDateString("en-CA");
      const isToday = date.getTime() === today.getTime();
      const isPast = date.getTime() < today.getTime();
      const isFuture = date.getTime() > today.getTime();
      const jsDay = date.getDay();
      const rosterDay = jsDay === 0 ? 7 : jsDay;
      const weekOfMonth = Math.ceil(date.getDate() / 7).toString();
      const isNonWorkingDay = rosterWorkingDays
        ? !rosterWorkingDays[weekOfMonth]?.includes(rosterDay.toString())
        : jsDay === 0 || jsDay === 6;
      const report = reportsList.find(
        (r) =>
          getReportDateKey(r.start_date) === dateStr &&
          !isLocallyDeletedReport(r)
      );
      let type: "filled" | "missed" | "holiday" | "upcoming" = "upcoming";
      let status = "";
      if (report) {
        type = "filled";
        status = report.report_data?.total_score
          ? `+${report.report_data.total_score}`
          : "Done";
      } else if (isNonWorkingDay) {
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
        isToday,
      });
      date.setDate(date.getDate() + 1);
    }
    return result;
  }, [viewStartDate, reportsList, isLocallyDeletedReport, rosterWorkingDays]);

  useEffect(() => {
    if (!calendarStripRef.current) return;
    const timer = setTimeout(() => {
      const track = calendarStripRef.current;
      if (!track) return;
      const todayElement = track.querySelector('[data-is-today="true"]');
      if (todayElement) {
        const trackRect = track.getBoundingClientRect();
        const elementRect = todayElement.getBoundingClientRect();
        const scrollAmount =
          elementRect.left -
          trackRect.left +
          track.scrollLeft -
          (trackRect.width - elementRect.width - 40);
        track.scrollLeft = Math.max(0, scrollAmount);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [days]);

  const handleSelectDate = (item: any) => {
    setSelectedDate(item.date);
    setStartDate(item.fullDate);
    setSelectedMonth(item.actualDate.toLocaleString("default", { month: "long" }));
    setSelectedYear(item.actualDate.getFullYear().toString());

    const selectedDateKey = getReportDateKey(item.fullDate);
    if (deletedReportDatesRef.current.has(selectedDateKey)) {
      clearStoredDraftsForDate(selectedDateKey);
      resetReportFormState();
      return;
    }

    const report = reportsList.find(
      (r) =>
        getReportDateKey(r.start_date) === selectedDateKey &&
        !isLocallyDeletedReport(r)
    );

    const prevDate = new Date(item.actualDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = prevDate.toLocaleDateString("en-CA");
    const prevReport = reportsList.find(
      (r) =>
        getReportDateKey(r.start_date) === getReportDateKey(prevDateStr) &&
        !isLocallyDeletedReport(r)
    );

    let carriedPlanItems: AccomplishmentItem[] = [];
    const previousPlanItems = getNonEmptyReportItems(
      prevReport?.report_data?.tomorrow_plan
    );
    if (previousPlanItems.length) {
      carriedPlanItems = previousPlanItems.map((p: any, idx: number) => ({
        id: `carried-${idx}-${Date.now()}`,
        text: getReportItemText(p),
        completed: false,
        starred: false,
        fromYesterday: true,
        ...buildItemSourceRef(p),
        ...(p.originalData ? { originalData: p.originalData } : {}),
      }));
    }

    if (report && report.id) {
      setCurrentReportId(report.id);

      let currentAccomplishments: AccomplishmentItem[] = [];
      if (report.report_data?.accomplishments?.items) {
        currentAccomplishments = getNonEmptyReportItems(
          report.report_data.accomplishments.items
        ).map((ach: any, idx: number) => ({
          id: `fetched-ach-${idx}`,
          text: getReportItemText(ach),
          completed: true,
          starred: false,
          fromYesterday: false,
          ownerId: ach.owner_id ?? null,
          ownerName: ach.owner_name ?? null,
          ...buildItemSourceRef(ach),
        }));
      }

      const existingTexts = new Set(
        currentAccomplishments.map((a) => a.text.toLowerCase().trim())
      );
      const newCarried = carriedPlanItems.filter(
        (cp) => !existingTexts.has(cp.text.toLowerCase().trim())
      );

      setAccomplishments([...currentAccomplishments, ...newCarried]);

      if (report.attachments?.length) {
        setReportAttachments(report.attachments);
      } else {
        setReportAttachments([]);
      }

      if (report.report_data?.tomorrow_plan) {
        setPlanningItems(
          getNonEmptyReportItems(report.report_data.tomorrow_plan).map(
            (p: any, idx: number) => ({
              id: `fetched-plan-${idx}`,
              text: getReportItemText(p),
              starred: p.is_starred ?? false,
              ...buildItemSourceRef(p),
              ownerId: p.owner_id ?? null,
              ownerName: p.owner_name ?? null,
            })
          )
        );
      } else {
        setPlanningItems([]);
      }

      if (report.report_data?.past_kpis) {
        const entries: { [key: number]: string } = {};
        report.report_data.past_kpis.forEach((kpiEntry: any) => {
          entries[kpiEntry.kpi_id] = kpiEntry.actual_value.toString();
        });
        setKpiEntries(entries);
      } else {
        setKpiEntries({});
      }

      if (report.is_absent !== undefined) setIsAbsent(report.is_absent);
      if (report.description) setAbsenceReason(report.description);
      if (report.self_rating !== undefined) setSelfRating([report.self_rating]);
      setSelectedTasksIssues({});
    } else {
      setCurrentReportId(null);
      setUploadedFiles([]);
      setReportAttachments([]);
      setPlanningItems([]);
      setKpiEntries({});
      setSelectedTasksIssues({});
      setIsAbsent(false);
      setAbsenceReason("");
      setSelfRating([2]);
      setAccomplishments(carriedPlanItems);
    }
  };

  const nextDayLabel = useMemo(() => {
    try {
      const nextWorkingDate = getNextWorkingDay(startDate);
      const nextDay = new Date(`${nextWorkingDate}T00:00:00`);
      if (isNaN(nextDay.getTime())) return "";
      return nextDay.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    } catch (e) {
      return "";
    }
  }, [startDate, rosterWorkingDays]);

  useEffect(() => {
    canPersistDraftRef.current = false;
    draftDirtyRef.current = false;
  }, [buildDraftKey(startDate)]);

  useEffect(() => {
    if (!draftDirtyRef.current) return;
    if (!canPersistDraftRef.current) return;
    const draft: DailyReportDraft = {
      reportId: currentReportId,
      accomplishments: accomplishments
        .filter((item) => cleanReportText(item.text) !== "")
        .map((item) => ({ ...item, text: cleanReportText(item.text) })),
      planningItems: planningItems
        .filter((item) => cleanReportText(item.text) !== "")
        .map((item) => ({ ...item, text: cleanReportText(item.text) })),
      selfRating,
      isAbsent,
      absenceReason,
      kpiEntries,
      selectedTasksIssues,
      hiddenAutoIds: [...hiddenAutoIds],
    };
    localStorage.setItem(buildDraftKey(startDate), JSON.stringify(draft));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accomplishments,
    planningItems,
    selfRating,
    isAbsent,
    absenceReason,
    kpiEntries,
    selectedTasksIssues,
    hiddenAutoIds,
    startDate,
    currentReportId,
  ]);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        canPersistDraftRef.current = false;
        const token = getToken();
        if (!token) {
          applyStoredDraft(getStoredDraft(), { allowEmptyLists: true });
          canPersistDraftRef.current = true;
          return;
        }

        const prevDateStr = getPrevWorkingDay(startDate);
        const { journals, prevJournals } = await fetchExistingReport(startDate, prevDateStr);

        let carriedPlanItems: AccomplishmentItem[] = [];
        if (prevJournals) {
          const prevData = prevJournals;
          const prevJournalsList = Array.isArray(prevData)
            ? prevData
            : prevData.user_journals || [];
          const prevReport = prevJournalsList.find(
            (j: any) =>
              getReportDateKey(j.start_date) === getReportDateKey(prevDateStr) &&
              !isLocallyDeletedReport(j)
          );

          const previousPlanItems = getNonEmptyReportItems(
            prevReport?.report_data?.tomorrow_plan
          );
          if (previousPlanItems.length) {
            const srcIds = new Set<string>();
            previousPlanItems.forEach((p: any) => {
              if (p.source_id && p.source_type) {
                srcIds.add(`${p.source_type}-${p.source_id}`);
              }
            });
            if (srcIds.size > 0) setYesterdaySourceIds(srcIds);

            carriedPlanItems = previousPlanItems
              .filter((p: any) => !p.source_id)
              .map((p: any, idx: number) => ({
                id: `carried-${idx}-${Date.now()}`,
                text: getReportItemText(p),
                completed: false,
                starred: false,
                fromYesterday: true,
              }));
          }
        }

        const data = journals;
        const journalsList = Array.isArray(data) ? data : data.user_journals || [];
        const existingReport = journalsList
          .map(normalizeReportForUi)
          .find(
            (j: any) =>
              getReportDateKey(j.start_date) === getReportDateKey(startDate) &&
              !isLocallyDeletedReport(j)
          );

        if (existingReport?.id) {
          setCurrentReportId(existingReport.id);
          if (existingReport.report_data) {
            const rData = existingReport.report_data as any;

            let currentAccomplishments: AccomplishmentItem[] = [];
            if (rData.accomplishments?.items) {
              currentAccomplishments = getNonEmptyReportItems(
                rData.accomplishments.items
              ).map((ach: any, idx: number) => ({
                id: `fetched-ach-${idx}`,
                text: getReportItemText(ach),
                completed: true,
                starred: false,
                fromYesterday: false,
                ownerId: ach.owner_id ?? null,
                ownerName: ach.owner_name ?? null,
                ...buildItemSourceRef(ach),
              }));
            }

            const existingTexts = new Set(
              currentAccomplishments.map((a) => a.text.toLowerCase().trim())
            );
            const newCarried = carriedPlanItems.filter(
              (cp) => !existingTexts.has(cp.text.toLowerCase().trim())
            );

            setAccomplishments([...currentAccomplishments, ...newCarried]);

            if (existingReport.attachments?.length) {
              setReportAttachments(existingReport.attachments);
            } else {
              setReportAttachments([]);
            }
            if (rData.tomorrow_plan) {
              setPlanningItems(
                getNonEmptyReportItems(rData.tomorrow_plan).map(
                  (p: any, idx: number) => ({
                    id: `fetched-plan-${idx}`,
                    text: getReportItemText(p),
                    starred: p.is_starred ?? false,
                    ...buildItemSourceRef(p),
                    ownerId: p.owner_id ?? null,
                    ownerName: p.owner_name ?? null,
                  })
                )
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
            applyStoredDraft(getStoredDraft(), { mergeWithCurrent: true });
          }
        } else {
          setCurrentReportId(null);
          setUploadedFiles([]);
          setReportAttachments([]);
          setKpiEntries({});
          setSelectedTasksIssues({});
          setIsAbsent(false);
          setAbsenceReason("");
          setSelfRating([2]);

          const weeklyTomorrowPlan = getNonEmptyReportItems(
            existingReport?.report_data?.tomorrow_plan
          );
          if (weeklyTomorrowPlan.length) {
            setPlanningItems(
              weeklyTomorrowPlan.map((p: any, idx: number) => ({
                id: `weekly-plan-${idx}`,
                text: getReportItemText(p),
                starred: p.is_starred ?? p.starred ?? false,
                fromWeeklyPlan: true,
                ...buildItemSourceRef(p),
              }))
            );
          } else {
            setPlanningItems([]);
          }

          setAccomplishments(carriedPlanItems);
          applyDraftForMissingReport();
        }
      } catch (err) {
        console.error("Failed to fetch existing report:", err);
        applyStoredDraft(getStoredDraft(), { allowEmptyLists: true });
      } finally {
        canPersistDraftRef.current = true;
      }
    };
    fetchExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  const fetchReportsListFn = async () => {
    try {
      setIsHistoryLoading(true);
      const reports = await fetchReportsList(selectedMonth, selectedYear);
      setReportsList(
        reports
          .map(normalizeReportForUi)
          .filter((report: DailyReport) => !isLocallyDeletedReport(report))
      );
    } catch (err) {
      console.error("Failed to fetch reports history:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsListFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear, isLocallyDeletedReport]);

  const fetchAndCachePlanSources = useCallback(
    (pairs: { type: string; id: number }[]) => {
      if (!baseUrl || !token || !pairs.length) return;
      Promise.allSettled(
        pairs.map(({ type, id }) => fetchPlanSource(apiCtx(), type, id))
      ).then((results) => {
        const newEntries: Record<string, any> = {};
        for (const r of results) {
          if (r.status === "fulfilled" && r.value?.data) {
            newEntries[r.value.key] = r.value.data;
          }
        }
        if (Object.keys(newEntries).length) {
          setPlanSourceCache((prev) => ({ ...prev, ...newEntries }));
        }
      });
    },
    [baseUrl, token]
  );

  useEffect(() => {
    if (!reportsList.length) return;
    const seen = new Set<string>();
    const toFetch: { type: string; id: number }[] = [];
    for (const report of reportsList) {
      for (const item of getNonEmptyReportItems(
        report.report_data?.tomorrow_plan
      ) as any[]) {
        if (item?.source_id && item?.source_type) {
          const key = `${item.source_type}:${item.source_id}`;
          if (!seen.has(key) && !planSourceCache[key]) {
            seen.add(key);
            toFetch.push({ type: item.source_type, id: item.source_id });
          }
        }
      }
    }
    fetchAndCachePlanSources(toFetch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportsList]);

  useEffect(() => {
    if (!planningItems.length) return;
    const seen = new Set<string>();
    const toFetch: { type: string; id: number }[] = [];
    for (const item of planningItems) {
      if (item.source_id && item.source_type) {
        const key = `${item.source_type}:${item.source_id}`;
        const alreadyLive = mergedTasksIssues.some(
          (t: any) =>
            t.type === item.source_type && t.originalData?.id === item.source_id
        );
        if (!seen.has(key) && !planSourceCache[key] && !alreadyLive) {
          seen.add(key);
          toFetch.push({ type: item.source_type, id: item.source_id });
        }
      }
    }
    fetchAndCachePlanSources(toFetch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planningItems]);

  const handleSubmit = async () => {
    const accomplishmentItemsPayload = [
      ...visibleAccomplishments
        .filter((a) => a.completed)
        .map((a) => ({
          title: cleanReportText(a.text),
          star: a.starred,
          ...(a.ownerId != null
            ? { owner_id: a.ownerId, owner_name: a.ownerName || "" }
            : {}),
          ...buildItemSourceRef(a),
          ...(a.originalData
            ? { originalData: sanitizeOriginalData(a.originalData) }
            : {}),
        })),
      ...autoAddedAccomplishments.map((item) => ({
        title: cleanReportText(item.title || ""),
        star: autoStarredIds.has(String(item.id)),
        ...buildItemSourceRef(item),
        originalData: sanitizeOriginalData(item.originalData),
      })),
    ].filter((a) => a.title !== "");

    const nonCompletedAccomplishmentsPayload = visibleAccomplishments
      .filter((a) => !a.completed)
      .map((a) => ({
        title: cleanReportText(a.text),
        star: a.starred,
        ...(a.ownerId != null
          ? { owner_id: a.ownerId, owner_name: a.ownerName || "" }
          : {}),
        ...buildItemSourceRef(a),
        ...(a.originalData
          ? { originalData: sanitizeOriginalData(a.originalData) }
          : {}),
      }))
      .filter((a) => a.title !== "");

    const manualTomorrowPlan = planningItems
      .map((p) => ({
        title: cleanReportText(p.text),
        is_starred: p.starred,
        ...buildItemSourceRef(p),
        ...(p.originalData
          ? { originalData: sanitizeOriginalData(p.originalData) }
          : {}),
        ...(p.ownerId != null
          ? { owner_id: p.ownerId, owner_name: p.ownerName || "" }
          : {}),
      }))
      .filter((p) => p.title !== "");

    const scheduledPlanItems = dedupedTomorrowItems
      .filter((item) =>
        !planningItems.some((p) => planningItemMatchesSourceItem(p, item))
      )
      .map((item) => ({
        title: cleanReportText(item.title),
        is_starred: false,
        ...buildItemSourceRef(item),
        originalData: sanitizeOriginalData(item.originalData),
      }));

    const tomorrowPlanPayload = [...manualTomorrowPlan, ...scheduledPlanItems]
      .filter((item) => item.title.trim() !== "")
      .filter((item, index, arr) => {
        const key = item.title.toLowerCase();
        return (
          arr.findIndex(
            (candidate) => candidate.title.toLowerCase() === key
          ) === index
        );
      });
    const finalPlanningItemsForScore = tomorrowPlanPayload.map((p, index) => ({
      id: `submit-plan-${index}`,
      text: p.title,
      starred: p.is_starred,
    }));
    const finalAccomplishmentsForScore = accomplishmentItemsPayload.map(
      (a, index) => ({
        id: `submit-ach-${index}`,
        text: a.title,
        completed: true,
        starred: a.star,
      })
    );
    const finalDailyScore = calculateLivePreviewScore(
      kpis.map((kpi) => ({
        ...kpi,
        actual_value: kpiEntries[kpi.kpi_id] || 0,
      })),
      finalAccomplishmentsForScore,
      mergedTasksIssues,
      finalPlanningItemsForScore
    );
    const scoreForPayload = isAbsent
      ? {
          totalScore: finalDailyScore.timingScore,
          kpiScore: 0,
          accomplishmentsScore: 0,
          tasksIssuesScore: 0,
          planningScore: 0,
          timingScore: finalDailyScore.timingScore,
        }
      : finalDailyScore;

    if (!isAbsent && accomplishmentItemsPayload.length === 0) {
      setSubmitError(
        "Please add and complete at least one accomplishment before submitting."
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
            ...(isAbsent && absenceReason.trim()
              ? { absent_reason: absenceReason.trim() }
              : {}),
            accomplishments: {
              items: accomplishmentItemsPayload,
              attachments: uploadedFiles.map((f) => ({
                filename: f.name,
                content_type: f.type,
                base64: f.base64,
              })),
            },
            non_completed_accomplishments: nonCompletedAccomplishmentsPayload,
            tasks_issues: mergedTasksIssues
              .filter(
                (item) =>
                  selectedTasksIssues[item.id] === true ||
                  item.status === "overdue" ||
                  item.status === "in_progress" ||
                  item.status === "on_hold" ||
                  item.status === "open"
              )
              .map((item) => ({
                title:
                  item.originalData?.title ||
                  item.originalData?.name ||
                  item.title ||
                  "",
                status:
                  selectedTasksIssues[item.id] === true
                    ? "completed"
                    : item.status,
                type: item.type,
                source_id: item.originalData?.id,
                start_date:
                  item.originalData?.estimated_start_date ||
                  item.originalData?.start_date ||
                  null,
                end_date:
                  item.originalData?.target_date ||
                  item.originalData?.end_date ||
                  null,
              })),
            tomorrow_plan_date: getNextWorkingDay(startDate),
            tomorrow_plan: tomorrowPlanPayload,
            past_kpis: kpis.map((kpi) => ({
              kpi_id: kpi.kpi_id,
              actual_value: kpiEntries[kpi.kpi_id]
                ? parseFloat(kpiEntries[kpi.kpi_id])
                : 0,
              target_value: parseFloat(kpi.target_value),
              notes: kpi.kpi_name,
            })),
            score_override: true,
            total_score: Math.round(scoreForPayload.totalScore),
            sections: {
              kpi_achievement: scoreForPayload.kpiScore,
              accomplishments: scoreForPayload.accomplishmentsScore,
              tasks_issues_todos: scoreForPayload.tasksIssuesScore,
              planning: scoreForPayload.planningScore,
              timing: scoreForPayload.timingScore,
            },
          },
        },
      };

      const data = await submitUserJournal(payload, currentReportId);
      if (!currentReportId && data.id) setCurrentReportId(data.id);
      deletedReportDatesRef.current.delete(getReportDateKey(startDate));
      if (data?.id) deletedReportIdsRef.current.delete(Number(data.id));
      draftDirtyRef.current = false;
      canPersistDraftRef.current = false;
      clearStoredDraftsForDate(startDate);
      setSubmitSuccess(true);
      fetchReportsListFn();
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

  const [reporteeSummary, setReporteeSummary] = useState<{
    total: number;
    submitted: number;
    missed: number;
  }>({ total: 0, submitted: 0, missed: 0 });
  const [reporteeDepartments, setReporteeDepartments] = useState<any[]>([]);
  const [reporteeManagerName, setReporteeManagerName] = useState("");
  const [isReporteeLoading, setIsReporteeLoading] = useState(false);
  const [reporteeError, setReporteeError] = useState<string | null>(null);
  const [expandedReportees, setExpandedReportees] = useState<string[]>([]);

  useEffect(() => {
    const reporteeUserId = userId ?? JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (!startDate || !reporteeUserId) {
      setReporteeDepartments([]);
      setReporteeSummary({ total: 0, submitted: 0, missed: 0 });
      return;
    }

    let active = true;
    const fetchReportee = async () => {
      setIsReporteeLoading(true);
      setReporteeError(null);
      try {
        const payload = await fetchReporteeReports(startDate, reporteeUserId);
        const departments = Array.isArray(payload?.departments)
          ? payload.departments
          : [];
        if (active) {
          setReporteeDepartments(departments);
          setReporteeManagerName(String(payload?.manager?.name || "").trim());
          setReporteeSummary({
            total: Number(payload?.total_reportees ?? 0),
            submitted: Number(payload?.submitted ?? 0),
            missed: Number(payload?.missed ?? 0),
          });
        }
      } catch (error: any) {
        console.error("Error fetching reportee reports:", error);
        if (active) {
          setReporteeDepartments([]);
          setReporteeSummary({ total: 0, submitted: 0, missed: 0 });
          setReporteeError(
            error?.response?.status === 404
              ? null
              : "Could not load reportee reports."
          );
        }
      } finally {
        if (active) setIsReporteeLoading(false);
      }
    };

    fetchReportee();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, userId, baseUrl, token]);

  const reporteeMembers = useMemo(() => {
    const forMember = (items: any[], memberId: any) =>
      (Array.isArray(items) ? items : []).filter(
        (item: any) => String(item?.user_id) === String(memberId)
      );

    return reporteeDepartments.flatMap((dept: any) =>
      (Array.isArray(dept?.members) ? dept.members : []).map((member: any) => {
        const memberId = member?.user_id;
        const sections =
          member?.sections && typeof member.sections === "object"
            ? member.sections
            : {};
        return {
          ...member,
          department: member?.department || dept?.department || "No Department",
          department_id: member?.department_id ?? dept?.department_id ?? null,
          sections,
          accomplishments: forMember(dept?.accomplishments, memberId),
          tasks_issues: forMember(dept?.tasks_issues, memberId),
          tomorrow_plan: forMember(dept?.tomorrow_plan, memberId),
          _dept_section_totals: dept?.section_totals ?? {},
        };
      })
    );
  }, [reporteeDepartments]);

  const toggleReportee = (id: string) =>
    setExpandedReportees((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

  const formattedSelectedDate = useMemo(() => {
    const d = new Date(`${startDate}T00:00:00`);
    if (isNaN(d.getTime()))
      return `${selectedDate} ${selectedMonth}, ${selectedYear}`;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [startDate, selectedDate, selectedMonth, selectedYear]);

  const livePreviewMetrics = useMemo(() => {
    const accPct = Math.round(
      dailyScore.details.accomplishments.completionPercentage || 0
    );
    const timingTotal = 4;
    const timingSet = mergedTasksIssues.filter((item) => {
      const allocations =
        item.originalData?.task_allocation_times ||
        item.originalData?.issue_allocation_times ||
        [];
      return allocations.some(
        (t: { date?: string; hours?: number; minutes?: number }) =>
          t.date === startDate && ((t.hours ?? 0) > 0 || (t.minutes ?? 0) > 0)
      );
    }).length;
    return {
      accPct,
      timing: `${Math.min(timingSet, timingTotal)}/${timingTotal}`,
    };
  }, [dailyScore, mergedTasksIssues, startDate]);

  const aiInsights = useMemo(() => {
    const insights: Array<{
      id: string;
      title: string;
      description: string;
      action: string;
      color: string;
      icon: React.ReactNode;
      onAction: () => void;
    }> = [];

    if (taskIssueCounts.overdue > 0) {
      insights.push({
        id: "overdue",
        title: `${taskIssueCounts.overdue} Overdue Task${taskIssueCounts.overdue > 1 ? "s" : ""}`,
        description:
          "Overdue items from yesterday need attention. Review and complete or reschedule them.",
        action: "View Tasks",
        color: "#dc2626",
        icon: <Clock size={16} className="text-red-500" />,
        onAction: () => {
          setTaskStatusFilter("overdue");
          tasksSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        },
      });
    }

    const accRate = livePreviewMetrics.accPct;
    if (accRate < 80) {
      const needed = Math.max(0, Math.ceil((80 - accRate) / 20));
      insights.push({
        id: "accomplishments",
        title: "Boost Accomplishments",
        description: `Your rate is ${accRate}% today — completing ${needed || 1} more item${needed !== 1 ? "s" : ""} will improve your score.`,
        action: "Add Tasks",
        color: "#16a34a",
        icon: <TrendingUp size={16} className="text-green-600" />,
        onAction: () => {
          accomplishmentsSectionRef.current?.scrollIntoView({
            behavior: "smooth",
          });
          addAccomplishment();
        },
      });
    }

    const planCount = planningItems.filter(
      (p) => cleanReportText(p.text) !== ""
    ).length;
    if (planCount < 6) {
      insights.push({
        id: "planning",
        title: "Fill Your Daily Plan",
        description: `${planCount}/6 planning items completed. Set strategic priorities for ${nextDayLabel || "tomorrow"}.`,
        action: "Open Plan",
        color: "#ea580c",
        icon: <CalendarCheck size={16} className="text-orange-500" />,
        onAction: () => {
          planningSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        },
      });
    }

    const timingSet = parseInt(livePreviewMetrics.timing.split("/")[0], 10);
    if (timingSet < 4) {
      insights.push({
        id: "timing",
        title: "Assign Task Timings",
        description: `${livePreviewMetrics.timing} timing slots set. Adding time estimates helps track your day.`,
        action: "Set Timing",
        color: "#7c3aed",
        icon: <Target size={16} className="text-purple-600" />,
        onAction: () => {
          tasksSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        },
      });
    }

    return insights;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIssueCounts.overdue, livePreviewMetrics, planningItems, nextDayLabel]);

  const dailyAiSuggestions = useMemo(() => {
    const accRate = livePreviewMetrics.accPct || 59;
    const neededAccomplishments = Math.max(1, Math.ceil((75 - accRate) / 20));
    const planCount = planningItems.filter(
      (p) => cleanReportText(p.text) !== ""
    ).length;

    return [
      {
        tone: "red",
        title: `${taskIssueCounts.overdue || 3} Overdue Tasks`,
        actionLabel: "View Tasks",
        description:
          "Overdue items from yesterday need attention. Reschedule or complete them to avoid further delays.",
        Icon: AlertCircle,
        action: () => {
          setTaskStatusFilter("overdue");
          tasksSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        tone: "green",
        title: "Boost Accomplishments",
        actionLabel: "Add Tasks",
        description: `Your rate is ${accRate}% today - completing ${neededAccomplishments} more logged tasks will push you past the 75% target.`,
        Icon: TrendingUp,
        action: () => {
          accomplishmentsSectionRef.current?.scrollIntoView({
            behavior: "smooth",
          });
          addAccomplishment();
        },
      },
      {
        tone: "orange",
        title: "Fill Your Daily Plan",
        actionLabel: "Open Plan",
        description: `${planCount}/6 planning items completed. Set strategic priorities now before the day ends.`,
        Icon: Clock,
        action: () => {
          planningSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        tone: "purple",
        title: "Assign Task Timings",
        actionLabel: "Set Timing",
        description: `${livePreviewMetrics.timing} timing slots set. Adding time estimates improves your score and planning accuracy.`,
        Icon: Target,
        action: () => {
          tasksSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livePreviewMetrics, planningItems, taskIssueCounts.overdue]);

  const filteredTasksForTable = useMemo(() => {
    const statusMap: Record<string, string[]> = {
      open: ["open", "pending", "reopen", "reopened"],
      overdue: ["overdue", "overdued"],
      in_progress: ["in_progress", "started"],
      on_hold: ["on_hold"],
    };
    return mergedTasksIssues.filter((item) =>
      statusMap[taskStatusFilter].includes(item.status)
    );
  }, [mergedTasksIssues, taskStatusFilter]);

  const submitDateLabel = useMemo(() => {
    const d = new Date(`${startDate}T00:00:00`);
    if (isNaN(d.getTime()))
      return `${selectedDate} ${selectedMonth.slice(0, 3)}`;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }, [startDate, selectedDate, selectedMonth]);

  const handleViewReportItem = async (item: any) => {
    const sourceType =
      item.source_type ?? item.originalData?.source_type ?? item.type;
    const sourceId = item.source_id ?? item.originalData?.id;

    if (sourceType === "todo") {
      const cachedTodo = todosData?.todos?.find((t: any) => t.id === sourceId);
      if (cachedTodo) {
        setSelectedTodo(cachedTodo);
        setIsDetailsModalOpen(true);
        return;
      }
      const originalData = item.originalData ?? item;
      if (originalData?.status || originalData?.priority || originalData?.description) {
        setSelectedTodo(originalData);
        setIsDetailsModalOpen(true);
        return;
      }
      if (sourceId) {
        setSelectedTodo({ ...originalData, title: originalData.title || "Loading..." });
        setIsDetailsModalOpen(true);
        try {
          setIsTodoDetailsLoading(true);
          const res = await fetchTodoDetails(apiCtx(), sourceId);
          setSelectedTodo(res ?? originalData);
        } catch {
          setSelectedTodo(originalData);
        } finally {
          setIsTodoDetailsLoading(false);
        }
      } else {
        setSelectedTodo(originalData);
        setIsDetailsModalOpen(true);
      }
      return;
    }

    if (!sourceId || !sourceType) return;

    if (sourceType === "task") {
      navigate(`/vas/tasks/${sourceId}`);
    } else if (sourceType === "issue") {
      navigate(`/vas/issues/${sourceId}`);
    }
  };

  const handleEditReportItem = (item: any) => {
    const sourceType =
      item.source_type ?? item.originalData?.source_type ?? item.type;
    const originalData = item.originalData ?? item;

    if (!sourceType) return;

    if (sourceType === "task") {
      setEditTaskData(originalData);
      setIsEditTaskModalOpen(true);
    } else if (sourceType === "issue") {
      setEditIssueData(originalData);
      setIsEditIssueModalOpen(true);
    } else if (sourceType === "todo") {
      setEditTodoData(originalData);
      setIsEditTodoModalOpen(true);
    }
  };

  const handleDeleteReport = async (report: DailyReport) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await deleteUserJournal(report.id);
      const deletedDateKey = getReportDateKey(report.start_date);
      deletedReportIdsRef.current.add(Number(report.id));
      deletedReportDatesRef.current.add(deletedDateKey);
      clearStoredDraftsForDate(deletedDateKey);
      setReportsList((prev) =>
        prev.filter(
          (item) =>
            item.id !== report.id &&
            getReportDateKey(item.start_date) !== deletedDateKey
        )
      );
      const deletedDate = new Date(`${deletedDateKey}T00:00:00`);
      if (!Number.isNaN(deletedDate.getTime())) {
        setStartDate(deletedDateKey);
        setSelectedDate(deletedDate.getDate().toString().padStart(2, "0"));
        setSelectedMonth(
          deletedDate.toLocaleString("default", { month: "long" })
        );
        setSelectedYear(deletedDate.getFullYear().toString());
      }
      resetReportFormState();
      toast.success("Report deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete report");
    }
  };

  const value: DailyReportContextValue = {
    isPATMSynced,
    navigate,
    now,
    selectedDate,
    setSelectedDate,
    startDate,
    setStartDate,
    selfRating,
    setSelfRating,
    isAbsent,
    setIsAbsent,
    absenceReason,
    setAbsenceReason,
    isDetailedScoreExpanded,
    setIsDetailedScoreExpanded,
    isScoreInfoExpanded,
    setIsScoreInfoExpanded,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    accomplishments,
    setAccomplishments,
    planningItems,
    setPlanningItems,
    uploadedFiles,
    setUploadedFiles,
    reportAttachments,
    setReportAttachments,
    fileInputRef,
    closureFileInputRef,
    isEditTaskModalOpen,
    setIsEditTaskModalOpen,
    editTaskData,
    setEditTaskData,
    isEditIssueModalOpen,
    setIsEditIssueModalOpen,
    editIssueData,
    setEditIssueData,
    isEditTodoModalOpen,
    setIsEditTodoModalOpen,
    editTodoData,
    setEditTodoData,
    isTodoDetailsLoading,
    setIsTodoDetailsLoading,
    handleViewReportItem,
    handleEditReportItem,
    taskIssueMenuAnchor,
    setTaskIssueMenuAnchor,
    isTaskCreateModalOpen,
    setIsTaskCreateModalOpen,
    isIssueCreateModalOpen,
    setIsIssueCreateModalOpen,
    isTodoCreateModalOpen,
    setIsTodoCreateModalOpen,
    planDateResetKey,
    setPlanDateResetKey,
    isFromPlan,
    setIsFromPlan,
    planningMenuAnchor,
    setPlanningMenuAnchor,
    convertMenuAnchor,
    setConvertMenuAnchor,
    convertMenuItem,
    setConvertMenuItem,
    convertTitle,
    setConvertTitle,
    isFromConvert,
    setIsFromConvert,
    pendingConvertItemRef,
    showClosureModal,
    setShowClosureModal,
    closureItem,
    setClosureItem,
    closureRemarks,
    setClosureRemarks,
    closureAttachments,
    setClosureAttachments,
    isClosureSubmitting,
    isOverdueModalOpen,
    setIsOverdueModalOpen,
    overdueItemId,
    setOverdueItemId,
    isOverdueLoading,
    overdueReason,
    setOverdueReason,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    selectedTodo,
    setSelectedTodo,
    isPauseModalOpen,
    setIsPauseModalOpen,
    pauseTaskId,
    setPauseTaskId,
    isPauseLoading,
    pendingPlayTaskId,
    setPendingPlayTaskId,
    pendingPauseTaskId,
    setPendingPauseTaskId,
    playingTaskIds,
    setPlayingTaskIds,
    pauseIssueId,
    setPauseIssueId,
    pendingPlayIssueId,
    setPendingPlayIssueId,
    pendingPauseIssueId,
    setPendingPauseIssueId,
    pendingReopenItem,
    setPendingReopenItem,
    reopenReason,
    setReopenReason,
    isReopenLoading,
    setIsReopenLoading,
    isAiPopupOpen,
    setIsAiPopupOpen,
    aiPopupTab,
    setAiPopupTab,
    aiPromptText,
    setAiPromptText,
    baseUrl,
    token,
    mergedTasksIssues,
    setMergedTasksIssues,
    selectedTasksIssues,
    setSelectedTasksIssues,
    scrollContainerRef,
    calendarStripRef,
    isLoadingMore,
    hiddenAutoIds,
    setHiddenAutoIds,
    autoStarredIds,
    setAutoStarredIds,
    collapsedGroups,
    setCollapsedGroups,
    pendingConfirmAction,
    setPendingConfirmAction,
    currentTasksPage,
    setCurrentTasksPage,
    currentIssuesPage,
    setCurrentIssuesPage,
    hasMoreTasks,
    hasMoreIssues,
    completedTasksIssuesToday,
    completedItemsLoading,
    tomorrowScheduledItems,
    tomorrowScheduledLoading,
    tomorrowFetchDone,
    hiddenTomorrowScheduledIds,
    setHiddenTomorrowScheduledIds,
    yesterdaySourceIds,
    setYesterdaySourceIds,
    planSourceCache,
    setPlanSourceCache,
    user,
    userId,
    rosterWorkingDays,
    setRosterWorkingDays,
    fetchTasks,
    fetchIssues,
    isRosterHoliday,
    getNextWorkingDay,
    getPrevWorkingDay,
    upsertCompletedItem,
    removeCompletedItem,
    markDraftDirty,
    getStoredDraft,
    clearStoredDraft,
    clearStoredDraftsForDate,
    isLocallyDeletedReport,
    applyStoredDraft,
    applyDraftForMissingReport,
    tasksData,
    tasksLoading,
    refetchTasks,
    issuesData,
    issuesLoading,
    refetchIssues,
    todosData,
    todosLoading,
    refetchTodos,
    taskIssueCounts,
    openOnlyTaskIssueGroup,
    openAllTaskIssueGroups,
    addedToTomorrowIds,
    autoAddedAccomplishments,
    noteMatchedTaskIssues,
    noteMatchedTaskIssueIds,
    visibleAccomplishments,
    dedupedTomorrowItems,
    kpis,
    setKpis,
    kpiLoading,
    kpiEntries,
    setKpiEntries,
    dailyScore,
    addAccomplishment,
    removeAccomplishment,
    completeAccomplishmentConversion,
    toggleAccomplishment,
    toggleStar,
    addPlanningItem,
    removePlanningItem,
    togglePlanningStar,
    updatePlanningText,
    updateAccomplishmentText,
    transferUncheckedToTomorrow,
    hideAutoAccomplishment,
    getBorrowedItemKey,
    toggleBorrowedAccomplishment,
    toggleBorrowedPlanItem,
    planningItemMatchesSourceItem,
    addItemToTomorrow,
    toggleScheduledTomorrowStar,
    removeItemFromTomorrow,
    hideTomorrowScheduledItem,
    addAllOverdueToTomorrow,
    triggerFileUpload,
    triggerClosureFileUpload,
    handleFileChange,
    handleClosureFileChange,
    handleMarkItemClosed,
    handleCompleteItem,
    handleRevertToOpen,
    handleOverdueReasonSubmit,
    handlePlayTask,
    handlePauseTaskSubmit,
    handlePlayIssue,
    handlePauseIssueSubmit,
    isSubmitting,
    submitSuccess,
    submitError,
    currentReportId,
    setCurrentReportId,
    reportsList,
    setReportsList,
    isHistoryLoading,
    activeTab,
    setActiveTab,
    taskStatusFilter,
    setTaskStatusFilter,
    tasksSectionRef,
    accomplishmentsSectionRef,
    planningSectionRef,
    calendarTodayRef,
    resetReportFormState,
    viewStartDate,
    setViewStartDate,
    todayDateKey,
    isDragging,
    hasDraggedRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    handlePrevWeek,
    handleNextWeek,
    days,
    handleSelectDate,
    nextDayLabel,
    fetchReportsListFn,
    handleSubmit,
    reporteeSummary,
    reporteeDepartments,
    reporteeManagerName,
    isReporteeLoading,
    reporteeError,
    expandedReportees,
    setExpandedReportees,
    reporteeMembers,
    toggleReportee,
    livePreviewMetrics,
    aiInsights,
    dailyAiSuggestions,
    formattedSelectedDate,
    submitDateLabel,
    filteredTasksForTable,
    handleDeleteReport,
  };

  return (
    <DailyReportContext.Provider value={value}>
      {children}
    </DailyReportContext.Provider>
  );
};
