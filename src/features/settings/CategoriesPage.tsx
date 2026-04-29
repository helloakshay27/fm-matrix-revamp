import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { categoryApi } from "@/api/categories";
import { userApi } from "@/api/users";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import type { Category } from "@/types/schemas/ticket";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  default_agent_id: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const CategoryModal = ({
  onClose,
  parentId,
  parentName,
}: {
  onClose: () => void;
  parentId?: string;
  parentName?: string;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: userApi.listAll,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (d: FormData) =>
      categoryApi.create({
        name: d.name,
        parent_id: parentId,
        default_agent_id: d.default_agent_id || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      addToast(
        parentId ? "Sub-category created" : "Category created",
        "success"
      );
      onClose();
    },
    onError: () => addToast("Failed to create category", "error"),
  });

  return (
    <Modal
      title={
        parentId ? `New Sub-category under "${parentName}"` : "New Category"
      }
      onClose={onClose}
      maxWidth="max-w-sm"
    >
      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
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
        {!parentId && (
          <div>
            <label className="form-label">
              Default Agent{" "}
              <span className="font-normal opacity-60">(optional)</span>
            </label>
            <select {...register("default_agent_id")} className="form-select">
              <option value="">— None —</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.name || u.email}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Tickets from a linked email inbox will be auto-assigned to this
              agent.
            </p>
          </div>
        )}
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

const CategoriesPage = () => {
  const [modal, setModal] = useState<{
    parentId?: string;
    parentName?: string;
  } | null>(null);
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const canManage = useAuthStore((s) => s.canManage);

  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoryApi.listAll,
  });

  const deleteMutation = useMutation({
    mutationFn: categoryApi.destroy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      addToast("Category deleted", "success");
    },
    onError: () => addToast("Failed to delete category", "error"),
  });

  const topCategories = categories.filter((c: Category) => !c.parentId);
  const subOf = (parentId: string) =>
    categories.filter((c: Category) => c.parentId === parentId);

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            Categories
          </h1>
          <p
            className="mt-0.5 text-small"
            style={{ color: "var(--text-muted)" }}
          >
            {topCategories.length} categories ·{" "}
            {categories.length - topCategories.length} sub-categories
          </p>
        </div>
        {canManage && (
          <button onClick={() => setModal({})} className="btn-primary">
            + New Category
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
                <th>Type</th>
                <th>Default Agent</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-14 text-center text-small"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No categories yet.
                  </td>
                </tr>
              )}
              {topCategories.map((cat: Category) => (
                <>
                  <tr
                    key={cat.id}
                    style={{ backgroundColor: "var(--stone-10)" }}
                  >
                    <td
                      className="font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {cat.name}
                    </td>
                    <td
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Category
                    </td>
                    <td
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {cat.defaultAgent?.name ?? (
                        <span style={{ opacity: 0.35 }}>—</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        {canManage && (
                          <button
                            onClick={() =>
                              setModal({
                                parentId: cat.id,
                                parentName: cat.name,
                              })
                            }
                            className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                          >
                            + Sub-category
                          </button>
                        )}
                        {canManage && (
                          <button
                            onClick={() => deleteMutation.mutate(cat.id)}
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
                  {subOf(cat.id).map((sub: Category) => (
                    <tr key={sub.id}>
                      <td
                        style={{ color: "var(--text)", paddingLeft: "2.5rem" }}
                      >
                        <span
                          style={{
                            color: "var(--text-muted)",
                            marginRight: "0.5rem",
                          }}
                        >
                          ↳
                        </span>
                        {sub.name}
                      </td>
                      <td
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Sub-category
                      </td>
                      <td></td>
                      <td className="text-right">
                        {canManage && (
                          <button
                            onClick={() => deleteMutation.mutate(sub.id)}
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
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal !== null && (
        <CategoryModal
          onClose={() => setModal(null)}
          parentId={modal.parentId}
          parentName={modal.parentName}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
