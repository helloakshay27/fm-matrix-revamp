import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  FileText,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
  X,
  Plus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Crown,
  Loader2,
  Users,
  Trophy,
  CheckCircle2,
  Circle,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAuthHeaders, getBaseUrl } from "./Shared";
import ProjectTaskCreateModal from "../../../components/ProjectTaskCreateModal";
import AddIssueModal from "../../../components/AddIssueModal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// ── UI Components ──
const BtnIcon = ({
  onClick,
  children,
  className = "",
  title = "",
  disabled = false,
}: any) => (
  <button
    disabled={disabled}
    onClick={onClick}
    title={title}
    className={cn(
      "inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#CE7A5A]/40 text-neutral-500 shadow-sm transition-all",
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-[#fef6f4] hover:text-[#DA7756] active:scale-95",
      className
    )}
  >
    {children}
  </button>
);

const BtnPrimary = ({
  children,
  onClick,
  className = "",
  icon: Icon,
  disabled = false,
}: any) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center gap-2 px-6 py-2 rounded-2xl text-sm font-bold bg-[#CE7A5A] text-white shadow-sm hover:bg-[#BC6B4A] active:scale-97 transition-all disabled:opacity-60 disabled:cursor-not-allowed",
      className
    )}
  >
    {Icon && <Icon className={cn("w-4 h-4", disabled && "animate-spin")} />}{" "}
    {children}
  </button>
);

// ── Custom Themed Select ──
const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "All",
}: any) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = options.find((o: any) => String(o.value) === String(value));

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm hover:border-[#CE7A5A]/60 transition-all min-w-[140px]"
      >
        <span className="flex-1 text-left text-sm font-medium text-neutral-700 truncate">
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-neutral-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-[999] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-full"
          style={{ maxHeight: 220, overflowY: "auto" }}
        >
          {options.map((opt: any) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                String(value) === String(opt.value)
                  ? "bg-[#FFF3EE] text-[#CE7A5A] font-semibold"
                  : "text-neutral-700 hover:bg-[#FFF3EE] hover:text-[#CE7A5A]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── API Fetchers ──
const fetchDynamicMeetings = async () => {
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json)
    ? json
    : json.data?.daily_meeting_configs || json.data || [];
  return list.map((m: any) => ({
    id: String(m.id),
    name: m.name || `Meeting ${m.id}`,
  }));
};

const fetchDynamicMembers = async () => {
  const orgId = localStorage.getItem("org_id") || "";
  const res = await fetch(
    `${getBaseUrl()}/api/users?organization_id=${orgId}`,
    { headers: getAuthHeaders() }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json) ? json : json.data || json.users || [];
  return list.map((u: any) => ({
    id: String(u.id),
    name:
      u.full_name ||
      [u.firstname, u.lastname].filter(Boolean).join(" ") ||
      `User ${u.id}`,
  }));
};

const fetchDailyMeetingData = async ({
  meetingId,
  dateStr,
}: {
  meetingId: string;
  dateStr: string;
}) => {
  const url = new URL(`${getBaseUrl()}/user_journals/daily_meeting`);
  url.searchParams.append("date", dateStr);
  if (meetingId && meetingId !== "all")
    url.searchParams.append("meeting_id", meetingId);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

// ── Helpers ──
const formatDateTime = (isoStr: string | null) => {
  if (!isoStr) return null;
  try {
    return new Date(isoStr).toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return null;
  }
};

const pushUnique = (arr: any[], item: any, keyFields: string[]) => {
  const exists = arr.some((x) => keyFields.every((k) => x[k] === item[k]));
  if (!exists) arr.push(item);
};

// ── Normalize report_data ──
const normalizeReportData = (rd: any) => {
  if (!rd || typeof rd !== "object") {
    return {
      accomplishments: [],
      tasks_issues: [],
      tomorrow_plan: [],
      big_win: null,
      self_rating: null,
      total_score: null,
      is_absent: null,
      kpis: {},
    };
  }

  let accomplishments: any[] = [];
  if (Array.isArray(rd.accomplishments)) {
    accomplishments = rd.accomplishments;
  } else if (Array.isArray(rd.accomplishments?.items)) {
    accomplishments = rd.accomplishments.items;
  }

  return {
    accomplishments,
    tasks_issues: Array.isArray(rd.tasks_issues) ? rd.tasks_issues : [],
    tomorrow_plan: Array.isArray(rd.tomorrow_plan) ? rd.tomorrow_plan : [],
    big_win: rd.big_win ?? null,
    self_rating: rd.self_rating ?? null,
    total_score: rd.total_score ?? null,
    is_absent: rd.is_absent ?? null,
    kpis: rd.kpis && typeof rd.kpis === "object" ? rd.kpis : {},
  };
};

const getItemTitle = (item: any): string => {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") return String(item.title || item.name || "");
  return String(item);
};

const getItemStatus = (item: any): string => {
  if (!item || typeof item !== "object") return "open";
  return item.status || "open";
};

// ─────────────────────────────────────────────
const DailyTab = () => {
  const [activeDate, setActiveDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [meetingsList, setMeetingsList] = useState<any[]>([]);
  const [meetingsLoaded, setMeetingsLoaded] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null
  );
  const [membersList, setMembersList] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState("all");
  const [dailyData, setDailyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [expandedReports, setExpandedReports] = useState<any[]>([]);
  const [selectedReports, setSelectedReports] = useState<any[]>([]);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isSavingMeeting, setIsSavingMeeting] = useState(false);
  const [meetingJournalId, setMeetingJournalId] = useState<number | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [quickActionOpenId, setQuickActionOpenId] = useState<any>(null);
  const [quickActionText, setQuickActionText] = useState("");

  // Feedback specific states
  const [feedbackOpenId, setFeedbackOpenId] = useState<any>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [fetchedFeedbacks, setFetchedFeedbacks] = useState<any[]>([]);
  const [isFetchingFeedbacks, setIsFetchingFeedbacks] = useState(false);

  const navigate = useNavigate();

  // ── Load Dropdowns ──
  useEffect(() => {
    fetchDynamicMeetings()
      .then((list) => {
        setMeetingsList(list);
        setMeetingsLoaded(true);
        if (list?.length > 0) {
          setSelectedMeetingId(list[0].id);
        } else {
          setSelectedMeetingId(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setSelectedMeetingId(null);
        setMeetingsLoaded(true);
      });
    fetchDynamicMembers().then(setMembersList).catch(console.error);
  }, []);

  const loadDailyData = async (skipNotesRestore = false) => {
    if (selectedMeetingId === null) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const json = await fetchDailyMeetingData({
        meetingId: selectedMeetingId,
        dateStr: activeDate,
      });

      if (json.success) {
        setDailyData(json.data);
        const reports: any[] =
          json.data?.member_reports || json.data?.reports || [];
        const headId = json.data?.config?.meeting_head?.id;

        const meetingJournalReport =
          reports.find(
            (r: any) =>
              r.user_id === headId &&
              r.status === "submitted" &&
              r.journal_id &&
              Array.isArray(r.report_data?.meeting_notes)
          ) ||
          reports.find(
            (r: any) =>
              r.status === "submitted" &&
              Array.isArray(r.report_data?.meeting_notes) &&
              r.journal_id
          ) ||
          reports.find((r: any) => r.status === "submitted" && r.journal_id) ||
          null;

        setMeetingJournalId(meetingJournalReport?.journal_id ?? null);

        if (!skipNotesRestore) {
          const savedDiscussion: string =
            meetingJournalReport?.report_data?.meeting_notes?.[0]
              ?.key_discussion_points || "";

          if (savedDiscussion) {
            setMeetingNotes(savedDiscussion);
          } else {
            const missed: any[] = json.data?.missed_members || [];
            if (missed.length > 0) {
              setMeetingNotes(
                `**Team Members Who Missed Report (${missed.length}):**\n` +
                  missed.map((m: any) => `- ${m.name || m.user}`).join("\n") +
                  `\n\n**Key Discussion Points:**\n`
              );
            } else {
              setMeetingNotes("");
            }
          }
        }
      } else {
        throw new Error(json.message || "Failed to fetch");
      }
    } catch (err: any) {
      setApiError(err.message);
      setDailyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDailyData(false);
  }, [selectedMeetingId, activeDate]);

  // ── GET Past Feedbacks ──
  const loadPastFeedbacks = async (targetUserId: string | number) => {
    setIsFetchingFeedbacks(true);
    try {
      const loggedInUserId = localStorage.getItem("userId") || "";
      const url = `${getBaseUrl()}/ratings?resource_type=User&resource_id=${targetUserId}&rating_from_id=${loggedInUserId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const feedbackList = Array.isArray(data)
          ? data
          : data.data || data.ratings || [];
        setFetchedFeedbacks(feedbackList);
      } else {
        console.error(`HTTP Error: ${res.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch past feedbacks:", error);
    } finally {
      setIsFetchingFeedbacks(false);
    }
  };

  // ── PUT /user_journals/:id ──
  const updateJournal = async (
    report: any,
    patch: { self_rating?: number; tomorrow_plan_item?: string }
  ) => {
    const journalId = report.journal_id || report.daily_report?.id;
    if (!journalId) {
      toast.error("Journal ID not found for this report.");
      return false;
    }

    const isPending = report.status === "pending";
    const hasDraft = !!report.daily_report;
    const rd = report.report_data || {};
    const draftRaw = report.daily_report?.report_data || {};

    const sourceRd =
      isPending && hasDraft
        ? normalizeReportData({
            ...draftRaw,
            accomplishments:
              draftRaw.accomplishments?.items ||
              (Array.isArray(draftRaw.accomplishments)
                ? draftRaw.accomplishments
                : []),
            self_rating:
              draftRaw.details?.self_rating ??
              draftRaw.sections?.self_rating ??
              0,
          })
        : normalizeReportData({ ...rd, self_rating: rd.self_rating ?? 0 });

    const payload: any = {
      user_journal: {
        self_rating: patch.self_rating ?? sourceRd.self_rating,
        status: "submitted",
        report_data: {
          accomplishments: sourceRd.accomplishments,
          tasks_issues: sourceRd.tasks_issues,
          big_win: sourceRd.big_win || null,
          tomorrow_plan: patch.tomorrow_plan_item
            ? [...sourceRd.tomorrow_plan, { title: patch.tomorrow_plan_item }]
            : sourceRd.tomorrow_plan,
          kpis: sourceRd.kpis,
        },
      },
    };

    try {
      const res = await fetch(
        `${getBaseUrl()}/user_journals/${journalId}.json`,
        {
          method: "PUT",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return true;
    } catch (err: any) {
      toast.error("Error updating journal: " + err.message);
      return false;
    }
  };

  const changeDate = (days: number) => {
    const d = new Date(activeDate);
    d.setDate(d.getDate() + days);
    setActiveDate(d.toISOString().split("T")[0]);
  };

  const toggleExpand = (id: any) =>
    setExpandedReports((p) =>
      p.includes(id) ? p.filter((r) => r !== id) : [...p, id]
    );

  // ── Combined data builder ──
  const buildCombinedData = (allReports: any[]) => {
    const allAccomplishments: any[] = [];
    const allTasksIssues: any[] = [];
    const allTomorrowPlan: any[] = [];
    let combinedBigWin = "";
    let combinedSelfRating = 0;
    let ratingCount = 0;
    const combinedKpis: any = {
      score: 0,
      tasks: 0,
      issues: 0,
      planning: 0,
      timing: 0,
    };

    allReports
      .filter((r: any) => r.status !== "pending" || !!r.daily_report)
      .forEach((report: any) => {
        const hasDraft = !!report.daily_report;
        const isPending = report.status === "pending";
        const rd = report.report_data || {};
        const draftRaw = report.daily_report?.report_data || {};

        const rawSource =
          isPending && hasDraft
            ? {
                ...draftRaw,
                accomplishments:
                  draftRaw.accomplishments?.items ||
                  (Array.isArray(draftRaw.accomplishments)
                    ? draftRaw.accomplishments
                    : []),
                self_rating:
                  draftRaw.details?.self_rating ??
                  draftRaw.sections?.self_rating ??
                  0,
                is_absent:
                  draftRaw.details?.is_absent ??
                  draftRaw.sections?.is_absent ??
                  false,
              }
            : rd;

        const source = normalizeReportData(rawSource);

        source.accomplishments.forEach((a: any) =>
          pushUnique(allAccomplishments, { ...a, member: report.name }, [
            "title",
            "member",
          ])
        );
        source.tasks_issues.forEach((t: any) =>
          pushUnique(allTasksIssues, { ...t, member: report.name }, [
            "title",
            "member",
          ])
        );
        source.tomorrow_plan.forEach((p: any) =>
          pushUnique(allTomorrowPlan, { ...p, member: report.name }, [
            "title",
            "member",
          ])
        );

        if (source.big_win)
          combinedBigWin +=
            (combinedBigWin ? " | " : "") + `${report.name}: ${source.big_win}`;
        if (source.self_rating) {
          combinedSelfRating += Number(source.self_rating) || 0;
          ratingCount++;
        }

        const kpis = report.kpis || rd.kpis || {};
        const sections = draftRaw.sections || rd.sections || {};

        const t = parseInt(sections.tasks_issues ?? kpis.tasks) || 0;
        const i = parseInt(kpis.issues) || 0;
        const p = parseInt(sections.planning ?? kpis.planning) || 0;
        const tim = parseInt(sections.timing ?? kpis.timing) || 0;

        combinedKpis.tasks += t;
        combinedKpis.issues += i;
        combinedKpis.planning += p;
        combinedKpis.timing += tim;

        if (report.score) combinedKpis.score += parseInt(report.score) || 0;
      });

    return {
      allAccomplishments,
      allTasksIssues,
      allTomorrowPlan,
      combinedBigWin,
      avgSelfRating:
        ratingCount > 0 ? Math.round(combinedSelfRating / ratingCount) : 0,
      combinedKpis,
    };
  };

  // ── Meeting notes array builder ──
  const buildMeetingNotesArray = (
    allReports: any[],
    allMissed: any[],
    meetingNotesText: string
  ) => {
    const pureMissedNames = allReports
      .filter((r: any) => r.status === "pending" && !r.daily_report)
      .map((r: any) => r.name);
    allMissed.forEach((m: any) => {
      if (!pureMissedNames.includes(m.name)) pureMissedNames.push(m.name);
    });

    const meetingNotesArray: any[] = [];
    const note1: any = {};
    if (pureMissedNames.length > 0) {
      note1[`Team Members Who Missed Report (${pureMissedNames.length})`] =
        pureMissedNames;
    }
    note1["key_discussion_points"] = meetingNotesText || "";
    meetingNotesArray.push(note1);

    allReports
      .filter((r: any) => r.status !== "pending" || !!r.daily_report)
      .forEach((report: any) => {
        const hasDraft = !!report.daily_report;
        const isPending = report.status === "pending";
        const rd = report.report_data || {};
        const draftRaw = report.daily_report?.report_data || {};

        const rawSource =
          isPending && hasDraft
            ? {
                ...draftRaw,
                accomplishments:
                  draftRaw.accomplishments?.items ||
                  (Array.isArray(draftRaw.accomplishments)
                    ? draftRaw.accomplishments
                    : []),
                self_rating:
                  draftRaw.details?.self_rating ??
                  draftRaw.sections?.self_rating ??
                  null,
                is_absent:
                  draftRaw.details?.is_absent ??
                  draftRaw.sections?.is_absent ??
                  false,
              }
            : rd;

        const source = normalizeReportData(rawSource);

        meetingNotesArray.push({
          member: report.name,
          email: report.email,
          department: report.department || null,
          status: isPending && hasDraft ? "submitted" : report.status,
          journal_id: report.journal_id || report.daily_report?.id || null,
          submitted_at:
            report.submitted_at || report.daily_report?.submitted_at || null,
          self_rating: source.self_rating,
          is_absent: source.is_absent,
          accomplishments: source.accomplishments,
          tasks_issues: source.tasks_issues,
          tomorrow_plan: source.tomorrow_plan,
          big_win: source.big_win,
          kpis: report.kpis || rd.kpis || null,
          score: report.score ?? null,
        });
      });

    return meetingNotesArray;
  };

  // ── Save Meeting (POST) ──
  const handleSaveMeeting = async () => {
    if (selectedMeetingId === "all" || !selectedMeetingId) {
      toast.error("Please select a specific meeting.");
      return;
    }
    setIsSavingMeeting(true);
    try {
      const allReports = dailyData?.member_reports || dailyData?.reports || [];
      const allMissed = dailyData?.missed_members || [];
      const {
        allAccomplishments,
        allTasksIssues,
        allTomorrowPlan,
        combinedBigWin,
        avgSelfRating,
        combinedKpis,
      } = buildCombinedData(allReports);
      const meetingNotesArray = buildMeetingNotesArray(
        allReports,
        allMissed,
        meetingNotes
      );

      const payload = {
        meeting_config_id: parseInt(selectedMeetingId, 10),
        report_date: activeDate,
        self_rating: avgSelfRating,
        is_absent: false,
        status: "submitted",
        report_data: {
          meeting_notes: meetingNotesArray,
          accomplishments: allAccomplishments,
          tasks_issues: allTasksIssues,
          big_win: combinedBigWin || null,
          tomorrow_plan: allTomorrowPlan,
          kpis: {
            score: `${combinedKpis.score}`,
            tasks: `${combinedKpis.tasks}`,
            issues: `${combinedKpis.issues}`,
            planning: `${combinedKpis.planning}`,
            timing: `${combinedKpis.timing}`,
          },
          summary: {
            total_members: dailyData?.total_members || 0,
            submitted_count: dailyData?.submitted || 0,
            missed_count: dailyData?.missed || 0,
            meeting_name: dailyData?.config?.name || "",
            meeting_head: dailyData?.config?.meeting_head || null,
          },
        },
      };

      const res = await fetch(
        `${getBaseUrl()}/user_journals/submit_daily_meeting`,
        {
          method: "POST",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      toast.success("Meeting saved successfully!");
      loadDailyData(true);
    } catch (err: any) {
      toast.error("Error saving meeting: " + err.message);
    } finally {
      setIsSavingMeeting(false);
    }
  };

  // ── Update Meeting (PATCH) ──
  const handleUpdateMeeting = async () => {
    if (!meetingJournalId) {
      toast.error("No saved meeting found to update.", {
        description: "Please save the meeting first.",
      });
      return;
    }
    setIsSavingMeeting(true);
    try {
      const allReports = dailyData?.member_reports || dailyData?.reports || [];
      const allMissed = dailyData?.missed_members || [];
      const {
        allAccomplishments,
        allTasksIssues,
        allTomorrowPlan,
        combinedBigWin,
        avgSelfRating,
        combinedKpis,
      } = buildCombinedData(allReports);
      const meetingNotesArray = buildMeetingNotesArray(
        allReports,
        allMissed,
        meetingNotes
      );

      const payload = {
        user_journal: {
          self_rating: avgSelfRating,
          status: "submitted",
          report_data: {
            meeting_notes: meetingNotesArray,
            accomplishments: allAccomplishments,
            tasks_issues: allTasksIssues,
            big_win: combinedBigWin || null,
            tomorrow_plan: allTomorrowPlan,
            kpis: {
              score: `${combinedKpis.score}`,
              tasks: `${combinedKpis.tasks}`,
              issues: `${combinedKpis.issues}`,
              planning: `${combinedKpis.planning}`,
              timing: `${combinedKpis.timing}`,
            },
            summary: {
              total_members: dailyData?.total_members || 0,
              submitted_count: dailyData?.submitted || 0,
              missed_count: dailyData?.missed || 0,
              meeting_name: dailyData?.config?.name || "",
              meeting_head: dailyData?.config?.meeting_head || null,
            },
          },
        },
      };

      const res = await fetch(
        `${getBaseUrl()}/user_journals/${meetingJournalId}.json`,
        {
          method: "PATCH",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      toast.success("Meeting updated successfully!");
      loadDailyData(true);
    } catch (err: any) {
      toast.error("Error updating meeting: " + err.message);
    } finally {
      setIsSavingMeeting(false);
    }
  };

  // ── Derived Data ──
  const dateRow = dailyData?.date_row || [];
  const config = dailyData?.config;
  const topDateStr = dailyData?.date || activeDate;
  const configName =
    config?.name || (selectedMeetingId === "all" ? "All Meetings" : "Meeting");

  let memberReports = dailyData?.member_reports || dailyData?.reports || [];
  let failedMembers = dailyData?.missed_members || [];
  if (selectedMember !== "all") {
    memberReports = memberReports.filter(
      (r: any) => String(r.user_id) === selectedMember
    );
    failedMembers = failedMembers.filter(
      (m: any) => String(m.id) === selectedMember
    );
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = memberReports.map((r: any) => r.journal_id || r.user_id);
      setSelectedReports(allIds);
      toast.success(
        `${allIds.length} report${allIds.length !== 1 ? "s" : ""} selected`
      );
    } else {
      setSelectedReports([]);
      toast("Selection cleared", { icon: "✕" });
    }
  };

  const handleFeedback = () => {
    navigate("/admin-compass/feedback-dashboard");
  };

  // ── No meetings state ──
  const noMeetings = meetingsLoaded && meetingsList.length === 0;

  return (
    <div
      className="space-y-5 pb-12"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ══ CALENDAR CARD ══ */}
      <div className="bg-[#FFF9F6] border border-[#F1E8E3] rounded-[32px] p-6 sm:p-8 shadow-sm overflow-visible">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E8] border border-[#F6E1D7]">
              <Calendar className="w-5 h-5 text-[#CE8261]" />
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold text-[#1a1a1a]">
                Daily Meeting
              </h2>
              <p className="text-xs font-bold text-[#CE8261] mt-0.5">
                {topDateStr}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeDate(-1)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#EAE3DF] shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <button
              onClick={() => changeDate(1)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#EAE3DF] shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* ── Calendar Body ── */}
        {isLoading && !dailyData ? (
          /* Skeleton loader */
          <div
            className="flex gap-3 flex-wrap py-4 px-3"
            style={{ overflow: "visible" }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="rounded-[18px] bg-[#F0EBE8] animate-pulse"
                style={{ width: 100, height: 120 }}
              />
            ))}
          </div>
        ) : noMeetings ? (
          /* ── No Meetings Empty State ── */
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5EFEB] border border-[#EAE3DF]">
              <Calendar className="w-7 h-7 text-[#CE8261] opacity-40" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-neutral-500">
                No meetings configured
              </p>
              <p className="text-xs text-neutral-400 mt-1 max-w-[220px] leading-relaxed">
                Please configure a meeting first to view the daily calendar.
              </p>
            </div>
          </div>
        ) : (
          /* ── Normal Calendar ── */
          <div
            className="flex gap-3 flex-wrap py-4 px-3"
            style={{ overflow: "visible" }}
          >
            {dateRow.map((dateItem: any) => {
              const isSelected = dateItem.full_date === activeDate;
              const rawStatus = dateItem.status;
              const isUpcoming = rawStatus === "upcoming";
              // ── UPCOMING: plain text style (image jaisa) ──
              // ── UPCOMING: plain text style (image jaisa) ──
              if (isUpcoming) {
                return (
                  <div
                    key={dateItem.full_date}
                    className="relative select-none cursor-default"
                    style={{ width: 100, height: 120 }}
                  >
                    <div className="flex flex-col items-center justify-center w-full h-full border-[3px] border-[#C5BFBB] rounded-[18px] bg-transparent transition-all duration-200">
                      <span
                        className="text-[11px] font-extrabold uppercase tracking-widest mb-1 opacity-90"
                        style={{ color: "#C5BFBB" }}
                      >
                        {dateItem.day}
                      </span>
                      <span
                        className="text-[34px] font-bold leading-none"
                        style={{ color: "#C5BFBB" }}
                      >
                        {dateItem.date}
                      </span>
                      <div
                        className="mt-2.5 h-[20px] px-3 rounded-full flex items-center justify-center text-[9px] font-extrabold uppercase tracking-widest"
                        style={{ color: "#C5BFBB" }}
                      >
                        Upcoming
                      </div>
                    </div>
                  </div>
                );
              }

              // ── PAST / TODAY: colored card ──
              // ── PAST / TODAY / HOLIDAY: colored card ──
              let bg = "#F0EDEA",
                textColor = "#9CA3AF",
                labelBg = "rgba(0,0,0,0.07)",
                labelColor = "#9CA3AF",
                displayLabel = "Holiday";

              if (rawStatus === "missed") {
                bg = "#F34A4A";
                textColor = "#FFFFFF";
                labelBg = "rgba(255,255,255,0.22)";
                labelColor = "#FFFFFF";
                displayLabel = "Miss";
              } else if (rawStatus === "done" || rawStatus === "submitted") {
                bg = "#2ECC71";
                textColor = "#FFFFFF";
                labelBg = "rgba(255,255,255,0.22)";
                labelColor = "#FFFFFF";
                displayLabel = "Done";
              } else if (
                rawStatus === "holiday" ||
                rawStatus === "non_meeting"
              ) {
                // 👇 Yahan "non_meeting" add kar diya hai
                bg = "#F5D142";
                textColor = "#8A6D3B";
                labelBg = "rgba(0,0,0,0.09)";
                labelColor = "#8A6D3B";
                displayLabel = "Holiday";
              }

              return (
                <div
                  key={dateItem.full_date}
                  onClick={() => setActiveDate(dateItem.full_date)}
                  className="relative select-none cursor-pointer"
                >
                  <div
                    className="flex flex-col items-center justify-center rounded-[18px] transition-all duration-200"
                    style={{
                      width: 100,
                      height: 120,
                      background: bg,
                      color: textColor,
                      boxShadow: isSelected
                        ? "0 0 0 3px #ffffff, 0 0 0 6px #D7E5FC"
                        : "0 3px 10px rgba(0,0,0,0.09)",
                    }}
                  >
                    <span className="text-[11px] font-extrabold uppercase tracking-widest mb-1 opacity-90">
                      {dateItem.day}
                    </span>
                    <span className="text-[34px] font-bold leading-none">
                      {dateItem.date}
                    </span>
                    <div
                      className="mt-2.5 h-[20px] px-3 rounded-full flex items-center justify-center text-[9px] font-extrabold uppercase tracking-widest"
                      style={{ background: labelBg, color: labelColor }}
                    >
                      {displayLabel}
                    </div>
                  </div>
                  {dateItem.is_today && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#CE7A5A] rounded-full" />
                  )}
                  {isSelected && (
                    <div
                      className="absolute top-0 right-0 w-[14px] h-[14px] bg-[#3B82F6] rounded-full border-[2px] border-white shadow-sm"
                      style={{ transform: "translate(40%, -40%)", zIndex: 10 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Legend — always show except when no meetings */}
        {!noMeetings && (
          <div className="flex gap-x-8 gap-y-3 text-[11px] font-extrabold flex-wrap justify-center text-[#9A938E] tracking-[0.1em] uppercase mt-2">
            <div className="flex items-center gap-2.5">
              <span className="w-[15px] h-[15px] rounded-full bg-[#2ECC71]" />{" "}
              Filled
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-[15px] h-[15px] rounded-full bg-[#F34A4A]" />{" "}
              Missed
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-[15px] h-[15px] rounded-full bg-[#F5D142]" />{" "}
              Holiday
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className="w-[15px] h-[15px] rounded-full border-[3px]"
                style={{ borderColor: "#C5BFBB", background: "transparent" }}
              />{" "}
              Upcoming
            </div>
          </div>
        )}
      </div>

      {/* ══ FILTERS ══ */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">
            Meeting
          </span>
          {noMeetings ? (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="text-xs font-bold text-red-500">
                No meetings configured
              </span>
            </div>
          ) : (
            <CustomSelect
              value={selectedMeetingId || ""}
              onChange={setSelectedMeetingId}
              placeholder="Loading Meetings..."
              options={meetingsList.map((m: any) => ({
                value: m.id,
                label: m.name,
              }))}
            />
          )}
        </div>

        {!noMeetings && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">
                Member
              </span>
              <CustomSelect
                value={selectedMember}
                onChange={setSelectedMember}
                placeholder="All Members"
                options={[
                  { value: "all", label: "All Members" },
                  ...membersList.map((m: any) => ({
                    value: m.id,
                    label: m.name,
                  })),
                ]}
              />
            </div>
            <button
              onClick={() => loadDailyData(false)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-neutral-600 shadow-sm hover:border-[#CE7A5A]/60 hover:text-[#CE7A5A] transition-all"
            >
              <RefreshCw
                className={cn(
                  "w-3.5 h-3.5",
                  isLoading && "animate-spin text-[#CE8261]"
                )}
              />{" "}
              Refresh
            </button>
          </>
        )}
      </div>

      {apiError && (
        <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-2xl border border-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {apiError}
        </div>
      )}

      {/* ══ NO MEETINGS — full info banner ══ */}
      {noMeetings && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 border border-orange-200 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-orange-800">
              No meetings found
            </p>
            <p className="text-xs text-orange-600 mt-1 leading-relaxed">
              There are no daily meeting configurations available. Please ask
              your admin to configure a meeting to start viewing daily reports.
            </p>
          </div>
        </div>
      )}

      {isLoading && !noMeetings && (
        <div className="border border-[#F0EBE8] rounded-2xl shadow-sm overflow-hidden bg-white mt-4">
          <div className="p-4 border-b border-[#F0EBE8] flex justify-between items-center bg-[#FAFAFA] flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-[#F0EBE8] animate-pulse" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-[#F0EBE8] rounded-full animate-pulse" />
                <div className="w-20 h-3 bg-[#F0EBE8] rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-7 bg-[#F0EBE8] rounded-2xl animate-pulse" />
              <div className="w-24 h-7 bg-[#F0EBE8] rounded-2xl animate-pulse" />
              <div className="w-20 h-7 bg-[#F0EBE8] rounded-2xl animate-pulse" />
            </div>
          </div>
          <div className="p-4 space-y-6">
            <div className="border border-[#F0EBE8] rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between p-3 border-b border-[#F0EBE8] bg-[#FAFAFA]">
                <div className="w-24 h-4 bg-[#F0EBE8] rounded-full animate-pulse" />
                <div className="w-8 h-8 rounded-xl bg-[#F0EBE8] animate-pulse" />
              </div>
              <div className="p-4 h-24 bg-white" />
              <div className="p-3 border-t border-[#F0EBE8] bg-[#FAFAFA] flex justify-end">
                <div className="w-32 h-9 rounded-2xl bg-[#F0EBE8] animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-[#F0EBE8] rounded-2xl p-4 bg-white shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-[#F0EBE8] animate-pulse" />
                    <div className="w-40 h-5 bg-[#F0EBE8] rounded-full animate-pulse" />
                    <div className="w-16 h-4 bg-[#F0EBE8] rounded-full ml-auto animate-pulse" />
                  </div>
                  <div className="w-48 h-3 bg-[#F0EBE8] rounded-full ml-7 animate-pulse" />
                  <div className="flex gap-2 ml-7">
                    <div className="w-12 h-6 bg-[#F0EBE8] rounded-lg animate-pulse" />
                    <div className="w-16 h-6 bg-[#F0EBE8] rounded-lg animate-pulse" />
                    <div className="w-16 h-6 bg-[#F0EBE8] rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ REPORTS SECTION ══ */}
      {!isLoading && dailyData && !noMeetings && (
        <>
          <div className="border border-[rgba(218,119,86,0.18)] rounded-2xl shadow-sm overflow-hidden bg-[#FFFDFB]">
            <div className="p-4 border-b border-[rgba(218,119,86,0.1)] flex justify-between items-start flex-wrap gap-3 bg-[#fef6f4]">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white border border-[rgba(218,119,86,0.22)]">
                    <FileText className="w-4 h-4 text-[#CE7A5A]" />
                  </div>
                  Daily Reports ({configName})
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{topDateStr}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-3">
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-[#CE7A5A] text-white shadow-sm">
                  Total: {dailyData.total_members || 0}
                </span>
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-white text-[#CE7A5A] border border-[#CE7A5A]/40 shadow-sm">
                  Submitted: {dailyData.submitted || 0}
                </span>
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-white text-[#b91c1c] border border-[#b91c1c]/70 shadow-sm">
                  Missed: {dailyData.missed || 0}
                </span>
              </div>
            </div>

            {memberReports.length === 0 && failedMembers.length === 0 && (
              <div className="p-10 text-center text-sm font-bold text-neutral-400 bg-white">
                No reports found for this selection.
              </div>
            )}

            {memberReports.length > 0 && (
              <div className="p-4 bg-[#FFFDFB]">
                {/* Meeting Notes Box */}
                <div className="bg-white border border-[rgba(218,119,86,0.18)] rounded-2xl overflow-hidden shadow-sm mb-6">
                  <div className="flex items-center justify-between p-3 border-b border-[rgba(218,119,86,0.1)] bg-[#FFFAF8]">
                    <div className="flex items-center gap-2 font-semibold text-neutral-800 text-sm">
                      <Users className="w-4 h-4 text-[#CE7A5A]" /> Meeting Notes
                    </div>
                    <BtnIcon
                      onClick={() => loadDailyData(false)}
                      title="Refresh"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </BtnIcon>
                  </div>
                  <div className="p-4">
                    <textarea
                      value={meetingNotes}
                      onChange={(e) => setMeetingNotes(e.target.value)}
                      className="w-full border border-[rgba(218,119,86,0.18)] rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.22)] min-h-[80px] resize-y placeholder:text-neutral-400 text-neutral-700 bg-[#FFFAF8]"
                      placeholder="Enter meeting remarks, feedback, action items..."
                    />
                  </div>
                  <div className="flex items-center justify-between bg-[#FFFAF8] p-3 px-4 border-t border-[rgba(218,119,86,0.1)]">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={
                          memberReports.length > 0 &&
                          selectedReports.length === memberReports.length
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 accent-[#CE7A5A] cursor-pointer"
                      />
                      <span className="text-sm font-medium text-[#1A1A1A]">
                        Select All
                      </span>
                    </label>
                    {meetingJournalId ? (
                      <BtnPrimary
                        icon={isSavingMeeting ? Loader2 : RefreshCw}
                        onClick={handleUpdateMeeting}
                        disabled={isSavingMeeting}
                        className="bg-blue-600 hover:bg-blue-700 border-blue-700"
                      >
                        {isSavingMeeting ? "Updating..." : "Update Meeting"}
                      </BtnPrimary>
                    ) : (
                      <BtnPrimary
                        icon={isSavingMeeting ? Loader2 : FileText}
                        onClick={handleSaveMeeting}
                        disabled={isSavingMeeting}
                      >
                        {isSavingMeeting ? "Saving..." : "Save Meeting"}
                      </BtnPrimary>
                    )}
                  </div>
                </div>

                {/* Report Cards */}
                <div className="space-y-4">
                  {memberReports
                    .filter(
                      (report: any) =>
                        report.status !== "pending" || !!report.daily_report
                    )
                    .map((report: any) => {
                      const rId = report.journal_id || report.user_id;
                      const isExpanded = expandedReports.includes(rId);
                      const isPending = report.status === "pending";
                      const hasDraft = !!report.daily_report;
                      const draftRaw = report.daily_report?.report_data || {};
                      const rd = report.report_data || {};

                      const rawDisplayRd =
                        isPending && hasDraft
                          ? {
                              ...draftRaw,
                              accomplishments:
                                draftRaw.accomplishments?.items ||
                                (Array.isArray(draftRaw.accomplishments)
                                  ? draftRaw.accomplishments
                                  : []),
                              self_rating:
                                draftRaw.details?.self_rating ??
                                draftRaw.sections?.self_rating,
                              total_score: draftRaw.total_score,
                              is_absent:
                                draftRaw.details?.is_absent ??
                                draftRaw.sections?.is_absent,
                            }
                          : rd;

                      const displayRd = normalizeReportData(rawDisplayRd);

                      const displayKpis = {
                        tasks:
                          draftRaw.sections?.tasks_issues ??
                          rd.sections?.tasks_issues ??
                          report.kpis?.tasks ??
                          rd.kpis?.tasks,
                        issues: report.kpis?.issues ?? rd.kpis?.issues,
                        planning:
                          draftRaw.sections?.planning ??
                          rd.sections?.planning ??
                          report.kpis?.planning ??
                          rd.kpis?.planning,
                        timing:
                          draftRaw.sections?.timing ??
                          rd.sections?.timing ??
                          report.kpis?.timing ??
                          rd.kpis?.timing,
                      };

                      const canExpand = !isPending || hasDraft;

                      return (
                        <div
                          key={rId}
                          className={cn(
                            "bg-white border rounded-2xl shadow-sm overflow-hidden",
                            isPending && !hasDraft
                              ? "border-red-200"
                              : "border-[#EAE3DF]"
                          )}
                        >
                          <div
                            className={cn(
                              "p-4 transition-colors",
                              canExpand
                                ? "cursor-pointer hover:bg-gray-50"
                                : "cursor-default"
                            )}
                            onClick={() => canExpand && toggleExpand(rId)}
                          >
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <input
                                type="checkbox"
                                checked={selectedReports.includes(rId)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSelectedReports((prev) =>
                                    e.target.checked
                                      ? [...prev, rId]
                                      : prev.filter((id) => id !== rId)
                                  );
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 rounded border-gray-300 accent-[#CE7A5A] cursor-pointer"
                              />
                              <h3 className="font-bold text-[#1A1A1A] text-[15px]">
                                {report.name}
                              </h3>
                              {(report.name?.includes("HOD") ||
                                report.name?.includes("TL")) && (
                                <span className="flex items-center gap-1 border border-orange-200 bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                  <Crown className="w-3 h-3 fill-orange-400" />{" "}
                                  HOD
                                </span>
                              )}
                              {report.department && (
                                <span className="border border-blue-200 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {report.department}
                                </span>
                              )}
                              {isPending && !hasDraft ? (
                                <span className="ml-auto text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                                  PENDING
                                </span>
                              ) : (
                                <span className="ml-auto text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Submitted
                                </span>
                              )}
                            </div>

                            <div className="text-[12px] text-gray-400 mb-3 ml-6">
                              {report.email}
                              {report.submitted_at && (
                                <span className="ml-2">
                                  • {formatDateTime(report.submitted_at)}
                                </span>
                              )}
                              {isPending &&
                                hasDraft &&
                                report.daily_report?.submitted_at && (
                                  <span className="ml-2 text-gray-400">
                                    •{" "}
                                    {formatDateTime(
                                      report.daily_report.submitted_at
                                    )}
                                  </span>
                                )}
                            </div>

                            {(!isPending || hasDraft) && (
                              <div className="flex flex-wrap items-center gap-2 mb-3 ml-6">
                                {report.score !== null &&
                                  report.score !== undefined && (
                                    <span className="text-[11px] font-bold text-gray-700 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg">
                                      {report.score}/20
                                    </span>
                                  )}
                                {displayKpis.tasks !== undefined &&
                                  displayKpis.tasks !== null && (
                                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg">
                                      Tasks/Issues: {displayKpis.tasks}
                                    </span>
                                  )}
                                {displayKpis.issues !== undefined &&
                                  displayKpis.issues !== null && (
                                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                                      Issues: {displayKpis.issues}
                                    </span>
                                  )}
                                {displayKpis.planning !== undefined &&
                                  displayKpis.planning !== null && (
                                    <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
                                      Planning: {displayKpis.planning}
                                    </span>
                                  )}
                                {displayKpis.timing !== undefined &&
                                  displayKpis.timing !== null && (
                                    <span className="text-[11px] font-bold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
                                      Timing: {displayKpis.timing}
                                    </span>
                                  )}
                              </div>
                            )}

                            {(!isPending || hasDraft) && dateRow.length > 0 && (
                              <div className="flex items-center gap-1.5 ml-6 flex-wrap">
                                {dateRow.map((d: any, i: number) => {
                                  const s =
                                    d.status === "non_meeting"
                                      ? "holiday"
                                      : d.status;
                                  return (
                                    <div
                                      key={i}
                                      className={cn(
                                        "flex flex-col items-center justify-center w-7 h-8 rounded-lg text-[10px] font-bold border",
                                        s === "done" || s === "submitted"
                                          ? "bg-[#2ECC71] text-white border-[#2ECC71]"
                                          : s === "missed"
                                            ? "bg-[#EB4A4A] text-white border-[#EB4A4A]"
                                            : s === "holiday"
                                              ? "bg-yellow-100 text-yellow-600 border-yellow-200"
                                              : "bg-gray-100 text-gray-400 border-gray-200"
                                      )}
                                    >
                                      <span className="text-[8px] opacity-80 leading-none mb-0.5">
                                        {d.day ? d.day.charAt(0) : ""}
                                      </span>
                                      <span className="leading-none">
                                        {d.date ?? ""}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {canExpand && (
                              <div className="flex justify-center mt-3">
                                <span className="text-[10px] font-bold text-[#CE8261] opacity-50">
                                  {isExpanded ? "▲ collapse" : "▼ view details"}
                                </span>
                              </div>
                            )}
                          </div>

                          {isExpanded && canExpand && (
                            <div className="bg-[#FFFAF8] border-t border-[#EAE3DF]">
                              <div className="p-5 space-y-5">
                                <div className="flex flex-wrap gap-3">
                                  {displayRd.self_rating != null && (
                                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-2.5">
                                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                      <span className="text-sm font-bold text-yellow-800">
                                        Self Rating: {displayRd.self_rating}/10
                                      </span>
                                    </div>
                                  )}
                                  {rawDisplayRd?.total_score !== undefined &&
                                    rawDisplayRd?.total_score !== null && (
                                      <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5">
                                        <span className="text-sm font-bold text-purple-800">
                                          Total Score:{" "}
                                          {rawDisplayRd.total_score}
                                        </span>
                                      </div>
                                    )}
                                  {displayRd.is_absent !== null &&
                                    displayRd.is_absent !== undefined && (
                                      <div
                                        className={cn(
                                          "flex items-center gap-2 rounded-xl px-4 py-2.5 border",
                                          displayRd.is_absent
                                            ? "bg-red-50 border-red-100"
                                            : "bg-green-50 border-green-100"
                                        )}
                                      >
                                        <span
                                          className={cn(
                                            "text-sm font-bold",
                                            displayRd.is_absent
                                              ? "text-red-700"
                                              : "text-green-700"
                                          )}
                                        >
                                          {displayRd.is_absent
                                            ? "Absent"
                                            : "Present"}
                                        </span>
                                      </div>
                                    )}
                                </div>

                                {displayRd.big_win && (
                                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-3">
                                    <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                      <div className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mb-1">
                                        Big Win 🏆
                                      </div>
                                      <p className="text-sm font-semibold text-amber-900">
                                        {displayRd.big_win}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {/* Accomplishments */}
                                  <div className="bg-white border border-[#F0E8E3] rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                                      <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                      </div>
                                      <h4 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
                                        Accomplishments
                                      </h4>
                                    </div>
                                    {displayRd.accomplishments.length === 0 ? (
                                      <p className="text-xs text-neutral-300 italic">
                                        None recorded.
                                      </p>
                                    ) : (
                                      <ul className="space-y-2">
                                        {displayRd.accomplishments.map(
                                          (item: any, i: number) => (
                                            <li
                                              key={i}
                                              className="flex items-start gap-2 text-xs text-neutral-700"
                                            >
                                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                              <span className="leading-relaxed">
                                                {getItemTitle(item)}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </div>

                                  {/* Tasks & Issues */}
                                  <div className="bg-white border border-[#F0E8E3] rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                                      <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                                      </div>
                                      <h4 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
                                        Tasks & Issues
                                      </h4>
                                    </div>
                                    {displayRd.tasks_issues.length === 0 ? (
                                      <p className="text-xs text-neutral-300 italic">
                                        None recorded.
                                      </p>
                                    ) : (
                                      <ul className="space-y-2.5">
                                        {displayRd.tasks_issues.map(
                                          (item: any, i: number) => (
                                            <li
                                              key={i}
                                              className="flex items-start gap-2 text-xs text-neutral-700"
                                            >
                                              <span
                                                className={cn(
                                                  "shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5",
                                                  getItemStatus(item) === "open"
                                                    ? "bg-red-100 text-red-600"
                                                    : getItemStatus(item) ===
                                                        "closed"
                                                      ? "bg-green-100 text-green-600"
                                                      : "bg-gray-100 text-gray-500"
                                                )}
                                              >
                                                {getItemStatus(item)}
                                              </span>
                                              <span className="leading-relaxed">
                                                {getItemTitle(item)}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </div>

                                  {/* Tomorrow's Plan */}
                                  <div className="bg-white border border-[#F0E8E3] rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                                      <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                      </div>
                                      <h4 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
                                        Tomorrow's Plan
                                      </h4>
                                    </div>
                                    {displayRd.tomorrow_plan.length === 0 ? (
                                      <p className="text-xs text-neutral-300 italic">
                                        None recorded.
                                      </p>
                                    ) : (
                                      <ul className="space-y-2">
                                        {displayRd.tomorrow_plan.map(
                                          (item: any, i: number) => (
                                            <li
                                              key={i}
                                              className="flex items-start gap-2 text-xs text-neutral-700"
                                            >
                                              <Circle className="w-3 h-3 text-blue-300 mt-0.5 shrink-0" />
                                              <span className="leading-relaxed">
                                                {getItemTitle(item)}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-1">
                                  <button
                                    onClick={() => setIsTaskModalOpen(true)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 text-blue-600 bg-white border border-blue-200 rounded-full text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add Task
                                  </button>
                                  <button
                                    onClick={() => setIsIssueModalOpen(true)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 text-red-600 bg-white border border-red-200 rounded-full text-xs font-bold shadow-sm hover:bg-red-50 transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Stuck Issue
                                  </button>
                                  <button
                                    onClick={() => {
                                      setQuickActionOpenId(
                                        quickActionOpenId === rId ? null : rId
                                      );
                                      setQuickActionText("");
                                    }}
                                    className="flex items-center gap-1.5 px-4 py-1.5 text-orange-600 bg-white border border-orange-200 rounded-full text-xs font-bold shadow-sm hover:bg-orange-50 transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add to Plan
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (feedbackOpenId === rId) {
                                        setFeedbackOpenId(null);
                                      } else {
                                        setFeedbackOpenId(rId);
                                        setFeedbackRating(0);
                                        setFeedbackMessage("");
                                        loadPastFeedbacks(report.user_id);
                                      }
                                    }}
                                    className="flex items-center gap-1.5 px-4 py-1.5 text-white bg-purple-600 border border-purple-700 rounded-full text-xs font-bold shadow-sm hover:bg-purple-700 transition-colors"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />{" "}
                                    Feedback
                                  </button>
                                </div>

                                {quickActionOpenId === rId && (
                                  <div className="border-t border-[#EAE3DF] pt-4 mt-1">
                                    <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-3">
                                      Quick Actions
                                    </p>
                                    <div className="flex items-center gap-3">
                                      <input
                                        autoFocus
                                        type="text"
                                        value={quickActionText}
                                        onChange={(e) =>
                                          setQuickActionText(e.target.value)
                                        }
                                        placeholder="Add to tomorrow's plan..."
                                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-200 placeholder:text-neutral-400"
                                        onKeyDown={async (e) => {
                                          if (
                                            e.key === "Enter" &&
                                            quickActionText.trim()
                                          ) {
                                            const ok = await updateJournal(
                                              report,
                                              {
                                                tomorrow_plan_item:
                                                  quickActionText.trim(),
                                              }
                                            );
                                            if (ok) {
                                              toast.success(
                                                "Added to tomorrow's plan!"
                                              );
                                              setQuickActionOpenId(null);
                                              setQuickActionText("");
                                              loadDailyData(true);
                                            }
                                          }
                                          if (e.key === "Escape") {
                                            setQuickActionOpenId(null);
                                            setQuickActionText("");
                                          }
                                        }}
                                      />
                                      <button
                                        onClick={async () => {
                                          if (quickActionText.trim()) {
                                            const ok = await updateJournal(
                                              report,
                                              {
                                                tomorrow_plan_item:
                                                  quickActionText.trim(),
                                              }
                                            );
                                            if (ok) {
                                              toast.success(
                                                "Added to tomorrow's plan!"
                                              );
                                              setQuickActionOpenId(null);
                                              setQuickActionText("");
                                              loadDailyData(true);
                                            }
                                          }
                                        }}
                                        className="px-5 py-2 rounded-full text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm"
                                      >
                                        Add
                                      </button>
                                      <button
                                        onClick={() => {
                                          setQuickActionOpenId(null);
                                          setQuickActionText("");
                                        }}
                                        className="px-5 py-2 rounded-full text-xs font-bold text-neutral-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* ── 2-COLUMN FEEDBACK BLOCK ── */}
                                {feedbackOpenId === rId && (
                                  <div className="border-t border-[#EAE3DF] pt-5 mt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      {/* COLUMN 1: Add New Feedback Form */}
                                      <div>
                                        <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                                          Provide Feedback
                                        </p>
                                        <p className="text-sm font-bold text-neutral-800 mb-2">
                                          Rating (1-5 stars)
                                        </p>
                                        <div className="flex items-center gap-1 mb-4">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                              key={star}
                                              type="button"
                                              onClick={() =>
                                                setFeedbackRating(star)
                                              }
                                              className="transition-transform hover:scale-110"
                                            >
                                              <svg
                                                className="w-8 h-8"
                                                viewBox="0 0 24 24"
                                                fill={
                                                  star <= feedbackRating
                                                    ? "#F59E0B"
                                                    : "none"
                                                }
                                                stroke={
                                                  star <= feedbackRating
                                                    ? "#F59E0B"
                                                    : "#D1D5DB"
                                                }
                                                strokeWidth="1.5"
                                              >
                                                <path
                                                  strokeLinejoin="round"
                                                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                                />
                                              </svg>
                                            </button>
                                          ))}
                                        </div>
                                        <p className="text-sm font-bold text-neutral-800 mb-2">
                                          Feedback Message
                                        </p>
                                        <textarea
                                          autoFocus
                                          value={feedbackMessage}
                                          onChange={(e) =>
                                            setFeedbackMessage(e.target.value)
                                          }
                                          placeholder="Enter constructive feedback..."
                                          rows={3}
                                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder:text-neutral-400 resize-y"
                                        />
                                        <div className="flex items-center gap-3 mt-4">
                                          <button
                                            onClick={async () => {
                                              if (feedbackRating === 0) {
                                                toast.error(
                                                  "Please select a star rating!"
                                                );
                                                return;
                                              }
                                              try {
                                                const loggedInUserId =
                                                  localStorage.getItem(
                                                    "userId"
                                                  ) || "";
                                                const payload = {
                                                  resource_type: "User",
                                                  resource_id: report.user_id,
                                                  rating_from_id:
                                                    loggedInUserId,
                                                  score: feedbackRating,
                                                  reviews: feedbackMessage,
                                                  positive_opening: "",
                                                  constructive_feedback: "",
                                                  positive_closing: "",
                                                };
                                                const res = await fetch(
                                                  `${getBaseUrl()}/ratings`,
                                                  {
                                                    method: "POST",
                                                    headers: {
                                                      ...getAuthHeaders(),
                                                      "Content-Type":
                                                        "application/json",
                                                    },
                                                    body: JSON.stringify(
                                                      payload
                                                    ),
                                                  }
                                                );
                                                if (!res.ok)
                                                  throw new Error(
                                                    `HTTP ${res.status}`
                                                  );
                                                toast.success(
                                                  "Feedback added!"
                                                );
                                                setFeedbackOpenId(null);
                                                setFeedbackRating(0);
                                                setFeedbackMessage("");
                                                loadDailyData(true);
                                              } catch (err: any) {
                                                toast.error(
                                                  "Error adding feedback: " +
                                                    err.message
                                                );
                                              }
                                            }}
                                            className="px-6 py-2 rounded-2xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
                                          >
                                            Submit Feedback
                                          </button>
                                          <button
                                            onClick={() => {
                                              setFeedbackOpenId(null);
                                              setFeedbackRating(0);
                                              setFeedbackMessage("");
                                            }}
                                            className="px-6 py-2 rounded-2xl text-sm font-bold text-neutral-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>

                                      {/* COLUMN 2: Recent Feedbacks */}
                                      <div className="bg-[#FAF7F5] rounded-xl p-5 border border-[#EAE3DF] h-full flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                          <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
                                            Recent Feedbacks
                                          </p>
                                          <button
                                            onClick={handleFeedback}
                                            className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                                          >
                                            View All{" "}
                                            <ChevronRight className="w-3 h-3" />
                                          </button>
                                        </div>

                                        {isFetchingFeedbacks ? (
                                          <div className="flex justify-center items-center h-full py-6">
                                            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                          </div>
                                        ) : fetchedFeedbacks.length === 0 ? (
                                          <div className="flex flex-col items-center justify-center h-full py-6 text-neutral-400">
                                            <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
                                            <span className="text-xs font-medium italic">
                                              No past feedback found.
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                                            {fetchedFeedbacks
                                              .slice(0, 3)
                                              .map((fb: any, idx: number) => (
                                                <div
                                                  key={idx}
                                                  className="bg-white p-3 rounded-xl shadow-sm border border-gray-100"
                                                >
                                                  <div className="flex items-center gap-1 mb-1.5">
                                                    {[1, 2, 3, 4, 5].map(
                                                      (star) => (
                                                        <Star
                                                          key={star}
                                                          className={cn(
                                                            "w-3 h-3",
                                                            star <= fb.score
                                                              ? "text-yellow-400 fill-yellow-400"
                                                              : "text-gray-200"
                                                          )}
                                                        />
                                                      )
                                                    )}
                                                    {fb.created_at && (
                                                      <span className="text-[9px] text-gray-400 ml-auto font-medium">
                                                        {new Date(
                                                          fb.created_at
                                                        ).toLocaleDateString()}
                                                      </span>
                                                    )}
                                                  </div>
                                                  {fb.reviews ? (
                                                    <p className="text-xs text-neutral-700 leading-relaxed">
                                                      {fb.reviews}
                                                    </p>
                                                  ) : (
                                                    <p className="text-xs text-neutral-400 italic">
                                                      No review provided.
                                                    </p>
                                                  )}
                                                </div>
                                              ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {failedMembers.length > 0 && (
            <div className="bg-[#fff1f2] border border-red-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-4">
                <AlertTriangle className="w-4 h-4" /> Team Members Who Failed to
                Submit ({failedMembers.length}):
              </div>
              <div className="flex flex-wrap gap-2.5">
                {failedMembers.map((member: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white border border-red-100 px-3 py-1.5 rounded-full shadow-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[12px] font-bold text-gray-700">
                      {member.name || member}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {isTaskModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex">
            <div
              className="flex-1 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsTaskModalOpen(false)}
            />
            <div
              className="relative flex flex-col bg-white shadow-2xl"
              style={{ width: "min(760px, 95vw)" }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
                <h2 className="text-base font-bold text-neutral-900">
                  Add Tasks
                </h2>
                <button
                  onClick={() => setIsTaskModalOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-[3px] bg-[#C72030] w-full shrink-0" />
              <div className="flex-1 overflow-y-auto">
                <ProjectTaskCreateModal
                  isEdit={false}
                  onCloseModal={() => setIsTaskModalOpen(false)}
                  className="max-w-full mx-0"
                  prefillData={null}
                  opportunityId={null}
                  onSuccess={() => {
                    setIsTaskModalOpen(false);
                    loadDailyData(true);
                  }}
                  isConversion={false}
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      <AddIssueModal
        openDialog={isIssueModalOpen}
        handleCloseDialog={() => setIsIssueModalOpen(false)}
        preSelectedProjectId={undefined}
      />

      <style>{`
        select option { font-family: 'Poppins', sans-serif; padding: 8px 12px; font-size: 13px; color: #374151; background: #ffffff; }
        select option:checked, select option:hover { background: #FFF3EE; color: #CE7A5A; }
        select:focus { outline: none; }
        .calendar-row::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default DailyTab;
