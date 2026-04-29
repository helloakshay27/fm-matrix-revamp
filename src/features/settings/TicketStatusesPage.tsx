import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ticketStatusApi,
  type CreateStatusPayload,
} from "@/api/ticketStatuses";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import type { TicketStatus } from "@/types/schemas/ticket";

const STATE_TYPES = [
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
] as const;

const stateTypeDot: Record<string, string> = {
  open: "var(--forest)",
  pending: "var(--amber)",
  resolved: "var(--sky)",
  closed: "var(--stone)",
};

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  state_type: z.enum(["open", "pending", "resolved", "closed"]),
  colour: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .or(z.literal("")),
  is_default: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const StatusModal = ({
  onClose,
  existing,
}: {
  onClose: () => void;
  existing?: TicketStatus;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const isEdit = !!existing;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: existing?.name ?? "",
      state_type: existing?.stateType ?? "open",
      colour: existing?.colour ?? "",
      is_default: existing?.isDefault ?? false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (d: CreateStatusPayload) => ticketStatusApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticketStatuses"] });
      addToast("Status created", "success");
      onClose();
    },
    onError: () => addToast("Failed to create status", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (d: Partial<CreateStatusPayload>) =>
      ticketStatusApi.update(existing!.id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticketStatuses"] });
      addToast("Status updated", "success");
      onClose();
    },
    onError: () => addToast("Failed to update status", "error"),
  });

  const onSubmit = (d: FormData) => {
    const payload = { ...d, colour: d.colour || undefined };
    if (isEdit) updateMutation.mutate(payload);
    else createMutation.mutate(payload as CreateStatusPayload);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={isEdit ? `Edit — ${existing!.name}` : "New Status"}
      onClose={onClose}
      maxWidth="max-w-sm"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-6 py-5"
      >
        <div>
          <label className="form-label">Name *</label>
          <input {...register("name")} className="form-input" autoFocus />
          {errors.name && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="form-label">State Type *</label>
          <select {...register("state_type")} className="form-select">
            {STATE_TYPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="form-label">
              Colour <span className="font-normal opacity-50">(hex)</span>
            </label>
            <input
              {...register("colour")}
              placeholder="#3b82f6"
              className="form-input"
            />
            {errors.colour && (
              <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
                Must be a valid hex colour
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer pb-2.5">
              <input
                {...register("is_default")}
                type="checkbox"
                className="rounded"
              />
              <span className="form-label" style={{ margin: 0 }}>
                Set as default
              </span>
            </label>
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

const TicketStatusesPage = () => {
  const [modal, setModal] = useState<{ open: boolean; status?: TicketStatus }>({
    open: false,
  });
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const canManage = useAuthStore((s) => s.canManage);

  const {
    data: statuses = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["ticketStatuses"],
    queryFn: ticketStatusApi.listAll,
  });

  const deleteMutation = useMutation({
    mutationFn: ticketStatusApi.destroy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticketStatuses"] });
      addToast("Status deleted", "success");
    },
    onError: () => addToast("Failed to delete status", "error"),
  });

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            Ticket Statuses
          </h1>
          <p
            className="mt-0.5 text-small"
            style={{ color: "var(--text-muted)" }}
          >
            {statuses.length} total
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setModal({ open: true })}
            className="btn-primary"
          >
            + New Status
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
                <th>State Type</th>
                <th>Colour</th>
                <th>Default</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {statuses.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-14 text-center text-small"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No statuses yet.
                  </td>
                </tr>
              )}
              {statuses.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            s.colour ?? stateTypeDot[s.stateType],
                        }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td
                    className="capitalize"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.stateType}
                  </td>
                  <td>
                    {s.colour ? (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-4 w-4 rounded"
                          style={{
                            backgroundColor: s.colour,
                            border: "1px solid var(--border)",
                          }}
                        />
                        <span
                          className="font-mono text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {s.colour}
                        </span>
                      </span>
                    ) : (
                      <span style={{ opacity: 0.35 }}>—</span>
                    )}
                  </td>
                  <td>
                    {s.isDefault && (
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "var(--coral-10)",
                          color: "var(--coral)",
                        }}
                      >
                        Default
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      {canManage && (
                        <button
                          onClick={() => setModal({ open: true, status: s })}
                          className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                        >
                          Edit
                        </button>
                      )}
                      {canManage && (
                        <button
                          onClick={() => deleteMutation.mutate(s.id)}
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
        <StatusModal
          onClose={() => setModal({ open: false })}
          existing={modal.status}
        />
      )}
    </div>
  );
};

export default TicketStatusesPage;
