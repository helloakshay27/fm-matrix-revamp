import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { emailInboxApi, type EmailInbox } from "@/api/emailInboxes";
import { categoryApi } from "@/api/categories";
import { userApi } from "@/api/users";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";

const baseSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Valid email required"),
  inbox_type: z.enum(["imap", "sendgrid", "mailgun"]),
  category_id: z.string().optional(),
  assigned_user_id: z.string().optional(),
  imap_host: z.string().optional(),
  imap_port: z.coerce.number().int().positive().optional().or(z.literal("")),
  imap_username: z.string().optional(),
  imap_password: z.string().optional(),
  imap_ssl: z.boolean().optional(),
  smtp_host: z.string().optional(),
  smtp_port: z.coerce.number().int().positive().optional().or(z.literal("")),
  smtp_username: z.string().optional(),
  smtp_password: z.string().optional(),
  smtp_tls: z.boolean().optional(),
  smtp_from_name: z.string().optional(),
  allowed_domains_raw: z.string().optional(),
  blocked_senders_raw: z.string().optional(),
  spam_score_threshold: z.coerce
    .number()
    .min(0)
    .max(100)
    .optional()
    .or(z.literal("")),
});
type FormData = z.infer<typeof baseSchema>;

const splitList = (raw: string | undefined) =>
  (raw ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

const InboxModal = ({
  onClose,
  existing,
}: {
  onClose: () => void;
  existing?: EmailInbox;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const isEdit = !!existing;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoryApi.listAll,
  });
  const topCategories = categories.filter((c: any) => !c.parentId);

  const { data: agents = [] } = useQuery({
    queryKey: ["users", "all"],
    queryFn: userApi.listAll,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: existing?.name ?? "",
      email: existing?.email ?? "",
      inbox_type: existing?.inboxType ?? "imap",
      category_id: existing?.categoryId ?? "",
      assigned_user_id: existing?.assignedUserId ?? "",
      imap_host: existing?.imapHost ?? "",
      imap_port: existing?.imapPort ?? undefined,
      imap_username: existing?.imapUsername ?? "",
      imap_ssl: existing?.imapSsl ?? true,
      smtp_host: (existing as any)?.smtpHost ?? "",
      smtp_port: (existing as any)?.smtpPort ?? "",
      smtp_username: (existing as any)?.smtpUsername ?? "",
      smtp_tls: (existing as any)?.smtpTls ?? true,
      smtp_from_name: (existing as any)?.smtpFromName ?? "",
      allowed_domains_raw: (existing?.allowedDomains ?? []).join(", "),
      blocked_senders_raw: (existing?.blockedSenders ?? []).join(", "),
      spam_score_threshold: existing?.spamScoreThreshold ?? "",
    },
  });

  const inboxType = watch("inbox_type");

  const applyGmailPreset = () => {
    setValue("imap_host", "imap.gmail.com");
    setValue("imap_port", 993);
    setValue("imap_ssl", true);
    setValue("smtp_host", "smtp.gmail.com");
    setValue("smtp_port", 587);
    setValue("smtp_tls", true);
  };

  const spamPayload = (d: FormData) => ({
    allowed_domains: splitList(d.allowed_domains_raw),
    blocked_senders: splitList(d.blocked_senders_raw),
    spam_score_threshold: d.spam_score_threshold
      ? Number(d.spam_score_threshold)
      : null,
  });

  const smtpPayload = (d: FormData, isEdit: boolean) => ({
    smtp_host: d.smtp_host || undefined,
    smtp_port: d.smtp_port ? Number(d.smtp_port) : undefined,
    smtp_username: d.smtp_username || undefined,
    smtp_password: isEdit ? d.smtp_password || undefined : d.smtp_password,
    smtp_tls: d.smtp_tls,
    smtp_from_name: d.smtp_from_name || undefined,
  });

  const createMutation = useMutation({
    mutationFn: (d: FormData) =>
      emailInboxApi.create({
        name: d.name,
        email: d.email,
        inbox_type: d.inbox_type,
        category_id: d.category_id || null,
        assigned_user_id: d.assigned_user_id || null,
        ...(d.inbox_type === "imap"
          ? {
              imap_host: d.imap_host,
              imap_port: d.imap_port ? Number(d.imap_port) : undefined,
              imap_username: d.imap_username,
              imap_password: d.imap_password,
              imap_ssl: d.imap_ssl,
            }
          : {}),
        ...smtpPayload(d, false),
        ...spamPayload(d),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emailInboxes"] });
      addToast("Inbox created", "success");
      onClose();
    },
    onError: () => addToast("Failed to create inbox", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (d: FormData) =>
      emailInboxApi.update(existing!.id, {
        name: d.name,
        email: d.email,
        category_id: d.category_id || null,
        assigned_user_id: d.assigned_user_id || null,
        ...(d.inbox_type === "imap"
          ? {
              imap_host: d.imap_host,
              imap_port: d.imap_port ? Number(d.imap_port) : undefined,
              imap_username: d.imap_username,
              imap_password: d.imap_password || undefined,
              imap_ssl: d.imap_ssl,
            }
          : {}),
        ...smtpPayload(d, true),
        ...spamPayload(d),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emailInboxes"] });
      addToast("Inbox updated", "success");
      onClose();
    },
    onError: () => addToast("Failed to update inbox", "error"),
  });

  const onSubmit = (d: FormData) => {
    if (isEdit) updateMutation.mutate(d);
    else createMutation.mutate(d);
  };
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={isEdit ? `Edit — ${existing!.name}` : "New Email Inbox"}
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-6 py-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Name *</label>
            <input
              {...register("name")}
              className="form-input"
              autoFocus
              placeholder="Support Inbox"
            />
            {errors.name && (
              <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="form-label">Email Address *</label>
            <input
              {...register("email")}
              className="form-input"
              placeholder="support@company.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {!isEdit && (
          <div>
            <label className="form-label">Inbox Type *</label>
            <select {...register("inbox_type")} className="form-select">
              <option value="imap">IMAP (poll mailbox)</option>
              <option value="sendgrid">SendGrid Inbound Parse</option>
              <option value="mailgun">Mailgun Inbound</option>
            </select>
          </div>
        )}

        <div>
          <label className="form-label">
            Linked Category{" "}
            <span className="font-normal opacity-60">(optional)</span>
          </label>
          <select {...register("category_id")} className="form-select">
            <option value="">— None —</option>
            {topCategories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            Incoming emails will be tagged with this category and auto-assigned
            to its default agent.
          </p>
        </div>

        <div>
          <label className="form-label">
            Assigned User{" "}
            <span className="font-normal opacity-60">
              (optional — enables My Inbox staging)
            </span>
          </label>
          <select {...register("assigned_user_id")} className="form-select">
            <option value="">— None (auto-create tickets) —</option>
            {(agents as any[]).map((a) => (
              <option key={a.id} value={a.id}>
                {a.name || a.email}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            If set, incoming emails are staged in that user's My Inbox instead
            of creating tickets directly.
          </p>
        </div>

        {inboxType === "imap" && (
          <>
            {!isEdit && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={applyGmailPreset}
                  className="btn-secondary !text-xs"
                >
                  Use Gmail / Google Workspace
                </button>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Auto-fills Gmail IMAP &amp; SMTP settings
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">IMAP Host *</label>
                <input
                  {...register("imap_host")}
                  className="form-input"
                  placeholder="imap.gmail.com"
                />
              </div>
              <div>
                <label className="form-label">Port</label>
                <input
                  {...register("imap_port")}
                  type="number"
                  className="form-input"
                  placeholder="993"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Username / Email *</label>
                <input
                  {...register("imap_username")}
                  className="form-input"
                  placeholder="support@company.com"
                />
              </div>
              <div>
                <label className="form-label">
                  Password{" "}
                  {isEdit && (
                    <span className="font-normal opacity-50">
                      (leave blank to keep)
                    </span>
                  )}
                </label>
                <input
                  {...register("imap_password")}
                  type="password"
                  className="form-input"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register("imap_ssl")}
                type="checkbox"
                className="rounded"
                defaultChecked
              />
              <span className="form-label" style={{ margin: 0 }}>
                Use SSL/TLS
              </span>
            </label>
            <p
              className="text-xs rounded-lg px-3 py-2"
              style={{
                backgroundColor: "var(--sky-10)",
                color: "var(--text-muted)",
              }}
            >
              <strong>Gmail / Google Workspace:</strong> use an{" "}
              <strong>App Password</strong> (not your account password).
              Generate one at myaccount.google.com → Security → App Passwords.
              Enable IMAP first under Gmail Settings → Forwarding and POP/IMAP.
            </p>
          </>
        )}

        {/* SMTP settings — for sending replies FROM this inbox & appending to Sent folder */}
        <div className="pt-2" style={{ borderTop: "1px solid var(--border)" }}>
          <p
            className="mb-3 text-label uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Outgoing (SMTP) —{" "}
            <span className="normal-case font-normal">
              for sending replies from this address
            </span>
          </p>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">SMTP Host</label>
                <input
                  {...register("smtp_host")}
                  className="form-input"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="form-label">Port</label>
                <input
                  {...register("smtp_port")}
                  type="number"
                  className="form-input"
                  placeholder="587"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Username / Email</label>
                <input
                  {...register("smtp_username")}
                  className="form-input"
                  placeholder="support@company.com"
                />
              </div>
              <div>
                <label className="form-label">
                  Password{" "}
                  {isEdit && (
                    <span className="font-normal opacity-50">
                      (leave blank to keep)
                    </span>
                  )}
                </label>
                <input
                  {...register("smtp_password")}
                  type="password"
                  className="form-input"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">From Name</label>
                <input
                  {...register("smtp_from_name")}
                  className="form-input"
                  placeholder="Support Team"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("smtp_tls")}
                    type="checkbox"
                    className="rounded"
                    defaultChecked
                  />
                  <span className="form-label" style={{ margin: 0 }}>
                    Use STARTTLS
                  </span>
                </label>
              </div>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              When configured, replies are sent via this SMTP server and a copy
              is automatically placed in the Sent folder of the IMAP inbox.
            </p>
          </div>
        </div>

        {(inboxType === "sendgrid" || inboxType === "mailgun") && !isEdit && (
          <div
            className="rounded-lg p-3 text-xs"
            style={{
              backgroundColor: "var(--sky-10)",
              color: "var(--text-muted)",
            }}
          >
            After creating, you'll receive a webhook URL to configure in your{" "}
            {inboxType === "sendgrid" ? "SendGrid Inbound Parse" : "Mailgun"}{" "}
            settings.
          </div>
        )}

        {/* Spam filtering */}
        <div className="pt-2" style={{ borderTop: "1px solid var(--border)" }}>
          <p
            className="mb-3 text-label uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Spam Filtering
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="form-label">
                Allowed Domains{" "}
                <span className="font-normal opacity-60">
                  (comma-separated — blank = accept all)
                </span>
              </label>
              <input
                {...register("allowed_domains_raw")}
                className="form-input"
                placeholder="lockated.com, partner.com"
              />
            </div>
            <div>
              <label className="form-label">
                Blocked Senders{" "}
                <span className="font-normal opacity-60">
                  (emails or @domains, comma-separated)
                </span>
              </label>
              <input
                {...register("blocked_senders_raw")}
                className="form-input"
                placeholder="noreply@spam.com, @spamsite.com"
              />
            </div>
            <div>
              <label className="form-label">
                Spam Score Threshold{" "}
                <span className="font-normal opacity-60">
                  (X-Spam-Score — blank = 5.0)
                </span>
              </label>
              <input
                {...register("spam_score_threshold")}
                type="number"
                step="0.1"
                min="0"
                max="100"
                className="form-input"
                placeholder="5.0"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary flex items-center gap-2"
          >
            {isPending && <Spinner className="h-4 w-4" />}
            {isEdit ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const WebhookUrlCard = ({ inbox }: { inbox: EmailInbox }) => {
  const base = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") ?? "";
  const provider = inbox.inboxType === "sendgrid" ? "sendgrid" : "mailgun";
  const url = `${base}/webhooks/email/${provider}/${inbox.webhookToken}`;
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className="truncate font-mono text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        {url}
      </span>
      <button
        onClick={copy}
        className="btn-ghost !h-auto !py-1 !px-2 text-xs shrink-0"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

const EmailInboxesPage = () => {
  const [modal, setModal] = useState<{ open: boolean; inbox?: EmailInbox }>({
    open: false,
  });
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const canManage = useAuthStore((s) => s.canManage);

  const {
    data: inboxes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["emailInboxes"],
    queryFn: emailInboxApi.listAll,
  });

  const deleteMutation = useMutation({
    mutationFn: emailInboxApi.destroy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emailInboxes"] });
      addToast("Inbox deleted", "success");
    },
    onError: () => addToast("Failed to delete inbox", "error"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      emailInboxApi.update(id, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emailInboxes"] }),
    onError: () => addToast("Failed to update inbox", "error"),
  });

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            Email Inboxes
          </h1>
          <p
            className="mt-0.5 text-small"
            style={{ color: "var(--text-muted)" }}
          >
            Connect email accounts to auto-create tickets from incoming email
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setModal({ open: true })}
            className="btn-primary"
          >
            + New Inbox
          </button>
        )}
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
                <th>Name</th>
                <th>Email Address</th>
                <th>Type</th>
                <th>Category</th>
                <th>Assigned User</th>
                <th>Webhook / Status</th>
                <th>Last Polled</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inboxes.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-14 text-center text-small"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No email inboxes yet.
                  </td>
                </tr>
              )}
              {inboxes.map((inbox) => (
                <tr key={inbox.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: inbox.active
                            ? "var(--forest)"
                            : "var(--stone)",
                        }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        {inbox.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{inbox.email}</td>
                  <td>
                    <span
                      className="badge capitalize"
                      style={{
                        backgroundColor: "var(--violet-10)",
                        color: "var(--violet)",
                      }}
                    >
                      {inbox.inboxType}
                    </span>
                  </td>
                  <td
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {inbox.category?.name ?? (
                      <span style={{ opacity: 0.35 }}>—</span>
                    )}
                  </td>
                  <td
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {inbox.assignedUser ? (
                      <span
                        className="font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        {inbox.assignedUser.name || inbox.assignedUser.email}
                      </span>
                    ) : (
                      <span style={{ opacity: 0.35 }}>—</span>
                    )}
                  </td>
                  <td>
                    {inbox.inboxType === "imap" ? (
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        IMAP polling
                      </span>
                    ) : inbox.webhookToken ? (
                      <WebhookUrlCard inbox={inbox} />
                    ) : (
                      <span className="text-xs" style={{ opacity: 0.35 }}>
                        —
                      </span>
                    )}
                  </td>
                  <td
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {inbox.lastPolledAt ? (
                      new Date(inbox.lastPolledAt).toLocaleString()
                    ) : (
                      <span style={{ opacity: 0.35 }}>Never</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      {canManage && (
                        <button
                          onClick={() =>
                            toggleMutation.mutate({
                              id: inbox.id,
                              active: !inbox.active,
                            })
                          }
                          className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                        >
                          {inbox.active ? "Disable" : "Enable"}
                        </button>
                      )}
                      {canManage && (
                        <button
                          onClick={() => setModal({ open: true, inbox })}
                          className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                        >
                          Edit
                        </button>
                      )}
                      {canManage && (
                        <button
                          onClick={() => deleteMutation.mutate(inbox.id)}
                          disabled={deleteMutation.isPending}
                          className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                          style={{ color: "var(--crimson)" }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <InboxModal
          onClose={() => setModal({ open: false })}
          existing={modal.inbox}
        />
      )}
    </div>
  );
};

export default EmailInboxesPage;
