import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  escalationPolicyApi,
  type EscalationPolicy,
} from "@/api/escalationPolicies";
import { categoryApi } from "@/api/categories";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";

const PRIORITIES = [
  { value: "", label: "All priorities" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const ESCALATE_TO = [
  { value: "", label: "No reassignment" },
  { value: "assigned_agent", label: "Assigned agent (keep + log)" },
  { value: "supervisor", label: "First available supervisor" },
  { value: "org_admin", label: "First available org admin" },
];

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255),
    category_id: z.string().optional(),
    priority: z.string().optional(),
    response_time_hours: z.coerce.number().min(0).optional().or(z.literal("")),
    resolution_time_hours: z.coerce
      .number()
      .min(0)
      .optional()
      .or(z.literal("")),
    escalate_response_to: z.string().optional(),
    escalate_resolution_to: z.string().optional(),
    active: z.boolean(),
  })
  .refine(
    (d) =>
      (d.response_time_hours !== "" &&
        d.response_time_hours !== undefined &&
        +d.response_time_hours > 0) ||
      (d.resolution_time_hours !== "" &&
        d.resolution_time_hours !== undefined &&
        +d.resolution_time_hours > 0),
    {
      message: "At least one of Response time or Resolution time must be set",
      path: ["response_time_hours"],
    }
  );

type FormData = z.infer<typeof formSchema>;

const hoursToMinutes = (h: string | number | undefined) =>
  h !== "" && h !== undefined && +h > 0 ? Math.round(+h * 60) : null;

const minutesToHours = (m: number | null | undefined) =>
  m ? +(m / 60).toFixed(2) : undefined;

const formatTime = (minutes: number | null | undefined) => {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes}m`;
  const h = minutes / 60;
  return h % 1 === 0 ? `${h}h` : `${h.toFixed(1)}h`;
};

const PolicyModal = ({
  onClose,
  existing,
}: {
  onClose: () => void;
  existing?: EscalationPolicy;
}) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const isEdit = !!existing;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.listAll,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existing?.name ?? "",
      category_id: existing?.category?.id ?? "",
      priority: existing?.priority ?? "",
      response_time_hours: minutesToHours(existing?.responseTimeMinutes),
      resolution_time_hours: minutesToHours(existing?.resolutionTimeMinutes),
      escalate_response_to: existing?.escalateResponseTo ?? "",
      escalate_resolution_to: existing?.escalateResolutionTo ?? "",
      active: existing?.active ?? true,
    },
  });

  const buildPayload = (d: FormData) => ({
    name: d.name,
    category_id: d.category_id || null,
    priority: d.priority || null,
    response_time_minutes: hoursToMinutes(d.response_time_hours),
    resolution_time_minutes: hoursToMinutes(d.resolution_time_hours),
    escalate_response_to: d.escalate_response_to || null,
    escalate_resolution_to: d.escalate_resolution_to || null,
    active: d.active,
  });

  const createMutation = useMutation({
    mutationFn: (d: FormData) => escalationPolicyApi.create(buildPayload(d)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["escalationPolicies"] });
      addToast("Policy created", "success");
      onClose();
    },
    onError: () => addToast("Failed to create policy", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (d: FormData) =>
      escalationPolicyApi.update(existing!.id, buildPayload(d)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["escalationPolicies"] });
      addToast("Policy updated", "success");
      onClose();
    },
    onError: () => addToast("Failed to update policy", "error"),
  });

  const onSubmit: SubmitHandler<FormData> = (d) =>
    isEdit ? updateMutation.mutate(d) : createMutation.mutate(d);
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={isEdit ? `Edit — ${existing!.name}` : "New Escalation Policy"}
      onClose={onClose}
      maxWidth="max-w-xl"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-6 py-5"
      >
        <div>
          <label className="form-label">Policy Name *</label>
          <input
            {...register("name")}
            className="form-input"
            autoFocus
            placeholder="e.g. Billing — Critical"
          />
          {errors.name && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Category{" "}
              <span className="font-normal opacity-60">(blank = all)</span>
            </label>
            <select {...register("category_id")} className="form-select">
              <option value="">All categories</option>
              {categories
                .filter((c) => !c.parentId)
                .map((parent) => (
                  <optgroup key={parent.id} label={parent.name}>
                    <option value={parent.id}>{parent.name}</option>
                    {categories
                      .filter((c) => c.parentId === parent.id)
                      .map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          ↳ {sub.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
            </select>
          </div>
          <div>
            <label className="form-label">
              Priority{" "}
              <span className="font-normal opacity-60">(blank = all)</span>
            </label>
            <select {...register("priority")} className="form-select">
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2" style={{ borderTop: "1px solid var(--border)" }}>
          <p
            className="mb-3 text-label uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            SLA Thresholds
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                First Response Within (hours)
              </label>
              <input
                {...register("response_time_hours")}
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                placeholder="e.g. 1"
              />
            </div>
            <div>
              <label className="form-label">Resolution Within (hours)</label>
              <input
                {...register("resolution_time_hours")}
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                placeholder="e.g. 24"
              />
            </div>
          </div>
          {errors.response_time_hours && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.response_time_hours.message}
            </p>
          )}
        </div>

        <div className="pt-2" style={{ borderTop: "1px solid var(--border)" }}>
          <p
            className="mb-3 text-label uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            On Breach — Escalate To
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">When Response SLA Breached</label>
              <select
                {...register("escalate_response_to")}
                className="form-select"
              >
                {ESCALATE_TO.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">When Resolution SLA Breached</label>
              <select
                {...register("escalate_resolution_to")}
                className="form-select"
              >
                {ESCALATE_TO.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input {...register("active")} type="checkbox" className="rounded" />
          <span className="form-label" style={{ margin: 0 }}>
            Active
          </span>
        </label>

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

const EscalationPoliciesPage = () => {
  const [modal, setModal] = useState<{
    open: boolean;
    policy?: EscalationPolicy;
  }>({ open: false });
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const canManage = useAuthStore((s) => s.canManage);

  const {
    data: policies = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["escalationPolicies"],
    queryFn: escalationPolicyApi.listAll,
  });

  const deleteMutation = useMutation({
    mutationFn: escalationPolicyApi.destroy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["escalationPolicies"] });
      addToast("Policy deleted", "success");
    },
    onError: () => addToast("Failed to delete policy", "error"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      escalationPolicyApi.update(id, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["escalationPolicies"] }),
    onError: () => addToast("Failed to update policy", "error"),
  });

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            Escalation Policies
          </h1>
          <p
            className="mt-0.5 text-small"
            style={{ color: "var(--text-muted)" }}
          >
            Set response &amp; resolution SLA thresholds per category. Tickets
            that breach these thresholds are automatically escalated.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setModal({ open: true })}
            className="btn-primary"
          >
            + New Policy
          </button>
        )}
      </div>

      {/* How it works */}
      <div
        className="mb-5 rounded-xl px-5 py-4 text-xs leading-relaxed"
        style={{
          backgroundColor: "var(--amber-10)",
          color: "var(--text-muted)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>
          How escalation works
        </p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>
            When a ticket is created, its category and priority are matched
            against the most specific active policy.
          </li>
          <li>
            SLA due dates are set automatically (
            <em>response within X hours</em>, <em>resolve within Y hours</em>).
          </li>
          <li>
            Run{" "}
            <code
              className="font-mono px-1 rounded"
              style={{ backgroundColor: "var(--bg-white)" }}
            >
              rails escalation:check_loop
            </code>{" "}
            or{" "}
            <code
              className="font-mono px-1 rounded"
              style={{ backgroundColor: "var(--bg-white)" }}
            >
              :check
            </code>{" "}
            once to scan for breaches.
          </li>
          <li>
            On breach: escalation level increments, ticket is reassigned to the
            configured target, and an activity log entry is recorded.
          </li>
        </ul>
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
                <th>Policy</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Response SLA</th>
                <th>Resolution SLA</th>
                <th>On Breach</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-14 text-center text-small"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No escalation policies yet.
                  </td>
                </tr>
              )}
              {policies.map((p) => (
                <tr key={p.id} style={!p.active ? { opacity: 0.5 } : undefined}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: p.active
                            ? "var(--forest)"
                            : "var(--stone)",
                        }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    {p.category ? (
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "var(--coral-10)",
                          color: "var(--coral)",
                        }}
                      >
                        {p.category.name}
                      </span>
                    ) : (
                      <span
                        className="text-xs italic"
                        style={{ opacity: 0.4, color: "var(--text-muted)" }}
                      >
                        All
                      </span>
                    )}
                  </td>
                  <td
                    className="capitalize"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {p.priority ?? (
                      <span className="text-xs italic" style={{ opacity: 0.4 }}>
                        All
                      </span>
                    )}
                  </td>
                  <td
                    className="font-mono text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {formatTime(p.responseTimeMinutes)}
                  </td>
                  <td
                    className="font-mono text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {formatTime(p.resolutionTimeMinutes)}
                  </td>
                  <td
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {[
                      p.escalateResponseTo &&
                        `Resp → ${p.escalateResponseTo.replace("_", " ")}`,
                      p.escalateResolutionTo &&
                        `Res → ${p.escalateResolutionTo.replace("_", " ")}`,
                    ]
                      .filter(Boolean)
                      .join("  |  ") || (
                      <span style={{ opacity: 0.4 }}>Log only</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      {canManage && (
                        <button
                          onClick={() =>
                            toggleMutation.mutate({
                              id: p.id,
                              active: !p.active,
                            })
                          }
                          className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                        >
                          {p.active ? "Disable" : "Enable"}
                        </button>
                      )}
                      {canManage && (
                        <button
                          onClick={() => setModal({ open: true, policy: p })}
                          className="btn-ghost !h-auto !py-1 !px-2 text-xs"
                        >
                          Edit
                        </button>
                      )}
                      {canManage && (
                        <button
                          onClick={() => {
                            if (confirm("Delete this policy?"))
                              deleteMutation.mutate(p.id);
                          }}
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
        <PolicyModal
          onClose={() => setModal({ open: false })}
          existing={modal.policy}
        />
      )}
    </div>
  );
};

export default EscalationPoliciesPage;
