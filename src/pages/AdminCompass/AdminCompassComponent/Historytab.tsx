// ─────────────────────────────────────────────
// HistoryTab.jsx — Coral/Amber Theme
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import {
  History as HistoryIcon,
  AlertTriangle,
  FileText,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Edit,
  Trash,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockHistoryNotes = `Key Discussion Points:
DETAILED REPORTS
Bilal Shaikh
Attendance: ✓ Present
Self Rating: 10/10
Accomplishments:
O Work on Godrej Living full screen visitor approval issue
O Work on Resident App Notification Self Testing
O Work on Runwal PP Admin
O Work on Runwal PP Payment Module
✓ Work on Fm Ios issues
✓ Work on Runwal PP Issues
✓ Complete Runwal PS Cms api issue
✓ Work on My Daily Help Module
Tomorrow's Plan:
Work on Godrej Living full screen visitor approval issue
Work on Resident App Notification Self Testing
Work on Runwal PP Admin`;

const HistoryTab = () => {
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-03-31");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const loadHistory = async () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  };

  useEffect(() => {
    loadHistory();
  }, [selectedMeetingId, selectedDate]);

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

  const formattedDateLabel = new Date(selectedDate).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "2-digit" }
  );
  const formattedFullDate = new Date(selectedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const state =
    selectedDate === "2026-04-02"
      ? "missed"
      : selectedDate === "2026-03-31" || selectedDate === "2026-03-26"
        ? "completed"
        : "empty";

  return (
    <div className="pb-12 space-y-5 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(218,119,86,0.15)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#FAECE7] flex items-center justify-center shrink-0">
            <HistoryIcon className="w-4 h-4 text-[#DA7756]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Daily Meeting History
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              View and edit past daily meeting reports
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={selectedMeetingId}
              onChange={(e) => setSelectedMeetingId(e.target.value)}
              className="appearance-none bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl py-1.5 pl-3 pr-8 text-sm font-semibold text-neutral-700 focus:outline-none focus:border-[#DA7756] shadow-sm"
            >
              <option value="">All Meetings</option>
              <option value="1">HOD Huddle</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5 pointer-events-none" />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevDay}
              className="px-2 py-1.5 bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl hover:bg-[#fef6f4] shadow-sm text-[#DA7756] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl py-1.5 px-3 text-sm font-semibold text-neutral-700 focus:outline-none focus:border-[#DA7756] shadow-sm w-36"
            />
            <button
              onClick={handleNextDay}
              className="px-2 py-1.5 bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl hover:bg-[#fef6f4] shadow-sm text-[#DA7756] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={loadHistory}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl hover:bg-[#fef6f4] shadow-sm text-sm font-semibold text-[#DA7756] transition-colors"
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5", isLoading && "animate-spin")}
            />{" "}
            Refresh
          </button>
        </div>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-6 h-6 text-[#DA7756] animate-spin" />
        </div>
      ) : state === "empty" ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[rgba(218,119,86,0.25)] rounded-2xl text-neutral-400">
          <HistoryIcon size={48} className="mb-4 text-[#DA7756] opacity-20" />
          <p className="text-sm font-medium">
            No meeting history found for the selected filters
          </p>
        </div>
      ) : state === "missed" ? (
        <div className="bg-[#fff7ed] border border-[#ffedd5] rounded-2xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-orange-900 mb-1.5">
                Missed Meetings on {formattedFullDate} (1):
              </div>
              <span className="inline-block px-3 py-1 bg-white border border-orange-200 text-orange-600 text-xs font-bold rounded-2xl shadow-sm">
                HOD Huddle
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-2xl">
              Done: 0
            </span>
            <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-2xl">
              Missed: 1
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[rgba(218,119,86,0.18)] rounded-2xl shadow-sm overflow-hidden">
          {/* Card header — coral gradient instead of purple */}
          <div
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{
              background: "linear-gradient(135deg, #DA7756 0%, #c9673f 100%)",
            }}
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                HOD Huddle for {formattedDateLabel}
              </h3>
              <div className="flex items-center gap-3 mb-2 text-white/90 text-sm">
                <span className="px-2.5 py-0.5 bg-green-400 text-white text-xs font-bold rounded-2xl shadow-sm">
                  completed
                </span>
                <span className="font-medium">11 attendees</span>
              </div>
              <div className="text-xs text-white/70">
                Submitted: 1 Apr 26, 11:05 AM IST
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold rounded-2xl transition-colors">
                <Sparkles className="w-4 h-4" /> Generate AI
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-white/10 border border-white/60 text-white text-sm font-semibold rounded-2xl transition-colors">
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button className="w-9 h-9 flex items-center justify-center bg-transparent hover:bg-white/10 border border-white/60 text-white rounded-2xl transition-colors">
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes section */}
          <div>
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#fdf8f6] border-b border-[rgba(218,119,86,0.1)] transition-colors"
              onClick={() => setIsNotesExpanded(!isNotesExpanded)}
            >
              <div className="flex items-center gap-2 font-bold text-neutral-800 text-sm">
                <FileText className="w-4 h-4 text-[#DA7756]" /> Raw Meeting
                Notes
              </div>
              {isNotesExpanded ? (
                <ChevronUp className="w-5 h-5 text-[#DA7756]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#DA7756]" />
              )}
            </div>
            {isNotesExpanded && (
              <div className="p-5 space-y-6">
                <div className="bg-[#FAECE7] border border-[rgba(218,119,86,0.2)] rounded-2xl p-4">
                  <h4 className="text-sm font-bold text-[#993C1D] mb-3">
                    Team Members who failed to submit Reports (9):
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Adhip Shetty",
                      "Fatema Tashrifwala",
                      "Akshay Shinde",
                      "Arun Mohan",
                      "Chetan Bafna",
                      "Kshitij Rasal",
                      "Mahendra Lungare",
                      "Punit Jain",
                      "Yash Rathod",
                    ].map((name) => (
                      <span
                        key={name}
                        className="px-2.5 py-1 bg-white border border-[rgba(218,119,86,0.2)] text-[#993C1D] text-xs font-semibold rounded-2xl"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <pre className="whitespace-pre-wrap font-sans text-sm text-neutral-700 leading-relaxed bg-[#fdf8f6] p-4 rounded-2xl border border-[rgba(218,119,86,0.12)]">
                    {mockHistoryNotes}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
