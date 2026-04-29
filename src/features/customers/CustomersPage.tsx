import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { customerApi, type CreateCustomerPayload } from "@/api/customers";
import { accountsApi } from "@/api/accounts";
import { useNotificationStore } from "@/stores/notificationStore";
import type { Customer } from "@/types/schemas/ticket";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  account_id: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const CustomerModal = ({
  onClose,
  existing,
}: {
  onClose: () => void;
  existing?: Customer;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const isEdit = !!existing;

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: accountsApi.list,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: existing?.name ?? "",
      email: existing?.email ?? "",
      phone: existing?.phone ?? "",
      account_id: existing?.accountId ?? "",
      notes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (d: CreateCustomerPayload) => customerApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      addToast("Client created", "success");
      onClose();
    },
    onError: () => addToast("Failed to create client", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (d: Partial<CreateCustomerPayload>) =>
      customerApi.update(existing!.id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      addToast("Client updated", "success");
      onClose();
    },
    onError: () => addToast("Failed to update client", "error"),
  });

  const onSubmit = (d: FormData) => {
    const payload = { ...d, account_id: d.account_id || undefined };
    if (isEdit) updateMutation.mutate(payload);
    else createMutation.mutate(payload as CreateCustomerPayload);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={isEdit ? `Edit — ${existing!.name}` : "New Client"}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-6 py-5"
      >
        <div className="grid grid-cols-2 gap-4">
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
            <label className="form-label">Email *</label>
            <input {...register("email")} type="email" className="form-input" />
            {errors.email && (
              <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Phone</label>
            <input
              {...register("phone")}
              className="form-input"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="form-label">Account</label>
            <select {...register("account_id")} className="form-select">
              <option value="">— None —</option>
              {(accounts as any[]).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Notes</label>
          <textarea
            {...register("notes")}
            rows={2}
            className="form-textarea"
            placeholder="Any additional notes…"
          />
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
            {isEdit ? "Save Changes" : "Create Client"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const CustomersPage = () => {
  const [modal, setModal] = useState<{ open: boolean; customer?: Customer }>({
    open: false,
  });
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["customers", { page }],
    queryFn: () => customerApi.list({ page }),
    placeholderData: (prev) => prev,
  });

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            Clients
          </h1>
          {data && (
            <p
              className="mt-0.5 text-small"
              style={{ color: "var(--text-muted)" }}
            >
              {data.meta.total} total
            </p>
          )}
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="btn-primary"
        >
          + New Client
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {isError && <ErrorState onRetry={refetch} />}

      {data && (
        <>
          <div
            className={`card overflow-hidden transition-opacity duration-150 ${isFetching ? "opacity-60" : ""}`}
          >
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Account</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-14 text-center text-small"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No clients yet.
                    </td>
                  </tr>
                )}
                {data.data.map((c) => (
                  <tr key={c.id}>
                    <td
                      className="font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {c.name}
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{c.email}</td>
                    <td style={{ color: "var(--text-muted)" }}>
                      {c.phone ?? <span style={{ opacity: 0.35 }}>—</span>}
                    </td>
                    <td>
                      {c.account?.name ? (
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: "var(--violet-10)",
                            color: "var(--violet)",
                          }}
                        >
                          {c.account.name}
                        </span>
                      ) : (
                        <span
                          style={{ opacity: 0.35, color: "var(--text-muted)" }}
                        >
                          —
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setModal({ open: true, customer: c })}
                        className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.meta.totalPages > 1 && (
            <div
              className="mt-4 flex items-center justify-between text-small"
              style={{ color: "var(--text-muted)" }}
            >
              <span>
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.meta.totalPages}
                  className="btn"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {modal.open && (
        <CustomerModal
          onClose={() => setModal({ open: false })}
          existing={modal.customer}
        />
      )}
    </div>
  );
};

export default CustomersPage;
