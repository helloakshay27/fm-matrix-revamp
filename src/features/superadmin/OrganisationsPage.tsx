import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  organisationApi,
  type Organisation,
  type OrgMember,
} from "@/api/organisations";
import { useNotificationStore } from "@/stores/notificationStore";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";

/* ── Plan tier options ──────────────────────────────────────────── */
const PLAN_TIERS = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

const ROLES = [
  { value: "platform_admin", label: "Platform Admin" },
  { value: "org_admin", label: "Org Admin" },
  { value: "supervisor", label: "Supervisor" },
  { value: "senior_agent", label: "Senior Agent" },
  { value: "agent", label: "Agent" },
];

/* ── Create/Edit Org modal ──────────────────────────────────────── */
const orgSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
  plan_tier: z.string().optional(),
});
type OrgForm = z.infer<typeof orgSchema>;

const OrgModal = ({
  existing,
  onClose,
}: {
  existing?: Organisation;
  onClose: () => void;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const isEdit = !!existing;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrgForm>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: existing?.name ?? "",
      slug: existing?.slug ?? "",
      plan_tier: existing?.planTier ?? "starter",
    },
  });

  const createMutation = useMutation({
    mutationFn: organisationApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["superadmin", "orgs"] });
      addToast("Organisation created", "success");
      onClose();
    },
    onError: () => addToast("Failed to create organisation", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (d: OrgForm) => organisationApi.update(existing!.id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["superadmin", "orgs"] });
      addToast("Organisation updated", "success");
      onClose();
    },
    onError: () => addToast("Failed to update organisation", "error"),
  });

  const onSubmit = (d: OrgForm) =>
    isEdit ? updateMutation.mutate(d) : createMutation.mutate(d);
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={isEdit ? `Edit — ${existing!.name}` : "New Organisation"}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-6 py-5"
      >
        <div>
          <label className="form-label">Organisation Name *</label>
          <input
            {...register("name")}
            className="form-input"
            autoFocus
            placeholder="Acme Corp"
          />
          {errors.name && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="form-label">
            Slug *{" "}
            <span className="font-normal opacity-60">
              (used in URLs, e.g. acme-corp)
            </span>
          </label>
          <input
            {...register("slug")}
            className="form-input"
            placeholder="acme-corp"
            disabled={isEdit}
          />
          {errors.slug && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.slug.message}
            </p>
          )}
        </div>
        <div>
          <label className="form-label">Plan Tier</label>
          <select {...register("plan_tier")} className="form-select">
            {PLAN_TIERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
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

/* ── Add member modal ───────────────────────────────────────────── */
const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  role: z.string().min(1),
  password: z.string().min(8, "Min 8 characters").optional().or(z.literal("")),
});
type MemberForm = z.infer<typeof memberSchema>;

const AddMemberModal = ({
  org,
  onClose,
}: {
  org: Organisation;
  onClose: () => void;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema),
    defaultValues: { role: "org_admin" },
  });

  const mutation = useMutation({
    mutationFn: (d: MemberForm) =>
      organisationApi.addMember(org.id, {
        email: d.email,
        name: d.name,
        role: d.role,
        password: d.password || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["superadmin", "orgs", org.id, "members"],
      });
      qc.invalidateQueries({ queryKey: ["superadmin", "orgs"] });
      addToast("Member added", "success");
      onClose();
    },
    onError: () => addToast("Failed to add member", "error"),
  });

  return (
    <Modal
      title={`Add Member to ${org.name}`}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="flex flex-col gap-4 px-6 py-5"
      >
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="form-label">Name *</label>
            <input {...register("name")} className="form-input" autoFocus />
            {errors.name && (
              <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="form-label">Role *</label>
            <select {...register("role")} className="form-select">
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="form-label">Email *</label>
          <input {...register("email")} type="email" className="form-input" />
          {errors.email && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className="form-label">
            Password{" "}
            <span className="font-normal opacity-60">
              (for new users — leave blank to auto-generate)
            </span>
          </label>
          <input
            {...register("password")}
            type="password"
            className="form-input"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.password.message}
            </p>
          )}
        </div>
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
            Add Member
          </button>
        </div>
      </form>
    </Modal>
  );
};

/* ── Members panel ──────────────────────────────────────────────── */
const roleBadgeStyle = (role: string): React.CSSProperties => {
  switch (role) {
    case "platform_admin":
      return { backgroundColor: "var(--crimson-10)", color: "var(--crimson)" };
    case "org_admin":
      return { backgroundColor: "var(--violet-10)", color: "var(--violet)" };
    case "supervisor":
      return { backgroundColor: "var(--amber-10)", color: "var(--amber)" };
    default:
      return { backgroundColor: "var(--stone-10)", color: "var(--stone)" };
  }
};

const roleLabel = (role: string) =>
  ROLES.find((r) => r.value === role)?.label ?? role;

const MembersPanel = ({
  org,
  onAddMember,
}: {
  org: Organisation;
  onAddMember: () => void;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["superadmin", "orgs", org.id, "members"],
    queryFn: () => organisationApi.listMembers(org.id),
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) =>
      organisationApi.removeMember(org.id, memberId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["superadmin", "orgs", org.id, "members"],
      });
      qc.invalidateQueries({ queryKey: ["superadmin", "orgs"] });
      addToast("Member removed", "success");
    },
    onError: () => addToast("Failed to remove member", "error"),
  });

  return (
    <div>
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <h3
          className="text-small font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          Members ({isLoading ? "…" : members.length})
        </h3>
        <button onClick={onAddMember} className="btn !h-7 !px-2 !text-xs">
          + Add Member
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}

      {!isLoading && members.length === 0 && (
        <p
          className="py-6 text-center text-small"
          style={{ color: "var(--text-muted)" }}
        >
          No members yet.
        </p>
      )}

      {members.map((m: OrgMember) => (
        <div
          key={m.id}
          className="flex items-center gap-3 px-5 py-2.5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex-1 min-w-0">
            <p
              className="text-small font-medium truncate"
              style={{ color: "var(--text)" }}
            >
              {m.user.name || m.user.email}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "var(--text-muted)" }}
            >
              {m.user.email}
            </p>
          </div>
          <span className="badge" style={roleBadgeStyle(m.role)}>
            {roleLabel(m.role)}
          </span>
          <button
            onClick={() => removeMutation.mutate(m.id)}
            disabled={removeMutation.isPending}
            className="btn-ghost !h-auto !py-1 !px-2 text-xs"
            style={{ color: "var(--crimson)" }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

/* ── Org row ─────────────────────────────────────────────────────── */
const OrgRow = ({
  org,
  onEdit,
  onDelete,
}: {
  org: Organisation;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [addMember, setAddMember] = useState(false);

  return (
    <>
      <tr>
        <td>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1.5 font-medium transition-colors"
            style={{
              color: "var(--text)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              className="text-xs"
              style={{
                color: "var(--text-muted)",
                transform: expanded ? "rotate(90deg)" : "none",
                display: "inline-block",
                transition: "transform 0.15s",
              }}
            >
              ▶
            </span>
            {org.name}
          </button>
        </td>
        <td style={{ color: "var(--text-muted)" }}>
          <span className="font-mono text-xs">{org.slug}</span>
        </td>
        <td>
          <span
            className="badge"
            style={{
              backgroundColor: "var(--forest-10)",
              color: "var(--forest)",
            }}
          >
            {org.planTier}
          </span>
        </td>
        <td style={{ color: "var(--text-muted)" }}>{org.memberCount ?? "—"}</td>
        <td style={{ color: "var(--text-muted)" }}>
          {new Date(org.createdAt).toLocaleDateString()}
        </td>
        <td className="text-right">
          <div className="flex justify-end gap-1">
            <button
              onClick={onEdit}
              className="btn-ghost !h-auto !py-1 !px-2 text-xs"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="btn-ghost !h-auto !py-1 !px-2 text-xs"
              style={{ color: "var(--crimson)" }}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={6} style={{ padding: 0 }}>
            <div
              className="mx-4 mb-3 rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
              <MembersPanel org={org} onAddMember={() => setAddMember(true)} />
            </div>
          </td>
        </tr>
      )}

      {addMember && (
        <AddMemberModal org={org} onClose={() => setAddMember(false)} />
      )}
    </>
  );
};

/* ── Main page ──────────────────────────────────────────────────── */
const OrganisationsPage = () => {
  const [modal, setModal] = useState<{ open: boolean; org?: Organisation }>({
    open: false,
  });
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  const {
    data: orgs = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["superadmin", "orgs"],
    queryFn: organisationApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: organisationApi.destroy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["superadmin", "orgs"] });
      addToast("Organisation deleted", "success");
    },
    onError: () => addToast("Failed to delete organisation", "error"),
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-2 flex items-center gap-2">
        <span
          className="badge"
          style={{
            backgroundColor: "var(--crimson-10)",
            color: "var(--crimson)",
          }}
        >
          Platform Admin
        </span>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            Organisations
          </h1>
          <p
            className="mt-0.5 text-small"
            style={{ color: "var(--text-muted)" }}
          >
            {orgs.length} organisation{orgs.length !== 1 ? "s" : ""} on this
            platform
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="btn-primary"
        >
          + New Organisation
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
                <th>Name</th>
                <th>Slug</th>
                <th>Plan</th>
                <th>Members</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orgs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-14 text-center text-small"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No organisations yet. Create the first one to get started.
                  </td>
                </tr>
              )}
              {orgs.map((org) => (
                <OrgRow
                  key={org.id}
                  org={org}
                  onEdit={() => setModal({ open: true, org })}
                  onDelete={() => {
                    if (
                      confirm(`Delete "${org.name}"? This cannot be undone.`)
                    ) {
                      deleteMutation.mutate(org.id);
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <OrgModal
          existing={modal.org}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  );
};

export default OrganisationsPage;
