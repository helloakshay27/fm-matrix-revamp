import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  History as HistoryIcon,
  FileText,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Edit,
  Trash,
  Sparkles,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBaseUrl, getAuthHeaders } from "./Shared";
import { toast } from "sonner";

const cleanDiscussionPoints = (rawText: string) => {
  if (!rawText) return "";
  const splitMarker = "DETAILED REPORTS";
  if (rawText.includes(splitMarker)) {
    let cleaned = rawText.split(splitMarker)[0];
    cleaned = cleaned.replace(/---\s*$/, "").trim();
    return cleaned;
  }
  if (rawText.includes("---")) {
    let cleaned = rawText.split("---")[0];
    return cleaned.trim();
  }
  return rawText.trim();
};

const stripMissedMembersPrefix = (text: string): string => {
  if (!text) return "";
  const missedHeaderMatch = text.match(
    /^Team Members Who Missed Report \(\d+\):\n(?:- .+\n)*\n?/
  );
  if (missedHeaderMatch) return text.slice(missedHeaderMatch[0].length);
  return text;
};

const compileMeetingNotes = (historyData: any): string => {
  if (!historyData) return "";
  const memberReports: any[] = historyData.member_reports || [];
  const meetingHeadUid = historyData.config?.meeting_head?.id;

  const headMemberReport =
    memberReports.find(
      (r: any) => r.user_id === meetingHeadUid && r.status === "submitted"
    ) ||
    memberReports.find(
      (r: any) => r.status === "submitted" && r.report_data?.meeting_notes
    ) ||
    memberReports.find((r: any) => r.status === "submitted");

  const meetingNotesData = headMemberReport?.report_data?.meeting_notes || {};
  let rawDiscussionPoints = "";

  // Get missed members directly from root data structure
  let missedMembers: any[] = historyData.missed_members || [];

  if (Array.isArray(meetingNotesData)) {
    rawDiscussionPoints = meetingNotesData[0]?.key_discussion_points || "";
  } else {
    rawDiscussionPoints = meetingNotesData.key_discussion_points || "";
  }

  const keyDiscussionPoints = cleanDiscussionPoints(rawDiscussionPoints);
  let text = "";

  if (missedMembers && missedMembers.length > 0) {
    text += `Team Members Who Missed Report (${missedMembers.length}):\n`;
    missedMembers.forEach((m: any) => {
      const nameStr = typeof m === "object" && m.name ? m.name : String(m);
      text += `- ${nameStr}\n`;
    });
    text += `\n`;
  }

  if (keyDiscussionPoints) {
    const hasHeading = keyDiscussionPoints
      .trimStart()
      .toLowerCase()
      .startsWith("key discussion points");
    if (!hasHeading) text += "Key Discussion Points:\n";
    text += keyDiscussionPoints + "\n";
  }

  let detailedText = "";

  // Always generate directly from member_reports to capture dynamic user data
  const submittedReports = memberReports.filter(
    (r: any) => r.status !== "pending" || !!r.daily_report || !!r.report_data
  );

  submittedReports.forEach((report: any) => {
    // Check both submitted report_data and drafted daily_report.report_data
    const rawSource =
      report.report_data || report.daily_report?.report_data || {};

    let accRaw: any[] = [];
    if (Array.isArray(rawSource.accomplishments))
      accRaw = rawSource.accomplishments;
    else if (Array.isArray(rawSource.accomplishments?.items))
      accRaw = rawSource.accomplishments.items;

    let tpRaw: any[] = [];
    if (Array.isArray(rawSource.tomorrow_plan)) tpRaw = rawSource.tomorrow_plan;

    let tasksRaw: any[] = [];
    if (Array.isArray(rawSource.tasks_issues))
      tasksRaw = rawSource.tasks_issues;

    const selfRatingVal =
      rawSource.details?.self_rating ??
      rawSource.sections?.self_rating ??
      rawSource.self_rating ??
      null;

    const isAbsent =
      rawSource.details?.is_absent ??
      rawSource.sections?.is_absent ??
      rawSource.is_absent ??
      false;

    // Check past_kpis (common in drafts) and kpis
    const kpis = rawSource.past_kpis || rawSource.kpis || report.kpis || [];

    detailedText += `**${(report.name || "Unknown Member").trim()}**\n`;
    detailedText += `**Attendance:** ${isAbsent ? "✗ Absent" : "✓ Present"}\n`;

    if (selfRatingVal !== null && selfRatingVal !== undefined) {
      detailedText += `**Self Rating:** ${selfRatingVal}/10\n`;
    }

    // Map KPIs correctly
    if (Array.isArray(kpis) && kpis.length > 0) {
      detailedText += `**KPIs:**\n`;
      kpis.forEach((k: any) => {
        const kpiName = k.name || k.notes || "KPI";
        const actual = k.actual ?? k.actual_value ?? 0;
        const target = k.target ?? k.target_value ?? 0;
        detailedText += `- ${kpiName}: ${actual}/${target} ${k.unit ?? ""}\n`;
      });
    } else if (kpis && !Array.isArray(kpis) && typeof kpis === "object") {
      const kpiEntries = Object.entries(kpis).filter(
        ([, v]) => v !== null && v !== undefined && v !== "" && v !== "0"
      );
      if (kpiEntries.length > 0) {
        detailedText += `**KPIs:**\n`;
        kpiEntries.forEach(([k, v]) => {
          detailedText += `- ${k}: ${v}\n`;
        });
      }
    }

    if (accRaw.length > 0) {
      detailedText += `**Accomplishments:**\n`;
      accRaw.forEach((item: any) => {
        const title =
          item.title ||
          item.name ||
          item.text ||
          (typeof item === "string" ? item : "");
        const isDone =
          item.status === "done" ||
          item.status === "completed" ||
          item.completed === true ||
          item.done === true ||
          item.star === true;
        if (title) detailedText += `${isDone ? "✓" : "○"} ${title.trim()}\n`;
      });
    }

    if (tasksRaw.length > 0) {
      detailedText += `**Tasks & Issues:**\n`;
      tasksRaw.forEach((item: any) => {
        const title =
          item.name ||
          item.title ||
          item.text ||
          (typeof item === "string" ? item : "");
        if (title)
          detailedText += `[${item.status || "open"}] ${title.trim()}\n`;
      });
    }

    if (rawSource.big_win)
      detailedText += `**Big Win:** ${rawSource.big_win}\n`;

    if (tpRaw.length > 0) {
      detailedText += `**Tomorrow's Plan:**\n`;
      tpRaw.forEach((item: any) => {
        const title =
          item.title ||
          item.name ||
          item.text ||
          (typeof item === "string" ? item : "");
        if (title) detailedText += `- ${title.trim()}\n`;
      });
    }

    detailedText += `\n---\n\n`;
  });

  if (detailedText) {
    text += `\n---\n\nDETAILED REPORTS\n\n` + detailedText;
  }

  return text.trim();
};

// ── CUSTOM SELECT ──
const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
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
      className="relative shrink-0"
      style={{
        fontFamily: "'Poppins', sans-serif",
        zIndex: open ? 50 : "auto",
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex items-center gap-2 bg-[#FCFAFA] border rounded-[16px] pl-5 pr-4 py-2.5 transition-all min-w-[160px] shadow-sm",
          open
            ? "border-[#CE7A5A] shadow-[0_0_0_3px_rgba(206,122,90,0.10)]"
            : "border-[#F0EBE8] hover:border-[#CE7A5A]",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className="flex-1 text-left text-sm font-bold truncate">
          {disabled ? (
            <span className="text-[#8C8580]">Loading…</span>
          ) : selected ? (
            <span className="text-[#1A1A1A]">{selected.label}</span>
          ) : (
            <span className="text-[#8C8580]">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200 shrink-0",
            open ? "rotate-180 text-[#CE7A5A]" : "text-[#8C8580]"
          )}
        />
      </button>

      {open && !disabled && (
        <div
          className="absolute top-full left-0 mt-1.5 bg-white border border-[#F0EBE8] rounded-[20px] overflow-hidden min-w-full"
          style={{
            maxHeight: 240,
            overflowY: "auto",
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
            zIndex: 999,
          }}
        >
          <div className="py-1.5">
            {options.map((opt: any) => {
              const isSelected = String(value) === String(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2.5 group",
                    isSelected
                      ? "bg-[#FFF5F5] text-[#CE7A5A]"
                      : "text-[#1A1A1A] hover:bg-[#FFF5F5] hover:text-[#CE7A5A]"
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                      isSelected
                        ? "bg-[#CE7A5A]"
                        : "bg-transparent group-hover:bg-[#CE7A5A]/30"
                    )}
                  />
                  <span className="truncate flex-1 font-semibold">
                    {opt.label}
                  </span>
                  {isSelected && (
                    <span className="ml-auto shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-[#CE7A5A]"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2.5 7L5.5 10L11.5 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── SINGLE MEETING CARD (reusable for both All & Single view) ──
const MeetingCard = ({
  historyData,
  meetingLabel,
  selectedDate,
  onDeleted,
  onSaved,
}: {
  historyData: any;
  meetingLabel: string;
  selectedDate: string;
  onDeleted?: () => void;
  onSaved?: (updatedData: any) => void;
}) => {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [meetingNotesText, setMeetingNotesText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [localData, setLocalData] = useState<any>(historyData);

  useEffect(() => {
    setLocalData(historyData);
  }, [historyData]);

  const memberReports: any[] = localData?.member_reports || [];
  const submittedCount = memberReports.filter(
    (r: any) => r.status === "submitted"
  ).length;
  const missedCount = memberReports.filter(
    (r: any) => r.status === "pending" || r.status === "missed"
  ).length;
  const meetingHeadReport =
    memberReports.find(
      (r: any) =>
        r.user_id === localData?.config?.meeting_head?.id &&
        r.status === "submitted"
    ) || memberReports.find((r: any) => r.status === "submitted");
  const meetingSubmittedAt = meetingHeadReport?.submitted_at || null;
  const compiledNotes = compileMeetingNotes(localData);

  const formattedDateLabel = new Date(selectedDate).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "2-digit" }
  );
  const formattedFullDate = new Date(selectedDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formatSubmittedAt = (isoStr: string | null) => {
    if (!isoStr) return null;
    return new Date(isoStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getMeetingJournalId = () => {
    const allReports: any[] = localData?.member_reports || [];
    const meetingHeadUserId = localData?.config?.meeting_head?.id;
    const headReport = allReports.find(
      (r: any) =>
        r.user_id === meetingHeadUserId &&
        r.status === "submitted" &&
        r.journal_id
    );
    if (headReport) return headReport.journal_id;
    const withNotes = allReports.find(
      (r: any) =>
        r.status === "submitted" && r.report_data?.meeting_notes && r.journal_id
    );
    if (withNotes) return withNotes.journal_id;
    const anySubmitted = allReports.find(
      (r: any) => r.status === "submitted" && r.journal_id
    );
    return anySubmitted?.journal_id || null;
  };

  const getMeetingConfigId = () => {
    return (
      localData?.config?.id ||
      localData?.config?.meeting_id ||
      localData?.meeting_id ||
      localData?.id ||
      null
    );
  };

  const handleOpenEditModal = () => {
    const journalId = getMeetingJournalId();
    if (!journalId) {
      toast.error("Save the meeting first to edit", {
        description: "Go to Daily tab and click 'Save Meeting' before editing.",
        duration: 4000,
      });
      return;
    }
    setMeetingNotesText(compileMeetingNotes(localData));
    setIsEditModalOpen(true);
  };

  const handleSaveNotes = async () => {
    const meetingJournalId = getMeetingJournalId();
    if (!meetingJournalId) {
      toast.error("Save the meeting first to edit", {
        description: "Go to Daily tab and click 'Save Meeting' before editing.",
        duration: 4000,
      });
      return;
    }
    setIsSaving(true);
    try {
      const allReports: any[] = localData?.member_reports || [];
      const meetingHeadUserId = localData?.config?.meeting_head?.id;
      const headReport =
        allReports.find(
          (r: any) =>
            r.user_id === meetingHeadUserId && r.status === "submitted"
        ) ||
        allReports.find(
          (r: any) => r.status === "submitted" && r.report_data?.meeting_notes
        ) ||
        allReports.find((r: any) => r.status === "submitted");

      const existingReportData = headReport?.report_data || {};
      const existingMeetingNotes = existingReportData.meeting_notes || {};
      const rawDiscussionText = cleanDiscussionPoints(meetingNotesText);
      const finalDiscussionPoints =
        stripMissedMembersPrefix(rawDiscussionText).trim();

      let updatedMeetingNotes;
      if (Array.isArray(existingMeetingNotes)) {
        updatedMeetingNotes = [
          {
            ...(existingMeetingNotes[0] || {}),
            key_discussion_points: finalDiscussionPoints,
          },
          ...existingMeetingNotes.slice(1),
        ];
      } else {
        updatedMeetingNotes = {
          ...existingMeetingNotes,
          key_discussion_points: finalDiscussionPoints,
        };
      }

      const payload = {
        user_journal: {
          self_rating: existingReportData.self_rating ?? 0,
          status: "submitted",
          report_data: {
            ...existingReportData,
            meeting_notes: updatedMeetingNotes,
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
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success("Saved successfully!");
      setIsEditModalOpen(false);

      // Re-fetch fresh data so UI reflects edits immediately without full refresh
      const meetingConfigId = getMeetingConfigId();
      if (meetingConfigId) {
        try {
          const refreshRes = await fetch(
            `${getBaseUrl()}/user_journals/daily_meeting?meeting_id=${meetingConfigId}&date=${selectedDate}`,
            { method: "GET", headers: getAuthHeaders() }
          );
          if (refreshRes.ok) {
            const refreshJson = await refreshRes.json();
            const freshData = refreshJson?.data ?? refreshJson;
            setLocalData(freshData);
            onSaved?.(freshData);
          } else {
            setRefreshKey((k) => k + 1);
          }
        } catch {
          setRefreshKey((k) => k + 1);
        }
      } else {
        setRefreshKey((k) => k + 1);
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const meetingJournalId = getMeetingJournalId();
    if (!meetingJournalId) {
      toast.error("No saved meeting found to delete.");
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${getBaseUrl()}/user_journals/${meetingJournalId}`,
        { method: "DELETE", headers: getAuthHeaders() }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Deleted successfully!");
      setShowDeleteConfirm(false);
      setLocalData(null);
      onDeleted?.();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!localData || submittedCount === 0) return null;

  return (
    <>
      <div className="bg-white border border-[#F1E8E3] rounded-[24px] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#CE7A5A] px-6 py-5 rounded-t-[24px]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h3 className="text-[22px] font-black tracking-tight mb-2 m-0 p-0">
                <span
                  className="!text-white"
                  style={{ color: "#ffffff", display: "inline-block" }}
                >
                  {meetingLabel} for {formattedDateLabel}
                </span>
              </h3>
              <div className="flex items-center gap-3 flex-wrap mb-1.5">
                <span className="px-3 py-1 bg-white/20 border border-white/20 !text-white text-[11px] font-black rounded-[8px] uppercase tracking-widest">
                  completed
                </span>
                <span
                  className="!text-white/80 text-sm font-bold"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {submittedCount} attendees
                </span>
                {missedCount > 0 && (
                  <span
                    className="flex items-center gap-2 text-xs font-bold"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    <span className="flex items-center gap-1">
                      Done:
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-400 text-white text-[10px] font-black">
                        {submittedCount}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      Missed:
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-400 text-white text-[10px] font-black">
                        {missedCount}
                      </span>
                    </span>
                  </span>
                )}
              </div>
              {meetingSubmittedAt && (
                <div
                  className="!text-white/50 text-[11px] font-bold"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Submitted: {formatSubmittedAt(meetingSubmittedAt)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-bold rounded-[14px] transition-all">
                <Sparkles className="w-4 h-4" /> Generate AI
              </button>
              <button
                onClick={handleOpenEditModal}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-bold rounded-[14px] transition-all"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-9 h-9 flex items-center justify-center bg-white/15 hover:bg-red-500/70 border border-white/20 text-white rounded-[12px] transition-all"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Raw Meeting Notes Toggle */}
        <div>
          <div
            className="px-6 py-4 flex items-center justify-between cursor-pointer bg-[#FCFAFA] hover:bg-[#FFF3EE] border-b border-[#E0D8F0] transition-colors"
            onClick={() => setIsNotesExpanded(!isNotesExpanded)}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8C8580]" />
              <span className="text-sm font-black text-[#1A1A1A]">
                Raw Meeting Notes
              </span>
            </div>
            {isNotesExpanded ? (
              <ChevronUp className="w-5 h-5 text-[#8C8580]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#8C8580]" />
            )}
          </div>
          {isNotesExpanded && (
            <div className="px-6 py-5 bg-white">
              {compiledNotes ? (
                <div className="bg-[#FAFAFA] border border-[#EDEDED] rounded-[14px] px-6 py-5">
                  <pre
                    className="whitespace-pre-wrap text-sm text-[#1A1A1A] leading-[1.9]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {compiledNotes}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-[#8C8580] font-bold italic text-center py-10">
                  No meeting notes available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            style={{ zIndex: 9999 }}
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          >
            <div
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-black text-[#1A1A1A] text-[16px]">
                    Delete Meeting?
                  </h3>
                  <p className="text-xs text-[#8C8580] font-bold mt-0.5">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-5 py-2.5 bg-white border border-[#E0E0E0] text-[#555] rounded-[12px] text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-[12px] text-sm font-bold shadow-sm disabled:opacity-60 transition-colors"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash className="w-4 h-4" />
                  )}
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Edit Modal */}
      {isEditModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            style={{ zIndex: 9999 }}
            onClick={() => !isSaving && setIsEditModalOpen(false)}
          >
            <div
              className="bg-white rounded-[20px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBEBEB]">
                <h2 className="text-[18px] font-black text-[#1A1A1A]">
                  Edit Meeting - {formattedFullDate}
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                  className="text-[#8C8580] hover:text-[#1A1A1A] p-1 rounded-[8px] transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-5 flex-1 overflow-y-auto bg-white">
                <label className="text-sm font-bold text-[#1A1A1A] mb-3 block">
                  Meeting Notes & Detailed Reports
                </label>
                <textarea
                  value={meetingNotesText}
                  onChange={(e) => setMeetingNotesText(e.target.value)}
                  rows={18}
                  className="w-full bg-white border border-[#CCCCCC] rounded-[12px] px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#CE7A5A] transition-colors resize-y leading-relaxed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  placeholder="Enter key discussion points here..."
                />
              </div>
              <div className="px-6 py-4 border-t border-[#EBEBEB] flex justify-end gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-white border border-[#DDDDDD] text-[#555] rounded-[12px] text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 min-w-[140px] px-6 py-2.5 bg-[#CE7A5A] hover:bg-[#BC6B4A] text-white rounded-[12px] text-sm font-bold transition-colors shadow-sm disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

// ── ALL MEETINGS VIEW ──
const AllMeetingsView = ({
  meetings,
  selectedDate,
}: {
  meetings: any[];
  selectedDate: string;
}) => {
  const [meetingsData, setMeetingsData] = useState<Record<string, any>>({});
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!meetings.length) return;
    setMeetingsData({});
    setDeletedIds([]);

    meetings.forEach((m) => {
      const id = String(m.id);
      setLoadingIds((prev) => [...prev, id]);
      fetch(
        `${getBaseUrl()}/user_journals/daily_meeting?meeting_id=${id}&date=${selectedDate}`,
        { method: "GET", headers: getAuthHeaders() }
      )
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((json) => {
          const data = json?.data ?? json;
          setMeetingsData((prev) => ({ ...prev, [id]: data }));
        })
        .catch(() => setMeetingsData((prev) => ({ ...prev, [id]: null })))
        .finally(() => setLoadingIds((prev) => prev.filter((x) => x !== id)));
    });
  }, [meetings, selectedDate]);

  return (
    <div className="space-y-6">
      {meetings.map((m) => {
        const id = String(m.id);
        const data = meetingsData[id];
        const isLoading = loadingIds.includes(id);
        const isDeleted = deletedIds.includes(id);

        if (isDeleted) return null;

        const memberReports: any[] = data?.member_reports || [];
        const submittedCount = memberReports.filter(
          (r: any) => r.status === "submitted"
        ).length;
        const hasData = submittedCount > 0;

        return (
          <div key={id}>
            {/* Meeting Name Label */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-[#F0EBE8]" />
              <span className="text-[11px] font-extrabold text-[#CE7A5A] uppercase tracking-widest px-3 bg-white border border-[#F0EBE8] rounded-full py-1">
                {m.name}
              </span>
              <div className="h-px flex-1 bg-[#F0EBE8]" />
            </div>

            {isLoading ? (
              <div className="bg-white border border-[#F1E8E3] rounded-[24px] shadow-sm overflow-hidden">
                <div className="h-[100px] bg-[#CE7A5A]/60 rounded-t-[24px] animate-pulse" />
                <div className="p-6 space-y-2">
                  {[80, 60, 70].map((w, i) => (
                    <div
                      key={i}
                      className="h-3 bg-[#F0EBF8] rounded-full animate-pulse"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              </div>
            ) : !hasData ? (
              <div className="bg-white border-2 border-dashed border-[#E0D8F0] rounded-[24px] py-10 flex flex-col items-center justify-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-300" />
                <p className="text-sm font-bold text-[#8C8580]">
                  No submissions for this date.
                </p>
              </div>
            ) : (
              <MeetingCard
                historyData={data}
                meetingLabel={m.name}
                selectedDate={selectedDate}
                onDeleted={() => setDeletedIds((prev) => [...prev, id])}
                onSaved={(freshData) =>
                  setMeetingsData((prev) => ({ ...prev, [id]: freshData }))
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────
// HistoryTab
// ─────────────────────────────────────────────
const HistoryTab = ({ initialDate }: { initialDate?: string }) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    () => initialDate || new Date().toISOString().split("T")[0]
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [historyData, setHistoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
      setRefreshKey((k) => k + 1);
    }
  }, [initialDate]);

  useEffect(() => {
    setIsFetchingMeetings(true);
    fetch(`${getBaseUrl()}/daily_meeting_configs`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || [];
        setMeetings(list);
        if (list.length > 0) {
          const defaultMeeting = list.find(
            (m: any) => m.is_default || m.isDefault
          );
          setSelectedMeetingId(
            defaultMeeting ? String(defaultMeeting.id) : "all"
          );
          setRefreshKey((k) => k + 1);
        }
      })
      .catch(console.error)
      .finally(() => setIsFetchingMeetings(false));
  }, []);

  useEffect(() => {
    if (!selectedMeetingId || selectedMeetingId === "all") {
      setHistoryData(null);
      return;
    }
    setIsLoading(true);
    setHistoryData(null);
    fetch(
      `${getBaseUrl()}/user_journals/daily_meeting?meeting_id=${selectedMeetingId}&date=${selectedDate}`,
      { method: "GET", headers: getAuthHeaders() }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setHistoryData(json?.data ?? json);
      })
      .catch((err) => {
        console.error("History fetch error:", err);
        setHistoryData(null);
      })
      .finally(() => setIsLoading(false));
  }, [selectedMeetingId, selectedDate, refreshKey]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const isAllMeetings = selectedMeetingId === "all";
  const selectedMeetingLabel = isAllMeetings
    ? "All Meetings"
    : (meetings.find((m) => String(m.id) === String(selectedMeetingId))?.name ??
      "Meeting");

  const memberReports: any[] = historyData?.member_reports || [];
  const submittedCount = memberReports.filter(
    (r: any) => r.status === "submitted"
  ).length;
  const hasSubmissions = submittedCount > 0;

  const meetingOptions = [
    { value: "all", label: "All Meetings" },
    ...meetings.map((m) => ({
      value: String(m.id),
      label: m.name || `Meeting ${m.id}`,
    })),
  ];

  return (
    <div
      className="pb-12 space-y-6 min-h-screen"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-black text-[#1A1A1A] tracking-tight">
            Daily Meeting History
          </h2>
          <p className="text-[12px] font-bold text-[#8C8580] uppercase tracking-widest mt-1">
            View and edit past daily meeting reports
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <CustomSelect
            value={selectedMeetingId}
            onChange={(val: string) => setSelectedMeetingId(val)}
            disabled={isFetchingMeetings}
            placeholder="Select Meeting"
            options={meetingOptions}
          />
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevDay}
              className="p-2 bg-white border border-[#F0EBE8] rounded-[12px] hover:bg-[#FCFAFA] text-[#8C8580] shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] py-2.5 px-4 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#CE7A5A] shadow-sm transition-colors"
            />
            <button
              onClick={handleNextDay}
              className="p-2 bg-white border border-[#F0EBE8] rounded-[12px] hover:bg-[#FCFAFA] text-[#8C8580] shadow-sm transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#F0EBE8] rounded-[16px] hover:bg-[#FCFAFA] shadow-sm text-sm font-bold text-[#1A1A1A] transition-all"
          >
            <RefreshCw
              className={cn(
                "w-4 h-4 text-[#8C8580]",
                isLoading && "animate-spin"
              )}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* All Meetings View */}
      {isAllMeetings &&
        (meetings.length === 0 && !isFetchingMeetings ? (
          <div className="text-center py-24 bg-white border-2 border-dashed border-[#E0D8F0] rounded-[32px]">
            <HistoryIcon className="w-10 h-10 text-[#CE7A5A] opacity-30 mx-auto mb-4" />
            <p className="text-[#8C8580] font-bold text-sm">
              No meetings configured.
            </p>
          </div>
        ) : isFetchingMeetings ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#F1E8E3] rounded-[24px] shadow-sm overflow-hidden"
              >
                <div className="h-[100px] bg-[#CE7A5A]/60 rounded-t-[24px] animate-pulse" />
                <div className="p-6 space-y-2">
                  {[80, 60, 70].map((w, j) => (
                    <div
                      key={j}
                      className="h-3 bg-[#F0EBF8] rounded-full animate-pulse"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AllMeetingsView meetings={meetings} selectedDate={selectedDate} />
        ))}

      {/* Single Meeting View */}
      {!isAllMeetings && (
        <>
          {isLoading && (
            <div className="bg-white border border-[#F1E8E3] rounded-[24px] shadow-sm overflow-hidden">
              <div className="h-[130px] bg-[#CE7A5A]/70 rounded-t-[24px]" />
              <div className="p-6 space-y-3">
                <div className="h-10 bg-[#F0EBF8] rounded-[12px]" />
                <div className="space-y-2 p-2">
                  {[90, 75, 85, 60, 70].map((w, i) => (
                    <div
                      key={i}
                      className="h-4 bg-[#F0EBF8] rounded-full"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isLoading && (!historyData || !hasSubmissions) && (
            <div className="text-center py-24 bg-white border-2 border-dashed border-[#E0D8F0] rounded-[32px]">
              <HistoryIcon className="w-10 h-10 text-[#CE7A5A] opacity-30 mx-auto mb-4" />
              <p className="text-[#8C8580] font-bold text-sm">
                No meeting data has been submitted yet for the selected date.
              </p>
            </div>
          )}

          {!isLoading && historyData && hasSubmissions && (
            <MeetingCard
              historyData={historyData}
              meetingLabel={selectedMeetingLabel}
              selectedDate={selectedDate}
              onDeleted={() => {
                setHistoryData(null);
                setRefreshKey((k) => k + 1);
              }}
              onSaved={(freshData) => setHistoryData(freshData)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HistoryTab;
