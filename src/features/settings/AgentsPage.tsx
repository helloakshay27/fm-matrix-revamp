import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userApi, type CreateUserPayload } from "@/api/users";
import { useNotificationStore } from "@/stores/notificationStore";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import type { AgentUser } from "@/types/schemas/ticket";

const ROLES = [
  { value: "agent", label: "Agent" },
  { value: "senior_agent", label: "Senior Agent" },
  { value: "supervisor", label: "Supervisor" },
  { value: "org_admin", label: "Org Admin" },
];

const roleLabel = (role?: string | null) =>
  ROLES.find((r) => r.value === role)?.label ?? role ?? "—";

const createSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Min 8 characters"),
  role: z.enum(["agent", "senior_agent", "supervisor", "org_admin"]),
});
type CreateFormData = z.infer<typeof createSchema>;

const inputCls =
  "w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-sidebar-text outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600";
const labelCls = "mb-1 block text-xs font-medium text-sidebar-text";

const NewAgentModal = ({ onClose }: { onClose: () => void }) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { role: "agent" },
  });

  const mutation = useMutation({
    mutationFn: (d: CreateUserPayload) => userApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      addToast("Agent created", "success");
      onClose();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { errors?: { message?: string }[] } } })
          ?.response?.data?.errors?.[0]?.message ?? "Failed to create agent";
      addToast(msg, "error");
    },
  });

  return (
    <Modal title="New Agent" onClose={onClose} maxWidth="max-w-md">
      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="flex flex-col gap-4 px-6 py-5"
      >
        <div>
          <label className={labelCls}>Name *</label>
          <input {...register("name")} className={inputCls} autoFocus />
          {errors.name && (
            <p className="mt-1 text-xs text-brand-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input {...register("email")} type="email" className={inputCls} />
          {errors.email && (
            <p className="mt-1 text-xs text-brand-600">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelCls}>Password *</label>
          <input
            {...register("password")}
            type="password"
            className={inputCls}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-brand-600">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelCls}>Role *</label>
          <select {...register("role")} className={inputCls}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" disabled={mutation.isPending} className="btn">
            {mutation.isPending && (
              <Spinner className="h-4 w-4 border-[#BF213E]/30 border-t-[#BF213E]" />
            )}
            Create Agent
          </button>
        </div>
      </form>
    </Modal>
  );
};

const EditRoleModal = ({
  agent,
  onClose,
}: {
  agent: AgentUser;
  onClose: () => void;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const [role, setRole] = useState(agent.role ?? "agent");

  const mutation = useMutation({
    mutationFn: () => userApi.update(agent.id, { role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      addToast("Role updated", "success");
      onClose();
    },
    onError: () => addToast("Failed to update role", "error"),
  });

  return (
    <Modal
      title={`Edit Role — ${agent.name || agent.email}`}
      onClose={onClose}
      maxWidth="max-w-sm"
    >
      <div className="flex flex-col gap-4 px-6 py-5">
        <div>
          <label className={labelCls}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputCls}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="btn"
          >
            {mutation.isPending && (
              <Spinner className="h-4 w-4 border-[#BF213E]/30 border-t-[#BF213E]" />
            )}
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

const AgentsPage = () => {
  const [showNew, setShowNew] = useState(false);
  const [editAgent, setEditAgent] = useState<AgentUser | null>(null);
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  const {
    data: agents = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users", "all"],
    queryFn: userApi.listAll,
  });

  const removeMutation = useMutation({
    mutationFn: userApi.destroy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      addToast("Agent removed", "success");
    },
    onError: () => addToast("Failed to remove agent", "error"),
  });

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-sidebar-text">Agents</h1>
          <p className="text-xs text-sidebar-muted">Total: {agents.length}</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn">
          + New Agent
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-card">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-surface-border bg-surface-table text-xs font-semibold uppercase tracking-wide text-sidebar-muted">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {agents.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-14 text-center text-sm text-sidebar-muted"
                  >
                    No agents yet.
                  </td>
                </tr>
              )}
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-sidebar-hover">
                  <td className="px-4 py-3 font-medium text-sidebar-text">
                    {agent.name || <span className="italic opacity-40">—</span>}
                  </td>
                  <td className="px-4 py-3 text-sidebar-muted">
                    {agent.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded px-2 py-0.5 text-xs font-medium bg-[#F2EEE9] text-[#BF213E]">
                      {roleLabel(agent.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button
                      onClick={() => setEditAgent(agent)}
                      className="btn-ghost text-xs"
                      style={{ height: "auto", padding: "0.25rem 0.5rem" }}
                    >
                      Edit Role
                    </button>
                    <button
                      onClick={() => removeMutation.mutate(agent.id)}
                      disabled={removeMutation.isPending}
                      className="btn-ghost text-xs"
                      style={{ height: "auto", padding: "0.25rem 0.5rem" }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNew && <NewAgentModal onClose={() => setShowNew(false)} />}
      {editAgent && (
        <EditRoleModal agent={editAgent} onClose={() => setEditAgent(null)} />
      )}
    </div>
  );
};

export default AgentsPage;
