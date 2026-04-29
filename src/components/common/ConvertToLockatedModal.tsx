import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import {
  lockatedApi,
  type LockatedItemType,
  type LockatedOption,
} from "@/api/lockated";
import { ticketApi } from "@/api/tickets";
import { useNotificationStore } from "@/stores/notificationStore";
import Modal from "./Modal";
import Spinner from "./Spinner";

interface ConvertToLockatedModalProps {
  defaultTitle: string;
  defaultDescription?: string;
  ticketId?: string;
  onClose: () => void;
}

const TYPES: { value: LockatedItemType; label: string }[] = [
  { value: "task", label: "Task" },
  { value: "issue", label: "Issue" },
  { value: "todo", label: "To-do" },
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const ISSUE_TYPES = ["bug", "feature", "improvement", "task"];

const SearchableSelect = ({
  label,
  value,
  onChange,
  options,
  loading,
  placeholder = "— Select —",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: LockatedOption[];
  loading?: boolean;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => String(o.id) === value);
  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
  };

  return (
    <div ref={wrapRef}>
      <label className="form-label">{label}</label>
      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => {
            if (!loading) setOpen((o) => !o);
          }}
          className="form-select w-full flex items-center justify-between text-left"
          style={{ color: selected ? "var(--text)" : "var(--text-muted)" }}
        >
          <span className="truncate">
            {loading ? "Loading…" : (selected?.name ?? placeholder)}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {loading && <Spinner className="h-3.5 w-3.5" />}
            {!loading && value && (
              <span
                onClick={handleClear}
                className="flex items-center justify-center h-4 w-4 rounded-full text-xs leading-none hover:opacity-70"
                style={{
                  backgroundColor: "var(--stone-10)",
                  color: "var(--stone)",
                }}
              >
                ×
              </span>
            )}
            {!loading && (
              <svg
                className="h-3.5 w-3.5 transition-transform"
                style={{
                  color: "var(--stone)",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute z-50 left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Search input */}
            <div
              className="p-2"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full rounded-md px-2.5 py-1.5 text-xs outline-none"
                style={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border-md)",
                  color: "var(--text)",
                }}
              />
            </div>

            {/* Options list */}
            <div className="max-h-44 overflow-y-auto">
              {filtered.length === 0 ? (
                <p
                  className="px-3 py-4 text-center text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {query ? "No results" : "No options"}
                </p>
              ) : (
                filtered.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onMouseDown={() => handleSelect(String(o.id))}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-left transition-colors"
                    style={{
                      backgroundColor:
                        String(o.id) === value
                          ? "var(--violet-10)"
                          : "transparent",
                      color:
                        String(o.id) === value
                          ? "var(--violet)"
                          : "var(--text)",
                    }}
                  >
                    {String(o.id) === value && (
                      <svg
                        className="h-3 w-3 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    <span className={String(o.id) === value ? "" : "ml-5"}>
                      {o.name}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ConvertToLockatedModal = ({
  defaultTitle,
  defaultDescription = "",
  ticketId,
  onClose,
}: ConvertToLockatedModalProps) => {
  const { user } = useAuthStore();
  const addToast = useNotificationStore((s) => s.addToast);
  const qc = useQueryClient();

  const [type, setType] = useState<LockatedItemType>("task");
  const [title, setTitle] = useState(defaultTitle);
  const [desc, setDesc] = useState(defaultDescription);
  const [priority, setPriority] = useState("Medium");
  const [issueType, setIssueType] = useState("bug");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Shared dropdown state (task + issue share project/milestone/user)
  const [projects, setProjects] = useState<LockatedOption[]>([]);
  const [milestones, setMilestones] = useState<LockatedOption[]>([]);
  const [users, setUsers] = useState<LockatedOption[]>([]);
  const [projectId, setProjectId] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [respPerson, setRespPerson] = useState("");
  const [todoUserId, setTodoUserId] = useState("");
  const [todoRespPerson, setTodoRespPerson] = useState("");

  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingMilestones, setLoadingMilestones] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const accessToken = user?.lockatedAccessToken;

  // Fetch projects and users on mount
  useEffect(() => {
    if (!accessToken) return;

    setLoadingProjects(true);
    lockatedApi
      .fetchProjects(accessToken)
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoadingProjects(false));

    setLoadingUsers(true);
    lockatedApi
      .fetchUsers(accessToken)
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, [accessToken]);

  // Fetch milestones whenever project changes
  useEffect(() => {
    setMilestones([]);
    setMilestoneId("");
    if (!accessToken || !projectId) return;

    setLoadingMilestones(true);
    lockatedApi
      .fetchMilestones(projectId, accessToken)
      .then(setMilestones)
      .catch(() => {})
      .finally(() => setLoadingMilestones(false));
  }, [projectId, accessToken]);

  const handleSubmit = async () => {
    if (!accessToken) return;
    if (!title.trim()) {
      addToast("Title is required", "error");
      return;
    }

    setSubmitting(true);
    try {
      let created;
      if (type === "task") {
        created = await lockatedApi.createTask(
          {
            title: title.trim(),
            description: desc.trim() || undefined,
            priority,
            project_management_id: projectId || undefined,
            milestone_id: milestoneId || undefined,
            responsible_person_id: respPerson || undefined,
          },
          accessToken
        );
      } else if (type === "issue") {
        created = await lockatedApi.createIssue(
          {
            title: title.trim(),
            description: desc.trim() || undefined,
            priority,
            issue_type: issueType,
            project_management_id: projectId || undefined,
            responsible_person_id: respPerson || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
          },
          accessToken
        );
      } else {
        created = await lockatedApi.createTodo(
          {
            title: title.trim(),
            priority,
            target_date: targetDate || undefined,
            user_id: todoUserId || undefined,
            responsible_person_id: todoRespPerson || undefined,
          },
          accessToken
        );
      }

      if (ticketId) {
        await ticketApi.addLockatedLink(ticketId, {
          type: created.type,
          item_id: created.item_id,
          url: created.url,
        });
        qc.invalidateQueries({ queryKey: ["tickets", ticketId] });
      }

      addToast(
        `${TYPES.find((t) => t.value === type)!.label} created in Lockated`,
        "success"
      );
      onClose();
    } catch (err: unknown) {
      console.error("[Lockated] create error:", err);
      let msg = "Failed to create item in Lockated";
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        const detail =
          typeof data === "string"
            ? data
            : (data?.errors?.join(", ") ??
              data?.error ??
              data?.message ??
              JSON.stringify(data));
        if (detail) msg = detail;
      }
      addToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!accessToken) {
    return (
      <Modal title="Convert to Lockated" onClose={onClose}>
        <div className="px-6 py-8 text-center space-y-3">
          <p className="text-small" style={{ color: "var(--text-muted)" }}>
            This feature requires Lockated SSO login.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Please sign out and log in using your Lockated credentials.
          </p>
          <div className="flex justify-center pt-2">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Convert to Lockated" onClose={onClose}>
      <div className="flex flex-col gap-4 px-6 py-5">
        {/* Type tabs */}
        <div
          className="flex gap-1 rounded-lg p-1"
          style={{ backgroundColor: "var(--stone-10)" }}
        >
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className="flex-1 rounded-md py-1.5 text-xs font-medium transition-colors"
              style={
                type === t.value
                  ? {
                      backgroundColor: "var(--bg-card)",
                      color: "var(--violet)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }
                  : { color: "var(--text-muted)" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label className="form-label">Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Description (task + issue) */}
        {type !== "todo" && (
          <div>
            <label className="form-label">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="form-textarea"
            />
          </div>
        )}

        {/* Priority */}
        <div>
          <label className="form-label">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-select"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* ── Task fields ── */}
        {type === "task" && (
          <>
            <SearchableSelect
              label="Project"
              value={projectId}
              onChange={setProjectId}
              options={projects}
              loading={loadingProjects}
              placeholder="— Select project —"
            />
            <SearchableSelect
              label="Milestone"
              value={milestoneId}
              onChange={setMilestoneId}
              options={milestones}
              loading={loadingMilestones}
              placeholder={
                projectId
                  ? "— Select milestone —"
                  : "— Select a project first —"
              }
            />
            <SearchableSelect
              label="Responsible Person"
              value={respPerson}
              onChange={setRespPerson}
              options={users}
              loading={loadingUsers}
              placeholder="— Select person —"
            />
          </>
        )}

        {/* ── Issue fields ── */}
        {type === "issue" && (
          <>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="form-label">Issue Type</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="form-select"
                >
                  {ISSUE_TYPES.map((t) => (
                    <option key={t} value={t} className="capitalize">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <SearchableSelect
                  label="Project"
                  value={projectId}
                  onChange={setProjectId}
                  options={projects}
                  loading={loadingProjects}
                  placeholder="— Select project —"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="flex-1">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <SearchableSelect
              label="Responsible Person"
              value={respPerson}
              onChange={setRespPerson}
              options={users}
              loading={loadingUsers}
              placeholder="— Select person —"
            />
          </>
        )}

        {/* ── To-do fields ── */}
        {type === "todo" && (
          <>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="form-label">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="flex-1">
                <SearchableSelect
                  label="Assigned User"
                  value={todoUserId}
                  onChange={setTodoUserId}
                  options={users}
                  loading={loadingUsers}
                  placeholder="— Select user —"
                />
              </div>
            </div>
            <SearchableSelect
              label="Responsible Person"
              value={todoRespPerson}
              onChange={setTodoRespPerson}
              options={users}
              loading={loadingUsers}
              placeholder="— Select person —"
            />
          </>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            {submitting && <Spinner className="h-4 w-4" />}
            Create {TYPES.find((t) => t.value === type)!.label}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConvertToLockatedModal;
