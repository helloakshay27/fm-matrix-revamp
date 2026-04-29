import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "@/api/accounts";
import type { Account, AccountPayload } from "@/api/accounts";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";

/* ── Domain tag input ──────────────────────────────────────────── */
const DomainInput = ({
  domains,
  onChange,
}: {
  domains: string[];
  onChange: (domains: string[]) => void;
}) => {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim().toLowerCase().replace(/^@/, "");
    if (val && !domains.includes(val)) onChange([...domains, val]);
    setInput("");
  };

  const remove = (d: string) => onChange(domains.filter((x) => x !== d));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
        {domains.map((d) => (
          <span
            key={d}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: "var(--sky-10)", color: "var(--sky)" }}
          >
            @{d}
            <button
              type="button"
              onClick={() => remove(d)}
              className="ml-0.5 hover:opacity-70 leading-none"
              style={{ fontSize: "0.75rem" }}
            >
              ×
            </button>
          </span>
        ))}
        {domains.length === 0 && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            No domains added yet
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="e.g. acme.com"
          className="form-input flex-1"
        />
        <button
          type="button"
          onClick={add}
          className="btn-secondary !px-3 !text-xs"
        >
          Add
        </button>
      </div>
      <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
        Press Enter or click Add. Emails from these domains will auto-link to
        this account.
      </p>
    </div>
  );
};

/* ── Modal ─────────────────────────────────────────────────────── */
const AccountModal = ({
  existing,
  onClose,
}: {
  existing?: Account;
  onClose: () => void;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [website, setWebsite] = useState(existing?.website ?? "");
  const [domains, setDomains] = useState<string[]>(existing?.domains ?? []);

  const mutation = useMutation({
    mutationFn: (payload: AccountPayload) =>
      existing
        ? accountsApi.update(existing.id, payload)
        : accountsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
      addToast(existing ? "Account updated" : "Account created", "success");
      onClose();
    },
    onError: () => addToast("Failed to save account", "error"),
  });

  const handleSubmit = () => {
    if (!name.trim()) return;
    mutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      website: website.trim() || undefined,
      domains,
    });
  };

  return (
    <Modal title={existing ? "Edit Account" : "New Account"} onClose={onClose}>
      <div className="flex flex-col gap-4 px-6 py-5">
        <div>
          <label className="form-label">Account Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="e.g. Acme Corp"
            autoFocus
          />
        </div>
        <div>
          <label className="form-label">Website</label>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="form-input"
            placeholder="https://acme.com"
          />
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="form-textarea"
            placeholder="Optional notes about this account…"
          />
        </div>
        <div>
          <label className="form-label">Email Domains</label>
          <DomainInput domains={domains} onChange={setDomains} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || mutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {mutation.isPending && <Spinner className="h-4 w-4" />}
            {existing ? "Save Changes" : "Create Account"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* ── Page ──────────────────────────────────────────────────────── */
const AccountsPage = () => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const canManage = useAuthStore((s) => s.canManage);

  const [modal, setModal] = useState<"create" | Account | null>(null);
  const [search, setSearch] = useState("");

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: accountsApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
      addToast("Account deleted", "success");
    },
    onError: () => addToast("Failed to delete account", "error"),
  });

  const filtered = accounts.filter(
    (a: Account) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.domains.some((d) => d.includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            Accounts
          </h1>
          <p className="mt-1 text-small" style={{ color: "var(--text-muted)" }}>
            Companies or organisations your clients belong to. Clients are
            auto-linked based on email domain.
          </p>
        </div>
        {canManage && (
          <button onClick={() => setModal("create")} className="btn-primary">
            + New Account
          </button>
        )}
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or domain…"
          className="form-input max-w-xs"
        />
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <p
            className="py-12 text-center text-small"
            style={{ color: "var(--text-muted)" }}
          >
            {search
              ? "No accounts match your search."
              : "No accounts yet. Create one to get started."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th
                  className="px-4 py-3 text-left text-label uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Account
                </th>
                <th
                  className="px-4 py-3 text-left text-label uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Email Domains
                </th>
                <th
                  className="px-4 py-3 text-left text-label uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Clients
                </th>
                {canManage && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody>
              {filtered.map((account: Account) => (
                <tr
                  key={account.id}
                  className="transition-colors hover:bg-[var(--stone-10)]"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td className="px-4 py-3">
                    <p
                      className="font-medium text-small"
                      style={{ color: "var(--text)" }}
                    >
                      {account.name}
                    </p>
                    {account.website && (
                      <p
                        className="text-xs truncate max-w-[200px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {account.website}
                      </p>
                    )}
                    {account.description && (
                      <p
                        className="text-xs mt-0.5 truncate max-w-[200px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {account.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {account.domains.length === 0 ? (
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          —
                        </span>
                      ) : (
                        account.domains.map((d) => (
                          <span
                            key={d}
                            className="rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: "var(--sky-10)",
                              color: "var(--sky)",
                            }}
                          >
                            @{d}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 text-small"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {account.customerCount ?? 0}
                  </td>
                  {canManage && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal(account)}
                          className="btn-ghost !text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Delete account "${account.name}"? Linked clients will become unlinked.`
                              )
                            ) {
                              deleteMutation.mutate(account.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="btn-ghost !text-xs"
                          style={{ color: "var(--crimson)" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
        {accounts.length} account{accounts.length !== 1 ? "s" : ""} total
      </p>

      {modal !== null && (
        <AccountModal
          existing={modal === "create" ? undefined : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default AccountsPage;
