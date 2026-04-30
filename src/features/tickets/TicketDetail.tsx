import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ticketApi } from "@/api/tickets";
import { messageApi } from "@/api/messages";
import { ticketStatusApi } from "@/api/ticketStatuses";
import { userApi } from "@/api/users";
import { customerApi } from "@/api/customers";
import { issueTypeApi } from "@/api/issueTypes";
import { categoryApi } from "@/api/categories";
import { tagsApi } from "@/api/tags";
import type { Tag } from "@/api/tags";
import { activityLogApi, type ActivityLog } from "@/api/activityLogs";
import { useNotificationStore } from "@/stores/notificationStore";
import Modal from "@/components/common/Modal";
import PriorityBadge from "@/components/tickets/PriorityBadge";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import FileUploader from "@/components/common/FileUploader";
import ConvertToLockatedModal from "@/components/common/ConvertToLockatedModal";
import type { Ticket, TicketMessage, Category } from "@/types/schemas/ticket";

/* ── Edit Ticket Modal ─────────────────────────────────────────── */
const editSchema = z.object({
  subject: z.string().min(1, "Required").max(500),
  description: z.string().optional(),
  priority: z.enum(["critical", "high", "medium", "low"]),
  source_channel: z.enum(["email", "whatsapp", "voice", "web", "api"]),
  customer_id: z.string().min(1, "Required"),
  issue_type_id: z.string().optional(),
  category_id: z.string().optional(),
});
type EditForm = z.infer<typeof editSchema>;

const EditTicketModal = ({
  ticket,
  onClose,
}: {
  ticket: Ticket;
  onClose: () => void;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const [selectedParentId, setSelectedParentId] = useState("");

  const { data: customers = [] } = useQuery({
    queryKey: ["customers", "all"],
    queryFn: customerApi.listAll,
  });
  const { data: issueTypes = [] } = useQuery({
    queryKey: ["issueTypes", "all"],
    queryFn: issueTypeApi.listAll,
  });
  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoryApi.listAll,
  });

  const topCategories = allCategories.filter((c: Category) => !c.parentId);
  const subCategories = allCategories.filter(
    (c: Category) => c.parentId === selectedParentId
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      subject: ticket.subject,
      description: ticket.description ?? "",
      priority: ticket.priority,
      source_channel: ticket.sourceChannel,
      customer_id: ticket.customer.id,
      issue_type_id: ticket.issueType?.id ?? "",
      category_id: ticket.category?.id ?? "",
    },
  });

  useEffect(() => {
    if (ticket.category?.parentId) {
      setSelectedParentId(ticket.category.parentId);
    } else if (ticket.category?.id) {
      setSelectedParentId(ticket.category.id);
    }
  }, [ticket.category]);

  const mutation = useMutation({
    mutationFn: (d: EditForm) => ticketApi.update(ticket.id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets", ticket.id] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
      addToast("Ticket updated", "success");
      onClose();
    },
    onError: () => addToast("Failed to update ticket", "error"),
  });

  const handleParentChange = (parentId: string) => {
    setSelectedParentId(parentId);
    const hasSubs = allCategories.some(
      (c: Category) => c.parentId === parentId
    );
    setValue("category_id", hasSubs ? "" : parentId);
  };

  return (
    <Modal title="Edit Ticket" onClose={onClose}>
      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="flex flex-col gap-4 px-6 py-5"
      >
        <div>
          <label className="form-label">Subject *</label>
          <input {...register("subject")} className="form-input" />
          {errors.subject && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.subject.message}
            </p>
          )}
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="form-textarea"
          />
        </div>
        <div>
          <label className="form-label">Client *</label>
          <select {...register("customer_id")} className="form-select">
            <option value="">— Select client —</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.company ? ` (${c.company})` : ""}
              </option>
            ))}
          </select>
          {errors.customer_id && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.customer_id.message}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="form-label">Priority</label>
            <select {...register("priority")} className="form-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="form-label">Channel</label>
            <select {...register("source_channel")} className="form-select">
              <option value="web">Web</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="voice">Voice</option>
              <option value="api">API</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="form-label">Ticket Type</label>
            <select {...register("issue_type_id")} className="form-select">
              <option value="">— None —</option>
              {issueTypes.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="form-label">Category</label>
            <select
              value={selectedParentId}
              onChange={(e) => handleParentChange(e.target.value)}
              className="form-select"
            >
              <option value="">— None —</option>
              {topCategories.map((c: Category) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {selectedParentId && subCategories.length > 0 && (
          <div>
            <label className="form-label">Sub-category</label>
            <select {...register("category_id")} className="form-select">
              <option value="">— None —</option>
              {subCategories.map((c: Category) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {mutation.isPending && <Spinner className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

/* ── Message bubble ──────────────────────────────────────────────── */
const msgTypeBg: Record<string, string> = {
  reply: "var(--sky-10)",
  note: "var(--amber-10)",
  system: "var(--stone-10)",
};
const msgTypeColor: Record<string, string> = {
  reply: "var(--sky)",
  note: "var(--amber)",
  system: "var(--stone)",
};

const MessageBubble = ({ msg }: { msg: TicketMessage }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>
        {msg.authorName ?? "System"}
      </span>
      <span
        className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
        style={{
          backgroundColor: msgTypeBg[msg.messageType] ?? msgTypeBg.system,
          color: msgTypeColor[msg.messageType] ?? msgTypeColor.system,
        }}
      >
        {msg.messageType}
      </span>
      <span
        className="ml-auto text-[11px]"
        style={{ color: "var(--text-muted)" }}
      >
        {new Date(msg.createdAt).toLocaleString()}
      </span>
    </div>
    <div
      className="rounded-lg p-3 text-sm whitespace-pre-wrap"
      style={{
        backgroundColor: "var(--bg-white)",
        border: "1px solid var(--border)",
        color: "var(--text)",
      }}
    >
      {msg.bodyText}
    </div>
    {msg.attachments && msg.attachments.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-1">
        {msg.attachments.map((att) => (
          <a
            key={att.id}
            href={att.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-opacity hover:opacity-70"
            style={{ backgroundColor: "var(--stone-10)", color: "var(--text)" }}
          >
            <svg
              className="h-3.5 w-3.5 flex-shrink-0"
              style={{ color: "var(--stone)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            <span className="max-w-[160px] truncate">{att.filename}</span>
          </a>
        ))}
      </div>
    )}
  </div>
);

/* ── Tags Panel ─────────────────────────────────────────────────── */
const TagsPanel = ({ ticket }: { ticket: Ticket }) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: allTags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: tagsApi.list,
  });

  const ticketTagIds = new Set((ticket.tags ?? []).map((t: Tag) => t.id));

  const suggestions = allTags.filter(
    (t: Tag) =>
      !ticketTagIds.has(t.id) &&
      t.name.toLowerCase().includes(input.toLowerCase())
  );

  const addMutation = useMutation({
    mutationFn: (name: string) => tagsApi.addToTicket(ticket.id, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets", ticket.id] });
      setInput("");
      setOpen(false);
    },
    onError: () => addToast("Failed to add tag", "error"),
  });

  const removeMutation = useMutation({
    mutationFn: (tagId: string) => tagsApi.removeFromTicket(ticket.id, tagId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets", ticket.id] }),
    onError: () => addToast("Failed to remove tag", "error"),
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      addMutation.mutate(input.trim());
    }
    if (e.key === "Escape") {
      setOpen(false);
      setInput("");
    }
  };

  return (
    <div>
      {/* Existing tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {(ticket.tags ?? []).map((tag: Tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: tag.colour
                ? `${tag.colour}20`
                : "var(--violet-10)",
              color: tag.colour ?? "var(--violet)",
            }}
          >
            {tag.name}
            <button
              onClick={() => removeMutation.mutate(tag.id)}
              disabled={removeMutation.isPending}
              className="ml-0.5 hover:opacity-70 leading-none"
              style={{ fontSize: "0.7rem" }}
            >
              ×
            </button>
          </span>
        ))}
        {(ticket.tags ?? []).length === 0 && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            No tags yet
          </span>
        )}
      </div>

      {/* Add tag input */}
      <div className="relative">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag…"
          className="form-input !py-1.5 !text-xs"
          disabled={addMutation.isPending}
        />
        {open && (input || suggestions.length > 0) && (
          <div
            className="absolute z-20 left-0 right-0 mt-1 rounded-lg py-1 shadow-lg"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            {suggestions.map((t: Tag) => (
              <button
                key={t.id}
                onMouseDown={() => addMutation.mutate(t.name)}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-[var(--stone-10)] text-left"
                style={{ color: "var(--text)" }}
              >
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: t.colour ?? "var(--violet)" }}
                />
                {t.name}
              </button>
            ))}
            {input.trim() &&
              !allTags.some(
                (t: Tag) => t.name.toLowerCase() === input.trim().toLowerCase()
              ) && (
                <button
                  onMouseDown={() => addMutation.mutate(input.trim())}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-[var(--stone-10)] text-left"
                  style={{ color: "var(--coral)" }}
                >
                  + Create "{input.trim()}"
                </button>
              )}
            {!input && suggestions.length === 0 && (
              <p
                className="px-3 py-2 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Type to search or create a tag
              </p>
            )}
          </div>
        )}
      </div>
      <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
        Press Enter to add
      </p>
    </div>
  );
};

/* ── Activity log ────────────────────────────────────────────────── */
const eventLabels: Record<string, string> = {
  created: "Ticket created",
  status_change: "Status changed",
  assignment: "Agent assigned",
  priority_change: "Priority changed",
  tag_added: "Tag added",
  tag_removed: "Tag removed",
  escalated: "Escalated",
  note_added: "Note added",
  reply_sent: "Reply sent",
  sla_breached: "SLA breached",
};

const eventColors: Record<string, string> = {
  created: "var(--forest)",
  status_change: "var(--sky)",
  assignment: "var(--violet)",
  priority_change: "var(--amber)",
  tag_added: "var(--coral)",
  tag_removed: "var(--stone)",
  escalated: "var(--crimson)",
  note_added: "var(--amber)",
  reply_sent: "var(--sky)",
  sla_breached: "var(--crimson)",
};

const ActivityLogItem = ({ log }: { log: ActivityLog }) => (
  <div className="flex items-start gap-2">
    <span
      className="mt-1 h-2 w-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: eventColors[log.eventType] ?? "var(--stone)" }}
    />
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium" style={{ color: "var(--text)" }}>
        {eventLabels[log.eventType] ?? log.eventType}
      </p>
      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
        {log.actorName} · {new Date(log.createdAt).toLocaleString()}
      </p>
    </div>
  </div>
);

/* ── Layout helpers (must be at module scope to avoid remount on re-render) ── */
const SectionCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`card ${className}`}>{children}</div>;

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <div
    className="px-5 py-3.5"
    style={{ borderBottom: "1px solid var(--border)" }}
  >
    <h2
      className="text-label uppercase tracking-wider"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </h2>
  </div>
);

/* ── Main TicketDetail ───────────────────────────────────────────── */
const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showEdit, setShowEdit] = useState(false);
  const [showConvert, setShowConvert] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [preventiveAction, setPreventiveAction] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgType, setMsgType] = useState<"reply" | "note">("reply");
  const [msgAttachmentIds, setMsgAttachmentIds] = useState<string[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);

  const {
    data: ticket,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tickets", id],
    queryFn: () => ticketApi.get(id!),
    enabled: !!id,
  });

  const { data: messages = [], isLoading: msgsLoading } = useQuery({
    queryKey: ["tickets", id, "messages"],
    queryFn: () => messageApi.list(id!),
    enabled: !!id,
    refetchInterval: 15_000,
  });

  const { data: agents = [] } = useQuery({
    queryKey: ["users", "all"],
    queryFn: userApi.listAll,
  });
  const { data: statuses = [] } = useQuery({
    queryKey: ["ticketStatuses"],
    queryFn: ticketStatusApi.listAll,
  });
  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoryApi.listAll,
  });
  const { data: activityLogs = [] } = useQuery({
    queryKey: ["tickets", id, "activity_logs"],
    queryFn: () => activityLogApi.list(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (!ticket) return;
    setSelectedAgentId(ticket.assignedAgent?.id ?? "");
    setSelectedStatusId(ticket.status.id);
    setRootCause(ticket.rootCause ?? "");
    setCorrectiveAction(ticket.correctiveAction ?? "");
    setPreventiveAction(ticket.preventiveAction ?? "");
  }, [ticket?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const statusMutation = useMutation({
    mutationFn: (statusId: string) => ticketApi.updateStatus(id!, statusId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets", id] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
      addToast("Status updated", "success");
    },
    onError: () => addToast("Failed to update status", "error"),
  });

  const assignMutation = useMutation({
    mutationFn: (agentId: string) => ticketApi.assign(id!, agentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets", id] });
      addToast("Agent assigned", "success");
    },
    onError: () => addToast("Failed to assign agent", "error"),
  });

  const dispositionMutation = useMutation({
    mutationFn: () =>
      ticketApi.update(id!, {
        root_cause: rootCause || undefined,
        corrective_action: correctiveAction || undefined,
        preventive_action: preventiveAction || undefined,
      } as Parameters<typeof ticketApi.update>[1]),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets", id] });
      addToast("Disposition saved", "success");
    },
    onError: () => addToast("Failed to save disposition", "error"),
  });

  const sendMutation = useMutation({
    mutationFn: () =>
      messageApi.create(id!, {
        body_text: msgBody,
        message_type: msgType,
        attachment_ids: msgAttachmentIds,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets", id, "messages"] });
      setMsgBody("");
      setMsgAttachmentIds([]);
      setUploaderKey((k) => k + 1);
      addToast("Message sent", "success");
    },
    onError: () => addToast("Failed to send message", "error"),
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  if (isError || !ticket) return <ErrorState onRetry={refetch} />;

  const agentChanged = selectedAgentId !== (ticket.assignedAgent?.id ?? "");
  const dispositionChanged =
    rootCause !== (ticket.rootCause ?? "") ||
    correctiveAction !== (ticket.correctiveAction ?? "") ||
    preventiveAction !== (ticket.preventiveAction ?? "");

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link
          to="/tickets"
          className="text-small font-medium transition-colors"
          style={{ color: "var(--coral)" }}
        >
          ← Back to Tickets
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* ── Left column ──────────────────────────────────────── */}
        <div className="col-span-2 space-y-4">
          {/* Ticket header */}
          <SectionCard>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-center gap-2 flex-wrap">
                    <span
                      className="font-mono text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      #{ticket.number}
                    </span>
                    <PriorityBadge priority={ticket.priority} />
                    <span
                      className="badge capitalize"
                      style={{
                        backgroundColor: "var(--stone-10)",
                        color: "var(--stone)",
                      }}
                    >
                      {ticket.sourceChannel}
                    </span>
                  </div>
                  <h1 className="text-h2" style={{ color: "var(--text)" }}>
                    {ticket.subject}
                  </h1>
                  {ticket.description && (
                    <p
                      className="mt-2 text-small whitespace-pre-wrap"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {ticket.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowConvert(true)}
                    className="btn-secondary !text-xs"
                    style={{ color: "var(--violet)" }}
                  >
                    Convert to…
                  </button>
                  <button onClick={() => setShowEdit(true)} className="btn">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Disposition */}
          <SectionCard>
            <SectionHeader>Disposition</SectionHeader>
            <div className="p-5 space-y-3">
              <div>
                <label className="form-label">Root Cause</label>
                <textarea
                  rows={2}
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  placeholder="Describe the root cause…"
                  className="form-textarea"
                />
              </div>
              <div>
                <label className="form-label">Corrective Action</label>
                <textarea
                  rows={2}
                  value={correctiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                  placeholder="Action taken to correct the issue…"
                  className="form-textarea"
                />
              </div>
              <div>
                <label className="form-label">Preventive Action</label>
                <textarea
                  rows={2}
                  value={preventiveAction}
                  onChange={(e) => setPreventiveAction(e.target.value)}
                  placeholder="Action to prevent recurrence…"
                  className="form-textarea"
                />
              </div>
              {dispositionChanged && (
                <div className="flex justify-end">
                  <button
                    onClick={() => dispositionMutation.mutate()}
                    disabled={dispositionMutation.isPending}
                    className="btn-primary flex items-center gap-2"
                  >
                    {dispositionMutation.isPending && (
                      <Spinner className="h-4 w-4" />
                    )}
                    Save Disposition
                  </button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Messages */}
          <SectionCard>
            <SectionHeader>
              Messages{messages.length > 0 && ` (${messages.length})`}
            </SectionHeader>

            <div className="max-h-[420px] overflow-y-auto space-y-4 p-5">
              {msgsLoading && (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              )}
              {!msgsLoading && messages.length === 0 && (
                <p
                  className="py-8 text-center text-small"
                  style={{ color: "var(--text-muted)" }}
                >
                  No messages yet.
                </p>
              )}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Compose */}
            <div
              className="p-4 space-y-2"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-1 mb-2">
                <span
                  className="text-label mr-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Type:
                </span>
                {(["reply", "note"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMsgType(t)}
                    className="rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors"
                    style={
                      msgType === t
                        ? {
                            backgroundColor: "var(--coral-10)",
                            color: "var(--coral)",
                          }
                        : { color: "var(--text-muted)" }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
                placeholder={
                  msgType === "reply"
                    ? "Write a reply…"
                    : "Add an internal note…"
                }
                className="form-textarea"
              />
              <FileUploader
                key={uploaderKey}
                onAttachmentsChange={setMsgAttachmentIds}
              />
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (msgBody.trim()) sendMutation.mutate();
                  }}
                  disabled={!msgBody.trim() || sendMutation.isPending}
                  className="btn-primary flex items-center gap-2"
                >
                  {sendMutation.isPending && <Spinner className="h-4 w-4" />}
                  Send {msgType === "note" ? "Note" : "Reply"}
                </button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Right sidebar ───────────────────────────────────── */}
        <div className="space-y-4">
          <SectionCard>
            <SectionHeader>Details</SectionHeader>
            <dl className="p-4 space-y-4 text-sm">
              <div>
                <dt className="form-label">Status</dt>
                <dd className="space-y-1.5">
                  <select
                    value={selectedStatusId}
                    onChange={(e) => setSelectedStatusId(e.target.value)}
                    className="form-select"
                  >
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {selectedStatusId !== ticket.status.id && (
                    <button
                      onClick={() => statusMutation.mutate(selectedStatusId)}
                      disabled={statusMutation.isPending}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {statusMutation.isPending && (
                        <Spinner className="h-4 w-4" />
                      )}
                      Update Status
                    </button>
                  )}
                </dd>
              </div>
              <div>
                <dt className="form-label">Client</dt>
                <dd
                  className="font-medium text-small"
                  style={{ color: "var(--text)" }}
                >
                  {ticket.customer.name}
                  {ticket.customer.company && (
                    <span
                      className="ml-1 font-normal"
                      style={{ color: "var(--text-muted)" }}
                    >
                      ({ticket.customer.company})
                    </span>
                  )}
                </dd>
                <dd
                  className="text-small mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {ticket.customer.email}
                </dd>
              </div>
              {ticket.issueType && (
                <div>
                  <dt className="form-label">Ticket Type</dt>
                  <dd
                    className="text-small font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    {ticket.issueType.name}
                  </dd>
                </div>
              )}
              {ticket.category && (
                <div>
                  <dt className="form-label">Category</dt>
                  <dd
                    className="text-small font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    {ticket.category.parentId
                      ? (() => {
                          const parent = allCategories.find(
                            (c) => c.id === ticket.category!.parentId
                          );
                          return parent ? (
                            <>
                              <span style={{ color: "var(--text-muted)" }}>
                                {parent.name}
                              </span>{" "}
                              › {ticket.category.name}
                            </>
                          ) : (
                            ticket.category.name
                          );
                        })()
                      : ticket.category.name}
                  </dd>
                </div>
              )}
              <div>
                <dt className="form-label">Assigned Agent</dt>
                <dd className="space-y-1.5">
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="form-select"
                  >
                    <option value="">— Unassigned —</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name || a.email}
                      </option>
                    ))}
                  </select>
                  {agentChanged && (
                    <button
                      onClick={() => assignMutation.mutate(selectedAgentId)}
                      disabled={assignMutation.isPending}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {assignMutation.isPending && (
                        <Spinner className="h-4 w-4" />
                      )}
                      Assign
                    </button>
                  )}
                </dd>
              </div>
              {ticket.slaResolveDueAt && (
                <div>
                  <dt className="form-label">SLA Resolve By</dt>
                  <dd
                    className="text-small font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    {new Date(ticket.slaResolveDueAt).toLocaleString()}
                  </dd>
                </div>
              )}
              <div>
                <dt className="form-label">Created</dt>
                <dd
                  className="text-small"
                  style={{ color: "var(--text-muted)" }}
                >
                  {new Date(ticket.createdAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </SectionCard>

          <SectionCard>
            <SectionHeader>Tags</SectionHeader>
            <div className="p-4">
              <TagsPanel ticket={ticket} />
            </div>
          </SectionCard>

          {ticket.lockatedLinks && ticket.lockatedLinks.length > 0 && (
            <SectionCard>
              <SectionHeader>Linked Items</SectionHeader>
              <div className="p-4 space-y-2">
                {ticket.lockatedLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors"
                    style={{
                      backgroundColor: "var(--stone-10)",
                      color: "var(--text)",
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide flex-shrink-0"
                      style={{
                        backgroundColor:
                          link.type === "task"
                            ? "var(--sky-10)"
                            : link.type === "issue"
                              ? "var(--crimson-10)"
                              : "var(--forest-10)",
                        color:
                          link.type === "task"
                            ? "var(--sky)"
                            : link.type === "issue"
                              ? "var(--crimson)"
                              : "var(--forest)",
                      }}
                    >
                      {link.type}
                    </span>
                    <span className="flex-1 text-xs font-medium truncate">
                      {link.url.split("/").pop() || link.type}
                    </span>
                    <svg
                      className="h-3.5 w-3.5 flex-shrink-0"
                      style={{ color: "var(--stone)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </SectionCard>
          )}

          <SectionCard>
            <SectionHeader>Activity</SectionHeader>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {activityLogs.length === 0 && (
                <p
                  className="text-xs text-center py-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  No activity yet.
                </p>
              )}
              {activityLogs.map((log) => (
                <ActivityLogItem key={log.id} log={log} />
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {showEdit && (
        <EditTicketModal ticket={ticket} onClose={() => setShowEdit(false)} />
      )}
      {showConvert && (
        <ConvertToLockatedModal
          defaultTitle={ticket.subject}
          defaultDescription={ticket.description ?? ""}
          ticketId={ticket.id}
          onClose={() => setShowConvert(false)}
        />
      )}
    </div>
  );
};

export default TicketDetail;
