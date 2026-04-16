import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  X,
  Search,
  Filter,
  ChevronDown,
  AlertTriangle,
  Clock,
  Edit,
  Trash,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  fetchMeetingConfigs,
  createMeetingConfig,
  updateMeetingConfig,
  deleteMeetingConfig,
  getInitials,
  getBaseUrl,
} from "./Shared";

// ── MeetingConfigModal ──
const MeetingConfigModal = ({
  onClose,
  onSaved,
  existingConfig = null,
  users = [],
  departments = [],
  dropdownsLoading = false,
}) => {
  const isEdit = !!existingConfig;

  const initialMembers = existingConfig?.members
    ? existingConfig.members.map((m) => Number(m.id))
    : (existingConfig?.memberIds ?? []).map(Number);

  const [form, setForm] = useState({
    name: existingConfig?.name ?? "",
    meeting_time:
      existingConfig?.meetingTime ?? existingConfig?.meeting_time ?? "",
    meeting_days:
      existingConfig?.meetingDays ??
      existingConfig?.meeting_days ?? ["Mon", "Tue", "Wed", "Thu", "Fri"],
    meeting_head_id: existingConfig?.meetingHead?.id
      ? String(existingConfig.meetingHead.id)
      : existingConfig?.meetingHeadId
      ? String(existingConfig.meetingHeadId)
      : "",
    department_id: existingConfig?.department?.id
      ? String(existingConfig.department.id)
      : existingConfig?.departmentId
      ? String(existingConfig.departmentId)
      : "",
    is_default:
      existingConfig?.isDefault ?? existingConfig?.is_default ?? false,
  });

  const [selectedMemberIds, setSelectedMemberIds] = useState(initialMembers);
  const [memberSearch, setMemberSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleDay = (day) =>
    setForm((f) => ({
      ...f,
      meeting_days: f.meeting_days.includes(day)
        ? f.meeting_days.filter((d) => d !== day)
        : [...f.meeting_days, day],
    }));

  const toggleMember = (id) => {
    const numId = Number(id);
    setSelectedMemberIds((prev) =>
      prev.includes(numId)
        ? prev.filter((mId) => mId !== numId)
        : [...prev, numId]
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.name ?? u.full_name ?? u.username ?? "")
        .toLowerCase()
        .includes(memberSearch.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.meeting_time || !form.meeting_head_id) {
      setError("Please fill all required fields (*).");
      return;
    }
    setIsLoading(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      meeting_time: form.meeting_time,
      meeting_days: form.meeting_days,
      meeting_head_id: parseInt(form.meeting_head_id, 10),
      department_id: form.department_id
        ? parseInt(form.department_id, 10)
        : null,
      is_default: form.is_default,
      member_ids: selectedMemberIds,
    };

    try {
      if (isEdit) {
        await updateMeetingConfig(existingConfig.id, payload);
        toast.success("Meeting configuration updated!");
      } else {
        await createMeetingConfig(payload);
        toast.success("Meeting configuration created!");
      }
      onSaved();
    } catch (err) {
      setError(err.message || "Failed to save config.");
      toast.error(err.message || "Failed to save config.");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] border border-[#F0EBE8] shadow-2xl w-full max-w-[600px] flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#F0EBE8] bg-[#FCFAFA]">
          <div>
            <h2 className="text-[20px] font-black text-[#1A1A1A] tracking-tight">
              {isEdit
                ? "Edit Meeting Configuration"
                : "Create Meeting Configuration"}
            </h2>
            <p className="text-[12px] font-bold text-[#8C8580] mt-1 leading-relaxed max-w-[90%]">
              Configure a recurring daily meeting. This will auto-select when
              the meeting head logs in to record minutes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8C8580] hover:text-[#1A1A1A] p-2 rounded-[12px] border border-transparent hover:border-[#F0EBE8] hover:bg-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
          {error && (
            <div className="bg-[#EB4A4A]/10 text-[#EB4A4A] text-sm font-bold p-4 rounded-[16px] flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}

          {/* Name + Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-black text-[#8C8580] uppercase tracking-widest mb-2 block">
                Meeting Name <span className="text-[#EB4A4A]">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Sales Team Stand-up"
                className="w-full bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] px-4 py-3 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#EB4A4A] transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-[#8C8580] uppercase tracking-widest mb-2 block">
                Meeting Time <span className="text-[#EB4A4A]">*</span>
              </label>
              <input
                type="time"
                value={form.meeting_time}
                onChange={(e) =>
                  setForm({ ...form, meeting_time: e.target.value })
                }
                className="w-full bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] px-4 py-3 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#EB4A4A] transition-colors"
              />
            </div>
          </div>

          {/* Meeting Days */}
          <div>
            <label className="text-[11px] font-black text-[#8C8580] uppercase tracking-widest mb-2 block">
              Meeting Days
            </label>
            <div className="flex flex-wrap gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "px-4 py-2 rounded-[12px] text-xs font-bold transition-all border",
                    form.meeting_days.includes(day)
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "bg-white text-[#8C8580] border-[#F0EBE8] hover:bg-[#FCFAFA] hover:text-[#1A1A1A]"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 border-t border-[#F0EBE8] pt-5">
            {/* Meeting Head */}
            <div>
              <label className="text-[11px] font-black text-[#8C8580] uppercase tracking-widest mb-2 block">
                Meeting Head <span className="text-[#EB4A4A]">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.meeting_head_id}
                  onChange={(e) =>
                    setForm({ ...form, meeting_head_id: e.target.value })
                  }
                  disabled={dropdownsLoading}
                  className="w-full bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] px-4 py-3 text-sm font-bold text-[#1A1A1A] appearance-none focus:outline-none focus:border-[#EB4A4A] transition-colors disabled:opacity-50"
                >
                  <option value="">
                    {dropdownsLoading ? "Loading..." : "Select meeting head"}
                  </option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name ?? u.full_name ?? u.username}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580] pointer-events-none" />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="text-[11px] font-black text-[#8C8580] uppercase tracking-widest mb-2 block">
                Department (Optional)
              </label>
              <div className="relative">
                <select
                  value={form.department_id}
                  onChange={(e) =>
                    setForm({ ...form, department_id: e.target.value })
                  }
                  disabled={dropdownsLoading}
                  className="w-full bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] px-4 py-3 text-sm font-bold text-[#1A1A1A] appearance-none focus:outline-none focus:border-[#EB4A4A] transition-colors disabled:opacity-50"
                >
                  <option value="">
                    {dropdownsLoading ? "Loading..." : "Select department"}
                  </option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580] pointer-events-none" />
              </div>
            </div>

            {/* Meeting Members */}
            <div>
              <label className="text-[11px] font-black text-[#8C8580] uppercase tracking-widest mb-2 block">
                Meeting Members
              </label>
              <div className="border border-[#F0EBE8] rounded-[16px] overflow-hidden flex flex-col bg-white">
                <div className="p-2 border-b border-[#F0EBE8] bg-[#FCFAFA]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580]" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full bg-white border border-[#F0EBE8] rounded-[12px] pl-9 pr-3 py-2 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#EB4A4A]"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                  {dropdownsLoading ? (
                    <div className="p-4 text-sm font-bold text-[#8C8580] text-center">
                      Loading members...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-4 text-sm font-bold text-[#8C8580] text-center">
                      No members found.
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-3 p-2.5 hover:bg-[#FCFAFA] rounded-[12px] cursor-pointer transition-colors border border-transparent hover:border-[#F0EBE8]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMemberIds.includes(Number(user.id))}
                          onChange={() => toggleMember(user.id)}
                          className="w-4 h-4 text-[#EB4A4A] rounded border-[#F0EBE8] focus:ring-[#EB4A4A] cursor-pointer accent-[#EB4A4A]"
                        />
                        <div>
                          <div className="text-sm font-bold text-[#1A1A1A]">
                            {user.name ?? user.full_name ?? user.username}
                          </div>
                          <div className="text-[11px] font-bold text-[#8C8580]">
                            {user.email ?? ""}
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Default toggle */}
            <label className="flex items-center gap-3 cursor-pointer mt-4 p-3 bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px]">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) =>
                  setForm({ ...form, is_default: e.target.checked })
                }
                className="w-4 h-4 rounded border-[#F0EBE8] cursor-pointer accent-[#EB4A4A]"
              />
              <span className="text-sm font-black text-[#1A1A1A]">
                Set as default meeting
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#F0EBE8] bg-[#FCFAFA] flex justify-end gap-3 rounded-b-[32px]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-[#F0EBE8] text-[#8C8580] rounded-[16px] text-sm font-bold hover:bg-gray-50 hover:text-[#1A1A1A] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(
              "px-6 py-2.5 bg-[#1A1A1A] text-white rounded-[16px] text-sm font-bold hover:bg-black transition-colors shadow-sm",
              isLoading && "opacity-50 pointer-events-none"
            )}
          >
            {isLoading
              ? "Saving..."
              : isEdit
              ? "Update Config"
              : "Create Config"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── DeleteConfirmModal ──
const DeleteConfirmModal = ({ configName, onConfirm, onCancel, isDeleting }) =>
  createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      style={{ zIndex: 99999 }}
      onClick={() => !isDeleting && onCancel()}
    >
      <div
        className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Poppins', sans-serif" }}
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
              "{configName}" will be permanently removed.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-white border border-[#E0E0E0] text-[#555] rounded-[12px] text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-[12px] text-sm font-bold shadow-sm disabled:opacity-60 transition-colors"
          >
            {isDeleting ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Trash className="w-4 h-4" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

// ─────────────────────────────────────────────────────────
//  This Week Calendar Logic
//
//  Rules:
//  - Grey  → day is NOT in this meeting's schedule (off day)
//  - Green → scheduled day that has already passed this week
//            (assumed held — no session API needed)
//  - Amber → today, and it IS a scheduled meeting day
//  - Grey  → today but NOT a scheduled day  (still grey/off)
//  - Grey  → future scheduled day (upcoming, not yet held)
//
//  To upgrade to real held/missed status, pass a
//  `sessionDates: string[]` (ISO date strings) prop to
//  ConfigCard and replace the `dayIdx < todayDayIdx` check
//  with a lookup against that array.
// ─────────────────────────────────────────────────────────

/** Maps our 2-char display keys to JS Date.getDay() (0=Sun..6=Sat) */
const DAY_TO_JS_IDX: Record<string, number> = {
  Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6,
};

/** Normalise any API day format to 2-char display key */
const normalizeDayKey = (d: string): string => {
  const map: Record<string, string> = {
    // 3-char (from MeetingConfigModal toggleDay)
    Sun: "Su", Mon: "Mo", Tue: "Tu", Wed: "We",
    Thu: "Th", Fri: "Fr", Sat: "Sa",
    // Already 2-char
    Su: "Su", Mo: "Mo", Tu: "Tu", We: "We",
    Th: "Th", Fr: "Fr", Sa: "Sa",
    // Full names just in case
    Sunday: "Su", Monday: "Mo", Tuesday: "Tu", Wednesday: "We",
    Thursday: "Th", Friday: "Fr", Saturday: "Sa",
  };
  return map[d] ?? d;
};

const WEEK_DISPLAY_KEYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

/** Returns dot colour + whether the column is today */
const getDayStatus = (
  displayKey: string,
  activeDayKeys: Set<string>,
  todayJsIdx: number
): { color: string; ringColor: string; isToday: boolean } => {
  const dayIdx = DAY_TO_JS_IDX[displayKey];
  const isScheduled = activeDayKeys.has(displayKey);
  const isToday = dayIdx === todayJsIdx;

  if (!isScheduled) {
    // Not a meeting day at all — grey regardless of today
    return { color: "bg-[#E5E7EB]", ringColor: "", isToday };
  }

  if (isToday) {
    // Scheduled AND today — amber with ring
    return { color: "bg-[#F59E0B]", ringColor: "ring-2 ring-offset-1 ring-[#F59E0B]", isToday };
  }

  if (dayIdx < todayJsIdx) {
    // Scheduled AND already past — green (assumed held)
    return { color: "bg-[#2ECC71]", ringColor: "", isToday };
  }

  // Scheduled but in the future — grey (upcoming)
  return { color: "bg-[#E5E7EB]", ringColor: "", isToday };
};

// ── ConfigCard ──
const ConfigCard = ({ config, onEdit, loadConfigs, allUsers = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMeetingConfig(config.id);
      toast.success(`"${config.name}" deleted successfully.`);
      loadConfigs();
    } catch (e) {
      toast.error(`Delete failed: ${e.message}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getDisplayName = (val) => {
    if (!val) return null;
    if (typeof val === "object" && val !== null) return val.name;
    return val;
  };

  const meetingHeadName =
    getDisplayName(config.meetingHead || config.meeting_head) || "Unknown Head";
  const meetingHeadId = config.meetingHeadId || config.meeting_head?.id;

  const membersArray = config.members || [];

  const mappedMembers = membersArray.map((m) => {
    if (m && m.name) return m.name;
    const user = allUsers.find((u) => Number(u.id) === Number(m.id || m));
    return user
      ? user.name ?? user.full_name ?? user.username ?? `User ${m.id || m}`
      : `User ${m.id || m}`;
  });

  const visibleMembers = mappedMembers.slice(0, 3);
  const hiddenMembersCount = mappedMembers.length - 3;
  const membersText =
    mappedMembers.length > 0
      ? `${visibleMembers.join(", ")}${
          hiddenMembersCount > 0 ? ` +${hiddenMembersCount} more` : ""
        }`
      : "No members assigned";

  const meetingHeadUser = allUsers.find(
    (u) =>
      Number(u.id) === Number(meetingHeadId) ||
      (u.name ?? u.full_name ?? u.username) === meetingHeadName
  );

  const meetingTime =
    config.meetingTime || config.meeting_time || "No time set";

  // ── Dynamic This Week calendar ──
  const today = new Date();
  const todayJsIdx = today.getDay(); // 0=Sun … 6=Sat

  const activeDayKeys = new Set(
    (config.meetingDays || config.meeting_days || []).map(normalizeDayKey)
  );

  return (
    <>
      <div className="bg-white border border-[#F0EBE8] rounded-[24px] shadow-sm p-6 hover:shadow-md hover:border-[#D37E5F] transition-all relative">
        {/* ── Three-dot menu ── */}
        <div className="absolute top-5 right-4" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-[#8C8580] hover:text-[#1A1A1A] rounded-[8px] hover:bg-[#FCFAFA] transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-[#F0EBE8] rounded-[16px] shadow-lg py-1 z-10 overflow-hidden">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(config);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#1A1A1A] hover:bg-[#FCFAFA]"
              >
                <Edit className="w-4 h-4 text-[#8C8580]" /> Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowDeleteConfirm(true);
                }}
                disabled={isDeleting}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#EB4A4A] hover:bg-[#EB4A4A]/10"
              >
                <Trash className="w-4 h-4 text-[#EB4A4A]" />{" "}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        {/* ── Name + Time + Day pills ── */}
        <div className="mb-5 pr-8">
          <h3 className="text-[18px] font-black text-[#1A1A1A] mb-3 leading-tight tracking-tight">
            {config.name}
          </h3>
          <div className="inline-flex items-center gap-1.5 bg-[#FCFAFA] border border-[#F0EBE8] text-[#1A1A1A] px-3 py-1.5 rounded-[8px] text-xs font-bold mb-4">
            <Clock className="w-3.5 h-3.5 text-[#8C8580]" /> {meetingTime}
          </div>

          {/* Day pills — highlight active days */}
          <div className="flex gap-1.5 flex-wrap">
            {(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const).map((day) => {
              const isActive = activeDayKeys.has(day);
              const isToday = DAY_TO_JS_IDX[day] === todayJsIdx;
              return (
                <div
                  key={day}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-[8px] text-[11px] font-black tracking-wider transition-all",
                    isActive && isToday
                      ? "bg-[#F59E0B] text-white ring-2 ring-offset-1 ring-[#F59E0B]"
                      : isActive
                      ? "bg-[#1A1A1A] text-white"
                      : isToday
                      ? "bg-[#FCFAFA] border-2 border-[#F59E0B] text-[#F59E0B]"
                      : "bg-[#FCFAFA] border border-[#F0EBE8] text-[#8C8580]"
                  )}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Meeting Head ── */}
        <div className="mb-5">
          <div className="text-[10px] font-black text-[#8C8580] uppercase tracking-widest mb-2">
            Meeting Head
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#FDF5F1] text-[#D37E5F] border border-[#F6E1D7] flex items-center justify-center font-black text-sm shrink-0">
              {getInitials(meetingHeadName)}
            </div>
            <div className="truncate">
              <div className="text-sm font-black text-[#1A1A1A] truncate">
                {meetingHeadName}
              </div>
              <div className="text-[11px] font-bold text-[#8C8580] truncate mt-0.5">
                {meetingHeadUser?.email ?? "No email"}
              </div>
            </div>
          </div>
        </div>

        {/* ── Members ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[10px] font-black text-[#8C8580] uppercase tracking-widest">
              Members
            </div>
            <div className="bg-[#FCFAFA] border border-[#F0EBE8] text-[#8C8580] text-[10px] font-black px-2 py-0.5 rounded-[6px]">
              {mappedMembers.length}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {mappedMembers.slice(0, 4).map((name, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[10px] font-black bg-[#FCFAFA] text-[#1A1A1A] border-2 border-white relative z-10"
                >
                  {getInitials(name)}
                </div>
              ))}
              {mappedMembers.length > 4 && (
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[10px] font-black bg-[#F0EBE8] text-[#1A1A1A] border-2 border-white relative z-10">
                  +{mappedMembers.length - 4}
                </div>
              )}
            </div>
            <div className="text-[11px] font-bold text-[#8C8580] truncate flex-1 leading-snug">
              {membersText}
            </div>
          </div>
        </div>

        {/* ── This Week — DYNAMIC ── */}
        <div className="pt-5 border-t border-[#F0EBE8]">
          <div className="text-[10px] font-black text-[#8C8580] uppercase tracking-widest mb-3">
            This Week
          </div>

          <div className="flex justify-between items-center px-1 mb-4">
            {WEEK_DISPLAY_KEYS.map((day) => {
              const { color, ringColor, isToday } = getDayStatus(
                day,
                activeDayKeys,
                todayJsIdx
              );
              return (
                <div key={day} className="flex flex-col items-center gap-2">
                  {/* Day label — bold + dark if today */}
                  <span
                    className={cn(
                      "text-[10px]",
                      isToday
                        ? "font-black text-[#1A1A1A]"
                        : "font-bold text-[#8C8580]"
                    )}
                  >
                    {day}
                  </span>
                  {/* Dot */}
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      color,
                      ringColor
                    )}
                  />
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 flex-wrap text-[10px] font-bold text-[#8C8580]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#2ECC71]" />
              Held
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              Today
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#E5E7EB]" />
              Upcoming / Off
            </div>
          </div>
        </div>

        {/* ── Default badge ── */}
        {(config.isDefault || config.is_default) && (
          <div className="mt-5 flex">
            <span className="bg-[#1A1A1A] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-[8px]">
              Default Meeting
            </span>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          configName={config.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

// ── SettingsTab ──
const SettingsTab = () => {
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listError, setListError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [headFilter, setHeadFilter] = useState("All Heads");
  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [dropdownsLoading, setDropdownsLoading] = useState(true);

  const orgid = () => localStorage.getItem("org_id") || " ";

  useEffect(() => {
    const fetchDropdownData = async () => {
      setDropdownsLoading(true);
      const token = localStorage.getItem("token");
      try {
        const [deptRes, usersRes] = await Promise.all([
          fetch(`${getBaseUrl()}/pms/departments.json`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `${getBaseUrl()}/api/users?organization_id=${orgid()}&token=${token}`
          ),
        ]);
        const deptData = await deptRes.json();
        const usersData = await usersRes.json();
        setDepartments(
          (deptData?.departments ?? []).filter((d) => d.active === true)
        );
        setUsers(usersData?.users ?? usersData ?? []);
      } catch (err) {
        console.error("Failed to load dropdown data:", err);
        toast.error("Failed to load dropdown data.");
      } finally {
        setDropdownsLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

  const loadConfigs = async () => {
    setIsLoading(true);
    setListError(null);
    try {
      const data = await fetchMeetingConfigs();
      const parsedData = Array.isArray(data)
        ? data
        : data.data
        ? [data.data]
        : [];
      setConfigs(parsedData);
    } catch (err) {
      setListError(err.message);
      toast.error("Failed to load configurations: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleEdit = (config) => {
    setEditingConfig(config);
    setShowModal(true);
  };
  const handleCreate = () => {
    setEditingConfig(null);
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    setEditingConfig(null);
  };
  const handleSaved = () => {
    handleModalClose();
    loadConfigs();
  };

  const getDisplayName = (val) => {
    if (!val) return null;
    if (typeof val === "object" && val !== null) return val.name;
    return val;
  };

  const filteredConfigs = configs.filter((c) => {
    const matchesSearch = (c.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const headName = getDisplayName(c.meetingHead || c.meeting_head);
    const matchesHead = headFilter === "All Heads" || headName === headFilter;
    return matchesSearch && matchesHead;
  });

  const uniqueHeads = [
    "All Heads",
    ...new Set(
      configs
        .map((c) => getDisplayName(c.meetingHead || c.meeting_head))
        .filter(Boolean)
    ),
  ];

  const totalMembersCount = configs.reduce(
    (acc, curr) =>
      acc + (curr.members?.length || curr.memberIds?.length || 0),
    0
  );

  return (
    <div
      className="space-y-6 pb-12 px-4 sm:px-8 min-h-screen pt-8"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[24px] font-black text-[#1A1A1A] tracking-tight">
              Meeting Configurations
            </h2>
            <p className="text-[12px] font-bold text-[#8C8580] uppercase tracking-widest mt-1">
              Configure recurring meetings and participants
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-white border border-[#F0EBE8] text-[#1A1A1A] hover:bg-gray-50 px-5 py-2.5 rounded-[16px] text-sm font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> New Meeting
          </button>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-[24px] border border-[#F0EBE8] p-6 shadow-sm flex flex-wrap items-center gap-4 text-sm font-bold text-[#8C8580]">
          <div className="text-[#1A1A1A] font-black">
            {configs.length} Active Meetings
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#F0EBE8]"></div>
          <div>{totalMembersCount} Total Members</div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#F0EBE8]"></div>
          <div className="flex items-center gap-2 text-[#1A1A1A]">
            <Clock className="w-4 h-4 text-[#D37E5F]" /> Next: Sa at 10:00
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580]" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] pl-11 pr-4 py-3 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#EB4A4A] shadow-sm transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] px-4 py-3 shadow-sm min-w-[200px]">
            <Filter className="w-4 h-4 text-[#8C8580] shrink-0" />
            <select
              value={headFilter}
              onChange={(e) => setHeadFilter(e.target.value)}
              className="w-full bg-transparent text-sm text-[#1A1A1A] font-bold focus:outline-none appearance-none cursor-pointer"
            >
              {uniqueHeads.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#8C8580] shrink-0 pointer-events-none" />
          </div>
        </div>

        {/* Error State */}
        {listError && (
          <div className="bg-[#EB4A4A]/10 border border-[#EB4A4A]/20 rounded-[20px] p-5 flex items-start gap-4 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-[#EB4A4A] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-black text-[#EB4A4A]">
                Failed to load configurations
              </div>
              <div className="text-sm font-bold text-[#EB4A4A]/80 mt-1">
                {listError}
              </div>
            </div>
            <button
              onClick={loadConfigs}
              className="bg-white border border-[#EB4A4A]/30 text-[#EB4A4A] px-4 py-2 rounded-[12px] text-xs font-black hover:bg-[#EB4A4A]/5 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#F0EBE8] rounded-[24px] shadow-sm p-6 animate-pulse h-[320px]"
              />
            ))}
          </div>
        ) : filteredConfigs.length === 0 && !listError ? (
          <div className="text-center py-24 bg-white border-2 border-dashed border-[#F0EBE8] rounded-[32px]">
            <p className="text-[#8C8580] font-bold text-sm">
              No meeting configurations found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConfigs.map((config) => (
              <ConfigCard
                key={config.id}
                config={config}
                loadConfigs={loadConfigs}
                onEdit={handleEdit}
                allUsers={users}
              />
            ))}

            {/* Create New Card */}
            <button
              onClick={handleCreate}
              className="border-2 border-dashed border-[#F0EBE8] rounded-[24px] p-6 flex flex-col items-center justify-center gap-4 text-[#8C8580] hover:bg-[#FCFAFA] hover:text-[#1A1A1A] transition-all duration-200 min-h-[320px] group"
            >
              <div className="w-12 h-12 rounded-[14px] bg-white border border-[#F0EBE8] flex items-center justify-center shadow-sm group-hover:shadow transition-all">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-black uppercase tracking-wider">
                Add Configuration
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <MeetingConfigModal
          onClose={handleModalClose}
          onSaved={handleSaved}
          existingConfig={editingConfig}
          users={users}
          departments={departments}
          dropdownsLoading={dropdownsLoading}
        />
      )}
    </div>
  );
};

export default SettingsTab;