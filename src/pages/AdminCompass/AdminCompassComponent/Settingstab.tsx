// ─────────────────────────────────────────────
// SettingsTab.jsx — Coral/Amber Theme
// ─────────────────────────────────────────────
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
import {
  fetchMeetingConfigs,
  createMeetingConfig,
  updateMeetingConfig,
  deleteMeetingConfig,
  addMembersToConfig,
  removeMemberFromConfig,
  departmentOptions,
  ALL_USERS,
  getInitials,
} from "./shared";

// ── MeetingConfigModal ──
const MeetingConfigModal = ({ onClose, onSaved, existingConfig = null }) => {
  const isEdit = !!existingConfig;
  const [form, setForm] = useState({
    name: existingConfig?.name ?? "",
    meeting_time: existingConfig?.meetingTime ?? "",
    meeting_days: existingConfig?.meetingDays ?? [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
    ],
    meeting_head_id: existingConfig?.meetingHeadId
      ? String(existingConfig.meetingHeadId)
      : "",
    department_id: existingConfig?.departmentId
      ? String(existingConfig.departmentId)
      : "",
    is_default: existingConfig?.isDefault ?? false,
  });
  const [selectedMemberIds, setSelectedMemberIds] = useState(
    existingConfig ? existingConfig.memberIds : []
  );
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
  const toggleMember = (id) =>
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );

  const filteredUsers = ALL_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(memberSearch.toLowerCase())
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
    };
    try {
      let configId = existingConfig?.id;
      if (isEdit) {
        await updateMeetingConfig(configId, payload);
        const oldMembers = existingConfig.memberIds || [];
        const toAdd = selectedMemberIds.filter(
          (id) => !oldMembers.includes(id)
        );
        const toRemove = oldMembers.filter(
          (id) => !selectedMemberIds.includes(id)
        );
        if (toAdd.length > 0) await addMembersToConfig(configId, toAdd);
        for (const rId of toRemove) await removeMemberFromConfig(configId, rId);
      } else {
        const created = await createMeetingConfig({
          ...payload,
          member_ids: selectedMemberIds,
        });
        configId = created?.id || created?.data?.id;
        if (configId && selectedMemberIds.length > 0 && !created?.member_ids)
          await addMembersToConfig(configId, selectedMemberIds);
      }
      onSaved();
    } catch (err) {
      setError(err.message || "Failed to save config.");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#fffaf8] rounded-[28px] border border-[rgba(218,119,86,0.18)] shadow-2xl w-full max-w-[600px] flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-start justify-between p-6 border-b border-[rgba(218,119,86,0.12)] bg-[#fef6f4]">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEdit
                ? "Edit Meeting Configuration"
                : "Create Meeting Configuration"}
            </h2>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-[90%]">
              Configure a recurring daily meeting. This will auto-select when
              the meeting head logs in to record minutes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#DA7756] p-1 rounded-xl hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#fffaf8]">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-1.5 block">
                Meeting Name <span className="text-[#DA7756]">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Sales Team Daily Stand-up"
                className="w-full border border-[rgba(218,119,86,0.22)] bg-white rounded-2xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-1.5 block">
                Meeting Time <span className="text-[#DA7756]">*</span>
              </label>
              <input
                type="time"
                value={form.meeting_time}
                onChange={(e) =>
                  setForm({ ...form, meeting_time: e.target.value })
                }
                className="w-full border border-[rgba(218,119,86,0.22)] bg-white rounded-2xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756]"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">
              Meeting Days
            </label>
            <div className="flex flex-wrap gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-sm font-semibold transition-all",
                    form.meeting_days.includes(day)
                      ? "bg-[#DA7756] text-white"
                      : "bg-white text-gray-600 border border-[rgba(218,119,86,0.16)] hover:bg-[#fef6f4] hover:border-[#DA7756]/40"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Select the days this meeting will take place
            </p>
          </div>
          <div className="space-y-5 border-t border-[rgba(218,119,86,0.12)] pt-5">
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-1.5 block">
                Meeting Head <span className="text-[#DA7756]">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.meeting_head_id}
                  onChange={(e) =>
                    setForm({ ...form, meeting_head_id: e.target.value })
                  }
                  className="w-full border border-[rgba(218,119,86,0.22)] rounded-2xl px-3 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756] bg-white"
                >
                  <option value="">Select meeting head</option>
                  {ALL_USERS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-1.5 block">
                Department (Optional)
              </label>
              <div className="relative">
                <select
                  value={form.department_id}
                  onChange={(e) =>
                    setForm({ ...form, department_id: e.target.value })
                  }
                  className="w-full border border-[rgba(218,119,86,0.22)] rounded-2xl px-3 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756] bg-white"
                >
                  <option value="">Select department</option>
                  {departmentOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-1.5 block">
                Meeting Members
              </label>
              <div className="border border-[rgba(218,119,86,0.14)] rounded-2xl overflow-hidden flex flex-col bg-white">
                <div className="p-2 border-b border-[rgba(218,119,86,0.14)] bg-[#fef6f4]">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full bg-white border border-[rgba(218,119,86,0.16)] rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#DA7756]"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto p-1">
                  {filteredUsers.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      No members found.
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-start gap-3 p-2.5 hover:bg-[#fef6f4] rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="pt-0.5">
                          <input
                            type="checkbox"
                            checked={selectedMemberIds.includes(user.id)}
                            onChange={() => toggleMember(user.id)}
                            className="w-4 h-4 text-[#DA7756] rounded border-gray-300 focus:ring-[#DA7756] cursor-pointer accent-[#DA7756]"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) =>
                  setForm({ ...form, is_default: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#DA7756]"
              />
              <span className="text-sm font-semibold text-gray-800">
                Set as default meeting
              </span>
            </label>
          </div>
        </div>
        <div className="p-4 border-t border-[rgba(218,119,86,0.12)] bg-[#fef6f4] flex justify-end gap-3 rounded-b-[28px]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[rgba(218,119,86,0.18)] text-gray-700 rounded-2xl text-sm font-semibold hover:bg-[#fffaf8] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(
              "px-5 py-2 bg-[#DA7756] text-white rounded-2xl text-sm font-semibold hover:bg-[#c9673f] transition-colors shadow-sm",
              isLoading && "opacity-70 pointer-events-none"
            )}
          >
            {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── ConfigCard ──
const ConfigCard = ({ config, onEdit, loadConfigs }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    if (!window.confirm(`Are you sure you want to delete "${config.name}"?`))
      return;
    setIsDeleting(true);
    try {
      await deleteMeetingConfig(config.id);
      loadConfigs();
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDisplayName = (val) => {
    if (!val) return null;
    if (typeof val === "object" && val !== null) return val.name;
    return val;
  };
  const meetingHeadName = getDisplayName(config.meetingHead) || "Unknown Head";
  const mappedMembers = (config.memberIds || []).map((id) => {
    const user = ALL_USERS.find((u) => u.id === id);
    return user ? user.name : `User ${id}`;
  });
  const visibleMembers = mappedMembers.slice(0, 3);
  const hiddenMembersCount = mappedMembers.length - 3;
  const membersText =
    mappedMembers.length > 0
      ? `${visibleMembers.join(", ")} ${hiddenMembersCount > 0 ? `+${hiddenMembersCount} more` : ""}`
      : "No members";
  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Coral avatar palette
  const avatarColors = [
    "bg-[#DA7756] text-[#4A1B0C]",
    "bg-[#c9673f] text-[#4A1B0C]",
    "bg-[#e8956b] text-[#4A1B0C]",
    "bg-[#b85530] text-white",
  ];

  return (
    <div className="bg-white border border-[rgba(218,119,86,0.18)] rounded-2xl shadow-sm p-6 hover:shadow-md hover:border-[rgba(218,119,86,0.35)] transition-all relative">
      <div className="absolute top-5 right-4" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 text-gray-400 hover:text-[#DA7756] rounded-md hover:bg-orange-50 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-1 w-32 bg-white border border-[rgba(218,119,86,0.18)] rounded-lg shadow-lg py-1 z-10">
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit(config);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50"
            >
              <Edit className="w-4 h-4 text-[#DA7756]" /> Edit
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleDelete();
              }}
              disabled={isDeleting}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash className="w-4 h-4 text-red-400" />{" "}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
      <div className="mb-4 pr-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">{config.name}</h3>
        <div className="inline-flex items-center gap-1.5 bg-[#FAECE7] text-[#993C1D] px-2.5 py-1 rounded-md text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5" />{" "}
          {config.meetingTime || "No time set"}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded text-xs font-bold",
                config.meetingDays.some((cd) => cd.startsWith(day))
                  ? "bg-[#DA7756] text-white"
                  : "bg-orange-50 text-[#c9673f]/50"
              )}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-[10px] font-bold text-[#DA7756]/70 uppercase tracking-wider mb-2">
          Meeting Head
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FAECE7] text-[#993C1D] flex items-center justify-center font-bold text-sm border border-[rgba(218,119,86,0.25)] shrink-0">
            {getInitials(meetingHeadName)}
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-gray-900 truncate">
              {meetingHeadName}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {ALL_USERS.find((u) => u.name === meetingHeadName)?.email ||
                "No email"}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-[10px] font-bold text-[#DA7756]/70 uppercase tracking-wider">
            Members
          </div>
          <div className="bg-[#FAECE7] text-[#993C1D] text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            {config.memberIds.length}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {mappedMembers.slice(0, 4).map((name, i) => (
              <div
                key={i}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white relative z-10",
                  avatarColors[i % 4]
                )}
              >
                {getInitials(name)}
              </div>
            ))}
            {mappedMembers.length > 4 && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold bg-orange-50 text-[#993C1D] border-2 border-white relative z-10">
                +{mappedMembers.length - 4}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 truncate flex-1">
            {membersText}
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-orange-100">
        <div className="text-[10px] font-bold text-[#DA7756]/70 uppercase tracking-wider mb-3">
          This Week
        </div>
        <div className="flex justify-between items-center px-1 mb-3">
          {weekDays.map((day, i) => {
            let dotColor = "bg-gray-200";
            if (i < 2) dotColor = "bg-green-500";
            else if (i === 2) dotColor = "bg-red-500";
            return (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-semibold text-gray-400">
                  {day}
                </span>
                <div className={cn("w-2.5 h-2.5 rounded-full", dotColor)} />
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" /> Held
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" /> Missed
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-200" /> Upcoming/Off
          </div>
        </div>
      </div>
      {config.isDefault && (
        <div className="mt-4 flex">
          <span className="bg-[#FAECE7] text-[#993C1D] text-xs font-semibold px-3 py-1 rounded-md">
            Default Meeting
          </span>
        </div>
      )}
    </div>
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

  const loadConfigs = async () => {
    setIsLoading(true);
    setListError(null);
    try {
      const data = await fetchMeetingConfigs();
      setConfigs(data);
    } catch (err) {
      setListError(err.message);
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
    const matchesSearch = c.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const headName = getDisplayName(c.meetingHead);
    const matchesHead = headFilter === "All Heads" || headName === headFilter;
    return matchesSearch && matchesHead;
  });
  const uniqueHeads = [
    "All Heads",
    ...new Set(
      configs.map((c) => getDisplayName(c.meetingHead)).filter(Boolean)
    ),
  ];
  const totalMembersCount = configs.reduce(
    (acc, curr) => acc + (curr.memberIds?.length || 0),
    0
  );

  return (
    <div className="pb-12 bg-[#fdf8f6] min-h-screen  px-6  pt-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Daily Meeting Configurations
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure recurring daily meetings and their participants
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#DA7756] hover:bg-[#c9673f] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> New Meeting
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(218,119,86,0.18)] p-4 shadow-sm flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="font-semibold text-gray-900">
            {configs.length} Active Meetings
          </div>
          <div className="w-1 h-1 rounded-full bg-[rgba(218,119,86,0.4)]"></div>
          <div>{totalMembersCount} Total Members</div>
          <div className="w-1 h-1 rounded-full bg-[rgba(218,119,86,0.4)]"></div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#DA7756]" /> Next: Sa at 10:00
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DA7756]/50" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756] shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl px-3 py-2.5 shadow-sm min-w-[200px]">
            <Filter className="w-4 h-4 text-[#DA7756]/50 shrink-0" />
            <select
              value={headFilter}
              onChange={(e) => setHeadFilter(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-700 font-semibold focus:outline-none appearance-none"
            >
              {uniqueHeads.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          </div>
        </div>
        {listError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-bold text-red-800">
                Failed to load configurations
              </div>
              <div className="text-sm text-red-600 mt-1">{listError}</div>
            </div>
            <button
              onClick={loadConfigs}
              className="bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50"
            >
              Retry
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[rgba(218,119,86,0.12)] rounded-xl shadow-sm p-5 animate-pulse h-64"
              />
            ))}
          </div>
        ) : filteredConfigs.length === 0 && !listError ? (
          <div className="text-center py-20 bg-white border border-[rgba(218,119,86,0.18)] rounded-2xl">
            <p className="text-gray-500 font-medium">
              No meeting configurations found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredConfigs.map((config) => (
              <ConfigCard
                key={config.id}
                config={config}
                loadConfigs={loadConfigs}
                onEdit={handleEdit}
              />
            ))}
            <button
              onClick={handleCreate}
              className="border-2 border-dashed border-[rgba(218,119,86,0.3)] rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-[#DA7756] hover:bg-[#fef6f4] hover:border-[rgba(218,119,86,0.5)] transition-all duration-200 min-h-[160px] group"
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(218,119,86,0.08)] border border-[rgba(218,119,86,0.2)] flex items-center justify-center group-hover:bg-[rgba(218,119,86,0.15)] transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">Add Config</span>
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <MeetingConfigModal
          onClose={handleModalClose}
          onSaved={handleSaved}
          existingConfig={editingConfig}
        />
      )}
    </div>
  );
};

export default SettingsTab;
