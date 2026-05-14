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
  loading = false,
}: any) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center gap-2 px-6 py-2 rounded-2xl text-sm font-bold bg-[#CE7A5A] text-white shadow-sm hover:bg-[#BC6B4A] active:scale-97 transition-all disabled:opacity-60 disabled:cursor-not-allowed",
      className
    )}
  >
    {Icon && <Icon className={cn("w-4 h-4", loading && "animate-spin")} />}{" "}
    {children}
  </button>
);

// ── Custom Searchable Select ──
const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder = "All",
}: any) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  const selected = options.find((o: any) => String(o.value) === String(value));
  const displayValue = selected?.label || placeholder;

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredOptions = options.filter((o: any) =>
    (o.label || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      ref={ref}
      className="relative"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="relative flex items-center min-w-[160px]">
        <input
          type="text"
          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm font-medium text-neutral-700 shadow-sm focus:outline-none focus:border-[#CE7A5A]/60 hover:border-[#CE7A5A]/60 transition-all cursor-pointer placeholder:text-neutral-700"
          placeholder={placeholder}
          value={open ? search : displayValue}
          onClick={() => {
            setOpen(true);
            search("");
          }}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
        />
        <ChevronDown
          className={cn(
            "absolute right-3 w-4 h-4 text-neutral-400 transition-transform pointer-events-none",
            open && "rotate-180"
          )}
        />
      </div>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-[999] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-full"
          style={{ maxHeight: 220, overflowY: "auto" }}
        >
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-2.5 text-sm font-medium text-neutral-500 text-center">
              No results found
            </div>
          ) : (
            filteredOptions.map((opt: any) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors truncate",
                  String(value) === String(opt.value)
                    ? "bg-[#FFF3EE] text-[#CE7A5A] font-semibold"
                    : "text-neutral-700 hover:bg-[#FFF3EE] hover:text-[#CE7A5A]"
                )}
              >
                {opt.label}
              </button>
            ))
          )}
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
    is_default: m.is_default || m.isDefault || false,
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
  if (typeof item === "object")
    return String(item.title || item.name || item.text || "");
  return String(item);
};

const getItemStatus = (item: any): string => {
  if (!item || typeof item !== "object") return "open";
  return item.status || "open";
};

const mergeUniqueItems = (primary: any[] = [], fallback: any[] = []) => {
  const merged: any[] = [];
  const seen = new Set<string>();
  [...primary, ...fallback].forEach((item) => {
    const title = getItemTitle(item).trim();
    const key = title.toLowerCase();
    if (!title || seen.has(key)) return;
    seen.add(key);
    merged.push(item);
  });
  return merged;
};

const formatSelfRating = (rating: any): string => {
  if (rating === null || rating === undefined || rating === "") return "";
  const ratingText = String(rating).trim();
  return ratingText.includes("/") ? ratingText : `${ratingText}/10`;
};

// ── Strip missed-members prefix from textarea value before saving ──
const stripMissedMembersPrefix = (text: string): string => {
  const missedHeaderMatch = text.match(
    /^Team Members Who Missed Report \(\d+\):\n(?:- .+\n)*\n?/
  );
  if (missedHeaderMatch) {
    return text.slice(missedHeaderMatch[0].length);
  }
  return text;
};

// ── Resolve the "true" raw source for a report ──
const resolveRawSource = (report: any) => {
  const rd = report.report_data || {};
  const draftRaw = report.daily_report?.report_data || {};
  const hasDraft = !!report.daily_report;
  const hasReportData = rd && Object.keys(rd).length > 0;

  const normalizeDraftRaw = (raw: any) => ({
    ...raw,
    accomplishments:
      raw.accomplishments?.items ||
      (Array.isArray(raw.accomplishments) ? raw.accomplishments : []),
    self_rating:
      raw.self_rating ?? raw.details?.self_rating ?? raw.sections?.self_rating ?? null,
    total_score: raw.total_score ?? null,
    is_absent: raw.details?.is_absent ?? raw.sections?.is_absent ?? null,
  });

  if (!hasReportData && hasDraft) {
    return normalizeDraftRaw(draftRaw);
  }

  if (report.status === "pending" && hasDraft) {
    return normalizeDraftRaw(draftRaw);
  }

  if (hasReportData && hasDraft) {
    const normalizedDraft = normalizeDraftRaw(draftRaw);

    return {
      ...normalizedDraft,
      ...rd,
      tasks_issues: Array.isArray(rd.tasks_issues)
        ? mergeUniqueItems(rd.tasks_issues, normalizedDraft.tasks_issues || [])
        : normalizedDraft.tasks_issues || [],
      tomorrow_plan: Array.isArray(rd.tomorrow_plan)
        ? mergeUniqueItems(rd.tomorrow_plan, normalizedDraft.tomorrow_plan || [])
        : normalizedDraft.tomorrow_plan || [],
      accomplishments:
        rd.accomplishments?.items ||
        (Array.isArray(rd.accomplishments)
          ? rd.accomplishments
          : normalizedDraft.accomplishments || []),
      self_rating: normalizedDraft.self_rating,
      total_score:
        rd.total_score ??
        normalizedDraft.total_score,
      is_absent:
        rd.is_absent ??
        normalizedDraft.is_absent,
    };
  }

  return rd;
};

// -────────────────────────────────────────────
const DailyTab = ({
  onMeetingSaved,
}: {
  onMeetingSaved?: (date: string) => void;
}) => {
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
  const [calendarDateRow, setCalendarDateRow] = useState<any[]>([]);
  const isArrowNav = React.useRef(false);
  const [expandedReports, setExpandedReports] = useState<any[]>([]);
  const [selectedReports, setSelectedReports] = useState<any[]>([]);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [savedMeetingNotes, setSavedMeetingNotes] = useState("");
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

  // ── Auto-populate checked in reports into selectedReports ──
  useEffect(() => {
    if (dailyData) {
      const reports = dailyData.member_reports || dailyData.reports || [];
      const checkedInIds = reports
        .filter((r: any) => r.checked_in_meeting === true)
        .map((r: any) => r.journal_id || r.user_id);

      setSelectedReports((prev) => {
        const combined = new Set([...prev, ...checkedInIds]);
        return Array.from(combined);
      });
    }
  }, [dailyData]);

  // ── Load Dropdowns ──
  useEffect(() => {
    fetchDynamicMeetings()
      .then((list) => {
        setMeetingsList(list);
        setMeetingsLoaded(true);
        if (list?.length > 0) {
          const defaultMeeting = list.find((m) => m.is_default);
          if (defaultMeeting) {
            setSelectedMeetingId(defaultMeeting.id);
          } else {
            setSelectedMeetingId(list[0].id);
          }
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

      if (json.success || json.data) {
        setDailyData(json.data);

        if (isArrowNav.current || calendarDateRow.length === 0) {
          setCalendarDateRow(json.data?.date_row || []);
        } else {
          const freshDateRow = json.data?.date_row || [];
          setCalendarDateRow((prev) =>
            prev.map((d) => {
              const freshData = freshDateRow.find(
                (fd: any) => fd.full_date === d.full_date
              );
              return freshData ? { ...d, status: freshData.status } : d;
            })
          );
        }
        isArrowNav.current = false;

        const reports: any[] =
          json.data?.member_reports || json.data?.reports || [];
        const headId = json.data?.config?.meeting_head?.id;

        const meetingJournalReport =
          reports.find(
            (r: any) =>
              r.user_id === headId &&
              r.status === "submitted" &&
              r.journal_id &&
              r.report_data?.meeting_notes
          ) ||
          reports.find(
            (r: any) =>
              r.status === "submitted" &&
              r.report_data?.meeting_notes &&
              r.journal_id
          ) ||
          reports.find((r: any) => r.status === "submitted" && r.journal_id) ||
          null;

        setMeetingJournalId(
          json.data?.meeting_journal_id ||
            meetingJournalReport?.journal_id ||
            null
        );

        if (!skipNotesRestore) {
          const DEFAULT_DISCUSSION = "Key Discussion Points:\n";

          if (meetingJournalReport) {
            let savedDiscussion = DEFAULT_DISCUSSION;

            const notesData =
              json.data?.report_data?.meeting_notes ||
              meetingJournalReport?.report_data?.meeting_notes;
            if (notesData) {
              if (Array.isArray(notesData)) {
                savedDiscussion =
                  notesData[0]?.key_discussion_points || DEFAULT_DISCUSSION;
              } else if (typeof notesData === "object") {
                savedDiscussion =
                  notesData.key_discussion_points || DEFAULT_DISCUSSION;
              }
            }

            setMeetingNotes(savedDiscussion);
            setSavedMeetingNotes(savedDiscussion);
          } else {
            const allReports: any[] =
              json.data?.member_reports || json.data?.reports || [];
            const pureMissed = [
              ...allReports
                .filter((r: any) => r.status === "pending" && !r.daily_report)
                .map((r: any) => r.name),
              ...(json.data?.missed_members || []).map(
                (m: any) => m.name || m.user
              ),
            ].filter(Boolean);
            const uniqueMissed = [...new Set(pureMissed)] as string[];

            let prefill = "";
            if (uniqueMissed.length > 0) {
              prefill =
                `Team Members Who Missed Report (${uniqueMissed.length}):\n` +
                uniqueMissed.map((name: string) => `- ${name}`).join("\n") +
                `\n\n`;
            }
            prefill += DEFAULT_DISCUSSION;
            setMeetingNotes(prefill);
            setSavedMeetingNotes(prefill);
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
    setCalendarDateRow([]);
    setMeetingJournalId(null);
  }, [selectedMeetingId]);

  useEffect(() => {
    setMeetingJournalId(null);
    loadDailyData(false);
  }, [selectedMeetingId, activeDate]);

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
        const rawList = Array.isArray(data)
          ? data
          : data.data || data.ratings || [];
        // ── Sort newest first by created_at ──
        const sorted = [...rawList].sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setFetchedFeedbacks(sorted);
      } else {
        console.error(`HTTP Error: ${res.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch past feedbacks:", error);
    } finally {
      setIsFetchingFeedbacks(false);
    }
  };

  // ── updateJournal ──
  const updateJournal = async (
    report: any,
    patch: { self_rating?: number; tomorrow_plan_item?: string }
  ) => {
    const journalId = report.journal_id || report.daily_report?.id;
    if (!journalId) {
      toast.error("Journal ID not found for this report.");
      return false;
    }

    const rawSource = resolveRawSource(report);
    const baseReportData =
      report.report_data ||
      report.daily_report?.report_data ||
      rawSource ||
      {};

    if (patch.tomorrow_plan_item) {
      const existingPlan: any[] = Array.isArray(baseReportData.tomorrow_plan)
        ? baseReportData.tomorrow_plan
        : [];

      const updatedPlan = [
        ...existingPlan,
        { title: patch.tomorrow_plan_item.trim() },
      ];
      const updatedReportData = {
        ...baseReportData,
        tomorrow_plan: updatedPlan,
      };

      try {
        const res = await fetch(
          `${getBaseUrl()}/user_journals/${journalId}.json`,
          {
            method: "PATCH",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              report_data: updatedReportData,
            }),
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return true;
      } catch (err: any) {
        toast.error("Error updating plan: " + err.message);
        return false;
      }
    }

    if (patch.self_rating !== undefined) {
      try {
        const res = await fetch(
          `${getBaseUrl()}/user_journals/${journalId}.json`,
          {
            method: "PATCH",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              self_rating: patch.self_rating,
              report_data: {
                ...rawSource,
                self_rating: patch.self_rating,
              },
            }),
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return true;
      } catch (err: any) {
        toast.error("Error updating rating: " + err.message);
        return false;
      }
    }

    return false;
  };

  const changeDate = (days: number) => {
    isArrowNav.current = true;
    const currentIndex = calendarRow.findIndex(
      (d: any) => d.full_date === activeDate
    );

    if (currentIndex !== -1) {
      let nextIndex = currentIndex + days;
      while (nextIndex >= 0 && nextIndex < calendarRow.length) {
        const s = calendarRow[nextIndex].status;
        if (s !== "holiday" && s !== "non_meeting" && s !== "upcoming") {
          setActiveDate(calendarRow[nextIndex].full_date);
          return;
        }
        nextIndex += days;
      }
    }

    const d = new Date(activeDate);
    d.setDate(d.getDate() + days);
    setActiveDate(d.toISOString().split("T")[0]);
  };

  const toggleExpand = (id: any) =>
    setExpandedReports((p) =>
      p.includes(id) ? p.filter((r) => r !== id) : [...p, id]
    );

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
        const rawSource = resolveRawSource(report);
        const source = normalizeReportData(rawSource);
        const draftRaw = report.daily_report?.report_data || {};

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

        const kpis = report.kpis || rawSource.kpis || {};
        const sections = draftRaw.sections || rawSource.sections || {};

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

const buildMeetingNotesObject = (
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

    const cleanDiscussion = stripMissedMembersPrefix(meetingNotesText).trim();

    const detailed_reports = allReports
      .filter((r: any) => r.status !== "pending" || !!r.daily_report)
      .map((report: any) => {
        const rawSource = resolveRawSource(report);

        let accRaw: any[] = [];
        if (Array.isArray(rawSource.accomplishments))
          accRaw = rawSource.accomplishments;
        else if (Array.isArray(rawSource.accomplishments?.items))
          accRaw = rawSource.accomplishments.items;

        const accomplishments = accRaw.map((a: any) => ({
          text: a.title || a.text || "",
          done: !!a.done || !!a.completed,
        }));

        let tpRaw: any[] = [];
        if (Array.isArray(rawSource.tomorrow_plan))
          tpRaw = rawSource.tomorrow_plan;

        const tomorrow_plan = tpRaw.map((p: any) =>
          typeof p === "string" ? p : p.title || p.text || ""
        );

        const selfRatingVal =
          rawSource.details?.self_rating ??
          rawSource.sections?.self_rating ??
          rawSource.self_rating ??
          0;

        const isAbsent =
          rawSource.details?.is_absent ??
          rawSource.sections?.is_absent ??
          rawSource.is_absent ??
          false;

        return {
          user_id: report.user_id, // <--- YAHAN USER ID ADD KIYA HAI
          name: report.name || "Unknown",
          attendance: isAbsent ? "Absent" : "Present",
          self_rating: `${selfRatingVal}/10`,
          kpis: Array.isArray(rawSource.kpis) ? rawSource.kpis : [],
          accomplishments,
          tomorrow_plan,
        };
      });

    return {
      missed_report_members: pureMissedNames,
      key_discussion_points: cleanDiscussion,
      detailed_reports,
    };
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
      const { selectedReportRows, selectedMissedMembers, selectedUserIds } =
        getSelectedMeetingScope(allReports, allMissed);

      if (!ensureSelectedMembersForPayload(selectedUserIds)) {
        setIsSavingMeeting(false);
        return;
      }

      const {
        allAccomplishments,
        allTasksIssues,
        allTomorrowPlan,
        combinedBigWin,
        avgSelfRating,
        combinedKpis,
      } = buildCombinedData(selectedReportRows);

      const meetingNotesObj = buildMeetingNotesObject(
        selectedReportRows,
        selectedMissedMembers,
        meetingNotes
      );

      const reportDataPayload = {
        meeting_notes: meetingNotesObj,
        accomplishments: allAccomplishments.map((a) => ({
          title: a.title || a.text || "",
        })),
        tasks_issues: allTasksIssues.map((t) => ({
          title: t.title || t.text || "",
          status: t.status || "open",
        })),
        big_win: combinedBigWin || null,
        tomorrow_plan: allTomorrowPlan.map((p) => ({
          title: p.title || p.text || "",
        })),
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
      };

      const payload = {
        meeting_config_id: parseInt(selectedMeetingId, 10),
        report_date: activeDate,
        user_ids: selectedUserIds,
        member_ids: selectedUserIds,
        self_rating: avgSelfRating,
        is_absent: false,
        status: "submitted",
        report_data: reportDataPayload,
      };

      const res = await fetch(
        `${getBaseUrl()}/user_journals/submit_daily_meeting`,
        {
          method: "POST",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await res.json().catch(() => null);
      if (!res.ok || (responseData && responseData.success === false)) {
        const errorMsg =
          responseData?.message || responseData?.error || `HTTP ${res.status}`;
        throw new Error(errorMsg);
      }

      toast.success("Meeting saved successfully!");
      if (onMeetingSaved) onMeetingSaved(activeDate);

      const newId =
        responseData?.data?.id || responseData?.id || responseData?.journal_id;
      if (newId) {
        setMeetingJournalId(newId);
      }

      setCalendarDateRow((prev) =>
        prev.map((d) =>
          d.full_date === activeDate ? { ...d, status: "submitted" } : d
        )
      );

      const cleanDiscussion = stripMissedMembersPrefix(meetingNotes).trim();
      setMeetingNotes(cleanDiscussion);
      setSavedMeetingNotes(cleanDiscussion);

      await loadDailyData(true);
    } catch (err: any) {
      toast.error("Error saving meeting: " + err.message);
    } finally {
      setIsSavingMeeting(false);
    }
  };

  // ── Update Notes Only (PATCH) ──
  const handleUpdateNotesOnly = async () => {
    if (!meetingJournalId) {
      toast.error("No saved meeting found to update.");
      return;
    }
    setIsSavingMeeting(true);
    try {
      const allReports = dailyData?.member_reports || dailyData?.reports || [];
      const allMissed = dailyData?.missed_members || [];
      const { selectedReportRows, selectedMissedMembers, selectedUserIds } =
        getSelectedMeetingScope(allReports, allMissed);

      if (!ensureSelectedMembersForPayload(selectedUserIds)) {
        setIsSavingMeeting(false);
        return;
      }

      const meetingNotesObj = buildMeetingNotesObject(
        selectedReportRows,
        selectedMissedMembers,
        meetingNotes
      );

      const existingRd =
        allReports.find(
          (r: any) =>
            r.journal_id === meetingJournalId && r.report_data?.meeting_notes
        )?.report_data || {};

      const payload = {
        user_ids: selectedUserIds,
        member_ids: selectedUserIds,
        report_data: {
          ...existingRd,
          meeting_notes: meetingNotesObj,
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

      const responseData = await res.json().catch(() => null);
      if (!res.ok || (responseData && responseData.success === false)) {
        const errorMsg =
          responseData?.message || responseData?.error || `HTTP ${res.status}`;
        throw new Error(errorMsg);
      }

      toast.success("Meeting notes updated!");
      setSavedMeetingNotes(meetingNotes);
      await loadDailyData(true);
    } catch (err: any) {
      toast.error("Error updating meeting notes: " + err.message);
    } finally {
      setIsSavingMeeting(false);
    }
  };

  // ── Update Full Meeting (PATCH) ──
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
      const { selectedReportRows, selectedMissedMembers, selectedUserIds } =
        getSelectedMeetingScope(allReports, allMissed);

      if (!ensureSelectedMembersForPayload(selectedUserIds)) {
        setIsSavingMeeting(false);
        return;
      }

      const {
        allAccomplishments,
        allTasksIssues,
        allTomorrowPlan,
        combinedBigWin,
        avgSelfRating,
        combinedKpis,
      } = buildCombinedData(selectedReportRows);

      const meetingNotesObj = buildMeetingNotesObject(
        selectedReportRows,
        selectedMissedMembers,
        meetingNotes
      );

      const reportDataPayload = {
        meeting_notes: meetingNotesObj,
        accomplishments: allAccomplishments.map((a) => ({
          title: a.title || a.text || "",
        })),
        tasks_issues: allTasksIssues.map((t) => ({
          title: t.title || t.text || "",
          status: t.status || "open",
        })),
        big_win: combinedBigWin || null,
        tomorrow_plan: allTomorrowPlan.map((p) => ({
          title: p.title || p.text || "",
        })),
        kpis: {
          score: `${combinedKpis.score}`,
          tasks: `${combinedKpis.tasks}`,
          issues: `${combinedKpis.issues}`,
          planning: `${combinedKpis.planning}`,
          timing: `${combinedKpis.timing}`,
        },
      };

      const payload = {
        user_ids: selectedUserIds,
        member_ids: selectedUserIds,
        self_rating: avgSelfRating,
        status: "submitted",
        report_data: reportDataPayload,
      };

      const res = await fetch(
        `${getBaseUrl()}/user_journals/${meetingJournalId}.json`,
        {
          method: "PATCH",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await res.json().catch(() => null);
      if (!res.ok || (responseData && responseData.success === false)) {
        const errorMsg =
          responseData?.message || responseData?.error || `HTTP ${res.status}`;
        throw new Error(errorMsg);
      }

      toast.success("Meeting updated successfully!");
      setSavedMeetingNotes(meetingNotes);
      await loadDailyData(true);
    } catch (err: any) {
      toast.error("Error updating meeting: " + err.message);
    } finally {
      setIsSavingMeeting(false);
    }
  };

  // ── Derived Data ──
  const dateRow = dailyData?.date_row || [];
  const calendarRow = calendarDateRow.length > 0 ? calendarDateRow : dateRow;
  const config = dailyData?.config;
  const topDateStr = dailyData?.date || activeDate;
  const configName =
    config?.name || (selectedMeetingId === "all" ? "All Meetings" : "Meeting");

  const activeDateStatus = calendarRow.find(
    (d: any) => d.full_date === activeDate
  )?.status;

  const isActiveDateSubmitted =
    !!meetingJournalId ||
    activeDateStatus === "done" ||
    activeDateStatus === "submitted";

  const notesChanged = meetingNotes.trim() !== savedMeetingNotes.trim();

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

  const getReportSelectionKey = (report: any) =>
    String(report?.journal_id || report?.user_id || "");

  const getSelectedMeetingScope = (reports: any[], missedMembers: any[]) => {
    const selectedKeys = new Set(selectedReports.map((id) => String(id)));
    const selectedReportRows = reports.filter((report: any) =>
      selectedKeys.has(getReportSelectionKey(report))
    );
    const selectedUserIds = Array.from(
      new Set(
        selectedReportRows
          .map((report: any) => Number(report.user_id))
          .filter((id: number) => Number.isFinite(id) && id > 0)
      )
    );
    const selectedUserIdSet = new Set(selectedUserIds.map(String));
    const selectedMissedMembers = missedMembers.filter((member: any) =>
      selectedUserIdSet.has(String(member.id))
    );

    return { selectedReportRows, selectedMissedMembers, selectedUserIds };
  };

  const ensureSelectedMembersForPayload = (selectedUserIds: number[]) => {
    if (selectedUserIds.length > 0) return true;
    toast.error("Please select at least one user.");
    return false;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = memberReports.map((r: any) => r.journal_id || r.user_id);
      setSelectedReports(allIds);
      toast.success(
        `${allIds.length} report${allIds.length !== 1 ? "s" : ""} selected`
      );
    } else {
      const checkedInIds = memberReports
        .filter((r: any) => r.checked_in_meeting === true)
        .map((r: any) => r.journal_id || r.user_id);
      setSelectedReports(checkedInIds);
      toast("Selection cleared for pending members", { icon: "✕" });
    }
  };

  const handleFeedback = () => {
    navigate("/admin-compass/feedback-dashboard");
  };

  const visibleReportIds = memberReports.map((r: any) =>
    String(r.journal_id || r.user_id)
  );
  const areAllVisibleReportsSelected =
    visibleReportIds.length > 0 &&
    visibleReportIds.every((id: string) =>
      selectedReports.map((selectedId) => String(selectedId)).includes(id)
    );

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
          <div
            className="flex gap-3 flex-wrap py-4 px-3"
            style={{ overflow: "visible" }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="rounded-[18px] skeleton"
                style={{ width: 100, height: 120 }}
              />
            ))}
          </div>
        ) : noMeetings ? (
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
          <div
            className="flex gap-3 flex-wrap py-4 px-3"
            style={{ overflow: "visible" }}
          >
            {calendarRow.map((dateItem: any) => {
              const isSelected = dateItem.full_date === activeDate;
              let rawStatus = dateItem.status;

              if (isSelected && meetingJournalId) {
                rawStatus = "submitted";
              }

              const isUpcoming = rawStatus === "upcoming";

              if (isUpcoming) {
                return (
                  <div
                    key={dateItem.full_date}
                    className="relative select-none cursor-not-allowed"
                    title="Upcoming – not selectable"
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
                bg = "#F5D142";
                textColor = "#8A6D3B";
                labelBg = "rgba(0,0,0,0.09)";
                labelColor = "#8A6D3B";
                displayLabel = "Holiday";
              }

              const isHoliday =
                rawStatus === "holiday" || rawStatus === "non_meeting";

              return (
                <div
                  key={dateItem.full_date}
                  onClick={
                    isHoliday
                      ? undefined
                      : () => setActiveDate(dateItem.full_date)
                  }
                  className={cn(
                    "relative select-none",
                    isHoliday ? "cursor-not-allowed" : "cursor-pointer"
                  )}
                  title={isHoliday ? "Holiday – not selectable" : undefined}
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
            <SearchableSelect
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
              <SearchableSelect
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
              <div className="h-9 w-9 rounded-2xl skeleton" />
              <div className="space-y-2">
                <div className="w-32 h-4 rounded-full skeleton" />
                <div className="w-20 h-3 rounded-full skeleton" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-7 rounded-2xl skeleton" />
              <div className="w-24 h-7 rounded-2xl skeleton" />
              <div className="w-20 h-7 rounded-2xl skeleton" />
            </div>
          </div>
          <div className="p-4 space-y-6">
            <div className="border border-[#F0EBE8] rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between p-3 border-b border-[#F0EBE8] bg-[#FAFAFA]">
                <div className="w-24 h-4 rounded-full skeleton" />
                <div className="w-8 h-8 rounded-xl skeleton" />
              </div>
              <div className="p-4 h-24 bg-white" />
              <div className="p-3 border-t border-[#F0EBE8] bg-[#FAFAFA] flex justify-end">
                <div className="w-32 h-9 rounded-2xl skeleton" />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-[#F0EBE8] rounded-2xl p-4 bg-white shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded skeleton" />
                    <div className="w-40 h-5 rounded-full skeleton" />
                    <div className="w-16 h-4 rounded-full ml-auto skeleton" />
                  </div>
                  <div className="w-48 h-3 rounded-full ml-7 skeleton" />
                  <div className="flex gap-2 ml-7">
                    <div className="w-12 h-6 rounded-lg skeleton" />
                    <div className="w-16 h-6 rounded-lg skeleton" />
                    <div className="w-16 h-6 rounded-lg skeleton" />
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
                {/* ══ Meeting Notes Box ══ */}
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
                    <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-2">
                      {meetingJournalId ? "Discussion Points" : "Meeting Notes"}
                    </p>
                    <textarea
                      value={meetingNotes}
                      onChange={(e) => setMeetingNotes(e.target.value)}
                      className="w-full border border-[rgba(218,119,86,0.18)] rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.22)] min-h-[160px] resize-y placeholder:text-neutral-400 text-neutral-700 bg-[#FFFAF8]"
                      placeholder={
                        meetingJournalId
                          ? "Edit discussion points..."
                          : "Team members who missed + discussion points will appear here..."
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between bg-[#FFFAF8] p-3 px-4 border-t border-[rgba(218,119,86,0.1)]">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={areAllVisibleReportsSelected}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 accent-[#CE7A5A] cursor-pointer"
                      />
                      <span className="text-sm font-medium text-[#1A1A1A]">
                        Select All
                      </span>
                    </label>

                    {isActiveDateSubmitted ? (
                      <div className="flex items-center gap-2">
                        {!notesChanged && (
                          <span className="text-[11px] text-neutral-400 font-medium italic">
                            Edit notes to enable update
                          </span>
                        )}
                        <BtnPrimary
                          icon={isSavingMeeting ? Loader2 : RefreshCw}
                          onClick={handleUpdateNotesOnly}
                          disabled={isSavingMeeting || !notesChanged}
                          loading={isSavingMeeting}
                          className="bg-blue-600 hover:bg-blue-700 border-blue-700"
                        >
                          {isSavingMeeting ? "Updating..." : "Update Notes"}
                        </BtnPrimary>
                      </div>
                    ) : meetingJournalId ? (
                      <BtnPrimary
                        icon={isSavingMeeting ? Loader2 : RefreshCw}
                        onClick={handleUpdateMeeting}
                        disabled={isSavingMeeting}
                        loading={isSavingMeeting}
                        className="bg-blue-600 hover:bg-blue-700 border-blue-700"
                      >
                        {isSavingMeeting ? "Updating..." : "Update Meeting"}
                      </BtnPrimary>
                    ) : (
                      <BtnPrimary
                        icon={isSavingMeeting ? Loader2 : FileText}
                        onClick={handleSaveMeeting}
                        disabled={isSavingMeeting}
                        loading={isSavingMeeting}
                      >
                        {isSavingMeeting ? "Saving..." : "Save Meeting"}
                      </BtnPrimary>
                    )}
                  </div>
                </div>

                {/* ══ Report Cards ══ */}
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
                      const isPermanentlyChecked = report.checked_in_meeting === true;
                      const draftRaw = report.daily_report?.report_data || {};

                      const rawDisplayRd = resolveRawSource(report);
                      const displayRd = normalizeReportData(rawDisplayRd);

                      const normalizedReportName = (report.name || "")
                        .trim()
                        .toLowerCase();

                      const userAccomplishments =
                        displayRd.accomplishments.filter(
                          (item: any) =>
                            !item.member ||
                            String(item.member).trim().toLowerCase() ===
                              normalizedReportName
                        );

                      const userTasksIssues = displayRd.tasks_issues.filter(
                        (item: any) =>
                          !item.member ||
                          String(item.member).trim().toLowerCase() ===
                            normalizedReportName
                      );

                      const userTomorrowPlan = displayRd.tomorrow_plan.filter(
                        (item: any) =>
                          !item.member ||
                          String(item.member).trim().toLowerCase() ===
                            normalizedReportName
                      );

                      // ── NEW LOGIC FOR SCORING ──
                      const sections = draftRaw?.sections || rawDisplayRd?.sections || displayRd?.sections || report?.report_data?.sections || {};
                      const kpisFallback = report.kpis || report.report_data?.kpis || rawDisplayRd?.kpis || {};

                      // Explicit strict checker to prevent `0` from failing over to fallback values
                      const getScore = (val1: any, val2: any) => {
                        if (val1 !== undefined && val1 !== null && val1 !== "") return Number(val1);
                        if (val2 !== undefined && val2 !== null && val2 !== "") return Number(val2);
                        return 0;
                      };

                      const kpiAchieved = getScore(sections.kpi_achievement, kpisFallback.score);
                      const kpiStr = `${kpiAchieved}/20`;

                      const tasksIssuesAchieved = getScore(sections.tasks_issues, kpisFallback.tasks);
                      const tasksIssuesStr = `${tasksIssuesAchieved}/20`;

                      const planAchieved = getScore(sections.planning, kpisFallback.planning);
                      const planStr = `${planAchieved}/20`;

                      const timeAchieved = getScore(sections.timing, kpisFallback.timing);
                      const timeStr = `${timeAchieved}/20`;

                      const selfRating =
                        rawDisplayRd?.self_rating ??
                        draftRaw?.details?.self_rating ??
                        draftRaw?.sections?.self_rating ??
                        null;
                      const selfRatingText = formatSelfRating(selfRating);

                      const totalScoreStr = Math.round(
                        rawDisplayRd?.total_score ??
                          draftRaw?.total_score ??
                          report.score ??
                          0
                      );

                      const canExpand = !isPending || hasDraft;
                      const isSelected = selectedReports.includes(rId);

                      return (
                        <div
                          key={rId}
                          className={cn(
                            "bg-white border rounded-xl shadow-sm overflow-hidden transition-all",
                            isSelected
                              ? "border-[#4A90E2] border-l-[4px]"
                              : "border-[#EAE3DF]"
                          )}
                        >
                          <div
                            className={cn(
                              "p-4 transition-colors flex items-start gap-4",
                              canExpand
                                ? "cursor-pointer hover:bg-gray-50"
                                : "cursor-default"
                            )}
                            onClick={() => canExpand && toggleExpand(rId)}
                          >
                            <div className="flex items-start gap-3 pt-1">
                              <input
                                type="checkbox"
                                checked={isPermanentlyChecked || isSelected}
                                disabled={isPermanentlyChecked}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (isPermanentlyChecked) return;
                                  setSelectedReports((prev) =>
                                    e.target.checked
                                      ? [...prev, rId]
                                      : prev.filter((id) => id !== rId)
                                  );
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className={cn(
                                  "w-4 h-4 rounded border-gray-300 accent-[#CE7A5A] shrink-0 mt-3",
                                  isPermanentlyChecked
                                    ? "opacity-60 cursor-not-allowed"
                                    : "cursor-pointer"
                                )}
                              />
                              <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center justify-center w-11 h-11 rounded-full border-[1.5px] border-[#CE7A5A] text-[#CE7A5A] font-extrabold text-[16px] shrink-0 bg-white">
                                  {totalScoreStr}
                                </div>
                                {selfRatingText && (
                                  <span className="text-[9px] font-bold text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                                    ⭐ {selfRatingText}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="font-bold text-[#1A1A1A] text-[15px] truncate">
                                      {report.name}
                                    </h3>
                                    {(report.name?.includes("HOD") ||
                                      report.name?.includes("TL")) && (
                                      <span className="flex items-center gap-1 border border-orange-200 bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                                        <Crown className="w-3 h-3 fill-orange-400" />{" "}
                                        HOD
                                      </span>
                                    )}
                                    {report.department && (
                                      <span className="border border-blue-200 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                        {report.department}
                                      </span>
                                    )}
                                    {isPending && !hasDraft ? (
                                      <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shrink-0">
                                        PENDING
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className="text-[11px] text-gray-400 mb-2 truncate">
                                    {report.email}
                                    {report.submitted_at && (
                                      <span className="ml-1">
                                        • {formatDateTime(report.submitted_at)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {canExpand && (
                                  <button className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-500 shrink-0 mt-1 transition-transform">
                                    <ChevronDown
                                      className={cn(
                                        "w-4 h-4 transition-transform",
                                        isExpanded && "rotate-180"
                                      )}
                                    />
                                  </button>
                                )}
                              </div>

                              {(!isPending || hasDraft) && (
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="px-2.5 py-0.5 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-[10px] font-bold">
                                    KPI: {kpiStr}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-[10px] font-bold">
                                    Tasks & Issues: {tasksIssuesStr}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-[10px] font-bold">
                                    Planning: {planStr}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-[10px] font-bold">
                                    Timing: {timeStr}
                                  </span>
                                </div>
                              )}

                              {canExpand && (
                                <p className="text-[10px] text-gray-400 italic mb-2 mt-1">
                                  Click to view tasks, accomplishments & plan
                                </p>
                              )}

                              {(!isPending || hasDraft) &&
                                dateRow.length > 0 && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                                      {configName}
                                    </span>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {dateRow.map((d: any, i: number) => {
                                        const s =
                                          d.status === "non_meeting"
                                            ? "holiday"
                                            : d.status;
                                        return (
                                          <div
                                            key={i}
                                            className={cn(
                                              "flex flex-col items-center justify-center w-[22px] h-[26px] rounded-[4px] text-[9px] font-bold border",
                                              s === "done" || s === "submitted"
                                                ? "bg-[#10B981] text-white border-[#10B981]"
                                                : s === "missed"
                                                  ? "bg-[#EF4444] text-white border-[#EF4444]"
                                                  : s === "holiday"
                                                    ? "bg-[#E0F2FE] text-[#3B82F6] border-[#E0F2FE]"
                                                    : "bg-gray-100 text-gray-400 border-gray-200"
                                            )}
                                          >
                                            <span className="text-[8px] opacity-90 leading-none mb-0.5">
                                              {d.day ? d.day.charAt(0) : ""}
                                            </span>
                                            <span className="leading-none">
                                              {d.date ?? ""}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>

                          {isExpanded && canExpand && (
                            <div className="bg-[#FFFAF8] border-t border-[#EAE3DF]">
                              <div className="p-5 space-y-5">
                                <div className="flex flex-wrap gap-3">
                                  {selfRatingText && (
                                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-2.5">
                                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                      <span className="text-sm font-bold text-yellow-800">
                                        Self Rating: {selfRatingText}
                                      </span>
                                    </div>
                                  )}
                                  {rawDisplayRd?.total_score != null && (
                                    <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5">
                                      <span className="text-sm font-bold text-purple-800">
                                        Total Score: {rawDisplayRd.total_score}
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
                                    {userAccomplishments.length === 0 ? (
                                      <p className="text-xs text-neutral-300 italic">
                                        None recorded.
                                      </p>
                                    ) : (
                                      <ul className="space-y-2">
                                        {userAccomplishments.map(
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
                                    {userTasksIssues.length === 0 ? (
                                      <p className="text-xs text-neutral-300 italic">
                                        None recorded.
                                      </p>
                                    ) : (
                                      <ul className="space-y-2.5">
                                        {userTasksIssues.map(
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
                                    {userTomorrowPlan.length === 0 ? (
                                      <p className="text-xs text-neutral-300 italic">
                                        None recorded.
                                      </p>
                                    ) : (
                                      <ul className="space-y-2">
                                        {userTomorrowPlan.map(
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

                                {/* Quick Add to Plan */}
                                {quickActionOpenId === rId && (
                                  <div className="border-t border-[#EAE3DF] pt-4 mt-1">
                                    <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-3">
                                      Add to Tomorrow's Plan
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
                                              await loadDailyData(false);
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
                                              await loadDailyData(false);
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
                                      {/* COLUMN 1: Add New Feedback */}
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
                                                await loadDailyData(false);
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

                                      {/* COLUMN 2: Recent Feedbacks — sorted newest first */}
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
                                            {/* Already sorted newest-first in loadPastFeedbacks */}
                                            {fetchedFeedbacks
                                              .slice(0, 3)
                                              .map((fb: any, idx: number) => (
                                                <div
                                                  key={fb.id ?? idx}
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
                                                      <span className="text-[9px] text-gray-400 ml-auto font-medium whitespace-nowrap">
                                                        {new Date(
                                                          fb.created_at
                                                        ).toLocaleDateString(
                                                          "en-IN",
                                                          {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "2-digit",
                                                          }
                                                        )}
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
                                                  {fb.reviewer && (
                                                    <p className="text-[9px] text-neutral-400 mt-1 font-semibold">
                                                      — {fb.reviewer.trim()}
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
                  onSuccess={async () => {
                    setIsTaskModalOpen(false);
                    await loadDailyData(false);
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
    </div>
  );
};

export default DailyTab;
