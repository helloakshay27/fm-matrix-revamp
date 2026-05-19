import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { issueTypeApi, type CreateIssueTypePayload } from "@/api/issueTypes";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
});
type FormData = z.infer<typeof schema>;

const IssueTypeModal = ({ onClose }: { onClose: () => void }) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (d: CreateIssueTypePayload) => issueTypeApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["issueTypes"] });
      addToast("Issue type created", "success");
      onClose();
    },
    onError: () => addToast("Failed to create issue type", "error"),
  });

  return (
    <Modal title="New Ticket Type" onClose={onClose} maxWidth="max-w-md">
      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="flex flex-col gap-4 px-6 py-5"
      >
        <div>
          <label className="form-label">Name *</label>
          <input {...register("name")} className="form-input" />
          {errors.name && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.name.message}
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
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

const IssueTypesPage = () => {
  const [showNew, setShowNew] = useState(false);
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const canManage = useAuthStore((s) => s.canManage);

  const {
    data: issueTypes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["issueTypes", "all"],
    queryFn: issueTypeApi.listAll,
  });

  const deleteMutation = useMutation({
    mutationFn: issueTypeApi.destroy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["issueTypes"] });
      addToast("Issue type deleted", "success");
    },
    onError: () => addToast("Failed to delete issue type", "error"),
  });

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            Ticket Types
          </h1>
          <p
            className="mt-0.5 text-small"
            style={{ color: "var(--text-muted)" }}
          >
            {issueTypes.length} total
          </p>
        </div>
        {canManage && (
          <button onClick={() => setShowNew(true)} className="btn-primary">
            + New Ticket Type
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
                <th>Description</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issueTypes.map((it) => (
                <tr key={it.id}>
                  <td className="font-medium" style={{ color: "var(--text)" }}>
                    {it.name}
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>
                    {it.description ?? <span style={{ opacity: 0.35 }}>—</span>}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={
                        it.active
                          ? {
                              backgroundColor: "var(--forest-10)",
                              color: "var(--forest)",
                            }
                          : {
                              backgroundColor: "var(--stone-10)",
                              color: "var(--stone)",
                            }
                      }
                    >
                      {it.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-right">
                    {canManage && (
                      <button
                        onClick={() => deleteMutation.mutate(it.id)}
                        disabled={deleteMutation.isPending}
                        className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                        style={{ color: "var(--crimson)" }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {issueTypes.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-14 text-center text-small"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No issue types yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showNew && <IssueTypeModal onClose={() => setShowNew(false)} />}
    </div>
  );
};

export default IssueTypesPage;
