import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Inbox,
  Mail,
  MailOpen,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Ticket as TicketIcon,
} from "lucide-react";
import { inboxMessageApi, type InboxMessage } from "@/api/inboxMessages";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";

const statusMeta: Record<
  InboxMessage["status"],
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Pending", color: "var(--amber)", bg: "var(--amber-10)" },
  ticket_created: {
    label: "Ticket created",
    color: "var(--forest)",
    bg: "var(--forest-10)",
  },
  no_action: {
    label: "No action",
    color: "var(--stone)",
    bg: "var(--stone-10)",
  },
  junk: { label: "Junk", color: "var(--crimson)", bg: "var(--crimson-10)" },
};

const avatarPalette = [
  "var(--coral)",
  "var(--forest)",
  "var(--violet)",
  "var(--sky)",
  "var(--leaf)",
  "var(--amber)",
];

const avatarColorFor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return avatarPalette[hash % avatarPalette.length];
};

const initialsFor = (name?: string | null, email?: string) => {
  const source = name?.trim() || email || "?";
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return source[0]?.toUpperCase() ?? "?";
};

const snippetFor = (msg: InboxMessage) => {
  const raw =
    msg.bodyText ?? msg.bodyHtml?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  return raw?.trim() || "";
};

const relativeTime = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "—";
  }
};

const Avatar = ({ message }: { message: InboxMessage }) => {
  const label = message.fromName || message.fromEmail;
  return (
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
      style={{ backgroundColor: avatarColorFor(label) }}
    >
      {initialsFor(message.fromName, message.fromEmail)}
    </div>
  );
};

const StatusPill = ({ status }: { status: InboxMessage["status"] }) => {
  const meta = statusMeta[status];
  return (
    <span className="badge" style={{ backgroundColor: meta.bg, color: meta.color }}>
      {meta.label}
    </span>
  );
};

const MessageRow = ({
  message,
  active,
  onSelect,
  onCreateTicket,
  onNoAction,
  onJunk,
  isPending,
}: {
  message: InboxMessage;
  active: boolean;
  onSelect: () => void;
  onCreateTicket: () => void;
  onNoAction: () => void;
  onJunk: () => void;
  isPending: boolean;
}) => {
  const unread = message.status === "pending";

  return (
    <button
      onClick={onSelect}
      className="group flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors"
      style={{
        borderColor: "var(--border)",
        backgroundColor: active ? "var(--coral-10)" : "transparent",
        borderLeft: `3px solid ${active ? "var(--coral)" : "transparent"}`,
      }}
    >
      <span
        className="mt-3.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ backgroundColor: unread ? "var(--coral)" : "transparent" }}
      />
      <Avatar message={message} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className="min-w-0 flex-1 truncate text-small"
            style={{
              color: "var(--text)",
              fontWeight: unread ? 600 : 500,
            }}
          >
            {message.fromName || message.fromEmail}
          </p>
          <span
            className="flex-shrink-0 text-[11px]"
            style={{ color: "var(--text-muted)" }}
          >
            {relativeTime(message.receivedAt)}
          </span>
          {/* {message.status === "pending" && (
            <span className="hidden flex-shrink-0 items-center gap-1 group-hover:flex">
              <span
                role="button"
                title="Mark as junk"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPending) onJunk();
                }}
                className="btn-ghost !h-6 !w-6 !p-0"
              >
                <Trash2 className="h-3.5 w-3.5" style={{ color: "var(--crimson)" }} />
              </span>
              <span
                role="button"
                title="No action required"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPending) onNoAction();
                }}
                className="btn-ghost !h-6 !w-6 !p-0"
              >
                <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--stone)" }} />
              </span>
              <span
                role="button"
                title="Create ticket"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPending) onCreateTicket();
                }}
                className="btn-ghost !h-6 !w-6 !p-0"
              >
                <TicketIcon className="h-3.5 w-3.5" style={{ color: "var(--coral)" }} />
              </span>
            </span>
          )} */}
        </div>
        <p
          className="truncate text-small"
          style={{ color: "var(--text)", fontWeight: unread ? 600 : 400 }}
        >
          {message.subject || <span style={{ opacity: 0.5 }}>(No subject)</span>}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="truncate text-[12px]" style={{ color: "var(--text-muted)" }}>
            {snippetFor(message) || "No preview available"}
          </p>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <StatusPill status={message.status} />
          {message.accountName && (
            <span className="badge" style={{ backgroundColor: "var(--violet-10)", color: "var(--violet)" }}>
              {message.accountName}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

const EmptyReadingPane = () => (
  <div
    className="flex h-full flex-1 flex-col items-center justify-center gap-3 p-10 text-center"
    style={{ color: "var(--text-muted)" }}
  >
    <div
      className="flex h-16 w-16 items-center justify-center rounded-full"
      style={{ backgroundColor: "var(--stone-10)" }}
    >
      <MailOpen className="h-7 w-7" style={{ color: "var(--text-muted)" }} />
    </div>
    <p className="text-small font-medium" style={{ color: "var(--text)" }}>
      Select a message to read
    </p>
    <p className="text-[12px]">Choose an email from the list on the left.</p>
  </div>
);

// Inbound email HTML routinely hardcodes fixed pixel widths and
// white-space:nowrap, and can carry its own <style>/on* attributes.
// Rendering it inline (dangerouslySetInnerHTML) lets those rules leak
// into and fight the rest of the app's layout, and lets any inline
// event-handler attributes execute. An isolated iframe sidesteps both:
// its own document, so nothing here can affect the surrounding page —
// hex values below are literal (not brand tokens) because this
// document can't see the parent's CSS custom properties.
const buildEmailDoc = (rawHtml: string) => `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<base target="_blank" />
<style>
  html, body { margin: 0; overflow-x: hidden !important; background: #f6f4ee; }
  body { padding: 16px; font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #2c2c2c; }
  a { color: #da7756; }
  img { height: auto; }
</style>
</head>
<body>
${rawHtml}
<style>
  *, *::before, *::after { max-width: 100% !important; box-sizing: border-box !important; }
  body, div, p, span, a, li, td, th, table, h1, h2, h3, h4, h5, h6 {
    white-space: normal !important;
    word-break: break-word !important;
    overflow-wrap: anywhere !important;
  }
  table { width: 100% !important; table-layout: auto !important; }
</style>
</body>
</html>`;

const EmailFrame = ({ html }: { html: string }) => (
  <iframe
    title="Email content"
    sandbox="allow-same-origin"
    srcDoc={buildEmailDoc(html)}
    className="block h-full w-full flex-1 border-0"
  />
);

const ReadingPane = ({
  message,
  onBack,
  onCreateTicket,
  onNoAction,
  onJunk,
  isPending,
}: {
  message: InboxMessage;
  onBack: () => void;
  onCreateTicket: () => void;
  onNoAction: () => void;
  onJunk: () => void;
  isPending: boolean;
}) => (
  <div className="flex h-full flex-1 flex-col">
    <div
      className="flex flex-shrink-0 items-start justify-between gap-3 px-6 py-4"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="min-w-0 flex-1">
        <button
          onClick={onBack}
          className="btn-ghost mb-2 !h-7 !px-2 !text-xs lg:hidden"
        >
          ← Back to inbox
        </button>
        <h2 className="text-h3 truncate" style={{ color: "var(--text)" }}>
          {message.subject || <span style={{ opacity: 0.5 }}>(No subject)</span>}
        </h2>
        <div className="mt-2 flex items-center gap-3">
          <Avatar message={message} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-small font-medium" style={{ color: "var(--text)" }}>
              {message.fromName || message.fromEmail}
              {message.fromName && (
                <span className="ml-1.5 font-normal" style={{ color: "var(--text-muted)" }}>
                  &lt;{message.fromEmail}&gt;
                </span>
              )}
            </p>
            <div className="mt-0.5 flex items-center gap-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
              {message.receivedAt && (
                <span>{new Date(message.receivedAt).toLocaleString()}</span>
              )}
              {message.accountName && (
                <span
                  className="font-medium"
                  style={{ color: "var(--violet)" }}
                >
                  · {message.accountName}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <StatusPill status={message.status} />
    </div>

    <div className="flex min-w-0 flex-1 flex-col overflow-hidden px-6 py-5">
      {message.bodyHtml ? (
        <div
          className="flex min-w-0 flex-1 overflow-hidden rounded-lg"
          style={{ border: "1px solid var(--border)" }}
        >
          <EmailFrame key={message.id} html={message.bodyHtml} />
        </div>
      ) : (
        <div
          className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden rounded-lg p-4 text-small"
          style={{
            backgroundColor: "var(--bg)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          <pre className="whitespace-pre-wrap break-words font-body text-small">
            {message.bodyText || "(empty)"}
          </pre>
        </div>
      )}
    </div>

    {/* <div
      className="flex flex-shrink-0 items-center justify-between gap-2 px-6 py-4"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {message.status === "pending" ? (
        <div className="flex w-full flex-wrap justify-end gap-2">
          <button onClick={onJunk} disabled={isPending} className="btn-ghost !text-xs" style={{ color: "var(--crimson)" }}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Mark as Junk
          </button>
          <button onClick={onNoAction} disabled={isPending} className="btn-secondary !text-xs">
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            No Action Required
          </button>
          <button onClick={onCreateTicket} disabled={isPending} className="btn-primary !text-xs">
            {isPending ? <Spinner className="mr-1.5 h-3.5 w-3.5" /> : <TicketIcon className="mr-1.5 h-3.5 w-3.5" />}
            Create Ticket
          </button>
        </div>
      ) : (
        <span className="text-small" style={{ color: statusMeta[message.status].color }}>
          {message.status === "ticket_created" && message.ticket ? (
            <>
              Ticket created:{" "}
              <Link to={`/tickets/${message.ticket.id}`} className="font-medium" style={{ color: "var(--coral)" }}>
                #{message.ticket.number}
              </Link>
            </>
          ) : (
            statusMeta[message.status].label
          )}
        </span>
      )}
    </div> */}
  </div>
);

const MyInboxPage = () => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["inboxMessages"],
    queryFn: () => inboxMessageApi.list(),
    refetchInterval: 30_000,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["inboxMessages"] });

  const handleRefresh = async () => {
    setIsFetching(true);
    try {
      await inboxMessageApi.fetch();
      await refetch();
    } catch {
      addToast("Failed to fetch new emails", "error");
    } finally {
      setIsFetching(false);
    }
  };

  const createTicketMutation = useMutation({
    mutationFn: (id: string) => inboxMessageApi.createTicket(id),
    onSuccess: (msg) => {
      invalidate();
      setSelectedId(msg.id);
      addToast("Ticket created successfully", "success");
    },
    onError: () => addToast("Failed to create ticket", "error"),
  });

  const noActionMutation = useMutation({
    mutationFn: (id: string) => inboxMessageApi.noAction(id),
    onSuccess: (msg) => {
      invalidate();
      setSelectedId(msg.id);
      addToast("Marked as no action required", "success");
    },
    onError: () => addToast("Failed to update", "error"),
  });

  const junkMutation = useMutation({
    mutationFn: (id: string) => inboxMessageApi.junk(id),
    onSuccess: (msg) => {
      invalidate();
      setSelectedId(msg.id);
      addToast("Marked as junk", "success");
    },
    onError: () => addToast("Failed to update", "error"),
  });

  const messages = useMemo(() => data?.data ?? [], [data]);
  const total = data?.meta.total ?? 0;
  const isMutating =
    createTicketMutation.isPending || noActionMutation.isPending || junkMutation.isPending;

  const pendingCount = useMemo(
    () => messages.filter((m) => m.status === "pending").length,
    [messages]
  );

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--coral-10)" }}
          >
            <Inbox className="h-5 w-5" style={{ color: "var(--coral)" }} />
          </div>
          <div>
            <h1 className="text-h2" style={{ color: "var(--text)" }}>
              {isAdmin ? "All Inboxes" : "My Inbox"}
            </h1>
            <p className="text-small" style={{ color: "var(--text-muted)" }}>
              {total} email{total !== 1 ? "s" : ""} · {pendingCount} awaiting action
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="btn-secondary !text-xs flex items-center gap-1.5"
        >
          {isFetching ? <Spinner className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="flex h-[75vh] min-h-[560px] items-center justify-center">
          <Spinner />
        </div>
      )}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && (
        <div className="card flex h-[75vh] min-h-[560px] flex-col overflow-hidden">
          {/* Body: list + reading pane */}
          <div className="flex flex-1 overflow-hidden">
            <div
              className={`${selected ? "hidden" : "flex"} w-full flex-col overflow-y-auto lg:flex lg:w-[380px] lg:flex-shrink-0`}
              style={{ borderRight: "1px solid var(--border)" }}
            >
              {messages.length === 0 ? (
                <div
                  className="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Mail className="h-7 w-7" />
                  <p className="text-small">
                    {isAdmin ? "No inbox messages match this view." : "Your inbox is empty."}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageRow
                    key={msg.id}
                    message={msg}
                    active={msg.id === selectedId}
                    onSelect={() => setSelectedId(msg.id)}
                    isPending={isMutating}
                    onCreateTicket={() => createTicketMutation.mutate(msg.id)}
                    onNoAction={() => noActionMutation.mutate(msg.id)}
                    onJunk={() => junkMutation.mutate(msg.id)}
                  />
                ))
              )}
            </div>

            <div className={`${selected ? "flex" : "hidden"} flex-1 flex-col lg:flex`}>
              {selected ? (
                <ReadingPane
                  message={selected}
                  onBack={() => setSelectedId(null)}
                  isPending={isMutating}
                  onCreateTicket={() => createTicketMutation.mutate(selected.id)}
                  onNoAction={() => noActionMutation.mutate(selected.id)}
                  onJunk={() => junkMutation.mutate(selected.id)}
                />
              ) : (
                <EmptyReadingPane />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInboxPage;
