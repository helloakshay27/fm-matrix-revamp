import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userApi, type CreateUserPayload } from "@/api/users";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
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
  mobile: z.string().max(30).optional(),
  password: z.string().min(8, "Min 8 characters"),
  role: z.enum(["agent", "senior_agent", "supervisor", "org_admin"]),
});
type CreateFormData = z.infer<typeof createSchema>;

const NewUserModal = ({ onClose }: { onClose: () => void }) => {
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
      addToast("User created", "success");
      onClose();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { errors?: { message?: string }[] } } })
          ?.response?.data?.errors?.[0]?.message ?? "Failed to create user";
      addToast(msg, "error");
    },
  });

  return (
    <Modal title="New User" onClose={onClose} maxWidth="max-w-md">
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
            <label className="form-label">Mobile</label>
            <input {...register("mobile")} type="tel" className="form-input" />
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
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="form-label">Password *</label>
            <input
              {...register("password")}
              type="password"
              className="form-input"
            />
            {errors.password && (
              <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
                {errors.password.message}
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
            Create User
          </button>
        </div>
      </form>
    </Modal>
  );
};

const EditUserModal = ({
  user,
  onClose,
}: {
  user: AgentUser;
  onClose: () => void;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const [role, setRole] = useState(user.role ?? "agent");
  const [mobile, setMobile] = useState(user.mobile ?? "");
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      if (password && password.length < 8)
        throw new Error("Password must be at least 8 characters");
      return userApi.update(user.id, {
        role,
        mobile: mobile || undefined,
        password: password || undefined,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      addToast("User updated", "success");
      onClose();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update user";
      addToast(msg, "error");
    },
  });

  const handleSave = () => {
    if (password && password.length < 8) {
      setPwError("Min 8 characters");
      return;
    }
    setPwError("");
    mutation.mutate();
  };

  return (
    <Modal
      title={`Edit — ${user.name || user.email}`}
      onClose={onClose}
      maxWidth="max-w-sm"
    >
      <div className="flex flex-col gap-4 px-6 py-5">
        <div>
          <label className="form-label">Mobile</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">
            New Password{" "}
            <span className="font-normal opacity-50">
              (leave blank to keep current)
            </span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPwError("");
            }}
            placeholder="••••••••"
            className="form-input"
          />
          {pwError && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {pwError}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {mutation.isPending && <Spinner className="h-4 w-4" />}
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

const UsersPage = () => {
  const [showNew, setShowNew] = useState(false);
  const [editUser, setEditUser] = useState<AgentUser | null>(null);
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const canManage = useAuthStore((s) => s.canManage);

  const {
    data: users = [],
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
      addToast("User removed", "success");
    },
    onError: () => addToast("Failed to remove user", "error"),
  });

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            Users
          </h1>
          <p
            className="mt-0.5 text-small"
            style={{ color: "var(--text-muted)" }}
          >
            {users.length} total
          </p>
        </div>
        {canManage && (
          <button onClick={() => setShowNew(true)} className="btn-primary">
            + New User
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
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-14 text-center text-small"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No users yet.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="font-medium" style={{ color: "var(--text)" }}>
                    {user.name || (
                      <span className="italic" style={{ opacity: 0.4 }}>
                        —
                      </span>
                    )}
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{user.email}</td>
                  <td style={{ color: "var(--text-muted)" }}>
                    {user.mobile || <span style={{ opacity: 0.35 }}>—</span>}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "var(--violet-10)",
                        color: "var(--violet)",
                      }}
                    >
                      {roleLabel(user.role)}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      {canManage && (
                        <button
                          onClick={() => setEditUser(user)}
                          className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                        >
                          Edit
                        </button>
                      )}
                      {canManage && (
                        <button
                          onClick={() => removeMutation.mutate(user.id)}
                          disabled={removeMutation.isPending}
                          className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                          style={{ color: "var(--crimson)" }}
                        >
                          Remove
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

      {showNew && <NewUserModal onClose={() => setShowNew(false)} />}
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} />
      )}
    </div>
  );
};

export default UsersPage;
