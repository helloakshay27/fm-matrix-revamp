import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { inboxMessageApi, type InboxMessage } from "@/api/inboxMessages";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import Modal from "@/components/common/Modal";

const statusColors: Record<string, string> = {
  pending: "var(--amber)",
  ticket_created: "var(--forest)",
  no_action: "var(--stone)",
  junk: "var(--crimson)",
};

const PreviewModal = ({
  message,
  onClose,
  onCreateTicket,
  onNoAction,
  onJunk,
  isPending,
}: {
  message: InboxMessage;
  onClose: () => void;
  onCreateTicket: () => void;
  onNoAction: () => void;
  onJunk: () => void;
  isPending: boolean;
}) => (
  <Modal
    title={message.subject ?? "(No subject)"}
    onClose={onClose}
    maxWidth="max-w-2xl"
  >
    <div className="flex flex-col gap-4 px-6 py-5">
      {/* From / date */}
      <div
        className="flex items-center justify-between text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        <span>
          From:{" "}
          <span className="font-medium" style={{ color: "var(--text)" }}>
            {message.fromName
              ? `${message.fromName} <${message.fromEmail}>`
              : message.fromEmail}
          </span>
          {message.accountName && (
            <span
              className="ml-2 font-medium"
              style={{ color: "var(--violet)" }}
            >
              · {message.accountName}
            </span>
          )}
        </span>
        {message.receivedAt && (
          <span>{new Date(message.receivedAt).toLocaleString()}</span>
        )}
      </div>

      {/* Body */}
      <div
        className="rounded-lg p-4 text-sm overflow-auto max-h-80"
        style={{
          backgroundColor: "var(--bg)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
      >
        {message.bodyHtml ? (
          <div dangerouslySetInnerHTML={{ __html: message.bodyHtml }} />
        ) : (
          <pre className="whitespace-pre-wrap font-body">
            {message.bodyText ?? "(empty)"}
          </pre>
        )}
      </div>

      {/* Actions */}
      {message.status === "pending" ? (
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <button
            onClick={onJunk}
            disabled={isPending}
            className="btn-ghost !text-xs"
            style={{ color: "var(--crimson)" }}
          >
            Mark as Junk
          </button>
          <button
            onClick={onNoAction}
            disabled={isPending}
            className="btn-secondary !text-xs"
          >
            No Action Required
          </button>
          <button
            onClick={onCreateTicket}
            disabled={isPending}
            className="btn-primary !text-xs flex items-center gap-2"
          >
            {isPending && <Spinner className="h-3.5 w-3.5" />}
            Create Ticket
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-1">
          <span
            className="text-xs font-medium capitalize"
            style={{ color: statusColors[message.status] }}
          >
            {message.status === "ticket_created" && message.ticket ? (
              <>
                Ticket created:{" "}
                <Link
                  to={`/tickets/${message.ticket.id}`}
                  style={{ color: "var(--coral)" }}
                  onClick={onClose}
                >
                  #{message.ticket.number}
                </Link>
              </>
            ) : (
              message.status.replace("_", " ")
            )}
          </span>
          <button onClick={onClose} className="btn-ghost !text-xs">
            Close
          </button>
        </div>
      )}
    </div>
  </Modal>
);

const MyInboxPage = () => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const [preview, setPreview] = useState<InboxMessage | null>(null);

  const [isFetching, setIsFetching] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["inboxMessages"],
    queryFn: () => inboxMessageApi.list(),
    refetchInterval: 30_000,
  });

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["inboxMessages"] });

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
      setPreview(msg);
      addToast("Ticket created successfully", "success");
    },
    onError: () => addToast("Failed to create ticket", "error"),
  });

  const noActionMutation = useMutation({
    mutationFn: (id: string) => inboxMessageApi.noAction(id),
    onSuccess: () => {
      invalidate();
      setPreview(null);
      addToast("Marked as no action required", "success");
    },
    onError: () => addToast("Failed to update", "error"),
  });

  const junkMutation = useMutation({
    mutationFn: (id: string) => inboxMessageApi.junk(id),
    onSuccess: () => {
      invalidate();
      setPreview(null);
      addToast("Marked as junk", "success");
    },
    onError: () => addToast("Failed to update", "error"),
  });

  const messages = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const isPending =
    createTicketMutation.isPending ||
    noActionMutation.isPending ||
    junkMutation.isPending;

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            {isAdmin ? "All Inboxes" : "My Inbox"}
          </h1>
          <p
            className="mt-0.5 text-small"
            style={{ color: "var(--text-muted)" }}
          >
            {total} pending email{total !== 1 ? "s" : ""} awaiting action
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="btn-secondary !text-xs flex items-center gap-1.5"
        >
          {isFetching && <Spinner className="h-3.5 w-3.5" />}
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Inbox</th>
                <th>Received</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-14 text-center text-small"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {isAdmin
                      ? "No pending inbox messages."
                      : "Your inbox is empty."}
                  </td>
                </tr>
              )}
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  className="cursor-pointer"
                  onClick={() => setPreview(msg)}
                >
                  <td>
                    <div>
                      <p
                        className="font-medium text-small"
                        style={{ color: "var(--text)" }}
                      >
                        {msg.fromName || msg.fromEmail}
                      </p>
                      {msg.fromName && (
                        <p
                          className="text-[11px]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {msg.fromEmail}
                        </p>
                      )}
                      {msg.accountName && (
                        <p
                          className="text-[11px] mt-0.5 font-medium"
                          style={{ color: "var(--violet)" }}
                        >
                          {msg.accountName}
                        </p>
                      )}
                    </div>
                  </td>
                  <td
                    className="font-medium text-small"
                    style={{ color: "var(--text)" }}
                  >
                    {msg.subject ?? (
                      <span style={{ opacity: 0.4 }}>(No subject)</span>
                    )}
                  </td>
                  <td
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {msg.emailInboxId}
                  </td>
                  <td
                    className="text-xs whitespace-nowrap"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {msg.receivedAt ? (
                      new Date(msg.receivedAt).toLocaleString()
                    ) : (
                      <span style={{ opacity: 0.4 }}>—</span>
                    )}
                  </td>
                  <td>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                      style={{
                        backgroundColor: `${statusColors[msg.status]}18`,
                        color: statusColors[msg.status],
                      }}
                    >
                      {msg.status.replace("_", " ")}
                    </span>
                  </td>
                  <td
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {msg.status === "pending" && (
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => junkMutation.mutate(msg.id)}
                          disabled={isPending}
                          className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                          style={{ color: "var(--crimson)" }}
                        >
                          Junk
                        </button>
                        <button
                          onClick={() => noActionMutation.mutate(msg.id)}
                          disabled={isPending}
                          className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                        >
                          No Action
                        </button>
                        <button
                          onClick={() => createTicketMutation.mutate(msg.id)}
                          disabled={isPending}
                          className="btn-primary !h-auto !py-1 !px-2 text-xs flex items-center gap-1"
                        >
                          {createTicketMutation.isPending && (
                            <Spinner className="h-3 w-3" />
                          )}
                          Create Ticket
                        </button>
                      </div>
                    )}
                    {msg.status !== "pending" &&
                      msg.status === "ticket_created" &&
                      msg.ticket && (
                        <Link
                          to={`/tickets/${msg.ticket.id}`}
                          className="text-xs font-medium"
                          style={{ color: "var(--coral)" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          #{msg.ticket.number}
                        </Link>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {preview && (
        <PreviewModal
          message={preview}
          onClose={() => setPreview(null)}
          onCreateTicket={() => createTicketMutation.mutate(preview.id)}
          onNoAction={() => noActionMutation.mutate(preview.id)}
          onJunk={() => junkMutation.mutate(preview.id)}
          isPending={isPending}
        />
      )}
    </div>
  );
};

export default MyInboxPage;
